import { Link } from 'react-router-dom'
import { ArrowRight, Heart, MapPin, Package, Recycle, Settings } from 'lucide-react'
import { LogoMark } from '@/components/brand/Logo'
import { CopyButton, StatusPill } from '@/components/account/orderUtils'
import { DecorativeQr, Spinner } from '@/components/ui'
import { useRewards } from '@/hooks/useAccount'
import { useMe } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { cn } from '@/utils/cn'
import { formatDate, formatNumber, formatPrice } from '@/utils/format'

function expiryText(iso) {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  if (days <= 0) return 'Hết hạn hôm nay'
  if (days <= 7) return `Hết hạn sau ${days} ngày`
  return `Hết hạn ${formatDate(iso)}`
}

function MemberCard({ me }) {
  const name = [me.lastName, me.firstName].filter(Boolean).join(' ') || me.email
  return (
    <div className="relative overflow-hidden bg-cham p-6 text-paper sm:p-8">
      <div className="pointer-events-none absolute -top-10 -right-10 size-44 rotate-45 bg-cham-600" aria-hidden />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="text-paper [&>path:nth-child(3)]:fill-cham" />
            <span className="ds-label">Nếp Club</span>
          </div>
          <p className="mt-8 font-display text-3xl leading-tight">{name}</p>
          <p className="mt-1 text-sm opacity-80">
            Hạng {me.tier.name} · {formatNumber(me.points)} điểm
          </p>
          <p className="mt-4 font-mono text-sm tracking-widest">{me.memberId}</p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-center">
          <div className="bg-white p-2">
            <DecorativeQr value={me.memberId} size={112} />
          </div>
          <p className="text-[11px] opacity-80">Quét tại quầy để tích điểm</p>
        </div>
      </div>
    </div>
  )
}

const QUICK = [
  { to: '/tai-khoan/don-hang', label: 'Đơn hàng', icon: Package },
  { to: '/yeu-thich', label: 'Yêu thích', icon: Heart },
  { to: '/doi-cu-lay-moi', label: 'Đổi cũ lấy mới', icon: Recycle },
  { to: '/cua-hang', label: 'Tìm cửa hàng', icon: MapPin },
  { to: '/tai-khoan/cai-dat', label: 'Cài đặt', icon: Settings },
]

export default function OverviewPage() {
  const { data: me } = useMe()
  const { data: rewards, isLoading } = useRewards()
  const { data: orders = [] } = useOrders()
  const latest = orders[0]
  return (
    <div className="space-y-12">
      <h1 className="ds-h1">Tài khoản & ưu đãi</h1>
      <MemberCard me={me} />

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="ds-h2">Ưu đãi dành cho bạn</h2>
          <Link to="/tai-khoan/thanh-vien" className="text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4">
            Quyền lợi hạng
          </Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {rewards?.offers.map((o) => (
              <li key={o.id} className={cn('flex flex-col border border-line', o.tone === 'cham' ? 'bg-cham-50' : 'bg-surface')}>
                <div className="aspect-[16/10] overflow-hidden bg-paper-2">
                  <img src={o.image} alt="" className="size-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-son uppercase">{expiryText(o.expiresAt)}</p>
                  <h3 className="mt-2 font-display text-xl leading-snug">{o.title}</h3>
                  <p className="mt-2 flex-1 text-[13px] text-ink-2">{o.description}</p>
                  {o.code && (
                    <div className="mt-4 flex items-center justify-between border border-dashed border-ink/40 px-3 py-2">
                      <span className="font-mono text-sm font-semibold tracking-widest">{o.code}</span>
                      <CopyButton value={o.code} label="Sao chép mã" className="text-ink" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {latest && (
        <section>
          <h2 className="ds-h2 mb-5">Đơn hàng gần đây</h2>
          <Link to={`/tai-khoan/don-hang/${latest.number}`} className="group flex flex-wrap items-center gap-5 border border-line bg-surface p-5 hover:border-ink">
            <div className="flex -space-x-4">
              {latest.items.slice(0, 3).map((it) => (
                <img key={it.id} src={it.image.url} alt="" className="h-20 w-15 border-2 border-surface object-cover" style={{ width: 60 }} />
              ))}
            </div>
            <div className="min-w-0 flex-1 text-[13px]">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold">{latest.number}</p>
                <StatusPill status={latest.status} />
              </div>
              <p className="mt-1 text-muted">
                {formatDate(latest.placedAt)} · {latest.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm · {formatPrice(latest.totals.total)}
              </p>
            </div>
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </section>
      )}

      <section>
        <h2 className="ds-h2 mb-5">Lối tắt</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK.map((q) => (
            <li key={q.to}>
              <Link to={q.to} className="flex h-full flex-col gap-3 border border-line bg-surface p-4 text-[13px] font-medium hover:border-ink">
                <q.icon className="size-5 text-cham" strokeWidth={1.5} />
                {q.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
