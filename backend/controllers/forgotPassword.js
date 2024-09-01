import User from "../models/userModel.js"; // Import the User model
import EmailTemplate from "../models/EmailTemplate.js"; // Import the EmailTemplate model
import nodemailer from "nodemailer"; // Import Nodemailer for sending emails
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";


// Function to fetch email template by slug
const fetchEmailTemplateBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        // Find the email template by its slug
        const template = await EmailTemplate.findOne({ temp_slug: slug }, 'temp_title temp_content');

        // If no template is found, return a 404 error
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        // Return the template
        res.json(template);
    } catch (error) {
        // Handle errors and return a 500 status code with the error message
        res.status(500).json({ error: error.message });
    }
};



// Function to get the email template based on the slug
const getEmailTemplate = async (slug) => {
    const response = await axios.get(`http://localhost:5000/api/email-templates/${slug}`);
    return response.data;
};

// Function to send the password reset email
const sendPasswordResetEmail = async (user_email, token, user_name) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        // Fetch the email template for password reset
        const template = await getEmailTemplate("forgot_password");

        // Replace placeholders with actual values
        let emailContent = template.temp_content
            .replace("{reset_link}", resetLink)
            .replace("{user_name}", user_name);

        // Send the email
        const info = await transporter.sendMail({
            from: `"SmartThreads" <${process.env.EMAIL_ADDRESS}>`,
            to: user_email,
            subject: "Password Reset Request",
            html: emailContent,
        });

        console.log("Password reset email sent: %s", info.messageId);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

// Controller to handle email checking and password reset link sending
const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user with the given email exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email not found', exists: false });
        }

        // Generate a JWT token for the password reset
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the password reset email
        await sendPasswordResetEmail(user.email, resetToken, user.name);

        res.json({ exists: true, message: 'Password reset link sent to email' });
    } catch (error) {
        console.error("Error in checkEmail:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to handle password change
const changePassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch the user using the decoded token
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Save the updated user with the new password
        await user.save();

        // Send confirmation email
        await sendPasswordChangeConfirmationEmail(user.email, user.name);

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};

// Function to send the password change confirmation email
const sendPasswordChangeConfirmationEmail = async (user_email, user_name) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Fetch the email template for password change confirmation
        const template = await getEmailTemplate("change_password");

        // Replace placeholders with actual values
        const emailContent = template.temp_content.replace("{user_name}", user_name);

        // Send the email
        const info = await transporter.sendMail({
            from: `"SmartThreads" <${process.env.EMAIL_ADDRESS}>`,
            to: user_email,
            subject: "Your password has been changed",
            html: emailContent,
        });

        console.log("Password change confirmation email sent: %s", info.messageId);
    } catch (error) {
        console.error('Error sending password change confirmation email:', error);
        throw error;
    }
};

export { checkEmail, changePassword, fetchEmailTemplateBySlug};
