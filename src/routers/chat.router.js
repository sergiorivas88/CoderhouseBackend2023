
import { Router } from 'express';
import messagesController from "../controller/chat.controller.js"
import { authenticateLevel } from '../utils/utils.js';

const router = Router();
router.get('/chat', authenticateLevel(3), async (req, res) => {
    const user = req.user;   
    const messages = await messagesController.find()
    const cleanMessages = messages.map(message => ({ userEmail: message.userEmail, message: message.message }));
    res.render('chat', { messages: cleanMessages, user: user });

});


router.post('/messages', async (req, res) => {
    const { user: userEmail, message } = req.body;
    if (!userEmail || !message) {
        return res.status(400).json({ error: 'Both userEmail and message are required' });
    }
    const newMessage = await messagesController.create(userEmail, message);
    res.status(201).json(newMessage);
});

export default router;