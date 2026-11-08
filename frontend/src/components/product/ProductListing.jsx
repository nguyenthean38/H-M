import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Store } from 'lucide-react'
import { Button, Checkbox, EmptyState, ProgressBar } from '@/components/ui'
import { useProducts } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { FILTER_KEYS, FilterDrawer, SORT_OPTIONS } from './FilterDrawer'
import { ProductGrid } from './ProductCard'
import { StorePickerDrawer } from './StorePickerDrawer'

const PAGE_SIZE = 24

/**
 * Lưới sản phẩm + thanh công cụ (nhận tại cửa hàng, bộ lọc, sắp xếp, xem thêm).
 * Mọi bộ lọc nằm trên URL (?color=den&size=M...) để chia sẻ link & quay lại không mất trạng thái.
 */
export function ProductListing({ baseFilters, emptyAction, className }) {
  const [params, setParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [storeOpen, setStoreOpen] = useState(false)
  const pickupStore = useUI((s) => s.pickupStore)
  const setPickupStore = useUI((s) => s.setPickupStore)
  const pickupOn = params.get('cua-hang') === '1' && pickupStore

  const applied = useMemo(() => {
    const o = {}
    for (const k of FILTER_KEYS) if (params.get(k)) o[k] = params.get(k)
    return o
  }, [params])
  const page = Number(params.get('trang')) || 1
  const query = { ...baseFilters, ...applied, storeId: pickupOn ? pickupStore.id : undefined, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isFetching, isPlaceholderData } = useProducts(query)

  const update = (patch) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === '') next.delete(k)
      else next.set(k, v)
    }
    if (!('trang' in patch)) next.delete('trang')
    setParams(next, { replace: false, preventScrollReset: true })
  }
  const applyFilters = (draft) => {
    const patch = Object.fromEntries(FILTER_KEYS.map((k) => [k, draft[k]]))
    update(patch)
  }
  const activeCount = FILTER_KEYS.filter((k) => k !== 'sort' && applied[k]).reduce((n, k) => n + (k.endsWith('Price') ? 0.5 : applied[k].split(',').length), 0)

  return (
    <div className={className}>
      <div className="ds-container">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-paper-2 px-4 py-3 text-[13px]">
          <Checkbox
            checked={Boolean(pickupOn)}
            onChange={(e) => {
              if (!pickupStore) return setStoreOpen(true)
              update({ 'cua-hang': e.target.checked ? '1' : null })
            }}
            label={
              <span className="flex items-center gap-1.5">
                <Store className="size-4" strokeWidth={1.5} /> Nhận hôm nay tại:
              </span>
            }
          />
          <button type="button" onClick={() => setStoreOpen(true)} className="font-semibold underline underline-offset-4 hover:text-cham">
            {pickupStore ? pickupStore.name : 'Chọn cửa hàng'}
          </button>
          {pickupStore && (
            <button
              type="button"
              className="ml-auto text-xs text-muted underline underline-offset-4 hover:text-ink"
              onClick={() => {
                setPickupStore(null)
                update({ 'cua-hang': null })
              }}
            >
              Bỏ chọn cửa hàng
            </button>
          )}
        </div>

        <div className="flex items-center justify-between py-4">
          <p className="text-xs text-muted" aria-live="polite">
            {data ? `${data.total} sản phẩm` : ' '}
          </p>
          <div className="flex items-center gap-5">
            <label className="hidden items-center gap-2 text-xs sm:flex">
              <span className="text-muted">Sắp xếp:</span>
              <select value={applied.sort ?? 'de-xuat'} onChange={(e) => update({ sort: e.target.value === 'de-xuat' ? null : e.target.value })} className="bg-transparent font-semibold outline-none">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={() => setFilterOpen(true)} className="flex items-center gap-2 ds-label hover:text-cham">
              {activeCount > 0 && <span className="text-cham">[{Math.ceil(activeCount)}]</span>}
              Bộ lọc <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {!isLoading && data?.total === 0 ? (
          <EmptyState title="Chưa có sản phẩm phù hợp" action={emptyAction ?? (activeCount || pickupOn ? <Button variant="outline" onClick={() => update({ ...Object.fromEntries(FILTER_KEYS.map((k) => [k, null])), 'cua-hang': null })}>Xoá bộ lọc</Button> : null)}>
            {pickupOn ? `Không có sản phẩm nào trong danh mục này đang có sẵn tại ${pickupStore.name}.` : 'Hãy thử bỏ bớt bộ lọc hoặc chọn danh mục khác.'}
          </EmptyState>
        ) : (
          <div className={cn('transition-opacity', isFetching && isPlaceholderData && 'opacity-60')}>
            <ProductGrid products={data?.items ?? []} loading={isLoading} />
          </div>
        )}

        {data?.total > 0 && (
          <div className="mx-auto mt-14 flex max-w-xs flex-col items-center gap-3 text-center">
            <p className="text-xs text-muted">
              Bạn đã xem {data.items.length} / {data.total} sản phẩm
            </p>
            <ProgressBar value={data.items.length / data.total} tone="ink" />
            {data.hasMore && (
              <Button variant="outline" block className="mt-3" loading={isFetching} onClick={() => update({ trang: String(page + 1) })}>
                Xem thêm sản phẩm
              </Button>
            )}
          </div>
        )}
      </div>

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} baseFilters={{ ...baseFilters, storeId: pickupOn ? pickupStore.id : undefined }} applied={applied} facets={data?.facets} onApply={applyFilters} />
      <StorePickerDrawer
        open={storeOpen}
        onClose={() => setStoreOpen(false)}
        value={pickupStore}
        onChange={(s) => {
          setPickupStore(s)
          update({ 'cua-hang': s ? '1' : null })
        }}
      />
    </div>
  )
}
