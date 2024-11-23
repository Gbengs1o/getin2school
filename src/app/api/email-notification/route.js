import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Log environment check
    console.log('Environment variables check:', {
      host: process.env.SMTP_HOST ? 'Set' : 'Not set',
      port: process.env.SMTP_PORT ? 'Set' : 'Not set',
      secure: process.env.SMTP_SECURE ? 'Set' : 'Not set',
      user: process.env.SMTP_USER ? 'Set' : 'Not set',
      fromEmail: process.env.SMTP_FROM_EMAIL ? 'Set' : 'Not set',
      notificationEmail: process.env.NOTIFICATION_EMAIL ? 'Set' : 'Not set',
      appName: process.env.APP_NAME ? 'Set' : 'Not set'
    });

    // Validate required environment variables
    const requiredEnvVars = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'EMAIL_PASSWORD',
      'SMTP_FROM_EMAIL',
      'NOTIFICATION_EMAIL',
      'APP_NAME'
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Parse request body
    const { emailType, userEmail, authMethod, userDetails } = await request.json();
    const currentTime = new Date().toLocaleString();

    // Log request data
    console.log('Processing request:', {
      emailType,
      userEmail,
      authMethod,
      timestamp: currentTime
    });

    // Create transporter with enhanced configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'true',
        ciphers: 'SSLv3'
      },
      debug: true, // Enable debug logging
      logger: true  // Enable built-in logger
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', {
        error: verifyError.message,
        code: verifyError.code,
        command: verifyError.command
      });
      return NextResponse.json(
        { error: 'SMTP verification failed', details: verifyError.message },
        { status: 500 }
      );
    }

    // Prepare email subject
    const getSubject = () => {
      return `${process.env.APP_NAME} - ${emailType === 'login' ? 'Login Alert' : 'Registration Alert'}`;
    };

    // Prepare email content
    const getMessage = () => {
      let userDetailsHTML = '';
      if (userDetails) {
        userDetailsHTML = `
          <h3>User Details:</h3>
          <ul>
            <li><strong>User ID:</strong> ${userDetails.uid || 'N/A'}</li>
            <li><strong>Name:</strong> ${userDetails.name || 'N/A'}</li>
            <li><strong>Nickname:</strong> ${userDetails.nickname || 'N/A'}</li>
            <li><strong>Age:</strong> ${userDetails.age || 'N/A'}</li>
            <li><strong>Date of Birth:</strong> ${userDetails.dob || 'N/A'}</li>
            <li><strong>Sex:</strong> ${userDetails.sex || 'N/A'}</li>
            <li><strong>Role:</strong> ${userDetails.role || 'N/A'}</li>
          </ul>
        `;
      }

      return `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>Authentication Notification</h2>
          <p><strong>Event Type:</strong> ${emailType === 'login' ? 'User Login' : 'New User Registration'}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Authentication Method:</strong> ${authMethod}</p>
          <p><strong>Time:</strong> ${currentTime}</p>
          ${userDetailsHTML}
        </div>
      `;
    };

    // Prepare email options
    const mailOptions = {
      from: {
        name: process.env.APP_NAME,
        address: process.env.SMTP_FROM_EMAIL
      },
      to: process.env.NOTIFICATION_EMAIL.split(',').map(email => email.trim()),
      subject: getSubject(),
      html: getMessage(),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    // Log mail options (excluding sensitive data)
    console.log('Preparing to send email:', {
      from: mailOptions.from.address,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response
      });
      
      return NextResponse.json({
        success: true,
        message: 'Email notification sent successfully',
        messageId: info.messageId
      });
    } catch (mailError) {
      console.error('Mail sending error:', {
        error: mailError.message,
        code: mailError.code,
        command: mailError.command,
        response: mailError.response,
        stack: mailError.stack
      });

      return NextResponse.json(
        {
          error: 'Failed to send email',
          details: mailError.message,
          code: mailError.code
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error in email notification route:', {
      error: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: 'Server error', 
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}