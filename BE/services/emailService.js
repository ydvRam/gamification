const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
  });
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender (your email)
      to: process.env.EMAIL_USER,   // Receiver (your email)
      replyTo: contactData.email,   // Reply to the sender
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                Contact Details
              </h2>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #667eea; display: inline-block; width: 120px;">Name:</strong>
                <span style="color: #333;">${contactData.name}</span>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #667eea; display: inline-block; width: 120px;">Email:</strong>
                <span style="color: #333;">${contactData.email}</span>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #667eea; display: inline-block; width: 120px;">Subject:</strong>
                <span style="color: #333;">${contactData.subject}</span>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #667eea; display: inline-block; width: 120px;">Message:</strong>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                <p style="color: #333; margin: 0; line-height: 1.6;">${contactData.message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3; margin-top: 20px;">
                <p style="margin: 0; color: #1976d2; font-size: 14px;">
                  <strong>📅 Received:</strong> ${new Date().toLocaleString('en-US', { 
                    timeZone: 'Asia/Kolkata',
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })} (IST)
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  This message was sent from your EduGame contact form.
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send notification email to user (optional)
const sendUserConfirmationEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: 'Thank you for contacting EduGame!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎓 EduGame</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 25px; border-radius: 8px;">
              <h2 style="color: #333; margin-top: 0;">Thank you for reaching out!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Hi <strong>${contactData.name}</strong>,
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                We've received your message regarding "<strong>${contactData.subject}</strong>" and will get back to you within 24 hours.
              </p>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                  <strong>📝 Your Message:</strong><br>
                  ${contactData.message.replace(/\n/g, '<br>')}
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                In the meantime, feel free to explore our interactive quizzes and start your learning journey!
              </p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/quizzes" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  🚀 Start Learning
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  Best regards,<br>
                  <strong>EduGame Team</strong><br>
                  Agra, Uttar Pradesh, India
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    // Don't throw error for user confirmation, just log it
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendContactEmail,
  sendUserConfirmationEmail
};
