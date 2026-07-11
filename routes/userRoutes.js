const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const { profile, ratings } = require("../controllers/userController");

router.get("/:id/profile", auth, profile);
router.get("/:id/ratings", auth, ratings);

module.exports = router;
