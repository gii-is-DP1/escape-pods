import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import "../static/css/game/game.css";
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
    const [selectingSector, setSelectingSector] = useState(false);
    const [selectedSector, setSelectedSector] = useState({});
    const [selectedPod, setSelectedPod] = useState({});

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

    const hangarX = [-30, 30, 30, -10, -20, 20] //coordenadas X del hangar para [pod3, pod21, pod22, pod11, pod12, pod13]
    const hangarY = [199, 92, 310, -10, 410, 410] // coordenadas Y del hangar para [pod3, pod21, pod22, pod11, pod12, pod13]

    const pod3SlotsX = [65, 31, 31] //coordenadas X de los slots del pod de capacidad 3
    const pod3SlotsY = [50, 31, 69] //coordenadas Y de los slots del pod de capacidad 3
    const pod3IconsX = [57.5, 23, 22] //coordenadas X de los iconos de crewmates para pods de capacidad 3
    const pod3IconsY = [36, 17, 56] //coordenadas Y de los iconos de crewmates para pods de capacidad 3

    const pod2SlotsX = [65, 28] //coordenadas X de los slots del pod de capacidad 3
    const pod2SlotsY = [50, 50] //coordenadas Y de los slots del pod de capacidad 3
    const pod2IconsX = [57.5, 20] //coordenadas X de los iconos de crewmates para pods de capacidad 3
    const pod2IconsY = [36, 36] //coordenadas Y de los iconos de crewmates para pods de capacidad 3

    const pod1SlotsX = 48 //coordenadas X de los slots del pod de capacidad 3
    const pod1SlotsY = 50 //coordenadas Y de los slots del pod de capacidad 3
    const pod1IconsX = 40 //coordenadas X de los iconos de crewmates para pods de capacidad 3
    const pod1IconsY = 36 //coordenadas Y de los iconos de crewmates para pods de capacidad 3

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
                    //                    console.log(piloting)
                    sectorClickHandler(props.sector)
                }}>
                {pods.map((pod, index) => (
                    <div key={index}>
                        {pod.sector && pod.sector.number === props.sector.number &&
                            <Pod pod={pod} />
                        }
                    </div>
                ))}
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
                    piloting ? console.log(piloting) : console.log(piloting)
                    console.log(props.pod)
                    //                            podClickHandler(props.pod)
                }}
            >
                <CrewmateSlots capacity={props.pod.capacity} crewmates={GetCrewmatesFromPod(props.pod)} />
            </div>
        )
    }

    function CrewmateSlots(props) {
        if (emptyChecker("array", props.crewmates) || emptyChecker("array", gamePlayers)) {
            return null
        }
        return (
            <svg height="100%" width="100%">
                {props.crewmates.map((crewmate, index) => (
                    <>
                        {console.log(props.crewmates)}
                        {console.log(props.capacity)}
                        <circle key={index}
                            cx={props.capacity === 3 ? pod3SlotsX[index] : props.capacity === 2 ? pod2SlotsX[index] : pod1SlotsX}
                            cy={props.capacity === 3 ? pod3SlotsY[index] : props.capacity === 2 ? pod2SlotsY[index] : pod1SlotsY}
                            r="18"
                            stroke={crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={crewmate.color}>
                        </circle>
                        {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === crewmate.player.id &&
                            <foreignObject
                                x={props.capacity === 3 ? pod3IconsX[index] : props.capacity === 2 ? pod2IconsX[index] : pod1IconsX}
                                y={props.capacity === 3 ? pod3IconsY[index] : props.capacity === 2 ? pod2IconsY[index] : pod1IconsY}
                                width="30" height="30"
                            >
                                {crewmate.role === "ENGINEER" &&
                                    <HiMiniWrenchScrewdriver color={crewmate.color !== "BLACK" ? "black" : "white"} />
                                }
                                {crewmate.role === "SCIENTIST" &&
                                    <IoIosFlask color={crewmate.color !== "BLACK" ? "black" : "white"} />
                                }
                                {crewmate.role === "CAPTAIN" &&
                                    <ImShield color={crewmate.color !== "BLACK" ? "black" : "white"} />
                                }
                            </foreignObject>
                        }
                        <text>hola</text>
                    </>
                ))}
            </svg>
        )
    }

    async function movePodDemo(pod, sector) {
        console.log(pod)
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

    async function moveCrewmateDemo(crewmate, pod) {
        if (!crewmate) {
            alert("No hay crewmates disponibles para mover")
        } else {
            const movedCrewmate = {
                color: crewmate.color,
                role: crewmate.role,
                player: crewmate.player,
                shelterCard: crewmate.shelterCard,
                pod: pod,
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
            movePodDemo(selectedPod.data, sector)
            setSelectingSector(false)
            setPiloting(false)
        }
    }

    function podClickHandler(pod) {
        setSelectedPod(pod)
        if (piloting) {
            console.log("pod clicked")
            console.log(selectedPod)
            console.log(pod)
            setSelectingSector(true)
            alert("Click on any adjacent sector to move the pod")
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
                    <div style={{ flexDirection: "column", marginLeft: 710, marginTop: 70, height: "100%", alignContent: "center", alignItems: "center" }}>
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
                            movePodDemo(pods.find(pod => pod.number === 2), sectors.find(sector => sector.number === 2))
                        }}>
                            POD DE 2 SECTOR 2
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
                            movePodDemo(pods.find(pod => pod.number === 1), sectors.find(sector => sector.number === 10))
                        }}>
                            POD DE 3 SECTOR 10
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
                            movePodDemo(pods.find(pod => pod.number === 4), sectors.find(sector => sector.number === 6))
                        }}>
                            POD DE 1 SECTOR 6
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
                            moveCrewmateDemo(crewmates.filter(crewmate => crewmate.color === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color)
                                .filter(crewmate => crewmate.role === "ENGINEER" && !crewmate.pod)[0], pods.find(pod => pod.number === 1))
                        }}>
                            ENGINEER A POD DE 3
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
                            moveCrewmateDemo(crewmates.filter(crewmate => crewmate.color === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color)
                                .filter(crewmate => crewmate.role === "CAPTAIN" && !crewmate.pod)[0], pods.find(pod => pod.number === 2))
                        }}>
                            CAPTAIN A POD DE 2
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
                            moveCrewmateDemo(crewmates.filter(crewmate => crewmate.color === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color)
                                .filter(crewmate => crewmate.role === "ENGINEER" && !crewmate.pod)[0], pods.find(pod => pod.number === 4))
                        }}>
                            ENGINEER A POD DE 1
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
                            pruebita xd
                        </Button>
                    </div>
                </div >
            }
        </>

    );

}