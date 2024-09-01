import fs from 'fs/promises'; // Import the promise-based version of fs
import path from 'path';
import { fileURLToPath } from 'url';
import EmailTemplate from '../models/EmailTemplate.js';

// ESM-compatible way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const insertEmailTemplate = async (slug, title, subject, filePath) => {
    // Update the path to the correct directory
    const templatePath = path.resolve(__dirname, '../../frontend/src/components/emailTemplates', filePath);

    try {
        // Read the file content asynchronously
        const content = await fs.readFile(templatePath, 'utf8');

        // Check if template with the given slug already exists
        const existingTemplate = await EmailTemplate.findOne({ temp_slug: slug });

        if (existingTemplate) {
            console.log(`Template with slug '${slug}' already exists. No changes made.`);
        } else {
            // Insert new template
            const newTemplate = new EmailTemplate({
                temp_slug: slug,
                temp_title: title,
                temp_subject: subject,
                temp_content: content,
            });

            await newTemplate.save();
            console.log(`Template ${title} inserted successfully`);
        }
    } catch (error) {
        console.error('Error processing email template:', error);
    }
};

