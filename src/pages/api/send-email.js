import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { emailType, userEmail, authMethod } = req.body;
  const currentTime = new Date().toLocaleString();

  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'ogunkoyadavid7@gmail.com', // Replace with your sending email
      pass: process.env.EMAIL_PASSWORD // Set this in your environment variables
    }
  });

  // Prepare email content
  const getSubject = () => {
    switch (emailType) {
      case 'login':
        return 'New User Login Alert';
      case 'signup':
        return 'New User Registration Alert';
      default:
        return 'Authentication Alert';
    }
  };

  const getMessage = () => {
    return `
      <h2>Authentication Notification</h2>
      <p><strong>Event Type:</strong> ${emailType === 'login' ? 'User Login' : 'New User Registration'}</p>
      <p><strong>User Email:</strong> ${userEmail}</p>
      <p><strong>Authentication Method:</strong> ${authMethod}</p>
      <p><strong>Time:</strong> ${currentTime}</p>
    `;
  };

  // Email options
  const mailOptions = {
    from: 'ogunkoyadavid7@gmail.com', // Replace with your sending email
    to: 'firewole8@gmail.com',
    subject: getSubject(),
    html: getMessage()
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email notification' });
  }
}