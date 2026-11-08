import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Store } from 'lucide-react'
import { StatusPill } from '@/components/account/orderUtils'
import { Button, EmptyState, Spinner, Tabs } from '@/components/ui'
import { useOrders } from '@/hooks/useOrders'
import { formatDate, formatPrice } from '@/utils/format'

function OrderCard({ order }) {
  const count = order.items.reduce((s, i) => s + i.quantity, 0)
  return (
    <li className="border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex flex-wrap items-center gap-3 text-[13px]">
          <span className="font-semibold">{order.number}</span>
          <StatusPill status={order.status} />
        </div>
        <span className="text-xs text-muted">{formatDate(order.placedAt)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-5 p-5">
        <ul className="flex gap-2">
          {order.items.slice(0, 4).map((it) => (
            <li key={it.id}>
              <img src={it.image.url} alt={it.image.alt} className="h-24 bg-paper-2 object-cover" style={{ width: 72 }} />
            </li>
          ))}
        </ul>
        <div className="min-w-0 flex-1 text-[13px]">
          <p>
            {count} sản phẩm · <span className="font-semibold">{formatPrice(order.totals.total)}</span>
          </p>
          <p className="mt-1 text-muted">{order.channel === 'store' ? order.storeName : order.delivery?.name}</p>
        </div>
        <Button variant="outline" size="sm" to={`/tai-khoan/don-hang/${order.number}`}>
          Xem chi tiết
        </Button>
      </div>
    </li>
  )
}

export default function OrdersPage() {
  const [tab, setTab] = useState('online')
  const { data: orders = [], isLoading } = useOrders()
  const online = orders.filter((o) => o.channel === 'online')
  const store = orders.filter((o) => o.channel === 'store')
  const list = tab === 'online' ? online : store
  return (
    <div>
      <h1 className="ds-h1 mb-8">Đơn hàng của tôi</h1>
      <Tabs
        tabs={[
          { value: 'online', label: 'Online', count: online.length },
          { value: 'store', label: 'Tại cửa hàng', count: store.length },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-6"
      />
      {isLoading ? (
        <Spinner />
      ) : list.length ? (
        <ul className="space-y-4">
          {list.map((o) => (
            <OrderCard key={o.number} order={o} />
          ))}
        </ul>
      ) : tab === 'online' ? (
        <EmptyState icon={Package} title="Chưa có đơn hàng online" action={<Button to="/c/moi-ve">Khám phá hàng mới về</Button>}>
          Các đơn đặt trên website và ứng dụng sẽ hiển thị ở đây.
        </EmptyState>
      ) : (
        <EmptyState icon={Store} title="Chưa có giao dịch tại cửa hàng" action={<Button variant="outline" to="/cua-hang">Tìm cửa hàng gần bạn</Button>}>
          Đưa mã thành viên cho thu ngân khi mua tại cửa hàng để lưu hoá đơn và tích điểm.
        </EmptyState>
      )}
    </div>
  )
}
