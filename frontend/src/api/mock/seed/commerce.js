/** Quy tắc thương mại: giao hàng, thanh toán, mã giảm giá, hạng thành viên. Backend thật nên đọc từ cấu hình/DB. */

export const FREE_SHIPPING_THRESHOLD = 499000

export const deliveryMethods = [
  {
    id: 'tieu-chuan', name: 'Giao tiêu chuẩn', price: 30000, freeOver: FREE_SHIPPING_THRESHOLD,
    description: 'Miễn phí cho đơn từ 499.000₫', daysFromProvince: true,
  },
  {
    id: 'trong-ngay', name: 'Giao trong ngày', price: 45000, days: [0, 0], expressOnly: true,
    description: 'Đặt trước 14:00, nhận trước 21:00 cùng ngày. Chỉ áp dụng nội thành Hà Nội, TP.HCM, Đà Nẵng.',
  },
  {
    id: 'hoa-toc', name: 'Hoả tốc 2 giờ', price: 59000, days: [0, 0], expressOnly: true,
    description: 'Giao bằng xe máy trong 2 giờ từ cửa hàng gần nhất (8:00 – 20:00).',
  },
  {
    id: 'cua-hang', name: 'Nhận tại cửa hàng', price: 0, days: [1, 3], requiresStore: true,
    description: 'Miễn phí. Chúng tôi nhắn tin khi hàng đã sẵn sàng, giữ hàng 7 ngày.',
  },
]

export const paymentMethods = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', description: 'Trả tiền mặt hoặc chuyển khoản cho nhân viên giao hàng.', maxTotal: 5000000 },
  { id: 'the', name: 'Thẻ tín dụng / ghi nợ', description: 'Visa, Mastercard, JCB, thẻ ATM nội địa (Napas).' },
  { id: 'vi', name: 'Ví điện tử', description: 'Quét mã bằng ứng dụng ví bạn đang dùng.', wallets: ['MoMo', 'ZaloPay', 'ShopeePay', 'VNPay'] },
  { id: 'chuyen-khoan', name: 'Chuyển khoản VietQR', description: 'Quét mã QR bằng ứng dụng ngân hàng, xác nhận tự động.' },
  { id: 'tra-gop', name: 'Trả góp 0% qua thẻ tín dụng', description: 'Chia 3 hoặc 6 kỳ, áp dụng cho đơn từ 1.500.000₫.', minTotal: 1500000 },
]

/**
 * Mã giảm giá demo.
 * type: percent | amount | shipping
 */
export const promoCodes = [
  { code: 'NEPMOI', type: 'percent', value: 10, maxDiscount: 100000, label: 'Giảm 10% cho đơn đầu tiên (tối đa 100.000₫)' },
  { code: 'FREESHIP', type: 'shipping', value: 0, label: 'Miễn phí giao hàng tiêu chuẩn' },
  { code: 'DOICU50', type: 'amount', value: 50000, minSubtotal: 300000, label: 'Đổi cũ lấy mới: giảm 50.000₫ cho đơn từ 300.000₫' },
  { code: 'CLUB15', type: 'percent', value: 15, membersOnly: true, maxDiscount: 200000, label: 'Nếp Club: giảm 15% (tối đa 200.000₫)' },
]

/** 1.000₫ = 1 điểm. Hạng thành viên đặt tên theo chất liệu vải. */
export const tiers = [
  { id: 'soi', name: 'Sợi', min: 0, perks: ['Tích 1 điểm cho mỗi 1.000₫', 'Quà sinh nhật', 'Đổi trả 30 ngày'] },
  { id: 'vai', name: 'Vải', min: 2000, perks: ['Tất cả quyền lợi hạng Sợi', 'Miễn phí giao hàng mọi đơn', 'Sửa đồ miễn phí 2 lần/năm'] },
  { id: 'lua', name: 'Lụa', min: 6000, perks: ['Tất cả quyền lợi hạng Vải', 'Mua sớm bộ sưu tập mới', 'Tư vấn phối đồ riêng', 'Đổi trả 60 ngày'] },
]

export const cancelReasons = [
  'Tôi đổi ý, không muốn mua nữa',
  'Tôi đặt nhầm (sai size, sai màu)',
  'Tôi muốn thêm sản phẩm khác vào đơn',
  'Tôi quên nhập mã giảm giá',
  'Tôi muốn đổi phương thức thanh toán',
  'Thời gian giao hàng quá lâu',
  'Lý do khác',
]

export const popularSearches = ['áo thun cotton', 'đầm linen', 'quần jeans ống rộng', 'sơ mi trắng', 'blazer', 'đồ đi biển', 'túi tote', 'nến thơm']
