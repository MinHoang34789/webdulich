const express = require('express');
const router = express.Router();
const DiaDiemModel = require('../models/sinhvien');
const VungMienModel = require('../models/khoa');
const LoaiHinhModel = require('../models/nganh');
const TinhThanhModel = require('../models/lop');

// GET: Danh sách địa điểm du lịch
router.get('/', async (req, res) => {
  try {
    const { maVungMien, maLoaiHinh, maTinhThanh } = req.query;
    const dsVungMien = await VungMienModel.find();
    const dsLoaiHinh = maVungMien ? await LoaiHinhModel.getByVungMien(maVungMien) : [];
    const dsTinhThanh = maLoaiHinh ? await TinhThanhModel.find({ maLoaiHinh }) : [];

    let dsDiaDiem = [];
    if (maVungMien && maLoaiHinh && maTinhThanh) {
      dsDiaDiem = await DiaDiemModel.find({ maTinhThanh })
        .populate('maLoaiHinh')
        .populate('maTinhThanh');
    }

    res.render('sinhvien', {
      title: 'Danh sách Địa điểm du lịch',
      dsDiaDiem, dsVungMien, dsLoaiHinh, dsTinhThanh,
      maVungMienDaChon: maVungMien || '',
      maLoaiHinhDaChon: maLoaiHinh || '',
      maTinhThanhDaChon: maTinhThanh || ''
    });
  } catch (err) {
    res.status(500).send('Lỗi: ' + err.message);
  }
});

// GET: Form thêm địa điểm
router.get('/them', async (req, res) => {
  try {
    const { maTinhThanh } = req.query;
    const dsVungMien = await VungMienModel.find();
    let tinhThanh = null;
    let dsLoaiHinh = [];
    let dsTinhThanh = [];
    if (maTinhThanh) {
      tinhThanh = await TinhThanhModel.findById(maTinhThanh)
        .populate({ path: 'maLoaiHinh', populate: { path: 'maVungMien' } });
      if (tinhThanh && tinhThanh.maLoaiHinh) {
        dsLoaiHinh = await LoaiHinhModel.getByVungMien(tinhThanh.maLoaiHinh.maVungMien);
        dsTinhThanh = await TinhThanhModel.find({ maLoaiHinh: tinhThanh.maLoaiHinh._id });
      }
    }
    res.render('sinhvien_them', {
      title: 'Thêm địa điểm du lịch',
      dsVungMien, dsLoaiHinh, dsTinhThanh, tinhThanh, maTinhThanh: maTinhThanh || ''
    });
  } catch (err) {
    res.status(500).send('Lỗi: ' + err.message);
  }
});

// POST: Xử lý thêm
router.post('/them', async (req, res) => {
  try {
    const { maDiaDiem, tenDiaDiem, moTa, diaChi, gioMoCua, giaVe, hinhAnh, kinhDo, viDo, maLoaiHinh, maTinhThanh } = req.body;
    await DiaDiemModel.create({ maDiaDiem, tenDiaDiem, moTa, diaChi, gioMoCua, giaVe, hinhAnh, kinhDo, viDo, maLoaiHinh, maTinhThanh });
    const tinhThanh = await TinhThanhModel.findById(maTinhThanh)
      .populate({ path: 'maLoaiHinh', populate: { path: 'maVungMien' } });
    const loaiHinh = tinhThanh?.maLoaiHinh;
    const vungMien = loaiHinh?.maVungMien;
    res.redirect(`/sinhvien?maVungMien=${vungMien?._id || ''}&maLoaiHinh=${loaiHinh?._id || ''}&maTinhThanh=${maTinhThanh}`);
  } catch (err) {
    res.status(500).send('Lỗi khi thêm: ' + err.message);
  }
});

// GET: Form sửa
router.get('/sua/:id', async (req, res) => {
  try {
    const diaDiem = await DiaDiemModel.findById(req.params.id)
      .populate({ path: 'maTinhThanh', populate: { path: 'maLoaiHinh', populate: { path: 'maVungMien' } } });
    if (!diaDiem) return res.redirect('/sinhvien');
    const dsVungMien = await VungMienModel.find();
    const maVungMienId = diaDiem.maTinhThanh?.maLoaiHinh?.maVungMien?._id || diaDiem.maTinhThanh?.maLoaiHinh?.maVungMien;
    const dsLoaiHinh = maVungMienId ? await LoaiHinhModel.getByVungMien(maVungMienId) : [];
    const maLoaiHinhId = diaDiem.maTinhThanh?.maLoaiHinh?._id;
    const dsTinhThanh = maLoaiHinhId ? await TinhThanhModel.find({ maLoaiHinh: maLoaiHinhId }) : [];
    res.render('sinhvien_sua', {
      title: 'Sửa địa điểm du lịch',
      diaDiem, dsVungMien, dsLoaiHinh, dsTinhThanh, error: null
    });
  } catch (err) {
    res.status(500).send('Lỗi: ' + err.message);
  }
});

// POST: Xử lý sửa
router.post('/sua/:id', async (req, res) => {
  try {
    await DiaDiemModel.findByIdAndUpdate(req.params.id, {
      maDiaDiem: req.body.maDiaDiem,
      tenDiaDiem: req.body.tenDiaDiem,
      moTa: req.body.moTa,
      diaChi: req.body.diaChi,
      gioMoCua: req.body.gioMoCua,
      giaVe: req.body.giaVe,
      hinhAnh: req.body.hinhAnh,
      kinhDo: req.body.kinhDo,
      viDo: req.body.viDo,
      maTinhThanh: req.body.maTinhThanh,
      maLoaiHinh: req.body.maLoaiHinh
    });
    const tinhThanh = await TinhThanhModel.findById(req.body.maTinhThanh)
      .populate({ path: 'maLoaiHinh', populate: { path: 'maVungMien' } });
    const loaiHinh = tinhThanh?.maLoaiHinh;
    const vungMien = loaiHinh?.maVungMien;
    res.redirect(`/sinhvien?maVungMien=${vungMien?._id || ''}&maLoaiHinh=${loaiHinh?._id || ''}&maTinhThanh=${req.body.maTinhThanh}`);
  } catch (err) {
    res.status(500).send('Lỗi khi sửa: ' + err.message);
  }
});

// GET: Xóa
router.get('/xoa/:id', async (req, res) => {
  try {
    await DiaDiemModel.findByIdAndDelete(req.params.id);
    res.redirect('/sinhvien');
  } catch (err) {
    res.status(500).send('Lỗi khi xóa');
  }
});

// GET: Chi tiết địa điểm
router.get('/chitiet/:id', async (req, res) => {
  try {
    const diaDiem = await DiaDiemModel.findById(req.params.id)
      .populate({ path: 'maTinhThanh', populate: { path: 'maLoaiHinh', populate: { path: 'maVungMien' } } })
      .populate('maLoaiHinh');
    if (!diaDiem) return res.redirect('/sinhvien');
    res.render('chitiet', { title: diaDiem.tenDiaDiem, diaDiem });
  } catch (err) {
    res.redirect('/sinhvien');
  }
});

// API: Lấy loại hình theo vùng miền
router.get('/api/loaihinh/:maVungMien', async (req, res) => {
  try {
    const ds = await LoaiHinhModel.getByVungMien(req.params.maVungMien);
    res.json(ds);
  } catch (err) {
    res.json([]);
  }
});

// API: Lấy tỉnh/thành theo loại hình
router.get('/api/tinhthanh/:maLoaiHinh', async (req, res) => {
  try {
    const ds = await TinhThanhModel.find({ maLoaiHinh: req.params.maLoaiHinh });
    res.json(ds);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
