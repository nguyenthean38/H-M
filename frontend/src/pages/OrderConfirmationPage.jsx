import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CircleCheck, Copy, Sparkles } from 'lucide-react'
import { OrderTotals } from '@/components/cart/OrderTotals'
import { addressLine } from '@/components/checkout/DeliveryOptions'
import { formatEta, paymentSummary } from '@/components/checkout/helpers'
import { Button, Checkbox, DecorativeQr, EmptyState, PageLoader, Price } from '@/components/ui'
import { useMe } from '@/hooks/useAuth'
import { useOrder } from '@/hooks/useOrders'
import { useUI } from '@/store/ui'
import { formatDate, formatPhone, formatPrice } from '@/utils/format'

function InfoBlock({ label, children }) {
  return (
    <div>
      <p className="ds-label mb-1.5 text-muted">{label}</p>
      <div className="text-[14px] leading-relaxed">{children}</div>
    </div>
  )
}

function VietQrBox({ order }) {
  return (
    <section className="flex flex-col gap-6 border border-cham bg-surface p-6 sm:flex-row sm:items-center">
      <DecorativeQr value={order.number} size={150} className="shrink-0 self-center p-2" />
      <div className="flex-1 space-y-2 text-[13px]">
        <p className="ds-label text-cham">Chuyển khoản VietQR</p>
        <p className="text-ink-2">Mở ứng dụng ngân hàng, quét mã để chuyển khoản. Đơn hàng được xác nhận tự động và giữ trong 24 giờ.</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="text-muted">Ngân hàng</dt>
          <dd>Ngân hàng Demo</dd>
          <dt className="text-muted">Số tài khoản</dt>
          <dd className="font-mono">0000 1234 5678</dd>
          <dt className="text-muted">Chủ tài khoản</dt>
          <dd>CONG TY NEP DEMO</dd>
          <dt className="text-muted">Số tiền</dt>
          <dd className="font-semibold">{formatPrice(order.totals.total)}</dd>
          <dt className="text-muted">Nội dung</dt>
          <dd className="font-mono font-semibold">{order.number}</dd>
        </dl>
        <p className="text-xs text-son">Bản demo — không chuyển khoản thật.</p>
      </div>
    </section>
  )
}

