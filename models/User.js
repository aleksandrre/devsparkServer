import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
});

const User = mongoose.model("User", UserSchema);
export default User;
