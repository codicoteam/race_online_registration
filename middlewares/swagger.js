const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Race Registration API',
      version: '1.0.0',
      description: 'API for managing races and athlete registrations',
    },
    servers: [
      { url: 'http://localhost:5050', description: 'Development server' },
    ],
    components: {
      schemas: {
        // Existing schemas
        Race: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            Image: { type: 'string' },
            registrationPrice: { type: 'string' },
            venue: { type: 'string' },
            RegistrationStatus: { 
              type: 'string',
              enum: ['Open', 'Closed', 'Postponed'] 
            },
            date: { type: 'string' },
            raceEvents: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Athlete: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            race: { type: 'string', format: 'objectId' },
            raceName: { type: 'string' },
            racePrice: { type: 'number' },
            raceEvent: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            natonalID: { type: 'string' },
            pollUrl: { type: 'string' },
            paymentStatus: { 
              type: 'string',
              enum: ['paid', 'pending', 'failed', 'unpaid'] 
            },
            Gender: { type: 'string' },
            phoneNumber: { type: 'string' },
            email: { type: 'string', format: 'email' },  // Added email field
            t_shirt_size: { type: 'string' }
          }
        },
        
        // NEW: Added missing schemas
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error description' },
            details: { type: 'string', example: 'Additional error details' }
          }
        },
        PaymentRequest: {
          type: 'object',
          required: ['registration_number', 'phoneNumber'],
          properties: {
            registration_number: { type: 'string' },
            phoneNumber: { type: 'string' }
          }
        },
        PaymentStatusCheck: {
          type: 'object',
          required: ['pollUrl'],
          properties: {
            pollUrl: { type: 'string' }
          }
        },
        Registration: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            race: { type: 'string', format: 'objectId' },
            raceName: { type: 'string' },
            racePrice: { type: 'number' },
            raceEvent: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            natonalID: { type: 'string' },
            pollUrl: { type: 'string' },
            paymentStatus: { 
              type: 'string',
              enum: ['paid', 'pending', 'failed', 'unpaid'] 
            },
            Gender: { type: 'string' },
            phoneNumber: { type: 'string' },
            email: { type: 'string', format: 'email' },  // Added email field
            t_shirt_size: { type: 'string' },
            registration_number: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./router/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;