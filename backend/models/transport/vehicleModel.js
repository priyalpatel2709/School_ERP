const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  regNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  type: { 
    type: String, 
    enum: ['bus', 'van', 'car', 'minibus', 'other'], 
    required: true 
  },
  make: String,
  model: String,
  year: Number,
  capacity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  fuelType: { 
    type: String, 
    enum: ['diesel', 'petrol', 'electric', 'hybrid', 'cng'] 
  },
  fuelEfficiency: Number, // km per liter or equivalent
  status: { 
    type: String, 
    enum: ['active', 'maintenance', 'inactive'], 
    default: 'active',
    index: true
  },
  documents: [{
    type: { 
      type: String, 
      required: true, 
      enum: ['insurance', 'registration', 'pollution', 'fitness', 'tax', 'permit', 'other'] 
    },
    number: String,
    issuedDate: Date,
    expiryDate: Date,
    issuedBy: String,
    documentUrl: String,
    notes: String
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    coverageType: String,
    startDate: Date,
    expiryDate: Date,
    premium: Number
  },
  registration: {
    number: String,
    issuedDate: Date,
    expiryDate: Date,
    issuedBy: String
  },
  purchaseInfo: {
    date: Date,
    price: Number,
    dealer: String,
    warrantyEnd: Date
  },
  specifications: {
    engineNumber: String,
    chassisNumber: String,
    color: String,
    fuelTankCapacity: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  features: [String],
  gpsDevice: {
    installed: { type: Boolean, default: false },
    deviceId: String,
    model: String,
    installationDate: Date
  },
  currentOdometer: { type: Number, default: 0 },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportRoute',
    index: true
  },
  assignedDrivers: [{
    driverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'TransportDriver' 
    },
    primary: { type: Boolean, default: false },
    assignmentDate: { type: Date, default: Date.now }
  }],
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SchoolDetail',
    required: true,
    index: true
  },
  metaData: [{
    key: { type: String },
    value: mongoose.Schema.Types.Mixed
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true } 
});

// Indexing for common queries
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ status: 1, schoolId: 1 });
vehicleSchema.index({ 'documents.expiryDate': 1 }, { sparse: true });
vehicleSchema.index({ 'insurance.expiryDate': 1 }, { sparse: true });

// Method to check if documents are expiring soon
vehicleSchema.methods.getExpiringDocuments = function(daysThreshold = 30) {
  const today = new Date();
  const threshold = new Date();
  threshold.setDate(today.getDate() + daysThreshold);
  
  return this.documents.filter(doc => {
    return doc.expiryDate && doc.expiryDate <= threshold && doc.expiryDate >= today;
  });
};

// Method to check vehicle availability
vehicleSchema.methods.isAvailable = function() {
  return this.status === 'active';
};

const TransportVehicle = mongoose.model('TransportVehicle', vehicleSchema);

module.exports = TransportVehicle; 