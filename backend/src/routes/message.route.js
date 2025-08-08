import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();

router.get('/user',protectRoute,getMessages);
router.get('/:id',protectRoute,getUsersForSidebar);

router.post('/send/:id',protectRoute,sendMessage);

export default router;