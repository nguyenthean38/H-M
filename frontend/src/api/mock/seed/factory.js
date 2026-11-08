/**
 * Biến định nghĩa sản phẩm gọn (products.js) thành bản ghi đầy đủ như backend sẽ trả về:
 * biến thể màu, bảng size, tồn kho online & tại từng cửa hàng, chất liệu, hướng dẫn bảo quản...
 * Mọi số liệu "ngẫu nhiên" đều sinh từ mã sản phẩm nên ổn định giữa các lần tải trang.
 */
import { typeLabels } from './categories'

/* ---------- PRNG ổn định ---------- */
export function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
export function rng(seed) {
  let a = typeof seed === 'string' ? hashStr(seed) : seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const pick = (r, list) => list[Math.floor(r() * list.length)]

/* ---------- Bảng tra ---------- */
export const SIZE_SETS = {
  adult: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  kids: ['2-3T', '4-5T', '6-7T', '8-9T', '10-11T', '12-13T'],
  'shoes-nu': ['35', '36', '37', '38', '39', '40'],
  'shoes-nam': ['39', '40', '41', '42', '43', '44'],
  one: ['Một cỡ'],
}

export const MATERIALS = {
  cotton: { label: 'Cotton', composition: '100% cotton', care: ['Giặt máy ở 40°C', 'Không dùng chất tẩy', 'Là ở nhiệt độ trung bình', 'Phơi trong bóng râm'] },
  'cotton-huu-co': { label: 'Cotton hữu cơ', composition: '100% cotton hữu cơ', care: ['Giặt máy ở 30°C', 'Không dùng chất tẩy', 'Là ở nhiệt độ trung bình'], sustainable: true },
  linen: { label: 'Linen', composition: '100% linen (lanh)', care: ['Giặt máy ở 30°C, chế độ nhẹ', 'Không vắt mạnh', 'Là khi vải còn ẩm'], sustainable: true },
  'linen-pha': { label: 'Linen pha', composition: '55% linen, 45% viscose', care: ['Giặt tay hoặc giặt máy chế độ nhẹ', 'Phơi ngang', 'Là ở nhiệt độ thấp'] },
  denim: { label: 'Denim', composition: '99% cotton, 1% elastane', care: ['Lộn trái khi giặt', 'Giặt máy ở 30°C', 'Không sấy khô'] },
  'denim-tai-che': { label: 'Denim tái chế', composition: '80% cotton, 20% cotton tái chế', care: ['Lộn trái khi giặt', 'Giặt máy ở 30°C', 'Không sấy khô'], sustainable: true },
  len: { label: 'Len', composition: '70% acrylic, 30% len lông cừu', care: ['Giặt tay nước lạnh', 'Phơi ngang', 'Không vắt xoắn'] },
  'len-merino': { label: 'Len merino', composition: '100% len merino', care: ['Giặt tay nước lạnh', 'Phơi ngang trong bóng râm'] },
  lua: { label: 'Lụa', composition: '100% lụa tơ tằm', care: ['Giặt khô', 'Không phơi trực tiếp dưới nắng'] },
  satin: { label: 'Satin', composition: '100% polyester tái chế', care: ['Giặt tay', 'Là mặt trái ở nhiệt độ thấp'], sustainable: true },
  viscose: { label: 'Viscose', composition: '100% viscose LENZING™ ECOVERO™', care: ['Giặt máy ở 30°C chế độ nhẹ', 'Phơi trong bóng râm'], sustainable: true },
  kaki: { label: 'Kaki', composition: '98% cotton, 2% elastane', care: ['Giặt máy ở 40°C', 'Là ở nhiệt độ trung bình'] },
  ni: { label: 'Nỉ bông', composition: '80% cotton, 20% polyester', care: ['Lộn trái khi giặt', 'Giặt máy ở 30°C'] },
  da: { label: 'Da', composition: 'Da bò thuộc thực vật', care: ['Lau bằng khăn ẩm', 'Bảo quản trong túi vải'] },
  'da-pu': { label: 'Giả da', composition: 'Mặt ngoài 100% polyurethane, lót 100% polyester', care: ['Lau bằng khăn ẩm'] },
  coi: { label: 'Cói', composition: '100% cói tự nhiên', care: ['Tránh nước', 'Bảo quản nơi khô ráo'], sustainable: true },
  canvas: { label: 'Canvas', composition: '100% cotton canvas', care: ['Giặt tay', 'Không dùng chất tẩy'] },
  gom: { label: 'Gốm', composition: 'Gốm sứ tráng men', care: ['Dùng được trong máy rửa bát', 'Dùng được trong lò vi sóng'] },
  sap: { label: 'Sáp đậu nành', composition: 'Sáp đậu nành, tinh dầu thiên nhiên, bấc cotton', care: ['Cắt bấc còn 5 mm trước mỗi lần đốt', 'Không đốt quá 3 giờ liên tục'] },
  thuy_tinh: { label: 'Thuỷ tinh', composition: 'Thuỷ tinh thổi thủ công', care: ['Rửa tay'] },
  kim_loai: { label: 'Kim loại', composition: 'Đồng thau mạ vàng 18K', care: ['Tránh nước hoa và hoá chất', 'Bảo quản trong hộp'] },
  my_pham: { label: 'Mỹ phẩm', composition: 'Thành phần chi tiết in trên bao bì', care: ['Bảo quản nơi khô mát', 'Dùng trong 12 tháng sau khi mở nắp'] },
}

const FIT_LABEL = { rong: 'Dáng rộng', vua: 'Dáng suông vừa', om: 'Dáng ôm', 'oversize': 'Dáng oversize' }

/** Màu → nhóm màu dùng cho bộ lọc */
export const COLOR_FAMILIES = {
  trang: { name: 'Trắng', hex: '#ffffff' },
  kem: { name: 'Kem & be', hex: '#e7dcc6' },
  den: { name: 'Đen', hex: '#1b1a17' },
  xam: { name: 'Xám', hex: '#9b9a96' },
  nau: { name: 'Nâu', hex: '#7a5235' },
  xanh: { name: 'Xanh dương', hex: '#3d5fa8' },
  cham: { name: 'Xanh chàm', hex: '#24357a' },
  'xanh-la': { name: 'Xanh lá', hex: '#5b7a4a' },
  do: { name: 'Đỏ', hex: '#b8322a' },
  hong: { name: 'Hồng', hex: '#e7a6ad' },
  vang: { name: 'Vàng', hex: '#e2b53e' },
  cam: { name: 'Cam', hex: '#d9773a' },
  tim: { name: 'Tím', hex: '#7f5f9c' },
  'nhieu-mau': { name: 'Nhiều màu', hex: 'conic-gradient(#b8322a,#e2b53e,#5b7a4a,#3d5fa8,#7f5f9c,#b8322a)' },
}

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function sizeSetFor(def) {
  if (def.sizes) return def.sizes
  if (def.dept === 'tre-em') return SIZE_SETS.kids
  if (def.type === 'giay') return def.dept === 'nam' ? SIZE_SETS['shoes-nam'] : SIZE_SETS['shoes-nu']
  if (['nha', 'lam-dep'].includes(def.dept) || ['tui', 'mu', 'kinh', 'khan', 'trang-suc'].includes(def.type)) return SIZE_SETS.one
  if (def.type === 'that-lung') return ['S/M', 'L/XL']
  return SIZE_SETS.adult
}

function sizeGuideFor(def, sizes) {
  if (sizes.length === 1 || ['nha', 'lam-dep'].includes(def.dept)) return null
  if (def.dept === 'tre-em') return 'kids'
  if (def.type === 'giay') return 'shoes'
  if (['quan', 'jeans', 'short', 'chan-vay'].includes(def.type)) return def.dept === 'nam' ? 'bottom-nam' : 'bottom-nu'
  if (['tui', 'that-lung'].includes(def.type)) return null
  return def.dept === 'nam' ? 'top-nam' : 'top-nu'
}

const img = (file, alt) => ({ url: `/images/${file}`, alt })

/** Tồn kho online theo size: một số size hết hàng để demo "Báo khi có hàng". */
function buildStock(id, colorCode, sizes) {
  const r = rng(`${id}:${colorCode}:stock`)
  const stock = {}
  sizes.forEach((s) => {
    const roll = r()
    stock[s] = roll < 0.17 ? 0 : roll < 0.3 ? 1 + Math.floor(r() * 3) : 4 + Math.floor(r() * 30)
  })
  // luôn còn ít nhất 2 size
  const inStock = sizes.filter((s) => stock[s] > 0)
  if (inStock.length < Math.min(2, sizes.length)) sizes.slice(0, 2).forEach((s) => (stock[s] = 6))
  return stock
}

export function buildProduct(def, index) {
  const r = rng(def.id)
  const material = MATERIALS[def.material] ?? MATERIALS.cotton
  const sizes = sizeSetFor(def)
  const colors = def.colors.map((c) => {
    const code = c.code ?? slugify(c.name)
    return {
      code,
      name: c.name,
      hex: c.hex,
      family: c.family,
      images: c.images.map((f, i) => img(f, `${def.name} — ${c.name}${i ? ` (ảnh ${i + 1})` : ''}`)),
      stock: buildStock(def.id, code, sizes),
    }
  })
  const badges = [...(def.badges ?? [])]
  if (material.sustainable && !badges.includes('ben-vung')) badges.push('ben-vung')
  const daysAgo = badges.includes('moi') ? Math.floor(r() * 12) : 20 + Math.floor(r() * 160)
  const discountPercent = def.was ? Math.round((1 - def.price / def.was) * 100) : null
  return {
    id: def.id,
    slug: `${slugify(def.name)}-${def.id.toLowerCase()}`,
    articleNo: String(1000000000 + (hashStr(def.id) % 899999999)),
    name: def.name,
    department: def.dept,
    category: def.cat,
    type: def.type,
    typeLabel: typeLabels[def.type] ?? def.type,
    price: def.price,
    originalPrice: def.was ?? null,
    discountPercent,
    badges,
    fit: def.fit ?? null,
    fitLabel: def.fit ? FIT_LABEL[def.fit] : null,
    material: def.material,
    materialLabel: material.label,
    composition: def.composition ?? material.composition,
    care: material.care,
    sustainable: Boolean(material.sustainable),
    description: def.desc,
    details: def.details ?? {},
    sizes,
    sizeGuide: sizeGuideFor(def, sizes),
    colors,
    popularity: def.popularity ?? Math.round(r() * 1000) + (badges.includes('ban-chay') ? 1500 : 0),
    createdAt: new Date(Date.UTC(2026, 10, 8) - daysAgo * 86400000).toISOString(),
    order: index,
    tags: def.tags ?? [],
  }
}

/** Tồn kho tại cửa hàng (dùng cho "Nhận hôm nay tại cửa hàng"). */
export function storeStock(storeId, product, colorCode, size) {
  const r = rng(`${storeId}:${product.id}:${colorCode ?? ''}:${size ?? ''}`)
  return r() < 0.62 ? 1 + Math.floor(r() * 9) : 0
}
