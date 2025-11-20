const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your email password or app-specific password
    }
  });
};

// Send event registration confirmation email
const sendEventRegistrationEmail = async (userEmail, userName, eventDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Registration Confirmed: ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin: 0;">UniLinked</h1>
            <p style="color: #666; margin: 5px 0;">University Networking Platform</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; margin: 0 0 15px 0;">🎉 Registration Successful!</h2>
            <p style="margin: 0; font-size: 16px; color: #333;">
              Dear <strong>${userName}</strong>,
            </p>
            <p style="margin: 10px 0; color: #333;">
              You have successfully registered for the following event:
            </p>
          </div>
          
          <div style="background-color: #fff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">${eventDetails.title}</h3>
            ${eventDetails.description ? `<p style="color: #666; margin: 0 0 15px 0;"><strong>Description:</strong> ${eventDetails.description}</p>` : ''}
            <div style="display: grid; gap: 10px;">
              <p style="margin: 0; color: #333;"><strong>📅 Date & Time:</strong> ${new Date(eventDetails.dateTime).toLocaleString()}</p>
              <p style="margin: 0; color: #333;"><strong>📍 Venue:</strong> ${eventDetails.venue}</p>
              ${eventDetails.organizer ? `<p style="margin: 0; color: #333;"><strong>👤 Organizer:</strong> ${eventDetails.organizer}</p>` : ''}
              ${eventDetails.type ? `<p style="margin: 0; color: #333;"><strong>🏷️ Type:</strong> ${eventDetails.type}</p>` : ''}
              ${eventDetails.department ? `<p style="margin: 0; color: #333;"><strong>🏫 Department:</strong> ${eventDetails.department}</p>` : ''}
              ${eventDetails.isOnline && eventDetails.onlineLink ? `<p style="margin: 0; color: #333;"><strong>🔗 Online Link:</strong> <a href="${eventDetails.onlineLink}" style="color: #3b82f6;">${eventDetails.onlineLink}</a></p>` : ''}
            </div>
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0;">📋 What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li>Save this email for your records</li>
              <li>Mark your calendar for the event date</li>
              <li>Prepare any materials if mentioned by the organizer</li>
              <li>Join on time ${eventDetails.isOnline ? 'using the online link above' : 'at the specified venue'}</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              If you have any questions, please contact the event organizer or our support team.
            </p>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">
              This is an automated email from UniLinked. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending registration email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEventRegistrationEmail
};
