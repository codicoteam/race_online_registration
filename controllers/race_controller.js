const raceService = require("../services/race_service"); // Adjust path as needed

class RaceController {
  // Create new race
  async createRace(req, res) {
    try {
      const race = await raceService.createRace(req.body);
      res.status(201).json(race);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all races
  async getAllRaces(req, res) {
    try {
      const races = await raceService.getAllRaces();
      res.status(200).json(races);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get single race
  async getRaceById(req, res) {
    try {
      const race = await raceService.getRaceById(req.params.id);
      res.status(200).json(race);
    } catch (error) {
      if (error.message === "Race not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  // Update race
  async updateRace(req, res) {
    try {
      const updatedRace = await raceService.updateRace(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedRace);
    } catch (error) {
      if (error.message === "Race not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  // Delete race
  async deleteRace(req, res) {
    try {
      await raceService.deleteRace(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === "Race not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Get races by status
  async getRacesByStatus(req, res) {
    try {
      const validStatuses = ["Open", "Closed", "Postponed"];
      if (!validStatuses.includes(req.params.status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      
      const races = await raceService.getRacesByStatus(req.params.status);
      res.status(200).json(races);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RaceController();