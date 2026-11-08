/**
 * Sinh đánh giá tiếng Việt cho mỗi sản phẩm (ổn định theo mã sản phẩm).
 * fit: -1 = chật/nhỏ, 0 = đúng size, 1 = rộng/lớn. length: -1 ngắn, 0 vừa, 1 dài.
 */
import { pick, rng } from './factory'

const NAMES = ['Ngọc Anh', 'Minh Khoa', 'Thu Hà', 'Quốc Bảo', 'Phương Linh', 'Gia Huy', 'Bảo Ngọc', 'Thanh Tùng', 'Mai Chi', 'Đức Anh', 'Hồng Nhung', 'Tuấn Kiệt', 'Khánh Vy', 'Hoàng Nam', 'Diệu Linh', 'Văn Long', 'Thảo My', 'Trung Hiếu', 'Yến Nhi', 'Nhật Minh', 'Lan Hương', 'Công Danh', 'Ánh Dương', 'Hải Đăng']
const CITIES = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Huế', 'Nha Trang', 'Biên Hòa', 'Vinh', 'Quy Nhơn']

const CLOTHING = {
  5: [
    'Vải mềm, mặc mát, form đẹp đúng như hình. Mình đã mua thêm một màu nữa.',
    'Đường may chắc chắn, giặt máy mấy lần vẫn không bai không xù. Rất đáng tiền.',
    'Chất vải dày dặn vừa phải, mặc đi làm hay đi chơi đều hợp. Giao hàng nhanh, đóng gói gọn.',
    'Màu ngoài đời còn đẹp hơn ảnh, lên dáng xinh lắm. Size tư vấn chuẩn.',
    'Lần thứ ba mua ở Nếp và chưa bao giờ thất vọng. Mặc cả ngày vẫn thoải mái.',
    'Form rộng vừa phải, che khuyết điểm tốt. Đồng nghiệp hỏi mua ở đâu suốt.',
  ],
  4: [
    'Áo đẹp, vải ổn, có điều hơi nhăn sau khi giặt, là lại là ổn.',
    'Mình thích màu và kiểu dáng, nhưng tay áo hơi dài so với mình một chút.',
    'Chất lượng tốt so với giá. Trừ một sao vì giao chậm hơn dự kiến một ngày.',
    'Mặc lên khá tôn dáng, nhưng nên lấy lên một size nếu thích mặc thoải mái.',
  ],
  3: [
    'Vải mỏng hơn mình nghĩ, mặc mùa hè thì ổn. Kiểu dáng thì đẹp.',
    'Màu thực tế hơi đậm hơn ảnh. Form ổn, giá hợp lý khi có sale.',
  ],
  2: ['Size hơi lệch so với bảng size, mình phải đổi lại. Nhân viên hỗ trợ đổi nhanh nên vẫn cho 2 sao.'],
}
const OTHER = {
  5: [
    'Sản phẩm xinh, hoàn thiện kỹ, dùng rất thích. Hộp đựng đẹp, tặng quà rất hợp.',
    'Chất lượng vượt mong đợi so với giá tiền. Sẽ ủng hộ shop dài dài.',
    'Đúng mô tả, màu trang nhã, đặt trong nhà nhìn sang hẳn.',
    'Giao nhanh, đóng gói cẩn thận, không móp méo gì. Rất hài lòng.',
  ],
  4: ['Đẹp và dùng tốt, chỉ hơi nhỏ hơn mình tưởng một chút.', 'Ổn trong tầm giá, mùi hương/chất liệu dễ chịu.'],
  3: ['Dùng được, nhưng chưa thật sự nổi bật. Có sale thì nên mua.'],
}

export function buildReviews(product) {
  const r = rng(`${product.id}:reviews`)
  const isClothing = Boolean(product.sizeGuide) && product.sizeGuide !== 'shoes'
  const bank = isClothing ? CLOTHING : OTHER
  const n = 5 + Math.floor(r() * 9)
  const fitBias = r() < 0.3 ? -1 : r() < 0.15 ? 1 : 0
  const list = []
  for (let i = 0; i < n; i++) {
    const roll = r()
    const rating = roll < 0.58 ? 5 : roll < 0.86 ? 4 : roll < 0.96 ? 3 : 2
    const texts = bank[rating] ?? bank[4]
    const color = pick(r, product.colors)
    const size = pick(r, product.sizes.filter((s) => s !== 'Một cỡ')) ?? null
    const heightCm = 150 + Math.floor(r() * 32)
    const weightKg = Math.round(42 + (heightCm - 150) * 0.9 + r() * 14)
    const daysAgo = Math.floor(r() * 300) + 1
    const fit = Math.max(-1, Math.min(1, fitBias + (r() < 0.25 ? (r() < 0.5 ? -1 : 1) : 0)))
    list.push({
      id: `${product.id}-rv${i + 1}`,
      productId: product.id,
      rating,
      text: pick(r, texts),
      author: pick(r, NAMES),
      city: pick(r, CITIES),
      verified: r() < 0.85,
      createdAt: new Date(Date.UTC(2026, 10, 8) - daysAgo * 86400000).toISOString(),
      colorName: color.name,
      size: isClothing ? size : null,
      fit: isClothing ? fit : null,
      length: isClothing ? (r() < 0.75 ? 0 : r() < 0.5 ? -1 : 1) : null,
      body: isClothing ? { heightCm, weightKg } : null,
      helpful: Math.floor(r() * 24),
    })
  }
  // tổng số đánh giá hiển thị (gồm cả đánh giá cũ không tải về)
  const extra = Math.floor(r() * 380)
  return { list, extra }
}
