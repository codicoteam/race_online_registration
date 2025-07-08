const { MessagingResponse } = require('twilio').twiml;
const registrationService = require('../../controllers/registration_controller');
const RaceService = require('../../services/race_service');

module.exports = function(app) {
  app.post("/whatsapp", async (req, res) => {
      console.log("Received a message from Twilio");
  console.log("Received a message from Twilio");

    const userInput = req.body.Body?.trim() || "";
    const session = req.session;
    
    if (!session.state) session.state = "start";

    let response = new MessagingResponse();
    let twimlResponse;

    if (userInput.toLowerCase().startsWith('pay ')) {
      const parts = userInput.split(' ');
      if (parts.length < 3) {
        response.message("❌ Invalid format. Please use: PAY <ticket_number> <phone_number>\nExample: PAY T1234567 0771234567");
      } else {
        const ticketNumber = parts[1];
        const phoneNumber = parts[2];
        
        try {
          const paymentResult = await registrationService.payByEcocash(ticketNumber, phoneNumber);
          
          if (paymentResult.success) {
            response.message(`✅ Payment initiated to ${phoneNumber}! Check your phone to complete payment.`);
          } else {
            response.message(`❌ Payment failed: ${paymentResult.error}`);
          }
        } catch (error) {
          response.message("⚠️ Payment processing error. Please try again later.");
        }
      }
      twimlResponse = response.toString();
    } else {
      switch (session.state) {
        case "start":
          if (userInput.toLowerCase() == "hi") {
            twimlResponse = displayMainMenu(session);
          } else {
            response.message("👋 Welcome! Send 'hi' to start");
            twimlResponse = response.toString();
          }
          break;

        case "menu":
          twimlResponse = handleMenuOption(userInput, session);
          break;

        case "select_race":
          twimlResponse = await handleRaceSelection(userInput, session);
          break;

        case "get_full_name":
          session.full_name = userInput;
          response.message("📧 Please provide your email address:");
          session.state = "get_email";
          twimlResponse = response.toString();
          break;

        case "get_email":
          session.email = userInput;
          response.message("📱 Please provide your phone number:");
          session.state = "get_phone_number";
          twimlResponse = response.toString();
          break;

        case "get_phone_number":
          session.phone_number = userInput;
          response.message("🆔 Please provide your national ID number:");
          session.state = "get_national_id";
          twimlResponse = response.toString();
          break;

        case "get_national_id":
          session.national_id = userInput;
          response.message("🚻 Please select your gender:\n1. Male\n2. Female\n3. Other");
          session.state = "get_gender";
          twimlResponse = response.toString();
          break;

        case "get_gender":
          twimlResponse = handleGenderSelection(userInput, session);
          break;

        case "get_dob":
          session.dob = userInput;
          response.message("👕 Please select your T-shirt size:\n1. Small\n2. Medium\n3. Large\n4. XL");
          session.state = "get_tshirt_size";
          twimlResponse = response.toString();
          break;

        case "get_tshirt_size":
          twimlResponse = await handleShirtSizeSelection(userInput, session);
          break;

        case "check_registration":
          twimlResponse = await handleCheckRegistration(userInput, session);
          break;

        default:
          twimlResponse = displayMainMenu(session);
      }
    }

    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);
  });

  function displayMainMenu(session) {
    session.state = "menu";
    const response = new MessagingResponse();
    response.message(
      "🏃‍♂️ Hi! Welcome to Mr Pace Online Registration\n" +
      "Please select an option:\n" +
      "1. Register for Heroes Marathon\n" +
      "2. Check Heroes Marathon status\n" +
      "3. Register for Unit Day Marathon\n" +
      "4. Check Unit Day Marathon status"
    );
    return response.toString();
  }

  function handleMenuOption(userInput, session) {
    const response = new MessagingResponse();
    
    switch (userInput) {
      case "1":
        session.marathon_type = "Heroes";
        session.race_id = "686bf47ed51b61751112a1bb";
        response.message("📏 Select race distance:\n1. 5KM\n2. 10KM\n3. 20KM");
        session.state = "select_race";
        break;
        
      case "2":
        session.marathon_type = "Heroes";
        response.message("🔍 Enter your ticket number:");
        session.state = "check_registration";
        break;
        
      case "3":
        session.marathon_type = "Unit";
        session.race_id = "68624b9501a1223dfa5c5127";
        response.message("📏 Select race distance:\n1. 5KM\n2. 10KM\n3. 20KM");
        session.state = "select_race";
        break;
        
      case "4":
        session.marathon_type = "Unit";
        response.message("🔍 Enter your ticket number:");
        session.state = "check_registration";
        break;
        
      default:
        response.message("❌ Invalid option. Please select 1-4");
    }
    
    return response.toString();
  }

  async function handleRaceSelection(userInput, session) {
    const response = new MessagingResponse();
    const distances = { "1": "5KM", "2": "10KM", "3": "20KM" };
    
    if (distances[userInput]) {
      try {
        // const race = await RaceService.getRaceById(session.race_id);
        session.race_distance = distances[userInput];
        session.registration_fee = "$20";
        
        response.message("👤 Please provide your full name:");
        session.state = "get_full_name";
      } catch (error) {
        console
        response.message("⚠️ Error fetching race details. Please try again later.");
      }
    } else {
      response.message("❌ Invalid selection. Choose 1, 2, or 3");
    }
    
    return response.toString();
  }

  function handleGenderSelection(userInput, session) {
    const response = new MessagingResponse();
    const genderOptions = { "1": "Male", "2": "Female", "3": "Other" };
    
    if (genderOptions[userInput]) {
      session.gender = genderOptions[userInput];
      response.message("🎂 Enter date of birth (DD/MM/YYYY):");
      session.state = "get_dob";
    } else {
      response.message("❌ Invalid selection. Choose 1, 2, or 3");
    }
    
    return response.toString();
  }

  async function handleShirtSizeSelection(userInput, session) {
    const response = new MessagingResponse();
    const sizeOptions = { "1": "Small", "2": "Medium", "3": "Large", "4": "XL" };
    
    if (sizeOptions[userInput]) {
      session.tshirt_size = sizeOptions[userInput];
      
      const names = session.full_name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const [day, month, year] = session.dob.split('/');
      const dobFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const registrationData = {
        firstName,
        lastName,
        race: session.race_id,
        raceName: `${session.marathon_type} Day Marathon`,
        racePrice: session.registration_fee,
        raceEvent: session.race_distance,
        dateOfBirth: dobFormatted,
        natonalID: session.national_id,
        Gender: session.gender,
        phoneNumber: session.phone_number,
        email: session.email,
        t_shirt_size: session.tshirt_size,
        venue: session.venue,
        date: session.date
      };

      try {
        const athlete = await registrationService.createRegistration(registrationData);
        const ticket_number = athlete.registration_number;

        response.message(
          `✅ Registration successful!\n` +
          `Ticket Number: ${ticket_number}\n` +
          `Name: ${session.full_name}\n` +
          `Race: ${session.race_distance}\n` +
          `Venue: ${session.venue}\n` +
          `Date: ${session.date}\n` +
          `Fee: $${session.registration_fee}\n\n` +
          `💳 To make payment:\nSend: PAY ${ticket_number} YOUR_ECOCASH_NUMBER\n` +
          `Example: PAY ${ticket_number} 0771234567`
        );
      } catch (error) {
        console.error("Registration error:", error);
        response.message("⚠️ Registration failed. Please try again later.");
      }
    } else {
      response.message("❌ Invalid size. Choose 1, 2, 3, or 4");
    }
    
    session.state = "start";
    return response.toString();
  }

  async function handleCheckRegistration(userInput, session) {
    const response = new MessagingResponse();
    
    if (!userInput.startsWith("T") || userInput.length !== 8) {
      response.message("❌ Invalid ticket format. Must start with 'T' followed by 7 digits");
      return response.toString();
    }

    try {
      const athlete = await registrationService.findByRegistrationNumber(userInput);
      
      if (!athlete) {
        response.message("🔍 Ticket not found. Please check your number");
        return response.toString();
      }
      
      if (athlete.paymentStatus === "paid") {
        response.message(
          `✅ Registration Confirmed!\n` +
          `Ticket: ${userInput}\n` +
          `Name: ${athlete.firstName} ${athlete.lastName}\n` +
          `Race: ${athlete.raceEvent}\n` +
          `Venue: ${athlete.venue}\n` +
          `Date: ${athlete.date}\n` +
          `Status: Paid`
        );
      } else {
        response.message(
          `⚠️ Registration Found - Payment Pending\n` +
          `Ticket: ${userInput}\n` +
          `Name: ${athlete.firstName} ${athlete.lastName}\n` +
          `Amount Due: $${athlete.racePrice}\n\n` +
          `💳 To pay: Send PAY ${userInput} YOUR_ECOCASH_NUMBER\n` +
          `Example: PAY ${userInput} ${athlete.phoneNumber}`
        );
      }
    } catch (error) {
      console.error("Check registration error:", error);
      response.message("⚠️ Service unavailable. Please try later");
    }
    
    session.state = "start";
    return response.toString();
  }
};