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
const sendRegistrationEmail = async (email, registrationNumber, name) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: '✅ Successful Registration for the Race',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header with Logo -->
          <div style="background-color: #00695c; padding: 20px 0; text-align: center;">
            <img src="https://aamokxxnfpmdpayvmngs.supabase.co/storage/v1/object/public/academy//Screenshot%20from%202025-07-07%2018-42-48.png" alt="Race Logo" style="height: 60px; margin-bottom: 10px;">
            <h1 style="color: white; font-size: 24px; margin: 0;">Race Registration Confirmation</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px;">
            <h2 style="color: #2c3e50;">Hello ${name},</h2>
            <p style="font-size: 16px; color: #333;">🎉 You have successfully registered for the race!</p>

            <p style="font-size: 16px; color: #333;">
              <strong>Your registration number is:</strong>
              <span style="color: #00695c; font-weight: bold;">${registrationNumber}</span>
            </p>

            <p style="font-size: 16px; color: #333;">
              Please use this registration number to proceed with payment via <strong>EcoCash</strong>.
            </p>

            <p style="font-size: 16px; color: #333;">
              Thank you for registering — we look forward to seeing you at the event!
            </p>

            <p style="font-size: 16px; color: #333;">Best regards,<br><strong>The Race Organizing Team</strong></p>
          </div>

          <!-- Footer -->
          <div style="background-color: #eeeeee; padding: 15px; text-align: center; color: #666;">
            <small>© 2025 Race Event • All rights reserved</small>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // Do not throw to avoid breaking the flow if email fails
  }
};

const createRegistration = async (req, res) => {
  try {
    const athlete = await registrationService.createRegistration(req.body);
    
    // Send registration email
    await sendRegistrationEmail(
      athlete.email, 
      athlete.registration_number,
      `${athlete.firstName} ${athlete.lastName}`
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