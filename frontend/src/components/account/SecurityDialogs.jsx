import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Drawer, Input, Modal, Notice, PasswordInput, passwordValid } from '@/components/ui'
import { useChangePassword, useDeleteAccount } from '@/hooks/useAccount'
import { tokenStore } from '@/api'
import { useUI } from '@/store/ui'

export function ChangePasswordDrawer({ open, onClose }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [touched, setTouched] = useState(false)
  const m = useChangePassword()
  const toast = useUI((s) => s.toast)
  const fe = m.error?.fields ?? {}
  const mismatch = form.confirm && form.confirm !== form.newPassword
  const ready = form.currentPassword && passwordValid(form.newPassword) && form.confirm === form.newPassword
  const close = () => {
    setForm({ currentPassword: '', newPassword: '', confirm: '' })
    setTouched(false)
    m.reset()
    onClose()
  }
  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!ready) return
    m.mutate(
      { currentPassword: form.currentPassword, newPassword: form.newPassword },
      {
        onSuccess: () => {
          toast('Đã đổi mật khẩu', 'success')
          close()
        },
      },
    )
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <Drawer
      open={open}
      onClose={close}
      title="Đổi mật khẩu"
      footer={
        <Button type="submit" form="password-form" block loading={m.isPending} disabled={touched && !ready}>
          Đổi mật khẩu
        </Button>
      }
    >
      <form id="password-form" onSubmit={submit} noValidate className="space-y-5 p-5">
        <PasswordInput label="Mật khẩu hiện tại" required value={form.currentPassword} onChange={set('currentPassword')} error={fe.currentPassword} />
        <PasswordInput label="Mật khẩu mới" required showRules touched={touched} value={form.newPassword} onChange={set('newPassword')} error={fe.newPassword} />
        <PasswordInput label="Nhập lại mật khẩu mới" required value={form.confirm} onChange={set('confirm')} error={mismatch ? 'Mật khẩu nhập lại chưa khớp.' : null} />
        {m.error && !Object.keys(fe).length && <Notice tone="error">{m.error.message}</Notice>}
      </form>
    </Drawer>
  )
}

export function DeleteAccountModal({ open, onClose }) {
  const [text, setText] = useState('')
  const m = useDeleteAccount()
  const navigate = useNavigate()
  const toast = useUI((s) => s.toast)
  const ok = text.trim().toUpperCase() === 'XOÁ' || text.trim().toUpperCase() === 'XÓA'
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Xoá tài khoản"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Giữ tài khoản
          </Button>
          <Button
            size="sm"
            className="bg-son hover:bg-son/90"
            disabled={!ok}
            loading={m.isPending}
            onClick={() =>
              m.mutate(undefined, {
                onSuccess: () => {
                  tokenStore.clear()
                  navigate('/')
                  toast('Tài khoản của bạn đã được xoá.', 'success')
                },
              })
            }
          >
            Xoá vĩnh viễn
          </Button>
        </div>
      }
    >
      <p className="font-display text-2xl">Bạn sẽ mất toàn bộ điểm và ưu đãi.</p>
      <p className="mt-3 text-[13px] text-ink-2">Lịch sử đơn hàng, địa chỉ, thẻ đã lưu và điểm Nếp Club sẽ bị xoá và không thể khôi phục. Đơn hàng đang giao vẫn được xử lý bình thường.</p>
      <Input className="mt-5" label='Gõ "XOÁ" để xác nhận' value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" />
    </Modal>
  )
}
