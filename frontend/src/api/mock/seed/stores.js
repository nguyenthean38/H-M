/**
 * Hệ thống cửa hàng (hư cấu, địa chỉ theo đơn vị hành chính sau sáp nhập 2025).
 * Toạ độ gần đúng để hiển thị trên bản đồ.
 */
const WEEK = [
  { days: 'Thứ Hai – Thứ Sáu', open: '09:00', close: '22:00' },
  { days: 'Thứ Bảy – Chủ Nhật', open: '08:30', close: '22:30' },
]
const MALL = [
  { days: 'Thứ Hai – Thứ Sáu', open: '10:00', close: '22:00' },
  { days: 'Thứ Bảy – Chủ Nhật', open: '09:30', close: '22:00' },
]

export const stores = [
  {
    id: 'st_hn_trangtien', slug: 'nep-trang-tien', name: 'Nếp Tràng Tiền', city: 'Hà Nội', province: 'ha-noi',
    address: '26 Tràng Tiền', ward: 'Phường Hoàn Kiếm', lat: 21.0246, lng: 105.8553, phone: '024 3936 2626',
    departments: ['nu', 'nam', 'tre-em', 'nha'], services: ['Thu gom quần áo cũ', 'Sửa đồ lấy ngay', 'Phòng thử rộng'], hours: WEEK, flagship: true,
  },
  {
    id: 'st_hn_phohue', slug: 'nep-pho-hue', name: 'Nếp Phố Huế', city: 'Hà Nội', province: 'ha-noi',
    address: '102 Phố Huế', ward: 'Phường Hai Bà Trưng', lat: 21.0128, lng: 105.8512, phone: '024 3944 1020',
    departments: ['nu', 'nam', 'lam-dep'], services: ['Thu gom quần áo cũ', 'Nhận hàng đặt online'], hours: WEEK,
  },
  {
    id: 'st_hn_caugiay', slug: 'nep-cau-giay', name: 'Nếp Cầu Giấy', city: 'Hà Nội', province: 'ha-noi',
    address: '241 Xuân Thủy', ward: 'Phường Cầu Giấy', lat: 21.0369, lng: 105.7836, phone: '024 3767 2410',
    departments: ['nu', 'nam', 'tre-em'], services: ['Nhận hàng đặt online', 'Ưu đãi sinh viên'], hours: MALL,
  },
  {
    id: 'st_hn_tayho', slug: 'nep-tay-ho', name: 'Nếp Tây Hồ', city: 'Hà Nội', province: 'ha-noi',
    address: '18 Quảng An', ward: 'Phường Tây Hồ', lat: 21.0632, lng: 105.8262, phone: '024 3718 1818',
    departments: ['nu', 'nha', 'lam-dep'], services: ['Workshop nhuộm chàm cuối tuần', 'Thu gom quần áo cũ'], hours: WEEK,
  },
  {
    id: 'st_hcm_dongkhoi', slug: 'nep-dong-khoi', name: 'Nếp Đồng Khởi', city: 'TP. Hồ Chí Minh', province: 'ho-chi-minh',
    address: '85 Đồng Khởi', ward: 'Phường Sài Gòn', lat: 10.7757, lng: 106.7034, phone: '028 3822 8585',
    departments: ['nu', 'nam', 'tre-em', 'nha', 'lam-dep'], services: ['Thu gom quần áo cũ', 'Sửa đồ lấy ngay', 'Tư vấn phối đồ'], hours: WEEK, flagship: true,
  },
  {
    id: 'st_hcm_nguyentrai', slug: 'nep-nguyen-trai', name: 'Nếp Nguyễn Trãi', city: 'TP. Hồ Chí Minh', province: 'ho-chi-minh',
    address: '210 Nguyễn Trãi', ward: 'Phường Bến Thành', lat: 10.7684, lng: 106.6889, phone: '028 3925 2100',
    departments: ['nu', 'nam'], services: ['Nhận hàng đặt online', 'Ưu đãi sinh viên'], hours: WEEK,
  },
  {
    id: 'st_hcm_thaodien', slug: 'nep-thao-dien', name: 'Nếp Thảo Điền', city: 'TP. Hồ Chí Minh', province: 'ho-chi-minh',
    address: '12 Quốc Hương', ward: 'Phường An Khánh', lat: 10.8041, lng: 106.7331, phone: '028 3744 1212',
    departments: ['nu', 'tre-em', 'nha'], services: ['Workshop nhuộm chàm cuối tuần', 'Thu gom quần áo cũ'], hours: WEEK,
  },
  {
    id: 'st_hcm_phunhuan', slug: 'nep-phan-xich-long', name: 'Nếp Phan Xích Long', city: 'TP. Hồ Chí Minh', province: 'ho-chi-minh',
    address: '168 Phan Xích Long', ward: 'Phường Cầu Kiệu', lat: 10.8003, lng: 106.6878, phone: '028 3517 1680',
    departments: ['nu', 'nam', 'lam-dep'], services: ['Nhận hàng đặt online'], hours: WEEK,
  },
  {
    id: 'st_hcm_phumyhung', slug: 'nep-phu-my-hung', name: 'Nếp Phú Mỹ Hưng', city: 'TP. Hồ Chí Minh', province: 'ho-chi-minh',
    address: '45 Nguyễn Đức Cảnh', ward: 'Phường Tân Mỹ', lat: 10.7291, lng: 106.7092, phone: '028 5412 4545',
    departments: ['nu', 'nam', 'tre-em', 'nha'], services: ['Thu gom quần áo cũ', 'Phòng thử rộng', 'Khu vui chơi trẻ em'], hours: MALL,
  },
  {
    id: 'st_dn_bachdang', slug: 'nep-bach-dang', name: 'Nếp Bạch Đằng', city: 'Đà Nẵng', province: 'da-nang',
    address: '120 Bạch Đằng', ward: 'Phường Hải Châu', lat: 16.0702, lng: 108.2241, phone: '0236 382 1200',
    departments: ['nu', 'nam', 'tre-em', 'lam-dep'], services: ['Thu gom quần áo cũ', 'Nhận hàng đặt online'], hours: WEEK,
  },
  {
    id: 'st_hp_caudat', slug: 'nep-cau-dat', name: 'Nếp Cầu Đất', city: 'Hải Phòng', province: 'hai-phong',
    address: '55 Cầu Đất', ward: 'Phường Ngô Quyền', lat: 20.8588, lng: 106.6829, phone: '0225 374 5555',
    departments: ['nu', 'nam'], services: ['Nhận hàng đặt online'], hours: WEEK,
  },
  {
    id: 'st_hue_leloi', slug: 'nep-le-loi-hue', name: 'Nếp Lê Lợi', city: 'Huế', province: 'hue',
    address: '15 Lê Lợi', ward: 'Phường Thuận Hóa', lat: 16.4628, lng: 107.5902, phone: '0234 382 1515',
    departments: ['nu', 'nam', 'nha'], services: ['Workshop nhuộm chàm cuối tuần'], hours: WEEK,
  },
  {
    id: 'st_kh_tranphu', slug: 'nep-tran-phu-nha-trang', name: 'Nếp Trần Phú', city: 'Nha Trang', province: 'khanh-hoa',
    address: '60 Trần Phú', ward: 'Phường Nha Trang', lat: 12.2421, lng: 109.1962, phone: '0258 352 6060',
    departments: ['nu', 'nam', 'tre-em'], services: ['Nhận hàng đặt online'], hours: WEEK,
  },
  {
    id: 'st_ct_ninhkieu', slug: 'nep-ninh-kieu', name: 'Nếp Ninh Kiều', city: 'Cần Thơ', province: 'can-tho',
    address: '32 Hai Bà Trưng', ward: 'Phường Ninh Kiều', lat: 10.0339, lng: 105.7878, phone: '0292 381 3232',
    departments: ['nu', 'nam', 'tre-em'], services: ['Thu gom quần áo cũ', 'Nhận hàng đặt online'], hours: WEEK,
  },
]
