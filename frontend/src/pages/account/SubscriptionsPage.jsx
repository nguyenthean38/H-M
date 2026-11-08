import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumbs, Button, Checkbox, Notice, Radio } from '@/components/ui'
import { useUpdateSubscriptions } from '@/hooks/useAccount'
import { useMe } from '@/hooks/useAuth'

const GROUPS = [
  { key: 'newsletter', title: 'Bản tin email', desc: 'Hàng mới về, lookbook và ưu đãi dành riêng thành viên — tối đa 2 email mỗi tuần.' },
  { key: 'sms', title: 'Tin nhắn SMS', desc: 'Mã giảm giá ngắn hạn và nhắc nhở sự kiện tại cửa hàng gần bạn.' },
  { key: 'zalo', title: 'Zalo OA', desc: 'Cập nhật đơn hàng và ưu đãi qua tài khoản Zalo chính thức của Nếp.' },
]

export default function SubscriptionsPage() {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const update = useUpdateSubscriptions()
  const initial = { newsletter: Boolean(me.subscriptions?.newsletter), sms: Boolean(me.subscriptions?.sms), zalo: Boolean(me.subscriptions?.zalo) }
  const [subs, setSubs] = useState(initial)
  const [consent, setConsent] = useState(false)
  const changed = GROUPS.some((g) => subs[g.key] !== initial[g.key])
  const turningOn = GROUPS.some((g) => subs[g.key] && !initial[g.key])
  const canSave = changed && (!turningOn || consent)

  return (
    <div>
      <Breadcrumbs
        className="mb-5"
        items={[
          { label: 'Cài đặt', href: '/tai-khoan/cai-dat' },
          { label: 'Đăng ký nhận tin', href: null },
        ]}
      />
      <h1 className="ds-h1 mb-8">Đăng ký nhận tin</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canSave) update.mutate(subs, { onSuccess: () => navigate('/tai-khoan/cai-dat', { state: { saved: true } }) })
        }}
        className="max-w-md space-y-8"
      >
        {GROUPS.map((g) => (
          <fieldset key={g.key}>
            <legend className="text-[14px] font-semibold">{g.title}</legend>
            <p className="mt-1 mb-3 text-[13px] text-muted">{g.desc}</p>
            <div className="space-y-2.5">
              <Radio name={g.key} label="Tiếp tục nhận" checked={subs[g.key]} onChange={() => setSubs((s) => ({ ...s, [g.key]: true }))} />
              <Radio name={g.key} label="Huỷ đăng ký" checked={!subs[g.key]} onChange={() => setSubs((s) => ({ ...s, [g.key]: false }))} />
            </div>
          </fieldset>
        ))}

        {turningOn && (
          <Checkbox
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            label={
              <>
                Tôi đồng ý để Nếp xử lý dữ liệu cá nhân nhằm gửi thông tin tiếp thị phù hợp với tôi, và xác nhận tôi đủ 16 tuổi. Xem{' '}
                <Link to="/thong-tin/bao-mat" className="underline">
                  Chính sách bảo mật
                </Link>
                .
              </>
            }
          />
        )}
        <p className="text-xs text-muted">Bạn có thể huỷ bất cứ lúc nào bằng đường dẫn ở cuối mỗi email hoặc nhắn "TU CHOI" tới SMS của Nếp.</p>
        {update.error && <Notice tone="error">{update.error.message}</Notice>}
        <div className="space-y-2">
          <Button type="submit" block disabled={!canSave} loading={update.isPending}>
            Lưu
          </Button>
          <Button variant="outline" block to="/tai-khoan/cai-dat">
            Huỷ
          </Button>
        </div>
      </form>
    </div>
  )
}
