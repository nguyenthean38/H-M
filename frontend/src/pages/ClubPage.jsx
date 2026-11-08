import { useEffect } from 'react'
import { Cake, Check, Gift, Recycle, ShoppingBag, Star, UserPlus } from 'lucide-react'
import { Accordion, Button, ProgressBar } from '@/components/ui'
import { useMe } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { formatNumber } from '@/utils/format'

const TIERS = [
  { id: 'soi', name: 'Sợi', min: 0, note: 'Khi bạn tham gia', perks: ['Tích 1 điểm cho mỗi 1.000₫', 'Quà sinh nhật', 'Đổi trả 30 ngày'], tone: 'bg-surface text-ink' },
  { id: 'vai', name: 'Vải', min: 2000, note: 'Từ 2.000 điểm', perks: ['Tất cả quyền lợi hạng Sợi', 'Miễn phí giao hàng mọi đơn', 'Sửa đồ miễn phí 2 lần/năm'], tone: 'bg-cham-50 text-ink' },
  { id: 'lua', name: 'Lụa', min: 6000, note: 'Từ 6.000 điểm', perks: ['Tất cả quyền lợi hạng Vải', 'Mua sớm bộ sưu tập mới', 'Tư vấn phối đồ riêng', 'Đổi trả 60 ngày'], tone: 'bg-cham text-paper' },
]
const EARN = [
  { icon: ShoppingBag, title: 'Mua sắm', text: '1 điểm cho mỗi 1.000₫ — online và tại cửa hàng.' },
  { icon: UserPlus, title: 'Hoàn thiện hồ sơ', text: '+50 điểm khi thêm tên, +50 điểm khi thêm số điện thoại.' },
  { icon: Recycle, title: 'Đổi cũ lấy mới', text: '+200 điểm cho mỗi kg quần áo cũ mang đến quầy thu gom.' },
  { icon: Star, title: 'Viết đánh giá', text: '+20 điểm cho mỗi đánh giá sản phẩm đã mua.' },
]
const FAQ = [
  ['Tham gia Nếp Club có mất phí không?', 'Hoàn toàn miễn phí. Bạn chỉ cần tạo tài khoản bằng email là trở thành thành viên hạng Sợi.'],
  ['Điểm có hết hạn không?', 'Điểm được giữ 12 tháng kể từ lần mua gần nhất. Chỉ cần có một giao dịch trong năm là toàn bộ điểm được gia hạn.'],
  ['Làm sao để đổi điểm?', 'Cứ mỗi 500 điểm bạn đổi được một phiếu giảm 50.000₫ trong mục Tài khoản & ưu đãi.'],
  ['Hạng thành viên được xét thế nào?', 'Hạng được nâng ngay khi bạn đạt mốc điểm và giữ trong 12 tháng tiếp theo.'],
]

export default function ClubPage() {
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)

  useEffect(() => {
    document.title = 'Nếp Club — Thành viên Nếp'
  }, [])

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <img src="/images/campaign/club.jpg" alt="" aria-hidden className="absolute inset-0 -z-10 size-full bg-ink-2 object-cover opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" aria-hidden />
        <div className="ds-container flex min-h-[520px] flex-col justify-end py-14 lg:min-h-[600px]">
          <p className="ds-eyebrow mb-4 text-paper/80">Chương trình thành viên</p>
          <h1 className="ds-display max-w-2xl">
            Nếp <span className="italic">Club</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/85">Tích điểm mỗi lần mua, nhận quà sinh nhật, mua sớm bộ sưu tập mới. Ba hạng thành viên đặt tên theo chất liệu: Sợi, Vải và Lụa.</p>
          {me ? (
            <div className="mt-8 max-w-sm bg-paper p-5 text-ink">
              <p className="text-[13px]">
                Chào {me.firstName ?? 'bạn'} · hạng <strong>{me.tier?.name}</strong>
              </p>
              <p className="mt-1 font-display text-4xl font-medium">{formatNumber(me.points)} điểm</p>
              {me.nextTier && (
                <>
                  <ProgressBar className="mt-3" value={me.points / me.nextTier.min} />
                  <p className="mt-2 text-xs text-muted">
                    Còn {formatNumber(me.nextTier.remaining)} điểm để lên hạng {me.nextTier.name}
                  </p>
                </>
              )}
              <Button to="/tai-khoan/thanh-vien" className="mt-4" block>
                Xem điểm của bạn
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              <Button size="lg" variant="light" onClick={() => openAuth()}>
                Tham gia miễn phí
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="ds-container py-16">
        <h2 className="ds-h2 mb-8">Ba hạng, một chặng đường</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => {
            const current = me?.tier?.id === t.id
            return (
              <article key={t.id} className={cn('ds-fold relative flex flex-col p-7', t.tone, current && 'ring-2 ring-ink ring-inset')}>
                {current && <span className="absolute top-4 right-6 text-[10px] font-semibold tracking-[0.12em] uppercase">Hạng của bạn</span>}
                <p className="ds-eyebrow opacity-80" style={{ color: 'inherit' }}>
                  {t.note}
                </p>
                <h3 className="mt-2 font-display text-5xl font-medium italic">{t.name}</h3>
                <ul className="mt-6 space-y-2.5 text-[14px]">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y border-line bg-paper-2">
        <div className="ds-container py-16">
          <h2 className="ds-h2 mb-10">Cách tích điểm</h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {EARN.map((e) => (
              <li key={e.title}>
                <e.icon className="size-7 text-cham" strokeWidth={1.25} />
                <h3 className="ds-h3 mt-4">{e.title}</h3>
                <p className="mt-1.5 text-[14px] text-ink-2">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ds-container grid gap-12 py-16 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <div className="flex gap-3 text-cham">
            <Gift className="size-7" strokeWidth={1.25} />
            <Cake className="size-7" strokeWidth={1.25} />
          </div>
          <h2 className="ds-h2 mt-4">Quà nhỏ, dịp lớn</h2>
          <p className="mt-3 max-w-sm text-[14px] text-ink-2">Tháng sinh nhật, thành viên nhận phiếu giảm 15% và một món quà nhỏ khi ghé cửa hàng.</p>
          {!me && (
            <Button className="mt-6" onClick={() => openAuth()}>
              Tham gia miễn phí
            </Button>
          )}
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
