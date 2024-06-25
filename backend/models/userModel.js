const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    loginID: { type: String, unique: true },
    password: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    deviceToken: { type: String, default: "" },
    schoolID: { type: String, required: false },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true } // Corrected spelling
);

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Ensure next() is called after hashing
});

userModel.methods.matchDeviceToken = async function (deviceToken) {
  if (deviceToken === this.deviceToken) {
    return true;
  } else {
    this.deviceToken = deviceToken;
    await this.save();
    return false;
  }
};

userModel.methods.assignRole = async function (roleId) {
  try {
    this.role = roleId;
    await this.save();
    return true;
  } catch (error) {
    console.error("Error assigning role:", error.message);
    return false;
  }
};

const getUserModel = (connection) => {
  return connection.model("User", userModel);
};

module.exports = getUserModel;
