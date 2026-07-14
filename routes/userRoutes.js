const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

const {
    getProfile,
    getRatings,
    updateProfile,
    deleteProfile,
    profile,
    ratings,
    uploadIdCard,
    getPendingVerifications,
    reviewVerification
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.get("/ratings", auth, getRatings);
router.put("/profile", auth, updateProfile);
router.post("/upload-id-card", auth, upload.single('idCard'), uploadIdCard);
router.delete("/profile", auth, deleteProfile);
router.get("/verification/pending", auth, getPendingVerifications);
router.post("/verification/:userId", auth, reviewVerification);
router.get("/:id/profile", auth, profile);
router.get("/:id/ratings", auth, ratings);

module.exports = router;
