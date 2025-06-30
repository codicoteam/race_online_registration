const Athlete = require('../models/registration_model');

const generateRegistrationNumber = () => {
  return 'MPR' + Math.floor(1000000000 + Math.random() * 9000000000);
};

const createRegistration = async (data) => {
  try {
    data.registration_number = generateRegistrationNumber();
    const newAthlete = new Athlete(data);
    return await newAthlete.save();
  } catch (error) {
    throw error;
  }
};

const findByRegistrationNumber = async (regNumber) => {
  return await Athlete.findOne({ registration_number: regNumber });
};

const updatePaymentStatus = async (regNumber, status) => {
  return await Athlete.findOneAndUpdate(
    { registration_number: regNumber },
    { paymentStatus: status },
    { new: true }
  );
};

const updatePollUrl = async (regNumber, pollUrl) => {
  return await Athlete.findOneAndUpdate(
    { registration_number: regNumber },
    { pollUrl },
    { new: true }
  );
};
const getAllRegistrations = async () => {
  return await Athlete.find();
};

const getRegistrationById = async (id) => {
  return await Athlete.findById(id);
};

const updateRegistrationById = async (id, updateData) => {
  return await Athlete.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

const deleteRegistrationById = async (id) => {
  return await Athlete.findByIdAndDelete(id);
};

module.exports = {
  createRegistration,
  findByRegistrationNumber,
  updatePaymentStatus,
  updatePollUrl,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationById,
  deleteRegistrationById
};