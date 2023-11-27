import React, { useState, useEffect } from 'react';
import '../App.css';
import '../static/css/home/home.css';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import tokenService from "../services/token.service";
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom';

function CreateLobbyButton() {
    return (
        <Link to="/lobby">
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
            }}>
                CREATE LOBBY
            </Button>
        </Link>
    );
}

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
    const [roles, setRoles] = useState([]);
    const [waitingGames, setWaitingGames] = useState([])
    const jwt = tokenService.getLocalAccessToken();
    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            getGames()

        }
    }, [jwt])


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

    const waitingGamesList = waitingGames.map(game =>
        <li key={game.id} className='list-games-name'style={{ display: "flex", justifyContent: 'space-between', marginBottom:10}}>
            <span>
                {game.id}
            </span>
            <Button className="done-button" style={{
                backgroundColor: "#ffa952",
                border: "none",
                boxShadow: "5px 5px 5px #00000020",
                textShadow: "2px 2px 2px #00000020",
                transition: "0.15s",
            }}
                onClick={() => {
                    setVisible(false)
                }}>
                JOIN
            </Button>
        </li>)


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
                <Modal isOpen={visible} centered="true" fade="true" scrollable="true" className="modal-join-lobby">
                    <ModalHeader style={{ color: "white", textShadow: "2px 2px 2px #00000020"}}>
                        Select the game
                    </ModalHeader>
                    <ModalBody style={{ flexDirection: "row" }}>
                        <ul className="ul">
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