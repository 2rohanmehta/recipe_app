import React, { useRef, useState } from "react";
import "../Styles/Upload.css";
import Step from "../Components/RecipeStep";
import StepsList from "../Components/StepsList";
import Ingredient from "../Components/Ingredient";
import IngredientTable from "../Components/IngredientTable";
import Navbar from "../Components/Navbar";
import ProtectedRoute from "../Components/ProtectedRoute";
import { useUser } from "../contexts/UserContent";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

export default function UploadPage() {
  ProtectedRoute();
  const { userID } = useUser();
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const [ingredients, setIngredients] = useState([]);
  const handleAddIngredient = (ingredient) => {
    setIngredients((prev) => [...prev, ingredient]);
  };
  const handleDeleteIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const [recipeTitle, setRecipeTitle] = useState("");
  const handleRecipeTitleChange = (event) => {
    setRecipeTitle(event.target.value);
  };

  const [coverImage, setCoverImage] = useState(null);

  const UploadCoverImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const uniqueFileName = `${Date.now()}-${selectedFile.name}`;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(uniqueFileName);

      fileRef.put(selectedFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          setCoverImage(downloadURL);
        });
      });
    } else {
    }
  };

  const [newStep, setNewStep] = useState({});

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewStep((prev) => ({ ...prev, id: Date.now(), [name]: value }));
  };

  const [allSteps, setAllSteps] = useState([]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newStep.title) return;
    setAllSteps((prev) => [...prev, { ...newStep }]);
    setNewStep({});
  };
  const handleDelete = (stepIdToRemove) => {
    setAllSteps((prev) => prev.filter((step) => step.id !== stepIdToRemove));
  };

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const handleAddTag = () => {
    if (tag.trim() !== "") {
      setTags((prev) => [...prev, tag.trim()]);
      setTag("");
    }
  };
  const handleDeleteTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (recipeTitle.trim() === "") {
      alert("Please enter a title for the recipe.");
      return;
    }

    const formData = new FormData();
    formData.append("recipeTitle", recipeTitle);
    formData.append("coverImage", coverImage);

    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}].name`, ingredient.name);
      formData.append(`ingredients[${index}].quantity`, ingredient.quantity);
    });

    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    allSteps.forEach((step, index) => {
      formData.append(`allSteps[${index}].title`, step.title);
      formData.append(`allSteps[${index}].text`, step.description);
    });

    const responseJson = {
      title: "",
      cover_image: "",
      content_list: [],
      tagName_lists: [],
      ingredient_lists: [],
      author_id: userID,
    };
    for (let [key, value] of formData.entries()) {
      if (key === "recipeTitle") {
        responseJson.title = value;
      } else if (key === "coverImage") {
        responseJson.cover_image = value;
      } else if (key.includes("allSteps")) {
        const stepIndex = key.match(/\d+/)[0];
        const stepKey = key.split(".")[1];
        if (!responseJson.content_list[stepIndex]) {
          responseJson.content_list[stepIndex] = {};
        }
        responseJson.content_list[stepIndex][stepKey] = value;
      } else if (key.includes("tags")) {
        responseJson.tagName_lists.push(value);
      } else if (key.includes("ingredients")) {
        const ingredientIndex = key.match(/\d+/)[0];
        const ingredientKey = key.split(".")[1];
        if (!responseJson.ingredient_lists[ingredientIndex]) {
          responseJson.ingredient_lists[ingredientIndex] = {};
        }
        responseJson.ingredient_lists[ingredientIndex][ingredientKey] = value;
      }
    }

    axios
      .post("http://localhost:8080/uploadRecipe", responseJson)
      .then((result) => {
        setRecipeTitle("");
        setCoverImage(null);
        setIngredients([]);
        setTags([]);
        setAllSteps([]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Navbar />
      <main className="upload-page">
        <h1>
          <img src="/recipe-upload.png" alt="upIcon" className="icon-special" />
          Share Your Recipe
        </h1>
        <div className="recipe-title-label">
          <img src="/recipe-title.png" alt="titleIcon" className="icon" />
          <label htmlFor="recipeTitle">Recipe Title</label>
        </div>
        <input
          type="text"
          id="recipeTitle"
          placeholder="Enter Recipe Title"
          value={recipeTitle}
          onChange={handleRecipeTitleChange}
          required
        />
        <br></br>
        <div className="newline">
          <img src="/recipe-cover.png" alt="coverIcon" className="icon" />
          <label htmlFor="coverImage">Cover Image:</label>
        </div>
        <button className="button-upload" onClick={handleClick}>
          Upload a file
        </button>
        <input
          type="file"
          onChange={UploadCoverImage}
          ref={hiddenFileInput}
          style={{ display: "none" }} // Make the file input element invisible
        />
        {coverImage && <img src={coverImage} alt="Uploaded" />}

        <Ingredient addIngredient={handleAddIngredient} />
        <IngredientTable
          ingredients={ingredients}
          deleteIngredient={handleDeleteIngredient}
        />

        <h2>
          <img src="/recipe-tags.png" alt="tagIcon" className="icon" />
          Tags
        </h2>
        <div>
          <input
            type="text"
            placeholder="Enter Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value.toLowerCase())}
          />
          <button onClick={handleAddTag}>Add Tag</button>
        </div>

        {tags != null && tags.length > 0 && (
          <div>
            <ul id="tags">
              {tags.map((tag, index) => (
                <li key={index}>
                  <div className="tag-container">
                    {tag}
                    <button
                      className="tag-button"
                      onClick={() => handleDeleteTag(index)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2>
          <img src="/recipe-steps.png" alt="stepIcon" className="icon" />
          Steps
        </h2>
        <Step
          newStep={newStep}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        <StepsList allSteps={allSteps} handleDelete={handleDelete} />

        <form onSubmit={handleFormSubmit} className="submit-form">
          <input type="submit" id="submitButton" />
        </form>
      </main>
    </>
  );
}
