const Race = require("../models/race_model"); // Adjust path as needed

class RaceService {
  // Create new race
  async createRace(raceData) {
    try {
      const race = new Race(raceData);
      return await race.save();
    } catch (error) {
      throw new Error(`Error creating race: ${error.message}`);
    }
  }

  // Get all races
  async getAllRaces() {
    try {
      return await Race.find();
    } catch (error) {
      throw new Error(`Error fetching races: ${error.message}`);
    }
  }

  // Get single race by ID
  async getRaceById(id) {
    try {
      const race = await Race.findById(id);
      if (!race) throw new Error("Race not found");
      return race;
    } catch (error) {
      throw new Error(`Error fetching race: ${error.message}`);
    }
  }

  // Update race by ID
  async updateRace(id, updateData) {
    try {
      const updatedRace = await Race.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });
      if (!updatedRace) throw new Error("Race not found");
      return updatedRace;
    } catch (error) {
      throw new Error(`Error updating race: ${error.message}`);
    }
  }

  // Delete race by ID
  async deleteRace(id) {
    try {
      const deletedRace = await Race.findByIdAndDelete(id);
      if (!deletedRace) throw new Error("Race not found");
      return deletedRace;
    } catch (error) {
      throw new Error(`Error deleting race: ${error.message}`);
    }
  }

  // Get races by registration status
  async getRacesByStatus(status) {
    try {
      return await Race.find({ RegistrationStatus: status });
    } catch (error) {
      throw new Error(`Error fetching races by status: ${error.message}`);
    }
  }
}

module.exports = new RaceService();