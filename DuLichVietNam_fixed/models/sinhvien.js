const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diaDiemSchema = new Schema({
  maDiaDiem: { type: String, required: true, unique: true },
  tenDiaDiem: { type: String, required: true },
  moTa: { type: String },
  diaChi: { type: String },
  gioMoCua: { type: String },
  giaVe: { type: String },
  hinhAnh: { type: String },
  kinhDo: { type: Number },
  viDo: { type: Number },
  maLoaiHinh: { type: Schema.Types.ObjectId, ref: 'LoaiHinh', required: true },
  maTinhThanh: { type: Schema.Types.ObjectId, ref: 'TinhThanh', required: true }
});

const DiaDiem = mongoose.model('DiaDiem', diaDiemSchema);

module.exports = DiaDiem;
