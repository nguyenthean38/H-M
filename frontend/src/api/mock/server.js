/**
 * Mock server chạy trong trình duyệt. Mỗi route khớp 1:1 với docs/API_CONTRACT.md.
 * Khi có backend thật: đặt VITE_USE_MOCK=false — file này sẽ không được tải nữa.
 */
import { env } from '@/config/env'
import { findProvince, provinces } from '@/config/locations'
import { normalizeVi } from '@/utils/format'
import { uid } from '@/utils/storage'
import { db } from './db'
import { products } from './seed/products'
import { categories, departments, typeLabels, virtualCategories } from './seed/categories'
import { stores } from './seed/stores'
import { buildReviews } from './seed/reviews'
import { COLOR_FAMILIES, MATERIALS, storeStock } from './seed/factory'
import { cancelReasons, deliveryMethods, FREE_SHIPPING_THRESHOLD, paymentMethods, popularSearches, promoCodes, tiers } from './seed/commerce'

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

const routes = []
function route(method, pattern, handler) {
  const keys = []
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '/?$')
  routes.push({ method, re, keys, handler })
}

class MockError extends Error {
  constructor(status, code, message, fields) {
    super(message)
    Object.assign(this, { status, code, fields })
  }
}
const fail = (status, code, message, fields) => {
  throw new MockError(status, code, message, fields)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const clone = (v) => (v === undefined ? v : structuredClone(v))

export async function handleMockRequest({ method, path, body, headers = {} }) {
  await sleep(env.mockDelay)
  const [pathname, qs] = path.split('?')
  const query = Object.fromEntries(new URLSearchParams(qs || ''))
  const token = (headers.Authorization || '').replace('Bearer ', '')
  const user = token.startsWith('mock.') ? (db.state.users.find((u) => u.id === token.slice(5)) ?? null) : null
  const cartId = headers['X-Cart-Id']
  const owner = user ? `user:${user.id}` : `guest:${cartId}`

  for (const r of routes) {
    if (r.method !== method) continue
    const m = pathname.match(r.re)
    if (!m) continue
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]))
    try {
      const result = await r.handler({ params, query, body: clone(body) ?? {}, user, owner, cartId })
      db.commit()
      if (result === undefined) return { status: 204, body: null }
      return { status: 200, body: clone(result) }
    } catch (e) {
      if (e instanceof MockError) return { status: e.status, body: { error: { code: e.code, message: e.message, fields: e.fields } } }
      console.error('[mock] lỗi xử lý', e)
      return { status: 500, body: { error: { code: 'INTERNAL', message: e.message } } }
    }
  }
  return { status: 404, body: { error: { code: 'NOT_FOUND', message: `Không có route mock cho ${method} ${pathname}` } } }
}

/* ------------------------------------------------------------------ */
/* Helpers chung                                                       */
/* ------------------------------------------------------------------ */

const requireAuth = (user) => user ?? fail(401, 'UNAUTHORIZED', 'Vui lòng đăng nhập để tiếp tục.')
const csv = (v) => String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const byId = (id) => products.find((p) => p.id === id)
const bySlug = (slug) => products.find((p) => p.slug === slug)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^0\d{9}$/

export function passwordIssues(pw = '') {
  const issues = []
  if (pw.length < 8 || pw.length > 25) issues.push('length')
  if (!/\d/.test(pw)) issues.push('number')
  if (!/[A-Z]/.test(pw)) issues.push('upper')
  if (!/[a-z]/.test(pw)) issues.push('lower')
  if (/\s/.test(pw)) issues.push('space')
  return issues
}

/* ---------- Đánh giá (cache theo sản phẩm) ---------- */
const reviewCache = new Map()
function reviewsOf(p) {
  if (!reviewCache.has(p.id)) reviewCache.set(p.id, buildReviews(p))
  return reviewCache.get(p.id)
}
function ratingOf(p) {
  const { list, extra } = reviewsOf(p)
  const avg = list.reduce((s, r) => s + r.rating, 0) / list.length
  return { average: Math.round(Math.min(5, avg + 0.15) * 10) / 10, count: list.length + extra }
}

/* ---------- Sản phẩm ---------- */
const inStockColor = (c) => Object.values(c.stock).some((n) => n > 0)

function toSummary(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    department: p.department,
    category: p.category,
    type: p.type,
    typeLabel: p.typeLabel,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    badges: p.badges,
    image: p.colors[0].images[0],
    hoverImage: p.colors[0].images[1] ?? null,
    colors: p.colors.map((c) => ({ code: c.code, name: c.name, hex: c.hex, image: c.images[0] })),
    rating: ratingOf(p),
  }
}

function categoryOf(slug) {
  return categories.find((c) => c.slug === slug) ?? null
}

function toDetail(p) {
  const cat = categoryOf(p.category)
  const dep = departments.find((d) => d.slug === p.department)
  return {
    ...toSummary(p),
    articleNo: p.articleNo,
    description: p.description,
    details: p.details,
    fit: p.fit,
    fitLabel: p.fitLabel,
    material: p.material,
    materialLabel: p.materialLabel,
    composition: p.composition,
    care: p.care,
    sustainable: p.sustainable,
    sizes: p.sizes,
    sizeGuide: p.sizeGuide,
    colors: p.colors.map((c) => ({
      code: c.code,
      name: c.name,
      hex: c.hex,
      images: c.images,
      sizes: p.sizes.map((s) => ({ label: s, stock: c.stock[s], inStock: c.stock[s] > 0, lowStock: c.stock[s] > 0 && c.stock[s] <= 3 })),
      available: inStockColor(c),
    })),
    breadcrumbs: [
      { label: 'Trang chủ', href: '/' },
      ...(dep && !cat?.shared ? [{ label: dep.name, href: `/${dep.slug}` }] : []),
      ...(cat ? [{ label: cat.name, href: `/c/${cat.slug}` }] : []),
      { label: p.name, href: null },
    ],
  }
}

function matchesQuery(p, q) {
  if (!q) return true
  const hay = normalizeVi(`${p.name} ${p.typeLabel} ${p.materialLabel} ${p.colors.map((c) => c.name).join(' ')} ${p.description} ${p.tags.join(' ')} ${departments.find((d) => d.slug === p.department)?.name ?? ''}`)
  return normalizeVi(q).split(/\s+/).every((w) => hay.includes(w))
}

