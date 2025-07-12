const Livestock = require("../models/LiveStock");

// Add livestock (POST /api/livestock)
exports.addLivestock = async (req, res) => {
  try {
    const { name, type, breed, age, weight } = req.body;
    const livestock = await Livestock.create({
      name,
      type,
      breed,
      age,
      weight,
      userId: req.user._id
    });
    res.status(201).json({
        success: true,
        message: 'Livestock added successfully',
        livestock,
    });
  } catch (err) {
    console.error('Livestck not created ', err)
    res.status(500).json({ error: err.message });
  }
};

// Get all livestock (GET /api/livestock)
exports.getAllLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.find({ userId: req.user._id });
    res.status(200).json(livestock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add feeding log (POST /api/livestock/:id/feeding)
exports.addFeedingLog = async (req, res) => {
  try {
    const livestock = await Livestock.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $push: { feedingLogs: req.body } },
      { new: true }
    );
    if (!livestock) return res.status(404).json({ error: "Livestock not found" });
    res.status(200).json(livestock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLivestock = async (req, res) => {
  try {
    console.log(`Attempting to delete livestock ${req.params.id} for user ${req.user._id}`);
    
    const livestock = await Livestock.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    console.log('Delete operation result:', livestock);

    if (!livestock) {
      console.warn('Livestock not found or not owned by user');
      return res.status(404).json({ 
        success: false,
        error: "Livestock not found or you don't have permission" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Livestock deleted successfully",
      deletedId: livestock._id
    });
    
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      success: false,
      error: "Server error during deletion",
      details: err.message 
    });
  }
};


// Add vet log (POST /api/livestock/:id/vet)
exports.addVetLog = async (req, res) => {
  try {
    const livestock = await Livestock.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $push: { vetLogs: req.body } },
      { new: true }
    );
    if (!livestock) return res.status(404).json({ error: "Livestock not found" });
    res.status(200).json(livestock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add vaccination (POST /api/livestock/:id/vaccinations)
exports.addVaccination = async (req, res) => {
  try {
    const livestock = await Livestock.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $push: { vaccinations: req.body } },
      { new: true }
    );
    if (!livestock) return res.status(404).json({ error: "Livestock not found" });
    res.status(200).json({
        success: true,
        message: 'vaccination added successfullt',
        livestock,
    });
  } catch (err) {
    console.error('Vaccination noy addes',err);
    res.status(500).json({ error: err.message });
  }
};

//get all details of livestock
exports.getLivestockDetails = async (req, res) => {
  try {
    const livestock = await Livestock.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!livestock) {
      return res.status(404).json({ error: "Livestock not found" });
    }

    res.status(200).json({
      livestock,
    });

  } catch (err) {
    console.error('Error , no data found', err);
    res.status(500).json({ error: err.message });
  }
};

// vaccination schedule details
// Get upcoming vaccinations for a specific animal
exports.getUpcomingVaccinations = async (req, res) => {
  try {
    const today = new Date();
    const livestock = await Livestock.findOne({
      _id: req.params.id,       // Specific animal ID
      userId: req.user._id      // Ensure user owns the animal
    });

    if (!livestock) {
      return res.status(404).json({ error: "Livestock not found" });
    }

    // Filter vaccinations due after today
    const upcomingVaccinations = livestock.vaccinations.filter(
      v => new Date(v.nextDueDate) >= today
    );

    res.status(200).json({
      animalName: livestock.name,
      upcomingVaccinations
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

