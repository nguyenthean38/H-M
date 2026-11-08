import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button, Drawer, Radio, Spinner } from '@/components/ui'
import { useStores } from '@/hooks/useStores'

/**
 * Chọn cửa hàng để lọc "Nhận hôm nay tại cửa hàng" (ảnh thiết kế #20–#23).
 * `availability` (tuỳ chọn): [{ storeId, stock }] để hiện "Còn hàng / Hết hàng" ở trang sản phẩm.
 */
export function StorePickerDrawer({ open, onClose, value, onChange, availability, title = 'Chọn cửa hàng' }) {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(value)
  const { data: stores = [], isFetching } = useStores(q.trim() ? { q: q.trim() } : {})
  useEffect(() => {
    if (open) setSelected(value)
  }, [open, value])
  const stockOf = (id) => availability?.find((a) => a.storeId === id)?.stock

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            disabled={!selected}
            onClick={() => {
              setSelected(null)
              onChange(null)
              onClose()
            }}
          >
            Xoá
          </Button>
          <Button
            disabled={!selected}
            onClick={() => {
              onChange(selected)
              onClose()
            }}
          >
            Xong
          </Button>
        </div>
      }
    >
      <div className="sticky top-0 z-10 border-b border-line bg-surface px-5 py-4">
        <label className="flex h-11 items-center gap-2 border border-line-strong px-3 focus-within:border-ink">
          <Search className="size-4 text-muted" strokeWidth={1.5} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo thành phố, phường, tên đường…" className="flex-1 bg-transparent text-[13px] outline-none" aria-label="Tìm cửa hàng" />
          {isFetching && <Spinner className="[&_svg]:size-4" />}
        </label>
      </div>
      {stores.length === 0 ? (
        <p className="px-5 py-8 text-[13px] text-muted">Không tìm thấy cửa hàng phù hợp. Hãy thử tên thành phố, ví dụ “Hà Nội”.</p>
      ) : (
        <fieldset className="divide-y divide-line px-5">
          <legend className="sr-only">Danh sách cửa hàng</legend>
          {stores.map((s) => {
            const stock = stockOf(s.id)
            return (
              <Radio
                key={s.id}
                name="pickup-store"
                className="py-4"
                checked={selected?.id === s.id}
                onChange={() => setSelected({ id: s.id, name: s.name, slug: s.slug })}
                label={<span className="font-medium">{s.name}</span>}
                description={`${s.address}, ${s.ward}, ${s.city}`}
                right={
                  stock != null ? (
                    <span className={stock > 0 ? 'text-xs whitespace-nowrap text-la' : 'text-xs whitespace-nowrap text-muted'}>{stock > 0 ? (stock <= 2 ? 'Sắp hết' : 'Còn hàng') : 'Hết hàng'}</span>
                  ) : (
                    <span className={s.openNow ? 'text-xs whitespace-nowrap text-la' : 'text-xs whitespace-nowrap text-muted'}>{s.openNow ? 'Đang mở' : 'Đã đóng'}</span>
                  )
                }
              />
            )
          })}
        </fieldset>
      )}
    </Drawer>
  )
}
