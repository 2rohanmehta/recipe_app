import React from "react";
import coverImage from "../assets/contactBackground.png";
import blankAvatarImage from "../assets/blankProfile.webp";
import "../Styles/UserPage.css";
import LogoutButton from "../Components/LogoutButton.jsx";
import ProtectedRoute from "../Components/ProtectedRoute.jsx";
import Navbar from "../Components/Navbar.jsx";
import ProfilePicture from "../Components/ProfilePicture.js";
import { useUser } from "../contexts/UserContent.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfilePreview from "../Components/ProfilePreview.jsx";
import RecipePreviewBox_userPage from "../Components/RecipePreviewBox_userPage.jsx";
import EditableInput from "../Components/EditableInput.jsx";
import UserDescriptionBox from "../Components/userdescriptionbox.jsx";

const BACKEND_URL = "http://localhost:8080";

export default function Profile() {
  ProtectedRoute();

  const [followed, setFollowed] = React.useState(false);
  const { userID } = useUser();
  const { profile_id } = useParams();

  //console.log(profile_id);

  const [userDetails, setUserDetails] = React.useState(null);
  const [viewerProfile, setViewerProfile] = React.useState(null);
  const [recipes, setRecipes] = React.useState([]);
  const [followingProfiles, setFollowingProfiles] = React.useState([]);
  const [profilePicture, setProfilePicture] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    fetchProfile();
    fetchRecipesByProfileID();
    fetchViewerProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      //console.log(profile_id);
      const response = await axios.get(BACKEND_URL + "/api/" + profile_id);
      //console.log(profile_id);
      setUserDetails(response.data);
      //console.log(userDetails);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchViewerProfile = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/api/" + userID);
      //console.log(response.data);
      setViewerProfile(response.data);
      //console.log(viewerProfile);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchRecipesByProfileID = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + "/api/recipe/all_recipes/" + profile_id
      );

      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  React.useEffect(() => {
    if (userDetails) {
      fetchFollowingsByProfileID();
    }
  }, [userDetails]);
  //console.log(viewerProfile);
  React.useEffect(() => {
    if (userID !== parseInt(profile_id) && userDetails && viewerProfile) {
      setFollowed(viewerProfile.followings.includes(parseInt(profile_id)));
    }
  }, [viewerProfile, userDetails]);

  //console.log(followed);

  const fetchFollowingsByProfileID = async () => {
    if (userDetails.followings.length === 0) return;
    try {
      const response = await axios.get(
        BACKEND_URL + "/api/followings/" + userDetails.followings.join(",")
      );
      //console.log(response.data);
      setFollowingProfiles(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const user = {
    name: "Username",
    description: "",
    Image: blankAvatarImage,
    followings: [],
    recipes: [],
    followings: [],
  };
  if (userDetails) {
    user.name = userDetails.Name;
    user.description = userDetails.Description;
    user.Image = userDetails.Image ? userDetails.Image : blankAvatarImage;
  }
  if (recipes) {
    user.recipes = recipes;
  }
  if (followingProfiles) {
    user.followings = followingProfiles;
    //console.log(user.followings);
  }
  if (profilePicture !== user.Image) {
    setProfilePicture(user.Image);
  }

  const followButtonHandler = () => {
    if (followed) {
      unfollowUser();
    } else {
      followUser();
    }
  };
  const followUser = async () => {
    try {
      const response = await axios.post(
        BACKEND_URL + "/api/followProfile/" + userID + "/" + profile_id
      );
      setFollowed(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  const unfollowUser = async () => {
    try {
      console.warn(
        BACKEND_URL + "/api/unfollowProfile/" + userID + "/" + profile_id
      );
      const response = await axios.post(
        BACKEND_URL + "/api/unfollowProfile/" + userID + "/" + profile_id
      );
      setFollowed(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  //console.log(profile_id);
  /*console.log(userID);

  console.log(user.name);
  console.log(user.description);
  console.log(user.Image);
  console.log(user.profile_id);
  console.log(userID);
  */

  const followOrSignoutButton = () => {
    if (parseInt(profile_id) === userID) {
      //console.log(typeof userID);
      //console.log(typeof profile_id);
      //console.log("working");
      return (
        <div className="flex justify-center pt-1 pb-8">
          <LogoutButton />
        </div>
      );
    } else {
      return (
        <div className="flex justify-center pt-1 pb-8">
          <button
            onClick={followButtonHandler}
            className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            {followed ? "Unfollow" : "Follow"}
          </button>
        </div>
      );
    }
  };

  const followingComponents = followingProfiles?.map((user, index) => {
    //console.log(user._id);
    return <ProfilePreview key={index} user={user} />;
  });

  const recipePreviewBoxes = recipes?.map((recipe, index) => (
    <RecipePreviewBox_userPage
      key={index}
      image={recipe.cover_image}
      title={recipe.title}
      id={recipe.recipe_id}
    />
  ));

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <section className="profile-section">
          <div
            className="profile-background"
            style={{ backgroundImage: `url(${coverImage})` }}
          >
            <span className="black-overlay"></span>
          </div>
          <div className="bottom-shape">
            <svg
              className="svg-shape"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="polygon-shape"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="profile-segment">
          <div className="container">
            <div className="profile-card">
              <div className="profile-top">
                <div className="profile-topCenter">
                  <div className="profile-stat">
                    <div className="stat">
                      <div className="stat-number">
                        <span className="value">{user.recipes.length}</span>
                        <span className="placeholder">Recipes</span>
                      </div>
                    </div>
                  </div>
                  <div className="image-container pb-3">
                    <div className="relative">
                      <ProfilePicture
                        photo={profilePicture}
                        profileID={parseInt(profile_id)}
                      />
                    </div>
                  </div>
                  <div className="profile-stat">
                    <div className="stat">
                      <div className="stat-number">
                        <span className="value">{user.followings.length}</span>
                        <span className="placeholder">Followings</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="profile-name mt-[-10px]">{user.name}</h3>
                  {followOrSignoutButton()}
                  {user.description === null &&
                  parseInt(profile_id) === userID ? (
                    <span className="relative">
                      <EditableInput
                        value={user.description}
                        onSave={(newDescription) => {}}
                      />
                    </span>
                  ) : (
                    <UserDescriptionBox value={user.description} />
                  )}
                </div>

                <div className="bg-gray-200 h-[1px] mx-12 mt-10"></div>
                <div className="text-xl h-10 pt-10 pl-10">
                  <h2>User's recipes</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 3xl:grid-cols-5 mx-10 p-10 overflow-y-scroll">
                  {recipePreviewBoxes}
                </div>
                <h3 className="text-xl h-10 pl-10">Followings</h3>
                <div className="flex overflow-x-scroll space-x-24 mx-10 mb-5 border rounded-md">
                  {followingComponents}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}
