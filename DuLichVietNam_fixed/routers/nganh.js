const express = require('express');
const router = express.Router();
const LoaiHinhModel = require('../models/nganh');
const VungMienModel = require('../models/khoa');

// GET: Danh sách loại hình
router.get('/', async (req, res) => {
  try {
    const dsLoaiHinh = await LoaiHinhModel.getAll();
    const dsVungMien = await VungMienModel.find();
    res.render('nganh', { title: 'Quản lý Loại hình du lịch', dsLoaiHinh, dsVungMien });
  } catch (err) {
    res.status(500).send('Lỗi: ' + err.message);
  }
});

// GET: Form thêm
router.get('/them', async (req, res) => {
  const dsVungMien = await VungMienModel.find();
  res.render('nganh_them', { title: 'Thêm loại hình', dsVungMien });
});

// POST: Thêm
router.post('/them', async (req, res) => {
  try {
    await LoaiHinhModel.addOne(req.body.TenLoaiHinh, req.body.maVungMien);
    req.session.success = 'Đã thêm loại hình du lịch';
    res.redirect('/nganh');
  } catch (err) {
    req.session.error = 'Lỗi khi thêm: ' + err.message;
    res.redirect('/nganh/them');
  }
});

// GET: Form sửa
router.get('/sua/:id', async (req, res) => {
  try {
    const loaiHinh = await LoaiHinhModel.getById(req.params.id);
    const dsVungMien = await VungMienModel.find();
    res.render('nganh_sua', { title: 'Sửa loại hình', loaiHinh, dsVungMien });
  } catch (err) {
    res.redirect('/nganh');
  }
});

// POST: Sửa
router.post('/sua/:id', async (req, res) => {
  try {
    await LoaiHinhModel.update(req.params.id, req.body.TenLoaiHinh, req.body.maVungMien);
    req.session.success = 'Đã cập nhật loại hình du lịch';
    res.redirect('/nganh');
  } catch (err) {
    req.session.error = 'Lỗi khi sửa: ' + err.message;
    res.redirect('/nganh');
  }
});

// GET: Xóa
router.get('/xoa/:id', async (req, res) => {
  try {
    await LoaiHinhModel.delete(req.params.id);
    req.session.success = 'Đã xóa loại hình';
    res.redirect('/nganh');
  } catch (err) {
    req.session.error = 'Lỗi khi xóa';
    res.redirect('/nganh');
  }
});

module.exports = router;
