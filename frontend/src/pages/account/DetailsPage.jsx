import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs, Button, DateOfBirthInput, Input, Notice, PasswordInput, Select } from '@/components/ui'
import { useUpdateMe } from '@/hooks/useAccount'
import { useMe } from '@/hooks/useAuth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function DetailsPage() {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const update = useUpdateMe()
  const [form, setForm] = useState({
    email: me.email ?? '',
    lastName: me.lastName ?? '',
    firstName: me.firstName ?? '',
    dateOfBirth: me.dateOfBirth ?? '',
    phone: me.phone ?? '',
    gender: me.gender ?? '',
    password: '',
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }))
  const fe = update.error?.fields ?? {}
  const emailChanged = form.email.trim().toLowerCase() !== me.email.toLowerCase()
  const phone = form.phone.replace(/\D/g, '')
  const phoneOk = !phone || /^0\d{9}$/.test(phone)
  const valid = EMAIL_RE.test(form.email.trim()) && form.firstName.trim() && form.lastName.trim() && phoneOk && (!emailChanged || form.password)

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    const body = {
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth || me.dateOfBirth,
      phone: phone || null,
      gender: form.gender || null,
      ...(emailChanged ? { password: form.password } : {}),
    }
    update.mutate(body, { onSuccess: () => navigate('/tai-khoan/cai-dat', { state: { saved: true } }) })
  }

  return (
    <div>
      <Breadcrumbs
        className="mb-5"
        items={[
          { label: 'Cài đặt', href: '/tai-khoan/cai-dat' },
          { label: 'Thông tin của tôi', href: null },
        ]}
      />
      <h1 className="ds-h1 mb-8">Thông tin của tôi</h1>
      <form onSubmit={submit} noValidate className="max-w-md space-y-5">
        <Input label="Email" required type="email" value={form.email} onChange={set('email')} valid={EMAIL_RE.test(form.email.trim()) && !fe.email} error={fe.email} autoComplete="email" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Họ" required value={form.lastName} onChange={set('lastName')} valid={Boolean(form.lastName.trim())} autoComplete="family-name" />
          <Input label="Tên" required value={form.firstName} onChange={set('firstName')} valid={Boolean(form.firstName.trim())} autoComplete="given-name" />
        </div>
        <DateOfBirthInput value={form.dateOfBirth} onChange={set('dateOfBirth')} />
        <Input
          label="Số điện thoại"
          inputMode="tel"
          placeholder="09xx xxx xxx"
          value={form.phone}
          onChange={set('phone')}
          valid={Boolean(phone) && phoneOk && !fe.phone}
          error={fe.phone ?? (!phoneOk ? 'Số điện thoại gồm 10 số, bắt đầu bằng 0.' : null)}
          hint="Dùng để shipper liên hệ và nhận thông báo giao hàng."
          autoComplete="tel"
        />
        <Select label="Giới tính" value={form.gender} onChange={set('gender')} placeholder="Chọn giới tính">
          <option value="nu">Nữ</option>
          <option value="nam">Nam</option>
          <option value="khac">Khác / Không muốn nói</option>
        </Select>
        <Input label="Quốc gia" value="Việt Nam" disabled />
        <PasswordInput
          label="Mật khẩu hiện tại"
          required={emailChanged}
          value={form.password}
          onChange={set('password')}
          hint="Chỉ cần khi đổi email."
          error={fe.password ?? (emailChanged && !form.password ? 'Nhập mật khẩu hiện tại để đổi email.' : null)}
        />
        <p className="text-xs text-muted">Nếp xử lý dữ liệu của bạn theo Chính sách bảo mật và Nghị định 13/2023/NĐ-CP.</p>
        {update.error && !Object.keys(fe).length && <Notice tone="error">{update.error.message}</Notice>}
        <div className="space-y-2 pt-2">
          <Button type="submit" block loading={update.isPending} disabled={!valid}>
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
