import tokenService from "../services/token.service";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Form, Input, Label, Button } from "reactstrap";
import jwt_decode from "jwt-decode";
import FormGenerator from "../components/formGenerator/formGenerator";



export default function EditProfile() {
    const [myPlayer, setMyPlayer] = useState({})
    const [myUser, setMyUser] = useState({});
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;

    async function GetCurrentAccount() {
        const response = await fetch("/api/v1/players?username=" + myUsername, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        
        const fetchedPlayer = await response.json();
        setMyUser(fetchedPlayer[0].user);
        setMyPlayer(fetchedPlayer[0]);
    }

    useEffect(() => {
        if (jwt) {
            GetCurrentAccount();
        }
    }, [jwt])

    function sendLogoutRequest() {
        const jwt = window.localStorage.getItem("jwt");
        if (jwt || typeof jwt === "undefined") {
            tokenService.removeUser();
            window.location.href = "/";
        } else {
            alert("There is no user logged in");
        }

    }

    function ActualizarUsuario(event) {
        event.preventDefault();
        fetch(`/api/v1/users/${myUser.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "PUT",
            body: JSON.stringify(myUser)
        })

        fetch(`/api/v1/players/${myPlayer.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "PUT",
            body: JSON.stringify(myPlayer)
        })
        sendLogoutRequest();
    }

    function handleChangeUsername(event) {
        const target = event.target;
        const value = target.value;
        const changedUser = {
            id: myUser.id,
            username: value,
            password: myUser.password,
            authority: myUser.authority,
        }
        setMyUser(changedUser);
    }

    function handleChangePlayerDescription(event) {
        const target = event.target;
        const value = target.value;
        const changedPlayer = {
            id: myPlayer.id,
            profileDescription: value,
            profilePicture: myPlayer.profilePicture,
            user: myUser,
        }
        setMyPlayer(changedPlayer);
    }

    function handleChangePlayerPicture(event) {
        const target = event.target;
        const value = target.value;
        const changedPlayer = {
            id: myPlayer.id,
            profileDescription: myPlayer.profileDescription,
            profilePicture: value,
            user: myUser,
        }
        console.log(changedPlayer)
        setMyPlayer(changedPlayer);
    }



    return (
        <div className="auth-page-container">
            <h2 className="text-center">
                {"Edit Profile"}
            </h2>
            <div className="auth-form-container">
                <Form onSubmit={ActualizarUsuario}>
                    <div className="custom-form-input">
                        <Label for="name" className="custom-form-input-label-not-mandatory">
                            Username:
                        </Label>
                        <Input
                            type="text"
                            required
                            name="name"
                            id="name"
                            value={myUser.username || ""}
                            onChange={handleChangeUsername}
                            className="custom-input"
                        />
                    </div>

                    <div className="custom-form-input">
                        <Label for="badgeImage" className="custom-form-input-label-not-mandatory">
                            Profile descripction:
                        </Label>
                        <Input
                            type="text"
                            required
                            name="badgeImage"
                            id="badgeImage"
                            value={myPlayer.profileDescription || ""}
                            onChange={handleChangePlayerDescription}
                            className="custom-input"
                        />
                    </div>

                    <div className="custom-form-input">
                        <Label for="badgeImage" className="custom-form-input-label-not-mandatory">
                            Profile picture:
                        </Label>
                        <Input
                            type="text"
                            required
                            name="profilePicture"
                            id="profilePicture"
                            value={myPlayer.profilePicture || ""}
                            onChange={handleChangePlayerPicture}
                            className="custom-input"
                        />
                    </div>

                    <div className="custom-button-row">
                        <button className="auth-button">Save
                        </button>
                        
                        <Link
                            to={`/profile`}
                            className="auth-button"
                            style={{ textDecoration: "none" }}
                        >Cancel
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
} 