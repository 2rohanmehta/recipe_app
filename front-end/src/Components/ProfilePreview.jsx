import React from "react";
import blankAvatarImage from "../assets/blankProfile.webp";

const ProfilePreview = ({ user }) => {
  const avatar = user.Image ? user.Image : blankAvatarImage;
  const onClickHandler = () => {
    window.location.href = `/user/${user.UserID}`;
  };
  const description = user.Description
    ? user.Description
    : "No Description Available";
  return (
    <div
      className="flex flex-col p-3  rounded-lg  bg-transparent bg-opacity-80 w-32 border border-b  m-3 shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 text-gray-100 bg-gray-600"
      onClick={onClickHandler}
    >
      <img
        src={avatar}
        alt=""
        className="flex-shrink-0 object-cover bg-gray-500 rounded-lg w-64"
      />
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{user.Name}</h2>
        <p className="block pb-2 text-sm text-gray-400 overflow-hidden h-12">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProfilePreview;
