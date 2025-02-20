import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { to, subject, body, trialTitle } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, we'll return success and let the frontend handle mailto
    // In a production environment, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    
    console.log('Email request:', {
      from: currentUser.email,
      to,
      subject,
      trialTitle,
      bodyLength: body.length,
    });

    // Return success to trigger mailto fallback
    return NextResponse.json(
      { 
        success: true,
        message: 'Opening email client...',
        usedMailto: true 
      },
      { status: 200 }
    );

    /* Example with SendGrid (commented out):
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: to,
      from: process.env.VERIFIED_SENDER_EMAIL,
      replyTo: currentUser.email,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
    };

    await sgMail.send(msg);
    return NextResponse.json({ success: true });
    */

  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
