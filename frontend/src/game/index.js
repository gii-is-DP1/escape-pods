import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import "../static/css/game/game.css";
import { Link } from 'react-router-dom';


export default function Game() {
    const [roles, setRoles] = useState([]);
    const [myPlayer, setMyPlayer] = useState({})
    const [game, setGame] = useState({});
    const [players, setPlayers] = useState([]);
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const gameId = window.location.href.split("/")[4] // extrae la id de la partida desde la ruta spliteandola por las / en un array, cuidado que el indice del array que devuelve el split no empieza en [0] sino en [1] por algu motivo ([-1] tampoco funciona)

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
        }
    }, [jwt])

    async function GetCurrentGame() {
        setGame(await fetchCurrentGame())
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

    return (
        <div className="game-page-container">
            <img src='https://media.tenor.com/fR9Tu9qbtm4AAAAM/kerr-floppa.gif' />
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
                GetCurrentGame()
                console.log(game.status)
                GetCurrentGame()
                console.log(game.status)
            }}>
                Prueba
            </Button>
        </div >
    );

}