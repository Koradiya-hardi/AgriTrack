const Chemical = require('../models/Chemical');
const Crop = require('../models/Crop');

// Record new chemical application
exports.addChemical = async (req, res) => {
  try {
    // Verify the crop belongs to the user
    const crop = await Crop.findOne({
      _id: req.body.cropId,
      userId: req.user._id
    });
    
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found or access denied' });
    }

    const chemical = await Chemical.create({
      userId: req.user._id,
      cropId: req.body.cropId,
      type: req.body.type,
      name: req.body.name,
      date: req.body.date || Date.now(),
      quantity: {
        value: req.body.quantityValue,
        unit: req.body.quantityUnit || 'kg'
      },
      remarks: req.body.remarks
    });

    res.status(201).json({
        success: true,
        message:"chemical application recorded successfully",
        chemical,
    });
  } catch (err) {
    console.error('Chemical application error', err);
    res.status(500).json({ error: err.message });
  }
};

// Get chemical applications by crop
exports.getChemicalsByCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    
    // Verify crop ownership
    const crop = await Crop.findOne({
      _id: cropId,
      userId: req.user._id
    });
    
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found or access denied' });
    }

    const chemicals = await Chemical.find({ cropId }).sort({ date: -1 });
    res.status(200).json({
      cropName: crop.name,
      chemicals
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get chemical usage report
exports.getChemicalReport = async (req, res) => {
  try {
    const report = await Chemical.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            cropId: '$cropId',
            type: '$type'
          },
          totalQuantity: { $sum: '$quantity.value' },
          applications: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'crops',
          localField: '_id.cropId',
          foreignField: '_id',
          as: 'crop'
        }
      },
      { $unwind: '$crop' },
      {
        $project: {
          cropName: '$crop.name',
          chemicalType: '$_id.type',
          totalQuantity: 1,
          applications: 1
        }
      }
    ]);

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//features for chemical tracking implemented in the code above:

// Chemical Tracking: Record fertilizers/pesticides with quantity and units

// Crop-Specific Reports: View all applications per crop

// Usage Analytics: Summary report of chemical usage by crop and type

// Ownership Verification: Ensures users only access their own data