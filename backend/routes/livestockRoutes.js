const express = require("express");
const router = express.Router();
const {
  addLivestock,
  getAllLivestock,
  addFeedingLog,
  addVetLog,
  addVaccination,
  getLivestockDetails,
  getUpcomingVaccinations,
  deleteLivestock
} = require("../controllers/livestockController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes (require JWT auth)
router.post("/", authMiddleware, addLivestock);
router.get("/", authMiddleware, getAllLivestock);
router.delete("/:id", authMiddleware, deleteLivestock); 
router.post("/:id/feeding", authMiddleware, addFeedingLog);
router.post("/:id/vet", authMiddleware, addVetLog);
router.post("/:id/vaccinations", authMiddleware, addVaccination);
router.get("/:id", authMiddleware, getLivestockDetails);
router.get("/:id/upcoming-vaccinations", authMiddleware, getUpcomingVaccinations);
module.exports = router;