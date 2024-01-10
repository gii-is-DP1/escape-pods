import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse, Table } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import { Link } from 'react-router-dom';
import foto from "../static/images/pods/pod1.png";


//ICONOS
import { DiAptana } from "react-icons/di";
import { MdAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { RiChatOffLine, RiChat4Line, RiCodeFill } from "react-icons/ri";
import { BiSolidInvader } from "react-icons/bi";
import { FaSpaceAwesome } from "react-icons/fa6";
import { FaGalacticRepublic, FaFulcrum } from "react-icons/fa";


export default function Profile() {

    const [myPlayer, setMyPlayer] = useState({})
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const [game, setGame] = useState({});
    let userLogout = <></>;
    const [pages, setPages] = useState([0, 1, 2, 3, 4, 5, 6]);
    const [playerGames, setPlayerGames] = useState([])


    useEffect(() => {
        if (jwt) {
            getPageData();

        }
    }, [jwt])

    async function GetCurrentPlayer() {
        const usrnm = jwt_decode(jwt).sub;
        const response = await fetch("/api/v1/players?username=" + usrnm, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedPlayer = await response.json();
        console.log(fetchedPlayer[0]);
        setMyPlayer(fetchedPlayer[0]);
        return fetchedPlayer[0];
    }

    async function getPlayerGames(page, player) {
        try {
            const fetchedGames = await fetchPlayerGames(page, player);
            setPlayerGames(fetchedGames);
        } catch (error) {
            console.error("Failed to fetch games: ", error);
        }
    }

    async function getPageData(){
        await getPlayerGames(0, await GetCurrentPlayer());
    }
    
    async function fetchPlayerGames(page, player) {
        const response = await fetch(`/api/v1/games?playerId=${player.id}&page=${page}`, {
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
        setPlayerGames(games);
        return games;
    }

    const GamesList = playerGames.map(game =>
        <tr key={game.id} style={{ fontSize: 20, backgroundColor: "rgba(0, 0, 0, 0)" }}>
            <td style={{ color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0)' }}>{game.id}</td>
            <td style={{ color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0)' }}>{game.players[0].user.username}</td>
            <td style={{ color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0)', }}>{JSON.stringify(game) === "{}" ? null : game.players.map((player, index, array) => player.user.username + (index < array.length - 1 ? ", " : ""))}</td>
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
            <div className="lobby-page-container" >
                <div className="hero-div" style={{ backgroundColor: "rgba(223, 0, 0, 0)", backdropFilter: "blur(0px)", color: 'white', height: 300, width: 300, alignItems: 'left', marginBottom: 300, marginRight: 250, }}>
                    <div style={{ position: 'relative', marginBottom: 100 }}>
                        <img className="profile-picture" src={foto}
                            style={{ rotate: '-90deg', height: 300, width: 300 }} />
                    </div>
                    <div style={{ position: 'absolute', marginTop: 104.5, marginLeft: 100 }}>
                        {myPlayer.profilePicture !== undefined &&
                            <img className="profile-picture" src={myPlayer.profilePicture.startsWith("http") ? myPlayer.profilePicture : `data:image/png;base64,${myPlayer.profilePicture}`}
                                style={{ height: 100, width: 100 }} />
                        }
                        <p style={{ marginTop: 60, alignSelf: 'center', fontSize: 30 }}>{myUsername}</p>
                    </div>

                    <Link to="/logout">
                        <Button className="button" style={{
                            backgroundColor: "#ff6868",
                            border: "none",
                            width: 250,
                            fontSize: 30,
                            borderRadius: 20,
                            height: 100,
                            boxShadow: "5px 5px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            transition: "0.15s",
                            alignSelf: "center",
                            marginBottom: 20,
                            marginLeft: 30
                        }}>LOGOUT
                        </Button>
                    </Link>
                </div>
                <div className="hero-div" style={{ color: 'white', height: 600, width: 800, alignItems: 'center', fontSize: 30 }}>
                    GAMES
                    <div>
                        <Table bordered dark className="tabla" style={{ fontSize: 20, backgroundColor: "rgba(0, 0, 0, 0)", width: 680, }}>
                            <thead className="tabla" style={{ fontSize: 20, backgroundColor: "rgba(0, 0, 0, 0)" }}>
                                <tr>
                                    <th style={{ color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0)' }}>Id <FaFulcrum style={{ fontSize: 25 }} /></th>
                                    <th style={{ color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0)' }}>Owner <BiSolidInvader /></th>
                                    <th style={{ color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0)' }}>Players <FaSpaceAwesome /></th>
                                </tr>
                            </thead>
                            <tbody >
                                {GamesList.length !== 0 &&
                                    GamesList
                                }
                                {GamesList.length === 0 &&
                                    <p style={{ color: '#ffffff', height: 310, marginLeft: 10 }}> No games found to show. </p>
                                }
                            </tbody>
                        </Table>
                        <div style={{
                            display: 'flex', flexDirection: "column", alignItems: 'center',
                            alignContent: 'center', justifyContent: 'center'
                        }}>
                            <div class="pagination" style={{ flexDirection: "row", alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)', fontSize: 20, justifyContent: 'center' }}>
                                <a style={{ color: '#ffffff', }} onClick={() => {
                                    if (pages[0] != 0) {
                                        setPages(newPages('down'))
                                    }

                                }}>&laquo;</a>
                                {pages.map((page, index) => (
                                    <a style={{ color: '#ffffff', }} onClick={() => {
                                        getPlayerGames(page, myPlayer)
                                    }}
                                    >
                                        {pages[index] + 1}
                                    </a>))}
                                <a style={{ color: '#ffffff', }} onClick={() => {
                                    setPages(newPages('up'))
                                }}

                                >
                                    &raquo;
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )

}