import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import emailTemplateRoutes from "./routes/emailTemplateRoute.js"; // Import the email template route
import forgotPasswordRoute from "./routes/forgotPasswordRoute.js"
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";
import axios from "axios"; // Import axios to make HTTP requests

dotenv.config();

// Connect to the database
connectDB();
job.start();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
// Middlewares
const allowedOrigins = ['https://advancethreads.onrender.com', 'http://localhost:3000'];

app.use(cors({
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true, // Allow credentials (cookies, headers)
}));

app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/email", emailTemplateRoutes); // Set up the email template route
app.use("/api",forgotPasswordRoute)


// Serve frontend
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "frontend", "dist")));

	// React app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Start the server and automatically call the route to initialize email templates
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    
    // Automatically call the route to initialize email templates
    axios.get(`http://localhost:${PORT}/api/email/initialize`)
        .then(response => console.log(response.data))
        .catch(error => console.error('Error initializing email templates:', error.message));
});
