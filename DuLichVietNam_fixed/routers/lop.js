const express = require('express');
const router = express.Router();
const TinhThanhModel = require('../models/lop');
const LoaiHinhModel = require('../models/nganh');
const VungMienModel = require('../models/khoa');

// GET: Danh sách tỉnh/thành
router.get('/', async (req, res) => {
  try {
    const { maVungMien, maLoaiHinh } = req.query;
    const dsVungMien = await VungMienModel.find();
    const dsLoaiHinh = maVungMien ? await LoaiHinhModel.getByVungMien(maVungMien) : [];
    const dsTinhThanh = maLoaiHinh ? await TinhThanhModel.find({ maLoaiHinh }).populate('maLoaiHinh') : [];

    res.render('lop', {
      title: 'Quản lý Tỉnh/Thành phố',
      dsTinhThanh, dsVungMien, dsLoaiHinh,
      maVungMienDaChon: maVungMien || '',
      maLoaiHinhDaChon: maLoaiHinh || ''
    });
  } catch (err) {
    res.status(500).send('Lỗi: ' + err.message);
  }
});

// GET: Form thêm
router.get('/them', async (req, res) => {
  const dsVungMien = await VungMienModel.find();
  res.render('lop_them', { title: 'Thêm tỉnh/thành', dsVungMien, dsLoaiHinh: [] });
});

// POST: Thêm
router.post('/them', async (req, res) => {
  try {
    await TinhThanhModel.create({ TenTinhThanh: req.body.TenTinhThanh, maLoaiHinh: req.body.maLoaiHinh });
    req.session.success = 'Đã thêm tỉnh/thành phố';
    res.redirect('/lop');
  } catch (err) {
    req.session.error = 'Lỗi khi thêm: ' + err.message;
    res.redirect('/lop/them');
  }
});

// GET: Form sửa
router.get('/sua/:id', async (req, res) => {
  try {
    const tinhThanh = await TinhThanhModel.findById(req.params.id).populate('maLoaiHinh');
    const dsVungMien = await VungMienModel.find();
    const dsLoaiHinh = await LoaiHinhModel.getByVungMien(tinhThanh.maLoaiHinh.maVungMien);
    res.render('lop_sua', { title: 'Sửa tỉnh/thành', tinhThanh, dsVungMien, dsLoaiHinh });
  } catch (err) {
    res.redirect('/lop');
  }
});

// POST: Sửa
router.post('/sua/:id', async (req, res) => {
  try {
    await TinhThanhModel.findByIdAndUpdate(req.params.id, {
      TenTinhThanh: req.body.TenTinhThanh,
      maLoaiHinh: req.body.maLoaiHinh
    });
    req.session.success = 'Đã cập nhật tỉnh/thành phố';
    res.redirect('/lop');
  } catch (err) {
    req.session.error = 'Lỗi khi sửa';
    res.redirect('/lop');
  }
});

// GET: Xóa
router.get('/xoa/:id', async (req, res) => {
  try {
    await TinhThanhModel.findByIdAndDelete(req.params.id);
    req.session.success = 'Đã xóa tỉnh/thành';
    res.redirect('/lop');
  } catch (err) {
    req.session.error = 'Lỗi khi xóa';
    res.redirect('/lop');
  }
});

// API: Lấy loại hình theo vùng miền (cho AJAX)
router.get('/api/loaihinh/:maVungMien', async (req, res) => {
  try {
    const ds = await LoaiHinhModel.getByVungMien(req.params.maVungMien);
    res.json(ds);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
