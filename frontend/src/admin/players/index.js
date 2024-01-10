import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Button, Badge, UncontrolledCollapse } from "reactstrap";
import '../../App.css';
import tokenService from '../../services/token.service';
import '../../static/css/home/home.css';
import "../../static/css/lobby/lobby.css";
import { Link } from 'react-router-dom';
import foto from "../../static/images/profile-picture-cover.png";
import fotoP2 from "../../static/images/amongus-profile-picture.png";



//ICONOS
import { DiAptana } from "react-icons/di";
import { MdAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { RiChatOffLine, RiChat4Line, RiCodeFill } from "react-icons/ri";


export default function Players() {

    const [myPlayer, setMyPlayer] = useState({})
    const jwt = tokenService.getLocalAccessToken();
    const [game, setGame] = useState({});
    let userLogout = <></>;
    const myUsername = window.location.href.split("/")[4]


    useEffect(() => {
        if (jwt) {
            GetCurrentPlayer();
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

    return (
        <>
            <div className="lobby-page-container-retro" >
                <div className="hero-div" style={{
                    backgroundColor: "rgba(223, 0, 0, 0)",
                    backdropFilter: "blur(0px)",
                    height: 300, width: 200,
                    marginBottom: 300,
                    marginRight: 20,
                    marginLeft: -300,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <img className="profile-picture" src={foto}
                        style={{ height: 170, width: 170, position: 'relative' }} />

                    <img className="profile-picture" src={myPlayer && !emptyChecker("object", myPlayer) && Object.keys(myPlayer).includes('profilePicture') ? myPlayer.profilePicture : { fotoP2 }}
                        style={{ height: 150, width: 150, position: 'absolute', marginTop: 10 }} />

                </div>
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
                    <div style={{ marginLeft:400, marginTop:-30,}}>
                        <p style={{ marginTop: 20, fontSize: 30, color: '#00FF66',fontFamily: 'monospace', }}>User:</p>
                        <div style={{display:'flex', flexDirection:'row'}}>
                        <p style={{ fontSize: 20, color: '#00ff6600', fontFamily: 'monospace', }}>..</p>
                        <p style={{ fontSize: 30, color: '#00FF66', fontFamily: 'monospace', }}>{myUsername}</p>
                        </div>
                        <p style={{ marginTop: 20, fontSize: 30, color: '#00FF66',fontFamily: 'monospace', }}>Profile description:</p>
                        <div style={{display:'flex', flexDirection:'row', width:500}}>
                        <p style={{ fontSize: 20, color: '#00ff6600', fontFamily: 'monospace', }}>..</p>
                        <p style={{ fontSize: 30, color: '#00FF66', fontFamily: 'monospace', }}>{myPlayer.profileDescription}</p>
                        </div>
                    </div>
                </div>

                <Link to="" style={{height: 120, width:270}}>
                    <Button className="button" style={{
                        backgroundColor: "#00ff6658",
                        border: "none",
                        width: 250,
                        fontSize: 30,
                        borderRadius: 0,
                        height: 100,
                        boxShadow: "5px 5px 5px #00000020",
                        textShadow: "2px 2px 2px #00000020",
                        transition: "0.15s",
                        alignSelf: "center",
                        marginBottom: 20,
                        marginLeft: 10,
                        marginTop: 200,
                        marginRight: 400,
                        fontFamily: 'monospace',
                        color: '#00FF66'

                    }}>EDIT ACCOUNT
                    </Button>
                </Link>
                <Link to="" style={{height: 120, width:270}}>
                    <Button className="button" style={{
                        backgroundColor: "#830000",
                        border: "none",
                        width: 250,
                        fontSize: 30,
                        borderRadius: 0,
                        height: 100,
                        boxShadow: "5px 5px 5px #00000020",
                        textShadow: "2px 2px 2px #00000020",
                        transition: "0.15s",
                        alignSelf: "center",
                        marginBottom: 20,
                        marginLeft: 10,
                        marginTop: 200,
                        marginRight: 350,
                        fontFamily: 'monospace',
                        color: '#FF0000'

                    }}>DELETE ACCOUNT
                    </Button>
                </Link>
            </div >
        </>
    )

}