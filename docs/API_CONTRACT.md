# Hợp đồng API — Nếp

Frontend gọi API qua một lớp duy nhất (`frontend/src/api/http.js`). Khi `VITE_USE_MOCK=true` (mặc định), request được chuyển tới **mock server chạy trong trình duyệt** (`frontend/src/api/mock/server.js`) — đây chính là bản hiện thực tham chiếu của tài liệu này. Khi backend sẵn sàng, đặt `VITE_USE_MOCK=false` và `VITE_API_URL=https://api.example.com/api/v1`; giao diện không cần sửa.

## Quy ước chung

| Mục | Quy ước |
|---|---|
| Base URL | `/api/v1` |
| Định dạng | JSON, UTF-8. Tiền tệ là **số nguyên VND** (`349000`), thời gian là ISO 8601 (UTC) |
| Xác thực | `Authorization: Bearer <token>` (JWT hoặc session token) |
| Giỏ hàng khách | Header `X-Cart-Id: guest_xxx` do frontend sinh và lưu `localStorage`. Khi đăng nhập/đăng ký, backend **gộp** giỏ hàng & danh sách yêu thích của khách vào tài khoản |
| Lỗi | HTTP status phù hợp + `{ "error": { "code": "VALIDATION", "message": "…", "fields": { "email": "…" } } }` |
| Mã lỗi | `VALIDATION` 422, `UNAUTHORIZED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `OUT_OF_STOCK` 409, `QUANTITY_LIMIT` 409, `CART_EMPTY` 409, `NOT_CANCELLABLE` 409, `PROMO_INVALID` 422, `PROMO_MIN` 422, `PROMO_MEMBERS_ONLY` 403, `INVALID_CREDENTIALS` 401, `TOKEN_INVALID` 400 |
| Lỗi theo trường | `fields` dùng đường dẫn chấm cho dữ liệu lồng nhau, ví dụ `shippingAddress.phone`, `payment.card.number` — frontend gắn lỗi vào đúng ô nhập |

## Mô hình dữ liệu

```ts
ProductSummary {
  id: string            // "NP1001"
  slug: string          // "ao-thun-cotton-dang-rong-np1001"
  name: string
  department: 'nu' | 'nam' | 'tre-em' | 'nha' | 'lam-dep'
  category: string      // slug danh mục, ví dụ "nam-ao-thun"
  type: string          // loại: "ao-thun", "dam", "jeans"…
  typeLabel: string
  price: number         // giá bán (VND)
  originalPrice: number | null   // giá gốc nếu đang giảm
  discountPercent: number | null
  badges: ('moi' | 'ban-chay' | 'ben-vung')[]
  image: Image; hoverImage: Image | null
  colors: { code, name, hex, image: Image }[]
  rating: { average: number, count: number }
}
Image { url: string, alt: string }

ProductDetail extends ProductSummary {
  articleNo, description, details: Record<string,string>,
  fit, fitLabel, material, materialLabel, composition, care: string[], sustainable: boolean,
  sizes: string[]                       // ["XS","S","M","L","XL","XXL"] | ["Một cỡ"] | ["2-3T",…]
  sizeGuide: 'top-nu'|'top-nam'|'bottom-nu'|'bottom-nam'|'kids'|'shoes'|null
  colors: { code, name, hex, images: Image[], available: boolean,
            sizes: { label, stock, inStock, lowStock }[] }[]
  breadcrumbs: { label, href|null }[]
}

Cart {
  items: { id, productId, slug, name, articleNo, colorCode, colorName, size, quantity,
           price, originalPrice, image, inStock, maxQuantity, lineTotal }[]
  count: number
  promo: { code, label, type } | null
  totals: { orderValue, saleDiscount, promoDiscount, subtotal, shipping, total }
  freeShippingThreshold: 499000, freeShippingRemaining: number,
  freeShippingReason: 'threshold' | 'promo' | 'member' | null
}

Address { id, fullName, phone /* 0xxxxxxxxx */, line1, ward, province /* mã tỉnh */, label, isDefault }

Order {
  number /* "NP2611-0482" */, userId|null, email, channel: 'online'|'store',
  status: 'placed'|'processing'|'shipped'|'delivered'|'completed'|'cancelled',
  placedAt, estimatedDelivery: [from, to], deliveredAt?, cancelledAt?, cancelReason?,
  items: CartItem[], contact: { fullName, email, phone },
  shippingAddress: Address|null, store: { id, name, address, phone }|null,
  delivery: { id, name, price }, payment: { id, name, brand?, last4?, wallet?, installments? },
  promo, note, totals, pointsEarned,
  cancellable: boolean, timeline: { status, done, at }[]
}

