import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { useUser } from "../contexts/UserContent";
import { placeholders } from "./SearchPlaceholders";

const Navbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const placeholderRef = useRef();

  const navigate = useNavigate();

  const getRandomPlaceholder = () =>
    placeholders[Math.floor(Math.random() * placeholders.length)];

  const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (placeholderRef.current) {
        placeholderRef.current.style.opacity = 0;
      }

      setTimeout(() => {
        const randomPlaceholder = getRandomPlaceholder();
        setPlaceholder(randomPlaceholder);

        if (placeholderRef.current) {
          placeholderRef.current.style.opacity = 1;
        }
      }, 500);
    }, 7000);
    return () => clearInterval(intervalId);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    navigate(`/library?search=${searchInput}`);
    setSearchInput("");
  };

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const { userID } = useUser();

  return (
    <nav className="navbar">
      <Link to="/home">
        <img src="/recipe_realm_white.svg" alt="" className="logo" />
      </Link>
      <div className="search-box">
        <input
          ref={placeholderRef}
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          <img src="/searchIcon.svg" alt="" className="search-icon" />
        </button>
      </div>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/library">Library</Link>
        </li>

        <li>
          <Link to="/contacts">Contact</Link>
        </li>
        <li>
          <Link
            onClick={() => {
              window.location.href = "/user/" + userID;
            }}
          >
            User
          </Link>
        </li>
        <li>
          <Link className="notoverflow" to="/upload-recipe">
            Upload Recipe
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
