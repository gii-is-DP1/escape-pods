import tokenService from "../../services/token.service";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Form, Input, Label } from "reactstrap";
import jwt_decode from "jwt-decode";
import FormGenerator from "../../components/formGenerator/formGenerator";
import useFetchData from "../../util/useFetchData";


export default function EditAdmin() {

    const [myUser, setMyUser] = useState({});
    const jwt = tokenService.getLocalAccessToken();
    const myUsername = jwt_decode(jwt).sub;
    const playerUsername = window.location.href.split("/")[4]
    const auths = useFetchData(`/api/v1/users/authorities`, jwt);

    const authOptions = auths.filter(auth=> auth.id === 1 || auth.id === 5).map((auth) => (
        <option key={auth.id} value={auth.id}>
            {auth.authority}
        </option>
    ));

    async function GetCurrentUser() {
        const response = await fetch(`/api/v1/users?username=${playerUsername}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })

        const fetchedUser = await response.json();
        setMyUser(fetchedUser[0]);
    }

    useEffect(() => {
        if (jwt) {
            GetCurrentUser();
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

    async function ActualizarUsuario(event) {
        event.preventDefault();
        await fetch(`/api/v1/users/${myUser.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "PUT",
            body: JSON.stringify(myUser)
        })
        console.log(myUser)
        if (myUser.authority.id === 5) {
            await fetch(`/api/v1/players`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        user: myUser,
                        profileDescription: "hello world. I'm a new player",
                        profilePicture: "https://www.webwise.ie/wp-content/uploads/2020/12/IMG1207.jpg",
                    })
            })
        }
        console.log(myUser)
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






    function handleChangeAuth(event) {
        const target = event.target;
        const value = target.value;
        const auth = auths.find((a) => a.id === Number(value));
        const changedUser = {
            id: myUser.id,
            username: myUser.username,
            password: myUser.password,
            authority: auth,

        }
        console.log(changedUser)
        setMyUser(changedUser);
    }


    return (
        <div className="auth-page-container">
            <h2 className="text-center">
                {"Edit Player"}
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
                        <Label for="authority" className="custom-form-input-label-not-mandatory">
                            Authority:
                        </Label>
                        <Input
                            type="select"
                            name="authority"
                            id="authority"
                            value={myUser.authority?.id || ""}
                            onChange={handleChangeAuth}
                            className="custom-input"
                        >
                            {authOptions}
                        </Input>
                    </div>

                    <div className="custom-button-row">
                        <button className="auth-button">Save
                        </button>

                        <Link
                            to={`/admins/${myUser.username}`}
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