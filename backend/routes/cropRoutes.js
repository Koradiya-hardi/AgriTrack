const express = require("express");
const router = express.Router();
const {
  addCrop,
  getAllCrops,
  updateCrop,
  deleteCrop,
} = require("../controllers/cropController");
const authMiddleware = require("../middleware/authMiddleware"); // For JWT validation

// Protected routes (require JWT auth)
router.post("/", authMiddleware, addCrop);
router.get("/", authMiddleware, getAllCrops);
router.put("/:id", authMiddleware, updateCrop);
router.delete("/:id", authMiddleware, deleteCrop);

module.exports = router;