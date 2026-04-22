const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tinhThanhSchema = new Schema({
  TenTinhThanh: { type: String, required: true },
  maLoaiHinh: { type: Schema.Types.ObjectId, ref: 'LoaiHinh', required: true }
});

const TinhThanh = mongoose.model('TinhThanh', tinhThanhSchema);

module.exports = TinhThanh;