function scopeFor(f) {
  const v = virtualCategories.find((c) => c.slug === f.category)
  const merged = v ? { ...f, ...v.filter, category: undefined } : f
  return products.filter((p) => {
    if (merged.department && p.department !== merged.department) return false
    if (merged.category && p.category !== merged.category) return false
    if (merged.badge && !p.badges.includes(merged.badge)) return false
    if (String(merged.sale) === 'true' && !p.originalPrice) return false
    if (!matchesQuery(p, merged.q)) return false
    return true
  })
}

function applyFacets(list, f) {
  const types = csv(f.type)
  const colors = csv(f.color)
  const sizes = csv(f.size)
  const fits = csv(f.fit)
  const mats = csv(f.material)
  const min = f.minPrice ? Number(f.minPrice) : null
  const max = f.maxPrice ? Number(f.maxPrice) : null
  return list.filter((p) => {
    if (types.length && !types.includes(p.type)) return false
    if (colors.length && !p.colors.some((c) => colors.includes(c.family))) return false
    if (sizes.length && !p.colors.some((c) => sizes.some((s) => c.stock[s] > 0))) return false
    if (fits.length && !fits.includes(p.fit)) return false
    if (mats.length && !mats.includes(p.material)) return false
    if (min != null && p.price < min) return false
    if (max != null && p.price > max) return false
    if (f.storeId && !p.colors.some((c) => p.sizes.some((s) => storeStock(f.storeId, p, c.code, s) > 0))) return false
    return true
  })
}

function countBy(list, getter, labeler) {
  const map = new Map()
  for (const p of list) for (const v of [].concat(getter(p)).filter(Boolean)) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map.entries()].map(([value, count]) => ({ value, count, ...labeler(value) }))
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'S/M', 'L/XL', '2-3T', '4-5T', '6-7T', '8-9T', '10-11T', '12-13T']
const FIT_LABEL = { rong: 'Dáng rộng', vua: 'Dáng suông vừa', om: 'Dáng ôm', oversize: 'Dáng oversize' }

/**
 * Facet chuẩn thương mại điện tử: mỗi nhóm đếm trên kết quả đã áp các bộ lọc KHÁC (không tự loại chính nó),
 * nên chọn "Đen" vẫn thấy được các màu còn lại để chọn thêm.
 */
function facetsFor(scope, query) {
  const without = (key) => applyFacets(scope, { ...query, [key]: undefined })
  const prices = scope.map((p) => p.price)
  return {
    type: countBy(without('type'), (p) => p.type, (v) => ({ label: typeLabels[v] ?? v })).sort((a, b) => b.count - a.count),
    color: countBy(without('color'), (p) => [...new Set(p.colors.map((c) => c.family))], (v) => ({ label: COLOR_FAMILIES[v]?.name ?? v, hex: COLOR_FAMILIES[v]?.hex })).sort((a, b) => b.count - a.count),
    size: countBy(without('size'), (p) => p.sizes.filter((s) => s !== 'Một cỡ' && p.colors.some((c) => c.stock[s] > 0)), (v) => ({ label: v })).sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a.value)
      const ib = SIZE_ORDER.indexOf(b.value)
      if (ia === -1 && ib === -1) return Number(a.value) - Number(b.value)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    }),
    fit: countBy(without('fit'), (p) => p.fit, (v) => ({ label: FIT_LABEL[v] ?? v })),
    material: countBy(without('material'), (p) => p.material, (v) => ({ label: MATERIALS[v]?.label ?? v })).sort((a, b) => b.count - a.count),
    price: { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 },
  }
}

const SORTERS = {
  'de-xuat': (a, b) => a.order - b.order,
  'moi-nhat': (a, b) => b.createdAt.localeCompare(a.createdAt),
  'gia-tang': (a, b) => a.price - b.price,
  'gia-giam': (a, b) => b.price - a.price,
  'ban-chay': (a, b) => b.popularity - a.popularity,
}

/* ------------------------------------------------------------------ */
/* Danh mục & sản phẩm                                                 */
/* ------------------------------------------------------------------ */

route('GET', '/categories/:slug', ({ params }) => {
  const real = categoryOf(params.slug)
  const virtual = virtualCategories.find((c) => c.slug === params.slug)
  const dep = departments.find((d) => d.slug === params.slug)
  const meta = real ?? virtual ?? (dep ? { slug: dep.slug, name: dep.name, title: dep.name } : null)
  if (!meta) fail(404, 'NOT_FOUND', 'Không tìm thấy danh mục.')
  const scope = scopeFor({ category: params.slug })
  const department = real?.department ?? virtual?.filter?.department ?? dep?.slug ?? null
  const depMeta = departments.find((d) => d.slug === department)
  return {
    slug: meta.slug,
    name: meta.name,
    title: meta.title,
    department,
    image: real?.image ? `/images/${real.image}` : null,
    types: countBy(scope, (p) => p.type, (v) => ({ label: typeLabels[v] ?? v })).sort((a, b) => (real?.types ?? []).indexOf(a.value) - (real?.types ?? []).indexOf(b.value)),
    siblings: department ? categories.filter((c) => c.department === department && !c.shared).map((c) => ({ slug: c.slug, name: c.name })) : [],
    breadcrumbs: [
      { label: 'Trang chủ', href: '/' },
      ...(depMeta && !real?.shared && depMeta.slug !== meta.slug ? [{ label: depMeta.name, href: `/${depMeta.slug}` }] : []),
      { label: meta.name, href: null },
    ],
  }
})

route('GET', '/departments', () =>
  departments.map((d) => ({
    ...d,
    hero: `/images/${d.hero}`,
    categories: categories.filter((c) => c.department === d.slug).map((c) => ({ slug: c.slug, name: c.name, image: `/images/${c.image}` })),
  })),
)

route('GET', '/products', ({ query }) => {
  const scope = scopeFor(query)
  const filtered = applyFacets(scope, query)
  const sorter = SORTERS[query.sort] ?? SORTERS['de-xuat']
  const sorted = [...filtered].sort(sorter)
  const pageSize = Math.min(Number(query.pageSize) || 24, 60)
  const page = Math.max(1, Number(query.page) || 1)
  return {
    items: sorted.slice(0, page * pageSize).map(toSummary), // "Xem thêm" tải cộng dồn
    total: sorted.length,
    scopeTotal: scope.length,
    page,
    pageSize,
    hasMore: page * pageSize < sorted.length,
    facets: facetsFor(scope, query),
  }
})

