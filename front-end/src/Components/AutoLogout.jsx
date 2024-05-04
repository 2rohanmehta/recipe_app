import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContent";
const AutoLogout = () => {
  const navigate = useNavigate();
  const { setUserID } = useUser();

  useEffect(() => {
    axios
      .post("http://localhost:8080/logout", {}, { withCredentials: true })
      .then((result) => {
        setUserID(null);
        localStorage.removeItem("userID");
      })
      .catch((err) => console.log(err));
  }, [setUserID, navigate]);

  return null;
};

export default AutoLogout;
