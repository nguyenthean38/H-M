/**
 * 34 đơn vị hành chính cấp tỉnh (áp dụng từ 01/7/2025): 6 thành phố trực thuộc trung ương + 28 tỉnh.
 * `days`: thời gian giao tiêu chuẩn ước tính (ngày làm việc) từ kho Hà Nội / TP.HCM.
 * `express`: có hỗ trợ giao trong ngày và hoả tốc 2 giờ.
 */
export const provinces = [
  { code: 'ha-noi', name: 'Hà Nội', region: 'bac', days: [1, 2], express: true },
  { code: 'hai-phong', name: 'Hải Phòng', region: 'bac', days: [1, 3] },
  { code: 'quang-ninh', name: 'Quảng Ninh', region: 'bac', days: [2, 3] },
  { code: 'bac-ninh', name: 'Bắc Ninh', region: 'bac', days: [1, 2] },
  { code: 'hung-yen', name: 'Hưng Yên', region: 'bac', days: [1, 3] },
  { code: 'ninh-binh', name: 'Ninh Bình', region: 'bac', days: [2, 3] },
  { code: 'phu-tho', name: 'Phú Thọ', region: 'bac', days: [2, 3] },
  { code: 'thai-nguyen', name: 'Thái Nguyên', region: 'bac', days: [2, 3] },
  { code: 'tuyen-quang', name: 'Tuyên Quang', region: 'bac', days: [2, 4] },
  { code: 'lao-cai', name: 'Lào Cai', region: 'bac', days: [3, 4] },
  { code: 'lang-son', name: 'Lạng Sơn', region: 'bac', days: [2, 4] },
  { code: 'cao-bang', name: 'Cao Bằng', region: 'bac', days: [3, 5] },
  { code: 'son-la', name: 'Sơn La', region: 'bac', days: [3, 5] },
  { code: 'dien-bien', name: 'Điện Biên', region: 'bac', days: [3, 5] },
  { code: 'lai-chau', name: 'Lai Châu', region: 'bac', days: [3, 5] },
  { code: 'thanh-hoa', name: 'Thanh Hóa', region: 'trung', days: [2, 3] },
  { code: 'nghe-an', name: 'Nghệ An', region: 'trung', days: [2, 4] },
  { code: 'ha-tinh', name: 'Hà Tĩnh', region: 'trung', days: [2, 4] },
  { code: 'quang-tri', name: 'Quảng Trị', region: 'trung', days: [3, 4] },
  { code: 'hue', name: 'Huế', region: 'trung', days: [2, 4] },
  { code: 'da-nang', name: 'Đà Nẵng', region: 'trung', days: [2, 3], express: true },
  { code: 'quang-ngai', name: 'Quảng Ngãi', region: 'trung', days: [3, 4] },
  { code: 'gia-lai', name: 'Gia Lai', region: 'trung', days: [3, 5] },
  { code: 'dak-lak', name: 'Đắk Lắk', region: 'trung', days: [3, 5] },
  { code: 'khanh-hoa', name: 'Khánh Hòa', region: 'trung', days: [2, 4] },
  { code: 'lam-dong', name: 'Lâm Đồng', region: 'trung', days: [2, 4] },
  { code: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', region: 'nam', days: [1, 2], express: true },
  { code: 'dong-nai', name: 'Đồng Nai', region: 'nam', days: [1, 2] },
  { code: 'tay-ninh', name: 'Tây Ninh', region: 'nam', days: [1, 3] },
  { code: 'can-tho', name: 'Cần Thơ', region: 'nam', days: [2, 3] },
  { code: 'vinh-long', name: 'Vĩnh Long', region: 'nam', days: [2, 3] },
  { code: 'dong-thap', name: 'Đồng Tháp', region: 'nam', days: [2, 3] },
  { code: 'an-giang', name: 'An Giang', region: 'nam', days: [2, 4] },
  { code: 'ca-mau', name: 'Cà Mau', region: 'nam', days: [3, 4] },
]

export const regions = [
  { code: 'bac', name: 'Miền Bắc' },
  { code: 'trung', name: 'Miền Trung & Tây Nguyên' },
  { code: 'nam', name: 'Miền Nam' },
]

export const provinceName = (code) => provinces.find((p) => p.code === code)?.name ?? code
export const findProvince = (code) => provinces.find((p) => p.code === code) ?? null
