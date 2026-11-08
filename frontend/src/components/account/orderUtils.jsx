import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { provinceName } from '@/config/locations'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { formatDateTime, formatDay, formatPhone, formatPrice } from '@/utils/format'

export const STATUS = {
  placed: { label: 'Đã đặt hàng', tone: 'bg-cham-50 text-cham', headline: 'Chúng tôi đã nhận đơn hàng', note: 'Đơn hàng đang chờ xác nhận và sẽ được chuẩn bị trong ít phút nữa.' },
  processing: { label: 'Đang chuẩn bị', tone: 'bg-cham-50 text-cham', headline: 'Đang chuẩn bị đơn hàng', note: 'Đơn hàng đang được đóng gói và sẽ sớm giao cho đơn vị vận chuyển.' },
  shipped: { label: 'Đang giao', tone: 'bg-nghe/15 text-ink', headline: 'Đơn hàng đang trên đường giao', note: 'Shipper sẽ gọi cho bạn trước khi giao. Vui lòng để ý điện thoại.' },
  delivered: { label: 'Đã giao', tone: 'bg-la-50 text-la', headline: 'Đơn hàng đã được giao', note: 'Cảm ơn bạn đã mua sắm tại Nếp. Bạn có thể đổi trả trong 30 ngày.' },
  completed: { label: 'Hoàn tất', tone: 'bg-la-50 text-la', headline: 'Giao dịch đã hoàn tất', note: 'Mua tại cửa hàng. Bạn có thể đổi trả trong 30 ngày tại mọi cửa hàng Nếp.' },
  cancelled: { label: 'Đã huỷ', tone: 'bg-son-50 text-son', headline: 'Đơn hàng đã được huỷ', note: 'Tiền sẽ được hoàn về phương thức thanh toán ban đầu trong 3–7 ngày làm việc.' },
}

export const STEP_LABELS = { placed: 'Đã đặt hàng', processing: 'Đang chuẩn bị', shipped: 'Đang giao', delivered: 'Đã giao' }

export function StatusPill({ status, className }) {
  const s = STATUS[status] ?? STATUS.placed
  return <span className={cn('ds-fold inline-flex h-6 items-center px-2.5 text-[11px] font-semibold tracking-[0.06em] uppercase', s.tone, className)}>{s.label}</span>
}

export function CopyButton({ value, label = 'Sao chép', className }) {
  const toast = useUI((s) => s.toast)
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      aria-label={`${label} ${value}`}
      className={cn('inline-flex items-center gap-1 text-xs text-muted hover:text-ink', className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
        } catch {
          /* trình duyệt chặn clipboard */
        }
        setDone(true)
        toast(`Đã sao chép ${value}`, 'success')
        setTimeout(() => setDone(false), 1800)
      }}
    >
      {done ? <Check className="size-3.5 text-la" /> : <Copy className="size-3.5" />}
    </button>
  )
}

/** Dòng thời gian 4 bước. */
export function OrderTimeline({ order, compact }) {
  const cancelled = order.status === 'cancelled'
  return (
    <ol className="relative space-y-0">
      {order.timeline.map((t, i) => {
        const last = i === order.timeline.length - 1
        const current = !cancelled && t.done && !order.timeline[i + 1]?.done
        return (
          <li key={t.status} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && <span className={cn('absolute top-6 left-[11px] h-[calc(100%-24px)] w-px', t.done && order.timeline[i + 1]?.done ? 'bg-ink' : 'bg-line-strong')} aria-hidden />}
            <span
              className={cn(
                'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                t.done ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-surface text-subtle',
                current && 'ring-4 ring-cham-50',
              )}
            >
              {t.done ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
            </span>
            <div className={cn('pt-0.5', !t.done && 'text-subtle')}>
              <p className={cn('text-[13px] font-semibold', current && 'text-cham')}>{STEP_LABELS[t.status]}</p>
              {!compact && t.at && <p className="text-xs text-muted">{formatDateTime(t.at)}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function OrderItems({ items }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((it) => (
        <li key={it.id} className="flex gap-4 py-4 first:pt-0">
          <img src={it.image.url} alt={it.image.alt} className="h-28 w-21 shrink-0 bg-paper-2 object-cover" />
          <div className="min-w-0 flex-1 text-[13px]">
            <p className="font-medium">{it.name}</p>
            <p className="mt-1">
              <span className={cn('font-semibold', it.originalPrice && 'text-son')}>{formatPrice(it.price)}</span>
              {it.originalPrice ? <span className="ml-2 text-muted line-through">{formatPrice(it.originalPrice)}</span> : null}
            </p>
            <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 text-xs text-muted">
              <dt>Màu</dt>
              <dd className="text-ink-2">{it.colorName}</dd>
              <dt>Size</dt>
              <dd className="text-ink-2">{it.size}</dd>
              <dt>Số lượng</dt>
              <dd className="text-ink-2">{it.quantity}</dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function paymentLabel(p) {
  if (!p) return ''
  if (p.last4) return `${p.name} · ${(p.brand ?? 'thẻ').toUpperCase()} •••• ${p.last4}${p.installments ? ` · ${p.installments} kỳ` : ''}`
  if (p.wallet) return `${p.name} · ${p.wallet}`
  return p.name
}

export function TotalsTable({ order }) {
  const t = order.totals
  const row = (label, value, cls) => (
    <div className={cn('flex justify-between gap-4', cls)}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
  return (
    <dl className="space-y-2 text-[13px]">
      {row('Giá trị đơn hàng', formatPrice(t.orderValue))}
      {t.saleDiscount > 0 && row('Giảm giá', `-${formatPrice(t.saleDiscount)}`, 'text-son')}
      {t.promoDiscount > 0 && row(`Mã giảm giá${order.promo ? ` (${order.promo.code})` : ''}`, `-${formatPrice(t.promoDiscount)}`, 'text-son')}
      {row('Phí giao hàng', t.shipping ? formatPrice(t.shipping) : 'Miễn phí')}
      {row('Tổng cộng', formatPrice(t.total), 'border-t border-line pt-3 text-[15px] font-semibold')}
      <p className="text-xs text-muted">Đã bao gồm VAT</p>
    </dl>
  )
}

export function DeliveryBlock({ order }) {
  const a = order.shippingAddress
  return (
    <div className="space-y-4 text-[13px]">
      <div>
        <p className="ds-label mb-1">Phương thức giao hàng</p>
        <p>{order.delivery?.name}</p>
        {order.estimatedDelivery && order.status !== 'cancelled' && !['delivered', 'completed'].includes(order.status) && (
          <p className="text-muted">
            Dự kiến: {formatDay(order.estimatedDelivery[0])}
            {order.estimatedDelivery[1] !== order.estimatedDelivery[0] && ` – ${formatDay(order.estimatedDelivery[1])}`}
          </p>
        )}
      </div>
      {a && (
        <div>
          <p className="ds-label mb-1">Địa chỉ giao hàng</p>
          <p>
            {a.fullName} · {formatPhone(a.phone)}
          </p>
          <p className="text-ink-2">
            {a.line1}, {a.ward}, {provinceName(a.province)}
          </p>
        </div>
      )}
      {order.store && (
        <div>
          <p className="ds-label mb-1">Nhận tại cửa hàng</p>
          <p>{order.store.name}</p>
          <p className="text-ink-2">{order.store.address}</p>
        </div>
      )}
      {order.storeName && !order.store && (
        <div>
          <p className="ds-label mb-1">Cửa hàng</p>
          <p>{order.storeName}</p>
        </div>
      )}
    </div>
  )
}
