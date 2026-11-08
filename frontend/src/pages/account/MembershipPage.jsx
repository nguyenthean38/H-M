import { Check, Gift, Recycle, ShoppingBag, Star, Store } from 'lucide-react'
import { TierProgress } from '@/components/account/TierProgress'
import { Spinner } from '@/components/ui'
import { useRewards } from '@/hooks/useAccount'
import { useMe } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { formatDate, formatNumber } from '@/utils/format'

const EARN = [
  { icon: ShoppingBag, title: 'Mua sắm online', text: '1.000₫ = 1 điểm, cộng ngay khi đơn được giao.' },
  { icon: Store, title: 'Mua tại cửa hàng', text: 'Đưa mã thành viên cho thu ngân để tích điểm như online.' },
  { icon: Recycle, title: 'Đổi cũ lấy mới', text: '+200 điểm cho mỗi lần mang quần áo cũ đến cửa hàng.' },
  { icon: Gift, title: 'Tháng sinh nhật', text: 'Nhân đôi điểm cho mọi đơn hàng trong tháng sinh nhật.' },
  { icon: Star, title: 'Viết đánh giá', text: '+20 điểm cho mỗi đánh giá có ảnh thật.' },
]

export default function MembershipPage() {
  const { data: me } = useMe()
  const { data: rewards, isLoading } = useRewards()
  return (
    <div className="space-y-12">
      <div>
        <h1 className="ds-h1">Nếp Club</h1>
        <p className="mt-3 max-w-xl text-[14px] text-ink-2">Ba hạng thành viên đặt theo chất liệu — càng gắn bó, càng nhiều đặc quyền. Điểm được tính trong 12 tháng gần nhất.</p>
        <TierProgress me={me} className="mt-6 max-w-md" />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <section>
            <h2 className="ds-h2 mb-5">Các hạng thành viên</h2>
            <ol className="grid gap-4 md:grid-cols-3">
              {rewards.tiers.map((t) => {
                const current = t.id === me.tier.id
                const reached = me.points >= t.min
                return (
                  <li key={t.id} className={cn('relative flex flex-col border p-6', current ? 'border-cham bg-cham text-paper' : 'border-line bg-surface')}>
                    {current && <span className="ds-fold absolute top-4 right-4 bg-paper px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-cham uppercase">Hạng của bạn</span>}
                    <p className={cn('ds-label', current ? 'opacity-80' : 'text-muted')}>{t.min === 0 ? 'Khi đăng ký' : `Từ ${formatNumber(t.min)} điểm`}</p>
                    <p className="mt-3 font-display text-4xl italic">{t.name}</p>
                    <ul className="mt-5 space-y-2 text-[13px]">
                      {t.perks.map((p) => (
                        <li key={p} className="flex gap-2">
                          <Check className={cn('mt-0.5 size-3.5 shrink-0', current ? 'text-paper' : reached ? 'text-la' : 'text-subtle')} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </section>

          <section>
            <h2 className="ds-h2 mb-5">Lịch sử điểm</h2>
            <div className="overflow-x-auto border border-line bg-surface">
              <table className="w-full min-w-[480px] text-left text-[13px]">
                <thead className="border-b border-line">
                  <tr className="ds-label text-muted">
                    <th className="px-5 py-3 font-semibold">Ngày</th>
                    <th className="px-5 py-3 font-semibold">Hoạt động</th>
                    <th className="px-5 py-3 text-right font-semibold">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rewards.history.map((h) => (
                    <tr key={h.id}>
                      <td className="px-5 py-3 whitespace-nowrap text-muted">{formatDate(h.at)}</td>
                      <td className="px-5 py-3">{h.label}</td>
                      <td className="px-5 py-3 text-right font-semibold text-la tabular-nums">+{formatNumber(h.points)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <section>
        <h2 className="ds-h2 mb-5">Cách tích điểm</h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {EARN.map((e) => (
            <li key={e.title} className="flex gap-4 border-t border-ink pt-4">
              <e.icon className="size-6 shrink-0 text-cham" strokeWidth={1.5} />
              <div>
                <p className="text-[14px] font-semibold">{e.title}</p>
                <p className="mt-1 text-[13px] text-ink-2">{e.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
