import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavLink, NavItem, Nav, NavbarText, NavbarToggler, Collapse } from 'reactstrap';
import { Link } from 'react-router-dom';
import tokenService from './services/token.service';
import jwt_decode from "jwt-decode";
import "./static/css/home/home.css";
import fotoP from "./static/images/foto-perfil-generica.png";
import fotoP2 from "./static/images/amongus-profile-picture.png";


function AppNavbar() {
    const [roles, setRoles] = useState([]);
    const [username, setUsername] = useState("");
    const jwt = tokenService.getLocalAccessToken();
    const [collapsed, setCollapsed] = useState(true);
    const [myPlayer, setMyPlayer] = useState({})
    
    


    const toggleNavbar = () => setCollapsed(!collapsed);

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            setUsername(jwt_decode(jwt).sub);
            GetCurrentPlayer();
        }
    }, [jwt])

    async function GetCurrentPlayer() {
        const usrnm = jwt_decode(jwt).sub;
        const response = await fetch("/api/v1/players?username=" + usrnm, {
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

    let adminLinks = <></>;
    let ownerLinks = <></>;
    let userLinks = <></>;
    let userLogout = <></>;
    let publicLinks = <></>;

    roles.forEach((role) => {
        if (role === "ADMIN") {
            adminLinks = (
                null
            )
        }
        if (role === "OWNER") {
            ownerLinks = (
                <>
                    
                    <NavItem>
                        <NavLink style={{ color: "white" }} tag={Link} to="/achievements">Achievements</NavLink>
                    </NavItem>

                </>
            )
        }
        if (role === "VET") {
            ownerLinks = (
                <>
                    <NavItem>
                        <NavLink style={{ color: "white" }} tag={Link} to="/consultations">Consultations</NavLink>
                    </NavItem>
                </>
            )
        }

        if (role === "CLINIC_OWNER") {
            ownerLinks = (
                <>
                    <NavItem>
                        <NavLink style={{ color: "white" }} tag={Link} to="/clinics">Clinics</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ color: "white" }} tag={Link} to="/owners">Owners</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ color: "white" }} tag={Link} to="/consultations">Consultations</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ color: "white" }} tag={Link} to="/vets">Vets</NavLink>
                    </NavItem>
                </>
            )
        }
    })

    if (!jwt) {
        publicLinks = (
            <>
                <NavItem>
                    <NavLink style={{ color: "white" }} id="register" tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink style={{ color: "white" }} id="login" tag={Link} to="/login">Login</NavLink>
                </NavItem>
            </>
        )
        
    } else {
        userLinks = (
            <>
                
            </>
        )
        userLogout = (
            <>
                <NavbarText style={{ color: "white" }} className="justify-content-end">{username}</NavbarText>

                <NavItem className="d-flex" style={{ marginLeft: 10 }}>
                    <NavLink style={{ color: "white" }} id="logout" tag={Link} to="/logout">Logout</NavLink>
                </NavItem>
            </>
        )
        

    }

    return (
        <div>
            <Navbar expand="md">
                <NavbarBrand href={!window.location.href.match(/\/game\/\d+$/)? "/" : null }>
                     <img alt="logo" src="/escape-pods-logo.png" style={{ height: 40, width: 60 }} />
                </NavbarBrand>

                <NavbarToggler onClick={toggleNavbar} className="ms-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav className="me-auto mb-2 mb-lg-0" navbar>
                        {userLinks}
                        {adminLinks}
                        {ownerLinks}
                    </Nav>
                    <Nav className="ms-auto mb-2 mb-lg-0" navbar>
                        {publicLinks}
                        {!window.location.href.match(/\/game\/\d+$/) && userLogout}
                    </Nav>
                </Collapse>
                {!emptyChecker('object', myPlayer)&& roles.includes("PLAYER") && !window.location.href.match(/\/game\/\d+$/)  &&
                    <NavbarBrand href="/profile">
                        <img src={!emptyChecker("object", myPlayer) && myPlayer != undefined && myPlayer!= undefined ? myPlayer.profilePicture : fotoP2} style={{ height: 50, width: 50, marginLeft: 10, borderRadius: '50%' }} />                    </NavbarBrand>
                }
            </Navbar>
        </div >
    );
}

export default AppNavbar;