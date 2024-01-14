import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Alert } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import gameItemDeleters from "./gameItemDeleters";
import "../static/css/game/game.css";
import "../static/css/game/scores.css";
import scoringFunction from "./scoringFunction";
import Scrap from "../static/images/scrap.png";
import { FaTwitter } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import WinnerAudio from "../static/audio/winner.mp3";
import CrowdCheer from "../static/audio/crowd-cheer.mp3";

export default function Scores() {
    const [myPlayer, setMyPlayer] = useState({})
    const [winnerPlayer, setWinnerPlayer] = useState({})
    const [game, setGame] = useState({});
    const [scores, setScores] = useState(null);
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const gameId = parseInt(window.location.href.split("/")[4])

    useEffect(() => {
        if (jwt) {
            GetCurrentPlayer();
            getScores();
        }
    }, [jwt])

    async function getScores() {
        const fetchedGame = await fetchCurrentGame();
        setGame(fetchedGame);
        if (!fetchedGame.winner) {
            const calculedScores = await scoringFunction.getScores(gameId, jwt);
            setScores(calculedScores);
            const winner = await fetchWinnerPlayer(Object.keys(calculedScores)[0]);
            setWinnerPlayer(winner);
            setTimeout(() => { setWinnerAndDeleteItems(fetchedGame, winner); }, 8000);
        }
    }

    function setWinnerAndDeleteItems(game, winner) {
        if (!game.winner) {
            fetch(`/api/v1/games/${gameId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "PUT",
                body: JSON.stringify({
                    ...game,
                    winner: winner
                })
            })
            gameItemDeleters.deleteAll(gameId, jwt);
        }
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

    async function fetchWinnerPlayer(winnerUsername) {
        const response = await fetch(`/api/v1/players?username=${winnerUsername}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedPlayer = await response.json();
        return fetchedPlayer[0]
    }

    function playSFX() {
        const winnerAudio = new Audio(WinnerAudio);
        const crowdCheer = new Audio(CrowdCheer);
        winnerAudio.play();
        setTimeout(() => { crowdCheer.play(); }, 6000);
    }

    const [visible, setVisible] = useState(false);

    return (
        <div className="scores-page-container">
            {scores &&
                <>
                    {visible &&
                        <>
                            <div className="overlay-gif" />
                        </>
                    }
                    {winnerPlayer && winnerPlayer.user &&
                        <div className="winner-container">
                            <FaCrown className="winner-icon" />
                            <img className="winner-image" src={winnerPlayer.profilePicture} />
                            <p className="winner-text">{winnerPlayer.user.username}</p>
                            <Button className="button" style={{
                                backgroundColor: "#ffc700",
                                border: "none",
                                width: 200,
                                fontSize: 20,
                                borderRadius: 20,
                                height: 60,
                                boxShadow: "5px 5px 5px #00000020",
                                textShadow: "2px 2px 2px #00000020",
                                transition: "0.15s",
                                alignSelf: "center",
                                paddingRight: "15px"
                            }} onClick={() => {
                                playSFX();
                                setVisible(true);
                            }}>
                                Celebrate!
                            </Button>
                        </div>
                    }

                    <div className="scoreboard">
                        <div style={{ paddingRight: "3%" }}>
                            {scores &&
                                <p className="title-text">Scores</p>
                            }
                            {scores && Object.entries(scores).map((entry, index) => (
                                <div key={index} className={index === 0 ? "glow" : ""} style={{ alignContent: "center", display: "flex", flexDirection: "column" }}>
                                    {index === 0 &&
                                        <div className="winner-score-container">
                                            <p className="winner-text">
                                                {entry[0]}
                                                <span style={{ marginLeft: 20 }}>{entry[1]}</span>
                                                <span style={{ marginLeft: 5, fontSize: 40, marginTop: 33 }}>pts.</span>
                                            </p>
                                        </div>
                                    }
                                    {index !== 0 &&
                                        <div className="loser-score-container">
                                            <p className={"loser-text" + index}>
                                                {entry[0]}
                                                <span style={{ marginLeft: 20 }}>{entry[1]}</span>
                                                <span style={{ marginLeft: 5, fontSize: 17, marginTop: 33 }}>pts.</span>
                                            </p>
                                        </div>
                                    }
                                </div>
                            )
                            )}
                        </div>
                        <Button className="button" style={{
                            backgroundColor: "#ff8368",
                            border: "none",
                            width: 200,
                            fontSize: 20,
                            borderRadius: 20,
                            height: 60,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginRight: "4.5%",
                            marginTop: "30px",
                            animation: "fadeIn 2s 15s forwards",
                            opacity: 0
                        }} onClick={() => {
                            window.location.href = "/";
                        }}>
                            EXIT
                        </Button>
                    </div>
                    <Button className="button" style={{
                        position: "absolute",
                        top: "90%",
                        left: "90%",
                        backgroundColor: "#1DA1F2",
                        border: "none",
                        width: 120,
                        height: 40,
                        borderRadius: 20,
                        boxShadow: "5px 5px 5px #00000020",
                        textShadow: "2px 2px 2px #00000020",
                        transition: "0.15s",
                        alignSelf: "center",
                        marginRight: "4.5%",
                        marginTop: "15px",
                        animation: "fadeIn 2s 15s forwards",
                        opacity: 0
                    }} onClick={() => {
                        const tweetText = encodeURIComponent(`I just scored ${scores[myPlayer.user.username]} points in Escape Pods! #EscapePods #Un10ParaGonzalo \n\nTry it out at https://github.com/gii-is-DP1/DP1--2023-2024-l7-1`);
                        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
                    }}>
                        {"Share on  "}
                        <FaTwitter style={{ color: "white" }} />
                    </Button>
                </>
            }
            {!scores && game.winner &&
                <Button className="button" style={{
                    backgroundColor: "#ff8368",
                    border: "none",
                    width: 200,
                    fontSize: 20,
                    borderRadius: 20,
                    height: 60,
                    boxShadow: "5px 5px 5px #00000020",
                    textShadow: "2px 2px 2px #00000020",
                    transition: "0.15s",
                    alignSelf: "center",
                    marginRight: "4.5%",
                    marginTop: "30px",
                    animation: "fadeIn 2s 15s forwards",
                    opacity: 0
                }} onClick={() => {
                    window.location.href = "/";
                }}>
                    EXIT
                </Button>
            }
        </div>
    )
}