import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse, Alert } from "reactstrap";
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

    //acciones
    const [piloting, setPiloting] = useState(false);
    const [embarking, setEmbarking] = useState(false);
    const [selectingSector, setSelectingSector] = useState(false);
    const [selectedSector, setSelectedSector] = useState({});
    const [selectedPod, setSelectedPod] = useState({});
    const [selectingPod, setSelectingPod] = useState(false);
    const [selectedCrewmate, setSelectedCrewmate] = useState(null);
    const [selectingCrewmate, setSelectingCrewmate] = useState(false);
    const [selectingShelterCard, setSelectingShelterCard] = useState(false);
    const [selectedShelterCard, setSelectedShelterCard] = useState({});
    const [spying, setSpying] = useState(false);
    const [boarding, setBoarding] = useState(false)

    const [programming, setProgramming] = useState(false)
    const [remotePiloting, setRemotePiloting] = useState(false)
    const [minipodSpawning, setMinipodSpawning] = useState(false)
    const [selectingBeacon, setSelectingBeacon] = useState(false);
    const [selectedBeacon, setSelectedBeacon] = useState({});
    const [selectingLine, setSelectingLine] = useState(false);
    const [selectedLine, setSelectedLine] = useState({});

    const [crasher1, setCrasher1] = useState(null)
    const [crasher2, setCrasher2] = useState(null) //teniendo en cuenta que puede haber choques en cadena, la cadena más larga sería de dos choques
    const [crashSector1, setCrashSector1] = useState(null)
    const [crashSector2, setCrashSector2] = useState(null)

    const [spiedCrewmates, setSpiedCrewmates] = useState([])

    const [selecingAction, setSelectingAction] = useState(false)
    const [actionSlots, setActionSlots] = useState({
        embark: null,
        accelerate: null,
        spy: null,
        minipod: null,
    })
    const [specialActionSlots, setSpecialActionSlots] = useState({
        board: null,
        pilot: null,
        program: null,
        refresh: null,
    })

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
    const shelterEmbarkingSlotsY = [1, 1, 1, 1, 1, 1] //coordenadas Y de los slots del shelter

    const embarkSectorsNumbers = [1, 2, 3]
    //    1    2    3    4    5    6    7    8    9   10   11   12   13
    const lineX = [null, 143, 174, 143, 238, 205, 205, 238, 270, 270, 364, 330, 301, 330,
        364, 397, 427, 397, 492, 458, 458, 492, 524, 555, 524, 586, 586]
    const lineY = [null, 189, 242, 297, 133, 189, 297, 352, 189, 297, 133, 189, 242, 297,
        352, 189, 242, 297, 133, 189, 297, 352, 189, 242, 297, 189, 297]
    //  14   15   16   17   18   19   20   21   22   23   24    25   26

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer();
            GetGameData();
            refresher();
        }
    }, [jwt])

    function refresher() {
        let intervalID = setInterval(() => {
            refresherSetters();
        }, 8000);
        return () => {
            clearInterval(intervalID);
        };
    }

    async function refresherSetters() {
        setGame(await fetchCurrentGame());
        setPods(await itemGetters.fetchPods(gameId, jwt));
        setCrewmates(await itemGetters.fetchCrewmates(gameId, jwt));
        setLines(await itemGetters.fetchLines(gameId, jwt));
        setSectors(await itemGetters.fetchSectors(gameId, jwt));
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

    async function GetGameData() {
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
        return crewmates.filter(crewmate => crewmate.pod && (crewmate.pod.number === pod.number))
    }

    function GetCrewmatesFromShelter(shelterCard) {
        return crewmates.filter(crewmate => crewmate.shelterCard && (crewmate.shelterCard.id === shelterCard.id))
    }

    function GetUnusedBeacons() {
        let usedBeacons = []
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].beacon) {
                usedBeacons.push(lines[i].beacon.id)
            }
        }
        return beacons.filter(beacon => !usedBeacons.includes(beacon.id))
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
                    <img src={scrap} style={{ maxHeight: 100, maxWidth: 100 }} />
                }
            </div>
        )
    }

    function rotation(line) {
        const plus30deg = [1, 8, 15, 22, 6, 13, 20, 26]
        const minus30deg = [5, 11, 19, 25, 3, 9, 17, 24]
        if (plus30deg.includes(line.number)) {
            return "30deg"
        } else if (minus30deg.includes(line.number)) {
            return "-30deg"
        } else {
            return "90deg"
        }
    }

    function Line(props) {
        if (props.line === undefined || emptyChecker("array", beacons)) {
            return null
        }
        return (
            <div style={{ width: 54, height: 14, position: "absolute", left: props.x, top: props.y, rotate: rotation(props.line), backgroundColor: `rgba(255, 128, 0, ${selectingLine && !props.line.beacon ? "0.3" : "0"})` }}
                onClick={() => {
                    if (selectingLine) {
                        lineClickHandler(props.line)
                    }
                }}
            >
                {beacons.map((beacon, index) => (
                    <div key={index}>
                        {props.line.beacon && props.line.beacon.id === beacon.id &&
                            <Beacon beacon={beacon} />
                        }
                    </div>
                ))}
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
        if (emptyChecker("array", gamePlayers) || !props.crewmate) {
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
                {(gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === props.crewmate.player.id || (spying && spiedCrewmates.includes(props.crewmate))) &&
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

    function UnusedCrewmates(props) {
        if (emptyChecker("array", crewmates) || emptyChecker("array", gamePlayers)) {
            return null
        }
        return (
            <div style={{ height: 135 }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate =>
                        crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id
                        && crewmate.role === "ENGINEER" && !crewmate.pod && !crewmate.shelterCard &&
                        ![...Object.values(props.actionSlots), ...Object.values(props.specialActionSlots)]
                            .flat().map(actionCrewmate => actionCrewmate ? actionCrewmate.id : null).includes(crewmate.id))
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))
                    }
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id
                        && crewmate.role === "SCIENTIST" && !crewmate.pod && !crewmate.shelterCard &&
                        ![...Object.values(props.actionSlots), ...Object.values(props.specialActionSlots)]
                            .flat().map(actionCrewmate => actionCrewmate ? actionCrewmate.id : null).includes(crewmate.id))
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))
                    }
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id
                        && crewmate.role === "CAPTAIN" && !crewmate.pod && !crewmate.shelterCard &&
                        ![...Object.values(props.actionSlots), ...Object.values(props.specialActionSlots)]
                            .flat().map(actionCrewmate => actionCrewmate ? actionCrewmate.id : null).includes(crewmate.id))
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    function Beacon(props) {
        if (emptyChecker("array", beacons)) {
            return null
        }
        return (
            <div className={props.beacon.color1.toLowerCase() + "-" + props.beacon.color2.toLowerCase() + "-beacon"}
                onClick={() => {
                    if (selectingBeacon) {
                        beaconClickHandler(props.beacon)
                    }
                }}
            >
            </div>
        )
    }

    function UnusedBeacons() {
        if (emptyChecker("array", beacons)) {
            return null
        }
        return (
            <div style={{ height: 45, width: 295 }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
                    {beacons.filter(beacon => GetUnusedBeacons().includes(beacon)).slice(0, 5).map((beacon, index) => (
                        <div key={index} style={{ marginRight: 60 }}>
                            <Beacon beacon={beacon} />
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {beacons.filter(beacon => GetUnusedBeacons().includes(beacon)).slice(5).map((beacon, index) => (
                        <div key={index} style={{ marginRight: 60 }}>
                            <Beacon beacon={beacon} />
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
            <div className={"shelter-" + props.shelterCard.type.toLowerCase()} onClick={() => {
                console.log(props.shelterCard)
                if (selectingShelterCard) {
                    shelterClickHandler(props.shelterCard)
                }
            }}>
                {props.shelterCard.explosion !== 6 &&
                    <div className="explosion" style={{
                        position: "absolute", left: shelterEmbarkingSlotsX[props.shelterCard.explosion - 1],
                        top: shelterEmbarkingSlotsY[props.shelterCard.explosion - 1]
                    }}>
                    </div>
                }
                {GetCrewmatesFromShelter(props.shelterCard).map((crewmate, index) => (
                    <div style={{ position: "absolute", left: shelterEmbarkingSlotsX[index], top: shelterEmbarkingSlotsY[index] }}>
                        <Crewmate crewmate={crewmate} size="s" />
                    </div>
                ))}
                {slotInfos.filter(slotInfo => slotInfo.shelter.id === props.shelterCard.id).map((slotInfo, index) => (
                    <div key={index} style={{ position: "absolute", left: shelterEmbarkingSlotsX[index], top: shelterEmbarkingSlotsY[index] + 91.5 }}>
                        <p style={{ color: "black", fontSize: 9, position: "absolute", left: 23, top: -1 }}>
                            {slotInfo.slotScore}
                        </p>
                        {slotInfo.role === "ENGINEER" &&
                            <HiMiniWrenchScrewdriver color="white" style={{ position: "absolute", top: 10, left: 7 }} />
                        }
                        {slotInfo.role === "SCIENTIST" &&
                            <IoIosFlask color="white" style={{ position: "absolute", top: 10, left: 7 }} />
                        }
                        {slotInfo.role === "CAPTAIN" &&
                            <ImShield color="white" style={{ position: "absolute", top: 10, left: 7 }} />
                        }
                    </div>
                ))}
            </div>
        )
    }

    function ActionCards() {
        if (emptyChecker("array", gamePlayers)) {
            return null
        }
        return (
            <div style={{ display: "flex", flexDirection: "row", width: 480, height: 170, position: "relative" }}>
                <div className={gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color.toLowerCase() + "-action-card"}>
                    <div style={{ position: "absolute", left: 92, top: 20, width: 40, height: 40 }}
                        onClick={() => {
                            if (!actionSlots.embark[0]) {
                                setEmbarking(true);
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={actionSlots.embark ? actionSlots.embark[0] : null}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 138, top: 20, width: 40, height: 40 }}
                        onClick={() => {
                            if (!actionSlots.embark[1]) {
                                setEmbarking(true);
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={actionSlots.embark ? actionSlots.embark[1] : null}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 33, top: 95.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (!actionSlots.accelerate) {
                                setPiloting(true);
                                setSelectingPod(true);
                                setSelectingAction(true);
                                setSelectingCrewmate(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={actionSlots.accelerate}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 96, top: 95.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (!actionSlots.spy) {
                                setSpying(true);
                                setSelectingPod(true);
                                setSelectingShelterCard(true);
                                setSelectingAction(true);
                                setSelectingCrewmate(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={actionSlots.spy}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 159, top: 95.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (!actionSlots.minipod) {
                                setMinipodSpawning(true);
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={actionSlots.minipod}></Crewmate>
                    </div>

                </div>
                <div className={gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color.toLowerCase() + "-special-action-card"} style={{ position: "absolute", left: 250 }}>
                    <div style={{ position: "absolute", left: 65.5, top: 26, width: 40, height: 40 }}
                        onClick={() => {
                            if (!specialActionSlots.board) {
                                setBoarding(true);
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={specialActionSlots.board}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 160.5, top: 26, width: 40, height: 40 }}
                        onClick={() => {
                            if (!specialActionSlots.program) {
                                setProgramming(true);
                                setSelectingBeacon(true);
                                setSelectingAction(true);
                                setSelectingCrewmate(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={specialActionSlots.program}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 65, top: 89.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (!specialActionSlots.pilot) {
                                setRemotePiloting(true);
                                setSelectingPod(true);
                                setSelectingAction(true);
                                setSelectingCrewmate(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={specialActionSlots.pilot}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 160.5, top: 89.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (!specialActionSlots.refresh) {
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={specialActionSlots.refresh}></Crewmate>
                    </div>
                </div>
            </div>
        )
    }

    function ExplosionCard() {
        return (
            <div className="explosion-card" style={{
                position: "relative", display: "flex", flexDirection: "column",
                alignItems: "center", marginTop: 15, marginBottom: 20
            }} onClick={() => {
                if (programming) {
                    ProgramExplosionCard()
                    setProgramming(false)
                    setSelectingCrewmate(false)
                    setSelectingBeacon(false)
                    ShowAlert("The explosion card was placed at the end of the deck")
                }
            }}>
                <p style={{ color: "#ff7354", fontSize: 25, marginTop: 16 }}>{game.explosions[0]}</p>
            </div>
        )
    }

    function actionSlotSetter(crewmate) {
        if (embarking) {
            if (!actionSlots.embark) {
                setActionSlots({ ...actionSlots, embark: [crewmate] })
            } else {
                setActionSlots({ ...actionSlots, embark: [...actionSlots.embark, crewmate] })
            }
            ShowAlert("Click on any of your crewmates")
        } else if (piloting) {
            setActionSlots({ ...actionSlots, accelerate: crewmate })
            setSelectingCrewmate(false);
            ShowAlert("Click on any pod where you have at least one of your crewmates to accelerate")
        } else if (spying) {
            setActionSlots({ ...actionSlots, spy: crewmate })
            setSelectingCrewmate(false);
            ShowAlert("Click on the pod or shelter you want to spy")
        } else if (minipodSpawning) {
            setActionSlots({ ...actionSlots, minipod: crewmate })
            ShowAlert("Click on any of your crewmates")
        } else if (remotePiloting) {
            setSpecialActionSlots({ ...specialActionSlots, pilot: crewmate })
            setSelectingCrewmate(false);
            ShowAlert("Click on any pod to pilot it")
        } else if (boarding) {
            setSpecialActionSlots({ ...specialActionSlots, board: crewmate })
            ShowAlert("Click on any of your crewmates")
        } else if (programming) {
            setSpecialActionSlots({ ...specialActionSlots, program: crewmate })
            setSelectingCrewmate(false);
            ShowAlert("Click on any beacon or click the explosion card to place it at the end of the deck")
        } else {
            setSelectingCrewmate(false);
            setSpecialActionSlots({ ...specialActionSlots, board: null, pilot: null, program: null, refresh: crewmate })
            Explode(shelterCards.find(shelterCard => shelterCard.sector.number === 11))
            ShowAlert("Special action card refreshed")
        }
        setSelectingAction(false)
        setSelectedCrewmate(null)
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
        setPods(await itemGetters.fetchPods(gameId, jwt))
        setCrewmates(await itemGetters.fetchCrewmates(gameId, jwt))
    }

    async function moveCrewmate(crewmate, pod, shelterCard) {
        const oldPod = crewmate.pod
        const movedCrewmate = {
            color: crewmate.color,
            role: crewmate.role,
            player: crewmate.player,
            shelterCard: shelterCard ? shelterCard : crewmate.shelterCard,
            pod: pod && !shelterCard ? pod : null,  // si se mueve a un pod, se pone el pod. Si se mueve a un shelter, se pone a null. Si no se le pasa nada, se pone null (para hacer boarding)
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

        const newCrewmates = await itemGetters.fetchCrewmates(gameId, jwt)
        if (oldPod && newCrewmates.filter(crewmate => crewmate.pod && oldPod && (crewmate.pod.number === oldPod.number)).length === 0 && !boarding) { //boarding porque puede haber casos en los que el pod se quede vacío por un instante al intercambiar crewmates pero no debe irse al hangar
            movePod(oldPod, null)
        }
        setCrewmates(newCrewmates)

        if (shelterCard && (shelterCard.explosion !== 6) &&
            (newCrewmates.filter(crewmate => crewmate.shelterCard && (crewmate.shelterCard.id === shelterCard.id)).length === shelterCard.explosion)) {
            Explode(shelterCard)
        }
    }

    async function Explode(shelterCard) {
        const modifiedShelterCard = {
            type: shelterCard.type,
            explosion: shelterCard.explosion + 1,
            game: game,
            sector: shelterCard.sector
        }
        await fetch(`/api/v1/shelterCards/${shelterCard.id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(modifiedShelterCard)
        })
        setShelterCards(await itemGetters.fetchShelterCards(gameId, jwt))

        const sectorToModify = sectors.find(sector => sector.number === game.explosions[0])
        const modifiedSector = {
            number: sectorToModify.number,
            scrap: true,
            game: game,
            lines: sectorToModify.lines,
        }
        await fetch(`/api/v1/sectors/${sectors.find(sector => sector.number === game.explosions[0]).id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(modifiedSector)
        })
        setSectors(await itemGetters.fetchSectors(gameId, jwt))

        const modifiedGame = {
            numPlayers: game.numPlayers,
            start: game.start,
            finish: game.finish,
            status: game.status,
            explosions: game.explosions.slice(1),
            players: game.players
        }
        await fetch(`/api/v1/games/${gameId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(modifiedGame)
        })
        setGame(await fetchCurrentGame())

        if (pods.find(pod => pod.sector && pod.sector.number === sectorToModify.number)) {
            for (let crewmate of GetCrewmatesFromPod(pods.find(pod => pod.sector && pod.sector.number === sectorToModify.number))) {
                moveCrewmate(crewmate, null, null)
            }
            movePod(pods.find(pod => pod.sector && pod.sector.number === sectorToModify.number), null)
        }
    }

    async function ProgramExplosionCard() {
        let explosionsCopy = [...game.explosions];
        let firstExplosion = explosionsCopy.shift();
        explosionsCopy.push(firstExplosion);
        const modifiedGame = {
            numPlayers: game.numPlayers,
            explosions: explosionsCopy,
            players: game.players,
            start: game.start,
            finish: game.finish,
            status: game.status
        }
        await fetch(`/api/v1/games/${gameId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(modifiedGame)
        })
        setGame(await fetchCurrentGame())
    }

    async function moveBeacon(beacon, line) {
        const modifiedLine = {
            beacon: beacon,
            number: line.number,
            game: game
        }
        await fetch(`/api/v1/lines/${line.id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(modifiedLine)
        })
        setLines(await itemGetters.fetchLines(gameId, jwt))
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


    async function sectorClickHandler(sector) {
        setSelectedSector(sector)
        if ((piloting || remotePiloting) && selectingSector) {
            if ((!selectedPod.sector && adjacencyList[0].includes(sector.number)) || (selectedPod.sector && adjacencyList[selectedPod.sector.number].includes(sector.number))) {
                if (sector.scrap) {
                    ShowAlert("You cannot move the pod to a sector with scrap in it")
                } else if (crasher1 && (crasher1.sector.number === sector.number)) {
                    if (crasher2) {
                        await movePod(crasher1, null)
                        await movePod(selectedPod, sector)
                        await movePod(crasher2, crashSector2)
                        await movePod(crasher1, crashSector1)
                        setCrasher1(null)
                        setCrashSector1(null)
                        setCrasher2(null)
                        setCrashSector2(null)
                    } else {
                        await movePod(crasher1, null)
                        await movePod(selectedPod, sector)
                        await movePod(crasher1, crashSector1)
                        setCrasher1(null)
                        setCrashSector1(null)
                    }
                    setSelectingSector(false)
                    setSelectingPod(false)
                    setPiloting(false)
                    setRemotePiloting(false)
                } else if (pods.find(pod => pod.sector && (pod.sector.id === sector.id)) && (pods.find(pod => pod.sector && (pod.sector.id === sector.id)).capacity >= selectedPod.capacity)) {
                    ShowAlert("You cannot crash with a larger pod")
                } else if (!pods.find(pod => pod.sector && (pod.sector.id === sector.id))) {
                    ShowAlert("The pod was moved to the selected sector")
                    if (crasher2) {
                        await movePod(selectedPod, sector)
                        await movePod(crasher2, crashSector2)
                        await movePod(crasher1, crashSector1)
                        setCrasher1(null)
                        setCrashSector1(null)
                        setCrasher2(null)
                        setCrashSector2(null)
                    } else if (crasher1) {
                        await movePod(selectedPod, sector)
                        await movePod(crasher1, crashSector1)
                        setCrasher1(null)
                        setCrashSector1(null)
                    } else {
                        movePod(selectedPod, sector)
                    }

                    setSelectingSector(false)
                    setSelectingPod(false)

                    setPiloting(false)
                    setRemotePiloting(false)



                } else {
                    ShowAlert("You crashed with another pod, select the sector you want to move the crashed pod to")

                    let crashedPod = pods.find(pod => pod.sector && (pod.sector.id === sector.id))
                    if (crasher1 === null) {
                        setCrasher1(selectedPod)
                        setCrashSector1(sector)
                    } else {
                        setCrasher2(selectedPod)
                        setCrashSector2(sector)
                    }
                    setSelectedPod(crashedPod)
                    setSelectingPod(false)
                }
            } else {
                ShowAlert("You cannot move the pod to a not adjacent sector")
            }

        } else if (embarking) {
            if (sector.number === 1 || sector.number === 2 || sector.number === 3) {
                movePod(selectedPod, sector)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setEmbarking(false)
                setSelectingSector(false)
            } else {
                ShowAlert("Select one of the adjacent sectors to the hangar")
            }

        } else if (minipodSpawning) {
            if ((!selectedCrewmate.pod.sector && adjacencyList[0].includes(sector.number)) || (selectedCrewmate.pod.sector && adjacencyList[selectedCrewmate.pod.sector.number].includes(sector.number))) {
                if (sector.scrap || (pods.find(pod => pod.sector && (pod.sector.id === sector.id)) && (pods.find(pod => pod.sector && (pod.sector.id === sector.id)).capacity >= selectedPod.capacity))) {
                    ShowAlert("You cannot spawn the minipod in the selected sector")
                } else if (!pods.find(pod => pod.sector && (pod.sector.id === sector.id))) {
                    ShowAlert("The minipod was moved to the selected sector")
                    movePod(selectedPod, sector)
                    moveCrewmate(selectedCrewmate, selectedPod)
                    setSelectingSector(false)
                    setSelectingPod(false)
                    setMinipodSpawning(false)
                }
            }
        }
    }

    function podClickHandler(pod) {
        setSelectedPod(pod)

        if (piloting) {

            if (GetCrewmatesFromPod(pod).find(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id)) {
                setSelectingPod(false)
                setSelectingSector(true)
                ShowAlert("Select the sector you want to move the pod to")
            } else {
                ShowAlert("You must have at least one of your crewmates in the pod in order to accelerate")

            }
        } else if (embarking) {
            if ((embarkSectorsNumbers.includes(pod.sector ? pod.sector.number : '') || !pod.sector) && (pod && GetCrewmatesFromPod(pod).length < pod.capacity)) {
                if (pod.number > 3 && pods.filter(pod => pod.number <= 3 && (!pod.sector || embarkSectorsNumbers.includes(pod.sector.number)) && GetCrewmatesFromPod(pod).length < pod.capacity).length >= 1) {
                    ShowAlert("You cannot move your crewmate to a one-manned pod if there are empty slots in the larger pods")
                } else {
                    moveCrewmate(selectedCrewmate, pod, null)
                    setSelectingCrewmate(false)
                    setSelectingPod(false)
                    setSelectingShelterCard(false)
                    setSelectedCrewmate(null)
                    ShowAlert("The crewmate was moved to the selected pod")
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
                            ShowAlert("Select one of the adjacent sectors to the hangar")
                            setSelectingSector(true);
                        }
                    }
                }
            } else if ((selectedCrewmate.pod && adjacencyList[selectedCrewmate.pod.sector.number].includes(pod.sector.number)) && (pod && GetCrewmatesFromPod(pod).length < pod.capacity)) {
                moveCrewmate(selectedCrewmate, pod, null)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setEmbarking(false)
                setSelectedCrewmate(null)
                ShowAlert("The crewmate was moved to the selected pod")
            } else {
                setSelectingCrewmate(false)
                setSelectingPod(false)
                setEmbarking(false)
                ShowAlert(`You cannot move your ${selectedCrewmate.role.toLowerCase()} to that pod`)
            }
        } else if (remotePiloting) {
            if (GetCrewmatesFromPod(pod).length !== 0) {
                setSelectingPod(false)
                setSelectingSector(true)
                ShowAlert("Select the seector you want to pilot the pod to")
            }
        } else if (spying) {
            setSelectingPod(false)
            setSelectingShelterCard(false)
            setSpiedCrewmates(GetCrewmatesFromPod(pod))
            setTimeout(() => {
                setSpiedCrewmates([])
                setSpying(false)
            }, 5000)
        }
    }

    async function crewmateClickHandler(crewmate) {
        if (selecingAction) {
            actionSlotSetter(crewmate)
        } else if (embarking) {
            setSelectedCrewmate(crewmate)
            if (crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id) {
                setSelectingPod(true)
                setSelectingShelterCard(true)
                ShowAlert("Click on any pod or shelter to move the crewmate")
            } else {
                ShowAlert("The crewmate must be yours")
            }
        } else if (boarding) {
            if (crewmate.shelterCard) {
                ShowAlert("You cannot use this action on a crewmate that is in a shelter")
            } else if (crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id) {
                if (!selectedCrewmate) {
                    setSelectedCrewmate(crewmate)
                    ShowAlert("Select the crewmate you want to swap")
                } else {
                    ShowAlert("One of the crewmates you swap must not be yours")
                }
            } else {
                if (!selectedCrewmate) {
                    ShowAlert("You must select one of your crewmates first")
                } else {
                    if (selectedCrewmate.pod) {
                        if (adjacencyList[selectedCrewmate.pod.sector.number].includes(crewmate.pod.sector.number)) {
                            if (crewmate.pod.capacity === GetCrewmatesFromPod(crewmate.pod).length ||
                                selectedCrewmate.pod.capacity === GetCrewmatesFromPod(selectedCrewmate.pod).length) {
                                let yourCrewmatePod = selectedCrewmate.pod
                                let otherCrewmatePod = crewmate.pod
                                await moveCrewmate(selectedCrewmate, null, null)
                                await moveCrewmate(crewmate, null, null)
                                moveCrewmate(selectedCrewmate, otherCrewmatePod, null)
                                moveCrewmate(crewmate, yourCrewmatePod, null)
                                ShowAlert("Crewmates swapped")
                                setSelectedCrewmate(null)
                                setSelectingCrewmate(false)
                                setBoarding(false)
                            } else {
                                moveCrewmate(selectedCrewmate, crewmate.pod, null)
                                moveCrewmate(crewmate, selectedCrewmate.pod, null)
                                ShowAlert("Crewmates swapped")
                                setSelectedCrewmate(null)
                                setSelectingCrewmate(false)
                                setBoarding(false)
                            }
                        } else {
                            ShowAlert("You can only swap crewmates in adjacent pods")
                        }
                    } else {
                        if (embarkSectorsNumbers.includes(crewmate.pod.sector.number)) {
                            if (crewmate.pod.capacity === GetCrewmatesFromPod(crewmate.pod).length) {
                                let otherCrewmatePod = crewmate.pod
                                moveCrewmate(crewmate, null, null)
                                moveCrewmate(selectedCrewmate, otherCrewmatePod, null)
                                ShowAlert("Crewmates swapped")
                                setSelectedCrewmate(null)
                                setSelectingCrewmate(false)
                                setBoarding(false)
                            } else {
                                moveCrewmate(selectedCrewmate, crewmate.pod, null)
                                moveCrewmate(crewmate, null, null)
                                ShowAlert("Crewmates swapped")
                                setSelectedCrewmate(null)
                                setSelectingCrewmate(false)
                                setBoarding(false)
                            }
                        } else {
                            ShowAlert("If your selected crewmate is in your reserve you can only board pods adjacent to the hangar")
                        }
                    }
                }
            }
        } else if (minipodSpawning) {
            setSelectedCrewmate(crewmate)
            if (crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id && crewmate.pod) {
                //no hay pods de 1 disponibles
                if (pods.filter(pod => pod.number > 3 && pod.sector && GetCrewmatesFromPod(pod).length !== 0).length >= 3) {
                    ShowAlert("There are no minipods available to spawn")
                    setSelectingCrewmate(false)
                    setMinipodSpawning(false)
                } else {
                    ShowAlert("Select where you want to spawn the minipod")
                    let minipod = pods.filter(pod => pod.number > 3 && (!pod.sector && pods.filter(pod => pod.number > 3 && GetCrewmatesFromPod(pod).length === 0)))[0]
                    setSelectedPod(minipod)
                    setSelectingSector(true)
                }
            } else {
                ShowAlert("Select one of your crewmates that are in a pod")
            }
        }
    }

    function shelterClickHandler(shelterCard) {
        setSelectedShelterCard(shelterCard)
        if (embarking) {
            console.log(selectedCrewmate.pod.sector.number)
            console.log(shelterCard.sector.number)
            if (selectedCrewmate.pod && selectedCrewmate.pod.sector.number === 11 && shelterCard.sector.number === 11) {
                moveCrewmate(selectedCrewmate, null, shelterCard)
            } else if (selectedCrewmate.pod && selectedCrewmate.pod.sector.number === 12 && shelterCard.sector.number === 12) {
                moveCrewmate(selectedCrewmate, null, shelterCard)
            } else if (selectedCrewmate.pod && selectedCrewmate.pod.sector.number === 13 && shelterCard.sector.number === 13) {
                moveCrewmate(selectedCrewmate, null, shelterCard)
            } else {
                ShowAlert("You can only disembark a crewmate in a shelter adjacent to your pod")
            }
            setSelectingPod(false)
            setSelectingCrewmate(false)
            setSelectingShelterCard(false)
            setEmbarking(false)
            setSelectedCrewmate(null)

        } else if (spying) {
            setSelectingPod(false)
            setSelectingShelterCard(false)
            setSpiedCrewmates(GetCrewmatesFromShelter(shelterCard))
            setTimeout(() => {
                setSpiedCrewmates([])
                setSpying(false)
            }, 5000)
        }
    }

    function beaconClickHandler(beacon) {
        setSelectedBeacon(beacon)
        if (programming) {
            ShowAlert("Click on any line to place the beacon")
            setSelectingLine(true)
            setSelectingBeacon(false)
        }
    }

    function lineClickHandler(line) {
        setSelectedLine(line)
        let selectedBeaconLine = lines.find(line => line.beacon && line.beacon.id === selectedBeacon.id)
        if (programming) {

            //mover beacon nuevo a linea desokupada
            if (!line.beacon && selectedBeacon) {
                if (!GetUnusedBeacons().includes(selectedBeacon)) {
                    moveBeacon(null, selectedBeaconLine)
                }
                ShowAlert("Beacon moved")
                console.log(selectedBeacon)
                moveBeacon(selectedBeacon, line)
                setSelectingLine(false)
                setProgramming(false)

                // caso en el que se quiera hacer un intercambio en le que uno de los beacon es de nueva instalacion
            } else if (line.beacon && selectedBeacon && GetUnusedBeacons().includes(selectedBeacon)) {
                ShowAlert("There is already a beacon in that line, select another one")

                // intercambiar 2 beacon de sitio 
            } else if (line.beacon && selectedBeacon && !GetUnusedBeacons().includes(selectedBeacon)) {
                let selectedLineBeacon = line.beacon

                //limpiamos las lineas involucradas
                moveBeacon(null, selectedBeaconLine)
                moveBeacon(null, line)
                ShowAlert("Beacons swapped")

                //movemos los beacons  asus nuevos sitios
                moveBeacon(selectedBeacon, line)
                moveBeacon(selectedLineBeacon, selectedBeaconLine)


                setSelectingLine(false)
                setProgramming(false)

                //esta aerta nunca deberia salir
            } else {
                alert('ESTAS INTENTANDO HACER UN MOVIMIENTO INVALIDO HACIA UNA LINEA, SELECCIONA A OTRA')
            }
        }
    }

    function handleCancel() {
        if (embarking) {
            if (actionSlots.embark && actionSlots.embark.length === 2) {
                setActionSlots({ ...actionSlots, embark: actionSlots.embark.slice(0, 1) })
            } else {
                setActionSlots({ ...actionSlots, embark: null })
            }
        } else if (piloting) {
            setActionSlots({ ...actionSlots, accelerate: null })
        } else if (spying) {
            setActionSlots({ ...actionSlots, spy: null })
        } else if (minipodSpawning) {
            setActionSlots({ ...actionSlots, minipod: null })
        } else if (remotePiloting) {
            setSpecialActionSlots({ ...specialActionSlots, pilot: null })
        } else if (boarding) {
            setSpecialActionSlots({ ...specialActionSlots, board: null })
        } else if (programming) {
            setSpecialActionSlots({ ...specialActionSlots, program: null })
        }
        setPiloting(false)
        setEmbarking(false)
        setSpying(false)
        setMinipodSpawning(false)
        setRemotePiloting(false)
        setBoarding(false)
        setSelectedSector(null)
        setSelectedPod(null)
        setSelectedCrewmate(null)
        setSelectedShelterCard(null)
        setSelectedBeacon(null)
        setSelectedLine(null)
        setSelectingPod(false)
        setSelectingCrewmate(false)
        setSelectingSector(false)
        setSelectingShelterCard(false)
        setSelectingBeacon(false)
        setSelectingLine(false)
        setCrasher1(null)
        setCrasher2(null)
        setCrashSector1(null)
        setCrashSector2(null)
    }

    function checkActionsState() {
        console.log("piloting " + piloting)
        console.log("embarking " + embarking)
        console.log("spying " + spying)
        console.log("minipodSpawning " + minipodSpawning)
        console.log("remotePiloting " + remotePiloting)
        console.log("boarding " + boarding)
        console.log("selectingPod " + selectingPod)
        console.log("selectingCrewmate " + selectingCrewmate)
        console.log("selectingSector " + selectingSector)
        console.log("selectingShelterCard " + selectingShelterCard)
        console.log("selectingBeacon " + selectingBeacon)
        console.log("selectingLine " + selectingLine)
        console.log("crasher1 " + crasher1)
        console.log("crasher2 " + crasher2)
        console.log("crashSector1 " + crashSector1)
        console.log("crashSector2 " + crashSector2)
        console.log(selectedSector)
        console.log(selectedPod)
        console.log(selectedCrewmate)
        console.log(selectedShelterCard)
        console.log(selectedBeacon)
        console.log(selectedLine)
    }

    const [alertMessage, setAlertMessage] = useState("");
    const [visible, setVisible] = useState(false);
    function ShowAlert(message, timeout) {
        setAlertMessage(message);
        setVisible(true);
        timeout = timeout ? timeout : 2000;
        setTimeout(() => {
            setVisible(false);
        }, timeout);
    }


    return (
        <>

            {!emptyChecker("array", sectors) && !emptyChecker("array", lines) && !emptyChecker("array", pods) &&
                !emptyChecker("array", shelterCards) && !emptyChecker("array", lines) &&
                <div className="game-page-container">
                    <Alert isOpen={visible} style={{
                        position: "absolute", zIndex: 1000, width: "40%", textAlign: "center",
                        left: 0, right: 0, top: "100px", marginLeft: "auto", marginRight: "auto", borderRadius: 15,
                        backgroundColor: "rgba(0, 11, 4, 0.864)", borderColor: "#00FF66", color: "#00FF66"
                    }}>
                        {alertMessage}
                    </Alert>
                    <Alert style={{
                        position: "absolute", zIndex: 1000, width: "600px", textAlign: "center", paddingTop: 2, paddingBottom: 2,
                        paddingRight: 2, paddingLeft: 2, left: 0, right: 0, bottom: -5, marginLeft: "10px", borderRadius: 12,
                        fontSize: 14, fontWeight: "lighter", backgroundColor: "rgba(11, 7, 0, 0.864)",
                        borderColor: "#ff9d00", color: "#ff9d00"
                    }}>
                        WARNING: Avoid reloading the page during the game. An alert should show after every click when selecting actions or items. If it doesn't, please wait a second and click again.
                    </Alert>
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
                        {lines.map((line, index) => (
                            <div key={index}>
                                <Line x={lineX[line.number]} y={lineY[line.number]} line={line} />
                            </div>
                        ))}
                    </div>
                    <div style={{ height: "100%", width: "180px", position: "absolute", left: 710 }}>
                        <div style={{ position: "absolute", top: 90, left: "-60px", height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.find(res => res.sector.number === 11)} />
                        </div>
                        <div style={{ position: "absolute", top: 245, height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.filter(res => res.sector.number === 12)[0]} />
                        </div>
                        <div style={{ position: "absolute", top: 405, height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.filter(res => res.sector.number === 12)[1]} />
                        </div>
                        <div style={{ position: "absolute", top: 565, left: "-60px", height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.find(res => res.sector.number === 13)} />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: 900, marginTop: 70, height: "100%", alignContent: "center", alignItems: "center" }}>
                        <ExplosionCard />
                        <UnusedBeacons />
                        {!emptyChecker("array", crewmates) &&
                            <UnusedCrewmates actionSlots={actionSlots} specialActionSlots={specialActionSlots} />
                        }
                        <ActionCards />
                        <div style={{ display: "flex", flexDirection: "row" }}>
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
                                console.log(actionSlots)
                                console.log(shelterCards.find(shelterCard => shelterCard.sector.number === 11))
                                ShowAlert("Troncos lanzados")
                                //                                checkActionsState()
                                console.log(game.explosions)
                            }}>
                                troncos
                            </Button>
                            {(selectingBeacon || selectingCrewmate || selectingPod || selectingSector || selectingLine ||
                                selectingShelterCard || piloting || embarking || spying || minipodSpawning || remotePiloting ||
                                boarding) &&
                                <Button className="button" style={{
                                    backgroundColor: "#ff8368",
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
                                    handleCancel()
                                }}>
                                    Cancelar accion
                                </Button>
                            }
                        </div>
                    </div>
                </div >
            }
        </>

    );
}
