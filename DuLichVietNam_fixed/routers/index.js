var express = require('express');
var router = express.Router();

// GET: Trang chủ
router.get('/', async (req, res) => {
	res.render('index', {
		title: 'Trang chủ'
	});
});

// GET: Lỗi
router.get('/error', async (req, res) => {
	res.render('error', {
		title: 'Lỗi'
	});
});

// GET: Thành công
router.get('/success', async (req, res) => {
	res.render('success', {
		title: 'Hoàn thành'
	});
});

module.exports = router;
// GET: Tìm kiếm địa điểm
var DiaDiemModel = require('../models/sinhvien');
router.get('/timkiem', async (req, res) => {
  const tukhoa = req.query.tukhoa || '';
  try {
    const ketQua = tukhoa ? await DiaDiemModel.find({
      $or: [
        { tenDiaDiem: { $regex: tukhoa, $options: 'i' } },
        { moTa: { $regex: tukhoa, $options: 'i' } },
        { diaChi: { $regex: tukhoa, $options: 'i' } }
      ]
    }).populate('maTinhThanh').populate('maLoaiHinh') : [];
    res.render('timkiem', { title: 'Kết quả tìm kiếm: ' + tukhoa, ketQua, tukhoa });
  } catch (err) {
    res.render('timkiem', { title: 'Tìm kiếm', ketQua: [], tukhoa });
  }
});
