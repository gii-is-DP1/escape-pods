import React from "react";
import { Link } from "react-router-dom";
import "../../static/css/auth/authButton.css";
import "../../static/css/auth/authPage.css";
import tokenService from "../../services/token.service";
import { GiDeathStar } from "react-icons/gi";


const Logout = () => {
  function sendLogoutRequest() {
    const jwt = window.localStorage.getItem("jwt");
    if (jwt || typeof jwt === "undefined") {
      tokenService.removeUser();
      window.location.href = "/";
    } else {
      alert("There is no user logged in");
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-form-container" style={{textAlign:'center', marginTop:20}}>
        <h2 className="text-center text-md">
          Do you really want to logout?
        </h2>
        <div className="options-row">
          <Link className="auth-button" to="/" style={{textDecoration: "none"}}>
            No
          </Link>
          <button className="auth-button" onClick={() => sendLogoutRequest()}>
            Yes
          </button>
        </div>
        <div style={{marginTop:20}}>
        May the pods be with you. <GiDeathStar style={{fontSize:25}}/>
        </div>
      </div>
    </div>
  );
};

export default Logout;