export default function OrderConfirmationPage() {
  const { number } = useParams()
  const location = useLocation()
  const stateOrder = location.state?.order?.number === number ? location.state.order : null
  const { data: fetched, isLoading } = useOrder(stateOrder ? null : number)
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)
  const toast = useUI((s) => s.toast)
  const [newsletter, setNewsletter] = useState(false)
  const order = stateOrder ?? fetched

  if (!order && isLoading) return <PageLoader />
  if (!order) {
    return (
      <EmptyState
        icon={CircleCheck}
        title="Đơn hàng đã được ghi nhận"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button to={`/theo-doi-don-hang?ma=${encodeURIComponent(number)}`}>Theo dõi đơn hàng</Button>
            <Button to="/" variant="outline">
              Tiếp tục mua sắm
            </Button>
          </div>
        }
      >
        Để xem chi tiết đơn <strong className="text-ink">{number}</strong>, vui lòng mở trang theo dõi đơn hàng và nhập email bạn đã dùng khi đặt hàng.
      </EmptyState>
    )
  }

  const copy = () => {
    navigator.clipboard?.writeText(order.number).then(
      () => toast('Đã sao chép mã đơn hàng', 'success'),
      () => toast('Không sao chép được, vui lòng chép tay', 'error'),
    )
  }
  const trackHref = `/theo-doi-don-hang?ma=${encodeURIComponent(order.number)}&email=${encodeURIComponent(order.email)}`

  return (
    <div className="ds-container pt-10 pb-16 sm:pt-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <header>
            <p className="ds-eyebrow mb-3 flex items-center gap-2 text-la">
              <CircleCheck className="size-4" /> Đơn hàng đã được đặt thành công
            </p>
            <h1 className="ds-display">Cảm ơn bạn!</h1>
            <p className="mt-5 max-w-xl text-[15px] text-ink-2">
              Chúng tôi đã gửi xác nhận đến <strong className="text-ink">{order.email}</strong>. Bạn sẽ nhận thêm tin nhắn khi đơn hàng được giao cho đơn vị vận chuyển.
            </p>
          </header>

          {order.payment?.id === 'chuyen-khoan' && <VietQrBox order={order} />}

          <div className="grid gap-6 border-y border-line py-8 sm:grid-cols-3">
            <InfoBlock label="Mã đơn hàng">
              <button type="button" onClick={copy} className="flex items-center gap-2 font-mono font-semibold hover:text-cham" aria-label="Sao chép mã đơn hàng">
                {order.number} <Copy className="size-3.5" />
              </button>
            </InfoBlock>
            <InfoBlock label="Ngày đặt">{formatDate(order.placedAt)}</InfoBlock>
            <InfoBlock label="Người đặt">
              <p>{order.contact.fullName}</p>
              <p className="text-ink-2">{formatPhone(order.contact.phone)}</p>
            </InfoBlock>
          </div>

          <section>
            <h2 className="ds-label mb-1">Kiện hàng 1</h2>
            <p className="mb-5 text-xs text-muted">{order.items.reduce((s, it) => s + it.quantity, 0)} sản phẩm · Giao bởi Nếp</p>
            <ul className="divide-y divide-line border-y border-line">
              {order.items.map((it) => (
                <li key={it.id} className="flex gap-4 py-4">
                  <Link to={`/p/${it.slug}`} className="w-20 shrink-0">
                    <img src={it.image.url} alt={it.image.alt} className="aspect-[3/4] w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1 text-[13px]">
                    <p className="leading-snug">{it.name}</p>
                    <Price price={it.price} originalPrice={it.originalPrice} className="mt-1" />
                    <p className="mt-1 text-xs text-muted">
                      {it.colorName} · Size {it.size} · Số lượng {it.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <InfoBlock label={order.store ? 'Nhận tại cửa hàng' : 'Giao đến'}>
                {order.store ? (
                  <>
                    <p className="font-semibold">{order.store.name}</p>
                    <p className="text-ink-2">{order.store.address}</p>
                    <p className="text-ink-2">{order.store.phone}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                    <p className="text-ink-2">{formatPhone(order.shippingAddress?.phone)}</p>
                    <p className="text-ink-2">{addressLine(order.shippingAddress)}</p>
                  </>
                )}
              </InfoBlock>
              <InfoBlock label="Phương thức giao hàng">
                <p>{order.delivery.name}</p>
                {order.estimatedDelivery && <p className="text-ink-2">Dự kiến nhận: {formatEta(order.estimatedDelivery)}</p>}
                {order.note && <p className="mt-1 text-xs text-muted">Ghi chú: {order.note}</p>}
              </InfoBlock>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button to={trackHref}>Theo dõi đơn hàng</Button>
            <Button to="/" variant="outline">
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="space-y-5 bg-surface p-6">
            <InfoBlock label="Thanh toán">{paymentSummary(order.payment)}</InfoBlock>
            <OrderTotals totals={order.totals} shippingLabel="Phí giao hàng" promo={order.promo} />
          </div>

          <div className="bg-cham p-6 text-paper">
            <p className="flex items-center gap-2 ds-label">
              <Sparkles className="size-4" /> Nếp Club
            </p>
            {order.userId && me ? (
              <>
                <p className="mt-3 font-display text-3xl">+{order.pointsEarned.toLocaleString('vi-VN')} điểm</p>
                <p className="mt-2 text-[13px] text-paper/80">Đã được cộng vào tài khoản của bạn. Tổng điểm hiện tại: {me.points.toLocaleString('vi-VN')}.</p>
                <Link to="/tai-khoan" className="mt-4 inline-block text-xs font-semibold tracking-[0.12em] uppercase underline underline-offset-4">
                  Xem tài khoản
                </Link>
              </>
            ) : (
              <>
                <p className="mt-3 font-display text-2xl leading-snug">Tạo tài khoản để nhận {order.pointsEarned.toLocaleString('vi-VN')} điểm cho đơn này</p>
                <p className="mt-2 text-[13px] text-paper/80">Tích điểm đổi ưu đãi, nhận quà sinh nhật và miễn phí giao hàng khi lên hạng Vải.</p>
                <Button variant="light" size="sm" className="mt-4" onClick={() => openAuth({ email: order.email })}>
                  Trở thành thành viên
                </Button>
              </>
            )}
          </div>

          <div className="space-y-3 border border-line p-6">
            <p className="ds-label">Bản tin Nếp</p>
            <p className="text-[13px] text-ink-2">Nhận tin hàng mới, ưu đãi riêng và lời mời sự kiện tại cửa hàng.</p>
            <Checkbox
              label="Đồng ý nhận bản tin qua email. Tôi có thể huỷ bất cứ lúc nào."
              checked={newsletter}
              onChange={(e) => {
                setNewsletter(e.target.checked)
                if (e.target.checked) toast('Cảm ơn bạn đã đăng ký nhận bản tin!', 'success')
              }}
            />
            <p className="pt-2 text-xs text-muted">Theo dõi Nếp: Instagram · TikTok · Facebook · Zalo</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
