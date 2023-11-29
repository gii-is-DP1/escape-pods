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

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer(myUsername);
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
            .then(response => response.json())
            .then(response => setGame(response))
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

                <Badge color="black" style={{
                    pill: false, width: 400, height: 510, fontSize: 30, opacity: 0.5, textAlign: 'center'
                }}>
                    Players:
                    <p></p>
                    <p style={{ color: "white", fontSize: 15, textAlign: 'left' }}>

                        <img className="profile-picture" src={player.profilePicture} />
                        {myUsername}

                    </p>
                    <p></p>
                    <p style={{ color: "white", fontSize: 15, textAlign: 'left' }}>
                        <img className="profile-picture" src='https://media.tenor.com/uku4KIcT-oUAAAAC/ianleong.gif' />
                        Player2

                    </p>
                    <p></p>
                    <p style={{ color: "white", fontSize: 15, textAlign: 'left' }}>
                        <img className="profile-picture" src='https://media.tenor.com/MSF0PH3M2WkAAAAC/sungchan-nct-sungchan.gif' />
                        Player3

                    </p>
                    <p></p>
                    <p style={{ color: "white", fontSize: 15, textAlign: 'left' }}>
                        <img className="profile-picture" src='https://pbs.twimg.com/media/F3OcIipbMAAtbKH?format=jpg&name=medium' />
                        Player4

                    </p>
                    <p></p>
                    <p style={{ color: "white", fontSize: 15, textAlign: 'left' }}>
                        <img className="profile-picture" src='https://media.tenor.com/tGiOcAGrtpsAAAAd/daniel.gif' />
                        Player5

                    </p>

                </Badge>


                <Badge color="black" style={{ //RATEADA MAXIMA PARA SEPARAR BOTONES
                    pill: false, width: 50, height: 1, fontSize: 30, opacity: 0
                }}>
                    .
                </Badge>
                <Button className="button" style={{
                    backgroundColor: "#CFFF68", border: "none", width: 300, fontSize: 35, borderRadius: 20, height: 100, boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                }} onClick={() => {
                    CreateGame()
                    console.log(game)
                    itemsInitializers.createLines(game,jwt)
                    itemsInitializers.createSectors(game,jwt)
                    itemsInitializers.createPods(game,jwt)
                    itemsInitializers.createGamePlayers(game,jwt)
                    itemsInitializers.createCrewmates(game,jwt)
                }}>
                    Start Game
                </Button>
                <Badge color="black" style={{//RATEADA MAXIMA PARA SEPARAR BOTONES
                    pill: false, width: 50, height: 1, fontSize: 30, opacity: 0
                }}>
                    .
                </Badge>

                <Link to="/">
                    <Button className="button" style={{
                        backgroundColor: "#FF8368", border: "none", width: 175, fontSize: 20, borderRadius: 15, height: 55, boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                    }} onClick={() => {


                    }}>
                        Leave Lobby
                    </Button>
                </Link>

            </div>
        </div >
    );

}