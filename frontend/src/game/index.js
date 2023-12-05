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
    const [sectors, setSectors] = useState([]);
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

    const hangarX = [ -30, 30, 30, -10, -20, 20 ] //coordenadas X del hangar para [pod3, pod21, pod22, pod11, pod12, pod13]
    const hangarY = [ 199, 92, 310, -10, 410, 410 ] // coordenadas Y del hangar para [pod3, pod21, pod22, pod11, pod12, pod13]

    const [coordPod3, setCoordPod3] = useState([-30, 199])

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer();
            GetGame();
        }
    }, [jwt])

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
        setSectors(await itemGetters.fetchSectors(currentGame.id, jwt));
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

    async function fetchGameItems() {
        setSectors(await itemGetters.fetchSectors(game.id, jwt));
    }

    // pod de capacidad 3
    const pod3 =
        <div className="pod3" style={true ? { left: hangarX[0], top: hangarY[0] } : null}>
        </div>

    // pods de capacidad 2
    const pod21 =
        <div className="pod2" style={true ? { left: hangarX[1], top: hangarY[1] } : null}>
        </div>

    const pod22 =
        <div className="pod2" style={true ? { left: hangarX[2], top: hangarY[2] } : null}>
        </div>

    // pods de capacidad 1
    const pod11 =
        <div className="pod1" style={true ? { left: hangarX[3], top: hangarY[3] } : null}>
        </div>

    const pod12 =
        <div className="pod1" style={true ? { left: hangarX[4], top: hangarY[4] } : null}>
        </div>

    const pod13 =
        <div className="pod1" style={true ? { left: hangarX[5], top: hangarY[5] } : null}>
        </div>

    function Sector(props) {
        return (
            <div style={{ width: 100, height: 100, position: "absolute", left: props.x, top: props.y }}>
                <Button style={{ border: "none", width: 100, height: 100, borderRadius: 50, boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s" }}>
                    {props.sector.number}
                </Button>
            </div>
        )
    }

    function movePodDemo(sector) {
        setCoordPod3([x[sector], y[sector]])
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
            {!emptyChecker("array", sectors) &&
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
                        {pod3}
                        {pod21}
                        {pod22}
                        {pod11}
                        {pod12}
                        {pod13}
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
                            movePodDemo(3)
                        }}>
                            SECTOR 3
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
                            movePodDemo(4)
                        }}>
                            SECTOR 4
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
                            movePodDemo(10)
                            console.log(sectors)
                        }}>
                            SECTOR 10
                        </Button>
                    </div>
                </div >
            }
        </>

    );

}