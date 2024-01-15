import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Alert } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import "../static/css/game/game.css";
import scrap from "../static/images/scrap.png";
import itemGetters from "./itemGetters";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { IoIosFlask } from "react-icons/io";
import { ImShield } from "react-icons/im";


export default function Game() {
    const [roles, setRoles] = useState([]);
    const [myPlayer, setMyPlayer] = useState({})
    const [game, setGame] = useState({});

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
    const [accelerating, setAccelerating] = useState(false);
    const [embarking, setEmbarking] = useState(false);
    const [spying, setSpying] = useState(false);
    const [boarding, setBoarding] = useState(false)
    const [programming, setProgramming] = useState(false)
    const [piloting, setPiloting] = useState(false)
    const [minipodSpawning, setMinipodSpawning] = useState(false)

    const [selectingSector, setSelectingSector] = useState(false);
    const [selectingPod, setSelectingPod] = useState(false);
    const [selectingCrewmate, setSelectingCrewmate] = useState(false);
    const [selectingShelterCard, setSelectingShelterCard] = useState(false);
    const [selectingBeacon, setSelectingBeacon] = useState(false);
    const [selectingLine, setSelectingLine] = useState(false);

    const [selectedSector, setSelectedSector] = useState({});
    const [selectedPod, setSelectedPod] = useState({});
    const [selectedCrewmate, setSelectedCrewmate] = useState(null);
    const [selectedShelterCard, setSelectedShelterCard] = useState({});
    const [selectedBeacon, setSelectedBeacon] = useState({});
    const [selectedLine, setSelectedLine] = useState({});

    const [crasher1, setCrasher1] = useState(null)
    const [crasher2, setCrasher2] = useState(null) //teniendo en cuenta que puede haber choques en cadena, la cadena más larga sería de dos choques
    const [crashSector1, setCrashSector1] = useState(null)
    const [crashSector2, setCrashSector2] = useState(null)

    const [spiedCrewmates, setSpiedCrewmates] = useState([])

    const [lastRound, setLastRound] = useState(false)
    const [playableSectorsNumbers, setPlayableSectorsNumbers] = useState(null)

    const [selectingAction, setSelectingAction] = useState(false)
    const [selectedAction, setSelectedAction] = useState(null)
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
    const gameId = parseInt(window.location.href.split("/")[4])

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
        }, 5000);
        return () => {
            clearInterval(intervalID);
        };
    }

    async function refresherSetters() {
        const fetchedGame = await fetchCurrentGame();
        setGame(fetchedGame);
        const fetchedPods = await itemGetters.fetchPods(gameId, jwt);
        setPods(fetchedPods);
        const fetchedCrewmates = await itemGetters.fetchCrewmates(gameId, jwt);
        setCrewmates(fetchedCrewmates);
        const fetchedLines = await itemGetters.fetchLines(gameId, jwt);
        setLines(fetchedLines);
        const fetchedSectors = await itemGetters.fetchSectors(gameId, jwt);
        setSectors(fetchedSectors);
        const fetchedGamePlayers = await itemGetters.fetchGamePlayers(gameId, jwt);
        setGamePlayers(fetchedGamePlayers);
        const fetchedShelterCards = await itemGetters.fetchShelterCards(gameId, jwt);
        setShelterCards(fetchedShelterCards);
        const playableSectorsNumbers = isLastRound(fetchedSectors);
        isGameFinished(fetchedGamePlayers, playableSectorsNumbers, fetchedPods, fetchedShelterCards);
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
        const fetchedSectors = await itemGetters.fetchSectors(currentGame.id, jwt);
        setPods(await itemGetters.fetchPods(currentGame.id, jwt));
        setCrewmates(await itemGetters.fetchCrewmates(currentGame.id, jwt));
        setSectors(fetchedSectors);
        isLastRound(fetchedSectors);
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

    function isLastRound(sectors) {
        let scrappedSectorsNumbers = sectors.filter(sector => sector.scrap).map(sector => sector.number);
        let playableSectorsNumbers = null
        if ((scrappedSectorsNumbers.includes(4) && scrappedSectorsNumbers.includes(5) && scrappedSectorsNumbers.includes(6))) {
            setLastRound(true)
            playableSectorsNumbers = [7, 8, 9, 10, 11, 12, 13]
            setPlayableSectorsNumbers(playableSectorsNumbers)
        } else if (scrappedSectorsNumbers.includes(4) && scrappedSectorsNumbers.includes(8) && scrappedSectorsNumbers.includes(6)) {
            setLastRound(true)
            playableSectorsNumbers = [7, 9, 10, 11, 12, 13]
            setPlayableSectorsNumbers(playableSectorsNumbers)
        } else if (scrappedSectorsNumbers.includes(4) && scrappedSectorsNumbers.includes(8) && scrappedSectorsNumbers.includes(9)) {
            setLastRound(true)
            playableSectorsNumbers = [7, 10, 11, 12, 13]
            setPlayableSectorsNumbers(playableSectorsNumbers)
        } else if (scrappedSectorsNumbers.includes(6) && scrappedSectorsNumbers.includes(8) && scrappedSectorsNumbers.includes(7)) {
            setLastRound(true)
            playableSectorsNumbers = [9, 10, 11, 12, 13]
            setPlayableSectorsNumbers(playableSectorsNumbers)
        } else if (scrappedSectorsNumbers.includes(7) && scrappedSectorsNumbers.includes(8) && scrappedSectorsNumbers.includes(9)) {
            setLastRound(true)
            playableSectorsNumbers = [10, 11, 12, 13]
            setPlayableSectorsNumbers(playableSectorsNumbers)
        } else if (scrappedSectorsNumbers.includes(7) && scrappedSectorsNumbers.includes(10) && scrappedSectorsNumbers.includes(9)) {
            setLastRound(true)
            playableSectorsNumbers = [11, 12, 13]
            setPlayableSectorsNumbers(playableSectorsNumbers)
        }
        return playableSectorsNumbers
    }

    function isGameFinished(gamePlayers, playableSectorsNumbers, pods, shelterCards) {
        let finished = false
        let noMoreTurns = gamePlayers.filter(gamePlayer => gamePlayer.noMoreTurns === true).length === gamePlayers.length
        console.log(noMoreTurns)
        let noPlayablePods = playableSectorsNumbers && (pods.filter(pod => pod.sector && playableSectorsNumbers.includes(pod.sector.number)).length === 0)
        console.log(playableSectorsNumbers)
        console.log(noPlayablePods)
        let allSheltersFull = shelterCards.filter(shelterCard => shelterCard.explosion === 6).length === 4
        console.log(allSheltersFull)
        if (noMoreTurns || noPlayablePods || allSheltersFull) {
            finished = true
        }
        if (finished) {
            ShowAlert("The game has finished! You will be sent to the scoreboard soon", 10000)
            setSpiedCrewmates(shelterCards.map(shelterCard => GetCrewmatesFromShelter(shelterCard)))
            setTimeout(() => {
                fetch(`/api/v1/games/${gameId}/finish`, {
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',
                })
                window.location.href = "/game/" + gameId + "/scores"
            }, 6000);
        }
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
                    if (lastRound && !playableSectorsNumbers.includes(props.pod.sector ? props.pod.sector.number : null)) {
                        ShowAlert("There is an impassible barrier, so you cannot use this pod")
                    } else if (selectingPod) {
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
                } else if (lastRound && !playableSectorsNumbers.includes(props.crewmate.pod ? props.crewmate.pod.sector.number : null) && !selectingAction) {
                    ShowAlert("There is an impassible barrier, so you cannot use this crewmate")
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
                {GetCrewmatesFromShelter(props.shelterCard).sort((a, b) => a.arrivalOrder - b.arrivalOrder).map((crewmate, index) => (
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
        const alreadyActioning = embarking || accelerating || spying || boarding || programming || piloting || minipodSpawning
        return (
            <div style={{ display: "flex", flexDirection: "row", width: 480, height: 170, position: "relative" }}>
                <div className={gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color.toLowerCase() + "-action-card"}>
                    <div style={{ position: "absolute", left: 92, top: 20, width: 40, height: 40 }}
                        onClick={() => {
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!actionSlots.embark) {
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                setSelectedAction("embark");
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
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!actionSlots.embark || actionSlots.embark.length === 1) {
                                setSelectingCrewmate(true);
                                setSelectingAction(true);
                                setSelectedAction("embark");
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
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!actionSlots.accelerate) {
                                setSelectedAction("accelerate");
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
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!actionSlots.spy) {
                                setSelectedAction("spy");
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
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!actionSlots.minipod) {
                                setSelectedAction("minipod");
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
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!specialActionSlots.board) {
                                setSelectedAction("board");
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
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!specialActionSlots.program) {
                                setSelectedAction("program");
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
                    <div style={{ position: "absolute", left: 65, top: 89.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!specialActionSlots.pilot) {
                                setSelectedAction("pilot");
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
                    <div style={{ position: "absolute", left: 160.5, top: 89.5, width: 40, height: 40 }}
                        onClick={() => {
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).noMoreTurns) {
                                ShowAlert("You already used a turn in the last round, the game will end soon")
                            } else if (!(game.activePlayer.id === myPlayer.id)) {
                                ShowAlert("It's not your turn!")
                            } else if (alreadyActioning) {
                                ShowAlert("You are already doing an action")
                            } else if (!specialActionSlots.refresh) {
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
                    spendAction()
                }
            }}>
                <p style={{ color: "#ff7354", fontSize: 25, marginTop: 16 }}>{game.explosions[0]}</p>
            </div>
        )
    }

    function actionSlotSetter(crewmate) {
        if (selectedAction === "embark") {
            if (!actionSlots.embark) {
                setActionSlots({ ...actionSlots, embark: [crewmate] })
            } else {
                setActionSlots({ ...actionSlots, embark: [...actionSlots.embark, crewmate] })
            }
            setEmbarking(true);
            ShowAlert("Click on any of your crewmates")
        } else if (selectedAction === "accelerate") {
            setActionSlots({ ...actionSlots, accelerate: crewmate })
            setSelectingCrewmate(false);
            setAccelerating(true);
            setSelectingPod(true);
            ShowAlert("Click on any pod where you have at least one of your crewmates to accelerate")
        } else if (selectedAction === "spy") {
            setActionSlots({ ...actionSlots, spy: crewmate })
            setSelectingCrewmate(false);
            setSpying(true);
            setSelectingPod(true);
            setSelectingShelterCard(true);
            ShowAlert("Click on the pod or shelter you want to spy")
        } else if (selectedAction === "minipod") {
            setActionSlots({ ...actionSlots, minipod: crewmate })
            setMinipodSpawning(true);
            ShowAlert("Click on any of your crewmates")
        } else if (selectedAction === "pilot") {
            setSpecialActionSlots({ ...specialActionSlots, pilot: crewmate })
            setSelectingCrewmate(false);
            setPiloting(true);
            setSelectingPod(true);
            ShowAlert("Click on any pod to pilot it")
        } else if (selectedAction === "board") {
            setSpecialActionSlots({ ...specialActionSlots, board: crewmate })
            setBoarding(true);
            ShowAlert("Click on any of your crewmates")
        } else if (selectedAction === "program") {
            setSpecialActionSlots({ ...specialActionSlots, program: crewmate })
            setSelectingCrewmate(false);
            setProgramming(true);
            setSelectingBeacon(true);
            ShowAlert("Click on any beacon or click the explosion card to place it at the end of the deck")
        } else {
            setSelectingCrewmate(false);
            setSpecialActionSlots({ ...specialActionSlots, board: null, pilot: null, program: null, refresh: crewmate })
            ShowAlert("Special action card refreshed")
            spendAction()
        }
        setSelectingAction(false)
        setSelectedAction(null)
        setSelectedCrewmate(null)
    }

    async function movePod(pod, sector) {
        const movedPod = {
            emptySlots: pod.emptySlots,
            capacity: pod.capacity,
            number: pod.number,
            sector: sector,
            game: game

        }
        await fetch(`/api/v1/pods/${pod.id}`, {
            headers: {
                "Authorization": ` Bearer ${jwt}`,
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
                "Authorization": ` Bearer ${jwt}`,
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
                "Authorization": `Bearer ${jwt}`,
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
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(modifiedSector)
        })
        setSectors(await itemGetters.fetchSectors(gameId, jwt))

        const upToDateGame = await fetchCurrentGame()
        const modifiedGame = {
            numPlayers: upToDateGame.numPlayers,
            start: upToDateGame.start,
            finish: upToDateGame.finish,
            status: upToDateGame.status,
            explosions: upToDateGame.explosions.slice(1),
            players: upToDateGame.players,
            activePlayer: upToDateGame.activePlayer
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

        isLastRound(await itemGetters.fetchSectors(gameId, jwt))
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
            status: game.status,
            activePlayer: game.activePlayer
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
                "Authorization": `Bearer ${jwt}`,
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

    function freeMovementChecker(sector1, sector2, pod) {
        const sector1LinesIds = sector1.lines.map(line => line.id)
        const sector2LinesIds = sector2.lines.map(line => line.id)
        const lineBetween = lines.find(line => sector1LinesIds.includes(line.id) && sector2LinesIds.includes(line.id))
        const podCrewmatesColors = GetCrewmatesFromPod(pod).map(crewmate => crewmate.color)
        const myColor = gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).color
        if (lineBetween.beacon && podCrewmatesColors.includes(myColor)
            && (myColor === lineBetween.beacon.color1 || myColor === lineBetween.beacon.color2)) {
            return true
        }

    }

    async function sectorClickHandler(sector) {
        setSelectedSector(sector)
        if ((accelerating || piloting) && selectingSector) {
            if ((!selectedPod.sector && adjacencyList[0].includes(sector.number)) || (selectedPod.sector && adjacencyList[selectedPod.sector.number].includes(sector.number))) {
                if (sector.scrap) {
                    ShowAlert("You cannot move the pod to a sector with scrap in it")
                } else if (crasher1 && (crasher1.sector.number === sector.number)) {
                    if (crasher2) {
                        await movePod(crasher1, null)
                        await movePod(selectedPod, sector)
                        await movePod(crasher2, crashSector2)
                        await movePod(crasher1, crashSector1)
                        if (!freeMovementChecker(crasher1.sector, crasher2.sector, crasher1)) {
                            spendAction()
                        } else {
                            if (accelerating) {
                                setActionSlots({ ...actionSlots, accelerate: null })
                            } else {
                                setSpecialActionSlots({ ...specialActionSlots, pilot: null })
                            }
                        }
                        setCrasher1(null)
                        setCrashSector1(null)
                        setCrasher2(null)
                        setCrashSector2(null)
                        setSelectingSector(false)
                        setSelectingPod(false)
                        setAccelerating(false)
                        setPiloting(false)
                    } else if (!hasPossibleMoves(selectedPod)) {
                        await movePod(crasher1, null)
                        await movePod(selectedPod, sector)
                        await movePod(crasher1, crashSector1)
                        if (!freeMovementChecker(crasher1.sector, selectedPod.sector, crasher1)) {
                            spendAction()
                        } else {
                            if (accelerating) {
                                setActionSlots({ ...actionSlots, accelerate: null })
                            } else {
                                setSpecialActionSlots({ ...specialActionSlots, pilot: null })
                            }
                        }
                        setCrasher1(null)
                        setCrashSector1(null)
                        setSelectingSector(false)
                        setSelectingPod(false)
                        setAccelerating(false)
                        setPiloting(false)
                    } else {
                        ShowAlert("You cannot move the crashed pod to that sector unless you have no other possible moves")
                    }
                } else if (pods.find(pod => pod.sector && (pod.sector.id === sector.id)) && (pods.find(pod => pod.sector && (pod.sector.id === sector.id)).capacity >= selectedPod.capacity)) {
                    ShowAlert("You cannot crash with a larger pod")
                } else if (!pods.find(pod => pod.sector && (pod.sector.id === sector.id))) {
                    ShowAlert("The pod was moved to the selected sector")
                    if (crasher2) {
                        await movePod(selectedPod, sector)
                        await movePod(crasher2, crashSector2)
                        await movePod(crasher1, crashSector1)
                        if (!freeMovementChecker(crasher1.sector, crasher2.sector, crasher1)) {
                            spendAction()
                        } else {
                            if (accelerating) {
                                setActionSlots({ ...actionSlots, accelerate: null })
                            } else {
                                setSpecialActionSlots({ ...specialActionSlots, pilot: null })
                            }
                        }
                        setCrasher1(null)
                        setCrashSector1(null)
                        setCrasher2(null)
                        setCrashSector2(null)
                    } else if (crasher1) {
                        await movePod(selectedPod, sector)
                        await movePod(crasher1, crashSector1)
                        if (!freeMovementChecker(crasher1.sector, selectedPod.sector, crasher1)) {
                            spendAction()
                        } else {
                            if (accelerating) {
                                setActionSlots({ ...actionSlots, accelerate: null })
                            } else {
                                setSpecialActionSlots({ ...specialActionSlots, pilot: null })
                            }
                        }
                        setCrasher1(null)
                        setCrashSector1(null)
                    } else {
                        movePod(selectedPod, sector)
                        if (!freeMovementChecker(selectedPod.sector, sector, selectedPod)) {
                            spendAction()
                        } else {
                            if (accelerating) {
                                setActionSlots({ ...actionSlots, accelerate: null })
                            } else {
                                setSpecialActionSlots({ ...specialActionSlots, pilot: null })
                            }
                        }
                    }
                    setSelectingSector(false)
                    setSelectingPod(false)
                    setAccelerating(false)
                    setPiloting(false)
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
                if (selectedPod.sector && selectedPod.sector.number === sector.number) {
                    ShowAlert("You cannot move the pod to the same sector")
                } else {
                    ShowAlert("You cannot move the pod to a not adjacent sector")
                }
            }

        } else if (embarking) {
            if (sector.number === 1 || sector.number === 2 || sector.number === 3) {
                movePod(selectedPod, sector)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setEmbarking(false)
                setSelectingSector(false)
                spendAction()
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
                    spendAction()
                }
            }
        }
    }

    function podClickHandler(pod) {
        setSelectedPod(pod)

        if (accelerating) {

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
                    ShowAlert("The crewmate was moved to the selected pod")
                    if (!pod.sector) {
                        if (pod.number === 1 && (pods.filter(pod => pod.sector && pod.sector.number === 2).length === 0)) {
                            movePod(pod, sectors.find(sector => sector.number === 2));
                            setEmbarking(false)
                            spendAction()
                        } else if (pod.number === 2 && (pods.filter(pod => pod.sector && pod.sector.number === 1).length === 0)) {
                            movePod(pod, sectors.find(sector => sector.number === 1));
                            setEmbarking(false)
                            spendAction()
                        } else if (pod.number === 3 && (pods.filter(pod => pod.sector && pod.sector.number === 3).length === 0)) {
                            movePod(pod, sectors.find(sector => sector.number === 3));
                            setEmbarking(false)
                            spendAction()
                        } else if (pods.filter(pod => pod.sector && embarkSectorsNumbers.includes(pod.sector.number)).length === 3) {
                            ShowAlert("There are no available sectors next to the hangar")
                            setEmbarking(false)
                            moveCrewmate(selectedCrewmate, null, null)
                            if (actionSlots.embark && actionSlots.embark.length === 2) {
                                setActionSlots({ ...actionSlots, embark: actionSlots.embark.slice(0, 1) })
                            } else {
                                setActionSlots({ ...actionSlots, embark: null })
                            }
                        } else {
                            ShowAlert("Select one of the adjacent sectors to the hangar")
                            setSelectingSector(true);
                        }
                    } else {
                        setEmbarking(false)
                        spendAction()
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
                ShowAlert("The crewmate was moved to the selected pod")
                spendAction()
            } else {
                ShowAlert(`You cannot move your ${selectedCrewmate.role.toLowerCase()} to that pod`)
            }
        } else if (piloting) {
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
            spendAction()
        }
    }

    async function crewmateClickHandler(crewmate) {
        if (selectingAction) {
            if (!crewmate.pod && !crewmate.shelterCard) {
                actionSlotSetter(crewmate)
            } else {
                ShowAlert("You must use a crewmate from your reserve")
            }
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
                                spendAction()
                            } else {
                                moveCrewmate(selectedCrewmate, crewmate.pod, null)
                                moveCrewmate(crewmate, selectedCrewmate.pod, null)
                                ShowAlert("Crewmates swapped")
                                setSelectedCrewmate(null)
                                setSelectingCrewmate(false)
                                setBoarding(false)
                                spendAction()
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
                                spendAction()
                            } else {
                                moveCrewmate(selectedCrewmate, crewmate.pod, null)
                                moveCrewmate(crewmate, null, null)
                                ShowAlert("Crewmates swapped")
                                setSelectedCrewmate(null)
                                setSelectingCrewmate(false)
                                setBoarding(false)
                                spendAction()
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
            if (selectedCrewmate.pod && (selectedCrewmate.pod.sector.number === shelterCard.sector.number) && (GetCrewmatesFromShelter(shelterCard).length !== 5)) {
                moveCrewmate(selectedCrewmate, null, shelterCard)
                setSelectingPod(false)
                setSelectingCrewmate(false)
                setSelectingShelterCard(false)
                setEmbarking(false)
                setSelectedCrewmate(null)
                ShowAlert("The crewmate was moved to the selected shelter")
                spendAction()
            } else {
                if (GetCrewmatesFromShelter(shelterCard).length === 5) {
                    ShowAlert("You cannot move your crewmate to a shelter that is full")
                } else {
                    ShowAlert("You can only disembark a crewmate in a shelter adjacent to your pod")
                }
            }
        } else if (spying) {
            setSelectingPod(false)
            setSelectingShelterCard(false)
            setSpiedCrewmates(GetCrewmatesFromShelter(shelterCard))
            setTimeout(() => {
                setSpiedCrewmates([])
                setSpying(false)
            }, 5000)
            spendAction()
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
            if (!line.beacon && selectedBeacon) {
                if (!GetUnusedBeacons().includes(selectedBeacon)) {
                    moveBeacon(null, selectedBeaconLine) // porque si ya está usado, primero hay que sacar el beacon de la línea en la que está
                }
                ShowAlert("Beacon moved")
                moveBeacon(selectedBeacon, line)
                setSelectingLine(false)
                setProgramming(false)
                spendAction()
            } else if (line.beacon && selectedBeacon && GetUnusedBeacons().includes(selectedBeacon)) {
                ShowAlert("There is already a beacon in that line, select another one")
            } else if (line.beacon && selectedBeacon && !GetUnusedBeacons().includes(selectedBeacon)) {
                let selectedLineBeacon = line.beacon
                moveBeacon(null, selectedBeaconLine)
                moveBeacon(null, line)
                ShowAlert("Beacons swapped")
                moveBeacon(selectedBeacon, line)
                moveBeacon(selectedLineBeacon, selectedBeaconLine)
                setSelectingLine(false)
                setProgramming(false)
                spendAction()
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
        } else if (accelerating) {
            setActionSlots({ ...actionSlots, accelerate: null })
        } else if (spying) {
            setActionSlots({ ...actionSlots, spy: null })
        } else if (minipodSpawning) {
            setActionSlots({ ...actionSlots, minipod: null })
        } else if (piloting) {
            setSpecialActionSlots({ ...specialActionSlots, pilot: null })
        } else if (boarding) {
            setSpecialActionSlots({ ...specialActionSlots, board: null })
        } else if (programming) {
            setSpecialActionSlots({ ...specialActionSlots, program: null })
        }
        setAccelerating(false); setEmbarking(false); setSpying(false); setMinipodSpawning(false); setPiloting(false); setBoarding(false); setProgramming(false)
        setSelectedSector(null); setSelectedPod(null); setSelectedCrewmate(null); setSelectedShelterCard(null); setSelectedBeacon(null); setSelectedLine(null)
        setSelectingPod(false); setSelectingCrewmate(false); setSelectingSector(false); setSelectingShelterCard(false); setSelectingBeacon(false); setSelectingLine(false)
        setCrasher1(null); setCrasher2(null); setCrashSector1(null); setCrashSector2(null)
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

    async function nextTurn(skipping) {
        const patchedGame = await fetch(`/api/v1/games/${gameId}/nextTurn${lastRound ? "?lastRound=true" : ""}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
        })
        setGame(await patchedGame.json())
        setActionSlots({ embark: null, accelerate: null, spy: null, minipod: null })
        console.log(specialActionSlots.board, specialActionSlots.program, specialActionSlots.pilot)
        if (specialActionSlots.board && specialActionSlots.program && specialActionSlots.pilot) {
            setSpecialActionSlots({ ...specialActionSlots, board: null, program: null, pilot: null })
        }
        if (skipping) {
            handleCancel()
        }
    }

    async function spendAction(skipping) {
        const patchedGamePlayers = await fetch(`/api/v1/gamePlayers/${gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).id}/spendAction`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
        })
        const newGamePlayers = await patchedGamePlayers.json()
        setGamePlayers(newGamePlayers)
        if (newGamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).actions === 2) {
            nextTurn(skipping ? true : false)
        }

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
                    <Alert style={{
                        position: "absolute", zIndex: 1000, width: "auto", textAlign: "center", paddingTop: 2, paddingBottom: 2,
                        paddingRight: 5, paddingLeft: 5, top: 93, marginLeft: "10px", borderRadius: 12,
                        fontSize: 18, fontWeight: "lighter",
                        backgroundColor: gamePlayers.find(gamePlayer => gamePlayer.player.id === game.activePlayer.id).color,
                        borderColor: gamePlayers.find(gamePlayer => gamePlayer.player.id === game.activePlayer.id).color === "BLACK" ? "#FFFFFF" : "#000000",
                        color: gamePlayers.find(gamePlayer => gamePlayer.player.id === game.activePlayer.id).color === "BLACK" ? "#FFFFFF" : "#000000",
                    }}>
                        {game.activePlayer.id === myPlayer.id ? `Your turn (${gamePlayers.find(gamePlayer => gamePlayer.player.id === game.activePlayer.id).actions} actions left)` : game.activePlayer.user.username + "'s turn"}
                    </Alert>
                    {game.activePlayer.id === myPlayer.id &&
                        <Button className="button" style={{
                            backgroundColor: "#CFFF68",
                            border: "none",
                            width: 130,
                            fontSize: 20,
                            borderRadius: 15,
                            height: 50,
                            position: "absolute",
                            top: 85,
                            left: 510,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                        }} onClick={() => {
                            if (gamePlayers.find(gamePlayer => gamePlayer.player.id === myPlayer.id).actions === 2) {
                                nextTurn(true)
                            } else {
                                spendAction(true)
                            }
                        }}>
                            Skip turn
                        </Button>
                    }
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
                        <div style={{ position: "absolute", top: "15%", left: "-60px", height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.find(res => res.sector.number === 11)} />
                        </div>
                        <div style={{ position: "absolute", top: "35%", height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.filter(res => res.sector.number === 12)[0]} />
                        </div>
                        <div style={{ position: "absolute", top: "55%", height: 130, width: 179 }}>
                            <ShelterCard shelterCard={shelterCards.filter(res => res.sector.number === 12)[1]} />
                        </div>
                        <div style={{ position: "absolute", top: "75%", left: "-60px", height: 130, width: 179 }}>
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
                            {(selectingBeacon || selectingCrewmate || selectingPod || selectingSector || selectingLine ||
                                selectingShelterCard || accelerating || embarking || spying || minipodSpawning || piloting ||
                                boarding || programming) &&
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
