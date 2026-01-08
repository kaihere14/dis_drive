import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authProvider: { type: String, required: true },
  profilePicture: { type: String },
});

const User = model("User", userSchema);
export default User;
