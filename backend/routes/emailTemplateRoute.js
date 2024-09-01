// routes/emailTemplateRoute.js
import express from 'express';
import { insertEmailTemplate } from '../controllers/emailTemplateController.js';

const router = express.Router();

// Route to initialize email templates
router.get('/initialize', (req, res) => {
    try {
        // Call the function to insert email templates
        insertEmailTemplate('signup', 'Signup Template', 'Welcome to Our Service', 'signup.html');
        insertEmailTemplate('change_password', 'Change Password Template', 'Reset Your Password', 'changePassword.html');
        insertEmailTemplate('forgot_password', 'Forgot Password Template', 'Password Recovery', 'forgotPassword.html');

        res.status(200).send('Email templates initialization started.');
    } catch (error) {
        console.error('Error initializing email templates:', error);
        res.status(500).send('Error initializing email templates.');
    }
});

export default router;
