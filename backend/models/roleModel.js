const mongoose = require("mongoose");

const roleModel = mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  access: [{ type: String }],
});

const getRoleModel = (connection) => {
  return connection.model("Role", roleModel);
};

module.exports = getRoleModel;
