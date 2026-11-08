import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CircleCheck, KeyRound } from 'lucide-react'
import { Button, Notice, PasswordInput, passwordValid } from '@/components/ui'
import { NarrowPage } from '@/components/content/NarrowPage'
import { useResetPassword } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState(false)
  const reset = useResetPassword()
  const openAuth = useUI((s) => s.openAuth)

  useEffect(() => {
    document.title = 'Tạo mật khẩu mới — Nếp'
  }, [])

  const matches = confirm.length > 0 && confirm === password
  const valid = passwordValid(password) && matches

  if (!token) {
    return (
      <NarrowPage title="Liên kết chưa đầy đủ" center>
        <KeyRound className="mx-auto mb-5 size-10 text-cham" strokeWidth={1.25} />
        <p className="text-[14px] text-ink-2">Liên kết đặt lại mật khẩu thiếu mã xác thực. Hãy mở lại liên kết trong email, hoặc yêu cầu một liên kết mới.</p>
        <Button to="/quen-mat-khau" className="mt-8">
          Yêu cầu liên kết mới
        </Button>
      </NarrowPage>
    )
  }

  if (reset.isSuccess) {
    return (
      <NarrowPage title="Đổi mật khẩu thành công" center>
        <CircleCheck className="mx-auto mb-5 size-10 text-la" strokeWidth={1.25} />
        <p className="text-[14px] text-ink-2">Mật khẩu của bạn đã được cập nhật. Chúc bạn mua sắm vui vẻ!</p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Button onClick={() => openAuth()}>Đăng nhập</Button>
          <Button to="/" variant="outline">
            Tiếp tục mua sắm
          </Button>
        </div>
      </NarrowPage>
    )
  }

  const tokenError = reset.error?.code === 'TOKEN_INVALID'

  return (
    <NarrowPage title="Tạo mật khẩu mới">
      {tokenError ? (
        <div className="space-y-6">
          <Notice tone="error">{reset.error.message}</Notice>
          <Button to="/quen-mat-khau" block>
            Gửi lại liên kết mới
          </Button>
        </div>
      ) : (
        <form
          noValidate
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            setTouched(true)
            if (valid) reset.mutate({ token, password })
          }}
        >
          <PasswordInput label="Mật khẩu mới" required showRules touched={touched} value={password} onChange={(e) => setPassword(e.target.value)} error={reset.error?.fields?.password} autoFocus />
          <PasswordInput
            label="Nhập lại mật khẩu"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setTouched(true)}
            valid={matches && passwordValid(password)}
            error={touched && confirm && !matches ? 'Mật khẩu nhập lại chưa khớp.' : null}
          />
          {reset.error && !tokenError && !reset.error.fields && <Notice tone="error">{reset.error.message}</Notice>}
          <Button type="submit" block size="lg" disabled={!valid} loading={reset.isPending}>
            Đổi mật khẩu
          </Button>
        </form>
      )}
    </NarrowPage>
  )
}