route('GET', '/products/:slug', ({ params }) => {
  const p = bySlug(params.slug) ?? byId(params.slug)
  if (!p) fail(404, 'NOT_FOUND', 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.')
  return toDetail(p)
})

route('GET', '/products/:id/recommendations', ({ params, query }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm.')
  const limit = Number(query.limit) || 12
  let list
  if (query.type === 'others') {
    // "Khách cũng mua": khác danh mục, cùng bộ phận hoặc phụ kiện/nhà
    list = products.filter((x) => x.id !== p.id && x.category !== p.category && (x.department === p.department || ['phu-kien', 'nha-tat-ca'].includes(x.category)))
    list.sort((a, b) => b.popularity - a.popularity)
  } else {
    list = products.filter((x) => x.id !== p.id && x.category === p.category)
    if (list.length < 6) list = list.concat(products.filter((x) => x.id !== p.id && x.department === p.department && x.category !== p.category))
  }
  return list.slice(0, limit).map(toSummary)
})

route('GET', '/products/:id/reviews', ({ params, query }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm.')
  const { list } = reviewsOf(p)
  const rating = ratingOf(p)
  const withFit = list.filter((r) => r.fit != null)
  const avg = (arr, k) => (arr.length ? arr.reduce((s, r) => s + r[k], 0) / arr.length : 0)
  const distribution = [5, 4, 3, 2, 1].map((star) => ({ star, count: list.filter((r) => r.rating === star).length }))
  const sorters = {
    'phu-hop': (a, b) => b.helpful - a.helpful,
    'moi-nhat': (a, b) => b.createdAt.localeCompare(a.createdAt),
    'cao-nhat': (a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt),
    'thap-nhat': (a, b) => a.rating - b.rating || b.createdAt.localeCompare(a.createdAt),
  }
  const items = [...list].sort(sorters[query.sort] ?? sorters['phu-hop'])
  return {
    summary: {
      ...rating,
      fit: withFit.length ? Math.round(avg(withFit, 'fit') * 100) / 100 : null,
      length: withFit.length ? Math.round(avg(withFit, 'length') * 100) / 100 : null,
      distribution,
      recommendPercent: Math.round((list.filter((r) => r.rating >= 4).length / list.length) * 100),
    },
    items,
  }
})

route('POST', '/products/:id/notify', ({ params, body, user }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm.')
  const email = (body.email || user?.email || '').trim()
  if (!EMAIL_RE.test(email)) fail(422, 'VALIDATION', 'Email chưa đúng định dạng.', { email: 'Email chưa đúng định dạng.' })
  if (!body.size) fail(422, 'VALIDATION', 'Vui lòng chọn size.', { size: 'Vui lòng chọn size.' })
  db.state.notifications.push({ id: uid('ntf_'), productId: p.id, colorCode: body.colorCode, size: body.size, email, createdAt: new Date().toISOString() })
  return { ok: true, email }
})

route('GET', '/products/:id/availability', ({ params, query }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm.')
  return stores.map((s) => ({
    storeId: s.id,
    slug: s.slug,
    name: s.name,
    city: s.city,
    address: `${s.address}, ${s.ward}`,
    stock: query.size ? storeStock(s.id, p, query.colorCode, query.size) : p.sizes.reduce((n, size) => n + storeStock(s.id, p, query.colorCode, size), 0),
  }))
})

route('GET', '/search/suggestions', ({ query }) => {
  const q = (query.q || '').trim()
  if (!q) return { queries: popularSearches, categories: [], products: [] }
  const nq = normalizeVi(q)
  const terms = new Set()
  for (const p of products) {
    const t = p.typeLabel.toLowerCase()
    if (normalizeVi(t).includes(nq)) terms.add(t)
    for (const c of p.colors) if (normalizeVi(`${t} ${c.name}`).includes(nq)) terms.add(`${t} ${c.name.toLowerCase()}`)
  }
  popularSearches.filter((s) => normalizeVi(s).includes(nq)).forEach((s) => terms.add(s))
  const cats = [...categories, ...virtualCategories].filter((c) => normalizeVi(c.name).includes(nq)).slice(0, 4)
  return {
    queries: [...terms].slice(0, 6),
    categories: cats.map((c) => ({ slug: c.slug, name: c.title ?? c.name })),
    products: products.filter((p) => matchesQuery(p, q)).slice(0, 4).map(toSummary),
  }
})

/* ------------------------------------------------------------------ */
/* Cửa hàng                                                            */
/* ------------------------------------------------------------------ */

function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function openNow(s, date = new Date()) {
  const weekend = [0, 6].includes(date.getDay())
  const h = s.hours[weekend ? 1 : 0]
  const mins = date.getHours() * 60 + date.getMinutes()
  const [oh, om] = h.open.split(':').map(Number)
  const [ch, cm] = h.close.split(':').map(Number)
  return mins >= oh * 60 + om && mins < ch * 60 + cm
}

const toStore = (s, origin) => ({
  ...s,
  fullAddress: `${s.address}, ${s.ward}, ${s.city}`,
  openNow: openNow(s),
  distanceKm: origin ? Math.round(distanceKm(origin, s) * 10) / 10 : null,
})

route('GET', '/stores', ({ query }) => {
  const origin = query.lat && query.lng ? { lat: Number(query.lat), lng: Number(query.lng) } : null
  let list = stores
  if (query.province) list = list.filter((s) => s.province === query.province)
  if (query.q) {
    const q = normalizeVi(query.q)
    list = list.filter((s) => normalizeVi(`${s.name} ${s.address} ${s.ward} ${s.city}`).includes(q))
  }
  if (query.department) list = list.filter((s) => s.departments.includes(query.department))
  const out = list.map((s) => toStore(s, origin))
  if (origin) out.sort((a, b) => a.distanceKm - b.distanceKm)
  return out
})

route('GET', '/stores/:slug', ({ params }) => {
  const s = stores.find((x) => x.slug === params.slug || x.id === params.slug) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy cửa hàng.')
  return { ...toStore(s), nearby: stores.filter((x) => x.id !== s.id).map((x) => toStore(x, s)).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3) }
})

