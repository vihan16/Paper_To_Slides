import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { Presentation } from './models/Presentation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-presentation-db';
mongoose.connect(MONGODB_URI)
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
   },
});
const upload = multer({ storage });

// API Route to process document
app.post('/api/process', upload.single('document'), async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({ error: 'No file uploaded' });
      }

      const { theme, slide_length } = req.body;
      const filePath = path.resolve(req.file.path);

      console.log(`Processing file: ${req.file.originalname} | Theme: ${theme} | Length: ${slide_length}`);

      // Create DB Record Pending
      const presentationRecord = new Presentation({
         originalFileName: req.file.originalname,
         theme: theme || 'Corporate',
         slideLength: slide_length || 'Medium',
         status: 'pending'
      });
      await presentationRecord.save();

      // Call Python AI Engine
      const pythonEngineUrl = process.env.PYTHON_ENGINE_URL || 'http://localhost:8000';

      // Instead of sending the heavy file over HTTP again, we just send the absolute path
      // since both servers run on the same machine/volume for this project.
      const params = new URLSearchParams();
      params.append('file_path', filePath);
      params.append('theme', theme || 'Corporate');
      params.append('slide_length', slide_length || 'Medium');

      const engineResponse = await axios.post(`${pythonEngineUrl}/generate`, params);

      // Update DB record on success
      presentationRecord.status = 'completed';
      presentationRecord.slideCount = engineResponse.data.slide_count;
      presentationRecord.fileUrl = engineResponse.data.file_url;
      await presentationRecord.save();

      res.json(engineResponse.data);

   } catch (error) {
      console.error("Error communicating with AI Engine:", error.message);
      res.status(500).json({ error: 'Failed to generate presentation', details: error.message });
   }
});

// Download Route
app.get('/api/download', (req, res) => {
   const filePath = req.query.path;
   if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
   }
   res.download(filePath);
});

// Start Server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
