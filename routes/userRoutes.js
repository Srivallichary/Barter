const express = require("express");
const router = express.Router();

const { profile, ratings } = require("../controllers/userController");

router.get("/:id/profile", profile);
router.get("/:id/ratings", ratings);

module.exports = router;
