import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import { Link } from 'react-router-dom';
import itemsInitializers from "./gameItemsInitializers";

//ICONOS
import { DiAptana } from "react-icons/di";
import { MdAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { RiChatOffLine, RiChat4Line, RiCodeFill } from "react-icons/ri";



export default function Lobby() {
    const [roles, setRoles] = useState([]);
    const [myPlayer, setMyPlayer] = useState({})
    const [game, setGame] = useState({});
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const gameId = window.location.href.split("/")[4] // extrae la id de la partida desde la ruta spliteandola por las / en un array, cuidado que el indice del array que devuelve el split no empieza en [0] sino en [1] por algu motivo ([-1] tampoco funciona)

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer();
            GetCurrentGame();
            refresher();
        }
    }, [jwt])

    function refresher() {
        let intervalID = setInterval(() => {
            GetCurrentGame();
        }, 1000);
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
        if (fetchedGame.status === "PLAYING" && fetchedGame.players.map(player => player.id).includes(myPlayer.id)) {
            window.location.href = `/game/${gameId}`
        }
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
                "Authorization": `Bearer ${jwt}`,
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
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        });
    }

    async function setGameToPlaying() {
        const gameInProgress = {
            numPlayers: game.numPlayers,
            start: game.start,
            finish: game.finish,
            status: "PLAYING",
            players: game.players,
            activePlayer: game.players[0]
        }
        await fetch(`/api/v1/games/${game.id}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(gameInProgress)
        })
    }

    async function startGame() {
        try {
            setLoading(true)
            await GetCurrentGame()
            await itemsInitializers.GameItemsInitializer(game, jwt)
            await setGameToPlaying()
            window.location.href = `/game/${gameId}`
        } catch {
            alert("The game couldn't be created. Please try again")
        }
    }

    const playerList = JSON.stringify(game) === "{}" ? null : game.players.map(player =>   //se está comprobando si game es un objeto vacío para que no de problemas al leer undefined de game.players antes de que el estado adquiera valor
        <li key={player.id}>
            <div className="list-item-container" style={{ marginBottom: "20" }}>
                <img className="profile-picture" src={player.profilePicture.startsWith("http") ? player.profilePicture : `data:image/png;base64,${player.profilePicture}`} />
                <div className="list-player-name">
                    {player.user.username} {player === game.players[0] ? "(owner)" : ""}
                </div>
            </div>
        </li>)

    return (
        <>
            {!loading &&
                <div className="lobby-page-container">
                    <div className="hero-div">
                        <h1>Players {JSON.stringify(game) === "{}" ? "0" : game.players.length}/{game.numPlayers}</h1> {/*misma comprobacion que arriba pero esta vez para players.length*/}
                        <ul className="ul-players">
                            {playerList}
                        </ul>
                    </div>
                    <div className="button-separed" style={{ marginRight: 0, marginLeft: 60 }}>

                        <div className="hero-div2" style={{
                            borderRadius: 20, width: 300, height: 170,
                            fontSize: 25, marginBottom: 20, marginRight: 10
                        }}>
                            <p style={{ color: 'white' }}>Lobby ID :</p>
                            <Badge color="danger" style={{
                                pill: false, width: 260, height: 70, fontSize: 30, textAlign: 'center'
                            }}>
                                {game.id}
                            </Badge>
                        </div>

                        {game.status === "WAITING" &&
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
                                if (game.players.length === 1) {
                                    alert("You can't start a game with only one player")
                                } else if (myPlayer.id !== game.players[0].id) {
                                    alert("Only the lobby owner can start the game")
                                } else {
                                    startGame()
                                }
                            }}>
                                START GAME
                            </Button>
                        }
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
                                } else {
                                    removePlayerFromGame()
                                }
                            }}>
                                LEAVE LOBBY
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Button
                            //color="dark"
                            id="toggler"
                            style={{
                                marginBottom: '1rem', backgroundColor: "#fefefe2d",
                                alignItems: 'center', height: 50, marginLeft: 60, marginRight: 10
                            }}
                        >
                            <RiCodeFill style={{ fontSize: 30 }} />

                        </Button>
                    </div>

                    <div style={{ marginTop: 50 }}>
                        <UncontrolledCollapse horizontal toggler="#toggler" >

                            <p style={{ backgroundColor: "#0000006a", color: 'white', borderRadius: 7, width: 400, height: 565 }}>
                                <p style={{ color: 'white', textAlign: 'center', fontSize: 30 }}>Friends</p>
                                <p style={{ color: 'white', textAlign: 'left', margin: 20 }}> <img className="profile-picture" src='https://media.tenor.com/uku4KIcT-oUAAAAC/ianleong.gif' />
                                    player2 <Button className="button" style={{ color: 'white', backgroundColor: "#00000000" }}
                                        onClick={() => {

                                        }}>
                                        <MdOutlinePersonAddAlt1 style={{ fontSize: 30 }} />
                                    </Button>

                                </p>

                                <p style={{ color: 'white', textAlign: 'left', margin: 20 }}> <img className="profile-picture" src='https://media.tenor.com/MSF0PH3M2WkAAAAC/sungchan-nct-sungchan.gif' />
                                    player3 <TiTick style={{ fontSize: 30 }} />

                                </p>
                                <p style={{ color: 'white', textAlign: 'left', margin: 20 }}> <img className="profile-picture" src='https://pbs.twimg.com/media/F3OcIipbMAAtbKH?format=jpg&name=medium' />
                                    player4 <TiTick style={{ fontSize: 30 }} />

                                </p>
                                <p style={{ color: 'white', textAlign: 'left', margin: 20 }}> <img className="profile-picture" src='https://media.tenor.com/tGiOcAGrtpsAAAAd/daniel.gif' />
                                    player5 <TiTick style={{ fontSize: 30 }} />

                                </p>
                                <p style={{ color: 'white', textAlign: 'left', fontSize: 25, margin: 20 }}>Chat :
                                    <Button className="button" style={{ color: 'white', backgroundColor: "#00000000" }}
                                        onClick={() => {
                                            // es el chat activo, deberia cambiar al pulsarlo.
                                            <RiChat4Line style={{ fontSize: 30 }} />

                                        }}>
                                        <RiChatOffLine style={{ fontSize: 30 }} />
                                    </Button></p>
                                <Badge color="secondary" style={{
                                    width: 400, height: 50, fontSize: 30, textlign: 'center', borderRadius: 15
                                }}>
                                    hello dudes!
                                </Badge>

                            </p>
                        </UncontrolledCollapse>
                    </div>


                </div >
            }
            {loading &&
                <div className="lobby-page-container">
                    <div class="bar">
                        <div class="in"></div>
                    </div>
                </div>
            }
        </>
    );

}