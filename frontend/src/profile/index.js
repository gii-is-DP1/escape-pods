import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button,Modal,ModalHeader,ModalFooter, ModalBody,Badge, UncontrolledCollapse } from "reactstrap";
import '../App.css';
import tokenService from '../services/token.service';
import '../static/css/home/home.css';
import "../static/css/lobby/lobby.css";
import { Link } from 'react-router-dom';
import foto from "../static/images/pod1.png";


//ICONOS
import { DiAptana } from "react-icons/di";
import { MdAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { RiChatOffLine, RiChat4Line, RiCodeFill } from "react-icons/ri";


export default function Profile() {

    const [myPlayer, setMyPlayer] = useState({})
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const [game, setGame] = useState({});
    const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);

    let userLogout = <></>;


    useEffect(() => {
        if (jwt) {
            GetCurrentPlayer();
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

    function DeleteCurrentPlayer() {
        fetch(`/api/v1/players/${myPlayer.id}` , {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
            .then(response => response.json())
            .then(response => { setMyPlayer(response[0]) })
    }



    return (
        <>
            <div className="lobby-page-container" >
            <div>
                <Modal isOpen={deleteAccountVisible} centered={true} className="modal" style={{ height: "65%" }}>
                    <ModalBody style={{ flexDirection: "row", color: "white", textAlign: "center"}}>
                        ¿Seguro que quieres eliminar tu cuenta? Esto la eliminará de forma permanente.
                    </ModalBody>
                    <ModalFooter>
                        <Button className="done-button" style={{
                            backgroundColor: "#DC2525", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                        }} onClick={() => {
                            setDeleteAccountVisible(false);
                        }}>
                            Cancel
                        </Button>
                        <Button className="done-button" style={{
                            backgroundColor: "#21FF1E", border: "none", boxShadow: "5px 5px 5px #00000020", textShadow: "2px 2px 2px #00000020", transition: "0.15s",
                        }} onClick={() => {
                            DeleteCurrentPlayer();
                            setDeleteAccountVisible(false);
                        }}>
                            Done
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
                <div className="hero-div" style={{ backgroundColor: "rgba(223, 0, 0, 0)", backdropFilter: "blur(0px)", color: 'white', height: 300, width: 300, alignItems: 'left', marginBottom: 300, marginRight: 250 }}>
                    <div style={{ position: 'relative', marginBottom: 50 }}>
                        <img className="profile-picture" src={foto}
                            style={{ rotate: '-90deg', height: 300, width: 300 }} />
                    </div>
                    <div style={{ position: 'absolute', marginTop: 104.5, marginLeft: 100 }}>
                        <img className="profile-picture" src={myPlayer.profilePicture}
                            style={{ height: 100, width: 100 }} />
                        <p style={{ marginTop: 60, alignSelf: 'center', fontSize: 30, textTransform: 'uppercase' }}>{myUsername}</p>
                    </div>
                    <div>
                        <Link to="/logout">
                            <Button className="button" style={{
                                backgroundColor: "#ff6868",
                                border: "none",
                                width: 250,
                                fontSize: 20,
                                borderRadius: 20,
                                height: 55,
                                boxShadow: "5px 5px 5px #00000020",
                                textShadow: "2px 2px 2px #00000020",
                                transition: "0.15s",
                                alignSelf: "center",
                                marginBottom: 20,
                                marginLeft: 30
                            }}>LOGOUT

                            </Button>
                        </Link>
                            <Button className="button" style={{
                                backgroundColor: "#ED0000",
                                border: "none",
                                width: 250,
                                fontSize: 20,
                                borderRadius: 20,
                                height: 55,
                                boxShadow: "5px 5px 5px #00000020",
                                textShadow: "2px 2px 2px #00000020",
                                transition: "0.15s",
                                alignSelf: "center",
                                marginBottom: 20,
                                marginLeft: 30
                            }} onClick={() => {
                                setDeleteAccountVisible(true);
                                console.log(myUsername)

                            }}>DELETE ACCOUNT

                            </Button>
                            <Button className="button" style={{
                                backgroundColor: "#06E1FF",
                                border: "none",
                                width: 250,
                                fontSize: 20,
                                borderRadius: 20,
                                height: 55,
                                boxShadow: "5px 5px 5px #00000020",
                                textShadow: "2px 2px 2px #00000020",
                                transition: "0.15s",
                                alignSelf: "center",
                                marginBottom: 20,
                                marginLeft: 30
                            }} onClick={() => {
                                window.location.href = `/editProfile`
                            }}>EDIT ACCOUNT
                            </Button>
                    </div>
                </div>

                <div className="hero-div" style={{ color: 'white', height: 500, width: 800, alignItems: 'center', fontSize: 35 }}>
                    STATS
                </div>

            </div >
        </>
    )

}