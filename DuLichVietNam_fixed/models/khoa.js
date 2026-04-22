const mongoose = require('mongoose');

const VungMienSchema = new mongoose.Schema({
  TenVungMien: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  MoTa: { type: String }
});

module.exports = mongoose.model('VungMien', VungMienSchema);
