const express = require('express');
const router = express.Router();
const VungMienModel = require('../models/khoa');

// GET: Danh sách vùng miền
router.get('/', async (req, res) => {
  try {
    const dsVungMien = await VungMienModel.find();
    res.render('khoa', { title: 'Quản lý Vùng miền', dsVungMien, message: res.locals.message });
  } catch (err) {
    res.status(500).send('Lỗi: ' + err.message);
  }
});

// GET: Form thêm
router.get('/them', (req, res) => {
  res.render('khoa_them', { title: 'Thêm vùng miền' });
});

// POST: Thêm
router.post('/them', async (req, res) => {
  try {
    await VungMienModel.create({ TenVungMien: req.body.TenVungMien, MoTa: req.body.MoTa });
    req.session.success = 'Đã thêm vùng miền thành công';
    res.redirect('/khoa');
  } catch (err) {
    req.session.error = 'Lỗi khi thêm: ' + err.message;
    res.redirect('/khoa/them');
  }
});

// GET: Form sửa
router.get('/sua/:id', async (req, res) => {
  try {
    const vungMien = await VungMienModel.findById(req.params.id);
    res.render('khoa_sua', { title: 'Sửa vùng miền', vungMien });
  } catch (err) {
    res.redirect('/khoa');
  }
});

// POST: Sửa
router.post('/sua/:id', async (req, res) => {
  try {
    await VungMienModel.findByIdAndUpdate(req.params.id, { TenVungMien: req.body.TenVungMien, MoTa: req.body.MoTa });
    req.session.success = 'Đã cập nhật vùng miền';
    res.redirect('/khoa');
  } catch (err) {
    req.session.error = 'Lỗi khi sửa: ' + err.message;
    res.redirect('/khoa');
  }
});

// GET: Xóa
router.get('/xoa/:id', async (req, res) => {
  try {
    await VungMienModel.findByIdAndDelete(req.params.id);
    req.session.success = 'Đã xóa vùng miền';
    res.redirect('/khoa');
  } catch (err) {
    req.session.error = 'Lỗi khi xóa';
    res.redirect('/khoa');
  }
});

module.exports = router;
