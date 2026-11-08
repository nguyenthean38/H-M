import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Plus, X } from 'lucide-react'
import { Button, Drawer, Radio, Swatch } from '@/components/ui'
import { useProducts } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

export const SORT_OPTIONS = [
  { value: 'de-xuat', label: 'Đề xuất' },
  { value: 'moi-nhat', label: 'Mới nhất' },
  { value: 'ban-chay', label: 'Bán chạy' },
  { value: 'gia-tang', label: 'Giá thấp đến cao' },
  { value: 'gia-giam', label: 'Giá cao đến thấp' },
]

const PANELS = [
  { key: 'sort', label: 'Sắp xếp' },
  { key: 'type', label: 'Loại sản phẩm' },
  { key: 'color', label: 'Màu sắc' },
  { key: 'size', label: 'Size' },
  { key: 'fit', label: 'Dáng' },
  { key: 'material', label: 'Chất liệu' },
]
export const FILTER_KEYS = ['type', 'color', 'size', 'fit', 'material', 'minPrice', 'maxPrice', 'sort']

const csv = (v) => (v ? String(v).split(',').filter(Boolean) : [])

/** Thanh trượt khoảng giá 2 đầu. */
function PriceRange({ min, max, value, onChange }) {
  const step = 10000
  const lo = value[0] ?? min
  const hi = value[1] ?? max
  if (max <= min) return <p className="text-xs text-muted">Chỉ có một mức giá.</p>
  const pct = (v) => ((v - min) / (max - min)) * 100
  const thumb =
    'pointer-events-none absolute inset-0 h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-surface [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-surface'
  return (
    <div>
      <div className="mb-4 flex justify-between text-[13px] tabular-nums">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi)}</span>
      </div>
      <div className="relative h-1">
        <div className="absolute inset-0 bg-line" />
        <div className="absolute h-1 bg-ink" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" aria-label="Giá thấp nhất" min={min} max={max} step={step} value={lo} onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])} className={thumb} />
        <input type="range" aria-label="Giá cao nhất" min={min} max={max} step={step} value={hi} onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])} className={thumb} />
      </div>
    </div>
  )
}

/**
 * Bộ lọc dạng ngăn kéo, mỗi nhóm lọc mở thành panel con (giống luồng thiết kế).
 * Thay đổi chỉ áp dụng khi bấm "Xem (N)"; số N đếm trực tiếp từ API theo bộ lọc tạm.
 */