Me { id, email, firstName, lastName, phone, dateOfBirth, gender, memberId, points,
     tier: { id: 'soi'|'vai'|'lua', name, perks[] }, nextTier: { id, name, min, remaining }|null,
     subscriptions: { newsletter, sms, zalo }, createdAt }

Store { id, slug, name, city, province, address, ward, fullAddress, lat, lng, phone,
        departments[], services[], hours: { days, open, close }[], flagship?, openNow, distanceKm|null }
```

Mã tỉnh dùng danh sách **34 đơn vị hành chính cấp tỉnh** áp dụng từ 01/7/2025 (`frontend/src/config/locations.js`). Địa chỉ chỉ còn 2 cấp: tỉnh/thành → phường/xã.

## Endpoint

### Danh mục & sản phẩm

| Method | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/departments` | Bộ phận + danh mục con (ảnh, tên) cho menu/trang bộ phận |
| GET | `/categories/:slug` | Thông tin danh mục: `title`, `types[]` (tab lọc nhanh có `count`), `siblings[]`, `breadcrumbs`. `slug` có thể là danh mục thật (`nu-dam`), danh mục ảo (`moi-ve`, `sale`, `nu-sale`, `ben-vung`…) hoặc bộ phận |
| GET | `/products` | Danh sách sản phẩm. Query: `category`, `department`, `q`, `badge`, `sale=true`, `type`, `color` (nhóm màu, phân tách bằng dấu phẩy), `size`, `fit`, `material`, `minPrice`, `maxPrice`, `storeId` (chỉ hàng có tại cửa hàng), `sort` = `de-xuat` \| `moi-nhat` \| `ban-chay` \| `gia-tang` \| `gia-giam`, `page`, `pageSize`. Trả về `{ items, total, scopeTotal, page, pageSize, hasMore, facets }`. `items` là **cộng dồn** đến trang hiện tại (nút "Xem thêm"). `facets` mỗi nhóm đếm trên kết quả đã áp các bộ lọc **khác** |
| GET | `/products/:slug` | Chi tiết sản phẩm (nhận cả `id`) |
| GET | `/products/:id/recommendations?type=similar\|others&limit=` | Sản phẩm tương tự / khách cũng mua |
| GET | `/products/:id/reviews?sort=phu-hop\|moi-nhat\|cao-nhat\|thap-nhat` | `{ summary: { average, count, fit, length, distribution[], recommendPercent }, items[] }`. `fit`/`length` trong khoảng −1 (chật/ngắn) … 1 (rộng/dài) |
| POST | `/products/:id/notify` | Báo khi có hàng `{ email, size, colorCode }` |
| GET | `/products/:id/availability?colorCode&size` | Tồn kho tại từng cửa hàng `[{ storeId, slug, name, city, address, stock }]` |
| GET | `/search/suggestions?q=` | `{ queries[], categories[], products[] }`; `q` rỗng → từ khoá phổ biến |

### Cửa hàng & tiện ích

| Method | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/stores?q&province&department&lat&lng` | Danh sách cửa hàng; có `lat,lng` thì sắp theo khoảng cách và trả `distanceKm` |
| GET | `/stores/:slug` | Chi tiết + `nearby[]` |
| POST | `/newsletter` | `{ email, province, interests[], consent: true }` → `{ ok, alreadySubscribed }` |
| GET | `/locations/provinces` | 34 tỉnh/thành, miền, số ngày giao, hỗ trợ giao nhanh |

### Xác thực

| Method | Đường dẫn | Mô tả |
|---|---|---|
| POST | `/auth/check-email` | `{ email }` → `{ exists }` (luồng đăng nhập "email trước") |
| POST | `/auth/login` | `{ email, password, remember }` → `{ token, user: Me }`; gộp giỏ hàng khách |
| POST | `/auth/register` | `{ email, password, dateOfBirth, firstName?, lastName?, phone?, gender?, newsletter }` → `{ token, user }`. Mật khẩu 8–25 ký tự, có số, chữ hoa, chữ thường, không khoảng trắng; tối thiểu 13 tuổi |
| POST | `/auth/logout` | 204 |
| POST | `/auth/forgot-password` | `{ email }` → `{ sent: true }` (luôn thành công để không lộ email đã đăng ký). **Mock** trả thêm `demoToken` để mô phỏng việc mở email |
| POST | `/auth/reset-password` | `{ token, password }` |

### Tài khoản (cần đăng nhập)

| Method | Đường dẫn | Mô tả |
|---|---|---|
| GET / PATCH / DELETE | `/me` | Xem, sửa (`email` mới cần `password` hiện tại), xoá tài khoản |
| PATCH | `/me/subscriptions` | `{ newsletter?, sms?, zalo? }` |
| POST | `/me/password` | `{ currentPassword, newPassword }` |
| GET | `/me/rewards` | `{ offers[], history[], tiers[] }` — ưu đãi, lịch sử điểm, hạng thành viên |
| GET / POST | `/me/addresses` | Danh sách / thêm địa chỉ |
| PATCH / DELETE | `/me/addresses/:id` | Sửa (kể cả `isDefault`) / xoá |
| GET / DELETE | `/me/cards`, `/me/cards/:id` | Thẻ đã lưu (chỉ lưu brand + 4 số cuối; backend thật dùng token của cổng thanh toán) |

### Yêu thích & giỏ hàng (khách hoặc thành viên)

| Method | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/wishlist` | `ProductSummary[]` |
| POST | `/wishlist` | `{ productId }` |
| DELETE | `/wishlist/:productId` | |
| GET | `/cart` | `Cart` |
| POST | `/cart/items` | `{ productId, colorCode, size, quantity }` → `Cart` + `addedItemId`. Tối đa 10/sản phẩm, không vượt tồn kho |
| PATCH | `/cart/items/:id` | `{ quantity?, size? }` |
| DELETE | `/cart/items/:id` | |
| POST / DELETE | `/cart/promo` | `{ code }` áp / gỡ mã giảm giá |

