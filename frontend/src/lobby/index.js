import React, { useState, useEffect } from 'react';
import '../App.css';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css"
import { Button } from 'reactstrap';
import tokenService from '../services/token.service';
import jwt_decode from "jwt-decode";


export default function Lobby() {
    const [roles, setRoles] = useState([]);
    const jwt = tokenService.getLocalAccessToken();
    const [collapsed, setCollapsed] = useState(true);
    const [player, setPlayer] = useState({})
    const myUsername = jwt_decode(jwt).sub;
    const [game, setGame] = useState({});

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer(myUsername);
        }
    }, [jwt])

    function GetCurrentPlayer() {
        console.log(myUsername)
        fetch("/api/v1/players?username=" + myUsername, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
            .then(response => response.json())
            .then(response => { setPlayer(response[0]); })
    }

    function CreateGame() {
        const newGame = {
            numPlayers: 5,
            status: "WAITING",
            players: [player],
        }
        fetch("/api/v1/games", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "POST",
            body: JSON.stringify(newGame)
        })
            .then(setGame(newGame))
    }

    function CreateLobbyButton() {
        return (
            <Button style={{
                backgroundColor: "#ffa555",
                width: 350,
                height: 150,
                fontWeight: 10,
                borderRadius: 30,
                fontSize: 35,
                boxShadow: "10px 10px 5px #00000020",
                textShadow: "4px 4px 2px #00000020"
            }}
            onClick={() => CreateGame()}
            >
                CREATE LOBBY
            </Button>
        );
    }

    return (
        <div className="home-page-container">
            <div>
                <p style={{ color: "white" }}>
                    {myUsername}
                </p>
                <CreateLobbyButton>
                </CreateLobbyButton>
                <img className="profile-picture" src={player.profilePicture} />
            </div>
        </div>
    );
}