export function FilterDrawer({ open, onClose, baseFilters, applied, facets, onApply }) {
  const [draft, setDraft] = useState(applied)
  const [panel, setPanel] = useState(null)
  useEffect(() => {
    if (open) {
      setDraft(applied)
      setPanel(null)
    }
  }, [open, applied])

  const countQuery = useMemo(() => ({ ...baseFilters, ...draft, pageSize: 1 }), [baseFilters, draft])
  const { data: preview, isFetching } = useProducts(countQuery, { enabled: open })
  const f = preview?.facets ?? facets

  const toggle = (key, value) =>
    setDraft((d) => {
      const list = csv(d[key])
      const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
      return { ...d, [key]: next.join(',') || undefined }
    })

  const chips = []
  for (const key of ['type', 'color', 'size', 'fit', 'material']) {
    for (const v of csv(draft[key])) chips.push({ key, value: v, label: f?.[key]?.find((o) => o.value === v)?.label ?? v })
  }
  if (draft.minPrice || draft.maxPrice) chips.push({ key: 'price', label: 'Khoảng giá' })
  if (draft.sort && draft.sort !== 'de-xuat') chips.push({ key: 'sort', label: SORT_OPTIONS.find((s) => s.value === draft.sort)?.label })

  const removeChip = (c) => {
    if (c.key === 'price') setDraft((d) => ({ ...d, minPrice: undefined, maxPrice: undefined }))
    else if (c.key === 'sort') setDraft((d) => ({ ...d, sort: undefined }))
    else toggle(c.key, c.value)
  }

  const activeCount = (key) => csv(draft[key]).length
  const current = PANELS.find((p) => p.key === panel)

  const footer = (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" onClick={() => setDraft({})} disabled={!chips.length}>
        Xoá
      </Button>
      <Button
        onClick={() => {
          onApply(draft)
          onClose()
        }}
        disabled={preview?.total === 0}
      >
        {isFetching ? 'Xem…' : `Xem (${preview?.total ?? '…'})`}
      </Button>
    </div>
  )

  return (
    <Drawer open={open} onClose={onClose} onBack={panel ? () => setPanel(null) : undefined} title={current?.label ?? 'Bộ lọc'} footer={footer}>
      {!panel ? (
        <div className="px-5 py-4">
          {chips.length > 0 && (
            <ul className="mb-5 flex flex-wrap gap-2">
              {chips.map((c) => (
                <li key={`${c.key}-${c.value ?? ''}`}>
                  <button type="button" onClick={() => removeChip(c)} className="flex items-center gap-1.5 border border-ink px-2 py-1 text-[11px] font-semibold tracking-wide uppercase hover:bg-ink hover:text-paper">
                    {c.label} <X className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <section className="border-b border-line pb-6">
            <h3 className="ds-label mb-4">Khoảng giá</h3>
            {facets?.price && (
              <PriceRange
                min={Math.floor(facets.price.min / 10000) * 10000}
                max={Math.ceil(facets.price.max / 10000) * 10000}
                value={[draft.minPrice ? Number(draft.minPrice) : undefined, draft.maxPrice ? Number(draft.maxPrice) : undefined]}
                onChange={([lo, hi]) => setDraft((d) => ({ ...d, minPrice: String(lo), maxPrice: String(hi) }))}
              />
            )}
          </section>
          <ul>
            {PANELS.filter((p) => p.key === 'sort' || (f?.[p.key]?.length ?? 0) > 1 || activeCount(p.key)).map((p) => (
              <li key={p.key} className="border-b border-line">
                <button type="button" onClick={() => setPanel(p.key)} className="flex w-full items-center justify-between py-4 ds-label">
                  <span>
                    {p.label}
                    {p.key === 'sort' ? (
                      <span className="ml-2 font-normal tracking-normal normal-case text-muted">{SORT_OPTIONS.find((s) => s.value === (draft.sort ?? 'de-xuat'))?.label}</span>
                    ) : activeCount(p.key) ? (
                      <span className="ml-2 text-cham">({activeCount(p.key)})</span>
                    ) : null}
                  </span>
                  <ChevronRight className="size-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted">
            <Plus className="size-3.5" /> Mẹo: chọn nhiều màu hoặc size cùng lúc để mở rộng kết quả.
          </p>
        </div>
      ) : panel === 'sort' ? (
        <fieldset className="space-y-4 px-5 py-5">
          <legend className="sr-only">Sắp xếp</legend>
          {SORT_OPTIONS.map((o) => (
            <Radio key={o.value} name="sort" label={o.label} checked={(draft.sort ?? 'de-xuat') === o.value} onChange={() => setDraft((d) => ({ ...d, sort: o.value === 'de-xuat' ? undefined : o.value }))} />
          ))}
        </fieldset>
      ) : (
        <ul className={cn('px-5 py-3', panel === 'size' && 'grid grid-cols-3 gap-2')}>
          {(f?.[panel] ?? []).map((o) => {
            const checked = csv(draft[panel]).includes(o.value)
            if (panel === 'size') {
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => toggle(panel, o.value)}
                    aria-pressed={checked}
                    className={cn('h-11 w-full border text-[13px] transition-colors', checked ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink')}
                  >
                    {o.label}
                  </button>
                </li>
              )
            }
            return (
              <li key={o.value}>
                <label className="flex cursor-pointer items-center gap-3 py-2.5 text-[14px]">
                  <input type="checkbox" checked={checked} onChange={() => toggle(panel, o.value)} className="size-[18px] accent-ink" />
                  <span className="flex-1">{o.label}</span>
                  <span className="text-xs text-muted tabular-nums">[{o.count}]</span>
                  {panel === 'color' && <Swatch hex={o.hex} size={14} />}
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </Drawer>
  )
}
