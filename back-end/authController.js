import { compare, hash as _hash } from "bcrypt";
import { pool } from "./database.js";
import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET =
  "3vTr5s$P1O9#qn7Z*xu2mY@HcFgD4b" || "default_access_secret";
const REFRESH_TOKEN_SECRET =
  "8KjF&4lN!s7a#9W@Gp5cQoT2iU1h$r" || "default_refresh_secret";

export async function login(req, res) {
  const { email, password } = req.body;
  const query = "SELECT * FROM Users WHERE Email = ?";
  try {
    const [results] = await pool.query(query, [email]);
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = results[0];
    const result = await compare(password, user.Password);
    if (result) {
      const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
      });
      const refreshToken = jwt.sign({ email: email }, REFRESH_TOKEN_SECRET, {
        expiresIn: "24h",
      });
      res.cookie("accessToken", accessToken, { maxAge: 60000 });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 86400000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.json({
        Login: true,
        UserID: user.UserID,
        message: "Login successful",
      });
    } else {
      return res.json({ Login: false, message: "Password incorrect" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function signup(req, res) {
  const { name, email, password } = req.body;
  try {
    const hash = await _hash(password, 10);
    const query = "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)";
    await pool.query(query, [name, email, hash]);
    return res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export function logout(req, res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  // Clear the refreshToken cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res.json({ Logout: true, message: "Successfully logged out" });
}

export function verifyUser1(req, res) {
  return res.json({ valid: true, message: "testauhorizednew" });
}
