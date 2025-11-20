# Email Setup for Event Registration Notifications

## Overview
When users register for events, they will automatically receive a confirmation email with event details.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure the following:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

### 3. Gmail Configuration (Recommended)

#### For Gmail:
1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

#### For Other Email Providers:
Update the service in `utils/emailService.js`:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook', // or 'yahoo', 'hotmail', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### 4. Custom SMTP Configuration
For custom email servers, replace the service configuration:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Features

### Email Template Includes:
- ✅ Event title and description
- ✅ Date and time
- ✅ Venue information
- ✅ Organizer details
- ✅ Event type and department
- ✅ Online meeting links (if applicable)
- ✅ Professional HTML formatting
- ✅ Next steps for attendees

### Error Handling:
- Registration will succeed even if email fails
- Email errors are logged but don't break the registration process
- User receives confirmation message about email being sent

## Testing

### Test Email Functionality:
1. Register for an event through the frontend
2. Check the backend console for email sending logs
3. Verify the email arrives in the user's inbox
4. Check email formatting and content

### Troubleshooting:
- **Email not sending**: Check EMAIL_USER and EMAIL_PASS in .env
- **Gmail authentication error**: Ensure app password is used, not regular password
- **Email in spam**: Add your domain to trusted senders

## Security Notes
- Never commit actual email credentials to version control
- Use app-specific passwords for Gmail
- Consider using environment-specific email configurations
- Monitor email sending logs for suspicious activity
