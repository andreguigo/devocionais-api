import mongoose from 'mongoose';

const TextSchema = new mongoose.Schema({
  txt: String
}, { _id: false });

const MoodMapSchema = new mongoose.Schema({
  moods: {
    type: Map,
    of: [TextSchema] 
  }
}, { _id: false });

const DevotionalSchema = new mongoose.Schema({
  themes: {
    type: Map,
    of: [MoodMapSchema]
  },
  data: { type: Date, default: Date.now }
});

const devotional = mongoose.model('Devotional', DevotionalSchema);

export default devotional;