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


export default function Game() {
    const [roles, setRoles] = useState([]);
    const [myPlayer, setMyPlayer] = useState({})
    const [game, setGame] = useState({});
    const [players, setPlayers] = useState([]);
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const gameId = window.location.href.split("/")[4] // extrae la id de la partida desde la ruta spliteandola por las / en un array, cuidado que el indice del array que devuelve el split no empieza en [0] sino en [1] por algu motivo ([-1] tampoco funciona)

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

    const y = [null, 92, 199, 306,
        92, 199, 306,
        92, 199, 306,
        199,
        92, 199, 306]

    const [coordPod3, setCoordPod3] = useState([-30, 199])

    const pod3 =
        <div className="pod3" style={{ left: coordPod3[0], top: coordPod3[1] }}>
        </div>

    function movePodDemo(sector) {
        setCoordPod3([x[sector], y[sector]])
    }

    return (
        <div className="game-page-container">
            <div className="game-board">
                {pod3}
            </div>
            <div style={{flexDirection: "column", marginLeft: 710, marginTop:70, height: "100%", alignContent: "center", alignItems: "center"}}>
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
                }}>
                    SECTOR 10
                </Button>
            </div>
        </div >
    );

}