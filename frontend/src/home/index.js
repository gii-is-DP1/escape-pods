import React, { useState, useEffect } from 'react';
import '../App.css';
import '../static/css/home/home.css';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import tokenService from "../services/token.service";
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom';



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
    const [joinLobbyvisible, setJoinLobbyVisible] = useState(false);
    const [verUsersVisible, setVerUsersVisible] = useState(false);
    const [verAdminsVisible, setVerAdminsVisible] = useState(false);
    const [numPlayersVisible, setNumPlayersVisible] = useState(false)
    const [roles, setRoles] = useState([]);
    const [waitingGames, setWaitingGames] = useState([])
    const [users, setUsers] = useState([])
    const [myPlayer, setMyPlayer] = useState({});
    const [numPlayers, setNumPlayers] = useState(2);
    const jwt = tokenService.getLocalAccessToken();
    const [pages, setPages] = useState([0, 1, 2, 3, 4, 5, 6]);

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            GetCurrentPlayer()
            getGames(0)
        }
    }, [jwt])

    function GetCurrentPlayer() {
        const username = jwt_decode(jwt).sub
        fetch("/api/v1/players?username=" + username, {
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

    async function getGames(page) {
        try {
            const fetchedGames = await fetchWaitingGames(page);
            setWaitingGames(fetchedGames);
        } catch (error) {
            console.error("Failed to fetch games: ", error);
        }
    }

    async function getUsers(page) {
        try {
            const fetchedUsers = await fetchUsers(page);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Failed to fetch users: ", error);
        }
    }

    async function getAdmins(page) {
        try {
            const fetchedUsers = await fetchAdmins(page);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Failed to fetch admins: ", error);
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
        return games;
    }

    async function fetchUsers(page) {
        const response = await fetch(`/api/v1/users?auth=PLAYER&page=${page}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`http error with status: ${response.status}`);
        }

        const users = await response.json();
        return users;
    }

    async function fetchAdmins(page) {
        const response = await fetch(`/api/v1/users?auth=ADMIN&page=${page}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`http error with status: ${response.status}`);
        }

        const users = await response.json();
        return users;
    }

    async function addPlayerToGame(id) {
        try {
            const response = await fetch(`/api/v1/games/${id}/addPlayer?playerid=${myPlayer.id}`, {
                headers: {
                    "Authorization": ` Bearer ${jwt}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            window.location.href = `/lobby/${id}`
        } catch (error) {
            alert(error);
        }
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
                    setJoinLobbyVisible(false)
                    addPlayerToGame(game.id)
                }}>
                JOIN
            </Button>
        </li>)

    const usersList = users.map(user =>
        <li key={user.username} className='list-games-name' style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10, marginRight: 10 }}>
            <span style={{ fontFamily: 'monospace', color: '#00FF66' }}>
                {user.username}
            </span>
            <Button className="done-button" style={{
                backgroundColor: "#00ff6658",
                border: "none",
                borderRadius: 0,
                boxShadow: "5px 5px 5px #00000020",
                textShadow: "2px 2px 2px #00000020",
                transition: "0.15s",
                fontFamily: 'monospace',
                color: '#00FF66'
            }}
                onClick={() => {
                    setVerUsersVisible(false)
                    window.location.href = `/players/${user.username}`
                }}>
                DETAILS
            </Button>
        </li>)

    const adminList = users.map(user =>
        <li key={user.username} className='list-games-name' style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10, marginRight: 10 }}>
            <span style={{ fontFamily: 'monospace', color: '#00FF66' }}>
                {user.username}
            </span>
            <Button className="done-button" style={{
                backgroundColor: "#00ff6658",
                border: "none",
                borderRadius: 0,
                boxShadow: "5px 5px 5px #00000020",
                textShadow: "2px 2px 2px #00000020",
                transition: "0.15s",
                fontFamily: 'monospace',
                color: '#00FF66'
            }}
                onClick={() => {
                    setVerAdminsVisible(false)
                    window.location.href = `/admins/${user.username}`
                }}>
                DETAILS
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
                    setJoinLobbyVisible(true)
                    getGames(0)
                    console.log(getGames(0))
                }}
            >

                JOIN LOBBY
            </Button >
        );
    }

    function verUsersButton() {
        return (
            <Button className="button" style={{
                transition: "0.15s",
                backgroundColor: "#00ff6658",
                width: 350,
                height: 150,
                fontWeight: 10,
                borderRadius: 30,
                border: "none",
                fontSize: 35,
                boxShadow: "10px 10px 5px #00000020",
                textShadow: "2px 2px 2px #00000020",
                fontFamily: 'monospace',
                color: '#00FF66'

            }}
                onClick={() => {
                    setVerUsersVisible(true)
                    getUsers(0)
                }}
            >

                VER USERS
            </Button >
        );
    }

    function newPages(direction) {
        let out = []
        for (let i = 0; i < pages.length; i++) {
            out.push(pages[i] + (direction === 'up' ? 7 : -7))
        }
        return out;
    }

    return (
        <div>
            <div>
                <Modal isOpen={numPlayersVisible} centered={true} className="modal" style={{ height: "65%" }}>
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
                            backgroundColor: "#cfff68", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                        }} onClick={() => {
                            setNumPlayersVisible(false);
                            createGameAndGoLobby()
                        }}>
                            Done
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            <div>
                <Modal isOpen={joinLobbyvisible} className="modal-join-lobby" >
                    <ModalHeader style={{ color: "white", textShadow: "2px 2px 2px #00000020" }}>
                        Select the game
                    </ModalHeader>
                    <ModalBody style={{ flexDirection: "row" }}>
                        {waitingGames.length !== 0 &&
                            < ul className="ul-games">
                                {waitingGamesList}
                            </ul>
                        }
                        {waitingGames.length === 0 &&
                            <p style={{ color: 'white', height: 310 }}> No games found to show. </p>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <div style={{ flexDirection: "row", alignItems: 'center' }}>
                            <div class="pagination">
                                <a style={{ color: 'white' }} onClick={() => {
                                    if (pages[0] != 0) {
                                        setPages(newPages('down'))
                                    }

                                }}>&laquo;</a>
                                {pages.map((page, index) => (
                                    <a style={{ color: 'white' }} onClick={() => {
                                        getGames(page)
                                    }}
                                    >
                                        {pages[index] + 1}
                                    </a>))}
                                <a style={{ color: 'white' }} onClick={() => {
                                    setPages(newPages('up'))
                                }}

                                >
                                    &raquo;
                                </a>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Button className="done-button" style={{
                                    backgroundColor: "#ffa952", border: "none", boxShadow: "5px 5px 5px #00000020",
                                    textShadow: "2px 2px 2px #00000020", transition: "0.15s", marginTop: 10, flexDirection: 'column', alignSelf: 'center', alignContent: 'center', alignItems: 'center'
                                }}

                                    onClick={() => {
                                        setJoinLobbyVisible(false)
                                        console.log(waitingGames);
                                    }}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>

            {
                roles.includes("PLAYER") &&
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

            {
                !roles.includes("PLAYER") && !roles.includes("ADMIN") &&
                <div className="home-page-container">
                    <img src={"/escape-pods-logo.png"} alt="Logo" width={400} height={266} />
                    <div style={{ color: "white", fontSize: 35, marginTop: 50, textShadow: "2px 2px 2px #00000020" }}>
                        REGISTER OR LOG IN TO START PLAYING
                    </div>
                </div>
            }

            {
                roles.includes("ADMIN") &&
                <div className="home-page-container-retro">

                    <div style={{ marginBottom: 25 }}>
                        <verUsersButton>
                        </verUsersButton>
                    </div>

                    <div style={{ fontSize: 35, marginTop: 50, textShadow: "2px 2px 2px #00000020", display: 'flex', flexDirection: 'row' }}>

                        <Button className="button" style={{
                            transition: "0.15s",
                            backgroundColor: "#00ff6658",
                            border: "none",
                            borderRadius: 0,
                            textAlign: "center",
                            fontSize: 35,
                            boxShadow: "3px 3px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            height: 90,
                            width: 300,
                            marginTop: 460,
                            marginRight: 50,
                            justifyContent: 'center',
                        }} onClick={() => {
                            window.location.href = `/createUser`
                        }}>
                            <p style={{ color: '#00FF66', fontFamily: 'monospace' }}>Create user</p>
                        </Button>

                        <Button className="button" style={{
                            transition: "0.15s",
                            backgroundColor: "#00ff6658",
                            border: "none",
                            borderRadius: 0,
                            textAlign: "center",
                            fontSize: 35,
                            boxShadow: "3px 3px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            height: 90,
                            width: 300,
                            marginTop: 460,
                            marginRight: 50,
                            justifyContent: 'center',
                        }} onClick={() => {
                            window.location.href = `/gameList`
                        }}>
                            <p style={{ color: '#00FF66', fontFamily: 'monospace' }}>Games List</p>
                        </Button>

                        <Button style={{
                            transition: "0.15s",
                            backgroundColor: "#00ff6658",
                            border: "none",
                            borderRadius: 0,
                            textAlign: "center",
                            fontSize: 35,
                            boxShadow: "3px 3px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            height: 90,
                            width: 300,
                            marginTop: 460,
                            justifyContent: 'center',
                            marginRight: 50,

                        }} onClick={() => {
                            setVerUsersVisible(true)
                            getUsers(0)
                        }}
                        >
                            <p style={{ color: '#00FF66', fontFamily: 'monospace' }}>Users List</p>
                        </Button>

                        <Button style={{
                            transition: "0.15s",
                            backgroundColor: "#00ff6658",
                            border: "none",
                            borderRadius: 0,
                            textAlign: "center",
                            fontSize: 35,
                            boxShadow: "3px 3px 5px #00000020",
                            textShadow: "2px 2px 2px #00000020",
                            height: 90,
                            width: 300,
                            marginTop: 460,
                            justifyContent: 'center',

                        }} onClick={() => {
                            setVerAdminsVisible(true)
                            getAdmins(0)
                        }}
                        >
                            <p style={{ color: '#00FF66', fontFamily: 'monospace' }}>Admin List</p>
                        </Button>
                    </div>
                    <div>
                        <Modal isOpen={verUsersVisible} className="modal-join-lobby" >
                            <ModalHeader style={{ color: '#00FF66', textShadow: "2px 2px 2px #00000020" }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'right', alignSelf: 'right', alignItems: 'right' }}>
                                    <p style={{ fontFamily: 'monospace' }}>Users</p>
                                </div>
                            </ModalHeader>
                            <ModalBody style={{ flexDirection: "row", fontFamily: 'monospace', color: '#00FF66' }}>
                                {users.length !== 0 &&
                                    < ul className="ul-games" style={{ fontFamily: 'monospace', color: '#00FF66' }}>
                                        {usersList}
                                    </ul>
                                }
                                {users.length === 0 &&
                                    <p style={{ height: 310, fontFamily: 'monospace', color: '#00FF66' }}> No users found to show. </p>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <div style={{ flexDirection: "row", alignItems: 'center' }}>
                                    <div class="pagination">
                                        <a style={{ fontFamily: 'monospace', color: '#00FF66' }} onClick={() => {
                                            if (pages[0] != 0) {
                                                setPages(newPages('down'))
                                            }

                                        }}>&laquo;</a>
                                        {pages.map((page, index) => (
                                            <a style={{ fontFamily: 'monospace', color: '#00FF66' }} onClick={() => {
                                                getUsers(page)
                                            }}
                                            >
                                                {pages[index] + 1}
                                            </a>))}
                                        <a style={{ fontFamily: 'monospace', color: '#00FF66' }} onClick={() => {
                                            setPages(newPages('up'))
                                        }}

                                        >
                                            &raquo;
                                        </a>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Button className="done-button" style={{
                                            backgroundColor: "#00ff6658", fontFamily: 'monospace', border: "none", boxShadow: "5px 5px 5px #00000020",
                                            textShadow: "2px 2px 2px #00000020", transition: "0.15s", marginTop: 10, flexDirection: 'column', alignSelf: 'center',
                                            alignContent: 'center', alignItems: 'center', borderRadius: 0, color: '#00FF66'
                                        }}

                                            onClick={() => {
                                                setVerUsersVisible(false)
                                                console.log(users);
                                            }}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </ModalFooter>
                        </Modal>
                    </div>
                    <div>
                        <Modal isOpen={verAdminsVisible} className="modal-join-lobby" >
                            <ModalHeader style={{ color: '#00FF66', textShadow: "2px 2px 2px #00000020" }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'right', alignSelf: 'right', alignItems: 'right' }}>
                                    <p style={{ fontFamily: 'monospace' }}>Admins</p>
                                </div>
                            </ModalHeader>
                            <ModalBody style={{ flexDirection: "row", fontFamily: 'monospace', color: '#00FF66' }}>
                                {users.length !== 0 &&
                                    < ul className="ul-games" style={{ fontFamily: 'monospace', color: '#00FF66' }}>
                                        {adminList}
                                    </ul>
                                }
                                {users.length === 0 &&
                                    <p style={{ height: 310, fontFamily: 'monospace', color: '#00FF66' }}> No users found to show. </p>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <div style={{ flexDirection: "row", alignItems: 'center' }}>
                                    <div class="pagination">
                                        <a style={{ fontFamily: 'monospace', color: '#00FF66' }} onClick={() => {
                                            if (pages[0] != 0) {
                                                setPages(newPages('down'))
                                            }

                                        }}>&laquo;</a>
                                        {pages.map((page, index) => (
                                            <a style={{ fontFamily: 'monospace', color: '#00FF66' }} onClick={() => {
                                                getAdmins(page)
                                            }}
                                            >
                                                {pages[index] + 1}
                                            </a>))}
                                        <a style={{ fontFamily: 'monospace', color: '#00FF66' }} onClick={() => {
                                            setPages(newPages('up'))
                                        }}

                                        >
                                            &raquo;
                                        </a>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Button className="done-button" style={{
                                            backgroundColor: "#00ff6658", fontFamily: 'monospace', border: "none", boxShadow: "5px 5px 5px #00000020",
                                            textShadow: "2px 2px 2px #00000020", transition: "0.15s", marginTop: 10, flexDirection: 'column', alignSelf: 'center',
                                            alignContent: 'center', alignItems: 'center', borderRadius: 0, color: '#00FF66'
                                        }}

                                            onClick={() => {
                                                setVerAdminsVisible(false)
                                                console.log(users);
                                            }}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
            }
        </div >
    );
}