import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Parse request body
    const { emailType, userEmail, authMethod, userDetails } = await request.json();
    const currentTime = new Date().toLocaleString();

    // Create transporter with configuration from env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'true'
      }
    });

    // Verify transporter connection
    await transporter.verify().catch(console.error);

    // Prepare email content
    const getSubject = () => {
      return `${process.env.APP_NAME}userlogin/signup - ${emailType === 'login' ? 'Login Alert' : 'Registration Alert'}`;
    };

    const getMessage = () => {
      let userDetailsHTML = '';
      if (userDetails) {
        userDetailsHTML = `
          User Details:
          
          **User ID:** ${userDetails.uid || 'N/A'}
          
          **Name:** ${userDetails.name || 'N/A'}
          
          **Nickname:** ${userDetails.nickname || 'N/A'}
          
          **Age:** ${userDetails.age || 'N/A'}
          
          **Date of Birth:** ${userDetails.dob || 'N/A'}
          
          **Sex:** ${userDetails.sex || 'N/A'}
          
          **Role:** ${userDetails.role || 'N/A'}
        `;
      }

      return `
        Authentication Notification
        
        **Event Type:** ${emailType === 'login' ? 'User Login' : 'New User Registration'}
        
        **User Email:** ${userEmail}
        
        **Authentication Method:** ${authMethod}
        
        **Time:** ${currentTime}
        ${userDetailsHTML}
      `;
    };

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.NOTIFICATION_EMAIL,
      subject: getSubject(),
      html: getMessage()
    };

    // Send mail
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: 'Email notification sent successfully'
      });
    } catch (mailError) {
      console.error('Mail sending error:', mailError);
      return NextResponse.json(
        { error: 'Failed to send email', details: mailError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in email notification route:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}