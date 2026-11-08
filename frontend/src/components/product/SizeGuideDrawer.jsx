import { useState } from 'react'
import { Ruler, Sparkles } from 'lucide-react'
import { Accordion, Button, Drawer, Input, Tabs } from '@/components/ui'
import { howToMeasure, recommendSize, sizeGuides } from '@/config/sizeGuides'
import { cn } from '@/utils/cn'

/** Hình người với các điểm đo đánh số (vẽ SVG, không dùng ảnh). */
function MeasureFigure() {
  return (
    <svg viewBox="0 0 200 220" className="mx-auto h-48 text-ink" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="100" cy="28" r="16" />
        <path d="M84 46c-20 6-34 16-38 30l-12 62M116 46c20 6 34 16 38 30l12 62M70 70l2 70c0 22 6 50 10 74M130 70l-2 70c0 22-6 50-10 74M84 46h32" />
      </g>
      <g stroke="var(--color-son)" strokeWidth="1.6" strokeDasharray="4 3" fill="none">
        <ellipse cx="100" cy="84" rx="32" ry="6" />
        <ellipse cx="100" cy="116" rx="28" ry="5" />
        <ellipse cx="100" cy="146" rx="32" ry="6" />
        <path d="M150 60l14 74" />
      </g>
      <g fontSize="10" fontFamily="var(--font-sans)" fill="currentColor">
        {[
          ['1', 52, 86],
          ['2', 56, 118],
          ['3', 52, 148],
          ['4', 170, 98],
        ].map(([n, x, y]) => (
          <g key={n}>
            <circle cx={x} cy={y - 3} r="7" fill="var(--color-paper)" stroke="currentColor" />
            <text x={x} y={y} textAnchor="middle">
              {n}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

/** Công cụ gợi ý size theo chiều cao & cân nặng — điểm khác biệt của Nếp. */
function SizeAdvisor({ guideKey, onPick }) {
  const isKids = guideKey === 'kids'
  const [h, setH] = useState('')
  const [w, setW] = useState('')
  const [pref, setPref] = useState('vua')
  const result = recommendSize(guideKey, { heightCm: Number(h), weightKg: Number(w), preference: pref })
  return (
    <div className="bg-cham-50 p-4">
      <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-cham-600">
        <Sparkles className="size-4" /> Gợi ý size cho bạn
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Chiều cao (cm)" inputMode="numeric" value={h} onChange={(e) => setH(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder={isKids ? '110' : '160'} />
        {!isKids && <Input label="Cân nặng (kg)" inputMode="numeric" value={w} onChange={(e) => setW(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="52" />}
      </div>
      {!isKids && (
        <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Bạn thích mặc">
          {[
            ['om', 'Ôm'],
            ['vua', 'Vừa'],
            ['rong', 'Rộng'],
          ].map(([v, l]) => (
            <button key={v} type="button" role="radio" aria-checked={pref === v} onClick={() => setPref(v)} className={cn('flex-1 border py-2 text-xs font-semibold', pref === v ? 'border-cham bg-cham text-paper' : 'border-cham-300 text-cham-600')}>
              Mặc {l.toLowerCase()}
            </button>
          ))}
        </div>
      )}
      {result && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-cham-300 pt-3">
          <p className="text-[13px]">
            Size phù hợp: <strong className="font-display text-2xl text-cham">{result.size}</strong>
            {result.note && <span className="block text-xs text-muted">({result.note})</span>}
          </p>
          {onPick && (
            <Button size="sm" variant="cham" onClick={() => onPick(result.size)}>
              Chọn size {result.size}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function SizeGuideDrawer({ open, onClose, guideKey, onPick }) {
  const guide = sizeGuides[guideKey]
  const [unit, setUnit] = useState('cm')
  if (!guide) return null
  return (
    <Drawer open={open} onClose={onClose} title={`Bảng size — ${guide.title}`} width="sm:max-w-[520px]">
      <div className="space-y-6 px-5 py-5">
        {guideKey !== 'shoes' && <SizeAdvisor guideKey={guideKey} onPick={onPick} />}
        <Accordion
          title={
            <span className="flex items-center gap-2">
              <Ruler className="size-4" /> Cách đo
            </span>
          }
        >
          <MeasureFigure />
          <ol className="mt-4 space-y-3 text-[13px]">
            {howToMeasure.map((m, i) => (
              <li key={m.key} className="flex gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-ink text-[10px]">{i + 1}</span>
                <span>
                  <strong className="block text-xs tracking-wide uppercase">{m.label}</strong>
                  {m.text}
                </span>
              </li>
            ))}
          </ol>
        </Accordion>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="ds-label">Số đo cơ thể</h3>
            {guideKey !== 'kids' && guideKey !== 'shoes' && <Tabs tabs={[{ value: 'cm', label: 'cm' }, { value: 'inch', label: 'inch' }]} value={unit} onChange={setUnit} className="border-0" />}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="py-2 pr-2 text-left font-semibold" />
                  {guide.columns.map((c) => (
                    <th key={c} className="px-1 py-2 text-center font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((r) => (
                  <tr key={r.label} className="border-t border-line">
                    <th scope="row" className="py-2.5 pr-2 text-left font-medium">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className="px-1 py-2.5 text-center tabular-nums">
                        {unit === 'inch' && /cm|Vòng|Dài/.test(r.label) && !r.label.includes('kg') ? v.replace(/\d+/g, (n) => (Number(n) / 2.54).toFixed(1).replace('.', ',')) : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Số đo là số đo cơ thể, không phải số đo sản phẩm. Nếu nằm giữa hai size, chọn size lớn hơn để mặc thoải mái.</p>
        </div>
      </div>
    </Drawer>
  )
}
