import tokenService from "../services/token.service";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Form, Input, Label } from "reactstrap";
import jwt_decode from "jwt-decode";
import FormGenerator from "../components/formGenerator/formGenerator";



export default function EditProfile() {
    const [myPlayer, setMyPlayer] = useState({})
    const [myUser, setMyUser] = useState({});
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;

    function GetCurrentUser() {
        fetch("/api/v1/users?username=" + myUsername, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
            .then(response => response.json())
            .then(response => { setMyUser(response[0]) })
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
    useEffect(() => {
        if (jwt) {
            GetCurrentPlayer();
            GetCurrentUser();
            console.log(myPlayer, myUser);
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
        //sendLogoutRequest();
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
        //setMyPlayer(changedPlayer);
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
                        <FormGenerator
                            inputs={[
                                {
                                    tag: "Profile Picture",
                                    name: "profilePicture",
                                    type: "files",
                                    isRequired: true,
                                }
                            ]}
                            //el problema es el handleChangePlayerPicture que el onsubmit el evento no que produce al darle. 
                            onSubmit={handleChangePlayerPicture}
                            numberOfColumns={1}
                            listenEnterKey
                            buttonText="Save"
                            buttonClassName="auth-button"
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
