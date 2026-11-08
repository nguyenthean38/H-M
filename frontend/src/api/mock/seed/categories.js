/**
 * Cây danh mục: bộ phận (department) → danh mục (category) → loại sản phẩm (type).
 * `types` hiển thị thành các tab lọc nhanh ở đầu trang danh mục.
 */
export const departments = [
  { slug: 'nu', name: 'Nữ', hero: 'campaign/hero-nu-1.jpg' },
  { slug: 'nam', name: 'Nam', hero: 'campaign/hero-nam-1.jpg' },
  { slug: 'tre-em', name: 'Trẻ em', hero: 'campaign/hero-tre-em.jpg' },
  { slug: 'nha', name: 'Nhà', hero: 'campaign/hero-nha.jpg' },
  { slug: 'lam-dep', name: 'Làm đẹp', hero: 'campaign/hero-lam-dep.jpg' },
]

export const typeLabels = {
  dam: 'Đầm & váy liền',
  ao: 'Áo kiểu',
  'so-mi': 'Sơ mi',
  'ao-thun': 'Áo thun',
  polo: 'Polo',
  'ba-lo': 'Áo ba lỗ',
  quan: 'Quần',
  jeans: 'Jeans',
  short: 'Quần short',
  'chan-vay': 'Chân váy',
  khoac: 'Áo khoác',
  blazer: 'Blazer',
  len: 'Áo len',
  hoodie: 'Hoodie & nỉ',
  bo: 'Bộ đồ',
  bodysuit: 'Bộ liền thân',
  'ao-choang': 'Áo choàng tắm',
  'cham-soc-co-the': 'Chăm sóc cơ thể',
  tui: 'Túi xách',
  giay: 'Giày',
  mu: 'Mũ',
  kinh: 'Kính mát',
  khan: 'Khăn',
  'trang-suc': 'Trang sức',
  'that-lung': 'Thắt lưng',
  goi: 'Gối tựa',
  chan: 'Chăn & thảm',
  'ga-giuong': 'Ga giường',
  'khan-tam': 'Khăn tắm',
  gom: 'Gốm & ly',
  nen: 'Nến thơm',
  binh: 'Bình hoa',
  gio: 'Giỏ & hộp',
  'cham-soc-da': 'Chăm sóc da',
  son: 'Son môi',
  'nuoc-hoa': 'Nước hoa',
  'trang-diem': 'Trang điểm',
  'cham-soc-toc': 'Chăm sóc tóc',
}

export const categories = [
  // Nữ
  { slug: 'nu-dam', department: 'nu', name: 'Đầm & váy liền', title: 'Đầm & váy liền nữ', types: ['dam'], image: 'categories/nu-dam.jpg' },
  { slug: 'nu-ao', department: 'nu', name: 'Áo', title: 'Áo nữ', types: ['ao', 'so-mi', 'ao-thun', 'ba-lo'], image: 'categories/nu-ao.jpg' },
  { slug: 'nu-quan', department: 'nu', name: 'Quần & chân váy', title: 'Quần & chân váy nữ', types: ['quan', 'jeans', 'short', 'chan-vay'], image: 'categories/nu-quan.jpg' },
  { slug: 'nu-khoac', department: 'nu', name: 'Áo khoác & blazer', title: 'Áo khoác & blazer nữ', types: ['khoac', 'blazer'], image: 'categories/nu-khoac.jpg' },
  { slug: 'nu-len', department: 'nu', name: 'Đồ len', title: 'Đồ len nữ', types: ['len', 'hoodie'], image: 'categories/nu-ao.jpg' },
  // Nam
  { slug: 'nam-ao-thun', department: 'nam', name: 'Áo thun & polo', title: 'Áo thun & polo nam', types: ['ao-thun', 'polo', 'ba-lo'], image: 'categories/nam-ao-thun.jpg' },
  { slug: 'nam-so-mi', department: 'nam', name: 'Sơ mi', title: 'Sơ mi nam', types: ['so-mi'], image: 'categories/nam-so-mi.jpg' },
  { slug: 'nam-quan', department: 'nam', name: 'Quần & jeans', title: 'Quần & jeans nam', types: ['quan', 'jeans', 'short'], image: 'categories/nam-quan.jpg' },
  { slug: 'nam-khoac', department: 'nam', name: 'Áo khoác', title: 'Áo khoác nam', types: ['khoac', 'blazer'], image: 'categories/nam-khoac.jpg' },
  { slug: 'nam-len', department: 'nam', name: 'Len & hoodie', title: 'Len & hoodie nam', types: ['len', 'hoodie'], image: 'categories/nam-khoac.jpg' },
  // Trẻ em
  { slug: 'tre-em-tat-ca', department: 'tre-em', name: 'Tất cả đồ trẻ em', title: 'Thời trang trẻ em', types: ['ao-thun', 'ao', 'len', 'khoac', 'bo', 'bodysuit', 'chan-vay', 'ao-choang'], image: 'categories/tre-em.jpg' },
  // Phụ kiện (dùng chung cho Nữ & Nam)
  { slug: 'phu-kien', department: 'nu', name: 'Phụ kiện', title: 'Phụ kiện', types: ['tui', 'giay', 'mu', 'kinh', 'khan', 'trang-suc', 'that-lung'], image: 'categories/phu-kien.jpg', shared: true },
  // Nhà
  { slug: 'nha-tat-ca', department: 'nha', name: 'Tất cả đồ nhà', title: 'Đồ dùng nhà cửa', types: ['goi', 'chan', 'ga-giuong', 'khan-tam', 'gom', 'nen', 'binh', 'gio'], image: 'categories/nha.jpg' },
  // Làm đẹp
  { slug: 'lam-dep-tat-ca', department: 'lam-dep', name: 'Tất cả làm đẹp', title: 'Làm đẹp', types: ['cham-soc-da', 'cham-soc-co-the', 'son', 'trang-diem'], image: 'categories/lam-dep.jpg' },
]

/** Danh mục "ảo" — lọc theo thuộc tính thay vì theo category. */
export const virtualCategories = [
  { slug: 'moi-ve', name: 'Hàng mới về', title: 'Hàng mới về', filter: { badge: 'moi' } },
  { slug: 'ban-chay', name: 'Bán chạy', title: 'Bán chạy nhất', filter: { badge: 'ban-chay' } },
  { slug: 'sale', name: 'Sale', title: 'Sale đến 50%', filter: { sale: 'true' } },
  { slug: 'ben-vung', name: 'Chất liệu bền vững', title: 'Chọn lựa bền vững hơn', filter: { badge: 'ben-vung' } },
  { slug: 'nu', name: 'Tất cả đồ nữ', title: 'Thời trang nữ', filter: { department: 'nu' } },
  { slug: 'nam', name: 'Tất cả đồ nam', title: 'Thời trang nam', filter: { department: 'nam' } },
  { slug: 'nu-moi-ve', name: 'Nữ — Hàng mới về', title: 'Hàng mới về cho nữ', filter: { department: 'nu', badge: 'moi' } },
  { slug: 'nam-moi-ve', name: 'Nam — Hàng mới về', title: 'Hàng mới về cho nam', filter: { department: 'nam', badge: 'moi' } },
  { slug: 'nu-sale', name: 'Nữ — Sale', title: 'Sale đồ nữ', filter: { department: 'nu', sale: 'true' } },
  { slug: 'nam-sale', name: 'Nam — Sale', title: 'Sale đồ nam', filter: { department: 'nam', sale: 'true' } },
]
