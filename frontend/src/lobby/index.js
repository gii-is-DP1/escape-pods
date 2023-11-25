import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";


export default function Lobby() {
    const [roles, setRoles] = useState([]);
    const jwt = tokenService.getLocalAccessToken();
    const [collapsed, setCollapsed] = useState(true);
    const [player, setPlayer] = useState({})
    const myUsername = jwt_decode(jwt).sub;
    const [game, setGame] = useState({});
    const [numPlayers, setNumPlayers] = useState(2);
    const [visible, setVisible] = useState(true);

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
            numPlayers: numPlayers,
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
                                textShadow: "2px 2px 2px #00000020"
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
                                textShadow: "2px 2px 2px #00000020"
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
                                CreateGame()
                            }}>
                                Done
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <p style={{ color: "white" }}>
                    {myUsername}
                </p>
                <img className="profile-picture" src={player.profilePicture}/>
            </div>
        </div >
    );
}