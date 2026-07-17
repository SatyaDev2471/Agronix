const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  entry_id: { type: Number, required: true, unique: true },
  created_at: { type: Date, required: true },
  field1: { type: String }, // Moisture
  field2: { type: String }, // Temperature
  field3: { type: String }, // Humidity
  field4: { type: String }, // Rain
  field5: { type: String }, // pH
  field6: { type: String }, // N
  field7: { type: String }, // P
  field8: { type: String }  // K
}, { timestamps: true });

// Index created_at for fast querying of historical trends
sensorDataSchema.index({ created_at: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);
