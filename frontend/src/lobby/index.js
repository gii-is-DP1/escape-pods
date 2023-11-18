import React from 'react';
import '../App.css';
import '../static/css/home/home.css';
import { Button } from 'reactstrap';

function CreateLobbyButton() {
    return (
        <Button style={{
            backgroundColor: "#ffa555",
            width: 350,
            height: 150,
            fontWeight: 10,
            borderRadius: 30,
            fontSize: 35,
            boxShadow: "10px 10px 5px #00000020",
            textShadow: "4px 4px 2px #00000020"
        }}>
            CREATE LOBBY
        </Button>
    );
}

function JoinLobbyButton() {
    return (
        <Button style={{
            backgroundColor: "#ffe555",
            width: 350,
            height: 150,
            fontWeight: 10,
            borderRadius: 30,
            fontSize: 35,
            boxShadow: "10px 10px 5px #00000020",
            textShadow: "4px 4px 2px #00000020"
        }}>
            JOIN LOBBY
        </Button>
    );
}

function HowToPlayButton() {
    return (
        <Button style={{
            backgroundColor: "#ffd374",
            width: 250,
            height: 75,
            fontWeight: 10,
            borderRadius: 15,
            fontSize: 25,
            boxShadow: "10px 10px 5px #00000020",
            textShadow: "2px 2px 2px #00000020"
        }}
        onClick={() => window.open("https://drive.google.com/file/d/11oSXNXpRMSdqJDTp8a_Ww2MrMLq0N9lm/view?usp=drive_link", "_blank", "noreferrer")}>
            HOW TO PLAY
        </Button>
    );
}

export default function Lobby() {
    return (
        <div className="home-page-container">
            <div>
                <p style={{color: "white"}}>
                    pruebita xd
                </p>
                <CreateLobbyButton>
                </CreateLobbyButton>
            </div>
        </div>
    );
}