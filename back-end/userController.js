import { pool } from "./database.js";

export async function getProfileByID(req, res) {
  const userId = req.params.userid;
  const query =
    "SELECT u.Name, u.Email, u.Image, u.Description, f.FolloweeID AS FollowedUserID " +
    "FROM Users u " +
    "LEFT JOIN Followings f ON u.UserID = f.FollowerID " +
    "WHERE u.UserID = ?";
  try {
    const [results] = await pool.query(query, [userId]);
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Constructing the user object with followings IDs
    const user = {
      Name: results[0].Name,
      Email: results[0].Email,
      Image: results[0].Image,
      Description: results[0].Description,
      followings: results
        .map((row) => row.FollowedUserID)
        .filter((id) => id !== null),
    };
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFollowings(req, res) {
  const profileList = req.params.profileList.split(",");
  const query =
    "SELECT UserID, Name, Email, Image, Description FROM Users WHERE UserID IN (?)";
  try {
    const [results] = await pool.query(query, [profileList]);
    return res.json(results);
  } catch (error) {
    console.error("Error fetching followings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function followProfile(req, res) {
  const { userID, profileID } = req.params;
  const query = "INSERT INTO followings (FollowerID, FolloweeID) VALUES (?, ?)";
  try {
    await pool.query(query, [userID, profileID]);
    return res.json({ message: "Profile followed successfully" });
  } catch (error) {
    console.error("Error following profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function unfollowProfile(req, res) {
  const { userID, profileID } = req.params;
  const query =
    "DELETE FROM followings WHERE FollowerID = ? AND FolloweeID = ?";
  try {
    await pool.query(query, [userID, profileID]);
    return res.json({ message: "Profile unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAvatar(req, res) {
  const { userID } = req.params;
  const { downloadURL } = req.body;
  const query = "UPDATE Users SET Image = ? WHERE UserID = ?";
  try {
    await pool.query(query, [downloadURL, userID]);
    return res.json({ message: "Avatar updated successfully" });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateDescription(req, res) {
  const { userID, description } = req.body;
  const query = "UPDATE users SET Description = ? WHERE UserID = ?";
  try {
    const [result] = await pool.query(query, [description, userID]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "Description updated successfully" });
  } catch (error) {
    console.error("Error updating description:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
