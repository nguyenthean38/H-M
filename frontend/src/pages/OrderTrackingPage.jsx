import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { DeliveryBlock, OrderItems, OrderTimeline, STATUS, StatusPill } from '@/components/account/orderUtils'
import { Breadcrumbs, Button, Input, Notice, PageLoader } from '@/components/ui'
import { useMe } from '@/hooks/useAuth'
import { useOrder } from '@/hooks/useOrders'
import { formatDateTime } from '@/utils/format'

function LookupForm({ loggedIn, initial, onSubmit, error }) {
  const [number, setNumber] = useState(initial.number ?? '')
  const [email, setEmail] = useState(initial.email ?? '')
  const needEmail = !loggedIn
  const valid = number.trim().length >= 6 && (!needEmail || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSubmit(number.trim().toUpperCase(), email.trim())
      }}
      className="max-w-md space-y-5"
    >
      <p className="text-[13px] text-ink-2">
        {loggedIn ? 'Nhập mã đơn hàng để xem trạng thái giao hàng.' : 'Nhập mã đơn hàng và email bạn dùng khi đặt hàng. Mã đơn có trong email xác nhận, dạng NP2611-0482.'}
      </p>
      <Input label="Mã đơn hàng" required placeholder="NP2611-0482" value={number} onChange={(e) => setNumber(e.target.value)} autoComplete="off" />
      {needEmail && <Input label="Email đặt hàng" required type="email" placeholder="ten@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />}
      {error && <Notice tone="error">{error}</Notice>}
      <Button type="submit" block disabled={!valid}>
        Theo dõi đơn hàng
      </Button>
      <p className="border border-dashed border-cham-300 bg-cham-50 px-4 py-3 text-xs text-cham-600">
        Bản demo: đăng nhập bằng tài khoản demo rồi tra mã <span className="font-mono font-semibold">NP2611-0482</span>, hoặc dùng mã đơn bạn vừa đặt.
      </p>
    </form>
  )
}

export default function OrderTrackingPage() {
  const [params, setParams] = useSearchParams()
  const { data: me } = useMe()
  const number = params.get('ma')
  const email = params.get('email') || undefined
  const { data: order, isLoading, error } = useOrder(number, email)

  const lookup = (n, e) => setParams(e ? { ma: n, email: e } : { ma: n })
  const s = order ? (STATUS[order.status] ?? STATUS.placed) : null

  return (
    <div className="ds-container py-10 lg:py-14">
      <Breadcrumbs className="mb-6" items={[{ label: 'Trang chủ', href: '/' }, { label: 'Theo dõi đơn hàng', href: null }]} />
      <h1 className="ds-h1 mb-8 flex items-center gap-4">
        Theo dõi đơn hàng <PackageSearch className="hidden size-9 text-cham sm:block" strokeWidth={1.25} />
      </h1>

      {!number || error ? (
        <LookupForm key={number ?? 'new'} loggedIn={Boolean(me)} initial={{ number, email }} onSubmit={lookup} error={error?.message} />
      ) : isLoading ? (
        <PageLoader />
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="ds-eyebrow mb-2">Tình trạng đơn hàng</p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">{s.headline}</h2>
            <p className="mt-3 max-w-lg text-[14px] text-ink-2">{s.note}</p>
            <div className="mt-8 border-t border-line pt-8">
              {order.status === 'cancelled' ? (
                <Notice tone="error">Đơn hàng đã huỷ{order.cancelledAt ? ` lúc ${formatDateTime(order.cancelledAt)}` : ''}.</Notice>
              ) : order.channel === 'store' ? (
                <p className="text-[13px] text-muted">Đơn mua tại cửa hàng, không có thông tin vận chuyển.</p>
              ) : (
                <OrderTimeline order={order} />
              )}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {me && order.userId === me.id && (
                <Button variant="outline" size="sm" to={`/tai-khoan/don-hang/${order.number}`}>
                  Xem chi tiết đơn
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setParams({})}>
                Tra đơn khác
              </Button>
            </div>
          </div>
          <aside className="space-y-6 border border-line bg-surface p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="ds-label">Đơn hàng</p>
                <p className="mt-1 text-[15px] font-semibold">{order.number}</p>
                <p className="text-xs text-muted">Đặt lúc {formatDateTime(order.placedAt)}</p>
              </div>
              <StatusPill status={order.status} />
            </div>
            <OrderItems items={order.items} />
            <div className="border-t border-line pt-5">
              <DeliveryBlock order={order} />
            </div>
            <p className="text-xs text-muted">
              Có thắc mắc?{' '}
              <Link to="/thong-tin/lien-he" className="underline">
                Liên hệ bộ phận chăm sóc khách hàng
              </Link>
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
