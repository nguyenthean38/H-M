# Bản đồ màn hình

Đối chiếu bộ ảnh tham khảo (116 màn hình) với route và tệp trong `frontend/src`. Nếp không sao chép giao diện gốc: chỉ giữ **luồng nghiệp vụ**, còn thương hiệu, bố cục, nội dung, hình ảnh và nhiều tính năng là của riêng Nếp (cột cuối).

| Ảnh tham khảo | Route | Tệp | Điểm riêng của Nếp |
|---|---|---|---|
| #0, #10, #89 Trang chủ | `/` | `pages/HomePage.jsx` | Hero song ảnh + điểm "mua theo ảnh", dải chữ chạy, băng "Đổi cũ lấy mới", băng Nếp Club, gợi ý phối đồ |
| #11–#13 Hàng mới, ô danh mục, footer | `/`, `/nu`, `/nam`… | `pages/DepartmentPage.jsx`, `components/layout/Footer.jsx` | Trang bộ phận riêng cho Nữ/Nam/Trẻ em/Nhà/Làm đẹp |
| #14–#15 Chọn khu vực giao hàng | (modal) | `components/layout/LocationModal.jsx` | Chọn 34 tỉnh/thành theo miền, hiện số ngày giao & hỗ trợ giao 2 giờ |
| #16–#18 Menu lớn | (header) | `components/layout/Header.jsx` | Menu cột + ảnh biên tập; menu điện thoại nhiều tầng |
| #19, #24, #32 Trang danh mục | `/c/:slug` | `pages/CategoryPage.jsx`, `components/product/ProductListing.jsx` | Tab loại sản phẩm, danh mục cùng cấp, thanh tiến độ "đã xem x/y" |
| #20–#23 Chọn cửa hàng nhận hôm nay | (ngăn kéo) | `components/product/StorePickerDrawer.jsx` | Lọc sản phẩm có sẵn tại cửa hàng đã chọn |
| #25–#31 Bộ lọc, sắp xếp, màu | (ngăn kéo) | `components/product/FilterDrawer.jsx` | Thanh trượt khoảng giá, đếm kết quả trực tiếp, chip bộ lọc |
| #33–#38, #44 Chi tiết sản phẩm | `/p/:slug` | `pages/ProductPage.jsx` | Ước tính ngày giao theo tỉnh, tồn kho tại cửa hàng, cận cảnh chất liệu, "đã xem gần đây" |
| #39–#43 Bảng size | (ngăn kéo) | `components/product/SizeGuideDrawer.jsx`, `config/sizeGuides.js` | **Gợi ý size theo chiều cao & cân nặng** (số đo người Việt), hình cách đo vẽ SVG |
| #45–#47 Báo khi có hàng | (ngăn kéo) | `components/product/NotifyMeDrawer.jsx` | |
| #48–#50 Đánh giá | (ngăn kéo) | `components/product/ReviewsDrawer.jsx` | Chiều cao/cân nặng người đánh giá, phân bố sao, % hài lòng |
| #51–#55 Tìm cửa hàng | `/cua-hang`, `/cua-hang/:slug` | `pages/StoresPage.jsx`, `pages/StoreDetailPage.jsx` | Bản đồ Leaflet + nền Esri, ghim nếp gấp, "dùng vị trí của tôi", 14 cửa hàng ở 9 tỉnh |
| #56–#60 Đăng ký bản tin | `/dang-ky-nhan-tin` | `pages/NewsletterPage.jsx` | Chọn tỉnh/thành, mã NEPMOI khi đăng ký |
| #61–#66 Tìm kiếm | (panel) + `/tim-kiem` | `components/layout/SearchPanel.jsx`, `pages/SearchPage.jsx` | Tìm không dấu, lịch sử tìm, gợi ý danh mục & sản phẩm |
| #67 Tài khoản & ưu đãi | `/tai-khoan` | `pages/account/OverviewPage.jsx` | Thẻ thành viên số, ưu đãi có mã sao chép |
| #68–#71, #76 Đơn hàng | `/tai-khoan/don-hang(/:number)` | `pages/account/OrdersPage.jsx`, `OrderDetailPage.jsx` | Tab Online / Tại cửa hàng, dòng thời gian, mã QR đổi trả |
| #72 Theo dõi đơn | `/theo-doi-don-hang` | `pages/OrderTrackingPage.jsx` | Tra cứu bằng mã đơn + email cho khách |
| #73–#75 Huỷ đơn | (modal) | `components/account/CancelOrderFlow.jsx` | |
| #77, #87, #88 Giỏ hàng | `/gio-hang` | `pages/CartPage.jsx` | Thanh miễn phí giao hàng, mã giảm giá |
| #78–#85 Thanh toán | `/thanh-toan` | `pages/CheckoutPage.jsx` | COD, thẻ, ví điện tử, VietQR, trả góp 0%; giao trong ngày, hoả tốc 2 giờ, nhận tại cửa hàng |
| #86 Cảm ơn | `/dat-hang-thanh-cong/:number` | `pages/OrderConfirmationPage.jsx` | Điểm thưởng, mã VietQR khi chuyển khoản |
| #90–#104 Cài đặt | `/tai-khoan/cai-dat/*` | `pages/account/SettingsPage.jsx`, `DetailsPage.jsx`, `SubscriptionsPage.jsx` | Địa chỉ 2 cấp sau sáp nhập, kênh Zalo OA |
| #1–#9, #105–#110 Đăng nhập / đăng ký | (modal) | `components/auth/AuthModal.jsx` | Đăng nhập "email trước", thưởng điểm khi điền thêm thông tin |
| #111–#115 Quên / đặt lại mật khẩu | `/quen-mat-khau`, `/dat-lai-mat-khau` | `pages/ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx` | |
| — | `/doi-cu-lay-moi` | `pages/RecyclePage.jsx` | Chương trình thu gom quần áo cũ của Nếp |
| — | `/nep-club`, `/tai-khoan/thanh-vien` | `pages/ClubPage.jsx`, `pages/account/MembershipPage.jsx` | Hạng Sợi · Vải · Lụa |
| — | `/yeu-thich` | `pages/WishlistPage.jsx` | Lưu cho khách, gộp khi đăng nhập |
| — | `/thong-tin/:slug` | `pages/InfoPage.jsx`, `content/info.jsx` | 12 trang hỗ trợ: giao hàng, đổi trả, bảng size… |
| — | `*` | `pages/NotFoundPage.jsx` | |
