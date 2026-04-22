// routers/hosocanhan.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const TaiKhoan = require('../models/taikhoan');

// Middleware kiểm tra đăng nhập
function isAuthenticated(req, res, next) {
  if (req.session.MaNguoiDung) {
    next();
  } else {
    req.session.error = 'Bạn cần đăng nhập để truy cập trang này.';
    res.redirect('/dangnhap');
  }
}

// GET: Hiển thị hồ sơ cá nhân
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await TaiKhoan.findById(req.session.MaNguoiDung);
    if (!user) {
      req.session.error = 'Không tìm thấy người dùng.';
      return res.redirect('/dangnhap');
    }
    res.render('hosocanhan', { title: 'Hồ sơ cá nhân', user, error: null, success: null });
  } catch (err) {
    res.status(500).send('Lỗi hệ thống');
  }
});

// POST: Cập nhật hồ sơ cá nhân
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { HoVaTen, Email, HinhAnh } = req.body;
    const user = await TaiKhoan.findById(req.session.MaNguoiDung);
    if (!user) {
      req.session.error = 'Không tìm thấy người dùng.';
      return res.redirect('/dangnhap');
    }

    user.HoVaTen = HoVaTen;
    user.Email = Email;
    user.HinhAnh = HinhAnh;

    await user.save();
    res.render('hosocanhan', { title: 'Hồ sơ cá nhân', user, success: 'Cập nhật thành công', error: null });
  } catch (error) {
    res.render('hosocanhan', { title: 'Hồ sơ cá nhân', user: req.body, error: 'Cập nhật thất bại', success: null });
  }
});

// GET: Trang đổi mật khẩu
router.get('/doimatkhau', isAuthenticated, (req, res) => {
  res.render('doimatkhau', { title: 'Đổi mật khẩu', error: null, success: null });
});

// POST: Xử lý đổi mật khẩu
router.post('/doimatkhau', isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.render('doimatkhau', { title: 'Đổi mật khẩu', error: 'Mật khẩu xác nhận không khớp', success: null });
    }

    const user = await TaiKhoan.findById(req.session.MaNguoiDung);
    if (!user) {
      req.session.error = 'Không tìm thấy người dùng.';
      return res.redirect('/dangnhap');
    }

    const match = bcrypt.compareSync(currentPassword, user.MatKhau);
    if (!match) {
      return res.render('doimatkhau', { title: 'Đổi mật khẩu', error: 'Mật khẩu hiện tại không đúng', success: null });
    }

    const salt = bcrypt.genSaltSync(10);
    user.MatKhau = bcrypt.hashSync(newPassword, salt);
    await user.save();

    res.render('doimatkhau', { title: 'Đổi mật khẩu', error: null, success: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.render('doimatkhau', { title: 'Đổi mật khẩu', error: 'Lỗi hệ thống', success: null });
  }
});

module.exports = router;
