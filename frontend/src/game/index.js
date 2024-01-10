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

    const [programming, setProgramming] = useState(false)
    const [remotePiloting, setRemotePiloting] = useState(false)
    const [podjacking, setPodJacking] = useState(false)
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
        }, 4000);
        return () => {
            clearInterval(intervalID);
        };
    }

    async function refresherSetters() {
        setPods(await itemGetters.fetchPods(gameId, jwt));
        setCrewmates(await itemGetters.fetchCrewmates(gameId, jwt));
        setLines(await itemGetters.fetchLines(gameId, jwt));
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

    function hasPossibleMoves(pod) {
        let possibleMoves = adjacencyList[pod.sector.number].length
        for (let i = 0; i < adjacencyList[pod.sector.number].length; i++) {
            let sector = sectors.find(sector => sector.number === adjacencyList[pod.sector.number][i])
            if (sector.scrap || (pods.find(pod => pod.sector && pod.sector.number === sector.number) &&
                (pods.find(pod => pod.sector && pod.sector.number === sector.number).capacity >= pod.capacity))) {
                possibleMoves--
            }
        }
        return possibleMoves > 0
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
                    console.log("sector")
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
                if ([...Object.values(actionSlots), ...Object.values(specialActionSlots)]
                    .flat().map(actionCrewmate => actionCrewmate ? actionCrewmate.id : null).includes(props.crewmate.id)) {
                    ShowAlert("You cannot use a crewmate that is already in an action slot")
                } else if (selectingCrewmate && !props.crewmate.shelter) {
                    crewmateClickHandler(props.crewmate)
                }
            }}>
                <circle
                    cx={props.size === "s" ? "14.5" : "18.5"}
                    cy={props.size === "s" ? "14.5" : "18.5"}
                    r={props.size === "s" ? "14" : "18"}
                    stroke={props.crewmate.color !== "BLACK" ? "black" : "white"} strokeWidth="1" fill={props.crewmate.color}>
                </circle>
                {(gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id === props.crewmate.player.id || (spying && spiedCrewmates.includes(props.crewmate))) && // condicion incompleta, solo debe enseñar los crewmate de un pod o refugio conreto
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
            <div style={{ height: 135 }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id
                        && crewmate.role === "ENGINEER" && !crewmate.pod && !crewmate.shelterCard && !Object.values(actionSlots).includes(crewmate) && (actionSlots.embark ? !actionSlots.embark.includes(crewmate) : true) && !Object.values(specialActionSlots).includes(crewmate))
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))
                    }
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id
                        && crewmate.role === "SCIENTIST" && !crewmate.pod && !crewmate.shelterCard && !Object.values(actionSlots).includes(crewmate) && (actionSlots.embark ? !actionSlots.embark.includes(crewmate) : true) && !Object.values(specialActionSlots).includes(crewmate))
                        .map((crewmate, index) => (
                            <div key={index} style={{ marginRight: 3 }}>
                                <Crewmate crewmate={crewmate} />
                            </div>
                        ))
                    }
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    {crewmates.filter(crewmate => crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id
                        && crewmate.role === "CAPTAIN" && !crewmate.pod && !crewmate.shelterCard && !Object.values(actionSlots).includes(crewmate) && (actionSlots.embark ? !actionSlots.embark.includes(crewmate) : true) && !Object.values(specialActionSlots).includes(crewmate))
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
            <div style={{ display: "flex", flexDirection: "row", width: 480, height: 230, position: "relative" }}>
                <div className={gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color.toLowerCase() + "-action-card"}>
                    <div style={{ position: "absolute", left: 92, top: 20, width: 40, height: 40 }}
                        onClick={() => {
                            if (!actionSlots.embark) {
                                setEmbarking(true);
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else if (!selectingCrewmate) {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={actionSlots.embark ? actionSlots.embark[0] : null}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 138, top: 20, width: 40, height: 40 }}
                        onClick={() => {
                            if (actionSlots.embark && actionSlots.embark.length === 1) {
                                setEmbarking(true);
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else if (!selectingCrewmate) {
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
                            } else if (!selectingCrewmate) {
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
                            } else if (!selectingCrewmate) {
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
                            } else if (!selectingCrewmate) {
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
                            } else if (!selectingCrewmate) {
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
                            } else if (!selectingCrewmate) {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={specialActionSlots.pilot}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 65, top: 89.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (!specialActionSlots.pilot) {
                                setRemotePiloting(true);
                                setSelectingPod(true);
                                setSelectingAction(true);
                                setSelectingCrewmate(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else if (!selectingCrewmate) {
                                ShowAlert("The slot is not empty")
                            }
                        }}
                    >
                        <Crewmate crewmate={specialActionSlots.program}></Crewmate>
                    </div>
                    <div style={{ position: "absolute", left: 160.5, top: 89.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (!specialActionSlots.refresh) {
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                ShowAlert("Click on any of your reserve crewmates to spend it in this action")
                            } else if (!selectingCrewmate) {
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
                "Authorization": ` Bearer ${ jwt }`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(movedPod)
        })
        setPods(await itemGetters.fetchPods(gameId, jwt))
    }

    async function moveCrewmate(crewmate, pod, shelterCard) {
        const oldPod = crewmate.pod
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
                "Authorization": ` Bearer ${ jwt }`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(movedCrewmate)
        })

        const newCrewmates = await itemGetters.fetchCrewmates(gameId, jwt)
        console.log("LENGTH" + newCrewmates.filter(crewmate => crewmate.pod && oldPod && (crewmate.pod.number === oldPod.number)).length)
        if (oldPod && newCrewmates.filter(crewmate => crewmate.pod && oldPod && (crewmate.pod.number === oldPod.number)).length === 0) {
            movePod(oldPod, null)
        }
        setCrewmates(newCrewmates)
    }

    async function moveBeacon(beacon, line) {
        const modifiedLine = {
            beacon: beacon,
            number: line.number,
            game: game
        }
        await fetch(`/api/v1/lines/${line.id}`, {
            headers: {
                "Authorization": `Bearer ${ jwt }`,
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

                    alert('HAY CHATARRA NE EL SECTOR AL QUE QUIERES ACCEDER, ELIGE OTRO')


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
                        setSelectingSector(false)
                        setSelectingPod(false)
                        setPiloting(false)
                        setRemotePiloting(false)
                    } else if (!hasPossibleMoves(selectedPod)) {
                        await movePod(crasher1, null)
                        await movePod(selectedPod, sector)
                        await movePod(crasher1, crashSector1)
                        setCrasher1(null)
                        setCrashSector1(null)
                        setSelectingSector(false)
                        setSelectingPod(false)
                        setPiloting(false)
                        setRemotePiloting(false)
                    } else {
                        ShowAlert("You cannot move the crashed pod to that sector unless you have no other possible moves")
                    }
                } else if (pods.find(pod => pod.sector && (pod.sector.id === sector.id)) && (pods.find(pod => pod.sector && (pod.sector.id === sector.id)).capacity >= selectedPod.capacity)) {
                    console.log(pods.find(pod => pod.sector && (pod.sector.id === sector.id)))
                    console.log(selectedPod)
                    alert('NO PUEDES MOVER EL POD, HAY UNO MAS GRANDE EN EL SECTOR AL QUE ESTA LLENDO,selecciona otro')

                } else if (!pods.find(pod => pod.sector && (pod.sector.id === sector.id))) {

                    alert('al no haber obstaculos en el cmanino se movera el pod al sector indicado')
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
                    //se administra primero el movimiento del pod 'original' 
                    alert('has chocado un pod, elige a donde se dirigira el pod chocado')

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

        } else if (minipodSpawning) {
            if ((!selectedCrewmate.pod.sector && adjacencyList[0].includes(sector.number)) || (selectedCrewmate.pod.sector && adjacencyList[selectedCrewmate.pod.sector.number].includes(sector.number))) {
                if (sector.scrap || (pods.find(pod => pod.sector && (pod.sector.id === sector.id)) && (pods.find(pod => pod.sector && (pod.sector.id === sector.id)).capacity >= selectedPod.capacity))) {
                    alert('NO SE PUEDE MOVERL EL MINIPOD AL SECTOR DEBIDO A QUE ETA OBSTACULIZADO,SELECCIONA OTRO')
                } else if (!pods.find(pod => pod.sector && (pod.sector.id === sector.id))) {

                    alert('al no haber obstaculos en el sector indicado se ponda el minipod alli')
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
                alert(`HAS SELECCIONADO UN POD, ELIGE DONDE SE DIRIGIRA ESTE`)
            } else {
                alert('NO PUEDES SELECCIONAR UN POD QUE NO CONTENGA CREWMATES TUYOS PARA PILOTAR, SELECCIONA OTRA')

            }
        } else if (embarking) {
            //el pod seleccionado tieen espacio y esta en un sector adyacente o hangar
            if ((embarkSectorsNumbers.includes(pod.sector ? pod.sector.number : '') || !pod.sector) && (pod && GetCrewmatesFromPod(pod).length < pod.capacity)) {
                // el pod seleccionado es de 1cap y haya otros pods de 3 o 2 que se pueden seleccionar
                if (pod.number > 3 && pods.filter(pod => pod.number <= 3 && (!pod.sector || embarkSectorsNumbers.includes(pod.sector.number)) && GetCrewmatesFromPod(pod).length < pod.capacity).length >= 1) {
                    alert('NO PIUEDES EMBARCAR EN UN POD DE 1 SI TU TRIPULANTE PUEDE EMBARCAR EN UNO DE LOS PODS PREDETERMINADOS, SELECCIONA OTRO')

                    // el pod seleccionado no es de 1 o puede no haber pods de 3 o 2 disponibles
                } else {
                    moveCrewmate(selectedCrewmate, pod, null)
                    ShowAlert("The crewmate was moved to the selected pod")
                    if (!pod.sector) {
                        //pod 1 y que haya hueco en el sector asignado a este
                        if (pod.number === 1 && (pods.filter(pod => pod.sector && pod.sector.number === 2).length === 0)) {
                            movePod(pod, sectors.find(sector => sector.number === 2));
                            setEmbarking(false)

                            //pod 2 y que haya hueco en el sector asignado a este
                        } else if (pod.number === 2 && (pods.filter(pod => pod.sector && pod.sector.number === 1).length === 0)) {
                            movePod(pod, sectors.find(sector => sector.number === 1));
                            setEmbarking(false)

                            //pod 3 y que haya hueco en el sector asignado a este
                        } else if (pod.number === 3 && (pods.filter(pod => pod.sector && pod.sector.number === 3).length === 0)) {
                            movePod(pod, sectors.find(sector => sector.number === 3));
                            setEmbarking(false)
                        } else if (pods.filter(pod => pod.sector && embarkSectorsNumbers.includes(pod.sector.number)).length === 3) {
                            ShowAlert("There are no available sectors next to the hangar")
                            setEmbarking(false)
                            moveCrewmate(selectedCrewmate, null, null)
                        } else {
                            alert('Select one of the adjacent sectors to the hangar')
                            setSelectingSector(true);
                        }
                    } else {
                        setEmbarking(false)
                    }
                    setSelectingCrewmate(false)
                    setSelectingPod(false)
                    setSelectingShelterCard(false)
                    setSelectedCrewmate(null)
                }
            } else if ((selectedCrewmate.pod && adjacencyList[selectedCrewmate.pod.sector.number].includes(pod.sector.number)) && (pod && GetCrewmatesFromPod(pod).length < pod.capacity)) {
                moveCrewmate(selectedCrewmate, pod, null)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setEmbarking(false)
                setSelectedCrewmate(null)
                alert('el crewmate ha sido cambiado al nuevo pod')
            } else {
                ShowAlert(`You cannot move your ${selectedCrewmate.role.toLowerCase()} to that pod`)
            }
        } else if (remotePiloting) {
            if (GetCrewmatesFromPod(pod).length !== 0) {
                setSelectingPod(false)
                setSelectingSector(true)
                alert(`HAS SELECCIONADO UN POD, ELIGE DONDE SE DIRIGIRA ESTE`)
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

    function crewmateClickHandler(crewmate) {
        //refresher()
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
        } else if (minipodSpawning) {
            setSelectedCrewmate(crewmate)
            if (crewmate.player.id === gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id && crewmate.pod) {
                //no hay pods de 1 disponibles
                if (pods.filter(pod => pod.number > 3 && pod.sector && GetCrewmatesFromPod(pod).length !== 0).length >= 3) {
                    alert('NO HAY MINIPODS DISPONIBLES PARA INVOCARLOS')
                    setSelectingCrewmate(false)
                    setMinipodSpawning(false)
                } else {
                    alert('SELECCIONA DONDE QUIERES QUE SE ESTABLEZCA EL MINIPOD')
                    let minipod = pods.filter(pod => pod.number > 3 && (!pod.sector && pods.filter(pod => pod.number > 3 && GetCrewmatesFromPod(pod).length === 0)))[0]
                    setSelectedPod(minipod)
                    setSelectingSector(true)

                }
            } else {
                alert('SELECCIONA UNO DE TUS CREWMATES QUE ESTEN EN ALGUNA NAVE')
            }
        }
    }

    function shelterClickHandler(shelterCard) {
        setSelectedShelterCard(shelterCard)
        if (embarking) {
            console.log(selectedCrewmate.pod.sector.number)
            console.log(shelterCard.sector.number)
            if (selectedCrewmate.pod && (selectedCrewmate.pod.sector.number === shelterCard.sector.number)) {
                moveCrewmate(selectedCrewmate, null, shelterCard)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setSelectingShelterCard(false)
                setEmbarking(false)
                setSelectedCrewmate(null)
                ShowAlert("The crewmate was moved to the selected shelter")
            } else {
                ShowAlert("You can only disembark a crewmate in a shelter adjacent to your pod")
            }
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
            alert("Click on any line to place the beacon")
            setSelectingLine(true)
            setSelectingBeacon(false)
        }
    }

    function lineClickHandler(line) {
        //refresher()
        setSelectedLine(line)
        let selectedBeaconLine = lines.find(line => line.beacon && line.beacon.id === selectedBeacon.id)
        if (programming) {

            //mover beacon nuevo a linea desokupada
            if (!line.beacon && selectedBeacon) {

                if (!GetUnusedBeacons().includes(selectedBeacon)) {
                    moveBeacon(null, selectedBeaconLine)
                }
                alert('SE MOVERA EL BEACON A ESA LINEA')
                console.log(selectedBeacon)
                moveBeacon(selectedBeacon, line)
                setSelectingLine(false)
                setProgramming(false)

                // caso en el que se quiera hacer un intercambio en le que uno de los beacon es de nueva instalacion
            } else if (line.beacon && selectedBeacon && GetUnusedBeacons().includes(selectedBeacon)) {
                alert('YA EXISTE UN BEACON EN ESA LINEA, SELECCIONA OTRA')

                // intercambiar 2 beacon de sitio 
            } else if (line.beacon && selectedBeacon && !GetUnusedBeacons().includes(selectedBeacon)) {

                console.log(selectedBeacon)
                let selectedLineBeacon = line.beacon

                //limpiamos las lineas involucradas
                moveBeacon(null, selectedBeaconLine)
                moveBeacon(null, line)
                alert('SE INTERCAMBIARAN DE LUGAR LOS BEACON')
                //movemos los beacons  asus nuevos sitios
                moveBeacon(selectedBeacon, line)
                moveBeacon(selectedLineBeacon, selectedBeaconLine)

                setSelectingLine(false)
                setProgramming(false)
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
        setPodJacking(false)
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

    return (
        <>

            {!emptyChecker("array", sectors) && !emptyChecker("array", lines) && !emptyChecker("array", pods) &&
                !emptyChecker("array", shelterCards) && !emptyChecker("array", lines) &&
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
                                setPiloting(true);
                                setSelectingPod(true);
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
                                setEmbarking(true);
                                setSelectingCrewmate(true);
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
                                setProgramming(prevProgramming => !prevProgramming);
                                setSelectingBeacon(prevSelectingBeacon => !prevSelectingBeacon);
                                alert("Click on any of the beacons")
                                console.log(programming)
                            }}>
                                PROGRAMAR
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
                                alert("Click on the pod or shelter you want to spy")
                                setSpying(true);
                                setSelectingPod(true);
                                setSelectingShelterCard(true);
                            }}>
                                ESPIAR
                            </Button>
                        </div>
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
                                setSelectingBeacon(true);
                                alert("click on any beacon")
                            }}>
                                bacon
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
                                setRemotePiloting(true);
                                setSelectingPod(true);
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
                                setPodJacking(true);
                                setSelectingCrewmate(true);
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
                                setMinipodSpawning(true);
                                setSelectingCrewmate(true);
                                alert("Click on any of your crewmates")
                                console.log(minipodSpawning)
                            }}>
                                INVOCAR MINIPOD
                            </Button>
                        </div>
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
                                GetGameData()
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
                                console.log(actionSlots)
                                console.log(shelterCards.find(shelterCard => shelterCard.sector.number === 11))
                                ShowAlert("Troncos lanzados")
                                                                checkActionsState()
                                console.log(game.explosions)
                                console.log(hasPossibleMoves(pods.find(pod => pod.number === 2)))
                            }}>
                                troncos
                            </Button>
                            {(selectingBeacon || selectingCrewmate || selectingPod || selectingSector || selectingLine ||
                                selectingShelterCard || piloting || embarking || spying || minipodSpawning || remotePiloting ||
                                podjacking) &&
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
                                fetch(`/api/v1/crewmates?gameid=` + game.id, {
                                    headers: {
                                        "Authorization": `Bearer ${ jwt }`,
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    method: 'DELETE'
                                })
                            }}>
                                borrar crewmates d juego
                            </Button>
                        </div>
                        <UnusedBeacons />
                        {!emptyChecker("array", crewmates) &&
                            <UnusedCrewmates />
                        }
                        <ActionCards />

                    </div>
                </div >
            }
        </>

    );
}
