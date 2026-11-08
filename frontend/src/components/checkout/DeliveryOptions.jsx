import { Clock, MapPin } from 'lucide-react'
import { Notice } from '@/components/ui'
import { provinceName } from '@/config/locations'
import { cn } from '@/utils/cn'
import { ChoiceCard } from './Section'
import { formatEta, priceLabel } from './helpers'

export function DeliveryMethodList({ methods, value, onChange, error }) {
  if (!methods) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="ds-skeleton h-16" />
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Phương thức giao hàng">
      {methods.map((m) => (
        <ChoiceCard key={m.id} name="delivery" value={m.id} checked={value === m.id} onChange={() => onChange(m.id)} disabled={!m.available}>
          <span className="flex flex-wrap items-baseline justify-between gap-x-4">
            <span className="text-[14px] font-semibold">{m.name}</span>
            <span className={cn('text-[13px] tabular-nums', m.price === 0 && 'font-medium text-la')}>
              {m.price === 0 && m.basePrice > 0 && <span className="mr-1.5 text-muted line-through">{priceLabel(m.basePrice)}</span>}
              {priceLabel(m.price)}
            </span>
          </span>
          <span className="mt-0.5 block text-xs text-muted">{m.available ? m.description : m.unavailableReason}</span>
          {m.available && <span className="mt-1 block text-xs font-medium text-cham">Dự kiến nhận: {formatEta(m.eta)}</span>}
        </ChoiceCard>
      ))}
      {error && (
        <div data-error="true">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
    </div>
  )
}

/** Chọn cửa hàng nhận hàng, nhóm theo thành phố. */
export function PickupStoreList({ stores = [], value, onChange, error }) {
  const byCity = stores.reduce((acc, s) => {
    ;(acc[s.city] ??= []).push(s)
    return acc
  }, {})
  return (
    <div>
      <p className="mb-3 text-[13px] font-medium">Chọn cửa hàng nhận hàng</p>
      <div className={cn('max-h-[420px] space-y-5 overflow-y-auto border bg-paper p-3', error ? 'border-son' : 'border-line')} data-error={error ? 'true' : undefined}>
        {Object.entries(byCity).map(([city, list]) => (
          <div key={city}>
            <p className="ds-eyebrow mb-2">{city}</p>
            <div className="space-y-2">
              {list.map((s) => {
                const h = s.hours?.[new Date().getDay() % 6 === 0 ? 1 : 0]
                return (
                  <ChoiceCard key={s.id} name="store" value={s.id} checked={value === s.id} onChange={() => onChange(s.id)}>
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-[14px] font-semibold">{s.name}</span>
                      <span className={cn('text-[11px] font-medium', s.openNow ? 'text-la' : 'text-muted')}>{s.openNow ? 'Đang mở cửa' : 'Đã đóng cửa'}</span>
                    </span>
                    <span className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                      <MapPin className="mt-px size-3.5 shrink-0" strokeWidth={1.5} /> {s.fullAddress}
                    </span>
                    {h && (
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                        <Clock className="size-3.5 shrink-0" strokeWidth={1.5} /> Hôm nay {h.open} – {h.close}
                      </span>
                    )}
                  </ChoiceCard>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs text-son">{error}</p>}
    </div>
  )
}

export function addressLine(a) {
  if (!a) return ''
  return [a.line1, a.ward, provinceName(a.province)].filter(Boolean).join(', ')
}
