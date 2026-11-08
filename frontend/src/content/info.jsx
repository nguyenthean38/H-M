/**
 * Nội dung các trang thông tin (/thong-tin/:slug). Có thể chuyển sang CMS sau này:
 * mỗi trang = { slug, title, group, intro, body() }.
 */
import { Link } from 'react-router-dom'
import { Callout, Faq, H2, List, P, Table } from '@/components/content/Prose'
import { SizeGuideTables } from '@/components/content/SizeGuideTables'
import { ContactForm } from '@/components/content/ContactForm'
import { brand } from '@/config/brand'

const A = ({ to, children }) => (
  <Link to={to} className="font-medium text-ink underline underline-offset-2 hover:text-cham">
    {children}
  </Link>
)

const DEMO_NOTE = (
  <Callout>
    Nếp là <strong>dự án demo giao diện</strong> do{' '}
    <a href={brand.maker.url} target="_blank" rel="noreferrer" className="underline">
      {brand.maker.name}
    </a>{' '}
    thiết kế và lập trình. Toàn bộ thương hiệu, sản phẩm, cửa hàng, giá, đơn hàng và tài khoản đều là dữ liệu mô phỏng, chỉ lưu trong trình duyệt của bạn. Không có giao dịch hay khoản thanh toán thật nào được thực hiện.
  </Callout>
)

export const infoGroups = [
  { key: 'ho-tro', label: 'Hỗ trợ khách hàng' },
  { key: 've-nep', label: 'Về Nếp' },
  { key: 'phap-ly', label: 'Pháp lý' },
]

