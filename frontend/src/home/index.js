import React, { useState, useEffect } from 'react';
import '../App.css';
import '../static/css/home/home.css';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import tokenService from "../services/token.service";
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom';
import { FaLessThanEqual } from 'react-icons/fa';

function HowToPlayButton() {
    return (
        <Button className='button' style={{
            transition: "0.15s",
            backgroundColor: "#ffd374",
            width: 250,
            height: 75,
            fontWeight: 10,
            borderRadius: 15,
            border: "none",
            fontSize: 25,
            boxShadow: "10px 10px 5px #00000020",
            textShadow: "2px 2px 2px #00000020"
        }}
            onClick={() => window.open("https://drive.google.com/file/d/11oSXNXpRMSdqJDTp8a_Ww2MrMLq0N9lm/view?usp=drive_link", "_blank", "noreferrer")}>

            HOW TO PLAY
        </Button>
    );
}

export default function Home() {
    const [visible, setVisible] = useState(false);
    const [numPlayersVisible, setNumPlayersVisible] = useState(false)
    const [roles, setRoles] = useState([]);
    const [waitingGames, setWaitingGames] = useState([])
    const [myPlayer, setMyPlayer] = useState({});
    const [numPlayers, setNumPlayers] = useState(2);
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer(myUsername)
            getGames()
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

    async function createGameAndGoLobby() {
        const newGame = {
            numPlayers: numPlayers,
            status: "WAITING",
            players: [myPlayer],
        }
        const response = await fetch("/api/v1/games", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "POST",
            body: JSON.stringify(newGame)
        })
        const createdGame = await response.json();
        window.location.href = `/lobby/${createdGame.id}`
    }


    /*
    async function GetWaitingGames() {
        await fetch("/api/v1/games?status=WAITING", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
            .then(response => response.json())
            .then(data => {
                for (const g of data) {
                    console.log(g)
                    waitingGames.push(g);
                }
                setWaitingGames(waitingGames);
                console.log(waitingGames);
            })
            .then(console.log(waitingGames))
    }*/

    async function getGames() {
        try {
            const fetchedGames = await fetchAllGames();
            setWaitingGames(fetchedGames);
        } catch (error) {
            console.error("Failed to fetch games: ", error);
        }
    }

    async function fetchAllGames() {
        const response = await fetch('/api/v1/games?status=WAITING', {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('http error with status: ${ response.status }');
        }

        const games = await response.json();
        return games;
    }


    async function addPlayerToGame(id) {

        const updatedPlayers = waitingGames.find((game) => game.id === id).players
        console.log(myPlayer)
        console.log(waitingGames.find((game) => game.id === id).players)
        updatedPlayers.push(myPlayer)
        console.log(updatedPlayers)

        const updatedGame = {
            numPlayers: waitingGames.find((game) => game.id === id).numPlayers,
            start: waitingGames.find((game) => game.id === id).start,
            finish: waitingGames.find((game) => game.id === id).finish,
            status: waitingGames.find((game) => game.id === id).status,
            players: updatedPlayers
        }
        await fetch(`/api/v1/games/${id}`, {
            headers: {
                "Authorization": ' Bearer ${ jwt }',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(updatedGame)
        });
        window.location.href = `/lobby/${id}`
    }


    const waitingGamesList = waitingGames.map(game =>
        <li key={game.id} className='list-games-name' style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10, marginRight: 10 }}>
            <span>
                {game.id}
            </span>
            <Button className="done-button" style={{
                backgroundColor: "#CFFF68",
                border: "none",
                boxShadow: "5px 5px 5px #00000020",
                textShadow: "2px 2px 2px #00000020",
                transition: "0.15s",
            }}
                onClick={() => {
                    setVisible(false)
                    addPlayerToGame(game.id)
                }}>
                JOIN
            </Button>
        </li>)

    function CreateLobbyButton() {
        return (
            <Button className='button' style={{
                transition: "0.15s",
                backgroundColor: "#ffa555",
                width: 350,
                height: 150,
                fontWeight: 10,
                borderRadius: 30,
                border: "none",
                fontSize: 35,
                boxShadow: "10px 10px 5px #00000020",
                textShadow: "2px 2px 2px #00000020"
            }} onClick={() => {
                setNumPlayersVisible(true)
            }}>
                CREATE LOBBY
            </Button>
        );
    }

    function JoinLobbyButton() {
        return (
            <Button className="button" style={{
                transition: "0.15s",
                backgroundColor: "#ffe555",
                width: 350,
                height: 150,
                fontWeight: 10,
                borderRadius: 30,
                border: "none",
                fontSize: 35,
                boxShadow: "10px 10px 5px #00000020",
                textShadow: "2px 2px 2px #00000020"
            }}
                onClick={() => {
                    setVisible(true)
                    fetchAllGames()
                }}
            >

                JOIN LOBBY
            </Button >
        );
    }



    return (
        <div>
            <div>
                <Modal isOpen={numPlayersVisible} centered="true" className="modal" style={{ height: "65%" }}>
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
                            setNumPlayersVisible(false);
                            setNumPlayers(2)
                        }}>
                            Cancel
                        </Button>
                        <Button className="done-button" style={{
                            backgroundColor: "#CFFF68", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                        }} onClick={() => {
                            createGameAndGoLobby()
                            setVisible(false);
                        }}>
                            Done
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            <div>
                <Modal isOpen={visible} fade="true" className="modal-join-lobby" >
                    <ModalHeader style={{ color: "white", textShadow: "2px 2px 2px #00000020" }}>
                        Select the game
                    </ModalHeader>
                    <ModalBody style={{ flexDirection: "row" }}>
                        <ul className="ul-games">
                            {waitingGamesList}
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="done-button" style={{
                            backgroundColor: "#ffa952", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                        }}
                            onClick={() => {
                                setVisible(false)
                                console.log(waitingGames);
                            }}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            {roles.includes("PLAYER") &&
                <div className="home-page-container">
                    <div style={{ marginBottom: 25 }}>
                        <CreateLobbyButton>
                        </CreateLobbyButton>
                    </div>
                    <div style={{ marginBottom: 25 }}>
                        <JoinLobbyButton>
                        </JoinLobbyButton>
                    </div>
                    <div>
                        <HowToPlayButton>
                        </HowToPlayButton>
                    </div>
                </div>
            }
            {!roles.includes("PLAYER") && !roles.includes("ADMIN") &&
                <div className="home-page-container">
                    <img src={"/escape-pods-logo.png"} alt="Logo" width={400} height={266} />
                    <div style={{ color: "white", fontSize: 35, marginTop: 50, textShadow: "2px 2px 2px #00000020" }}>
                        REGISTER OR LOG IN TO START PLAYING
                    </div>
                </div>
            }
        </div>
    );
}