const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration_controller');

/**
 * @swagger
 * /api/v1/register/register:
 *   post:
 *     summary: Register a new athlete for a race
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, race, raceName, racePrice, raceEvent, dateOfBirth, Gender, phoneNumber, email, t_shirt_size]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               race:
 *                 type: string
 *                 example: "60d5ecb54b24a56f8c8d9e6a"
 *               raceName:
 *                 type: string
 *                 example: "Marathon 2024"
 *               racePrice:
 *                 type: number
 *                 example: 50
 *               raceEvent:
 *                 type: string
 *                 example: "10K"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               natonalID:
 *                 type: string
 *                 example: "ID123456789"
 *               Gender:
 *                 type: string
 *                 example: "Male"
 *               phoneNumber:
 *                 type: string
 *                 example: "0780897191"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               t_shirt_size:
 *                 type: string
 *                 example: "M"
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registration successful"
 *                 registration_number:
 *                   type: string
 *                   example: "MPR1234567890"
 *       400:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', registrationController.createRegistration);

/**
 * @swagger
 * /api/v1/register/pay/ecocash:
 *   post:
 *     summary: Initiate EcoCash payment for registration
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *           example:
 *             registration_number: "MPR1234567890"
 *             phoneNumber: "0780897191"
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment initiated"
 *                 pollUrl:
 *                   type: string
 *                   example: "https://www.paynow.co.zw/interface/poll/?guid=abc123"
 *                 registration_number:
 *                   type: string
 *                   example: "MPR1234567890"
 *       400:
 *         description: Payment already completed or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Registration not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Payment initiation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/pay/ecocash', registrationController.payByEcocash);

/**
 * @swagger
 * /api/v1/register/check-payment-status:
 *   post:
 *     summary: Check payment status using poll URL
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentStatusCheck'
 *           example:
 *             pollUrl: "https://www.paynow.co.zw/interface/poll/?guid=abc123"
 *     responses:
 *       200:
 *         description: Payment status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "paid"
 *                 message:
 *                   type: string
 *                   example: "Payment successful"
 *                 registration_number:
 *                   type: string
 *                   example: "MPR1234567890"
 *       404:
 *         description: Registration not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/check-payment-status', registrationController.checkPaymentStatus);

/**
 * @swagger
 * /api/v1/register/athletes:
 *   get:
 *     summary: Get all athlete registrations
 *     tags: [Registration]
 *     responses:
 *       200:
 *         description: List of all registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/athletes', registrationController.getAllRegistrations);

/**
 * @swagger
 * /api/v1/register/athletes/{id}:
 *   get:
 *     summary: Get athlete registration by ID
 *     tags: [Registration]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *         example: 60d5ecb54b24a56f8c8d9e6a
 *     responses:
 *       200:
 *         description: Registration details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       404:
 *         description: Registration not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/athletes/:id', registrationController.getRegistrationById);

/**
 * @swagger
 * /api/v1/register/athletes/{id}:
 *   put:
 *     summary: Update athlete registration
 *     tags: [Registration]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *         example: 60d5ecb54b24a56f8c8d9e6a
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               phoneNumber:
 *                 type: string
 *                 example: "+263771234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.smith@example.com"
 *               t_shirt_size:
 *                 type: string
 *                 example: "L"
 *               paymentStatus:
 *                 type: string
 *                 enum: [paid, pending, failed, unpaid]
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: Registration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       404:
 *         description: Registration not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/athletes/:id', registrationController.updateRegistration);

/**
 * @swagger
 * /api/v1/register/athletes/{id}:
 *   delete:
 *     summary: Delete athlete registration
 *     tags: [Registration]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *         example: 60d5ecb54b24a56f8c8d9e6a
 *     responses:
 *       200:
 *         description: Registration deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration deleted successfully"
 *       404:
 *         description: Registration not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/athletes/:id', registrationController.deleteRegistration);

module.exports = router;