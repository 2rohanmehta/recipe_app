import { pool } from "./database.js";

export async function uploadRecipe(req, res) {
  const {
    title,
    cover_image,
    content_list,
    tagName_lists,
    ingredient_lists,
    author_id,
  } = req.body;

  console.log(tagName_lists);

  // Insert recipe details into Recipes table
  const insertRecipeQuery =
    "INSERT INTO Recipes (Title, Cover_Image, Author_ID) VALUES (?, ?, ?)";
  try {
    const [insertRecipeResult] = await pool.query(insertRecipeQuery, [
      title,
      cover_image,
      author_id,
    ]);

    // Retrieve the auto-generated Recipe_ID
    const recipeId = insertRecipeResult.insertId;

    // Insert tags into recipetags table
    // Insert tags into recipetags table
    const insertTagQueries = tagName_lists.map((tagName, index) => {
      return "INSERT INTO recipetags (Recipe_ID, Tag) VALUES (?, ?)";
    });
    await Promise.all(
      insertTagQueries.map(async (query, index) => {
        const tagName = tagName_lists[index]; // Access tagName from the array
        await pool.query(query, [recipeId, tagName]);
      })
    );

    // Insert content into recipecontent table
    const insertContentQueries = content_list.map((content) => {
      const { title, text, image } = content; // Destructure
      return "INSERT INTO recipecontent (Recipe_ID, title, text, image) VALUES (?, ?, ?, ?)";
    });

    await Promise.all(
      insertContentQueries.map(async (query, index) => {
        const { title, text, image } = content_list[index]; // Access the content object using the index
        await pool.query(query, [recipeId, title, text, image]); // Use the destructured variables here
      })
    );

    // Insert ingredients into recipeingredients table
    const insertIngredientQueries = ingredient_lists.map((ingredient) => {
      const { name, quantity } = ingredient; // Destructure name and quantity from the ingredient object
      return "INSERT INTO recipeingredients (Recipe_ID, Ingredient, Quantity) VALUES (?, ?, ?)";
    });

    await Promise.all(
      insertIngredientQueries.map(async (query, index) => {
        const { name, quantity } = ingredient_lists[index]; // Access the ingredient object using the index
        await pool.query(query, [recipeId, name, quantity]); // Use the destructured name and quantity variables here
      })
    );

    return res.json({ message: "Recipe uploaded successfully" });
  } catch (error) {
    console.error("Error uploading recipe:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllRecipes(req, res) {
  console.log("Attempting to fetch all recipes...");

  try {
    // Fetch all recipes
    const recipesQuery = "SELECT * FROM Recipes";
    const [recipesRows] = await pool.query(recipesQuery);

    // Fetch tags for each recipe
    const tagsQuery = "SELECT Recipe_ID, Tag FROM recipetags";
    const [tagsRows] = await pool.query(tagsQuery);

    // Fetch ingredients for each recipe
    const ingredientsQuery =
      "SELECT Recipe_ID, Ingredient, Quantity FROM recipeingredients";
    const [ingredientsRows] = await pool.query(ingredientsQuery);

    // Fetch content for each recipe
    const contentQuery =
      "SELECT recipe_id, title, text, image FROM recipecontent";
    const [contentRows] = await pool.query(contentQuery);

    // Structure the data in the desired format
    const recipes = recipesRows.map((recipe) => {
      const recipeTags = tagsRows
        .filter((tag) => tag.Recipe_ID === recipe.Recipe_ID)
        .map((tag) => tag.Tag);

      const recipeIngredients = ingredientsRows
        .filter((ingredient) => ingredient.Recipe_ID === recipe.Recipe_ID)
        .map((ingredient) => ({
          name: ingredient.Ingredient,
          quantity: ingredient.Quantity,
        }));

      const recipeContent = contentRows
        .filter((content) => content.recipe_id === recipe.Recipe_ID)
        .map((content) => ({
          title: content.title,
          text: content.text,
          image: content.image,
        }));

      return {
        recipe_id: recipe.Recipe_ID,
        title: recipe.Title,
        cover_image: recipe.Cover_Image,
        author_id: recipe.Author_ID,
        tags: recipeTags,
        ingredients: recipeIngredients,
        content: recipeContent,
      };
    });

    console.log("Successfully fetched all recipes.");
    return res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRecipesbyUserID(req, res) {
  const userId = req.params.user_id;
  const query = "SELECT * FROM Recipes WHERE Author_ID = ?";

  try {
    // Fetch recipes by user ID
    const [recipesRows] = await pool.query(query, [userId]);

    // Fetch tags for each recipe
    const tagsQuery = "SELECT Recipe_ID, Tag FROM recipetags";
    const [tagsRows] = await pool.query(tagsQuery);

    // Fetch ingredients for each recipe
    const ingredientsQuery =
      "SELECT Recipe_ID, Ingredient, Quantity FROM recipeingredients";
    const [ingredientsRows] = await pool.query(ingredientsQuery);

    // Fetch content for each recipe
    const contentQuery =
      "SELECT recipe_id, title, text, image FROM recipecontent";
    const [contentRows] = await pool.query(contentQuery);

    // Structure the data in the desired format
    const recipes = recipesRows.map((recipe) => {
      const recipeTags = tagsRows
        .filter((tag) => tag.Recipe_ID === recipe.Recipe_ID)
        .map((tag) => tag.Tag);

      const recipeIngredients = ingredientsRows
        .filter((ingredient) => ingredient.Recipe_ID === recipe.Recipe_ID)
        .map((ingredient) => ({
          name: ingredient.Ingredient,
          quantity: ingredient.Quantity,
        }));

      const recipeContent = contentRows
        .filter((content) => content.recipe_id === recipe.Recipe_ID)
        .map((content) => ({
          title: content.title,
          text: content.text,
          image: content.image,
        }));

      return {
        recipe_id: recipe.Recipe_ID,
        title: recipe.Title,
        cover_image: recipe.Cover_Image,
        author_id: recipe.Author_ID,
        tags: recipeTags,
        ingredients: recipeIngredients,
        content: recipeContent,
      };
    });

    return res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes by user ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRecipeByID(req, res) {
  const recipeId = req.params.id;
  const query = "SELECT * FROM Recipes WHERE Recipe_ID = ?";

  try {
    // Fetch recipe by ID
    const [recipeRows] = await pool.query(query, [recipeId]);

    // If recipe not found, return 404
    if (recipeRows.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Fetch tags for the recipe
    const tagsQuery = "SELECT Tag FROM recipetags WHERE Recipe_ID = ?";
    const [tagsRows] = await pool.query(tagsQuery, [recipeId]);

    // Fetch ingredients for the recipe
    const ingredientsQuery =
      "SELECT Ingredient, Quantity FROM recipeingredients WHERE Recipe_ID = ?";
    const [ingredientsRows] = await pool.query(ingredientsQuery, [recipeId]);

    // Fetch content for the recipe
    const contentQuery =
      "SELECT title, text, image FROM recipecontent WHERE recipe_id = ?";
    const [contentRows] = await pool.query(contentQuery, [recipeId]);

    // Structure the data in the desired format
    const recipe = {
      recipe_id: recipeRows[0].Recipe_ID,
      title: recipeRows[0].Title,
      cover_image: recipeRows[0].Cover_Image,
      author_id: recipeRows[0].Author_ID,
      tags: tagsRows.map((tag) => tag.Tag),
      ingredients: ingredientsRows.map((ingredient) => ({
        name: ingredient.Ingredient,
        quantity: ingredient.Quantity,
      })),
      content: contentRows.map((content) => ({
        title: content.title,
        text: content.text,
        image: content.image,
      })),
    };

    return res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRandomRecipeID(req, res) {
  const query = "SELECT Recipe_ID FROM Recipes ORDER BY RAND() LIMIT 1";
  try {
    const [rows, fields] = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching random recipe ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteRecipe(req, res) {
  const recipeId = req.params.id;
  const query = "DELETE FROM Recipes WHERE Recipe_ID = ?";
  try {
    const [result] = await pool.query(query, [recipeId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
