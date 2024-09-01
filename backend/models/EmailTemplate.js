// models/EmailTemplate.js
import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
    temp_slug: {
        type: String,
        required: true,
        unique: true,
    },
    temp_title: {
        type: String,
        required: true,
    },
    temp_subject: {
        type: String,
        required: true,
    },
    temp_content: {
        type: String,
        required: true,
    },
    temp_created_at: {
        type: Date,
        default: Date.now,
    },
});

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

export default EmailTemplate;
