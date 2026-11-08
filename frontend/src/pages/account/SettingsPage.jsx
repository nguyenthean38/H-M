import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { AddressFormDrawer, AddressListDrawer, formatAddress } from '@/components/account/AddressDrawers'
import { ChangePasswordDrawer, DeleteAccountModal } from '@/components/account/SecurityDialogs'
import { Button, Modal, Notice } from '@/components/ui'
import { useAddresses, useCards, useDeleteCard } from '@/hooks/useAccount'
import { useLogout, useMe } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'
import { formatDate, formatPhone } from '@/utils/format'

const GENDER = { nu: 'Nữ', nam: 'Nam', khac: 'Khác' }

function Section({ title, children }) {
  return (
    <section className="border-b border-line py-7 first:pt-0">
      <h2 className="ds-label mb-3">{title}</h2>
      {children}
    </section>
  )
}

const actionCls = 'mt-3 inline-block text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4 hover:text-cham'

export default function SettingsPage() {
  const { data: me } = useMe()
  const { data: addresses = [] } = useAddresses()
  const { data: cards = [] } = useCards()
  const deleteCard = useDeleteCard()
  const logout = useLogout()
  const toast = useUI((s) => s.toast)
  const location = useLocation()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(Boolean(location.state?.saved))
  const [drawer, setDrawer] = useState(null) // 'add' | 'list' | 'password'
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)

  useEffect(() => {
    if (location.state?.saved) {
      setSaved(true)
      window.scrollTo({ top: 0 })
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.state, location.pathname, navigate])

  const def = addresses.find((a) => a.isDefault) ?? addresses[0]
  const subs = me.subscriptions ?? {}
  const yesNo = (v) => (v ? 'Đang nhận' : 'Đã huỷ')

  return (
    <div>
      {saved && (
        <Notice tone="success" className="mb-6" onClose={() => setSaved(false)}>
          Thay đổi của bạn đã được lưu.
        </Notice>
      )}
      <h1 className="ds-h1 mb-8">Cài đặt</h1>
      <div className="max-w-xl">
        <Section title="Thông tin của tôi">
          <dl className="space-y-0.5 text-[13px] text-ink-2">
            <dd>{me.email}</dd>
            {(me.lastName || me.firstName) && <dd>{[me.lastName, me.firstName].filter(Boolean).join(' ')}</dd>}
            {me.phone && <dd>{formatPhone(me.phone)}</dd>}
            {me.dateOfBirth && <dd>Sinh ngày {formatDate(me.dateOfBirth)}</dd>}
            {me.gender && <dd>{GENDER[me.gender]}</dd>}
          </dl>
          <Link to="/tai-khoan/cai-dat/thong-tin" className={actionCls}>
            Sửa thông tin
          </Link>
        </Section>

        <Section title="Địa chỉ giao hàng">
          {def ? (
            <div className="text-[13px] text-ink-2">
              <p className="font-medium text-ink">
                {def.fullName} <span className="font-normal text-muted">· Mặc định</span>
              </p>
              <p>{formatPhone(def.phone)}</p>
              <p>{formatAddress(def)}</p>
              {addresses.length > 1 && <p className="mt-1 text-xs text-muted">và {addresses.length - 1} địa chỉ khác</p>}
            </div>
          ) : (
            <p className="text-[13px] text-muted">Chưa có địa chỉ. Thêm địa chỉ để thanh toán nhanh hơn.</p>
          )}
          <div className="flex flex-wrap gap-x-6">
            <button type="button" className={actionCls} onClick={() => setDrawer('add')}>
              Thêm địa chỉ mới
            </button>
            {addresses.length > 0 && (
              <button type="button" className={actionCls} onClick={() => setDrawer('list')}>
                Quản lý địa chỉ
              </button>
            )}
          </div>
        </Section>

        <Section title="Thẻ đã lưu">
          {cards.length ? (
            <ul className="space-y-3">
              {cards.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 border border-line bg-surface px-4 py-3 text-[13px]">
                  <span className="flex items-center gap-3">
                    <CreditCard className="size-5 text-cham" strokeWidth={1.5} />
                    <span>
                      <span className="font-medium uppercase">{c.brand}</span> •••• {c.last4}
                      <span className="block text-xs text-muted">
                        {c.holder} · Hết hạn {c.exp}
                      </span>
                    </span>
                  </span>
                  <button type="button" onClick={() => setCardToDelete(c)} className="text-xs underline underline-offset-4 hover:text-son">
                    Xoá
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-muted">Chưa có thẻ nào. Bạn có thể lưu thẻ ở bước thanh toán.</p>
          )}
          <p className="mt-3 text-xs text-muted">Nếp chỉ lưu 4 số cuối; thông tin thẻ đầy đủ được mã hoá bởi cổng thanh toán.</p>
        </Section>

        <Section title="Đăng ký nhận tin">
          <dl className="grid grid-cols-[120px_1fr] gap-y-1 text-[13px]">
            <dt className="text-muted">Bản tin email</dt>
            <dd>{yesNo(subs.newsletter)}</dd>
            <dt className="text-muted">Tin nhắn SMS</dt>
            <dd>{yesNo(subs.sms)}</dd>
            <dt className="text-muted">Zalo OA</dt>
            <dd>{yesNo(subs.zalo)}</dd>
          </dl>
          <Link to="/tai-khoan/cai-dat/nhan-tin" className={actionCls}>
            Chỉnh sửa
          </Link>
        </Section>

        <Section title="Mật khẩu">
          <p className="text-[13px] text-muted">Nên đổi mật khẩu định kỳ và không dùng lại mật khẩu của trang khác.</p>
          <button type="button" className={actionCls} onClick={() => setDrawer('password')}>
            Đổi mật khẩu
          </button>
        </Section>

        <Section title="Quyền riêng tư">
          <p className="text-[13px] text-ink-2">
            Bạn có quyền xem, tải về hoặc xoá dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.{' '}
            <Link to="/thong-tin/bao-mat" className="ds-link">
              Chính sách bảo mật
            </Link>
          </p>
          <button type="button" className={`${actionCls} text-son`} onClick={() => setDeleteOpen(true)}>
            Xoá tài khoản
          </button>
        </Section>

        <div className="pt-7">
          <Button
            variant="outline"
            loading={logout.isPending}
            onClick={() =>
              logout.mutate(undefined, {
                onSettled: () => {
                  navigate('/')
                  toast('Bạn đã đăng xuất. Hẹn gặp lại!', 'success')
                },
              })
            }
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      {drawer === 'add' && <AddressFormDrawer open onClose={() => setDrawer(null)} address={null} />}
      {drawer === 'list' && <AddressListDrawer open onClose={() => setDrawer(null)} />}
      <ChangePasswordDrawer open={drawer === 'password'} onClose={() => setDrawer(null)} />
      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
      <Modal
        open={Boolean(cardToDelete)}
        onClose={() => setCardToDelete(null)}
        title="Xoá thẻ"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCardToDelete(null)}>
              Huỷ
            </Button>
            <Button
              size="sm"
              loading={deleteCard.isPending}
              onClick={() =>
                deleteCard.mutate(cardToDelete.id, {
                  onSuccess: () => {
                    toast('Đã xoá thẻ', 'success')
                    setCardToDelete(null)
                  },
                })
              }
            >
              Xoá thẻ
            </Button>
          </div>
        }
      >
        <p className="text-[13px] text-ink-2">
          Xoá thẻ <span className="uppercase">{cardToDelete?.brand}</span> •••• {cardToDelete?.last4} khỏi tài khoản?
        </p>
      </Modal>
    </div>
  )
}
