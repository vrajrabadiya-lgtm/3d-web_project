import express from "express";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const router = express.Router();

function createMailTransporter() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields (name, email, message)",
      });
    }

    // Always persist the contact message first
    const contact = new Contact({ name, email, message });
    const savedContact = await contact.save();

    // Email is best-effort — never fail the whole request if SMTP fails
    let emailSent = false;
    try {
      const user = process.env.EMAIL_USER?.trim();
      const pass = process.env.EMAIL_PASS?.trim();

      if (!user || !pass) {
        console.warn(
          "EMAIL_USER / EMAIL_PASS missing or empty in .env — skipping email send."
        );
      } else {
        const transporter = createMailTransporter();
        await transporter.sendMail({
          from: user,
          to: "support@ornitech.in",
          subject: `New Contact Message from ${name}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });
        emailSent = true;
      }
    } catch (mailError) {
      console.error("Nodemailer failed (message still saved to DB):", mailError.message);
    }

    return res.status(201).json({
      ...savedContact.toObject(),
      emailSent,
      message: emailSent
        ? "Contact saved and email sent."
        : "Contact saved. Email could not be sent (check EMAIL_USER / EMAIL_PASS).",
    });
  } catch (error) {
    console.error("Error in contact route:", error);
    return res.status(500).json({ error: "Failed to submit message. Server error." });
  }
});

export default router;
