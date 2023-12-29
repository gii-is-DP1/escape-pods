import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import "../static/css/game/game.css";
import scrap from "../static/images/scrap.png";
import Board from "../static/images/escape-pods-board-horizontal.jpg"
import { Link } from 'react-router-dom';
import { move } from "react-big-calendar";
import itemGetters from "./itemGetters";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { IoIosFlask } from "react-icons/io";
import { ImShield } from "react-icons/im";


export default function Game() {
    const [roles, setRoles] = useState([]);
    const [myPlayer, setMyPlayer] = useState({})
    const [game, setGame] = useState({});
    const [players, setPlayers] = useState([]);

    //entidades de la partida
    const [sectors, setSectors] = useState([]);
    const [beacons, setBeacons] = useState([]);
    const [lines, setLines] = useState([]);
    const [gamePlayers, setGamePlayers] = useState([]);
    const [pods, setPods] = useState([]);
    const [crewmates, setCrewmates] = useState([]);
    const [shelterCards, setShelterCards] = useState([]);
    const [slotInfos, setSlotInfos] = useState([]);
    const [piloting, setPiloting] = useState(false);
    const [embarking, setEmbarking] = useState(false);
    const [selectingSector, setSelectingSector] = useState(false);
    const [selectedSector, setSelectedSector] = useState({});
    const [selectedPod, setSelectedPod] = useState({});
    const [selectingPod, setSelectingPod] = useState(false);
    const [selectedCrewmate, setSelectedCrewmate] = useState({});
    const [selectingCrewmate, setSelectingCrewmate] = useState(false);
    const [selectingShelterCard, setSelectingShelterCard] = useState(false);
    const [selectedShelterCard, setSelectedShelterCard] = useState({});
    const [spying, setSpying] = useState(false);

    const [remotePiloting, setRemotePiloting] = useState(false)
    const [podjacking, setPodJacking] = useState(false)

    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const gameId = parseInt(window.location.href.split("/")[4]) // extrae la id de la partida desde la ruta spliteandola por las / en un array, cuidado que el indice del array que devuelve el split no empieza en [0] sino en [1] por algu motivo ([-1] tampoco funciona)

    const adjacencyList = [
        [1, 2, 3], //para el valor de 'sector' null
        [2, 4, 5], //sector 1
        [1, 3, 5], //sector 2
        [2, 5, 6], //sector 3
        [1, 5, 7, 8], //sector 4
        [1, 2, 3, 4, 6, 8], //sector 5
        [2, 3, 5, 8, 9], //sector 6
        [4, 8, 10, 11], //sector 7
        [4, 5, 6, 7, 9, 10], //sector 8
        [6, 8, 10, 13], //sector 9
        [7, 8, 9, 11, 12, 13], //sector 10
        [7, 10, 12], //sector 11
        [11, 10, 13], //sector 12
        [9, 10, 12], //sector 13
    ]

    const x = [null, 158, 88, 155,
        283, 216, 283,
        411, 344, 411,
        472,
        539, 600, 539]

    const y = [null, 92, 199, 310,
        92, 199, 310,
        92, 199, 310,
        199,
        92, 199, 310]

    const hangarX = [-30, 30, 30, -10, -15, 25] //coordenadas X del hangar para [pod3, pod21, pod22, pod11, pod12, pod13]
    const hangarY = [199, 92, 310, -10, 410, 410] // coordenadas Y del hangar para [pod3, pod21, pod22, pod11, pod12, pod13]

    const pod3SlotsX = [46, 12, 12] //coordenadas X de los slots del pod de capacidad 3
    const pod3SlotsY = [32, 12, 50] //coordenadas Y de los slots del pod de capacidad 3

    const pod2SlotsX = [47, 9] //coordenadas X de los slots del pod de capacidad 2
    const pod2SlotsY = [32, 32] //coordenadas Y de los slots del pod de capacidad 2

    const pod1SlotsX = 30 //coordenadas X de los slots del pod de capacidad 1
    const pod1SlotsY = 32 //coordenadas Y de los slots del pod de capacidad 1

    const shelterScoringSlotsX = [7, 41, 75.5, 110, 144] //coordenadas X de los slots del shelter
    const shelterScoringSlotsY = [97, 97, 97, 97, 97] //coordenadas Y de los slots del shelter

    const shelterEmbarkingSlotsX = [8, 42, 76.5, 111, 145] //coordenadas X de los slots del shelter
    const shelterEmbarkingSlotsY = [-14.5, -14.5, -14.5, -14.5, -14.5] //coordenadas Y de los slots del shelter

    const embarkSectorsNumbers = [1, 2, 3]

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer();
            GetGame();
            //            refresher();
        }
    }, [jwt])

    function refresher() {
        let intervalID = setInterval(() => {
            GetGame();
        }, 2500);
        return () => {
            clearInterval(intervalID);
        };
    }

    function GetCurrentPlayer() {
        fetch("/api/v1/players?username=" + myUsername, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
            .then(response => response.json())
            .then(response => { setMyPlayer(response[0]) })
    }

    async function GetGame() {
        const currentGame = await fetchCurrentGame();
        setGame(currentGame);
        setPods(await itemGetters.fetchPods(currentGame.id, jwt));
        setCrewmates(await itemGetters.fetchCrewmates(currentGame.id, jwt));
        setSectors(await itemGetters.fetchSectors(currentGame.id, jwt));
        setBeacons(await itemGetters.fetchBeacons(currentGame.id, jwt));
        setLines(await itemGetters.fetchLines(currentGame.id, jwt));
        setGamePlayers(await itemGetters.fetchGamePlayers(currentGame.id, jwt));
        setShelterCards(await itemGetters.fetchShelterCards(currentGame.id, jwt));
        setSlotInfos(await itemGetters.fetchSlotInfos(currentGame.id, jwt));
    }

    function GetCrewmatesFromPod(pod) {
        return crewmates.filter(crewmate => crewmate.pod && crewmate.pod.number === pod.number)
    }

    function GetCrewmatesFromShelter(shelterCard) {
        return crewmates.filter(crewmate => crewmate.shelterCard && crewmate.shelterCard.id === shelterCard.id)
    }

    async function fetchCurrentGame() {
        const response = await fetch(`/api/v1/games/${gameId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedGame = await response.json();
        return fetchedGame
    }

    function Sector(props) {
        if (props.sector === undefined || emptyChecker("array", pods)) {
            return null
        }
        return (
            <div style={{ width: 100, height: 100, position: "absolute", left: props.x, top: props.y }}
                onClick={() => {
                    console.log(props.sector)
                    if (selectingSector) {
                        sectorClickHandler(props.sector)
                    }
                }}>
                {pods.map((pod, index) => (
                    <div key={index}>
                        {pod.sector && pod.sector.number === props.sector.number &&
                            <Pod pod={pod} />
                        }
                    </div>
                ))}
                {props.sector.scrap &&
                    <img src={scrap} maxWidth={100} maxHeight={100} />
                }
                {/* 
                <Button style={{ border: "none", opacity: 0, width: 100, height: 100, borderRadius: 50, boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s" }}>
                    {props.sector.number}
                </Button>
                */}
            </div>
        )
    }

    function Pod(props) {
        if (emptyChecker("object", props.pod) || emptyChecker("array", crewmates)) {
            return null
        }
        return (
            <div className={props.pod.capacity === 3 ? "pod3" : props.pod.capacity === 2 ? "pod2" : "pod1"} style={props.pod.sector === null ? { left: hangarX[props.pod.number - 1], top: hangarY[props.pod.number - 1] } : null}
                onClick={() => {
                    console.log(props.pod)
                    if (selectingPod) {
                        podClickHandler(props.pod)
                    }
                }}
            >
                {/*
                <CrewmateSlots capacity={props.pod.capacity} crewmates={GetCrewmatesFromPod(props.pod)} />
                */}
                {GetCrewmatesFromPod(props.pod).map((crewmate, index) => (
                    <div key={index} style={{
                        position: "absolute",
                        left: props.pod.capacity === 3 ? pod3SlotsX[index] : props.pod.capacity === 2 ? pod2SlotsX[index] : pod1SlotsX,
                        top: props.pod.capacity === 3 ? pod3SlotsY[index] : props.pod.capacity === 2 ? pod2SlotsY[index] : pod1SlotsY
                    }} >
                        <Crewmate crewmate={crewmate} />
                    </div>
                ))}
            </div>
        )
    }

    function Crewmate(props) {
        if (emptyChecker("array", gamePlayers)) {
            return null
        }
        return (
            <svg height="37" width="37" onClick={() => {
                if (selectingCrewmate && !props.crewmate.shelter) {
                    crewmateClickHandler(props.crewmate)
                }
            }}>
                <circle
                    cx={props.size === "s" ? "14.5" : "18.5"}
                    cy={props.size === "s" ? "14.5" : "18.5"}
                    r={props.size === "s" ? "14" : "18"}
                    stroke={props.crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={props.crewmate.color}>
                </circle>
                {(gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === props.crewmate.player.id || spying) && // condicion incompleta, solo debe enseñar los crewmate de un pod o refugio conreto
                    <foreignObject
                        x={props.size === "s" ? "6.5" : "10"}
                        y={props.size === "s" ? "1.5" : "5"}
                        width="20" height="30"
                    >
                        {props.crewmate.role === "ENGINEER" &&
                            <HiMiniWrenchScrewdriver color={props.crewmate.color !== "BLACK" ? "black" : "white"} />
                        }
                        {props.crewmate.role === "SCIENTIST" &&
                            <IoIosFlask color={props.crewmate.color !== "BLACK" ? "black" : "white"} />
                        }
                        {props.crewmate.role === "CAPTAIN" &&
                            <ImShield color={props.crewmate.color !== "BLACK" ? "black" : "white"} />
                        }
                    </foreignObject>
                }
            </svg>
        )
    }

    function UnusedCrewmates() {
        if (emptyChecker("array", crewmates) || emptyChecker("array", gamePlayers)) {
            return null
        }
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id && crewmate.role === "ENGINEER" && !crewmate.pod && !crewmate.shelterCard)
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id && crewmate.role === "SCIENTIST" && !crewmate.pod && !crewmate.shelterCard)
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id && crewmate.role === "CAPTAIN" && !crewmate.pod && !crewmate.shelterCard)
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))}
                </div>
            </div>
        )
    }

    function ShelterCard(props) {
        if (emptyChecker("array", shelterCards) || emptyChecker("array", slotInfos)) {
            return null
        }
        return (
            <div className={"shelter-horizontal"} onClick={() => {
                if (selectingShelterCard) {
                    shelterClickHandler(props.shelterCard)
                }
            }}>
                {GetCrewmatesFromShelter(props.shelterCard).map((crewmate, index) => (
                    <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[index], top: shelterEmbarkingSlotsY[index] }}>
                        <Crewmate crewmate={crewmate} size="s" />
                    </div>
                ))}
                {slotInfos.filter(slotInfo => slotInfo.shelter.id === props.shelterCard.id).map((slotInfo, index) => (
                    <div key={index} style={{ position: "absolute", left: shelterEmbarkingSlotsX[index], top: shelterEmbarkingSlotsY[index] + 107 }}>
                        <p style={{ color: "black", fontSize: 9, position: "absolute", left: 22 }}>
                            {slotInfo.slotScore}
                        </p>
                        {slotInfo.role === "ENGINEER" &&
                            <HiMiniWrenchScrewdriver color="white" style={{ position: "absolute", top: 11, left: 5 }} />
                        }
                        {slotInfo.role === "SCIENTIST" &&
                            <IoIosFlask color="white" style={{ position: "absolute", top: 11, left: 5 }} />
                        }
                        {slotInfo.role === "CAPTAIN" &&
                            <ImShield color="white" style={{ position: "absolute", top: 11, left: 5 }} />
                        }
                    </div>
                ))}
            </div>
        )
    }

    async function movePod(pod, sector) {
        console.log("fetch pod" + pod)
        console.log("fetch sector" + sector)
        const movedPod = {
            emptySlots: pod.emptySlots,
            capacity: pod.capacity,
            number: pod.number,
            sector: sector,
            game: game

        }
        await fetch(`/api/v1/pods/${pod.id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(movedPod)
        })
    }

    async function moveCrewmate(crewmate, pod, shelterCard) {
        const movedCrewmate = {
            color: crewmate.color,
            role: crewmate.role,
            player: crewmate.player,
            shelterCard: shelterCard ? shelterCard : crewmate.shelterCard,
            pod: pod ? pod : null,  // si se pasa un pod se mueve al pod, el unico caso en el que se mueve un crewmate sin pasar un pod es para subir a un refugio, asi que se baja del pod
            game: game
        }
        await fetch(`/api/v1/crewmates/${crewmate.id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(movedCrewmate)
        })
    }


    function emptyChecker(type, a) { //comprueba si el elemento a de tipo type está vacío
        if (type === "array") {
            const copy = a
            return JSON.stringify(copy) === "[]" ? true : false
        } else if (type === "object") {
            const copy = a
            return JSON.stringify(copy) === "{}" ? true : false
        }
    }


    function sectorClickHandler(sector) {
        refresher()
        setSelectedSector(sector)
        if ((piloting || remotePiloting) && selectingSector) {
            if ((!selectedPod.sector && adjacencyList[0].includes(sector.number)) || (selectedPod.sector && adjacencyList[selectedPod.sector.number].includes(sector.number))) {

                if (sector.scrap) {

                    alert('HAY CHATARRA NE EL SECTOR AL QUE QUIERES ACCEDER, ELIGE OTRO')



                } else if (pods.find(pod => pod.sector && (pod.sector.id === sector.id)) && (pods.find(pod => pod.sector && (pod.sector.id === sector.id)).capacity >= selectedPod.capacity)) {

                    alert('NO PUEDES MOVER EL POD, HAY UNO MAS GRANDE EN EL SECTOR AL QUE ESTA LLENDO,selecciona otro')

                } else if (!pods.find(pod => pod.sector && (pod.sector.id === sector.id))) {

                    alert('al no haber obstaculos en el cmanino se movera el pod al sector indicado')
                    movePod(selectedPod, sector)
                    setSelectingSector(false)
                    setSelectingPod(false)
                    setPiloting(false)
                    setRemotePiloting(false)

                } else {
                    //se administra primero el movimiento del pod 'original' 
                    alert('has chocado un pod, elige a donde se dirigira el pod chocado')
                    console.log(pods.find(pod => pod.sector && (pod.sector.id === sector.id)))

                    let crashedPod = pods.find(pod => pod.sector && (pod.sector.id === sector.id))
                    //let originalSector = sector

                    movePod(crashedPod, null)
                    movePod(selectedPod, sector)

                    setSelectedPod(crashedPod)
                    setSelectingPod(false)


                }
            } else {
                alert('NO PUEDES MOVER UN POD A UN SECTOR NO ADYACENTE A SU UBICACION INICIAL')
            }

        } else if (embarking) {
            if (sector.number === 1 || sector.number === 2 || sector.number === 3) {
                movePod(selectedPod, sector)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setEmbarking(false)
                setSelectingSector(false)
            } else {
                alert('NO PUEDES MOVER UN POD D 1 A OTRA MOVIDA NO ADYACENTE')
            }

        }
    }

    function podClickHandler(pod) {
        setSelectedPod(pod)

        if (piloting) {

            if (GetCrewmatesFromPod(pod).find(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id)) {
                setSelectingPod(false)
                setSelectingSector(true)
                alert(`HAS SELECCIONADO UN POD, ELIGE DONDE SE DIRIGIRA ESTE`)
            } else {
                alert('NO PUEDES SELECCIONAR UN POD QUE NO CONTENGA CREWMATES TUYOS PARA PILOTAR, SELECCIONA OTRA')

            }
        } else if (embarking) {
            if ((embarkSectorsNumbers.includes(pod.sector ? pod.sector.number : '') || !pod.sector) && (pod && GetCrewmatesFromPod(pod).length < pod.capacity)) {
                moveCrewmate(selectedCrewmate, pod, null)
                setSelectingCrewmate(false)
                setSelectingPod(false)
                alert(' se ha movido el crewmate al pod selecionado')
                setSelectedCrewmate(null)
                console.log(pods)
                if (!pod.sector) {
                    if (pod.number === 1 && (pods.filter(pod => pod.sector && pod.sector.number === 2).length === 0)) {
                        movePod(pod, sectors.find(sector => sector.number === 2));
                        setEmbarking(false)
                    } else if (pod.number === 2 && (pods.filter(pod => pod.sector && pod.sector.number === 1).length === 0)) {
                        movePod(pod, sectors.find(sector => sector.number === 1));
                        setEmbarking(false)
                    } else if (pod.number === 3 && (pods.filter(pod => pod.sector && pod.sector.number === 3).length === 0)) {
                        movePod(pod, sectors.find(sector => sector.number === 3));
                        setEmbarking(false)
                    } else {
                        alert('Select one of the adjacent sectors to the hangar')
                        setSelectingSector(true);
                    }
                }


            } else if ((selectedCrewmate.pod && adjacencyList[selectedCrewmate.pod.sector.number].includes(pod.sector.number)) && (pod && GetCrewmatesFromPod(pod).length < pod.capacity)) {
                alert('el crewmate ha sido cambiado al nuevo pod')
                moveCrewmate(selectedCrewmate, pod, null)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setEmbarking(false)
                setSelectedCrewmate(null)
            } else {
                setSelectingCrewmate(false)
                setSelectingPod(false)
                setEmbarking(false)

                alert(`You cannot move your ${selectedCrewmate.role} to a not valid pod`)
            }

        } else if (remotePiloting) {
            if (GetCrewmatesFromPod(pod).length !== 0) {
                setSelectingPod(false)
                setSelectingSector(true)
                alert(`HAS SELECCIONADO UN POD, ELIGE DONDE SE DIRIGIRA ESTE`)
            }
        }
    }

    function crewmateClickHandler(crewmate) {
        refresher()
        console.log(selectedCrewmate)
        if (embarking) {
            setSelectedCrewmate(crewmate)
            if (crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id) {
                setSelectingPod(true)
                //permite ue solo se active el selectinghelterCard cuando es posible usarlo 
                //if([11,12,13].includes(crewmate.pod ? (crewmate.pod.sector? crewmate.pod.sector.number :'' ): '')){}
                setSelectingShelterCard(true)
                alert("Click on any pod or shelter to move the crewmate")
            } else {
                alert('clica en un crewmate de tu color')
            }
        } else if (podjacking) {
            console.log(!selectedCrewmate.id)
            if (!selectedCrewmate.id) {
                //con la imosicion de un orden estamos obligando a que siempre se use para el intercambio un crewmate del jugador que realiza la accion
                if (crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id) {
                    setSelectedCrewmate(crewmate)

                    alert('selecciona el crewmate que quieres intercambiar')
                } else {
                    alert('TIENES QUE ELEGIR PRIMERO A TU TRIPULANTE')
                }
            } else if (selectedCrewmate.id) {
                console.log((!selectedCrewmate.pod && crewmate.pod) && embarkSectorsNumbers.includes(crewmate.pod.sector.number))



                //que el crewmate nuevo no sea tuyo y que el estado contenga ya un crewmate del jugador q realiza la acion
                if ((crewmate.player.id !== gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id) && (selectedCrewmate && selectedCrewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id)) {
                    let changedCrewmate = crewmate

                    //intercambio entre 2 pods
                    if (selectedCrewmate.pod && (crewmate.pod && adjacencyList[selectedCrewmate.pod.sector.number].includes(crewmate.pod.sector.number))) {

                        alert(' se intercambiaran los crewmates de lugar')
                        moveCrewmate(selectedCrewmate, null, null)
                        moveCrewmate(changedCrewmate, selectedCrewmate.pod, null)
                        moveCrewmate(selectedCrewmate, crewmate.pod)

                        //intercambio pod a hangar
                    } else if ((!selectedCrewmate.pod && crewmate.pod) && embarkSectorsNumbers.includes(crewmate.pod.sector.number)) {
                        moveCrewmate(changedCrewmate, null, null)
                        moveCrewmate(selectedCrewmate, crewmate.pod)
                        alert(' se ha puesto el crewmate en su lugar y el otro ha sido devuelto a la reserva')

                    } else {
                        alert('NO SE QUE ESTAS INTETANDO HACER, PERO NO SE PUEDE')
                    }
                } else {
                    alert('PARA CAMBIAR 2 DE TUS TRIPULANTES SELECCIONA EMBARCAR/DESEMBARCAR')
                }

            }
        }
    }

    function shelterClickHandler(shelterCard) {
        setSelectedShelterCard(shelterCard)
        if (embarking) {
            if (selectedCrewmate.pod.sector.number === 11 && shelterCard.sector.number === 11) {
                moveCrewmate(selectedCrewmate, null, shelterCard)

            } else if (selectedCrewmate.pod.sector.number === 12 && shelterCard.sector.number === 12) {
                moveCrewmate(selectedCrewmate, null, shelterCard)

            } else if (selectedCrewmate.pod.sector.number === 13 && shelterCard.sector.number === 13) {
                moveCrewmate(selectedCrewmate, null, shelterCard)

            } else {
                alert('NO PUEDES DESEMBARCAR A UN TRIPULATE SI NO ESTAS EN UN SECTOR COLINDATE AL REFUGIO SELECCIONADO')

            }
            setSelectingPod(false)
            setSelectingCrewmate(false)
            setSelectingShelterCard(false)
            setEmbarking(false)
            setSelectedCrewmate(null)

        }

    }

    return (
        <>

            {!emptyChecker("array", sectors) &&
                <div className="game-page-container">

                    <div className="game-board">
                        {sectors.map((sector, index) => (
                            <div key={index}>
                                <Sector x={x[sector.number]} y={y[sector.number]} sector={sector} />
                            </div>
                        ))}
                        {pods.map((pod, index) => (
                            <div key={index}>
                                {pod.sector === null &&
                                    <Pod pod={pod} crewmates={GetCrewmatesFromPod(pod)} />
                                }
                            </div>
                        ))}
                    </div>
                    <div style={{ height: "100%", width: "300px", position: "absolute", left: 650 }}>
                        <div style={{ position: "absolute", top: 90, height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.find(res => res.sector.number === 11)} />
                        </div>
                        <div style={{ position: "absolute", top: 245, left: 60, height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.filter(res => res.sector.number === 12)[0]} />
                        </div>
                        <div style={{ position: "absolute", top: 405, left: 60, height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.filter(res => res.sector.number === 12)[1]} />
                        </div>
                        <div style={{ position: "absolute", top: 565, height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.find(res => res.sector.number === 13)} />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: 710, marginTop: 70, height: "100%", alignContent: "center", alignItems: "center" }}>
                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20
                        }} onClick={() => {
                            setPiloting(prevPiloting => !prevPiloting);
                            setSelectingPod(prevSelectingPod => !prevSelectingPod);
                            alert("Click on any pod to pilot it")
                            console.log(piloting)
                        }}>
                            PILOTAR
                        </Button>

                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20
                        }} onClick={() => {
                            setRemotePiloting(prevRemotePiloting => !prevRemotePiloting);
                            setSelectingPod(prevSelectingPod => !prevSelectingPod);
                            alert("Click on any pod to pilot it")
                            console.log(remotePiloting)
                        }}>
                            PILOTAR REMOTAMENTE
                        </Button>

                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20
                        }} onClick={() => {
                            setEmbarking(prevEmbarking => !prevEmbarking);
                            setSelectingCrewmate(prevSelectingCrewmate => !prevSelectingCrewmate);
                            alert("Click on any of your crewmates")
                            console.log(embarking)
                        }}>
                            EMBARCAR/DESEMBARCAR
                        </Button>

                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20
                        }} onClick={() => {
                            setPodJacking(prevPodJacking => !prevPodJacking);
                            setSelectingCrewmate(prevSelectingCrewmate => !prevSelectingCrewmate);
                            alert("Click on any of your crewmates")
                            console.log(podjacking)
                        }}>
                            ABORDAR
                        </Button>

                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20
                        }} onClick={() => {
                            setSpying(true);
                            setTimeout(() => {
                                setSpying(false);
                            }, 5000);

                        }}>
                            ESPIAR
                        </Button>
                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20
                        }} onClick={() => {
                            GetGame()
                        }}>
                            Recargar
                        </Button>
                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20
                        }} onClick={() => {
                            console.log(sectors)
                            console.log(beacons)
                            console.log(lines)
                            console.log(gamePlayers)
                            console.log(pods)
                            console.log(crewmates)
                            console.log(shelterCards)
                            console.log(slotInfos)
                            console.log(GetCrewmatesFromPod(pods.find(pod => pod.number === 1), crewmates))
                            console.log(gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color)
                            console.log(gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id))
                            console.log(piloting)
                            console.log(selectedPod)
                            console.log(selectedSector)
                            console.log(selectingSector)
                        }}>
                            troncos
                        </Button>
                        {!emptyChecker("array", crewmates) &&
                            <UnusedCrewmates />
                        }
                    </div>
                </div >
            }
        </>

    );

}