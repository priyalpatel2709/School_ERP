const mongoose = require("mongoose");

const roleModel = mongoose.Schema(
  {
    roleName: { type: String, required: true, unique: true },
    access: [{ type: String }],
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

const getRoleModel = (connection) => {
  return connection.model("Role", roleModel);
};

module.exports = getRoleModel;
