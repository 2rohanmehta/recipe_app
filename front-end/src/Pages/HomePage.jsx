import React from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoute";
import { useUser } from "../contexts/UserContent";
import "tailwindcss/tailwind.css";
import "../Styles/HomePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

function HomePage() {
  const { userID } = useUser();
  ProtectedRoute();
  const Navigate = useNavigate();

  const [randomRecipeID, setRandomRecipeID] = useState("");

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // ===== get a random recipe id from the server ====
  useEffect(() => {
    if (!randomRecipeID) fetchRandomRecipeID();
  }, []);

  const fetchRandomRecipeID = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + "/api/get_random_recipe_id"
      );
      setRandomRecipeID(response.data.Recipe_ID);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
    }
  };

  // ============

  const handleLibraryClick = () => {
    Navigate("/library");
  };

  const handleUploadRecipeClick = () => {
    Navigate("/upload-recipe");
  };

  const handleContactClick = () => {
    Navigate("/contacts");
  };

  const handleProfileClick = (userID) => {
    Navigate("/user/" + userID);
  };

  const handleRandomRecipeClick = () => {
    Navigate(`/view-recipe/${randomRecipeID}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this awesome recipe website!",
          text: "Hey, I found this awesome recipe website! Check it out and let's cook something delicious together!",
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className="bg-custom-grey ">
      <Navbar />
      <div className="relative h-screen">
        <div className="relative block w-full h-full">
          <img
            src="/allfoodimg.jpg"
            alt="All Food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black transition duration-300 ease-in-out bg-opacity-50 hover:bg-opacity-55 ">
            <a
              href="/library"
              className="absolute inset-0 flex justify-center heading1 z-0"
            >
              <h1 className="text-white text-2xl md:text-4xl lg:text-7xl font-bold">
                Savor Home <div className="text-custom-red inline">Flavors</div>
              </h1>
            </a>
            <a
              href="/library"
              className="absolute inset-0 flex justify-center heading2 z-0"
            >
              <h3 className="text-custom-grey text-sm md:text-md lg:text-lg italic">
                {" "}
                Elevate Your Cooking Experience with RecipeRealm!
              </h3>
            </a>
          </div>
        </div>

        <div className=" centered-grid absolute flex justify-center items-center z-1000">
          <div className=" grid grid-cols-3 place-items-center lg:gap-y-[1.5rem] lg:gap-x-[3rem] max-w-xl 2xl:gap-y-[1.5rem] 2xl:gap-x-[15rem] 4xl:gap-y-[1.5rem] 4xl:gap-x-[15rem]">
            <div className="gridbox bg-custom-darkgreen lg:rounded-[2rem] 2xl:rounded-[3rem] transition duration-500 ease-in-out hover:scale-110 hover:bg-custom-green ">
              <button
                onClick={() => handleLibraryClick()}
                className="  rounded-lg box-border font-roboto text-lg font-bold italic flex flex-col justify-content items-center"
              >
                <div className="insidebox justify-center flex flex-col items-center">
                  <img
                    className="imagebox"
                    src="/cookbook.png"
                    alt="Cookbook"
                  />
                  <div className=" bg-opacity-50">Browse Library</div>
                </div>
              </button>
            </div>

            <div className="gridbox bg-custom-darkgreen rounded-[2rem] 2xl:rounded-[3rem] transition duration-500 ease-in-out hover:scale-110 hover:bg-custom-green ">
              <button
                onClick={() => handleUploadRecipeClick()}
                className=" rounded-lg box-border font-roboto text-lg font-bold italic flex  justify-content items-center"
              >
                <div className="insidebox justify-center flex flex-col items-center">
                  <img
                    className="imagebox"
                    src={"/whisk-square.png"}
                    alt="Whisk"
                  />
                  <div className=" bg-opacity-50">Upload Recipe</div>
                </div>
              </button>
            </div>

            <div className="gridbox bg-custom-darkgreen rounded-[2rem] 2xl:rounded-[3rem] transition duration-500 ease-in-out hover:scale-110 hover:bg-custom-green">
              <button
                onClick={() => handleContactClick()}
                className="rounded-lg box-border font-roboto text-lg font-bold italic flex justify-content items-center"
              >
                <div className="insidebox  justify-center flex flex-col items-center">
                  <img
                    className="imagebox"
                    src={"/mail-square.png"}
                    alt="Contact"
                  />
                  <div className=" bg-opacity-50">Contact Us</div>
                </div>
              </button>
            </div>

            <div className="gridbox bg-custom-darkgreen rounded-[2rem] 2xl:rounded-[3rem] transition duration-500 ease-in-out hover:scale-110 hover:bg-custom-green">
              <button
                onClick={() => handleProfileClick(userID)}
                className="rounded-lg  box-border font-roboto text-lg font-bold italic flex  justify-content items-center"
              >
                <div className="insidebox justify-center flex flex-col items-center">
                  <img
                    className="imagebox"
                    src={"/chefhat.png"}
                    alt="Chef Hat"
                  />
                  <div className="bg-opacity-50">Chef's Profile</div>
                </div>
              </button>
            </div>

            <div className="gridbox bg-custom-darkgreen rounded-[2rem] 2xl:rounded-[3rem]  transition duration-500 ease-in-out hover:scale-110 hover:bg-custom-green">
              <button
                onClick={() => handleRandomRecipeClick()}
                className="rounded-lg box-border font-roboto text-lg font-bold italic flex  justify-content items-center "
              >
                <div className="insidebox justify-center flex flex-col items-center">
                  <img
                    className="imagebox"
                    src={"/blender-newest.png"}
                    alt="Blender"
                  />
                  <div className=" bg-opacity-50">Random Recipe</div>
                </div>
              </button>
            </div>
            <div className="gridbox bg-custom-darkgreen rounded-[2rem] 2xl:rounded-[3rem] transition duration-500 ease-in-out hover:scale-110 hover:bg-custom-green">
              <button
                onClick={handleShare}
                className=" rounded-lg  box-border font-roboto text-lg font-bold italic flex justify-content items-center"
              >
                <div className="insidebox justify-center flex flex-col items-center">
                  <img className="imagebox" src={"/chef.png"} alt="Share" />
                  <div className="bg-opacity-50">Share with Friend</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
