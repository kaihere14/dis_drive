import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

export const googleAuthRedirect = (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL;
  const scope = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent&include_granted_scopes=true`;
  res.redirect(authUrl);
};

export const googleAuthCallback = async (req, res) => {
  const authCode = req.query.code;
  try {
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code: authCode,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { access_token } = tokenRes.data;

    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const userInfo = userInfoRes.data;
    const { user } = await createOAuthUser(userInfo);

    const accessTokenJWT = generateAccessToken(user._id.toString());

    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success#accessToken=${accessTokenJWT}`;
    res.redirect(302, redirectUrl);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during Google OAuth callback", error });
  }
};

export const createOAuthUser = async (profile) => {
  try {
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        authProvider: "google",
        profilePicture: profile.picture,
      });
      await user.save();
    }

    return { user };
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
