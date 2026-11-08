import { useState } from 'react'
import { Tabs } from '@/components/ui'
import { howToMeasure, sizeGuides } from '@/config/sizeGuides'

const ORDER = ['top-nu', 'bottom-nu', 'top-nam', 'bottom-nam', 'kids', 'shoes']
const SHORT = { 'top-nu': 'Áo nữ', 'bottom-nu': 'Quần nữ', 'top-nam': 'Áo nam', 'bottom-nam': 'Quần nam', kids: 'Trẻ em', shoes: 'Giày' }

/** Bảng size dạng tab (dùng ở trang Bảng size). */
export function SizeGuideTables() {
  const [key, setKey] = useState('top-nu')
  const g = sizeGuides[key]
  return (
    <div className="space-y-8">
      <div className="ds-scrollbar-none overflow-x-auto">
        <Tabs className="min-w-max" tabs={ORDER.map((k) => ({ value: k, label: SHORT[k] }))} value={key} onChange={setKey} />
      </div>
      <div>
        <h3 className="ds-h3 mb-3">{g.title}</h3>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[520px] text-[13px]">
            <thead>
              <tr className="bg-paper-2">
                <th scope="col" className="px-3 py-2.5 text-left ds-label">
                  Số đo (cm)
                </th>
                {g.columns.map((c) => (
                  <th key={c} scope="col" className="px-3 py-2.5 text-center font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th scope="row" className="px-3 py-2.5 text-left font-medium">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className="px-3 py-2.5 text-center tabular-nums">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">Số đo cơ thể, không phải số đo sản phẩm. Nếu nằm giữa hai size, chọn size lớn hơn để mặc thoải mái.</p>
      </div>
      <div>
        <h3 className="ds-h3 mb-3">Cách đo</h3>
        <ol className="grid gap-4 sm:grid-cols-2">
          {howToMeasure.map((m, i) => (
            <li key={m.key} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-ink text-xs">{i + 1}</span>
              <span>
                <span className="block font-semibold">{m.label}</span>
                <span className="text-[13px] text-ink-2">{m.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
