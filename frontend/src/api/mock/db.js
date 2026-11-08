/**
 * "Database" của mock server. Dữ liệu thay đổi được (người dùng, giỏ hàng, đơn hàng...) lưu ở localStorage.
 * Dữ liệu tĩnh (sản phẩm, danh mục, cửa hàng) import thẳng từ seed.
 * Xoá key `nep.mockdb.v1` trong localStorage (hoặc gọi POST /dev/reset) để làm mới dữ liệu demo.
 */
import { storage } from '@/utils/storage'
import { products } from './seed/products'

const KEY = 'nep.mockdb.v1'
const HOUR = 3600000
const DAY = 24 * HOUR

export const DEMO_USER = { email: 'lan@example.com', password: 'Nep12345' }

function orderItem(p, i, size, qty = 1) {
  const c = p.colors[0]
  return {
    id: `oi_${p.id}_${i}`,
    productId: p.id,
    slug: p.slug,
    name: p.name,
    colorCode: c.code,
    colorName: c.name,
    size,
    quantity: qty,
    price: p.price,
    originalPrice: p.originalPrice,
    image: c.images[0],
    articleNo: p.articleNo,
  }
}

function seed() {
  const now = Date.now()
  const address = {
    id: 'addr_1',
    fullName: 'Trần Ngọc Lan',
    phone: '0912345678',
    line1: '18 Ngõ 52 Tô Ngọc Vân',
    ward: 'Phường Tây Hồ',
    province: 'ha-noi',
    isDefault: true,
    label: 'Nhà riêng',
  }
  const clothing = products.filter((p) => p.sizes.length > 1)
  const a = clothing[0] ?? products[0]
  const b = clothing[5] ?? products[1] ?? a
  const c = clothing[9] ?? products[2] ?? a
  const d = products.find((p) => p.department === 'nha') ?? a

  const mk = (number, items, extra) => {
    const orderValue = items.reduce((s, it) => s + (it.originalPrice ?? it.price) * it.quantity, 0)
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const shipping = extra.shipping ?? 0
    return {
      number,
      userId: 'u_1',
      email: DEMO_USER.email,
      channel: 'online',
      items,
      contact: { fullName: address.fullName, email: DEMO_USER.email, phone: address.phone },
      shippingAddress: address,
      delivery: { id: 'tieu-chuan', name: 'Giao tiêu chuẩn', price: shipping },
      payment: { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)' },
      totals: { orderValue, saleDiscount: orderValue - subtotal, promoDiscount: 0, subtotal, shipping, total: subtotal + shipping },
      pointsEarned: Math.floor((subtotal + shipping) / 1000),
      ...extra,
    }
  }

  return {
    users: [
      {
        id: 'u_1',
        email: DEMO_USER.email,
        password: DEMO_USER.password, // chỉ dùng cho mock! Backend thật phải băm (bcrypt/argon2)
        firstName: 'Lan',
        lastName: 'Trần Ngọc',
        phone: '0912345678',
        dateOfBirth: '1996-03-14',
        gender: 'nu',
        memberId: '8406 2611 0417',
        points: 1460,
        subscriptions: { newsletter: true, sms: false, zalo: true },
        createdAt: new Date(now - 420 * DAY).toISOString(),
      },
    ],
    addresses: { u_1: [address] },
    cards: { u_1: [{ id: 'card_1', brand: 'visa', last4: '4242', holder: 'TRAN NGOC LAN', exp: '09/28' }] },
    carts: {},
    wishlists: {},
    notifications: [],
    newsletter: [],
    resetTokens: {},
    orders: [
      mk('NP2611-0482', [orderItem(a, 1, a.sizes[2] ?? a.sizes[0])], {
        status: 'processing',
        placedAt: new Date(now - 5 * HOUR).toISOString(),
        estimatedDelivery: [new Date(now + 1 * DAY).toISOString(), new Date(now + 3 * DAY).toISOString()],
        shipping: 30000,
        delivery: { id: 'tieu-chuan', name: 'Giao tiêu chuẩn', price: 30000 },
      }),
      mk('NP2610-1937', [orderItem(b, 1, b.sizes[1] ?? b.sizes[0]), orderItem(d, 2, d.sizes[0])], {
        status: 'delivered',
        placedAt: new Date(now - 26 * DAY).toISOString(),
        deliveredAt: new Date(now - 23 * DAY).toISOString(),
        payment: { id: 'vi', name: 'Ví điện tử', wallet: 'MoMo' },
      }),
      mk('NP2608-7720', [orderItem(c, 1, c.sizes[3] ?? c.sizes[0])], {
        channel: 'store',
        status: 'completed',
        storeName: 'Nếp Tràng Tiền',
        placedAt: new Date(now - 84 * DAY).toISOString(),
        delivery: { id: 'tai-quay', name: 'Mua tại cửa hàng', price: 0 },
        payment: { id: 'the', name: 'Thẻ tín dụng / ghi nợ', brand: 'visa', last4: '4242' },
      }),
    ],
  }
}

let state = storage.get(KEY) ?? seed()

export const db = {
  get state() {
    return state
  },
  /** Gọi sau mỗi thay đổi để lưu lại. */
  commit() {
    storage.set(KEY, state)
  },
  reset() {
    state = seed()
    storage.set(KEY, state)
  },
}
