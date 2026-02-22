import mongoose from 'mongoose';

const presentationSchema = new mongoose.Schema({
   originalFileName: { type: String, required: true },
   theme: { type: String, required: true },
   slideLength: { type: String, required: true },
   slideCount: { type: Number, default: 0 },
   fileUrl: { type: String },
   status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
   createdAt: { type: Date, default: Date.now }
});

export const Presentation = mongoose.model('Presentation', presentationSchema);
