const express = require('express');
const { validate, contactValidation } = require('../middleware/validation');
const { sendContactEmail, sendUserConfirmationEmail } = require('../services/emailService');

const router = express.Router();

// POST /api/contact - Send contact form message
router.post('/', validate(contactValidation.sendMessage), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;


    // Send email to admin (your email)
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message
    });

    // Send confirmation email to user (optional)
    const confirmationResult = await sendUserConfirmationEmail({
      name,
      email,
      subject,
      message
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
      data: {
        emailSent: emailResult.success,
        confirmationSent: confirmationResult.success,
        messageId: emailResult.messageId
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
