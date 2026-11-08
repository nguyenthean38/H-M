import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, CircleAlert, CircleCheck, Info, LoaderCircle, Star, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
import { useUI } from '@/store/ui'

/** Giá: giá giảm màu son + giá gốc gạch ngang. */
export function Price({ price, originalPrice, className, size = 'sm' }) {
  const sale = originalPrice && originalPrice > price
  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2', size === 'lg' ? 'text-lg' : 'text-[13px]', className)}>
      <span className={cn('font-semibold tabular-nums', sale && 'text-son')}>{formatPrice(price)}</span>
      {sale && <span className="text-muted tabular-nums line-through">{formatPrice(originalPrice)}</span>}
    </p>
  )
}

const BADGE_STYLES = {
  sale: 'bg-son text-paper',
  moi: 'bg-surface text-ink',
  'ban-chay': 'bg-ink text-paper',
  'ben-vung': 'bg-la-50 text-la',
  cham: 'bg-cham text-paper',
  neutral: 'bg-paper-2 text-ink-2',
}
export const BADGE_LABELS = { moi: 'Mới', 'ban-chay': 'Bán chạy', 'ben-vung': 'Bền vững hơn', 'online': 'Chỉ có online' }

export function Badge({ tone = 'neutral', children, className }) {
  return <span className={cn('ds-fold inline-flex h-5 items-center px-2 text-[10px] font-semibold tracking-[0.08em] uppercase', BADGE_STYLES[tone], className)}>{children}</span>
}

export function Stars({ value = 0, size = 14, className, label }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={label ?? `${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i + 1))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-line-strong" style={{ width: size, height: size }} strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-ink text-ink" style={{ width: size, height: size }} strokeWidth={1.5} />
            </span>
          </span>
        )
      })}
    </span>
  )
}

export function Spinner({ className, label = 'Đang tải' }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-muted', className)} role="status">
      <LoaderCircle className="size-5 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  )
}

export function Breadcrumbs({ items = [], className }) {
  return (
    <nav aria-label="Đường dẫn" className={cn('text-xs text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3" aria-hidden />}
            {it.href ? (
              <Link to={it.href} className="hover:text-ink hover:underline">
                {it.label}
              </Link>
            ) : (
              <span className="text-ink" aria-current="page">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Thông báo dạng dải: info / success / error. */
export function Notice({ tone = 'info', children, onClose, className }) {
  const Icon = tone === 'success' ? CircleCheck : tone === 'error' ? CircleAlert : Info
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 px-4 py-3 text-[13px]',
        tone === 'success' && 'bg-la-50 text-la',
        tone === 'error' && 'bg-son-50 text-son',
        tone === 'info' && 'bg-paper-2 text-ink-2',
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Đóng thông báo" className="hover:opacity-60">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, children, action, className, icon: Icon }) {
  return (
    <div className={cn('flex flex-col items-center px-4 py-16 text-center', className)}>
      {Icon && <Icon className="mb-4 size-10 text-cham" strokeWidth={1.25} aria-hidden />}
      <h2 className="ds-h2">{title}</h2>
      {children && <div className="mt-3 max-w-md text-muted">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

const TOAST_ICON = { success: CircleCheck, error: CircleAlert, info: Info }

/** Hiển thị toast từ `useUI().toast(message, tone)`. Gắn một lần ở App. */
export function Toaster() {
  const toasts = useUI((s) => s.toasts)
  const dismiss = useUI((s) => s.dismissToast)
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[90] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4" aria-live="polite">
      {toasts.map((t) => {
        const Icon = TOAST_ICON[t.tone] ?? Info
        return (
          <div key={t.id} className={cn('pointer-events-auto flex animate-slide-up items-center gap-3 px-4 py-3 text-paper shadow-lg', t.tone === 'error' ? 'bg-son' : 'bg-ink')}>
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="flex-1 text-[13px]">{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Đóng thông báo" className="hover:opacity-70">
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/** Chấm màu (swatch). Hỗ trợ cả gradient cho "Nhiều màu". */
export function Swatch({ hex, size = 12, className, title }) {
  const isGradient = hex?.includes('gradient')
  return (
    <span
      title={title}
      className={cn('inline-block shrink-0 rounded-full border border-ink/15', className)}
      style={{ width: size, height: size, background: isGradient ? hex : undefined, backgroundColor: isGradient ? undefined : hex }}
    />
  )
}

/** Mã QR minh hoạ (không quét được) — sinh ô theo chuỗi `value` cho bản demo. */
export function DecorativeQr({ value = 'nep', size = 132, className }) {
  const N = 25
  const cells = useMemo(() => {
    let h = 2166136261
    for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0
    const out = []
    const finder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        h = (Math.imul(h, 1103515245) + 12345) >>> 0
        if (!finder(x, y) && (h >>> 16) % 100 < 47) out.push([x, y])
      }
    return out
  }, [value])
  const s = size / N
  const Finder = ({ x, y }) => (
    <g transform={`translate(${x * s},${y * s})`}>
      <rect width={7 * s} height={7 * s} fill="currentColor" />
      <rect x={s} y={s} width={5 * s} height={5 * s} fill="#fff" />
      <rect x={2 * s} y={2 * s} width={3 * s} height={3 * s} fill="currentColor" />
    </g>
  )
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn('bg-white text-ink', className)} role="img" aria-label="Mã QR (minh hoạ)">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * s} y={y * s} width={s} height={s} fill="currentColor" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={N - 7} y={0} />
      <Finder x={0} y={N - 7} />
    </svg>
  )
}

/** Thanh tiến độ mỏng (điểm thành viên, miễn phí giao hàng). */
export function ProgressBar({ value = 0, className, tone = 'cham' }) {
  return (
    <div className={cn('h-1 w-full bg-line', className)} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn('h-full transition-[width] duration-500', tone === 'cham' ? 'bg-cham' : 'bg-ink')} style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} />
    </div>
  )
}
