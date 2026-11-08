import { useState } from 'react'
import { Button, Checkbox, Drawer, Input, Modal, Notice, Radio, Select } from '@/components/ui'
import { provinceName, provinces, regions } from '@/config/locations'
import { useAddAddress, useAddresses, useDeleteAddress, useUpdateAddress } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'
import { formatPhone } from '@/utils/format'

const EMPTY = { fullName: '', phone: '', line1: '', ward: '', province: '', label: 'Nhà riêng', isDefault: false }

export function formatAddress(a) {
  return `${a.line1}, ${a.ward}, ${provinceName(a.province)}`
}

/** Drawer thêm / sửa địa chỉ (H&M #97–99). `address` null = thêm mới. */
export function AddressFormDrawer({ open, onClose, onBack, address, onSaved }) {
  const add = useAddAddress()
  const update = useUpdateAddress()
  const toast = useUI((s) => s.toast)
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(address ?? {}) }))
  const m = address ? update : add
  const fe = m.error?.fields ?? {}
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const ok = (k) => Boolean(form[k]?.toString().trim()) && !fe[k]
  const submit = (e) => {
    e.preventDefault()
    const body = { ...form, phone: form.phone.replace(/\D/g, '') }
    const done = () => {
      toast(address ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ mới', 'success')
      onSaved?.()
      onClose()
    }
    if (address) update.mutate({ id: address.id, ...body }, { onSuccess: done })
    else add.mutate(body, { onSuccess: done })
  }
  return (
    <Drawer
      open={open}
      onClose={onClose}
      onBack={onBack}
      title={address ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
      footer={
        <Button type="submit" form="address-form" block loading={m.isPending}>
          Lưu địa chỉ
        </Button>
      }
    >
      <form id="address-form" onSubmit={submit} noValidate className="space-y-4 p-5">
        <Input label="Họ và tên người nhận" required value={form.fullName} onChange={set('fullName')} valid={ok('fullName')} error={fe.fullName} autoComplete="name" />
        <Input label="Số điện thoại" required inputMode="tel" placeholder="09xx xxx xxx" value={form.phone} onChange={set('phone')} valid={/^0\d{9}$/.test(form.phone.replace(/\D/g, ''))} error={fe.phone} autoComplete="tel" />
        <Input label="Số nhà, tên đường" required value={form.line1} onChange={set('line1')} valid={ok('line1')} error={fe.line1} hint="Ví dụ: 18 Ngõ 52 Tô Ngọc Vân" autoComplete="address-line1" />
        <Input label="Phường / Xã" required value={form.ward} onChange={set('ward')} valid={ok('ward')} error={fe.ward} hint="Theo đơn vị hành chính mới từ 01/7/2025" />
        <Select label="Tỉnh / Thành phố" required value={form.province} onChange={set('province')} placeholder="Chọn tỉnh / thành phố" valid={Boolean(form.province)} error={fe.province}>
          {regions.map((r) => (
            <optgroup key={r.code} label={r.name}>
              {provinces
                .filter((p) => p.region === r.code)
                .map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </Select>
        <Input label="Quốc gia" value="Việt Nam" disabled />
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-ink-2">Loại địa chỉ</legend>
          <div className="flex gap-6">
            {['Nhà riêng', 'Công ty'].map((l) => (
              <Radio key={l} name="addr-label" label={l} checked={form.label === l} onChange={() => setForm((f) => ({ ...f, label: l }))} />
            ))}
          </div>
        </fieldset>
        {!address?.isDefault && <Checkbox label="Đặt làm địa chỉ mặc định" checked={form.isDefault} onChange={set('isDefault')} />}
        {m.error && !Object.keys(fe).length && <Notice tone="error">{m.error.message}</Notice>}
      </form>
    </Drawer>
  )
}

/** Drawer "Địa chỉ của tôi" (H&M #100): danh sách + sửa/xoá/đặt mặc định. */
export function AddressListDrawer({ open, onClose }) {
  const { data: list = [] } = useAddresses()
  const update = useUpdateAddress()
  const del = useDeleteAddress()
  const toast = useUI((s) => s.toast)
  const [editing, setEditing] = useState(undefined) // undefined: danh sách, null: thêm mới, object: sửa
  const [confirm, setConfirm] = useState(null)

  if (editing !== undefined)
    return <AddressFormDrawer key={editing?.id ?? 'new'} open={open} onClose={onClose} onBack={() => setEditing(undefined)} address={editing} onSaved={() => setEditing(undefined)} />

  return (
    <>
      <Drawer open={open} onClose={onClose} title="Địa chỉ của tôi">
        <div className="p-5">
          <button type="button" onClick={() => setEditing(null)} className="ds-link text-xs font-semibold tracking-[0.1em] uppercase">
            + Thêm địa chỉ mới
          </button>
          <ul className="mt-5 divide-y divide-line border-t border-line">
            {list.map((a) => (
              <li key={a.id} className="py-5 text-[13px]">
                <Radio
                  name="default-address"
                  checked={a.isDefault}
                  onChange={() => update.mutate({ id: a.id, isDefault: true }, { onSuccess: () => toast('Đã đổi địa chỉ mặc định', 'success') })}
                  label={a.isDefault ? 'Địa chỉ mặc định' : 'Đặt làm mặc định'}
                />
                <div className="mt-3 pl-[30px] text-ink-2">
                  <p className="font-medium text-ink">
                    {a.fullName} {a.label && <span className="ml-1 text-xs font-normal text-muted">· {a.label}</span>}
                  </p>
                  <p>{formatPhone(a.phone)}</p>
                  <p>{formatAddress(a)}</p>
                  <div className="mt-3 flex gap-5 text-xs font-semibold tracking-[0.08em] uppercase">
                    <button type="button" className="underline underline-offset-4 hover:text-cham" onClick={() => setEditing(a)}>
                      Sửa
                    </button>
                    <button type="button" className="underline underline-offset-4 hover:text-son" onClick={() => setConfirm(a)}>
                      Xoá
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {!list.length && <li className="py-6 text-[13px] text-muted">Bạn chưa lưu địa chỉ nào.</li>}
          </ul>
        </div>
      </Drawer>
      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title="Xoá địa chỉ"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirm(null)}>
              Huỷ
            </Button>
            <Button
              size="sm"
              loading={del.isPending}
              onClick={() =>
                del.mutate(confirm.id, {
                  onSuccess: () => {
                    toast('Đã xoá địa chỉ', 'success')
                    setConfirm(null)
                  },
                })
              }
            >
              Xoá địa chỉ
            </Button>
          </div>
        }
      >
        <p className="text-[13px] text-ink-2">Bạn có chắc muốn xoá địa chỉ {confirm && formatAddress(confirm)}?</p>
      </Modal>
    </>
  )
}
