const express = require("express");

const {
  createNote,
  deleteNote,
  getNotes,
  getSearchResults,
  updateNote,
} = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getNotes);
router.get("/search", getSearchResults);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
