const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  landTitle: {
    type: String,
    required: true,
    trim: true
  },
  landType: {
    type: String,
    required: true,
    enum: ['Agricultural', 'Residential', 'Commercial', 'Industrial', 'Mixed Use']
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  documents: {
    type: String, // This will store the file path
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
landSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Land = mongoose.model('Land', landSchema);

module.exports = Land; 