import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Badge } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import { Link } from 'react-router-dom';
import itemsInitializers from "./gameItemsInitializers";

//ICONOS
import { DiAptana } from "react-icons/di";
import { MdAdd } from "react-icons/md";


export default function Lobby() {
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
            GetCurrentPlayer();
            GetCurrentGame();

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


    async function removePlayerFromGame() {
        const currentGame = await fetchCurrentGame()
        const updatedPlayers = currentGame.players
        updatedPlayers.splice(currentGame.players.findIndex(player => player.id === myPlayer.id), 1)

        const updatedGame = {
            numPlayers: game.numPlayers,
            start: game.start,
            finish: game.finish,
            status: game.status,
            players: updatedPlayers
        }
        await fetch(`/api/v1/games/${game.id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(updatedGame)
        });
    }

    async function deleteGame() {
        await fetch(`/api/v1/games/${game.id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        });
    }


    const playerList = JSON.stringify(game) === "{}" ? null : game.players.map(player =>   //se está comprobando si game es un objeto vacío para que no de problemas al leer undefined de game.players antes de que el estado adquiera valor
        <li key={player.id}>
            <div className="list-item-container" style={{ marginBottom: "20" }}>
                <img className="profile-picture" src={player.profilePicture} />
                <div className="list-player-name">
                    {player.user.username}
                </div>
            </div>
        </li>)

    return (
        <div className="lobby-page-container">
            <div className="hero-div">
                <h1>Players {JSON.stringify(game) === "{}" ? "0" : game.players.length}/{game.numPlayers}</h1> {/*misma comprobacion que arriba pero esta vez para players.length*/}
                <ul className="ul-players">
                    {playerList}
                </ul>
            </div>
            <div className="button-container">
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
                    itemsInitializers.createBeacons(game, jwt)
                    console.log(game)
                }}>
                    START GAME
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
                    marginBottom: 20
                }} onClick={() => {
                    console.log(game.players)
                    console.log(game.players.findIndex(player => player.id === myPlayer.id))
                    GetCurrentGame()
                }}>
                    pruebita xd
                </Button>
                <Link to="/">
                    <Button className="button" style={{
                        backgroundColor: "#FF8368",
                        border: "none",
                        width: 175,
                        fontSize: 20,
                        borderRadius: 15,
                        height: 55,
                        boxShadow: "5px 5px 5px #00000020",
                        textShadow: "2px 2px 2px #00000020",
                        transition: "0.15s",
                        marginBottom: 20
                    }} onClick={() => {
                        if (game.players.length === 1) {
                            deleteGame()
                        } else
                            removePlayerFromGame()



                    }}>
                        LEAVE LOBBY
                    </Button>
                </Link>
            </div>
        </div >
    );

}