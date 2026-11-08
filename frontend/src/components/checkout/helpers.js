import { formatDay, formatPrice } from '@/utils/format'

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const digits = (s = '') => s.replace(/\D/g, '')
export const PHONE_OK = (s) => /^0\d{9}$/.test(digits(s))

const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString()
const isToday = (iso) => sameDay(iso, new Date())

/** ["2026-11-12", "2026-11-14"] → "Thứ Tư, 12/11 – Thứ Sáu, 14/11"; cùng ngày hôm nay → "Hôm nay". */
export function formatEta(eta) {
  if (!eta?.length) return ''
  const [a, b] = eta
  // vi-VN có thể in "09-11" tuỳ trình duyệt → chuẩn hoá thành "09/11"
  const label = (iso) => (isToday(iso) ? 'Hôm nay' : formatDay(iso).replace(/(\d{1,2})-(\d{1,2})$/, '$1/$2'))
  if (!b || sameDay(a, b)) return label(a)
  return `${label(a)} – ${label(b)}`
}

export const priceLabel = (n) => (n === 0 ? 'Miễn phí' : formatPrice(n))

export const BRAND_LABEL = { visa: 'Visa', mastercard: 'Mastercard', jcb: 'JCB', napas: 'Napas', card: 'Thẻ' }

export function detectBrand(num) {
  const n = digits(num)
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^35/.test(n)) return 'jcb'
  if (/^9704/.test(n)) return 'napas'
  return null
}

export const formatCardNumber = (v) =>
  digits(v)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

export function formatExp(v, prev = '') {
  const d = digits(v).slice(0, 4)
  // Xoá dấu "/" thì xoá luôn chữ số trước nó
  if (prev.endsWith('/') && v.length < prev.length) return d.slice(0, 1)
  if (d.length >= 3) return `${d.slice(0, 2)}/${d.slice(2)}`
  if (d.length === 2 && v.length > prev.length) return `${d}/`
  return d
}

/** Mô tả thanh toán ngắn gọn cho trang xác nhận/đơn hàng. */
export function paymentSummary(p) {
  if (!p) return ''
  if (p.last4) return `${BRAND_LABEL[p.brand] ?? 'Thẻ'} •••• ${p.last4}${p.installments ? ` · trả góp ${p.installments} kỳ` : ''}`
  if (p.wallet) return `Ví ${p.wallet}`
  return p.name
}
