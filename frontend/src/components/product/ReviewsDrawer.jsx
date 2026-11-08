import { useState } from 'react'
import { BadgeCheck, ThumbsUp } from 'lucide-react'
import { Drawer, Spinner, Stars } from '@/components/ui'
import { useReviews } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'
import { formatDate, formatNumber } from '@/utils/format'

const SORTS = [
  { value: 'phu-hop', label: 'Phù hợp nhất' },
  { value: 'moi-nhat', label: 'Mới nhất' },
  { value: 'cao-nhat', label: 'Điểm cao nhất' },
  { value: 'thap-nhat', label: 'Điểm thấp nhất' },
]
const FIT = ['Chật', 'Đúng size', 'Rộng']
const LEN = ['Ngắn', 'Vừa', 'Dài']

/** Thang -1..1 hiển thị như vạch trượt (giống phần "Đúng size" trong thiết kế). */
function Scale({ title, labels, value }) {
  const pct = ((value + 1) / 2) * 100
  return (
    <div>
      <p className="mb-2 ds-label">{title}</p>
      <div className="relative h-px bg-ink">
        <span className="absolute top-1/2 h-3 w-1 -translate-x-1/2 -translate-y-1/2 bg-ink" style={{ left: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  )
}

function ReviewItem({ r }) {
  const [more, setMore] = useState(false)
  const long = r.text.length > 110
  return (
    <li className="border-t border-line py-5">
      <div className="flex items-center justify-between">
        <Stars value={r.rating} size={13} />
        <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed">{more || !long ? r.text : `${r.text.slice(0, 110)}…`}</p>
      {long && (
        <button type="button" onClick={() => setMore((m) => !m)} className="mt-1 text-xs font-semibold underline underline-offset-4">
          {more ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted">
        <div>
          <dt className="inline">Màu: </dt>
          <dd className="inline text-ink-2">{r.colorName}</dd>
        </div>
        {r.size && (
          <div>
            <dt className="inline">Size đã mua: </dt>
            <dd className="inline text-ink-2">{r.size}</dd>
          </div>
        )}
        {r.fit != null && (
          <div>
            <dt className="inline">Độ vừa: </dt>
            <dd className="inline text-ink-2">{FIT[r.fit + 1]}</dd>
          </div>
        )}
        {r.body && (
          <div>
            <dt className="inline">Người mặc: </dt>
            <dd className="inline text-ink-2">
              {r.body.heightCm} cm · {r.body.weightKg} kg
            </dd>
          </div>
        )}
      </dl>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1.5">
          {r.author} · {r.city}
          {r.verified && (
            <span className="flex items-center gap-0.5 text-la">
              <BadgeCheck className="size-3.5" /> Đã mua hàng
            </span>
          )}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsUp className="size-3.5" /> {r.helpful}
        </span>
      </div>
    </li>
  )
}

export function ReviewsDrawer({ open, onClose, productId }) {
  const [sort, setSort] = useState('phu-hop')
  const { data, isFetching } = useReviews(open ? productId : null, sort)
  const s = data?.summary
  return (
    <Drawer open={open} onClose={onClose} title="Đánh giá">
      {!data ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-4xl">{s.average.toFixed(1).replace('.', ',')}</p>
              <Stars value={s.average} size={16} className="mt-1" />
            </div>
            <div className="text-right text-xs text-muted">
              <p>Dựa trên {formatNumber(s.count)} đánh giá</p>
              <p className="mt-1 text-la">{s.recommendPercent}% khách hàng hài lòng</p>
            </div>
          </div>
          <ul className="mt-5 space-y-1.5">
            {s.distribution.map((d) => (
              <li key={d.star} className="flex items-center gap-3 text-xs">
                <span className="w-8">{d.star} sao</span>
                <span className="h-1 flex-1 bg-line">
                  <span className="block h-full bg-ink" style={{ width: `${(d.count / data.items.length) * 100}%` }} />
                </span>
                <span className="w-5 text-right text-muted tabular-nums">{d.count}</span>
              </li>
            ))}
          </ul>
          {s.fit != null && (
            <div className="mt-6 space-y-5">
              <Scale title="Độ vừa vặn" labels={FIT} value={s.fit} />
              <Scale title="Độ dài" labels={LEN} value={s.length} />
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs">
              <span className="ds-label">Sắp xếp</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-line-strong bg-surface px-2 py-1.5 text-xs">
                {SORTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            {isFetching && <Spinner className="[&_svg]:size-4" />}
          </div>
          <ul className={cn('mt-4 transition-opacity', isFetching && 'opacity-60')}>
            {data.items.map((r) => (
              <ReviewItem key={r.id} r={r} />
            ))}
          </ul>
          <p className="border-t border-line pt-4 text-xs text-muted">Đánh giá được kiểm duyệt theo Quy định đánh giá của Nếp. Hiển thị {data.items.length} đánh giá gần đây nhất.</p>
        </div>
      )}
    </Drawer>
  )
}
