/**
 * Nội dung menu & footer. Có thể chuyển sang CMS sau này — cấu trúc giữ nguyên.
 */
export const mainNav = [
  {
    slug: 'nu',
    label: 'Nữ',
    columns: [
      {
        title: 'Nổi bật',
        links: [
          { label: 'Hàng mới về', to: '/c/nu-moi-ve' },
          { label: 'Bán chạy', to: '/c/ban-chay' },
          { label: 'Áo khoác mùa gió', to: '/c/nu-khoac' },
          { label: 'Sale đến 50%', to: '/c/nu-sale', tone: 'sale' },
        ],
      },
      {
        title: 'Quần áo',
        links: [
          { label: 'Xem tất cả', to: '/c/nu' },
          { label: 'Đầm & váy liền', to: '/c/nu-dam' },
          { label: 'Áo', to: '/c/nu-ao' },
          { label: 'Quần & chân váy', to: '/c/nu-quan' },
          { label: 'Áo khoác & blazer', to: '/c/nu-khoac' },
          { label: 'Đồ len', to: '/c/nu-len' },
          { label: 'Phụ kiện', to: '/c/phu-kien' },
        ],
      },
      {
        title: 'Khám phá',
        links: [
          { label: 'Chọn lựa bền vững hơn', to: '/c/ben-vung' },
          { label: 'Đổi cũ lấy mới', to: '/doi-cu-lay-moi' },
          { label: 'Nếp Club', to: '/nep-club' },
          { label: 'Thẻ quà tặng', to: '/thong-tin/the-qua-tang' },
        ],
      },
    ],
    promos: [
      { title: 'Đầm cho ngày se lạnh', to: '/c/nu-dam', image: '/images/categories/nu-dam.jpg' },
      { title: 'Công sở thảnh thơi', to: '/c/nu-khoac', image: '/images/categories/nu-khoac.jpg' },
    ],
  },
  {
    slug: 'nam',
    label: 'Nam',
    columns: [
      {
        title: 'Nổi bật',
        links: [
          { label: 'Hàng mới về', to: '/c/nam-moi-ve' },
          { label: 'Bán chạy', to: '/c/ban-chay' },
          { label: 'Áo thun cơ bản', to: '/c/nam-ao-thun' },
          { label: 'Sale đến 50%', to: '/c/nam-sale', tone: 'sale' },
        ],
      },
      {
        title: 'Quần áo',
        links: [
          { label: 'Xem tất cả', to: '/c/nam' },
          { label: 'Áo thun & polo', to: '/c/nam-ao-thun' },
          { label: 'Sơ mi', to: '/c/nam-so-mi' },
          { label: 'Quần & jeans', to: '/c/nam-quan' },
          { label: 'Áo khoác', to: '/c/nam-khoac' },
          { label: 'Len & hoodie', to: '/c/nam-len' },
          { label: 'Phụ kiện', to: '/c/phu-kien' },
        ],
      },
      {
        title: 'Khám phá',
        links: [
          { label: 'Chọn lựa bền vững hơn', to: '/c/ben-vung' },
          { label: 'Đổi cũ lấy mới', to: '/doi-cu-lay-moi' },
          { label: 'Ưu đãi sinh viên', to: '/thong-tin/uu-dai-sinh-vien' },
        ],
      },
    ],
    promos: [
      { title: 'Áo thun mặc mãi', to: '/c/nam-ao-thun', image: '/images/categories/nam-ao-thun.jpg' },
      { title: 'Sơ mi đi làm', to: '/c/nam-so-mi', image: '/images/categories/nam-so-mi.jpg' },
    ],
  },
  {
    slug: 'tre-em',
    label: 'Trẻ em',
    columns: [
      {
        title: 'Trẻ em',
        links: [
          { label: 'Xem tất cả', to: '/c/tre-em-tat-ca' },
          { label: 'Áo thun', to: '/c/tre-em-tat-ca?type=ao-thun' },
          { label: 'Chân váy cho bé gái', to: '/c/tre-em-tat-ca?type=chan-vay' },
          { label: 'Áo len & áo khoác', to: '/c/tre-em-tat-ca?type=len' },
          { label: 'Bộ đồ', to: '/c/tre-em-tat-ca?type=bo' },
        ],
      },
      {
        title: 'Hướng dẫn',
        links: [
          { label: 'Bảng size trẻ em', to: '/thong-tin/bang-size' },
          { label: 'Vải an toàn cho làn da bé', to: '/thong-tin/chat-lieu' },
        ],
      },
    ],
    promos: [{ title: 'Chạy nhảy cả ngày', to: '/c/tre-em-tat-ca', image: '/images/categories/tre-em.jpg' }],
  },
  {
    slug: 'nha',
    label: 'Nhà',
    columns: [
      {
        title: 'Nhà',
        links: [
          { label: 'Xem tất cả', to: '/c/nha-tat-ca' },
          { label: 'Gối tựa', to: '/c/nha-tat-ca?type=goi' },
          { label: 'Ga giường', to: '/c/nha-tat-ca?type=ga-giuong' },
          { label: 'Khăn tắm', to: '/c/nha-tat-ca?type=khan-tam' },
          { label: 'Gốm & ly', to: '/c/nha-tat-ca?type=gom' },
          { label: 'Nến thơm', to: '/c/nha-tat-ca?type=nen' },
        ],
      },
    ],
    promos: [{ title: 'Góc nhà dịu mắt', to: '/c/nha-tat-ca', image: '/images/categories/nha.jpg' }],
  },
  {
    slug: 'lam-dep',
    label: 'Làm đẹp',
    columns: [
      {
        title: 'Làm đẹp',
        links: [
          { label: 'Xem tất cả', to: '/c/lam-dep-tat-ca' },
          { label: 'Chăm sóc da', to: '/c/lam-dep-tat-ca?type=cham-soc-da' },
          { label: 'Son môi', to: '/c/lam-dep-tat-ca?type=son' },
          { label: 'Chăm sóc cơ thể', to: '/c/lam-dep-tat-ca?type=cham-soc-co-the' },
          { label: 'Trang điểm', to: '/c/lam-dep-tat-ca?type=trang-diem' },
        ],
      },
    ],
    promos: [{ title: 'Da khoẻ mỗi sáng', to: '/c/lam-dep-tat-ca', image: '/images/categories/lam-dep.jpg' }],
  },
  { slug: 'sale', label: 'Sale', to: '/c/sale', tone: 'sale' },
]

