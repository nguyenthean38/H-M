import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Clock, Leaf, MapPin, Recycle, Ruler, Truck } from 'lucide-react'
import { NotifyMeDrawer } from '@/components/product/NotifyMeDrawer'
import { WishlistButton } from '@/components/product/ProductCard'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductRail } from '@/components/product/ProductRail'
import { rememberProduct, useRecentlyViewed } from '@/components/product/recentlyViewed'
import { ReviewsDrawer } from '@/components/product/ReviewsDrawer'
import { SizeGuideDrawer } from '@/components/product/SizeGuideDrawer'
import { StorePickerDrawer } from '@/components/product/StorePickerDrawer'
import { Accordion, Badge, BADGE_LABELS, Breadcrumbs, Button, EmptyState, PageLoader, Price, Stars } from '@/components/ui'
import { brand } from '@/config/brand'
import { findProvince } from '@/config/locations'
import { useAddToCart } from '@/hooks/useCart'
import { useAvailability, useProduct, useRecommendations } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { formatDay, formatNumber, formatPrice } from '@/utils/format'

const addDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export default function ProductPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const { data: p, isLoading, error } = useProduct(slug)
  const similar = useRecommendations(p?.id, 'similar')
  const others = useRecommendations(p?.id, 'others')
  const recent = useRecentlyViewed(p?.id)

  const colorCode = params.get('mau') ?? p?.colors[0]?.code
  const color = p?.colors.find((c) => c.code === colorCode) ?? p?.colors[0]
  const oneSize = p?.sizes.length === 1
  const [size, setSize] = useState(null)
  const [sizeError, setSizeError] = useState(false)
  const [delivery, setDelivery] = useState('ship')
  const [panel, setPanel] = useState(null) // 'size' | 'reviews' | 'notify' | 'store'

  const province = useUI((s) => s.province)
  const openLocation = useUI((s) => s.openLocation)
  const pickupStore = useUI((s) => s.pickupStore)
  const setPickupStore = useUI((s) => s.setPickupStore)
  const showAddedToBag = useUI((s) => s.showAddedToBag)
  const toast = useUI((s) => s.toast)
  const add = useAddToCart()

  const effectiveSize = oneSize ? p?.sizes[0] : size
  const sizeInfo = color?.sizes.find((s) => s.label === effectiveSize)
  const availability = useAvailability(p?.id, color?.code, effectiveSize, { enabled: Boolean(p) && (delivery === 'pickup' || panel === 'store') })
  const pickupStock = pickupStore ? availability.data?.find((a) => a.storeId === pickupStore.id)?.stock : null

  useEffect(() => {
    setSize(null)
    setSizeError(false)
  }, [slug, colorCode])
  useEffect(() => {
    if (!p) return
    document.title = `${p.name} — Nếp`
    rememberProduct(p)
  }, [p])

  const eta = useMemo(() => {
    const prov = findProvince(province)
    const [a, b] = prov?.days ?? [2, 4]
    return { name: prov?.name ?? '', from: formatDay(addDays(a)), to: formatDay(addDays(b)), express: prov?.express }
  }, [province])

  if (isLoading) return <PageLoader />
  if (error || !p) {
    return (
      <EmptyState title="Sản phẩm không còn" action={<Button to="/c/moi-ve">Xem hàng mới về</Button>}>
        Sản phẩm này đã ngừng kinh doanh hoặc đường dẫn không đúng.
      </EmptyState>
    )
  }

  const outOfStock = sizeInfo && !sizeInfo.inStock
  const selectColor = (code) => {
    const next = new URLSearchParams(params)
    next.set('mau', code)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const addToBag = () => {
    if (!effectiveSize) {
      setSizeError(true)
      return
    }
    if (outOfStock) return setPanel('notify')
    add.mutate(
      { productId: p.id, colorCode: color.code, size: effectiveSize, quantity: 1 },
      {
        onSuccess: (cart) => {
          const item = cart.items.find((it) => it.id === cart.addedItemId) ?? cart.items[0]
          showAddedToBag({ item, cart })
        },
        onError: (e) => toast(e.message, 'error'),
      },
    )
  }

  const tag = p.badges.find((b) => b === 'moi' || b === 'ban-chay')

  return (
    <div className="pb-10">
      <div className="ds-container py-4">
        <Breadcrumbs items={p.breadcrumbs} />
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lg:col-span-7 xl:col-span-8">
          <ProductGallery images={color.images} />
        </div>

        <div className="px-4 sm:px-6 lg:col-span-5 lg:px-0 xl:col-span-4">
          <div className="lg:sticky lg:top-[120px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {p.discountPercent ? <Badge tone="sale">-{p.discountPercent}%</Badge> : null}
                  {tag && <Badge tone={tag === 'moi' ? 'neutral' : 'ban-chay'}>{BADGE_LABELS[tag]}</Badge>}
                  {p.sustainable && <Badge tone="ben-vung">Bền vững hơn</Badge>}
                </div>
                <h1 className="font-display text-[28px] leading-tight font-medium tracking-[-0.01em]">{p.name}</h1>
                <Price price={p.price} originalPrice={p.originalPrice} size="lg" className="mt-2" />
                <p className="mt-1 text-xs text-muted">Đã bao gồm VAT · Tích {formatNumber(Math.floor(p.price / 1000))} điểm Nếp Club</p>
              </div>
              <WishlistButton product={p} size="lg" className="-mr-2 border border-line-strong hover:border-ink" />
            </div>

            <button type="button" onClick={() => setPanel('reviews')} className="mt-4 flex items-center gap-2 text-xs hover:underline hover:underline-offset-4">
              <Stars value={p.rating.average} size={13} /> {p.rating.average.toFixed(1).replace('.', ',')} · {formatNumber(p.rating.count)} đánh giá
            </button>

            {/* Màu */}
            <div className="mt-6">
              <p className="mb-2 text-[13px]">
                <span className="ds-label">Màu:</span> {color.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {p.colors.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => selectColor(c.code)}
                    aria-label={`Màu ${c.name}${c.available ? '' : ' (hết hàng)'}`}
                    aria-pressed={c.code === color.code}
                    className={cn('relative h-[76px] w-[57px] border bg-paper-2 p-0.5 transition-colors', c.code === color.code ? 'border-ink' : 'border-transparent hover:border-line-strong')}
                  >
                    <img src={c.images[0].url} alt="" className={cn('size-full object-cover', !c.available && 'opacity-40')} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            {!oneSize && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className={cn('ds-label', sizeError && 'text-son')}>{sizeError ? 'Vui lòng chọn size' : `Size${size ? `: ${size}` : ''}`}</p>
                  {p.sizeGuide && (
                    <button type="button" onClick={() => setPanel('size')} className="flex items-center gap-1.5 text-xs underline underline-offset-4 hover:text-cham">
                      <Ruler className="size-3.5" /> Bảng size & gợi ý size
                    </button>
                  )}
                </div>
                <div className={cn('grid grid-cols-5 gap-1.5', sizeError && 'animate-[slide-up_.3s]')} role="radiogroup" aria-label="Chọn size">
                  {color.sizes.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      role="radio"
                      aria-checked={size === s.label}
                      onClick={() => {
                        setSize(s.label)
                        setSizeError(false)
                      }}
                      className={cn(
                        'relative h-11 border text-[13px] transition-colors',
                        size === s.label ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink',
                        !s.inStock && 'text-subtle line-through',
                        !s.inStock && size === s.label && 'text-paper/70',
                      )}
                    >
                      {s.label}
                      {s.lowStock && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-nghe" aria-label="sắp hết" />}
                    </button>
                  ))}
                </div>
                {sizeInfo?.lowStock && <p className="mt-2 text-xs text-[#9a6b00]">Chỉ còn {sizeInfo.stock} sản phẩm size {sizeInfo.label}</p>}
              </div>
            )}

            {/* Hình thức nhận hàng */}
            <fieldset className="mt-6 space-y-3 border-t border-line pt-5 text-[13px]">
              <legend className="sr-only">Hình thức nhận hàng</legend>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="radio" name="delivery" checked={delivery === 'ship'} onChange={() => setDelivery('ship')} className="mt-1 accent-ink" />
                <span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="size-4" strokeWidth={1.5} /> Giao đến{' '}
                    <button type="button" onClick={openLocation} className="underline underline-offset-4 hover:text-cham">
                      {eta.name}
                    </button>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {effectiveSize ? (outOfStock ? <span className="text-son">Size {effectiveSize} tạm hết hàng online</span> : <>Size {effectiveSize} còn hàng · </>) : 'Chọn size để xem tình trạng · '}
                    {!outOfStock && (
                      <>
                        Dự kiến {eta.from} – {eta.to}
                      </>
                    )}
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="radio" name="delivery" checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} className="mt-1 accent-ink" />
                <span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="size-4" strokeWidth={1.5} /> Nhận miễn phí tại{' '}
                    <button type="button" onClick={() => setPanel('store')} className="underline underline-offset-4 hover:text-cham">
                      {pickupStore?.name ?? 'chọn cửa hàng'}
                    </button>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {!pickupStore
                      ? 'Chọn cửa hàng để xem còn hàng không'
                      : !effectiveSize
                        ? 'Chọn size để kiểm tra tại cửa hàng'
                        : pickupStock == null
                          ? 'Đang kiểm tra…'
                          : pickupStock > 0
                            ? <span className="text-la">Có sẵn tại cửa hàng · nhận trong 2 giờ</span>
                            : 'Hết tại cửa hàng này · chuyển về sau 1–3 ngày'}
                  </span>
                </span>
              </label>
            </fieldset>

            <Button block size="lg" className="mt-6" loading={add.isPending} onClick={addToBag} variant={outOfStock ? 'outline' : 'primary'}>
              {outOfStock ? 'Báo khi có hàng' : 'Thêm vào giỏ hàng'}
            </Button>

            {eta.express && (
              <p className="mt-3 flex items-start gap-2 border border-line-strong px-3 py-2.5 text-xs">
                <Clock className="mt-px size-3.5 shrink-0" /> Cần gấp? Đặt trước 14:00 để nhận trong ngày tại {eta.name} — hoặc hoả tốc 2 giờ.
              </p>
            )}

            <div className="mt-6">
              <Accordion title="Mô tả & độ vừa" defaultOpen>
                <p className="text-[13px] leading-relaxed text-ink-2">{p.description}</p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[13px]">
                  {p.fitLabel && (
                    <>
                      <dt className="text-muted">Dáng</dt>
                      <dd>{p.fitLabel}</dd>
                    </>
                  )}
                  {Object.entries(p.details).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                  <dt className="text-muted">Loại</dt>
                  <dd>{p.typeLabel}</dd>
                  <dt className="text-muted">Mã hàng</dt>
                  <dd className="tabular-nums">{p.articleNo}</dd>
                </dl>
              </Accordion>
              <Accordion title="Chất liệu & bảo quản">
                <p className="text-[13px]">
                  <strong className="font-semibold">Thành phần:</strong> {p.composition}
                </p>
                {p.sustainable && (
                  <p className="mt-3 flex items-start gap-2 bg-la-50 px-3 py-2 text-xs text-la">
                    <Leaf className="mt-px size-3.5 shrink-0" /> Sản phẩm dùng chất liệu bền vững hơn (hữu cơ, tái chế hoặc sợi có nguồn gốc kiểm chứng).
                  </p>
                )}
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] text-ink-2">
                  {p.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Giao hàng & thanh toán">
                <ul className="space-y-2 text-[13px] text-ink-2">
                  <li>Giao tiêu chuẩn 30.000₫ — miễn phí cho đơn từ {formatPrice(brand.freeShippingThreshold)}.</li>
                  <li>Giao trong ngày & hoả tốc 2 giờ tại Hà Nội, TP.HCM, Đà Nẵng.</li>
                  <li>Thanh toán khi nhận hàng, thẻ, ví điện tử, VietQR hoặc trả góp 0%.</li>
                </ul>
                <Link to="/thong-tin/giao-hang" className="mt-3 inline-block text-xs underline underline-offset-4">
                  Chi tiết giao hàng
                </Link>
              </Accordion>
              <Accordion title="Đổi trả 30 ngày">
                <p className="text-[13px] text-ink-2">Đổi size, đổi màu hoặc trả hàng miễn phí trong {brand.returnDays} ngày tại mọi cửa hàng Nếp hoặc gửi qua bưu điện. Sản phẩm cần còn tem mác.</p>
                <p className="mt-3 flex items-start gap-2 text-xs text-cham">
                  <Recycle className="mt-px size-3.5 shrink-0" /> Không mặc nữa? Mang đến quầy “Đổi cũ lấy mới” để nhận 50.000₫.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 space-y-16">
        <ProductRail title="Sản phẩm tương tự" products={similar.data} loading={similar.isLoading} />
        <ProductRail title="Khách hàng cũng mua" products={others.data} loading={others.isLoading} />
        {recent.length > 0 && <ProductRail title="Bạn đã xem gần đây" products={recent} />}
      </div>

      <SizeGuideDrawer
        open={panel === 'size'}
        onClose={() => setPanel(null)}
        guideKey={p.sizeGuide}
        onPick={(s) => {
          if (p.sizes.includes(s)) {
            setSize(s)
            setSizeError(false)
            setPanel(null)
            toast(`Đã chọn size ${s}`, 'success')
          }
        }}
      />
      <ReviewsDrawer open={panel === 'reviews'} onClose={() => setPanel(null)} productId={p.id} />
      <NotifyMeDrawer open={panel === 'notify'} onClose={() => setPanel(null)} product={p} color={color} initialSize={effectiveSize} />
      <StorePickerDrawer
        open={panel === 'store'}
        onClose={() => setPanel(null)}
        value={pickupStore}
        availability={effectiveSize ? availability.data : null}
        title={effectiveSize ? `Còn hàng tại cửa hàng — size ${effectiveSize}` : 'Chọn cửa hàng'}
        onChange={(s) => {
          setPickupStore(s)
          if (s) setDelivery('pickup')
        }}
      />
    </div>
  )
}
