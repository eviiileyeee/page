const Land = require('../models/Land');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Register new land
const registerLand = catchAsync(async (req, res, next) => {
  try {
    console.log('Starting land registration process');
    console.log('Request body:', req.body);
    console.log('Files received:', req.files || req.file);

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return next(new AppError(errors.array()[0].msg, 400));
    }

    // Check if user is authenticated
    if (!req.user) {
      console.error('Authentication failed: No user in request');
      return next(new AppError('Authentication required', 401));
    }
    console.log('User authenticated:', req.user._id);

    const {
      landTitle,
      landType,
      area,
      location,
      description,
      price,
      claimType,
      existingRecordId
    } = req.body;

    // Log received data
    console.log('Received land data:', {
      landTitle,
      landType,
      area,
      location,
      description,
      price,
      claimType,
      existingRecordId
    });

    // Handle file upload
    let documents = [];
    if (req.files && req.files.length > 0) {
      console.log('Processing multiple files:', req.files.length);
      documents = req.files.map(file => {
        console.log('Processing file:', file.originalname);
        return file.path.replace(/\\/g, '/');
      });
    } else if (req.file) {
      console.log('Processing single file:', req.file.originalname);
      documents = [req.file.path.replace(/\\/g, '/')];
    }

    if (documents.length === 0) {
      console.error('No documents provided');
      return next(new AppError('At least one document is required', 400));
    }
    console.log('Processed documents:', documents);

    // Create new land entry
    console.log('Creating new land entry');
    const land = new Land({
      landTitle,
      landType,
      area: Number(area),
      location,
      description,
      price: Number(price),
      documents,
      owner: req.user._id,
      claimType,
      existingRecordId,
      status: 'pending'
    });

    // Validate the land object before saving
    const validationError = land.validateSync();
    if (validationError) {
      console.error('Mongoose validation error:', validationError);
      return next(new AppError(validationError.message, 400));
    }

    // Save land
    console.log('Attempting to save land entry');
    await land.save();
    console.log('Land entry saved successfully');

    res.status(201).json({
      success: true,
      message: 'Land registered successfully',
      data: land
    });

  } catch (error) {
    console.error('Land registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return next(new AppError(error.message || 'Error registering land', 500));
  }
});

// Get all lands for the authenticated user
const getLands = catchAsync(async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const { landType, status } = req.query;
    const query = { owner: req.user._id }; // Only fetch lands owned by the authenticated user

    // Apply additional filters if provided
    if (landType) query.landType = landType;
    if (status) query.status = status;

    const lands = await Land.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lands.length,
      data: lands
    });

  } catch (error) {
    console.error('Get lands error:', error);
    return next(new AppError(error.message || 'Error fetching lands', 500));
  }
});

// Get single land by ID (only if owned by the authenticated user)
const getLandById = catchAsync(async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const land = await Land.findOne({
      _id: req.params.id,
      owner: req.user._id // Only allow access to lands owned by the authenticated user
    }).populate('owner', 'name email');

    if (!land) {
      return next(new AppError('Land not found or access denied', 404));
    }

    res.status(200).json({
      success: true,
      data: land
    });

  } catch (error) {
    console.error('Get land error:', error);
    return next(new AppError(error.message || 'Error fetching land', 500));
  }
});

module.exports = {
  registerLand,
  getLands,
  getLandById
}; 