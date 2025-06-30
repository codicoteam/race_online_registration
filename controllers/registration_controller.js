const { Paynow } = require("paynow");
const registrationService = require('../services/registration_service');

const paynow = new Paynow("20035", "57832f6f-bd15-4877-81be-c8e30e390a88");
paynow.resultUrl = "http://example.com/gateways/paynow/update";
paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";

const createRegistration = async (req, res) => {
  try {
    const athlete = await registrationService.createRegistration(req.body);
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
// ... existing code ...

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