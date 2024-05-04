import express, { json } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const ACCESS_TOKEN_SECRET =
  "3vTr5s$P1O9#qn7Z*xu2mY@HcFgD4b" || "default_access_secret";
const REFRESH_TOKEN_SECRET =
  "8KjF&4lN!s7a#9W@Gp5cQoT2iU1h$r" || "default_refresh_secret";

// Replace the uri string with your MongoDB deployment's connection string.
//require("dotenv").config({ path: "./config.env" });
import {
  getAllRecipes,
  uploadRecipe,
  getRecipesbyUserID,
  getRecipeByID,
  getRandomRecipeID,
  deleteRecipe,
} from "./recipeController.js";
import {
  getProfileByID,
  getFollowings,
  followProfile,
  unfollowProfile,
  updateAvatar,
  updateDescription,
} from "./userController.js";
import { login, logout, signup, verifyUser1 } from "./authController.js";
const PORT = process.env.PORT || 8080;
const app = express();
//turns it to json file
app.use(express.json());
//access backend from front end
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
// ================== Recipe routes ==================
app.get("/api/recipe/all_recipes", getAllRecipes);
app.post("/uploadRecipe", uploadRecipe);
app.get("/api/recipe/all_recipes/:user_id", getRecipesbyUserID);
app.get("/api/recipe/:id", getRecipeByID);
app.get("/api/get_random_recipe_id", getRandomRecipeID);
// Add the DELETE route for deleting a recipe
app.delete("/api/recipe/:id", deleteRecipe);

// ================== User routes ==================
app.get("/api/:userid", getProfileByID);
app.get("/api/followings/:profileList", getFollowings);
app.post("/api/followProfile/:userID/:profileID", followProfile);
app.post("/api/unfollowProfile/:userID/:profileID", unfollowProfile);
app.post("/api/updatePhoto/:userID", updateAvatar);
app.post("/api/updateDescription", updateDescription);

// =============== authentication routes ===========
app.post("/login", login);
app.post("/logout", logout);
app.post("/signup", signup);

const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    if (renewToken(req, res)) {
      next();
    }
  } else {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          valid: false,
          message: `user not authorized ${accessToken}`,
          accessToken: accessToken ? accessToken : null,
        });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

const renewToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  let exist = false;
  if (!refreshToken) {
    return res.json({
      valid: false,
      message: `user not authorized ${refreshToken}`,
      refreshToken: refreshToken ? refreshToken : null,
    });
  } else {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "Invalid Refresh" });
      } else {
        const accessToken = jwt.sign(
          { email: decoded.email },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "1m" }
        );
        res.cookie("accessToken", accessToken, { maxAge: 60000 });
        exist = true;
      }
    });
  }
  return exist;
};

app.get("/verify", verifyUser, verifyUser1);

app.listen(PORT, () => {
  console.log("Server is running... in port", PORT);
});
