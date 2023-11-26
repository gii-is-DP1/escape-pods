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
    const jwt = tokenService.getLocalAccessToken();
    const [collapsed, setCollapsed] = useState(true);
    const [player, setPlayer] = useState({})
    const myUsername = jwt_decode(jwt).sub;
    const [game, setGame] = useState({});
    const [numPlayers, setNumPlayers] = useState(2);
    const [visible, setVisible] = useState(true);
    const [players, setPlayers] = useState([])

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer(myUsername);
            GetCurrentPlayer("player2");
            GetCurrentPlayer("player3");
            GetCurrentPlayer("player4");
            GetCurrentPlayer("player5");

        }
    }, [jwt])

    function GetCurrentPlayer(username) {
        fetch("/api/v1/players?username=" + username, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
            .then(response => response.json())
            .then(response => {
                username === myUsername ? setPlayer(response[0]) : console.log("no es mi player");
                players.push(response[0])
            })
            .then(setPlayers(players))
    }

    function CreateGame() {
        const newGame = {
            numPlayers: numPlayers,
            status: "WAITING",
            players: players,
        }
        fetch("/api/v1/games", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "POST",
            body: JSON.stringify(newGame)
        })
            .then(response => response.json())
            .then(response => setGame(response))
    }

    const playerList = players.map(player =>
        <li key={player.id}>
            <div className="list-item-container" style={{marginBottom:"20"}}>
                <img className="profile-picture" src={player.profilePicture} />
                <div className="list-player-name">
                    {myUsername}
                </div>
            </div>
        </li>)

    return (
        <div className="lobby-page-container">
            <div>
                <Modal isOpen={visible} centered="true" className="modal" style={{ height: "65%" }}>
                    <ModalHeader style={{ color: "white", textShadow: "2px 2px 2px #00000020" }}>
                        Select the number of players
                    </ModalHeader>
                    <ModalBody style={{ flexDirection: "row" }}>
                        <Button className="modal-button" style={{
                            backgroundColor: "#ff4a4a",
                            border: "none",
                            borderRadius: "50%",
                            textAlign: "center",
                            fontSize: 25,
                            color: "white",
                            boxShadow: "3px 3px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020"
                        }}
                            onClick={() => numPlayers > 2 ? setNumPlayers(numPlayers - 1) : null}
                        >
                            -
                        </Button>
                        <p style={{
                            paddingTop: 15,
                            marginLeft: 5,
                            marginRight: 5,
                            textAlign: "center",
                            fontSize: 22,
                            color: "white",
                            textShadow: "2px 2px 2px #00000020",
                        }}>
                            {numPlayers}
                        </p>
                        <Button className="modal-button" style={{
                            transition: "0.15s",
                            backgroundColor: "#59ff75",
                            border: "none",
                            borderRadius: "50%",
                            textAlign: "center",
                            fontSize: 25,
                            boxShadow: "3px 3px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                        }}
                            onClick={() => numPlayers < 5 ? setNumPlayers(numPlayers + 1) : null}
                        >
                            +
                        </Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="done-button" style={{
                            backgroundColor: "#ffa952", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                        }} onClick={() => {
                            setVisible(false);
                            setPlayers(players.slice(0, numPlayers))  // para probar con varios jugadores antes de implementar uniones al lobby
                        }}>
                            Done
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            {/*
            <div style={{ marginTop: 70 }}>
                <svg width="650" height="650">
                    <rect className="player-list"
                        x="50"
                        y="20"
                        rx="20"
                        ry="20"
                        width="400"
                        height="600"
                        style={{ fill: "black", opacity: 0.5 }} />
                </svg>
            </div>
*/}
            <div className="hero-div">
                <h1>Players {players.length}/{numPlayers}</h1>
                
                <ul className="ul">
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
                    console.log(players)
                    CreateGame()
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


                    }}>
                        LEAVE LOBBY
                    </Button>
                </Link>
            </div>
        </div >
    );

}