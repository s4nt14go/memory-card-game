import express from 'express';
import ListGames from "../controllers/memory/listGames/index.mjs";
import SaveGameData from "../controllers/memory/saveGameData/index.mjs";
const router = express.Router();

// Route to save game data
router.post('/save', SaveGameData);
router.get('/list', ListGames);

export default router;