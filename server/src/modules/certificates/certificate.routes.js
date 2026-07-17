import express from 'express';
import { getMyCertificates, getCertificateBySerial } from './certificate.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyCertificates);
router.get('/:serial', protect, getCertificateBySerial);

export default router;
