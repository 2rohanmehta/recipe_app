import React from "react";
import "../Styles/Login.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AutoLogout from "../Components/AutoLogout";
import { useUser } from "../contexts/UserContent";
const LoginPage = () => {
  AutoLogout();
  const { setUserID } = useUser();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [wrongPassword, setWrongPassword] = useState(false);
  const [userDoesNotExists, setDoesNotExists] = useState(false);
  const [popupKey, setPopupKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setWrongPassword(false);
      setDoesNotExists(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [wrongPassword, userDoesNotExists]);

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data.Login) {
          // setIsLoggedIn(true);
          setUserID(result.data.UserID);
          navigate("/home");
        } else if (result.data === "password incorrect") {
          setWrongPassword(true);
          setPopupKey((prevKey) => prevKey + 1);
        } else if (result.data === "user not found") {
          setDoesNotExists(true);
          setPopupKey((prevKey) => prevKey + 1);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-page">
      <img className="macbook" src="/macbook.png" alt="" />
      <div className="login-setup">
        <div className="login-form">
          <div className="center-logo">
            <img src="/recipe_realm.svg" alt="" className="login-logo" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="email-password">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="custom-input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="email-password">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="custom-input"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div
              key={popupKey}
              className={`popup ${
                wrongPassword || userDoesNotExists ? "show" : ""
              }`}
            >
              {wrongPassword && <p>Wrong Password!</p>}
              {userDoesNotExists && <p>User Does Not Exist!</p>}
            </div>
            <div className="centered-content">
              <button className="login-button">Login</button>
            </div>
          </form>
        </div>
        <div className="sign-up">
          <p>
            Don't have an account?{" "}
            <a className="sign-up-button" href="/signup">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
