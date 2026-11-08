import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Plus, Recycle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

/** Điểm "mua theo ảnh": chấm tròn trên ảnh, rê/bấm hiện tên & giá sản phẩm. */
function Hotspot({ product, x, y }) {
  if (!product) return null
  return (
    <Link to={`/p/${product.slug}`} className="group/hs absolute z-10 flex items-center" style={{ left: `${x}%`, top: `${y}%` }} aria-label={`${product.name} — ${formatPrice(product.price)}`}>
      <span className="relative flex size-6 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-paper/60" />
        <span className="relative flex size-6 items-center justify-center rounded-full bg-paper text-ink shadow">
          <Plus className="size-3.5" />
        </span>
      </span>
      <span className="ml-2 hidden bg-paper px-2.5 py-1.5 text-[11px] whitespace-nowrap shadow group-hover/hs:block group-focus/hs:block sm:block">
        <span className="font-semibold">{formatPrice(product.price)}</span>
        <span className="ml-1.5 text-muted">{product.name}</span>
      </span>
    </Link>
  )
}

/**
 * Hero dạng "song ảnh": hai ảnh dọc đặt cạnh nhau (rộng 960px mỗi ảnh nên vẫn nét trên màn lớn).
 */
export function DiptychHero({ images, eyebrow, title, subtitle, actions, hotspot, className, tone = 'light' }) {
  return (
    <section className={cn('relative', className)}>
      <div className="grid grid-cols-2">
        {images.map((src, i) => (
          <div key={src} className={cn('relative aspect-[3/4] overflow-hidden bg-paper-2 sm:aspect-[4/5] lg:aspect-auto lg:h-[min(86vh,880px)]', i === 1 && 'hidden sm:block', i === 0 && 'col-span-2 sm:col-span-1')}>
            <img src={src} alt="" className="size-full object-cover" fetchPriority={i === 0 ? 'high' : 'auto'} />
          </div>
        ))}
      </div>
      {hotspot && <Hotspot {...hotspot} />}
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent', tone === 'light' ? 'from-ink/60 via-ink/10' : 'from-paper/80')} />
      <div className="absolute inset-x-0 bottom-0">
        <div className={cn('ds-container pb-8 sm:pb-12', tone === 'light' ? 'text-paper' : 'text-ink')}>
          {eyebrow && <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase">{eyebrow}</p>}
          <h1 className="ds-display max-w-3xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-md text-[15px] opacity-90">{subtitle}</p>}
          {actions && <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  )
}

/** Dải chữ chạy ngang màu chàm. */
export function Marquee({ items }) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-cham-600 bg-cham py-3 text-paper" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-xl italic">
            {t}
            <span className="text-cham-300">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Lưới ô danh mục có ảnh + nhãn. */
export function CategoryTiles({ title, items, className }) {
  return (
    <section className={cn('ds-container', className)}>
      {title && <h2 className="ds-h2 mb-6">{title}</h2>}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((c) => (
          <li key={c.to}>
            <Link to={c.to} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
                <img src={c.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-4 pt-14 text-paper">
                  <span className="block font-display text-xl leading-tight sm:text-2xl">{c.label}</span>
                  <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
                    Khám phá <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Khối ảnh + chữ chia đôi (chiến dịch phụ). */
export function SplitFeature({ image, eyebrow, title, children, actions, reverse, className }) {
  return (
    <section className={cn('ds-container', className)}>
      <div className={cn('grid items-center gap-8 lg:grid-cols-2 lg:gap-16', reverse && 'lg:[&>*:first-child]:order-2')}>
        <div className="aspect-[4/5] overflow-hidden bg-paper-2">
          <img src={image} alt="" loading="lazy" className="size-full object-cover" />
        </div>
        <div className="max-w-lg">
          {eyebrow && <p className="ds-eyebrow mb-4">{eyebrow}</p>}
          <h2 className="ds-h1">{title}</h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-2">{children}</div>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  )
}

/** Băng "Đổi cũ lấy mới" — chương trình riêng của Nếp. */
export function RecycleBand() {
  const steps = [
    { n: '01', t: 'Gom quần áo cũ', d: 'Mọi thương hiệu, mọi tình trạng — kể cả rách hay bạc màu.' },
    { n: '02', t: 'Mang đến cửa hàng', d: 'Bỏ vào quầy thu gom tại 9 cửa hàng Nếp trên toàn quốc.' },
    { n: '03', t: 'Nhận 50.000₫', d: 'Mã giảm giá cho mỗi 1 kg cùng 200 điểm Nếp Club.' },
  ]
  return (
    <section className="bg-cham text-paper">
      <div className="ds-container grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:py-24">
        <div className="lg:col-span-5">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-cham-300 uppercase">
            <Recycle className="size-4" /> Đổi cũ lấy mới
          </p>
          <h2 className="ds-h1">
            Quần áo cũ <em className="text-cham-300">chưa hết vòng đời</em>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/80">Năm 2026, khách hàng Nếp đã gửi lại 12,4 tấn quần áo. Phần còn mặc được tìm chủ mới, phần còn lại thành sợi cho những chiếc áo tiếp theo.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="light" to="/doi-cu-lay-moi">
              Tìm hiểu chương trình
            </Button>
            <Button variant="link" to="/cua-hang" className="text-paper hover:text-cham-300">
              Cửa hàng có quầy thu gom
            </Button>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
            <div className="aspect-[4/5] overflow-hidden bg-cham-600">
              <img src="/images/campaign/doi-cu.jpg" alt="" loading="lazy" className="size-full object-cover opacity-95 mix-blend-luminosity" />
            </div>
            <ol className="flex flex-col justify-between gap-6">
              {steps.map((s) => (
                <li key={s.n} className="border-t border-paper/25 pt-4">
                  <span className="font-display text-3xl text-cham-300 italic">{s.n}</span>
                  <p className="mt-1 font-semibold">{s.t}</p>
                  <p className="mt-1 text-[13px] text-paper/75">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Băng mời tham gia Nếp Club. */
export function ClubBand({ loggedIn, onJoin }) {
  const perks = [
    { icon: Sparkles, t: 'Tích điểm mỗi đơn', d: '1.000₫ = 1 điểm, đổi thành ưu đãi' },
    { icon: Leaf, t: 'Quà sinh nhật', d: 'Voucher riêng trong tháng sinh nhật' },
    { icon: Recycle, t: 'Sửa đồ miễn phí', d: 'Từ hạng Vải, 2 lần mỗi năm' },
  ]
  return (
    <section className="ds-container">
      <div className="grid overflow-hidden bg-paper-2 lg:grid-cols-2">
        <div className="relative min-h-72 bg-paper-2">
          <img src="/images/campaign/club.jpg" alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="p-8 sm:p-12">
          <p className="ds-eyebrow mb-3">Nếp Club · miễn phí</p>
          <h2 className="ds-h1">Thành viên được nhiều hơn một chiếc áo</h2>
          <ul className="mt-8 space-y-5">
            {perks.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-cham" strokeWidth={1.5} />
                <span>
                  <span className="block font-semibold">{t}</span>
                  <span className="text-[13px] text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {loggedIn ? (
              <Button to="/tai-khoan/thanh-vien">Xem điểm của bạn</Button>
            ) : (
              <Button onClick={onJoin}>Tham gia ngay</Button>
            )}
            <Button variant="outline" to="/nep-club">
              Quyền lợi theo hạng
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
