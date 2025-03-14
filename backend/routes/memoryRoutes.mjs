import express from 'express';
import { saveGameData } from '../controllers/memory/saveGameData.mjs';
import ListGames from "../controllers/memory/listGames/index.mjs";
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);
router.get('/list/:userID', ListGames);

export default router;