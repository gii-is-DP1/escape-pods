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
        fetch(`/api/v1/users/${myUsername}`, {
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


    function ActualizarUsuario(event) {
        fetch(`/api/v1/users/${myUsername}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "PUT",
            body: JSON.stringify(myUsername)
        })
        fetch(`/api/v1/players/${myPlayer}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "PUT",
            body: JSON.stringify(myPlayer)
        })
        window.location.href = "/profile";

    }


    useEffect(() => {
        if (jwt) {
            GetCurrentPlayer();
            GetCurrentUser();
        }
    }, [jwt])

    
    function handleChangeUser(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setMyUser({ ...myUser, [name]: value });
    }

    function handleChangePlayer(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setMyPlayer({ ...myPlayer, [name]: value });
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
                            value={myUsername || ""}
                            onChange={handleChangeUser}
                            className="custom-input"
                        />
                    </div>
                    <div className="custom-form-input">
                        <Label for="description" className="custom-form-input-label-not-mandatory">
                            Password:
                        </Label>
                        <Input
                            type="text"
                            required
                            name="description"
                            id="descripction"
                            value={"********" || ""}
                            onChange={handleChangeUser}
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
                            onChange={handleChangePlayer}
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
                                    isRequired: true, type: "files"
                                }]}
                            onSubmit={handleChangePlayer}
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
