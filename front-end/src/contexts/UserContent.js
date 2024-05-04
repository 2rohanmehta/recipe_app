import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserContent = ({ children }) => {
  const [userID, setUserID] = useState(() => {
    const savedUserID = localStorage.getItem("userID");
    return savedUserID ? JSON.parse(savedUserID) : null;
  });

  useEffect(() => {
    localStorage.setItem("userID", JSON.stringify(userID));
  }, [userID]);

  return (
    <UserContext.Provider value={{ userID, setUserID }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContent;