/* ------------------------------------------------------------------ */
/* Xác thực                                                            */
/* ------------------------------------------------------------------ */

const TIERS_DESC = [...tiers].reverse()
function toMe(u) {
  const tier = TIERS_DESC.find((t) => u.points >= t.min)
  const next = tiers.find((t) => t.min > u.points) ?? null
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    dateOfBirth: u.dateOfBirth,
    gender: u.gender,
    memberId: u.memberId,
    points: u.points,
    tier: { id: tier.id, name: tier.name, perks: tier.perks },
    nextTier: next ? { id: next.id, name: next.name, min: next.min, remaining: next.min - u.points } : null,
    subscriptions: u.subscriptions,
    createdAt: u.createdAt,
  }
}
const session = (u) => ({ token: `mock.${u.id}`, user: toMe(u) })
const findUser = (email) => db.state.users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())

/** Gộp giỏ hàng & yêu thích của khách vào tài khoản sau khi đăng nhập. */
function mergeGuest(cartId, user) {
  const g = `guest:${cartId}`
  const u = `user:${user.id}`
  const gc = db.state.carts[g]
  if (gc?.items?.length) {
    const uc = (db.state.carts[u] ??= { items: [], promo: null })
    for (const it of gc.items) {
      const same = uc.items.find((x) => x.productId === it.productId && x.colorCode === it.colorCode && x.size === it.size)
      if (same) same.quantity = Math.min(10, same.quantity + it.quantity)
      else uc.items.push(it)
    }
    delete db.state.carts[g]
  }
  const gw = db.state.wishlists[g]
  if (gw?.length) {
    db.state.wishlists[u] = [...new Set([...(db.state.wishlists[u] ?? []), ...gw])]
    delete db.state.wishlists[g]
  }
}

route('POST', '/auth/check-email', ({ body }) => {
  const email = String(body.email || '').trim()
  if (!EMAIL_RE.test(email)) fail(422, 'VALIDATION', 'Email chưa đúng định dạng.', { email: 'Email chưa đúng định dạng.' })
  return { exists: Boolean(findUser(email)) }
})

