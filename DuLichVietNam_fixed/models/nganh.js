const mongoose = require('mongoose');

const loaiHinhSchema = new mongoose.Schema({
  TenLoaiHinh: { type: String, required: true },
  maVungMien: { type: mongoose.Schema.Types.ObjectId, ref: 'VungMien', required: true }
});

const LoaiHinh = mongoose.model('LoaiHinh', loaiHinhSchema);

module.exports.addOne = async (tenLoaiHinh, vungMienId) => {
  const lh = new LoaiHinh({ TenLoaiHinh: tenLoaiHinh, maVungMien: vungMienId });
  return await lh.save();
};
module.exports.getByVungMien = async (vungMienId) => {
  return await LoaiHinh.find({ maVungMien: vungMienId }).populate('maVungMien');
};
module.exports.getById = async (id) => {
  return await LoaiHinh.findById(id).populate('maVungMien');
};
module.exports.update = async (id, tenLoaiHinh, vungMienId) => {
  return await LoaiHinh.findByIdAndUpdate(id, { TenLoaiHinh: tenLoaiHinh, maVungMien: vungMienId }, { new: true });
};
module.exports.delete = async (id) => {
  return await LoaiHinh.findByIdAndDelete(id);
};
module.exports.getAll = async () => {
  return await LoaiHinh.find().populate('maVungMien');
};
module.exports.model = LoaiHinh;
