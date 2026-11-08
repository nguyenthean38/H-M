import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { NarrowPage } from '@/components/content/NarrowPage'
import { brand } from '@/config/brand'
import { useForgotPassword } from '@/hooks/useAuth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function ForgotPasswordPage() {
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('email') ?? '')
  const [touched, setTouched] = useState(false)
  const forgot = useForgotPassword()
  const valid = EMAIL_RE.test(email.trim())

  useEffect(() => {
    document.title = 'Quên mật khẩu — Nếp'
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (valid) forgot.mutate(email.trim())
  }

  if (forgot.isSuccess) {
    const token = forgot.data?.demoToken
    return (
      <NarrowPage title="Đã gửi liên kết đặt lại mật khẩu">
        <MailCheck className="mb-5 size-10 text-cham" strokeWidth={1.25} />
        <p className="text-[14px] text-ink-2">
          Nếu <strong className="text-ink">{email.trim()}</strong> đã đăng ký tài khoản Nếp, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong ít phút. Liên kết có hiệu lực trong 60 phút.
        </p>
        <p className="mt-3 text-[13px] text-muted">
          Không thấy email? Hãy kiểm tra thư mục Spam hoặc Quảng cáo. Sau 15 phút vẫn chưa nhận được, vui lòng liên hệ{' '}
          <Link to="/thong-tin/lien-he" className="underline underline-offset-2">
            bộ phận chăm sóc khách hàng
          </Link>{' '}
          qua hotline {brand.hotline}.
        </p>
        {token && (
          <div className="mt-7 border border-dashed border-cham-300 bg-cham-50 p-4 text-[13px] text-cham-600">
            <p className="font-semibold">Bản demo không gửi email thật</p>
            <p className="mt-1">Bấm vào liên kết dưới đây để mô phỏng việc mở email.</p>
            <Link to={`/dat-lai-mat-khau?token=${encodeURIComponent(token)}`} className="mt-2 inline-block font-semibold underline underline-offset-4">
              Mở liên kết đặt lại mật khẩu →
            </Link>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Button to="/" variant="outline">
            Về trang chủ
          </Button>
          <Button variant="link" className="px-3" onClick={() => forgot.reset()}>
            Gửi lại với email khác
          </Button>
        </div>
      </NarrowPage>
    )
  }

  return (
    <NarrowPage title="Quên mật khẩu?">
      <form onSubmit={submit} noValidate className="space-y-6">
        <p className="text-[14px] font-medium">Nhập email bạn đã dùng để tạo tài khoản, chúng tôi sẽ gửi liên kết để bạn đặt lại mật khẩu.</p>
        <Input
          label="Email"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          valid={valid}
          error={forgot.error?.fields?.email ?? (touched && !valid ? 'Email chưa đúng định dạng.' : forgot.error?.message)}
          autoFocus
        />
        <Button type="submit" block size="lg" loading={forgot.isPending}>
          Gửi liên kết
        </Button>
        <p className="text-center text-[13px] text-muted">
          Nhớ ra mật khẩu rồi?{' '}
          <Link to="/" className="underline underline-offset-2 hover:text-ink">
            Quay lại mua sắm
          </Link>
        </p>
      </form>
    </NarrowPage>
  )
}
