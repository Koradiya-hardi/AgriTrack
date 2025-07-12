const Crop = require("../models/Crop");

// Add a new crop
exports.addCrop = async (req, res) => {
  try {
    const { name, type, plantingDate, harvestDate, status } = req.body;

    const crop = await Crop.create({
      name,
      type,
      plantingDate,
      harvestDate,
      status,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Crop added successfully",
      crop,
    });
  } catch (err) {
    console.error("Crop not created", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get all crops for the logged-in user
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user._id });

    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a crop
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!crop) return res.status(404).json({ error: "Crop not found" });
    res.status(200).json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a crop
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!crop) return res.status(404).json({ error: "Crop not found" });
    res.status(200).json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
