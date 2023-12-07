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


    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer();
            GetGame();
            refresher();
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
        setGame(currentGame);
        setSectors(await itemGetters.fetchSectors(currentGame.id, jwt));
        setBeacons(await itemGetters.fetchBeacons(currentGame.id, jwt));
        setLines(await itemGetters.fetchLines(currentGame.id, jwt));
        setCrewmates(await itemGetters.fetchCrewmates(currentGame.id, jwt));
        setPods(fetchedPods);
        setGamePlayers(await itemGetters.fetchGamePlayers(currentGame.id, jwt));
        setShelterCards(await itemGetters.fetchShelterCards(currentGame.id, jwt));
        setSlotInfos(await itemGetters.fetchSlotInfos(currentGame.id, jwt));
        podSetter(fetchedPods);
    }

    async function podSetter(pods) {
        // pod de capacidad 3
        setPod1(
            emptyChecker("array", pods) ? "XD" : {
                data: pods.find(pod => pod.number === 1),
                html:
                    <div className="pod3" style={pods.find(pod => pod.number === 1).sector === null ? { left: hangarX[0], top: hangarY[0] } : null}>
                    </div>
            })
        // pods de capacidad 2
        setPod2(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 2),
                html:
                    <div className="pod2" style={pods.find(pod => pod.number === 2).sector === null ? { left: hangarX[1], top: hangarY[1] } : null}>
                    </div>
            }
        )
        setPod3(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 3),
                html:
                    <div className="pod2" style={pods.find(pod => pod.number === 3).sector === null ? { left: hangarX[2], top: hangarY[2] } : null}>
                    </div>
            }
        )
        // pods de capacidad 1
        setPod4(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 4),
                html:
                    <div className="pod1" style={pods.find(pod => pod.number === 4).sector === null ? { left: hangarX[3], top: hangarY[3] } : null}>
                    </div>
            }
        )
        setPod5(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 5),
                html:
                    <div className="pod1" style={pods.find(pod => pod.number === 5).sector === null ? { left: hangarX[4], top: hangarY[4] } : null}>
                    </div>
            }
        )
        setPod6(
            emptyChecker("array", pods) ? null : {
                data: pods.find(pod => pod.number === 6),
                html:
                    <div className="pod1" style={pods.find(pod => pod.number === 6).sector === null ? { left: hangarX[5], top: hangarY[5] } : null}>
                    </div>
            }
        )
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

    /*
        // pod de capacidad 3
        const pod1 = emptyChecker("array", pods) ? null :{
            data: pods.find(pod => pod.number === 1),
            html:
                <div className="pod3" style={pods.find(pod => pod.number === 1).sector === null ? { left: hangarX[0], top: hangarY[0] } : null}>
                </div>
        }
    
        // pods de capacidad 2
        const pod2 = emptyChecker("array", pods) ? null : {
            data: pods.find(pod => pod.number === 2),
            html:
                <div className="pod2" style={pods.find(pod => pod.number === 2).sector === null ? { left: hangarX[1], top: hangarY[1] } : null}>
                </div>
        }
    
        const pod3 = emptyChecker("array", pods) ? null : {
            data: pods.find(pod => pod.number === 3),
            html:
                <div className="pod2" style={pods.find(pod => pod.number === 3).sector === null? { left: hangarX[2], top: hangarY[2] } : null}>
                </div>
        }
    
        // pods de capacidad 1
        const pod4 = emptyChecker("array", pods) ? null : {
            data: pods.find(pod => pod.number === 4),
            html:
                <div className="pod1" style={pods.find(pod => pod.number === 4).sector === null ? { left: hangarX[3], top: hangarY[3] } : null}>
                </div>
        }
    
        const pod5 = emptyChecker("array", pods) ? null : {
            data: pods.find(pod => pod.number === 5),
            html:
                <div className="pod1" style={pods.find(pod => pod.number === 5).sector === null ? { left: hangarX[4], top: hangarY[4] } : null}>
                </div>
        }
    
        const pod6 = emptyChecker("array", pods) ? null : {
            data: pods.find(pod => pod.number === 6),
            html:
                <div className="pod1" style={pods.find(pod => pod.number === 6).sector === null ? { left: hangarX[5], top: hangarY[5] } : null}>
                </div>
        }
    */

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
                <Button style={{ border: "none", opacity: 0.3, width: 100, height: 100, borderRadius: 50, boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s" }}>
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
                            width: 300,
                            fontSize: 35,
                            borderRadius: 20,
                            height: 100,
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
                            width: 300,
                            fontSize: 35,
                            borderRadius: 20,
                            height: 100,
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
                            width: 300,
                            fontSize: 35,
                            borderRadius: 20,
                            height: 100,
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
                            width: 300,
                            fontSize: 35,
                            borderRadius: 20,
                            height: 100,
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
                            width: 300,
                            fontSize: 35,
                            borderRadius: 20,
                            height: 100,
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
                        }}>
                            pruebita xd
                        </Button>
                    </div>
                </div >
            }
        </>

    );

}