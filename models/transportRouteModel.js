const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pickupTime: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const transportRouteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    academicYear: { type: String, required: true },
    stops: [stopSchema],
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportVehicle",
    },
    isActive: { type: Boolean, default: true },
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

const getTransportRouteModel = (connection) =>
  connection.model("TransportRoute", transportRouteSchema);

module.exports = getTransportRouteModel;
