import { useEffect } from 'react'
import { Check, Shirt, Store, Ticket, X } from 'lucide-react'
import { Accordion, Button } from '@/components/ui'
import { CopyCode } from '@/components/content/CopyCode'

const STEPS = [
  { icon: Shirt, title: 'Gom quần áo cũ', text: 'Quần áo, khăn, túi vải — của bất kỳ thương hiệu nào, cũ hay rách đều được. Không cần giặt là thẳng thớm.' },
  { icon: Store, title: 'Mang đến quầy thu gom', text: 'Có tại 9 cửa hàng Nếp trên toàn quốc. Nhân viên cân túi đồ và ghi nhận ngay trên tài khoản của bạn.' },
  { icon: Ticket, title: 'Nhận mã giảm 50.000₫', text: 'Mỗi 1 kg nhận một mã DOICU50 cho đơn từ 300.000₫, kèm 200 điểm Nếp Club. Tối đa 2 mã mỗi ngày.' },
]
const ACCEPT = ['Quần áo người lớn và trẻ em', 'Khăn, ga gối, rèm vải', 'Túi vải, mũ vải', 'Đồ len, đồ jeans, đồ lót đã giặt sạch']
const REJECT = ['Giày dép, thắt lưng da', 'Đồ ướt, ẩm mốc hoặc dính hoá chất', 'Gối, chăn bông có ruột', 'Đồ nhựa, đồ điện tử']
const DESTINY = [
  { pct: '58%', title: 'Mặc lại', text: 'Đồ còn tốt được phân loại, giặt sạch và chuyển đến các cửa hàng đồ cũ, quỹ từ thiện vùng cao.' },
  { pct: '31%', title: 'Tái chế thành sợi mới', text: 'Vải cotton và denim được xé, kéo thành sợi tái chế — dùng lại trong bộ sưu tập Denim tái chế của Nếp.' },
  { pct: '11%', title: 'Làm vật liệu cách âm', text: 'Phần còn lại được ép thành tấm cách âm, cách nhiệt cho công trình — không có gì phải chôn lấp.' },
]
const FAQ = [
  ['Tôi có cần là thành viên Nếp Club không?', 'Không bắt buộc. Tuy nhiên thành viên được cộng thêm 200 điểm cho mỗi kg và lưu lịch sử đổi đồ trong tài khoản.'],
  ['Mã DOICU50 dùng như thế nào?', 'Nhập mã ở bước giỏ hàng hoặc thanh toán (online) hoặc đưa mã cho thu ngân tại cửa hàng. Mã áp dụng cho đơn từ 300.000₫, hạn dùng 30 ngày.'],
  ['Quần áo không phải của Nếp có được nhận không?', 'Có. Chúng tôi nhận quần áo của mọi thương hiệu, vì mục tiêu là không để vải cũ bị bỏ đi.'],
  ['Quần áo của tôi có bị bán lại không?', 'Đồ còn mặc được sẽ được trao tặng hoặc bán lại qua đối tác đồ cũ với giá thấp; toàn bộ lợi nhuận dùng cho quỹ học bổng may mặc.'],
]

export default function RecyclePage() {
  useEffect(() => {
    document.title = 'Đổi cũ lấy mới — Nếp'
  }, [])

  return (
    <div>
      <section className="ds-container grid items-center gap-8 pt-8 pb-14 md:grid-cols-2 lg:gap-16 lg:pt-12">
        <div className="order-2 md:order-1">
          <p className="ds-eyebrow mb-4">Chương trình thu gom · Từ 2024</p>
          <h1 className="ds-display">
            Đổi cũ
            <br />
            <span className="italic text-cham">lấy mới.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-2">
            Tủ đồ nào cũng có những món đã thôi mặc. Mang chúng đến Nếp — chúng tôi lo phần còn lại, bạn nhận ngay mã giảm 50.000₫ cho lần mua tiếp theo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/cua-hang" size="lg">
              Tìm quầy thu gom
            </Button>
            <Button href="#cach-hoat-dong" variant="outline" size="lg">
              Cách hoạt động
            </Button>
          </div>
        </div>
        <div className="order-1 aspect-[4/5] overflow-hidden bg-paper-2 md:order-2">
          <img src="/images/campaign/doi-cu.jpg" alt="Quần áo cũ được gấp gọn chờ thu gom" className="size-full object-cover" />
        </div>
      </section>

      <section className="bg-cham text-paper">
        <div className="ds-container grid gap-8 py-12 sm:grid-cols-3">
          {[
            ['12,4 tấn', 'quần áo đã thu gom trong 2026'],
            ['9', 'cửa hàng có quầy thu gom'],
            ['31.800', 'mã giảm giá đã trao cho khách'],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-5xl font-medium tracking-tight">{n}</p>
              <p className="mt-2 text-[13px] text-cham-300">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cach-hoat-dong" className="ds-container scroll-mt-32 py-16">
        <h2 className="ds-h2 mb-10">Ba bước đơn giản</h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-ink pt-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl italic text-cham">0{i + 1}</span>
                <s.icon className="size-6" strokeWidth={1.25} />
              </div>
              <h3 className="ds-h3 mt-4">{s.title}</h3>
              <p className="mt-2 text-[14px] text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ds-container grid gap-6 pb-16 md:grid-cols-2">
        <div className="bg-surface p-6 lg:p-8">
          <h2 className="ds-label mb-4 text-la">Chúng tôi nhận</h2>
          <ul className="space-y-2.5 text-[14px]">
            {ACCEPT.map((a) => (
              <li key={a} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-la" /> {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface p-6 lg:p-8">
          <h2 className="ds-label mb-4 text-son">Chưa nhận</h2>
          <ul className="space-y-2.5 text-[14px]">
            {REJECT.map((a) => (
              <li key={a} className="flex items-start gap-2.5">
                <X className="mt-0.5 size-4 shrink-0 text-son" /> {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2">
        <div className="ds-container py-16">
          <p className="ds-eyebrow mb-2">Sau khi thu gom</p>
          <h2 className="ds-h2 mb-10 max-w-xl">Mỗi món đồ đi về đâu?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {DESTINY.map((d) => (
              <div key={d.title}>
                <p className="font-display text-6xl font-medium text-cham">{d.pct}</p>
                <h3 className="ds-h3 mt-3">{d.title}</h3>
                <p className="mt-2 text-[14px] text-ink-2">{d.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">Số liệu mô phỏng cho bản demo.</p>
        </div>
      </section>

      <section className="ds-container grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="ds-h2">Mã của bạn sau mỗi kg</h2>
          <p className="mt-3 max-w-sm text-[14px] text-ink-2">Giảm 50.000₫ cho đơn từ 300.000₫. Dùng được cả online và tại cửa hàng.</p>
          <CopyCode code="DOICU50" className="mt-6" />
        </div>
        <div>
          <h2 className="ds-label mb-2">Câu hỏi thường gặp</h2>
          {FAQ.map(([q, a]) => (
            <Accordion key={q} title={q} titleClassName="text-[14px] font-medium">
              <p className="text-[14px] text-ink-2">{a}</p>
            </Accordion>
          ))}
        </div>
      </section>
    </div>
  )
}
