const { Paynow } = require("paynow");
const nodemailer = require('nodemailer');
const registrationService = require('../services/registration_service');
require('dotenv').config();

// Initialize Paynow with environment variables
const paynow = new Paynow(process.env.PAYNOW_ID, process.env.PAYNOW_KEY);
paynow.resultUrl = process.env.PAYNOW_RESULT_URL;
paynow.returnUrl = process.env.PAYNOW_RETURN_URL;

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});
const sendRegistrationEmail = async (email, registrationNumber, name, raceName) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: `✅ Registration Confirmed - ${raceName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 40px 0; margin: 0;">
        <div style="max-width: 650px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); overflow: hidden;">
          
          <!-- Zimbabwe Flag Inspired Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #dc2626 25%, #ffffff 25%, #ffffff 50%, #000000 50%, #000000 75%, #dc2626 75%); height: 8px;"></div>
          
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #dc2626 33%, #ffffff 33%, #ffffff 66%, #000000 66%);"></div>
            <img src="https://aamokxxnfpmdpayvmngs.supabase.co/storage/v1/object/public/academy//Screenshot%20from%202025-07-07%2018-42-48.png" alt="Race Logo" style="height: 70px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
            <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Registration Confirmed!</h1>
            <p style="color: #fef2f2; font-size: 16px; margin: 8px 0 0 0; font-weight: 300;">${raceName}</p>
          </div>
          
          <!-- Success Banner -->
          <div style="background: linear-gradient(90deg, #dc2626, #ffffff, #000000); padding: 2px;">
            <div style="background: #f8fafc; padding: 20px; text-align: center;">
              <div style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 18px;">
                🎉 REGISTRATION SUCCESSFUL
              </div>
            </div>
          </div>
          
          <!-- Body Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Hello ${name},</h2>
            
            <p style="font-size: 17px; color: #374151; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! You have successfully registered for <strong style="color: #dc2626;">${raceName}</strong>. 
              We're excited to have you join us for this incredible event!
            </p>
            
            <!-- Registration Number Card -->
            <div style="background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%); border: 2px solid #dc2626; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Registration Number</p>
              <div style="font-size: 32px; font-weight: 900; color: #dc2626; font-family: 'Courier New', monospace; letter-spacing: 2px; margin: 8px 0;">${registrationNumber}</div>
              <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0;">Keep this number safe - you'll need it for payment</p>
            </div>
            
            <!-- Payment Instructions -->
            <div style="background: #f9fafb; border-left: 4px solid #000000; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">💰 Payment Instructions</h3>
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0;">
                Please use your registration number <strong style="color: #dc2626;">${registrationNumber}</strong> 
                to proceed with payment via <strong>EcoCash</strong>. Payment details will be provided separately.
              </p>
            </div>
            
            <!-- What's Next Section -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">📋 What's Next?</h3>
              <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Complete your payment using the registration number above</li>
                <li>Wait for payment confirmation email</li>
                <li>Prepare for race day and follow any additional instructions</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 20px;">
                Thank you for registering with us. We look forward to seeing you at the starting line!
              </p>
              
              <p style="font-size: 16px; color: #6b7280; margin: 0;">
                Best regards,<br>
                <strong style="color: #dc2626;">The ${raceName} Organizing Team</strong>
              </p>
            </div>
          </div>
          
          <!-- Footer with Zimbabwe Flag Colors -->
          <div style="background: linear-gradient(90deg, #dc2626 33%, #ffffff 33%, #ffffff 66%, #000000 66%); padding: 2px;">
            <div style="background: #1f2937; padding: 20px; text-align: center;">
              <div style="margin-bottom: 10px;">
                <span style="color: #dc2626; font-size: 24px; margin: 0 5px;">●</span>
                <span style="color: #ffffff; font-size: 24px; margin: 0 5px;">●</span>
                <span style="color: #ffffff; font-size: 24px; margin: 0 5px;">●</span>
              </div>
              <small style="color: #9ca3af; font-size: 14px;">
                © 2025 ${raceName} • All rights reserved<br>
                <span style="color: #6b7280;">Powered by passion, driven by excellence</span>
              </small>
            </div>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent successfully to ${email} for ${raceName}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Do not throw to avoid breaking the flow if email fails
  }
}

const createRegistration = async (req, res) => {
  try {
    const athlete = await registrationService.createRegistration(req.body);
    
    // Send registration email
    await sendRegistrationEmail(
      athlete.email, 
      athlete.registration_number,
      `${athlete.firstName} ${athlete.lastName}`,
      athlete.raceName

    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      registration_number: athlete.registration_number
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

const payByEcocash = async (req, res) => {
  const { registration_number, phoneNumber } = req.body;
  
  try {
    const athlete = await registrationService.findByRegistrationNumber(registration_number);
    
    if (!athlete) {
      return res.status(404).json({ error: "Registration not found" });
    }
    
    if (athlete.paymentStatus === "paid") {
      return res.status(400).json({ error: "Payment already completed" });
    }
    
    const invoiceNumber = `INV-${Date.now()}`;
    const payment = paynow.createPayment(invoiceNumber, `${registration_number}@athlete.com`);
    
    payment.add(athlete.raceEvent, athlete.racePrice);
    
    const response = await paynow.sendMobile(payment, phoneNumber, 'ecocash');
    
    if (response.success) {
      await registrationService.updatePollUrl(registration_number, response.pollUrl);
      await registrationService.updatePaymentStatus(registration_number, "pending");
      
      res.json({
        success: true,
        message: "Payment initiated",
        pollUrl: response.pollUrl,
        registration_number
      });
    } else {
      await registrationService.updatePaymentStatus(registration_number, "failed");
      res.status(500).json({ error: response.errors });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkPaymentStatus = async (req, res) => {
  const { pollUrl } = req.body;
  
  try {
    const status = await paynow.pollTransaction(pollUrl);
    const athlete = await Athlete.findOne({ pollUrl });
    
    if (!athlete) {
      return res.status(404).json({ error: "Registration not found" });
    }
    
    if (status.status === "paid") {
      await registrationService.updatePaymentStatus(athlete.registration_number, "paid");
      return res.json({ 
        status: "paid", 
        message: "Payment successful",
        registration_number: athlete.registration_number
      });
    }
    
    res.json({ 
      status: status.status, 
      message: "Payment not yet completed",
      registration_number: athlete.registration_number
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const athletes = await registrationService.getAllRegistrations();
    res.status(200).json(athletes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRegistrationById = async (req, res) => {
  try {
    const athlete = await registrationService.getRegistrationById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.status(200).json(athlete);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRegistration = async (req, res) => {
  try {
    const updatedAthlete = await registrationService.updateRegistrationById(
      req.params.id,
      req.body
    );
    if (!updatedAthlete) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.status(200).json(updatedAthlete);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    const deletedAthlete = await registrationService.deleteRegistrationById(req.params.id);
    if (!deletedAthlete) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.status(200).json({ message: "Registration deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRegistration,
  payByEcocash,
  checkPaymentStatus,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration
};