### Thanh toán & đơn hàng

| Method | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/checkout/options?province=` | `{ deliveryMethods[], paymentMethods[], pickupStores[] }`. Phương thức giao có `price` đã tính miễn phí, `eta: [from, to]`, `available`, `unavailableReason`, `requiresStore` |
| POST | `/orders` | Đặt hàng — xem body bên dưới → `Order` |
| GET | `/orders?channel=online\|store` | Đơn của tôi |
| GET | `/orders/:number?email=` | Chi tiết; khách vãng lai cần `email` đặt hàng |
| POST | `/orders/:number/cancel` | `{ reason, email? }`; chỉ khi `status` là `placed`/`processing` |
| GET | `/checkout/cancel-reasons` | Danh sách lý do huỷ |

Body `POST /orders`:

```json
{
  "contact": { "fullName": "Trần Ngọc Lan", "email": "lan@example.com", "phone": "0912345678" },
  "deliveryMethodId": "tieu-chuan",
  "storeId": null,
  "shippingAddress": { "fullName": "…", "phone": "…", "line1": "18 Ngõ 52 Tô Ngọc Vân", "ward": "Phường Tây Hồ", "province": "ha-noi" },
  "saveAddress": true,
  "note": "Gọi trước khi giao",
  "payment": {
    "id": "the",
    "card": { "number": "4242424242424242", "exp": "12/29", "cvc": "123", "holder": "TRAN NGOC LAN", "save": false }
  }
}
```

`payment.id`: `cod` (tối đa 5.000.000₫) · `the` · `vi` (+ `wallet`) · `chuyen-khoan` (VietQR) · `tra-gop` (+ `installments` 3/6, đơn từ 1.500.000₫). Thẻ đã lưu: `"card": { "savedCardId": "card_1" }`. **Backend thật không bao giờ nhận số thẻ trần** — thay bằng token từ cổng thanh toán (Napas, VNPay, Stripe…); mock chỉ kiểm tra Luhn để demo.

### Quy tắc nghiệp vụ (đã cài trong mock)

- Giao tiêu chuẩn 30.000₫, **miễn phí** khi tạm tính ≥ 499.000₫, có mã `FREESHIP` hoặc thành viên hạng Vải trở lên (≥ 2.000 điểm).
- Giao trong ngày (45.000₫) và hoả tốc 2 giờ (59.000₫) chỉ ở Hà Nội, TP.HCM, Đà Nẵng. Nhận tại cửa hàng miễn phí.
- Mã giảm giá demo: `NEPMOI` (−10%, tối đa 100.000₫), `FREESHIP`, `DOICU50` (−50.000₫, đơn từ 300.000₫), `CLUB15` (−15%, chỉ thành viên).
- Điểm: 1.000₫ = 1 điểm, cộng khi đặt hàng, trừ lại khi huỷ. Hạng: Sợi (0) · Vải (2.000) · Lụa (6.000).
- Giá đã gồm VAT nên không có dòng thuế riêng.

## Endpoint chỉ có ở mock

- `POST /dev/reset` — làm mới dữ liệu demo (hoặc xoá key `nep.mockdb.v1` trong localStorage).
