import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Minus, Plus } from 'lucide-react'
import { Button, Checkbox, DateOfBirthInput, Input, Modal, Notice, PasswordInput, Select, passwordValid } from '@/components/ui'
import { DEMO } from '@/config/demo'
import { useCheckEmail, useLogin, useRegister } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Đăng nhập "email trước": nhập email → hệ thống kiểm tra →
 *  - đã có tài khoản: nhập mật khẩu
 *  - chưa có: form trở thành thành viên Nếp Club.
 */
export function AuthModal() {
  const auth = useUI((s) => s.auth)
  const setAuth = useUI((s) => s.setAuth)
  const close = useUI((s) => s.closeAuth)
  const titles = { email: 'Đăng nhập', login: 'Đăng nhập', register: 'Trở thành thành viên Nếp Club' }
  const done = () => {
    auth.onSuccess?.()
    close()
  }
  return (
    <Modal open={auth.open} onClose={close} title={titles[auth.step]} size="sm">
      {auth.step === 'email' && <EmailStep initial={auth.email} onNext={(email, exists) => setAuth({ email, step: exists ? 'login' : 'register' })} />}
      {auth.step === 'login' && <LoginStep email={auth.email} onBack={() => setAuth({ step: 'email' })} onDone={done} />}
      {auth.step === 'register' && <RegisterStep email={auth.email} onBack={() => setAuth({ step: 'email' })} onDone={done} />}
    </Modal>
  )
}

function EmailStep({ initial, onNext }) {
  const [email, setEmail] = useState(initial || '')
  const [touched, setTouched] = useState(false)
  const check = useCheckEmail()
  const valid = EMAIL_RE.test(email.trim())
  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    check.mutate(email.trim(), { onSuccess: (r) => onNext(email.trim(), r.exists) })
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <p className="text-[13px] font-medium">Đăng nhập bằng email, hoặc đăng ký để trở thành thành viên Nếp Club.</p>
      <Input
        label="Email"
        required
        type="email"
        autoComplete="email"
        placeholder="ten@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        valid={valid}
        error={(touched && !valid && 'Email chưa đúng định dạng.') || check.error?.message}
        autoFocus
      />
      <Button type="submit" block loading={check.isPending}>
        Tiếp tục
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
        <Lock className="size-3.5" /> Thông tin của bạn được bảo mật
      </p>
      <div className="border border-dashed border-cham-300 bg-cham-50 px-4 py-3 text-xs text-cham-600">
        <p className="font-semibold">Tài khoản demo</p>
        <p className="mt-1">
          Email <button type="button" className="font-mono underline" onClick={() => setEmail(DEMO.email)}>{DEMO.email}</button> · Mật khẩu <span className="font-mono">{DEMO.password}</span>
        </p>
      </div>
      <p className="text-center">
        <Link to="/nep-club" className="text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4">
          Quyền lợi Nếp Club
        </Link>
      </p>
    </form>
  )
}

function LoginStep({ email, onBack, onDone }) {
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const login = useLogin()
  const closeAuth = useUI((s) => s.closeAuth)
  const toast = useUI((s) => s.toast)
  const submit = (e) => {
    e.preventDefault()
    if (!password) return
    login.mutate(
      { email, password, remember },
      {
        onSuccess: (u) => {
          toast(`Chào ${u.firstName ?? 'bạn'}, mừng bạn quay lại!`, 'success')
          onDone()
        },
      },
    )
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-[13px] font-medium">Nhập mật khẩu để đăng nhập.</p>
      <Input label="Email" value={email} disabled valid />
      <PasswordInput label="Mật khẩu" required value={password} onChange={(e) => setPassword(e.target.value)} error={login.error?.message} autoFocus />
      <Checkbox label="Ghi nhớ đăng nhập" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
      <Button type="submit" block loading={login.isPending} disabled={!password}>
        Đăng nhập
      </Button>
      <Button variant="outline" block onClick={onBack}>
        Dùng email khác
      </Button>
      <p className="text-center">
        <Link to={`/quen-mat-khau?email=${encodeURIComponent(email)}`} onClick={closeAuth} className="text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4">
          Quên mật khẩu?
        </Link>
      </p>
    </form>
  )
}

function RegisterStep({ email, onBack, onDone }) {
  const [form, setForm] = useState({ password: '', dateOfBirth: '', firstName: '', lastName: '', phone: '', gender: '', newsletter: true })
  const [more, setMore] = useState(false)
  const [touched, setTouched] = useState(false)
  const register = useRegister()
  const toast = useUI((s) => s.toast)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }))
  const ready = passwordValid(form.password) && form.dateOfBirth
  const fe = register.error?.fields ?? {}
  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!ready) return
    register.mutate(
      { email, ...form },
      {
        onSuccess: (u) => {
          toast(`Chào mừng thành viên mới! Bạn được tặng ${u.points} điểm.`, 'success')
          onDone()
        },
      },
    )
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Input label="Email" value={email} disabled valid error={fe.email} />
      <PasswordInput label="Tạo mật khẩu" required showRules touched={touched} value={form.password} onChange={set('password')} error={fe.password} />
      <DateOfBirthInput required value={form.dateOfBirth} onChange={set('dateOfBirth')} error={fe.dateOfBirth ?? (touched && !form.dateOfBirth ? 'Vui lòng nhập ngày sinh hợp lệ.' : null)} />

      <div className="border-y border-line">
        <button type="button" onClick={() => setMore((m) => !m)} className="flex w-full items-center justify-between py-3.5 ds-label" aria-expanded={more}>
          Thêm thông tin để nhận thêm điểm
          {more ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </button>
        {more && (
          <div className="animate-drop space-y-4 pb-5">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Họ" value={form.lastName} onChange={set('lastName')} valid={Boolean(form.lastName)} />
              <Input label="Tên" value={form.firstName} onChange={set('firstName')} valid={Boolean(form.firstName)} />
            </div>
            <Input label="Số điện thoại" inputMode="tel" placeholder="09xx xxx xxx" value={form.phone} onChange={set('phone')} hint="+50 điểm khi thêm số điện thoại" />
            <Select label="Giới tính" value={form.gender} onChange={set('gender')} placeholder="Chọn giới tính">
              <option value="nu">Nữ</option>
              <option value="nam">Nam</option>
              <option value="khac">Khác / Không muốn nói</option>
            </Select>
          </div>
        )}
      </div>

      <Checkbox label="Gửi cho tôi ưu đãi, xu hướng mới và lời mời sự kiện qua email." checked={form.newsletter} onChange={set('newsletter')} />
      <p className="text-xs leading-relaxed text-muted">
        Khi đăng ký, bạn đồng ý với{' '}
        <Link to="/thong-tin/dieu-khoan" className="underline">
          Điều khoản Nếp Club
        </Link>{' '}
        và{' '}
        <Link to="/thong-tin/bao-mat" className="underline">
          Chính sách bảo mật
        </Link>
        . Bạn có thể huỷ đăng ký bất cứ lúc nào.
      </p>
      {register.error && !Object.keys(fe).length && <Notice tone="error">{register.error.message}</Notice>}
      <Button type="submit" block loading={register.isPending} disabled={touched && !ready}>
        Trở thành thành viên
      </Button>
      <Button variant="outline" block onClick={onBack}>
        Quay lại đăng nhập
      </Button>
    </form>
  )
}
