const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' }); // Load from .env.local if present, or fallback logic can be added if needed.
// If .env.local doesn't work for them, standard .env will be picked up if we just used .config(), but Next.js users often use .env.local
// Let's try to support both or just .env.local as per their setup likely. 
// Actually, to be safe and strictly follow "provide ... for the .env file", I should perhaps just use .env? 
// But existing codebase uses .env.local. I'll stick to .env.local path for convenience.
if (!process.env.EMAIL_USER) {
    require('dotenv').config(); // try standard .env if .env.local didn't populate it
}


const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests specifically from the frontend
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

// Route
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, subject, message, phone } = req.body;

    // Basic validation
    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required' });
    }

    try {
        // Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Mail Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'mrunalbhavsar2804@gmail.com', // Recipient address from requirements
            subject: `Portfolio Contact: ${subject || 'New Message'}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                    ${message}
                </blockquote>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        console.log(`Email sent from ${email}`);
        res.status(200).json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('------- EMAIL SENDING FAILED -------');
        console.error(`Time: ${new Date().toISOString()}`);
        console.error(`Error Code: ${error.code}`);
        console.error(`Error Message: ${error.message}`);

        if (error.code === 'EAUTH') {
            console.error('Possible Cause: Invalid Email or App Password. Please check your .env.local file.');
        } else if (error.code === 'ESOCKET') {
            console.error('Possible Cause: Network connection issue.');
        }
        console.error('------------------------------------');

        res.status(500).json({
            error: 'Failed to send email',
            details: error.message // Sending details to frontend for debugging (optional, can be removed in prod)
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
