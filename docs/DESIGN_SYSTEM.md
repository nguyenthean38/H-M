# Design system — Nếp

Tinh thần: **tạp chí thời trang tối giản, ấm và chậm**. Nền giấy thay vì trắng tinh, chữ serif tương phản cho tiêu đề, góc vuông, đường kẻ mảnh, một màu nhấn duy nhất là **xanh chàm** — gợi nghề nhuộm chàm truyền thống. Chữ ký hình ảnh là **nếp gấp góc** (logo, nhãn, ghim bản đồ).

Token khai báo trong `frontend/src/styles/index.css` (Tailwind v4 `@theme`) nên dùng trực tiếp như class: `bg-paper`, `text-cham`, `border-line`…

## Màu

| Token | Giá trị | Dùng cho |
|---|---|---|
| `paper` | `#f5f1ea` | Nền trang |
| `paper-2` | `#ece6dc` | Nền khối phụ, khung ảnh khi đang tải, skeleton |
| `surface` | `#ffffff` | Modal, ngăn kéo, ô nhập |
| `ink` / `ink-2` | `#1b1a17` / `#3d3a34` | Chữ chính, nút chính |
| `muted` / `subtle` | `#6f6a61` / `#9a948a` | Chữ phụ, placeholder, size hết hàng |
| `line` / `line-strong` | `#e2dbcf` / `#c9c0b1` | Đường kẻ, viền ô nhập |
| `cham` (+ `600`, `300`, `50`) | `#24357a` | Màu nhấn thương hiệu: thanh thông báo, huy hiệu số lượng, băng "Đổi cũ lấy mới", focus ring, link hover |
| `son` (+ `50`) | `#c2352b` | Giá giảm, nhãn −%, lỗi, huỷ đơn |
| `la` (+ `50`) | `#2f7d4f` | Thành công, ô nhập hợp lệ ✓, chất liệu bền vững |
| `nghe` | `#d9a21b` | Cảnh báo sắp hết hàng |

## Chữ

| Class | Font | Dùng cho |
|---|---|---|
| `ds-display` | Fraunces, 36–76px, opsz 144 | Tiêu đề hero, "Cảm ơn bạn!" |
| `ds-h1` | Fraunces, 32–52px | Tiêu đề trang |
| `ds-h2` | Fraunces, 24–34px | Tiêu đề mục |
| `ds-h3` | Be Vietnam Pro 18px semibold | Tiêu đề khối nhỏ |
| `ds-label` | Be Vietnam Pro 11px, in hoa, giãn chữ 0.12em | Nhãn mục, tiêu đề modal/ngăn kéo, nút |
| `ds-eyebrow` | 12px in hoa, màu `muted` | Dòng dẫn phía trên tiêu đề |
| thân bài | Be Vietnam Pro 14px | Mọi nội dung còn lại |

Cả hai font đều có bộ ký tự tiếng Việt đầy đủ, được đóng gói cùng ứng dụng qua `@fontsource` (không gọi Google Fonts lúc chạy).

## Bố cục

- `ds-container`: tối đa 1600px, lề 16 / 24 / 40px theo màn hình.
- Lưới sản phẩm: 2 cột (điện thoại) → 4 cột (≥1024px), khoảng cách dọc 32px.
- Ảnh sản phẩm luôn tỉ lệ **3:4**; hero dùng **song ảnh** (2 ảnh dọc cạnh nhau) để ảnh 960px vẫn nét trên màn lớn.
- Header dính, cao 64px + thanh thông báo 36px; panel thông tin trang sản phẩm dính ở `top: 120px`.

## Thành phần dùng chung (`components/ui`)

| Thành phần | Ghi chú |
|---|---|
| `Button` | `primary` (mực) · `cham` · `outline` · `light` · `ghost` · `link`; cỡ `sm/md/lg`; `loading`; `to` → Link |
| `IconButton` | Nút biểu tượng có `badge` số lượng |
| `Input`, `Select`, `Textarea`, `Field` | Nhãn trên ô, `valid` hiện ✓ xanh, `error` hiện dòng đỏ có biểu tượng |
| `PasswordInput` | Nút ẩn/hiện + danh sách quy tắc mật khẩu đổi màu theo thời gian thực |
| `DateOfBirthInput` | Ba ô DD / MM / YYYY (thứ tự ngày tháng của người Việt) |
| `Checkbox`, `Radio` | Tự vẽ, vuông / tròn, viền mực |
| `QuantityStepper` | − số + ; về 1 thì nút trái thành thùng rác |
| `Modal` | Giữa màn hình (desktop) / trượt từ dưới (điện thoại), tiêu đề `ds-label` |
| `Drawer` | Ngăn kéo phải; `onBack` tạo panel con (Bộ lọc → Sắp xếp) |
| `Accordion`, `Tabs` | +/− và tab gạch chân |
| `Price`, `Badge`, `Stars`, `Swatch` | Giá giảm màu son; nhãn có nếp gấp góc (`ds-fold`) |
| `Notice`, `EmptyState`, `Toaster`, `Spinner`, `PageLoader`, `ProgressBar`, `Breadcrumbs`, `DecorativeQr` | |

## Thành phần nghiệp vụ

- `components/product`: `ProductCard` (đổi ảnh khi rê, chấm màu đổi ảnh), `ProductRail`, `ProductListing` (thanh "Nhận hôm nay tại cửa hàng", bộ lọc, xem thêm), `FilterDrawer`, `StorePickerDrawer`, `ProductGallery` (cận cảnh chất liệu khi chỉ có 1 ảnh, phóng to toàn màn hình), `SizeGuideDrawer` (gợi ý size theo chiều cao & cân nặng), `ReviewsDrawer`, `NotifyMeDrawer`.
- `components/layout`: `Header` + menu lớn, `MobileMenu`, `SearchPanel` (gợi ý trực tiếp, lịch sử tìm), `LocationModal` (chọn tỉnh giao hàng theo miền), `Footer`.
- `components/home`: `DiptychHero` (song ảnh + điểm "mua theo ảnh"), `Marquee`, `CategoryTiles`, `SplitFeature`, `RecycleBand`, `ClubBand`.

## Giọng văn

Tiếng Việt tự nhiên, xưng "bạn", câu ngắn. Nút dùng động từ ("Thêm vào giỏ hàng", "Đặt hàng"). Thông báo lỗi nói rõ cách sửa ("Số điện thoại gồm 10 số, bắt đầu bằng 0."). Giá viết `349.000₫`, ngày `14/11/2026`, thứ "Thứ Tư, 12/11".

## Khả năng truy cập

Focus ring chàm 2px, `aria-*` cho modal/ngăn kéo/tab/radio tự vẽ, Esc để đóng overlay, khoá cuộn nền, link "Bỏ qua đến nội dung chính", ảnh trang trí có `alt=""`.
