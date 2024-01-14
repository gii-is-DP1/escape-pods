import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalFooter, ModalBody, } from "reactstrap";
import '../../App.css';
import tokenService from '../../services/token.service';
import '../../static/css/home/home.css';
import "../../static/css/lobby/lobby.css";

export default function Admins() {

    const [myUser, setMyUser] = useState({})
    const jwt = tokenService.getLocalAccessToken();
    const [game, setGame] = useState({});
    let userLogout = <></>;
    const playerUsername = window.location.href.split("/")[4]
    const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
    const [loggedAccount, setLoggedAccount] = useState({})


    useEffect(() => {
        if (jwt) {
            GetCurrentPlayer();
            GetLoggedAccount();
        }
    }, [jwt])


    async function GetLoggedAccount() {
        const usrnm = jwt_decode(jwt).sub;
        const response = await fetch(`/api/v1/users?username=${usrnm}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedPlayer = await response.json();
        console.log(fetchedPlayer[0].username);
        setLoggedAccount(fetchedPlayer[0]);
    }

    function sendLogoutRequest() {
        const jwt = window.localStorage.getItem("jwt");
        if (jwt || typeof jwt === "undefined") {
            tokenService.removeUser();
            window.location.href = "/";
        } else {
            alert("There is no user logged in");
        }

    }

    function decideWhoToDelete() {
        if (loggedAccount.username === playerUsername) {
            sendLogoutRequest();
        }
        else {
            window.location.href = "/";
        }
    }

    async function GetCurrentPlayer() {
        const response = await fetch(`/api/v1/users?username=${playerUsername}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedPlayer = await response.json();
        console.log(fetchedPlayer[0]);
        setMyUser(fetchedPlayer[0]);
    }
    console.log(myUser)

    async function GetPlayerToEdit() {
        setGame(await fetchPlayerToEdit())
    }

    async function fetchPlayerToEdit() {
        const response = await fetch(`/api/v1/users?username=${playerUsername}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedGame = await response.json();
        window.location.href = `/editAdmin/${playerUsername}`
        return fetchedGame
    }
    console.log(myUser)

    function DeleteCurrentAccount() {

        fetch(`/api/v1/users/${myUser.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
            .then(response => response.json())
            .then(response => { setMyUser(response[0]) })
    }

    return (
        <>
            <div className="lobby-page-container-retro" >

                <div className="hero-div" style={{
                    backgroundColor: "rgba(223, 0, 0, 0)",
                    backdropFilter: "blur(0px)",
                    height: 300, width: 200,
                    marginBottom: 300,
                    marginRight: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <div style={{ marginLeft: 400, marginTop: -30, }}>
                        <p style={{ marginTop: 20, fontSize: 30, color: '#00FF66', fontFamily: 'monospace', }}>User:</p>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={{ fontSize: 20, color: '#00ff6600', fontFamily: 'monospace', }}>..</p>
                            <p style={{ fontSize: 30, color: '#00FF66', fontFamily: 'monospace', }}>{playerUsername}</p>
                        </div>
                    </div>
                </div>


                <Button className="button" style={{
                    backgroundColor: "#00ff6658",
                    border: "none",
                    width: 400,
                    fontSize: 30,
                    borderRadius: 0,
                    height: 100,
                    boxShadow: "5px 5px 5px #00000020",
                    textShadow: "2px 2px 2px #00000020",
                    transition: "0.15s",
                    alignSelf: "center",
                    marginBottom: 20,
                    marginLeft: 10,
                    marginTop: 300,
                    marginRight: 40,
                    fontFamily: 'monospace',
                    color: '#00FF66'

                }}
                    onClick={() => {

                        GetPlayerToEdit()
                    }
                    }>
                    EDIT ACCOUNT
                </Button>
                <Button className="button" style={{
                    backgroundColor: "#830000",
                    color: '#FF0000',
                    border: "none",
                    width: 400,
                    fontSize: 30,
                    borderRadius: 0,
                    height: 100,
                    boxShadow: "5px 5px 5px #00000020",
                    textShadow: "2px 2px 2px #00000020",
                    transition: "0.15s",
                    alignSelf: "center",
                    marginBottom: 20,
                    marginLeft: 10,
                    marginTop: 300,
                    marginRight: 40,
                    fontFamily: 'monospace',


                }} onClick={() => {
                    setDeleteAccountVisible(true);


                }}>DELETE ACCOUNT
                </Button>

                <div>
                    <Modal isOpen={deleteAccountVisible} centered={true} className="modal" style={{ height: "65%" }}>
                        <ModalBody style={{ flexDirection: "row", color: "white", textAlign: "center" }}>
                            ¿Seguro que quieres eliminar la cuenta? Esto la eliminará de forma permanente.
                        </ModalBody>
                        <ModalFooter>
                            <Button className="done-button" style={{
                                backgroundColor: "#DC2525", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                            }} onClick={() => {
                                setDeleteAccountVisible(false);
                                console.log(myUser)
                            }}>
                                Cancel
                            </Button>
                            <Button className="done-button" style={{
                                backgroundColor: "#21FF1E", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                            }} onClick={() => {
                                DeleteCurrentAccount();
                                decideWhoToDelete();
                            }}>
                                Done
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div >
        </>
    )
}