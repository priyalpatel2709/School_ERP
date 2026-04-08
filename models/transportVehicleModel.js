const mongoose = require("mongoose");

const transportVehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, unique: true },
    makeModel: { type: String },
    capacity: { type: Number, required: true, min: 1 },
    driverName: { type: String },
    driverPhone: { type: String },
    gpsDeviceId: { type: String },
    isActive: { type: Boolean, default: true },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportRoute",
    },
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

const getTransportVehicleModel = (connection) =>
  connection.model("TransportVehicle", transportVehicleSchema);

module.exports = getTransportVehicleModel;
