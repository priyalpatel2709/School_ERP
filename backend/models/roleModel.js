const mongoose = require("mongoose");

const roleModel = mongoose.Schema({
  schoolID: { type: "String", unique: true, required: true },
  role: { roleNmae: { type: "String" }, access: [{ type: "String" }] },
  isActive: { type: "bool", required: true },
});

const Role = mongoose.model("Role", roleModel);
module.exports = Role;
