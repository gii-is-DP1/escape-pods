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
    const [pod1, setPod1] = useState({});
    const [pod2, setPod2] = useState({});
    const [pod3, setPod3] = useState({});
    const [pod4, setPod4] = useState({});
    const [pod5, setPod5] = useState({});
    const [pod6, setPod6] = useState({});
    const [numeratedPods, setNumeratedPods] = useState([])
    const [crewmates, setCrewmates] = useState([]);
    const [shelterCards, setShelterCards] = useState([]);
    const [slotInfos, setSlotInfos] = useState([]);

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
        const fetchedPods = await itemGetters.fetchPods(currentGame.id, jwt);
        const fetchedCrewmates = await itemGetters.fetchCrewmates(currentGame.id, jwt);
        setGame(currentGame);
        podSetter(fetchedPods, fetchedCrewmates);
        setSectors(await itemGetters.fetchSectors(currentGame.id, jwt));
        setBeacons(await itemGetters.fetchBeacons(currentGame.id, jwt));
        setLines(await itemGetters.fetchLines(currentGame.id, jwt));
        setCrewmates(fetchedCrewmates);
        setPods(fetchedPods);
        setGamePlayers(await itemGetters.fetchGamePlayers(currentGame.id, jwt));
        setShelterCards(await itemGetters.fetchShelterCards(currentGame.id, jwt));
        setSlotInfos(await itemGetters.fetchSlotInfos(currentGame.id, jwt));
    }

    async function podSetter(pods, crewmates) {
        // pod de capacidad 3
        setPod1(
            emptyChecker("array", pods) ? "XD" : {
                data: pods.find(pod => pod.number === 1),
                html:
                    <div className="pod3" style={pods.find(pod => pod.number === 1).sector === null ? { left: hangarX[0], top: hangarY[0] } : null}>
                        <svg height="100%" width="100%">
                            {!emptyChecker("array", crewmates) &&
                                GetCrewmatesFromPod(pods.find(pod => pod.number === 1), crewmates).map((crewmate, index) => (
                                    <>
                                        <circle key={index} cx={pod3SlotsX[index]} cy={pod3SlotsY[index]} r="18"
                                            stroke={crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={crewmate.color}>
                                        </circle>
                                        {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === crewmate.player.id &&
                                            <foreignObject x={pod3IconsX[index]} y={pod3IconsY[index]} width="30" height="30">
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
                                    </>
                                ))
                            }
                        </svg>
                    </div>
            })
        // pods de capacidad 2
        setPod2(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 2),
                html:
                    <div className="pod2" style={pods.find(pod => pod.number === 2).sector === null ? { left: hangarX[1], top: hangarY[1] } : null}>
                        <svg height="100%" width="100%">
                            {!emptyChecker("array", crewmates) &&
                                GetCrewmatesFromPod(pods.find(pod => pod.number === 2), crewmates).map((crewmate, index) => (
                                    <>
                                        <circle key={index} cx={pod2SlotsX[index]} cy={pod2SlotsY[index]} r="18"
                                            stroke={crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={crewmate.color}>
                                        </circle>
                                        {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === crewmate.player.id &&
                                            <foreignObject x={pod2IconsX[index]} y={pod2IconsY[index]} width="30" height="30">
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
                                    </>
                                ))
                            }
                        </svg>
                    </div>
            }
        )
        setPod3(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 3),
                html:
                    <div className="pod2" style={pods.find(pod => pod.number === 3).sector === null ? { left: hangarX[2], top: hangarY[2] } : null}>
                        <svg height="100%" width="100%">
                            {!emptyChecker("array", crewmates) &&
                                GetCrewmatesFromPod(pods.find(pod => pod.number === 3), crewmates).map((crewmate, index) => (
                                    <>
                                        <circle key={index} cx={pod2SlotsX[index]} cy={pod2SlotsY[index]} r="18"
                                            stroke={crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={crewmate.color}>
                                        </circle>
                                        {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === crewmate.player.id &&
                                            <foreignObject x={pod2IconsX[index]} y={pod2IconsY[index]} width="30" height="30">
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
                                    </>
                                ))
                            }
                        </svg>
                    </div>
            }
        )
        // pods de capacidad 1
        setPod4(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 4),
                html:
                    <div className="pod1" style={pods.find(pod => pod.number === 4).sector === null ? { left: hangarX[3], top: hangarY[3] } : null}>
                        <svg height="100%" width="100%">
                            {!emptyChecker("array", crewmates) &&
                                GetCrewmatesFromPod(pods.find(pod => pod.number === 4), crewmates).map((crewmate, index) => (
                                    <>
                                        <circle key={index} cx={pod1SlotsX} cy={pod1SlotsY} r="18"
                                            stroke={crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={crewmate.color}>
                                        </circle>
                                        {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === crewmate.player.id &&
                                            <foreignObject x={pod1IconsX} y={pod1IconsY} width="30" height="30">
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
                                    </>
                                ))
                            }
                        </svg>
                    </div>
            }
        )
        setPod5(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 5),
                html:
                    <div className="pod1" style={pods.find(pod => pod.number === 5).sector === null ? { left: hangarX[4], top: hangarY[4] } : null}>
                        <svg height="100%" width="100%">
                            {!emptyChecker("array", crewmates) &&
                                GetCrewmatesFromPod(pods.find(pod => pod.number === 5), crewmates).map((crewmate, index) => (
                                    <>
                                        <circle key={index} cx={pod1SlotsX} cy={pod1SlotsY} r="18"
                                            stroke={crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={crewmate.color}>
                                        </circle>
                                        {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === crewmate.player.id &&
                                            <foreignObject x={pod1IconsX} y={pod1IconsY} width="30" height="30">
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
                                    </>
                                ))
                            }
                        </svg>
                    </div>
            }
        )
        setPod6(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 6),
                html:
                    <div className="pod1" style={pods.find(pod => pod.number === 6).sector === null ? { left: hangarX[5], top: hangarY[5] } : null}>
                        <svg height="100%" width="100%">
                            {!emptyChecker("array", crewmates) &&
                                GetCrewmatesFromPod(pods.find(pod => pod.number === 6), crewmates).map((crewmate, index) => (
                                    <>
                                        <circle key={index} cx={pod1SlotsX} cy={pod1SlotsY} r="18"
                                            stroke={crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={crewmate.color}>
                                        </circle>
                                        {gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === crewmate.player.id &&
                                            <foreignObject x={pod1IconsX} y={pod1IconsY} width="30" height="30">
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
                                    </>
                                ))
                            }
                        </svg>
                    </div>
            }
        )
    }

    function GetCrewmatesFromPod(pod, crewmates) {
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
        if (props.sector === undefined) {
            return null
        }
        return (
            <div style={{ width: 100, height: 100, position: "absolute", left: props.x, top: props.y }}>
                {pod1.data.sector && pod1.data.sector.number === props.sector.number ? pod1.html : null}
                {pod2.data.sector && pod2.data.sector.number === props.sector.number ? pod2.html : null}
                {pod3.data.sector && pod3.data.sector.number === props.sector.number ? pod3.html : null}
                {pod4.data.sector && pod4.data.sector.number === props.sector.number ? pod4.html : null}
                {pod5.data.sector && pod5.data.sector.number === props.sector.number ? pod5.html : null}
                {pod6.data.sector && pod6.data.sector.number === props.sector.number ? pod6.html : null}
                <Button style={{ border: "none", opacity: 0, width: 100, height: 100, borderRadius: 50, boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s" }}>
                    {props.sector.number}
                </Button>
            </div>
        )
    }

    async function movePodDemo(pod, sector) {
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

    return (
        <>
            {!emptyChecker("array", sectors) && !emptyChecker("object", pod1) &&
                <div className="game-page-container">
                    <div className="game-board">
                        <Sector x={x[1]} y={y[1]} sector={sectors.find(sector => sector.number === 1)} />
                        <Sector x={x[2]} y={y[2]} sector={sectors.find(sector => sector.number === 2)} />
                        <Sector x={x[3]} y={y[3]} sector={sectors.find(sector => sector.number === 3)} />

                        <Sector x={x[4]} y={y[4]} sector={sectors.find(sector => sector.number === 4)} />
                        <Sector x={x[5]} y={y[5]} sector={sectors.find(sector => sector.number === 5)} />
                        <Sector x={x[6]} y={y[6]} sector={sectors.find(sector => sector.number === 6)} />

                        <Sector x={x[7]} y={y[7]} sector={sectors.find(sector => sector.number === 7)} />
                        <Sector x={x[8]} y={y[8]} sector={sectors.find(sector => sector.number === 8)} />
                        <Sector x={x[9]} y={y[9]} sector={sectors.find(sector => sector.number === 9)} />

                        <Sector x={x[10]} y={y[10]} sector={sectors.find(sector => sector.number === 10)} />

                        <Sector x={x[11]} y={y[11]} sector={sectors.find(sector => sector.number === 11)} />
                        <Sector x={x[12]} y={y[12]} sector={sectors.find(sector => sector.number === 12)} />
                        <Sector x={x[13]} y={y[13]} sector={sectors.find(sector => sector.number === 13)} />
                        {pod1.data.sector === null ? pod1.html : null}
                        {pod2.data.sector === null ? pod2.html : null}
                        {pod3.data.sector === null ? pod3.html : null}
                        {pod4.data.sector === null ? pod4.html : null}
                        {pod5.data.sector === null ? pod5.html : null}
                        {pod6.data.sector === null ? pod6.html : null}
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
                                .filter(crewmate => crewmate.role === "SCIENTIST" && !crewmate.pod)[0], pods.find(pod => pod.number === 1))
                        }}>
                            SCIENTIST A POD DE 3
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
                                .filter(crewmate => crewmate.role === "CAPTAIN" && !crewmate.pod)[0], pods.find(pod => pod.number === 1))
                        }}>
                            CAPTAIN A POD DE 3
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
                                .filter(crewmate => crewmate.role === "ENGINEER" && !crewmate.pod)[0], pods.find(pod => pod.number === 2))
                        }}>
                            ENGINEER A POD DE 2
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
                                .filter(crewmate => crewmate.role === "SCIENTIST" && !crewmate.pod)[0], pods.find(pod => pod.number === 2))
                        }}>
                            SCIENTIST A POD DE 2
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
                            console.log(pod1)
                            console.log(pod2)
                            console.log(pod3)
                            console.log(pod4)
                            console.log(pod5)
                            console.log(pod6)
                            console.log(GetCrewmatesFromPod(pods.find(pod => pod.number === 1), crewmates))
                            console.log(gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color)
                            console.log(gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id))
                        }}>
                            pruebita xd
                        </Button>
                    </div>
                </div >
            }
        </>

    );

}