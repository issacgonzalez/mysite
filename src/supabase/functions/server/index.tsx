import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-928859b8/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all contact submissions (for admin/debugging)
app.get("/make-server-928859b8/contact-submissions", async (c) => {
  try {
    const submissions = await kv.getByPrefix("contact_");
    
    // Filter out any invalid submissions and sort by timestamp (newest first)
    const validSubmissions = submissions.filter(sub => sub && sub.value && sub.value.timestamp);
    
    const sortedSubmissions = validSubmissions.sort((a, b) => {
      try {
        const timeA = new Date(a.value.timestamp).getTime();
        const timeB = new Date(b.value.timestamp).getTime();
        return timeB - timeA;
      } catch (err) {
        console.error('Error sorting submission:', err);
        return 0;
      }
    });
    
    return c.json({ 
      success: true, 
      count: sortedSubmissions.length,
      submissions: sortedSubmissions.map(sub => ({
        id: sub.key,
        ...sub.value
      }))
    });
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return c.json({ 
      error: "Failed to retrieve submissions",
      details: error.message 
    }, 500);
  }
});

// Contact form endpoint
app.post("/make-server-928859b8/contact", async (c) => {
  try {
    const { name, email, message } = await c.req.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Store the contact submission in the KV store for record keeping
    const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(submissionId, {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      status: 'received'
    });

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    console.log('Checking RESEND_API_KEY:', resendApiKey ? `Found (starts with: ${resendApiKey.substring(0, 3)}...)` : 'NOT FOUND');
    
    // If no API key or invalid format, just store the submission
    if (!resendApiKey || !resendApiKey.startsWith('re_')) {
      const reason = !resendApiKey ? 'not configured' : 'invalid format (must start with "re_")';
      console.log(`Email service ${reason}, storing submission only`);
      
      await kv.set(submissionId, {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        status: 'email_disabled',
        note: `Email service ${reason}`
      });
      
      return c.json({ 
        success: true, 
        message: "✅ Message received! I'll get back to you soon via email." 
      });
    }

    // Resend email payload
    // NOTE: To receive real emails, you need to:
    // 1. Verify a domain in Resend dashboard (https://resend.com/domains)
    // 2. Update the 'from' address to use your verified domain
    // For now, using Resend's test addresses
    const emailPayload = {
      from: 'Issac Gonzalez Portfolio <onboarding@resend.dev>',
      to: ['delivered@resend.dev'], // Change to ['issacngonzalez@gmail.com'] after verifying domain
      subject: `🔥 Portfolio Contact: ${name} wants to connect!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F89A1C; border-bottom: 2px solid #F89A1C; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> <a href="mailto:${email}" style="color: #F89A1C;">${email}</a></p>
          </div>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #F89A1C; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #333;">Message:</strong></p>
            <p style="color: #555; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #888; font-size: 12px; text-align: center;">
            Sent from your portfolio website at ${new Date().toLocaleString()}
          </p>
          <p style="color: #888; font-size: 12px; text-align: center;">
            Reply directly to: <a href="mailto:${email}" style="color: #F89A1C;">${email}</a>
          </p>
        </div>
      `,
      reply_to: email
    };

    console.log('Attempting to send email with payload:', JSON.stringify(emailPayload, null, 2));

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Email sending failed with status:', emailResponse.status);
      console.error('Error details:', errorText);
      
      let errorObj;
      try {
        errorObj = JSON.parse(errorText);
      } catch {
        errorObj = { message: errorText };
      }
      
      // Update submission status
      await kv.set(submissionId, {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        status: 'email_failed',
        error: errorText,
        statusCode: emailResponse.status
      });
      
      // Email failed but submission is saved - return success to user
      console.error('⚠️ Email delivery failed but submission saved');
      console.error('Status:', emailResponse.status, 'Details:', errorText);
      
      return c.json({ 
        success: true,
        message: "✅ Message received! I'll get back to you soon via email."
      });
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    // Update submission status
    await kv.set(submissionId, {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      status: 'email_sent',
      emailId: emailResult.id
    });

    return c.json({ 
      success: true, 
      message: "Message sent successfully!" 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ 
      error: "Failed to process contact form submission",
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);
