import { cn } from '@/utils/cn'

export const DEPARTMENT_LABELS = { nu: 'Nữ', nam: 'Nam', 'tre-em': 'Trẻ em', nha: 'Nhà', 'lam-dep': 'Làm đẹp' }

/** Giờ mở cửa áp dụng cho hôm nay (T2–T6 hoặc T7–CN). */
export function todayHours(store, date = new Date()) {
  const weekend = [0, 6].includes(date.getDay())
  return store.hours[weekend ? 1 : 0] ?? store.hours[0]
}

export function OpenPill({ store, className }) {
  const h = todayHours(store)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs',
        store.openNow ? 'text-la' : 'text-muted',
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', store.openNow ? 'bg-la' : 'bg-subtle')} aria-hidden />
      {store.openNow ? `Đang mở cửa · đóng lúc ${h.close}` : `Đã đóng cửa · mở lúc ${h.open}`}
    </span>
  )
}

export function HoursTable({ store, className }) {
  const today = todayHours(store)
  return (
    <table className={cn('w-full text-[13px]', className)}>
      <tbody>
        {store.hours.map((h) => (
          <tr key={h.days} className={cn(h === today && 'font-semibold')}>
            <th scope="row" className="py-1 pr-4 text-left font-[inherit]">
              {h.days}
            </th>
            <td className="py-1 text-right tabular-nums">
              {h.open} – {h.close}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const formatKm = (km) => (km == null ? null : `${String(km).replace('.', ',')} km`)
