import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CancelOrderFlow } from '@/components/account/CancelOrderFlow'
import { CopyButton, DeliveryBlock, OrderItems, OrderTimeline, STATUS, StatusPill, TotalsTable, paymentLabel } from '@/components/account/orderUtils'
import { Breadcrumbs, Button, DecorativeQr, EmptyState, Notice, PageLoader } from '@/components/ui'
import { useOrder } from '@/hooks/useOrders'
import { formatDate, formatDateTime, formatNumber, formatPhone } from '@/utils/format'

export default function OrderDetailPage() {
  const { number } = useParams()
  const { data: order, isLoading, error } = useOrder(number)
  const [step, setStep] = useState(null)
  const [justCancelled, setJustCancelled] = useState(false)

  if (isLoading) return <PageLoader />
  if (error || !order)
    return (
      <EmptyState title="Không tìm thấy đơn hàng" action={<Button to="/tai-khoan/don-hang">Về danh sách đơn hàng</Button>}>
        {error?.message ?? 'Đơn hàng không tồn tại.'}
      </EmptyState>
    )

  const cancelled = order.status === 'cancelled'
  const returnable = ['delivered', 'completed'].includes(order.status)
  const count = order.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div>
      <Breadcrumbs
        className="mb-5"
        items={[
          { label: 'Tài khoản', href: '/tai-khoan' },
          { label: 'Đơn hàng', href: '/tai-khoan/don-hang' },
          { label: order.number, href: null },
        ]}
      />
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="ds-h1">Chi tiết đơn hàng</h1>
        <StatusPill status={order.status} />
      </div>

      {cancelled && (
        <Notice tone="error" className="mb-6" onClose={justCancelled ? () => setJustCancelled(false) : undefined}>
          Đơn hàng đã được huỷ{order.cancelledAt ? ` lúc ${formatDateTime(order.cancelledAt)}` : ''}. {STATUS.cancelled.note}
        </Notice>
      )}

      <div className="grid gap-10 xl:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="grid gap-6 border-b border-line pb-8 sm:grid-cols-3">
            <div>
              <p className="ds-label mb-1">Mã đơn hàng</p>
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                {order.number} <CopyButton value={order.number} label="Sao chép mã đơn" />
              </p>
            </div>
            <div>
              <p className="ds-label mb-1">Ngày đặt</p>
              <p className="text-[13px]">{formatDateTime(order.placedAt)}</p>
            </div>
            <div>
              <p className="ds-label mb-1">Người nhận</p>
              <p className="text-[13px]">{order.contact?.fullName}</p>
              <p className="text-[13px] text-muted">{order.contact?.email}</p>
              {order.contact?.phone && <p className="text-[13px] text-muted">{formatPhone(order.contact.phone)}</p>}
            </div>
          </section>

          <section className="border-b border-line pb-8">
            <h2 className="ds-h3 mb-1">Kiện hàng 1</h2>
            <p className="mb-5 text-xs text-muted">{count} sản phẩm từ Nếp</p>
            <div className="grid gap-8 md:grid-cols-[1fr_260px]">
              <OrderItems items={order.items} />
              <DeliveryBlock order={order} />
            </div>
          </section>

          {order.channel === 'online' && (
            <section className="border-b border-line pb-8">
              <h2 className="ds-h3 mb-5">Trạng thái đơn hàng</h2>
              {cancelled ? (
                <p className="text-[13px] text-muted">Đơn hàng đã huỷ nên không còn được xử lý.</p>
              ) : (
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <OrderTimeline order={order} />
                  <Button variant="outline" size="sm" to={`/theo-doi-don-hang?ma=${order.number}`}>
                    Theo dõi đơn hàng
                  </Button>
                </div>
              )}
            </section>
          )}

          {returnable && (
            <section className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-center">
              <div className="border border-line bg-white p-2">
                <DecorativeQr value={`return-${order.number}`} size={120} />
              </div>
              <div className="text-[13px]">
                <h2 className="ds-h3 mb-2">Mã đổi trả tại cửa hàng</h2>
                <p className="text-ink-2">Đưa mã này cho nhân viên tại bất kỳ cửa hàng Nếp nào để đổi size, đổi màu hoặc trả hàng trong 30 ngày kể từ ngày nhận.</p>
                <p className="mt-2 text-muted">Không áp dụng cho đồ lót, khuyên tai và mỹ phẩm đã mở nắp.</p>
                <Link to="/thong-tin/doi-tra" className="ds-link mt-2 inline-block">
                  Chính sách đổi trả
                </Link>
              </div>
            </section>
          )}

          <p className="text-[13px]">
            Cần hỗ trợ?{' '}
            <Link to="/thong-tin/lien-he" className="ds-link">
              Liên hệ chúng tôi
            </Link>
          </p>
        </div>

        <aside className="space-y-6">
          <div className="border border-line bg-surface p-5">
            <h2 className="ds-label mb-4">Thanh toán</h2>
            <p className="mb-4 text-[13px]">{paymentLabel(order.payment)}</p>
            <TotalsTable order={order} />
            {order.pointsEarned > 0 && !cancelled && (
              <p className="mt-4 bg-cham-50 px-3 py-2 text-xs text-cham">Bạn nhận được +{formatNumber(order.pointsEarned)} điểm Nếp Club cho đơn này.</p>
            )}
          </div>
          {order.cancellable && !cancelled && (
            <div className="space-y-2">
              <Button variant="outline" block onClick={() => setStep('confirm')} className="border-son text-son hover:bg-son hover:text-paper">
                Huỷ đơn hàng
              </Button>
              <p className="text-xs text-muted">Bạn có thể huỷ trước khi đơn được giao cho đơn vị vận chuyển. Đặt ngày {formatDate(order.placedAt)}.</p>
            </div>
          )}
        </aside>
      </div>

      <CancelOrderFlow order={order} step={step} setStep={setStep} onCancelled={() => setJustCancelled(true)} />
    </div>
  )
}
