import React from "react";

import "../Styles/viewRecipe.css";
import Navbar from "../Components/Navbar";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContent";
import { useNavigate } from "react-router-dom";

const ViewRecipe = () => {
  let navigate = useNavigate();
  // const recipe = fakeData;
  let { recipe_id } = useParams();
  const BACKEND_URL = "http://localhost:8080";

  const [recipe, setRecipe] = useState({
    title: "",
    cover_image: "",
    content: [],
    tags: [],
    ingredients: [],
    author_id: null,
  });

  const [author, setAuthor] = useState({
    name: "",
    email: "",
    password: "",
    Image: "",
    description: "",
  });
  const [isAuthor, setIsAuthor] = useState(false);
  const handleDeleteRecipe = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/recipe/${recipe_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/library");
      } else {
        console.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  const { userID } = useUser();
  useEffect(() => {
    const fetchRecipeAndAuthor = async () => {
      try {
        const recipeResponse = await fetch(
          `${BACKEND_URL}/api/recipe/${recipe_id}`
        );
        if (!recipeResponse.ok) throw new Error("Failed to fetch recipe");
        const recipeData = await recipeResponse.json();
        setRecipe(recipeData);
        if (recipeData.author_id) {
          const authorResponse = await fetch(
            `${BACKEND_URL}/api/${recipeData.author_id}`
          );
          if (!authorResponse.ok) throw new Error("Failed to fetch author");
          const authorData = await authorResponse.json();

          setAuthor(authorData);

          console.log(userID);
          if (userID === recipeData.author_id) {
            setIsAuthor(true);
          } else {
            setIsAuthor(false);
          }
        }
      } catch (error) {
        console.error("Error during recipe or author fetch:", error);
      }
    };

    fetchRecipeAndAuthor();

    return () => {
      setAuthor({
        name: "",
        email: "",
        Image: "",
        description: "",
      });
    };
  }, [recipe_id, BACKEND_URL]);
  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="view-recipe-container flex items-center justify-center">
        <div className="pt-10 pb-10 rounded-[100rem]">
          <div className="view-recipe">
            <h1>{recipe.title}</h1>
            {recipe.cover_image && recipe.cover_image !== "null" && (
              <div className="cover_imageContainer">
                <img
                  src={recipe.cover_image}
                  alt="Cover"
                  className="cover_image"
                />
              </div>
            )}

            <br />

            <h3>Tags</h3>
            <ul id="tags">
              {recipe.tags &&
                recipe.tags.map((tag, index) => (
                  <li key={index}>
                    <div>{tag}</div>
                  </li>
                ))}
            </ul>
            <br />

            <h2>Ingredients</h2>
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />

            <h2>Steps</h2>
            <ul>
              {recipe.content.map((step, index) => (
                <li key={index}>
                  <div className="step-container">
                    <h3>
                      {index + 1}. {step.title}
                    </h3>
                    {step.text && step.text !== "undefined" && (
                      <p>{step.text}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="author-card flex-col items-center justify-center">
          <div className="author-image-container">
            <Link to={`/user/${recipe.author_id}`}>
              <img src={author.Image} alt="Author" />
            </Link>
          </div>
          <div className="author-info">
            <Link to={`/user/${recipe.author_id}`}>
              <h3 className="author-name">{author.Name}</h3>
            </Link>
            <p className="author-descrip">
              {(author.Description != null && author.Description.length) > 250
                ? `${author.Description.substring(0, 250)}...`
                : author.Description}
            </p>
          </div>
          {isAuthor && (
            <div className="delete-recipe-container">
              <h3>This is your recipe, don't like it? Delete it!</h3>
              <button onClick={handleDeleteRecipe}>Delete Recipe</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewRecipe;
