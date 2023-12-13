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

    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const gameId = parseInt(window.location.href.split("/")[4]) // extrae la id de la partida desde la ruta spliteandola por las / en un array, cuidado que el indice del array que devuelve el split no empieza en [0] sino en [1] por algu motivo ([-1] tampoco funciona)

    const adjacencyList = [
        null, //no hay sector 0
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
        [11, 10, 12], //sector 12
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
                {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === props.crewmate.player.id &&
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
        if (emptyChecker("array", shelterCards)) {
            return null
        }
        return (
            <div className={"shelter-horizontal"} onClick={() => {
                if (selectingShelterCard) {
                    shelterClickHandler(props.shelterCard)
                }
            }}>
                {console.log(props.shelterCard)}
                {console.log(GetCrewmatesFromShelter(props.shelterCard))}
                {GetCrewmatesFromShelter(props.shelterCard).map((crewmate, index) => (
                    <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[index], top: shelterEmbarkingSlotsY[index] }}>
                        <Crewmate crewmate={crewmate} size="s" />
                    </div>
                ))}
                {/* 
                <div style={{ position: "absolute", left: shelterScoringSlotsX[0], top: shelterScoringSlotsY[0] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterScoringSlotsX[1], top: shelterScoringSlotsY[0] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterScoringSlotsX[2], top: shelterScoringSlotsY[0] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterScoringSlotsX[3], top: shelterScoringSlotsY[0] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterScoringSlotsX[4], top: shelterScoringSlotsY[0] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[0], top: shelterEmbarkingSlotsY[0] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[1], top: shelterEmbarkingSlotsY[1] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[2], top: shelterEmbarkingSlotsY[2] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[3], top: shelterEmbarkingSlotsY[3] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[4], top: shelterEmbarkingSlotsY[4] }}>
                    <Crewmate crewmate={crewmates[0]} size="s" />
                </div>
                */}
            </div>
        )
    }

    async function movePodDemo(pod, sector) {
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

    async function moveCrewmateDemo(crewmate, pod, shelterCard) {
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
        setSelectedSector(sector)
        if (piloting && selectingSector) {
            console.log(selectedSector)
            movePodDemo(selectedPod, sector)
            setSelectingSector(false)
            setSelectingPod(false)
            setPiloting(false)
        }
    }

    function podClickHandler(pod) {
        setSelectedPod(pod)
        if (piloting) {
            setSelectingSector(true)
            alert("Click on any adjacent sector to move the pod")
        } else if (embarking) {
            moveCrewmateDemo(selectedCrewmate, pod, null)
            setSelectingPod(false)
            setSelectingCrewmate(false)
            setEmbarking(false)
        }
    }

    function crewmateClickHandler(crewmate) {
        setSelectedCrewmate(crewmate)
        if (embarking) {
            setSelectingPod(true)
            setSelectingShelterCard(true)
            alert("Click on any pod or shelter to move the crewmate")
        }
    }

    function shelterClickHandler(shelterCard) {
        setSelectedShelterCard(shelterCard)
        if (embarking) {
            moveCrewmateDemo(selectedCrewmate, null, shelterCard)
            setSelectingPod(false)
            setSelectingCrewmate(false)
            setSelectingShelterCard(false)
            setEmbarking(false)
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
                        <div style={{ position: "absolute", top: 90, height: 165, width: 228 }}>
                            <ShelterCard shelterCard={shelterCards[0]} />
                        </div>
                        <div style={{ position: "absolute", top: 255, left: 60, height: 165, width: 228 }}>
                            <ShelterCard shelterCard={shelterCards[1]} />
                        </div>
                        <div style={{ position: "absolute", top: 415, left: 60, height: 165, width: 228 }}>
                            <ShelterCard shelterCard={shelterCards[2]} />
                        </div>
                        <div style={{ position: "absolute", top: 580, height: 165, width: 228 }}>
                            <ShelterCard shelterCard={shelterCards[3]} />
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