export const infoPages = [
  {
    slug: 'tro-giup',
    group: 'ho-tro',
    title: 'Trung tâm trợ giúp',
    intro: 'Câu trả lời nhanh cho những câu hỏi khách hàng hay gặp nhất.',
    body: () => (
      <>
        <H2>Đơn hàng</H2>
        <Faq
          items={[
            ['Làm sao để theo dõi đơn hàng?', <>Vào <A to="/theo-doi-don-hang">Theo dõi đơn hàng</A>, nhập mã đơn và email đặt hàng. Thành viên xem tất cả đơn trong mục Tài khoản → Đơn hàng.</>],
            ['Tôi có thể huỷ đơn không?', 'Bạn có thể tự huỷ khi đơn ở trạng thái "Đã đặt" hoặc "Đang chuẩn bị". Khi đơn đã giao cho đơn vị vận chuyển, bạn vẫn có thể từ chối nhận hoặc đổi trả sau đó.'],
            ['Tôi muốn sửa địa chỉ giao hàng?', `Gọi hotline ${brand.hotline} trong vòng 1 giờ sau khi đặt, chúng tôi sẽ cập nhật nếu đơn chưa được đóng gói.`],
          ]}
        />
        <H2>Thanh toán</H2>
        <Faq
          items={[
            ['Nếp nhận những phương thức thanh toán nào?', 'Thanh toán khi nhận hàng (COD), thẻ Visa/Mastercard/JCB/Napas, ví điện tử (MoMo, ZaloPay, ShopeePay, VNPay), chuyển khoản VietQR và trả góp 0% qua thẻ tín dụng cho đơn từ 1.500.000₫.'],
            ['Giá đã bao gồm VAT chưa?', 'Tất cả giá niêm yết đều đã bao gồm thuế GTGT. Bạn có thể yêu cầu xuất hoá đơn điện tử trong 7 ngày kể từ khi nhận hàng.'],
            ['Mã giảm giá không dùng được?', 'Kiểm tra hạn dùng, giá trị đơn tối thiểu và việc mã có áp dụng cho hàng giảm giá hay không. Mỗi đơn chỉ dùng một mã.'],
          ]}
        />
        <H2>Tài khoản & Nếp Club</H2>
        <Faq
          items={[
            ['Quên mật khẩu thì làm sao?', <>Vào <A to="/quen-mat-khau">Quên mật khẩu</A>, nhập email đã đăng ký để nhận liên kết đặt lại.</>],
            ['Điểm thưởng được cộng khi nào?', 'Điểm được cộng ngay khi đặt hàng thành công và bị trừ lại nếu đơn bị huỷ hoặc hoàn trả.'],
          ]}
        />
        <P>
          Chưa tìm thấy câu trả lời? <A to="/thong-tin/lien-he">Liên hệ với chúng tôi</A>.
        </P>
      </>
    ),
  },
  {
    slug: 'giao-hang',
    group: 'ho-tro',
    title: 'Giao hàng',
    intro: 'Nếp giao hàng đến cả 34 tỉnh thành trên toàn quốc, từ hai kho tại Hà Nội và TP. Hồ Chí Minh.',
    body: () => (
      <>
        <Table
          head={['Phương thức', 'Phí', 'Thời gian', 'Khu vực']}
          rows={[
            ['Giao tiêu chuẩn', '30.000₫ — miễn phí cho đơn từ 499.000₫', '1–5 ngày làm việc tuỳ tỉnh', 'Toàn quốc'],
            ['Giao trong ngày', '45.000₫', 'Đặt trước 14:00, nhận trước 21:00', 'Nội thành Hà Nội, TP.HCM, Đà Nẵng'],
            ['Hoả tốc 2 giờ', '59.000₫', 'Trong 2 giờ (8:00 – 20:00)', 'Nội thành Hà Nội, TP.HCM, Đà Nẵng'],
            ['Nhận tại cửa hàng', 'Miễn phí', '1–3 ngày, giữ hàng 7 ngày', '14 cửa hàng Nếp'],
          ]}
        />
        <Callout tone="paper">Thành viên Nếp Club hạng Vải và Lụa được miễn phí giao tiêu chuẩn cho mọi đơn hàng.</Callout>
        <H2>Thời gian giao theo khu vực</H2>
        <List
          items={[
            'Hà Nội, TP. Hồ Chí Minh: 1–2 ngày.',
            'Các tỉnh lân cận hai kho (Bắc Ninh, Hưng Yên, Đồng Nai, Tây Ninh...): 1–3 ngày.',
            'Miền Trung và Tây Nguyên: 2–5 ngày.',
            'Vùng núi phía Bắc và Cà Mau: 3–5 ngày.',
          ]}
        />
        <P>Bạn có thể chọn khu vực giao hàng ở cuối mỗi trang để xem ước tính ngày nhận chính xác hơn trên trang sản phẩm. Thời gian giao có thể kéo dài vào dịp lễ, Tết và các đợt sale lớn.</P>
        <H2>Khi nhận hàng</H2>
        <List items={['Bạn được kiểm tra hàng trước khi thanh toán (với đơn COD).', 'Nếu gói hàng móp, rách hoặc thiếu sản phẩm, vui lòng từ chối nhận và báo ngay cho hotline.', 'Đơn vị vận chuyển sẽ liên hệ tối đa 3 lần trước khi hoàn hàng về kho.']} />
      </>
    ),
  },
  {
    slug: 'doi-tra',
    group: 'ho-tro',
    title: 'Đổi trả & hoàn tiền',
    intro: `Đổi ý cũng không sao. Bạn có ${brand.returnDays} ngày để đổi hoặc trả sản phẩm, miễn phí.`,
    body: () => (
      <>
        <H2>Hai cách đổi trả</H2>
        <Table
          head={['Cách', 'Chi phí', 'Ghi chú']}
          rows={[
            ['Tại bất kỳ cửa hàng Nếp nào', 'Miễn phí', 'Mang sản phẩm và mã đơn (hoặc mã QR trong tài khoản). Đổi size ngay tại quầy nếu còn hàng.'],
            ['Gửi qua bưu điện', 'Miễn phí', 'Tạo yêu cầu trả hàng trong tài khoản, in phiếu và gửi tại bưu cục gần nhất trong 7 ngày.'],
          ]}
        />
        <H2>Điều kiện</H2>
        <List items={[`Trong vòng ${brand.returnDays} ngày kể từ ngày nhận hàng (60 ngày với hạng Lụa).`, 'Sản phẩm còn nguyên tem mác, chưa qua sử dụng, chưa giặt.', 'Đồ lót, đồ bơi, khuyên tai và mỹ phẩm đã mở nắp không áp dụng đổi trả vì lý do vệ sinh.', 'Hàng mua tại cửa hàng có thể trả online và ngược lại.']} />
        <H2>Hoàn tiền</H2>
        <P>Tiền được hoàn về phương thức thanh toán ban đầu trong 3–7 ngày làm việc sau khi kho nhận hàng. Đơn COD được hoàn qua chuyển khoản ngân hàng theo thông tin bạn cung cấp. Phí giao hàng ban đầu không được hoàn, trừ khi sản phẩm bị lỗi hoặc giao nhầm.</P>
      </>
    ),
  },
  {
    slug: 'bang-size',
    group: 'ho-tro',
    title: 'Bảng size',
    intro: 'Số đo được xây dựng theo vóc dáng người Việt. Trên mỗi trang sản phẩm bạn còn có công cụ gợi ý size theo chiều cao và cân nặng.',
    body: () => <SizeGuideTables />,
  },
  {
    slug: 'lien-he',
    group: 'ho-tro',
    title: 'Liên hệ',
    intro: 'Đội ngũ chăm sóc khách hàng của Nếp luôn sẵn lòng hỗ trợ bạn.',
    body: () => (
      <>
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            ['Hotline miễn phí', brand.hotline, brand.hotlineHours],
            ['Email', brand.email, 'Phản hồi trong 24 giờ'],
            ['Zalo OA', 'Nếp Official', 'Trò chuyện 8:00 – 22:00'],
          ].map(([k, v, s]) => (
            <div key={k} className="bg-surface p-5">
              <p className="ds-eyebrow">{k}</p>
              <p className="mt-2 text-lg font-semibold">{v}</p>
              <p className="text-xs text-muted">{s}</p>
            </div>
          ))}
        </div>
        <H2>Gửi tin nhắn cho chúng tôi</H2>
        <ContactForm />
      </>
    ),
  },
  {
    slug: 've-nep',
    group: 've-nep',
    title: 'Câu chuyện của Nếp',
    intro: 'Quần áo tử tế cho những ngày bình thường.',
    body: () => (
      <>
        <figure className="mb-8 aspect-[16/9] overflow-hidden bg-paper-2">
          <img src="/images/campaign/chat-lieu.jpg" alt="Cận cảnh sợi vải nhuộm chàm" className="size-full object-cover" />
        </figure>
        <H2>Vì sao là “Nếp”?</H2>
        <P>“Nếp” là nếp gấp trên tấm vải — dấu vết của một món đồ được mặc, được gấp cất, được yêu quý. Nếp cũng là nếp sống: những thói quen nhỏ lặp lại mỗi ngày, như chọn một chiếc áo dễ chịu để đi làm. Chúng tôi làm quần áo cho chính những ngày thường ấy.</P>
        <H2>Màu chàm</H2>
        <P>Màu nhận diện của Nếp lấy cảm hứng từ chàm — loại thuốc nhuộm tự nhiên mà nhiều dân tộc vùng cao vẫn dùng hàng trăm năm. Chàm càng giặt càng dịu màu, giống như cách một món đồ tốt trở nên thân thuộc theo thời gian.</P>
        <H2>Điều chúng tôi theo đuổi</H2>
        <List items={['Mẫu cơ bản, dễ phối, mặc được nhiều năm thay vì chạy theo từng mùa.', 'Ưu tiên chất liệu bền vững hơn: cotton hữu cơ, linen, denim tái chế, viscose có chứng nhận.', 'Bảng size theo vóc dáng người Việt.', 'Thu gom quần áo cũ tại cửa hàng để không món đồ nào bị bỏ đi.']} />
        <P>
          Đọc thêm về <A to="/thong-tin/chat-lieu">chất liệu</A> và chương trình <A to="/doi-cu-lay-moi">Đổi cũ lấy mới</A>.
        </P>
      </>
    ),
  },
  {
    slug: 'chat-lieu',
    group: 've-nep',
    title: 'Chất liệu & bền vững',
    intro: 'Hiểu về vải để chọn đồ mặc lâu hơn.',
    body: () => (
      <>
        <Table
          head={['Chất liệu', 'Vì sao chúng tôi chọn', 'Gợi ý bảo quản']}
          rows={[
            ['Cotton hữu cơ', 'Trồng không thuốc trừ sâu hoá học, dùng ít nước hơn. Mềm và an toàn cho da bé.', 'Giặt 30°C, phơi trong bóng râm.'],
            ['Linen (lanh)', 'Cây lanh cần rất ít nước tưới; vải thoáng, hợp khí hậu nóng ẩm.', 'Là khi vải còn ẩm, không vắt mạnh.'],
            ['Denim tái chế', 'Pha 20% sợi cotton tái chế từ quần áo thu gom tại cửa hàng.', 'Lộn trái khi giặt, hạn chế giặt.'],
            ['Viscose ECOVERO™', 'Sợi từ gỗ có nguồn gốc được chứng nhận, phát thải thấp hơn viscose thường.', 'Giặt nhẹ, phơi ngang.'],
            ['Polyester tái chế', 'Làm từ chai nhựa đã qua sử dụng.', 'Giặt nước lạnh, dùng túi giặt.'],
          ]}
        />
        <Callout tone="paper">Sản phẩm có nhãn “Bền vững hơn” chứa ít nhất 50% chất liệu hữu cơ, tái chế hoặc có chứng nhận. Đây không phải lời khẳng định sản phẩm không gây tác động tới môi trường.</Callout>
        <P>Cách bền vững nhất vẫn là mặc lâu hơn: giặt ít hơn, ở nhiệt độ thấp, sửa khi hỏng — thành viên hạng Vải trở lên được sửa đồ miễn phí tại cửa hàng.</P>
      </>
    ),
  },
  {
    slug: 'tuyen-dung',
    group: 've-nep',
    title: 'Tuyển dụng',
    intro: 'Cùng Nếp làm ra những bộ quần áo tử tế.',
    body: () => (
      <>
        <Table
          head={['Vị trí', 'Nơi làm việc', 'Hình thức']}
          rows={[
            ['Nhân viên tư vấn bán hàng', 'Hà Nội, TP.HCM, Đà Nẵng', 'Toàn thời gian / bán thời gian'],
            ['Trưởng cửa hàng', 'Nếp Phú Mỹ Hưng, TP.HCM', 'Toàn thời gian'],
            ['Chuyên viên thiết kế rập', 'Văn phòng Hà Nội', 'Toàn thời gian'],
            ['Nhân viên kho vận', 'Kho Đồng Nai', 'Ca xoay'],
          ]}
        />
        <P>Gửi CV về tuyendung@nep.demo với tiêu đề “Vị trí – Họ tên”. Đây là danh sách mô phỏng cho bản demo.</P>
      </>
    ),
  },
  {
    slug: 'uu-dai-sinh-vien',
    group: 've-nep',
    title: 'Ưu đãi sinh viên',
    intro: 'Giảm 10% cho học sinh, sinh viên mỗi ngày.',
    body: () => (
      <>
        <List items={['Áp dụng tại các cửa hàng có biểu tượng “Ưu đãi sinh viên” và khi mua online.', 'Xuất trình thẻ sinh viên còn hạn tại quầy, hoặc xác minh email trường học trong tài khoản.', 'Không áp dụng đồng thời với mã giảm giá khác và hàng đang sale.']} />
        <P>
          Xem <A to="/cua-hang">danh sách cửa hàng</A> để tìm điểm gần trường bạn.
        </P>
      </>
    ),
  },
  {
    slug: 'the-qua-tang',
    group: 've-nep',
    title: 'Thẻ quà tặng',
    intro: 'Món quà không bao giờ sai size.',
    body: () => (
      <>
        <div className="ds-fold mb-8 flex aspect-[1.6] max-w-sm flex-col justify-between bg-cham p-6 text-paper">
          <span className="font-display text-3xl italic">nếp.</span>
          <span>
            <span className="ds-label block text-cham-300">Thẻ quà tặng</span>
            <span className="font-display text-2xl">500.000₫</span>
          </span>
        </div>
        <List items={['Mệnh giá 200.000₫, 500.000₫, 1.000.000₫ hoặc tuỳ chọn.', 'Thẻ điện tử gửi qua email kèm lời chúc, hoặc thẻ cứng mua tại cửa hàng.', 'Hạn sử dụng 24 tháng, dùng nhiều lần đến khi hết số dư.', 'Dùng được cả online và tại cửa hàng.']} />
        <P>Tính năng mua thẻ quà tặng online đang được hoàn thiện trong bản demo.</P>
      </>
    ),
  },
  {
    slug: 'bao-mat',
    group: 'phap-ly',
    title: 'Chính sách bảo mật',
    intro: 'Cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
    body: () => (
      <>
        {DEMO_NOTE}
        <H2>Dữ liệu được thu thập</H2>
        <List items={['Thông tin tài khoản: email, họ tên, ngày sinh, số điện thoại, giới tính.', 'Thông tin đơn hàng: địa chỉ giao hàng, sản phẩm, phương thức thanh toán (chỉ 4 số cuối thẻ).', 'Dữ liệu sử dụng: sản phẩm đã xem, tìm kiếm gần đây (lưu trên trình duyệt của bạn).']} />
        <H2>Mục đích sử dụng</H2>
        <List items={['Xử lý và giao đơn hàng, chăm sóc khách hàng.', 'Quản lý điểm và quyền lợi Nếp Club.', 'Gửi bản tin và ưu đãi — chỉ khi bạn đồng ý, có thể huỷ bất cứ lúc nào.']} />
        <H2>Quyền của bạn</H2>
        <P>Bạn có quyền xem, sửa, tải về hoặc xoá dữ liệu cá nhân trong mục Tài khoản → Cài đặt, theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Trong bản demo, dữ liệu chỉ nằm trong localStorage của trình duyệt; xoá dữ liệu trang web sẽ xoá toàn bộ.</P>
      </>
    ),
  },
  {
    slug: 'dieu-khoan',
    group: 'phap-ly',
    title: 'Điều khoản sử dụng',
    intro: 'Vui lòng đọc kỹ trước khi sử dụng website và chương trình Nếp Club.',
    body: () => (
      <>
        {DEMO_NOTE}
        <H2>1. Phạm vi</H2>
        <P>Điều khoản áp dụng cho việc truy cập website, đặt hàng online và tham gia Nếp Club. Khi sử dụng website, bạn đồng ý với các điều khoản này.</P>
        <H2>2. Giá và sản phẩm</H2>
        <P>Giá niêm yết bằng Việt Nam đồng, đã bao gồm VAT. Hình ảnh mang tính minh hoạ; màu sắc thực tế có thể chênh lệch nhẹ do màn hình hiển thị.</P>
        <H2>3. Nếp Club</H2>
        <P>Điểm thưởng không có giá trị quy đổi thành tiền mặt và không thể chuyển nhượng. Nếp có quyền điều chỉnh thể lệ chương trình và sẽ thông báo trước ít nhất 30 ngày.</P>
        <H2>4. Hình ảnh</H2>
        <P>Ảnh minh hoạ trên website được sử dụng theo giấy phép CC0 (StockSnap). Tên thương hiệu “Nếp” và nội dung là sản phẩm sáng tạo cho mục đích trình diễn.</P>
      </>
    ),
  },
]

export const findInfoPage = (slug) => infoPages.find((p) => p.slug === slug) ?? null