export const footerColumns = [
  {
    title: 'Mua sắm',
    links: [
      { label: 'Nữ', to: '/nu' },
      { label: 'Nam', to: '/nam' },
      { label: 'Trẻ em', to: '/tre-em' },
      { label: 'Nhà', to: '/nha' },
      { label: 'Làm đẹp', to: '/lam-dep' },
      { label: 'Sale', to: '/c/sale' },
      { label: 'Thẻ quà tặng', to: '/thong-tin/the-qua-tang' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', to: '/thong-tin/tro-giup' },
      { label: 'Theo dõi đơn hàng', to: '/theo-doi-don-hang' },
      { label: 'Giao hàng', to: '/thong-tin/giao-hang' },
      { label: 'Đổi trả & hoàn tiền', to: '/thong-tin/doi-tra' },
      { label: 'Bảng size', to: '/thong-tin/bang-size' },
      { label: 'Tìm cửa hàng', to: '/cua-hang' },
      { label: 'Liên hệ', to: '/thong-tin/lien-he' },
    ],
  },
  {
    title: 'Về Nếp',
    links: [
      { label: 'Câu chuyện thương hiệu', to: '/thong-tin/ve-nep' },
      { label: 'Đổi cũ lấy mới', to: '/doi-cu-lay-moi' },
      { label: 'Chất liệu & bền vững', to: '/thong-tin/chat-lieu' },
      { label: 'Tuyển dụng', to: '/thong-tin/tuyen-dung' },
      { label: 'Chính sách bảo mật', to: '/thong-tin/bao-mat' },
      { label: 'Điều khoản sử dụng', to: '/thong-tin/dieu-khoan' },
    ],
  },
]

export const announcements = [
  { text: 'Miễn phí giao hàng cho đơn từ 499.000₫', to: '/thong-tin/giao-hang' },
  { text: 'Đổi cũ lấy mới — mang 1 kg quần áo cũ, nhận ngay 50.000₫', to: '/doi-cu-lay-moi' },
  { text: 'Thành viên Nếp Club: giảm thêm 15% với mã CLUB15', to: '/nep-club' },
  { text: 'Đổi trả miễn phí trong 30 ngày tại mọi cửa hàng', to: '/thong-tin/doi-tra' },
]
