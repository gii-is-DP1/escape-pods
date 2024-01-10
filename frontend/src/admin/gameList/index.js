import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse, Table, } from "reactstrap";
import '../../App.css';
import tokenService from '../../services/token.service';
import '../../static/css/home/home.css';


//ICONOS
import { DiAptana } from "react-icons/di";
import { MdAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { RiChatOffLine, RiChat4Line, RiCodeFill } from "react-icons/ri";
import { BiSolidInvader } from "react-icons/bi";
import { FaSpaceAwesome } from "react-icons/fa6";
import { FaGalacticRepublic, FaFulcrum } from "react-icons/fa";


export default function GameLists() {

    const [myPlayer, setMyPlayer] = useState({})
    const jwt = tokenService.getLocalAccessToken();
    const [game, setGame] = useState({});
    let userLogout = <></>;
    const myUsername = window.location.href.split("/")[4]
    const [listedGames, setListedGames] = useState([])
    const [pages, setPages] = useState([0, 1, 2, 3, 4, 5, 6]);


    useEffect(() => {
        if (jwt) {
            GetCurrentPlayer();
            getGames(0);
        }
    }, [jwt])

    async function GetCurrentPlayer() {
        const response = await fetch("/api/v1/players?username=" + myUsername, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedPlayer = await response.json();
        console.log(fetchedPlayer[0]);
        setMyPlayer(fetchedPlayer[0]);
    }

    function emptyChecker(type, a) { //comprueba si el elemento a de tipo type está vacío
        if (type === "array") {
            const copy = a
            return JSON.stringify(copy) === "[]" ? true : false
        } else if (type === "object") {
            const copy = a
            return JSON.stringify(copy) === "{}" ? true : false
        }
    }
    async function getGames(page) {
        try {
            const fetchedGames = await fetchGames(page);
            setListedGames(fetchedGames);
        } catch (error) {
            console.error("Failed to fetch games: ", error);
        }
    }

    async function fetchWaitingGames(page) {
        const response = await fetch(`/api/v1/games?status=WAITING&page=${page}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`http error with status: ${response.status}`);
        }

        const games = await response.json();
        setListedGames(games);
        return games;
    }

    async function fetchFinishedGames(page) {
        const response = await fetch(`/api/v1/games?status=FINISHED&page=${page}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`http error with status: ${response.status}`);
        }

        const games = await response.json();
        setListedGames(games);
        return games;
    }

    async function fetchGames(page) {
        const response = await fetch(`/api/v1/games?page=${page}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`http error with status: ${response.status}`);
        }

        const games = await response.json();
        setListedGames(games);
        return games;
    }

    const GamesList = listedGames.map(game =>
        <tr key={game.id} style={{ fontFamily: 'monospace', fontSize: 20, backgroundColor: "#078a3b00" }}>
            <td style={{ color: '#00FF66', backgroundColor: '#078a3b00', fontFamily: 'monospace', }}>{game.id}</td>
            <td style={{ color: '#00FF66', backgroundColor: '#078a3b00', fontFamily: 'monospace', }}>{game.status}</td>
            <td style={{ color: '#00FF66', backgroundColor: '#078a3b00', fontFamily: 'monospace', }}>{JSON.stringify(game) === "{}" ? null : game.players.map((player, index, array) => player.user.username + (index < array.length - 1 ? ", " : ""))}</td>
        </tr>)

    function newPages(direction) {
        let out = []
        for (let i = 0; i < pages.length; i++) {
            out.push(pages[i] + (direction === 'up' ? 7 : -7))
        }
        return out;
    }

    return (
        <>
            <div className="lobby-page-container-retro" style={{ color: '#00FF66', fontFamily: 'monospace' }}>
                <div>
                    <Table bordered dark className="tabla" style={{ fontFamily: 'monospace', fontSize: 20, backgroundColor: "#078a3b58" }}>
                        <thead className="tabla" style={{ fontFamily: 'monospace', fontSize: 20, backgroundColor: "#078a3b00" }}>
                            <tr>
                                <th style={{ fontFamily: 'monospace', color: '#00FF66', backgroundColor: '#078a3b58' }}>Id <FaGalacticRepublic style={{ fontSize: 25 }} /></th>
                                <th style={{ fontFamily: 'monospace', color: '#00FF66', backgroundColor: '#078a3b58' }}>Status <BiSolidInvader /> </th>
                                <th style={{ fontFamily: 'monospace', color: '#00FF66', backgroundColor: '#078a3b58' }}>Players <FaSpaceAwesome /></th>
                            </tr>
                        </thead>
                        <tbody >
                            {GamesList.length !== 0 &&
                                GamesList
                            }
                            {GamesList.length === 0 &&
                                <p style={{ color: '#00FF66', fontFamily: 'monospace', height: 310, marginLeft: 10 }}> No games found to show. </p>
                            }
                        </tbody>
                    </Table>
                    <div style={{
                        display: 'flex', flexDirection: "column", alignItems: 'center',
                        alignContent: 'center', justifyContent: 'center'
                    }}>
                        <div class="pagination" style={{ flexDirection: "row", alignItems: 'center', backgroundColor: '#078a3b58' }}>
                            <a style={{ color: '#00FF66', fontFamily: 'monospace' }} onClick={() => {
                                if (pages[0] != 0) {
                                    setPages(newPages('down'))
                                }

                            }}>&laquo;</a>
                            {pages.map((page, index) => (
                                <a style={{ color: '#00FF66', fontFamily: 'monospace', }} onClick={() => {
                                    getGames(page)
                                }}
                                >
                                    {pages[index] + 1}
                                </a>))}
                            <a style={{ color: '#00FF66', fontFamily: 'monospace', }} onClick={() => {
                                setPages(newPages('up'))
                            }}

                            >
                                &raquo;
                            </a>
                        </div>
                    </div>

                    <Button className="button" style={{
                        transition: "0.15s",
                        backgroundColor: "#00ff6658",
                        border: "none",
                        borderRadius: 0,
                        textAlign: "center",
                        fontSize: 30,
                        boxShadow: "3px 3px 5px #00000020",
                        textShadow: "2px 2px 2px #00000020",
                        height: 100,
                        width: 300,
                        marginTop: 100,
                        marginRight: 50,
                        justifyContent: 'center',
                    }} onClick={() => {
                        fetchWaitingGames(0);
                    }}>
                        <p style={{ color: '#00FF66', fontFamily: 'monospace' }}>Filter by waiting</p>
                    </Button>

                    <Button className="button" style={{
                        transition: "0.15s",
                        backgroundColor: "#00ff6658",
                        border: "none",
                        borderRadius: 0,
                        textAlign: "center",
                        fontSize: 30,
                        boxShadow: "3px 3px 5px #00000020",
                        textShadow: "2px 2px 2px #00000020",
                        height: 100,
                        width: 300,
                        marginTop: 100,
                        marginRight: 50,
                        justifyContent: 'center',
                    }} onClick={() => {
                        fetchFinishedGames(0);
                    }}>
                        <p style={{ color: '#00FF66', fontFamily: 'monospace' }}>Filter by finished</p>
                    </Button>

                    <Button className="button" style={{
                        transition: "0.15s",
                        backgroundColor: "#00ff6658",
                        border: "none",
                        borderRadius: 0,
                        textAlign: "center",
                        fontSize: 30,
                        boxShadow: "3px 3px 5px #00000020",
                        textShadow: "2px 2px 2px #00000020",
                        height: 100,
                        width: 300,
                        marginTop: 100,
                        marginRight: 50,
                        justifyContent: 'center',
                    }} onClick={() => {
                        fetchGames(0);
                    }}>
                        <p style={{ color: '#00FF66', fontFamily: 'monospace' }}>All games</p>
                    </Button>
                </div>
            </div>
        </>
    );
}
