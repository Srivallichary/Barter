const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const { getProfile, getRatings, updateProfile, profile, ratings } = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.get("/ratings", auth, getRatings);
router.put("/profile", auth, updateProfile);
router.get("/:id/profile", auth, profile);
router.get("/:id/ratings", auth, ratings);

module.exports = router;
