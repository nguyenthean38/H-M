import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button, Checkbox, Input, Notice, Select } from '@/components/ui'
import { CopyCode } from '@/components/content/CopyCode'
import { provinces, regions } from '@/config/locations'
import { useMe } from '@/hooks/useAuth'
import { useSubscribeNewsletter } from '@/hooks/useStores'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const INTERESTS = [
  { value: 'nu', label: 'Nữ' },
  { value: 'nam', label: 'Nam' },
  { value: 'tre-em', label: 'Trẻ em' },
  { value: 'nha', label: 'Nhà' },
  { value: 'lam-dep', label: 'Làm đẹp' },
]
const PERKS = ['Ưu đãi riêng chỉ dành cho người đăng ký', 'Gợi ý phối đồ theo mùa, theo dịp', 'Mở bán sớm bộ sưu tập mới', 'Lời mời workshop và sự kiện tại cửa hàng']

function Portrait() {
  return (
    <div className="aspect-[4/5] overflow-hidden bg-paper-2">
      <img src="/images/campaign/newsletter.jpg" alt="Người mẫu mặc trang phục Nếp, ảnh đen trắng" className="size-full object-cover grayscale" />
    </div>
  )
}

export default function NewsletterPage() {
  const { data: me } = useMe()
  const sub = useSubscribeNewsletter()
  const [form, setForm] = useState({ email: '', province: '', interests: [], consent: false })
  const [touched, setTouched] = useState({})
  const [result, setResult] = useState(null)

  useEffect(() => {
    document.title = 'Đăng ký bản tin — Nếp'
  }, [])
  useEffect(() => {
    if (me?.email) setForm((f) => (f.email ? f : { ...f, email: me.email }))
  }, [me])

  const emailOk = EMAIL_RE.test(form.email.trim())
  const valid = emailOk && form.province && form.consent
  const fe = sub.error?.fields ?? {}
  const toggleInterest = (v) => setForm((f) => ({ ...f, interests: f.interests.includes(v) ? f.interests.filter((x) => x !== v) : [...f.interests, v] }))

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    sub.mutate({ ...form, email: form.email.trim() }, { onSuccess: setResult })
  }

  if (result) {
    return (
      <div className="ds-container py-10 lg:py-14">
        <h1 className="ds-h1 mb-8">Đăng ký bản tin</h1>
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          <Portrait />
          <div className="max-w-lg animate-slide-up">
            <p className="ds-label mb-3 flex items-center gap-2 text-la">
              <Check className="size-4" /> {result.alreadySubscribed ? 'Đã cập nhật sở thích của bạn' : 'Đăng ký thành công'}
            </p>
            <h2 className="ds-h2">Chào mừng bạn đến với cộng đồng Nếp</h2>
            <p className="mt-4 text-[14px] text-ink-2">
              {result.alreadySubscribed
                ? 'Email này đã đăng ký từ trước — chúng tôi đã cập nhật khu vực và sở thích mới của bạn.'
                : 'Cảm ơn bạn đã tham gia! Bạn sẽ là một trong những người đầu tiên nhận ưu đãi riêng, gợi ý phối đồ và tin mở bán bộ sưu tập mới.'}
            </p>
            <div className="mt-7 bg-surface p-5">
              <p className="text-[13px]">Quà chào mừng: giảm 10% cho đơn hàng đầu tiên (tối đa 100.000₫)</p>
              <CopyCode code="NEPMOI" className="mt-3" />
            </div>
            <Button to="/c/moi-ve" size="lg" className="mt-8">
              Khám phá hàng mới về
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ds-container py-10 lg:py-14">
      <h1 className="ds-h1 mb-8">Đăng ký bản tin</h1>
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        <Portrait />
        <form onSubmit={submit} noValidate className="max-w-lg space-y-6">
          <div>
            <h2 className="ds-label mb-3">Đăng ký để nhận</h2>
            <ul className="space-y-1.5 text-[14px]">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 shrink-0 bg-cham" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] text-muted">Miễn phí, gửi thẳng vào hộp thư — tối đa 2 email mỗi tuần.</p>
          </div>

          <Input
            label="Email"
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            valid={emailOk}
            error={fe.email ?? (touched.email && !emailOk ? 'Email chưa đúng định dạng.' : null)}
          />
          <Select
            label="Tỉnh / Thành phố"
            required
            placeholder="Chọn tỉnh, thành phố"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            valid={Boolean(form.province)}
            error={fe.province}
          >
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

          <fieldset>
            <legend className="ds-label mb-3">Bạn quan tâm đến</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INTERESTS.map((i) => (
                <Checkbox key={i.value} label={i.label} checked={form.interests.includes(i.value)} onChange={() => toggleInterest(i.value)} />
              ))}
            </div>
          </fieldset>

          <Checkbox
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            error={fe.consent}
            label={
              <>
                Tôi đồng ý nhận email ưu đãi và tin tức từ Nếp, và xác nhận tôi từ 16 tuổi trở lên. Tôi có thể huỷ đăng ký bất cứ lúc nào bằng liên kết ở cuối mỗi email. <span className="text-son">*</span>
              </>
            }
          />
          <p className="text-xs leading-relaxed text-muted">
            Email của chúng tôi có thể dùng công nghệ đo lường lượt mở để cá nhân hoá nội dung. Xem thêm tại{' '}
            <Link to="/thong-tin/bao-mat" className="underline underline-offset-2">
              Chính sách bảo mật
            </Link>
            .
          </p>
          {sub.error && !Object.keys(fe).length && <Notice tone="error">{sub.error.message}</Notice>}
          <Button type="submit" block size="lg" disabled={!valid} loading={sub.isPending}>
            Đăng ký ngay
          </Button>
        </form>
      </div>
    </div>
  )
}
