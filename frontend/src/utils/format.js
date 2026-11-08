const vnd = new Intl.NumberFormat('vi-VN')

/** 349000 → "349.000₫" */
export function formatPrice(value) {
  if (value == null || Number.isNaN(value)) return ''
  return `${vnd.format(Math.round(value))}₫`
}

/** 1250 → "1.250" */
export function formatNumber(value) {
  return vnd.format(value ?? 0)
}

/** "14/11/2026" — tự ghép để mọi trình duyệt hiển thị giống nhau. */
export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ${formatDate(iso)}`
}

/** "Thứ Tư, 12/11" */
export function formatDay(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const WD = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${WD[d.getDay()]}, ${dd}/${mm}`
}

/** Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu: "Áo sơ mi" → "ao so mi" */
export function normalizeVi(s = '') {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/** Che bớt số điện thoại: 0912345678 → 0912 *** 678 */
export function maskPhone(p = '') {
  const s = p.replace(/\D/g, '')
  if (s.length < 9) return p
  return `${s.slice(0, 4)} *** ${s.slice(-3)}`
}

export function formatPhone(p = '') {
  const s = p.replace(/\D/g, '')
  if (s.length !== 10) return p
  return `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7)}`
}
