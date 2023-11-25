import React, { useState, useEffect } from 'react';
import '../App.css';
import '../static/css/home/home.css';
import { Button } from 'reactstrap';
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
        }}>
            JOIN LOBBY
        </Button>
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
    const [roles, setRoles] = useState([]);
    const jwt = tokenService.getLocalAccessToken();
    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
        }
    }, [jwt])
    return (
        <div>
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