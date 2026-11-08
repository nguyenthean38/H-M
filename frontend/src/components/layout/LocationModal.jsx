import { useState } from 'react'
import { Check, Minus, Plus, Truck, Zap } from 'lucide-react'
import { Modal } from '@/components/ui'
import { provinces, regions } from '@/config/locations'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

/** Chọn khu vực giao hàng (theo miền → tỉnh/thành), dùng để ước tính ngày giao ở trang sản phẩm & thanh toán. */
export function LocationModal() {
  const open = useUI((s) => s.locationOpen)
  const close = useUI((s) => s.closeLocation)
  const province = useUI((s) => s.province)
  const setProvince = useUI((s) => s.setProvince)
  const toast = useUI((s) => s.toast)
  const current = provinces.find((p) => p.code === province)
  const [expanded, setExpanded] = useState(current?.region ?? 'nam')

  return (
    <Modal open={open} onClose={close} title="Khu vực giao hàng" size="sm">
      <p className="mb-4 flex items-center justify-center gap-2 text-[13px] text-ink-2">
        <Truck className="size-4" strokeWidth={1.5} /> Giao hàng toàn quốc · 34 tỉnh thành
      </p>
      <ul className="border-t border-line">
        {regions.map((r) => {
          const isOpen = expanded === r.code
          return (
            <li key={r.code} className="border-b border-line">
              <button type="button" onClick={() => setExpanded(isOpen ? null : r.code)} className="flex w-full items-center justify-between py-3.5 ds-label" aria-expanded={isOpen}>
                {r.name}
                {isOpen ? <Minus className="size-4" strokeWidth={1.5} /> : <Plus className="size-4" strokeWidth={1.5} />}
              </button>
              {isOpen && (
                <ul className="animate-drop pb-3">
                  {provinces
                    .filter((p) => p.region === r.code)
                    .map((p) => (
                      <li key={p.code}>
                        <button
                          type="button"
                          onClick={() => {
                            setProvince(p.code)
                            toast(`Đã chọn giao đến ${p.name}`, 'success')
                            close()
                          }}
                          className={cn('flex w-full items-center justify-between gap-3 px-2 py-2 text-left text-[13px] hover:bg-paper-2', p.code === province && 'font-semibold')}
                        >
                          <span className="flex items-center gap-2">
                            {p.code === province ? <Check className="size-3.5 text-cham" /> : <span className="size-3.5" />}
                            {p.name}
                            {p.express && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold tracking-wide text-cham uppercase">
                                <Zap className="size-3" /> 2 giờ
                              </span>
                            )}
                          </span>
                          <span className="text-xs font-normal text-muted">
                            {p.days[0]}–{p.days[1]} ngày
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
