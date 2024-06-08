const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    loginID: { type: "String", unique: true },
    password: { type: "String" },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    deviceToken: { type: "String", default: "" },
  },
  { timestaps: true }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userModel.methods.matchdeviceToken = async function (deviceToken) {
  if (deviceToken === this.deviceToken) {
    return true;
  } else {
    this.deviceToken = deviceToken;
    await this.save();
    return false;
  }
};

const getUserModel = (connection) => {
  return connection.model("User", userModel);
};

// const User = mongoose.model("User", userModel);

module.exports = getUserModel;