route('POST', '/auth/login', ({ body, cartId }) => {
  const u = findUser(body.email)
  if (!u || u.password !== body.password) fail(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu chưa đúng, vui lòng thử lại.')
  mergeGuest(cartId, u)
  return session(u)
})

route('POST', '/auth/register', ({ body, cartId }) => {
  const fields = {}
  const email = String(body.email || '').trim()
  if (!EMAIL_RE.test(email)) fields.email = 'Email chưa đúng định dạng.'
  else if (findUser(email)) fields.email = 'Email này đã có tài khoản.'
  if (passwordIssues(body.password).length) fields.password = 'Mật khẩu chưa đạt yêu cầu.'
  if (!body.dateOfBirth) fields.dateOfBirth = 'Vui lòng nhập ngày sinh.'
  else {
    const age = (Date.now() - new Date(body.dateOfBirth).getTime()) / (365.25 * 86400000)
    if (!(age >= 13 && age < 110)) fields.dateOfBirth = 'Bạn cần đủ 13 tuổi để tạo tài khoản.'
  }
  if (Object.keys(fields).length) fail(422, 'VALIDATION', 'Vui lòng kiểm tra lại thông tin.', fields)
  const u = {
    id: uid('u_'),
    email,
    password: body.password,
    firstName: (body.firstName || '').trim() || null,
    lastName: (body.lastName || '').trim() || null,
    phone: body.phone || null,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender || null,
    memberId: `8406 ${String(Math.floor(Math.random() * 1e8)).padStart(8, '0').replace(/(\d{4})(\d{4})/, '$1 $2')}`,
    points: 100 + (body.firstName ? 50 : 0) + (body.phone ? 50 : 0), // thưởng điểm khi điền thêm thông tin
    subscriptions: { newsletter: Boolean(body.newsletter), sms: false, zalo: false },
    createdAt: new Date().toISOString(),
  }
  db.state.users.push(u)
  db.state.addresses[u.id] = []
  mergeGuest(cartId, u)
  return session(u)
})

route('POST', '/auth/logout', () => undefined)

route('POST', '/auth/forgot-password', ({ body }) => {
  const email = String(body.email || '').trim()
  if (!EMAIL_RE.test(email)) fail(422, 'VALIDATION', 'Email chưa đúng định dạng.', { email: 'Email chưa đúng định dạng.' })
  const u = findUser(email)
  // Luôn trả về thành công để không lộ email nào đã đăng ký.
  if (!u) return { sent: true }
  const token = uid('rst_')
  db.state.resetTokens[token] = { userId: u.id, expiresAt: Date.now() + 3600000 }
  // demoToken chỉ có ở mock để mô phỏng "mở email" — backend thật gửi email chứa link.
  return { sent: true, demoToken: token }
})

route('POST', '/auth/reset-password', ({ body }) => {
  const rec = db.state.resetTokens[body.token]
  if (!rec || rec.expiresAt < Date.now()) fail(400, 'TOKEN_INVALID', 'Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.')
  if (passwordIssues(body.password).length) fail(422, 'VALIDATION', 'Mật khẩu chưa đạt yêu cầu.', { password: 'Mật khẩu chưa đạt yêu cầu.' })
  const u = db.state.users.find((x) => x.id === rec.userId)
  u.password = body.password
  delete db.state.resetTokens[body.token]
  return { ok: true }
})

/* ------------------------------------------------------------------ */
/* Tài khoản                                                           */
/* ------------------------------------------------------------------ */

route('GET', '/me', ({ user }) => toMe(requireAuth(user)))

route('PATCH', '/me', ({ user, body }) => {
  const u = requireAuth(user)
  const fields = {}
  if (body.email !== undefined && !EMAIL_RE.test(body.email)) fields.email = 'Email chưa đúng định dạng.'
  if (body.email && body.email !== u.email && findUser(body.email)) fields.email = 'Email này đã được dùng.'
  if (body.email && body.email !== u.email && body.password !== u.password) fields.password = 'Nhập mật khẩu hiện tại để đổi email.'
  if (body.phone && !PHONE_RE.test(body.phone)) fields.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0.'
  if (Object.keys(fields).length) fail(422, 'VALIDATION', 'Vui lòng kiểm tra lại thông tin.', fields)
  for (const k of ['email', 'firstName', 'lastName', 'phone', 'dateOfBirth', 'gender']) if (body[k] !== undefined) u[k] = body[k]
  return toMe(u)
})

route('PATCH', '/me/subscriptions', ({ user, body }) => {
  const u = requireAuth(user)
  u.subscriptions = { ...u.subscriptions, ...body }
  return toMe(u)
})

route('POST', '/me/password', ({ user, body }) => {
  const u = requireAuth(user)
  if (body.currentPassword !== u.password) fail(422, 'VALIDATION', 'Mật khẩu hiện tại chưa đúng.', { currentPassword: 'Mật khẩu hiện tại chưa đúng.' })
  if (passwordIssues(body.newPassword).length) fail(422, 'VALIDATION', 'Mật khẩu mới chưa đạt yêu cầu.', { newPassword: 'Mật khẩu mới chưa đạt yêu cầu.' })
  u.password = body.newPassword
  return { ok: true }
})

route('DELETE', '/me', ({ user }) => {
  const u = requireAuth(user)
  db.state.users = db.state.users.filter((x) => x.id !== u.id)
  delete db.state.addresses[u.id]
  delete db.state.carts[`user:${u.id}`]
  return undefined
})

route('GET', '/me/rewards', ({ user }) => {
  const u = requireAuth(user)
  const now = Date.now()
  const day = 86400000
  return {
    offers: [
      { id: 'of_1', title: 'Giảm 15% đơn tiếp theo', description: 'Dành riêng thành viên Nếp Club, áp dụng sản phẩm nguyên giá.', code: 'CLUB15', image: '/images/campaign/club.jpg', expiresAt: new Date(now + 6 * day).toISOString(), tone: 'cham' },
      { id: 'of_2', title: 'Đổi 1 kg quần áo cũ — nhận 50.000₫', description: 'Mang quần áo cũ (mọi thương hiệu) đến cửa hàng Nếp, nhận mã giảm giá ngay tại quầy.', code: 'DOICU50', image: '/images/campaign/doi-cu.jpg', expiresAt: new Date(now + 40 * day).toISOString(), tone: 'paper' },
      { id: 'of_3', title: 'Workshop nhuộm chàm', description: 'Tự tay nhuộm một chiếc khăn bằng chàm tự nhiên. Miễn phí cho thành viên, số lượng có hạn.', image: '/images/campaign/chat-lieu.jpg', expiresAt: new Date(now + 1 * day).toISOString(), tone: 'paper' },
    ],
    history: [
      { id: 'pt_1', label: 'Đơn hàng NP2610-1937', points: 612, at: new Date(now - 23 * day).toISOString() },
      { id: 'pt_2', label: 'Đổi quần áo cũ tại Nếp Tràng Tiền', points: 200, at: new Date(now - 51 * day).toISOString() },
      { id: 'pt_3', label: 'Mua tại cửa hàng NP2608-7720', points: 548, at: new Date(now - 84 * day).toISOString() },
      { id: 'pt_4', label: 'Chào mừng thành viên mới', points: 100, at: u.createdAt },
    ],
    tiers,
  }
})

/* ---------- Địa chỉ ---------- */
function validateAddress(a) {
  const fields = {}
  if (!a.fullName?.trim()) fields.fullName = 'Vui lòng nhập họ tên người nhận.'
  if (!PHONE_RE.test(a.phone || '')) fields.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0.'
  if (!a.line1?.trim()) fields.line1 = 'Vui lòng nhập số nhà, tên đường.'
  if (!a.ward?.trim()) fields.ward = 'Vui lòng nhập phường/xã.'
  if (!findProvince(a.province)) fields.province = 'Vui lòng chọn tỉnh/thành phố.'
  if (Object.keys(fields).length) fail(422, 'VALIDATION', 'Vui lòng kiểm tra lại địa chỉ.', fields)
}
const pickAddress = (b) => ({ fullName: b.fullName?.trim(), phone: b.phone, line1: b.line1?.trim(), ward: b.ward?.trim(), province: b.province, label: b.label || null })

route('GET', '/me/addresses', ({ user }) => db.state.addresses[requireAuth(user).id] ?? [])

route('POST', '/me/addresses', ({ user, body }) => {
  const u = requireAuth(user)
  validateAddress(body)
  const list = (db.state.addresses[u.id] ??= [])
  const addr = { id: uid('addr_'), ...pickAddress(body), isDefault: list.length === 0 || Boolean(body.isDefault) }
  if (addr.isDefault) list.forEach((a) => (a.isDefault = false))
  list.push(addr)
  return addr
})

route('PATCH', '/me/addresses/:id', ({ user, params, body }) => {
  const u = requireAuth(user)
  const list = db.state.addresses[u.id] ?? []
  const addr = list.find((a) => a.id === params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy địa chỉ.')
  const next = { ...addr, ...pickAddress({ ...addr, ...body }) }
  validateAddress(next)
  Object.assign(addr, next)
  if (body.isDefault) list.forEach((a) => (a.isDefault = a.id === addr.id))
  return addr
})

route('DELETE', '/me/addresses/:id', ({ user, params }) => {
  const u = requireAuth(user)
  const list = (db.state.addresses[u.id] ?? []).filter((a) => a.id !== params.id)
  if (list.length && !list.some((a) => a.isDefault)) list[0].isDefault = true
  db.state.addresses[u.id] = list
  return undefined
})

route('GET', '/me/cards', ({ user }) => db.state.cards[requireAuth(user).id] ?? [])
route('DELETE', '/me/cards/:id', ({ user, params }) => {
  const u = requireAuth(user)
  db.state.cards[u.id] = (db.state.cards[u.id] ?? []).filter((c) => c.id !== params.id)
  return undefined
})

/* ------------------------------------------------------------------ */
/* Yêu thích                                                           */
/* ------------------------------------------------------------------ */

route('GET', '/wishlist', ({ owner }) => (db.state.wishlists[owner] ?? []).map(byId).filter(Boolean).map(toSummary))
route('POST', '/wishlist', ({ owner, body }) => {
  if (!byId(body.productId)) fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm.')
  const list = (db.state.wishlists[owner] ??= [])
  if (!list.includes(body.productId)) list.unshift(body.productId)
  return list
})
route('DELETE', '/wishlist/:productId', ({ owner, params }) => {
  db.state.wishlists[owner] = (db.state.wishlists[owner] ?? []).filter((id) => id !== params.productId)
  return db.state.wishlists[owner]
})

/* ------------------------------------------------------------------ */
/* Giỏ hàng                                                            */
/* ------------------------------------------------------------------ */

const MAX_QTY = 10
const cartOf = (owner) => (db.state.carts[owner] ??= { items: [], promo: null })
const isMemberTierFreeShip = (user) => user && user.points >= 2000

function computeCart(cart, user) {
  const items = cart.items
    .map((it) => {
      const p = byId(it.productId)
      if (!p) return null
      const c = p.colors.find((x) => x.code === it.colorCode) ?? p.colors[0]
      const stock = c.stock[it.size] ?? 0
      return {
        id: it.id,
        productId: p.id,
        slug: p.slug,
        name: p.name,
        articleNo: p.articleNo,
        colorCode: c.code,
        colorName: c.name,
        size: it.size,
        quantity: it.quantity,
        price: p.price,
        originalPrice: p.originalPrice,
        image: c.images[0],
        inStock: stock > 0,
        maxQuantity: Math.min(MAX_QTY, Math.max(stock, 0)),
        lineTotal: p.price * it.quantity,
      }
    })
    .filter(Boolean)
  const orderValue = items.reduce((s, it) => s + (it.originalPrice ?? it.price) * it.quantity, 0)
  const subtotal = items.reduce((s, it) => s + it.lineTotal, 0)
  const saleDiscount = orderValue - subtotal
  const promo = cart.promo ? promoCodes.find((p) => p.code === cart.promo) : null
  let promoDiscount = 0
  if (promo?.type === 'percent') promoDiscount = Math.min(Math.round((subtotal * promo.value) / 100), promo.maxDiscount ?? Infinity)
  if (promo?.type === 'amount') promoDiscount = subtotal >= (promo.minSubtotal ?? 0) ? promo.value : 0
  const freeShip = subtotal >= FREE_SHIPPING_THRESHOLD || promo?.type === 'shipping' || isMemberTierFreeShip(user)
  const shipping = items.length === 0 ? 0 : freeShip ? 0 : 30000
  return {
    items,
    count: items.reduce((s, it) => s + it.quantity, 0),
    promo: promo ? { code: promo.code, label: promo.label, type: promo.type } : null,
    totals: { orderValue, saleDiscount, promoDiscount, subtotal, shipping, total: Math.max(0, subtotal - promoDiscount) + shipping },
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining: freeShip ? 0 : Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    freeShippingReason: isMemberTierFreeShip(user) ? 'member' : promo?.type === 'shipping' ? 'promo' : subtotal >= FREE_SHIPPING_THRESHOLD ? 'threshold' : null,
  }
}

route('GET', '/cart', ({ owner, user }) => computeCart(cartOf(owner), user))

route('POST', '/cart/items', ({ owner, user, body }) => {
  const p = byId(body.productId) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm.')
  const c = p.colors.find((x) => x.code === body.colorCode) ?? fail(422, 'VALIDATION', 'Màu không hợp lệ.')
  if (!p.sizes.includes(body.size)) fail(422, 'VALIDATION', 'Vui lòng chọn size.', { size: 'Vui lòng chọn size.' })
  const stock = c.stock[body.size] ?? 0
  if (stock <= 0) fail(409, 'OUT_OF_STOCK', 'Size này đã hết hàng.')
  const cart = cartOf(owner)
  const qty = Math.max(1, Number(body.quantity) || 1)
  const same = cart.items.find((x) => x.productId === p.id && x.colorCode === c.code && x.size === body.size)
  if (same) {
    if (same.quantity + qty > Math.min(MAX_QTY, stock)) fail(409, 'QUANTITY_LIMIT', `Chỉ còn ${Math.min(MAX_QTY, stock)} sản phẩm cho lựa chọn này.`)
    same.quantity += qty
  } else cart.items.unshift({ id: uid('ci_'), productId: p.id, colorCode: c.code, size: body.size, quantity: qty })
  const out = computeCart(cart, user)
  return { ...out, addedItemId: same?.id ?? cart.items[0].id }
})

route('PATCH', '/cart/items/:id', ({ owner, user, params, body }) => {
  const cart = cartOf(owner)
  const it = cart.items.find((x) => x.id === params.id) ?? fail(404, 'NOT_FOUND', 'Sản phẩm không còn trong giỏ.')
  const p = byId(it.productId)
  const c = p.colors.find((x) => x.code === it.colorCode)
  if (body.quantity !== undefined) {
    const q = Number(body.quantity)
    const max = Math.min(MAX_QTY, c.stock[it.size] ?? 0)
    if (q < 1) fail(422, 'VALIDATION', 'Số lượng tối thiểu là 1.')
    if (q > max) fail(409, 'QUANTITY_LIMIT', `Chỉ còn ${max} sản phẩm cho lựa chọn này.`)
    it.quantity = q
  }
  if (body.size !== undefined) {
    if ((c.stock[body.size] ?? 0) <= 0) fail(409, 'OUT_OF_STOCK', 'Size này đã hết hàng.')
    it.size = body.size
  }
  return computeCart(cart, user)
})

route('DELETE', '/cart/items/:id', ({ owner, user, params }) => {
  const cart = cartOf(owner)
  cart.items = cart.items.filter((x) => x.id !== params.id)
  return computeCart(cart, user)
})

route('POST', '/cart/promo', ({ owner, user, body }) => {
  const code = String(body.code || '').trim().toUpperCase()
  const promo = promoCodes.find((p) => p.code === code)
  if (!promo) fail(422, 'PROMO_INVALID', 'Mã giảm giá không tồn tại hoặc đã hết hạn.', { code: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' })
  if (promo.membersOnly && !user) fail(403, 'PROMO_MEMBERS_ONLY', 'Mã này chỉ dành cho thành viên Nếp Club. Vui lòng đăng nhập.', { code: 'Mã này chỉ dành cho thành viên Nếp Club.' })
  const cart = cartOf(owner)
  const preview = computeCart({ ...cart, promo: null }, user)
  if (promo.minSubtotal && preview.totals.subtotal < promo.minSubtotal) fail(422, 'PROMO_MIN', `Đơn hàng cần tối thiểu ${promo.minSubtotal.toLocaleString('vi-VN')}₫ để dùng mã này.`, { code: 'Chưa đạt giá trị tối thiểu.' })
  cart.promo = promo.code
  return computeCart(cart, user)
})

route('DELETE', '/cart/promo', ({ owner, user }) => {
  const cart = cartOf(owner)
  cart.promo = null
  return computeCart(cart, user)
})

/* ------------------------------------------------------------------ */
/* Thanh toán & đơn hàng                                               */
/* ------------------------------------------------------------------ */

function addDays(n, from = new Date()) {
  const d = new Date(from)
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

function deliveryOptions(provinceCode, subtotal, user, promo) {
  const prov = findProvince(provinceCode)
  return deliveryMethods.map((m) => {
    let price = m.price
    if (m.id === 'tieu-chuan' && (subtotal >= m.freeOver || promo?.type === 'shipping' || isMemberTierFreeShip(user))) price = 0
    const days = m.daysFromProvince ? (prov?.days ?? [2, 4]) : m.days
    const available = m.expressOnly ? Boolean(prov?.express) : true
    return {
      id: m.id,
      name: m.name,
      description: m.description,
      price,
      basePrice: m.price,
      requiresStore: Boolean(m.requiresStore),
      available,
      unavailableReason: available ? null : 'Chưa hỗ trợ tại tỉnh/thành bạn chọn.',
      eta: [addDays(days[0]), addDays(days[1])],
    }
  })
}

route('GET', '/checkout/options', ({ owner, user, query }) => {
  const cart = computeCart(cartOf(owner), user)
  return {
    deliveryMethods: deliveryOptions(query.province, cart.totals.subtotal, user, cart.promo),
    paymentMethods: paymentMethods.map((m) => ({
      ...m,
      available: (!m.minTotal || cart.totals.total >= m.minTotal) && (!m.maxTotal || cart.totals.total <= m.maxTotal),
    })),
    pickupStores: stores.map((s) => toStore(s)),
  }
})

function luhn(num) {
  const s = num.replace(/\D/g, '')
  let sum = 0
  for (let i = 0; i < s.length; i++) {
    let d = Number(s[s.length - 1 - i])
    if (i % 2) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return s.length >= 13 && sum % 10 === 0
}
const cardBrand = (n) => (/^4/.test(n) ? 'visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'mastercard' : /^35/.test(n) ? 'jcb' : /^9704/.test(n) ? 'napas' : 'card')

function orderNumber() {
  const d = new Date()
  return `NP${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`
}

route('POST', '/orders', ({ owner, user, body }) => {
  const cartRaw = cartOf(owner)
  const cart = computeCart(cartRaw, user)
  if (!cart.items.length) fail(409, 'CART_EMPTY', 'Giỏ hàng của bạn đang trống.')
  if (cart.items.some((it) => !it.inStock || it.quantity > it.maxQuantity)) fail(409, 'OUT_OF_STOCK', 'Một số sản phẩm trong giỏ đã hết hàng, vui lòng kiểm tra lại.')

  const fields = {}
  const contact = body.contact ?? {}
  if (!contact.fullName?.trim()) fields['contact.fullName'] = 'Vui lòng nhập họ tên.'
  if (!EMAIL_RE.test(contact.email || '')) fields['contact.email'] = 'Email chưa đúng định dạng.'
  if (!PHONE_RE.test(contact.phone || '')) fields['contact.phone'] = 'Số điện thoại gồm 10 số, bắt đầu bằng 0.'

  const method = deliveryMethods.find((m) => m.id === body.deliveryMethodId) ?? fail(422, 'VALIDATION', 'Vui lòng chọn phương thức giao hàng.')
  let store = null
  let address = null
  if (method.requiresStore) {
    store = stores.find((s) => s.id === body.storeId)
    if (!store) fields.storeId = 'Vui lòng chọn cửa hàng nhận hàng.'
  } else {
    address = body.shippingAddress
    try {
      validateAddress(address ?? {})
    } catch (e) {
      Object.assign(fields, Object.fromEntries(Object.entries(e.fields ?? {}).map(([k, v]) => [`shippingAddress.${k}`, v])))
    }
  }
  const options = deliveryOptions(address?.province ?? store?.province, cart.totals.subtotal, user, cart.promo)
  const opt = options.find((o) => o.id === method.id)
  if (opt && !opt.available) fields.deliveryMethodId = opt.unavailableReason

  const pay = paymentMethods.find((m) => m.id === body.payment?.id) ?? fail(422, 'VALIDATION', 'Vui lòng chọn phương thức thanh toán.')
  const total = Math.max(0, cart.totals.subtotal - cart.totals.promoDiscount) + (opt?.price ?? 0)
  if (pay.maxTotal && total > pay.maxTotal) fields['payment.id'] = 'COD chỉ áp dụng cho đơn dưới 5.000.000₫.'
  if (pay.minTotal && total < pay.minTotal) fields['payment.id'] = 'Trả góp áp dụng cho đơn từ 1.500.000₫.'
  let payment = { id: pay.id, name: pay.name }
  if (pay.id === 'the' || pay.id === 'tra-gop') {
    const card = body.payment.card ?? {}
    if (card.savedCardId && user) {
      const saved = (db.state.cards[user.id] ?? []).find((c) => c.id === card.savedCardId)
      if (!saved) fields['payment.card'] = 'Thẻ đã lưu không tồn tại.'
      else payment = { ...payment, brand: saved.brand, last4: saved.last4 }
    } else {
      const number = String(card.number || '').replace(/\s/g, '')
      if (!luhn(number)) fields['payment.card.number'] = 'Số thẻ không hợp lệ.'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.exp || '')) fields['payment.card.exp'] = 'Hạn thẻ theo dạng MM/YY.'
      else {
        const [mm, yy] = card.exp.split('/').map(Number)
        if (new Date(2000 + yy, mm, 1) <= new Date()) fields['payment.card.exp'] = 'Thẻ đã hết hạn.'
      }
      if (!/^\d{3,4}$/.test(card.cvc || '')) fields['payment.card.cvc'] = 'Mã bảo mật gồm 3–4 số.'
      if (!card.holder?.trim()) fields['payment.card.holder'] = 'Vui lòng nhập tên in trên thẻ.'
      payment = { ...payment, brand: cardBrand(number), last4: number.slice(-4) }
      if (!Object.keys(fields).length && card.save && user) {
        ;(db.state.cards[user.id] ??= []).push({ id: uid('card_'), brand: payment.brand, last4: payment.last4, holder: card.holder.toUpperCase(), exp: card.exp })
      }
    }
    if (pay.id === 'tra-gop') payment.installments = Number(body.payment.installments) || 3
  }
  if (pay.id === 'vi') payment.wallet = body.payment.wallet || 'MoMo'
  if (Object.keys(fields).length) fail(422, 'VALIDATION', 'Vui lòng kiểm tra lại thông tin thanh toán.', fields)

  const now = new Date()
  const order = {
    number: orderNumber(),
    userId: user?.id ?? null,
    email: contact.email.trim(),
    channel: 'online',
    status: 'placed',
    placedAt: now.toISOString(),
    estimatedDelivery: opt.eta,
    items: cart.items.map((it) => ({ ...it, id: uid('oi_') })),
    contact: { fullName: contact.fullName.trim(), email: contact.email.trim(), phone: contact.phone },
    shippingAddress: address ? pickAddress(address) : null,
    store: store ? { id: store.id, name: store.name, address: `${store.address}, ${store.ward}, ${store.city}`, phone: store.phone } : null,
    delivery: { id: method.id, name: method.name, price: opt.price },
    payment,
    promo: cart.promo,
    note: body.note?.trim() || null,
    totals: { ...cart.totals, shipping: opt.price, total },
    pointsEarned: Math.floor(total / 1000),
  }
  db.state.orders.unshift(order)
  if (user) {
    user.points += order.pointsEarned
    if (body.saveAddress && address) {
      const list = (db.state.addresses[user.id] ??= [])
      const exists = list.some((a) => a.line1 === address.line1 && a.ward === address.ward && a.province === address.province)
      if (!exists) list.push({ id: uid('addr_'), ...pickAddress(address), isDefault: list.length === 0 })
    }
  }
  cartRaw.items = []
  cartRaw.promo = null
  return order
})

const STATUS_STEPS = ['placed', 'processing', 'shipped', 'delivered']
function withTimeline(o) {
  const cancellable = o.channel === 'online' && ['placed', 'processing'].includes(o.status)
  const idx = STATUS_STEPS.indexOf(o.status)
  const placed = new Date(o.placedAt).getTime()
  const end = o.deliveredAt ? new Date(o.deliveredAt).getTime() : Date.now()
  // Các mốc đã qua được rải đều giữa lúc đặt và hiện tại (không bao giờ ở tương lai)
  const step = idx > 0 ? Math.min(9 * 3600000, (end - placed) / idx) : 0
  const timeline = STATUS_STEPS.map((s, i) => ({
    status: s,
    done: o.status !== 'cancelled' && idx >= i,
    at: idx >= i ? new Date(i === idx && o.deliveredAt ? end : placed + i * step).toISOString() : null,
  }))
  return { ...o, cancellable, timeline }
}

route('GET', '/orders', ({ user, query }) => {
  const u = requireAuth(user)
  return db.state.orders.filter((o) => o.userId === u.id && (!query.channel || o.channel === query.channel)).map(withTimeline)
})

route('GET', '/orders/:number', ({ user, params, query }) => {
  const o = db.state.orders.find((x) => x.number === params.number) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy đơn hàng.')
  // Khách vãng lai xem đơn bằng email đặt hàng
  const allowed = (user && o.userId === user.id) || (query.email && query.email.trim().toLowerCase() === o.email.toLowerCase())
  if (!allowed) fail(user ? 404 : 401, user ? 'NOT_FOUND' : 'UNAUTHORIZED', user ? 'Không tìm thấy đơn hàng.' : 'Vui lòng nhập email đặt hàng để xem đơn.')
  return withTimeline(o)
})

route('POST', '/orders/:number/cancel', ({ user, params, body }) => {
  const o = db.state.orders.find((x) => x.number === params.number) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy đơn hàng.')
  const allowed = (user && o.userId === user.id) || (body.email && body.email.toLowerCase() === o.email.toLowerCase())
  if (!allowed) fail(403, 'FORBIDDEN', 'Bạn không có quyền huỷ đơn này.')
  if (!['placed', 'processing'].includes(o.status)) fail(409, 'NOT_CANCELLABLE', 'Đơn hàng đã được giao cho đơn vị vận chuyển nên không thể huỷ.')
  o.status = 'cancelled'
  o.cancelledAt = new Date().toISOString()
  o.cancelReason = body.reason || null
  if (user && o.pointsEarned) user.points = Math.max(0, user.points - o.pointsEarned)
  return withTimeline(o)
})

route('GET', '/checkout/cancel-reasons', () => cancelReasons)

/* ------------------------------------------------------------------ */
/* Bản tin & tiện ích                                                  */
/* ------------------------------------------------------------------ */

route('POST', '/newsletter', ({ body }) => {
  const fields = {}
  if (!EMAIL_RE.test(body.email || '')) fields.email = 'Email chưa đúng định dạng.'
  if (!findProvince(body.province)) fields.province = 'Vui lòng chọn tỉnh/thành phố.'
  if (!body.consent) fields.consent = 'Vui lòng đồng ý để nhận bản tin.'
  if (Object.keys(fields).length) fail(422, 'VALIDATION', 'Vui lòng kiểm tra lại thông tin.', fields)
  const exists = db.state.newsletter.find((n) => n.email.toLowerCase() === body.email.toLowerCase())
  if (exists) Object.assign(exists, { interests: body.interests ?? [], province: body.province })
  else db.state.newsletter.push({ email: body.email, province: body.province, interests: body.interests ?? [], at: new Date().toISOString() })
  return { ok: true, alreadySubscribed: Boolean(exists) }
})

route('GET', '/locations/provinces', () => provinces)

route('POST', '/dev/reset', () => {
  db.reset()
  return { ok: true }
})
