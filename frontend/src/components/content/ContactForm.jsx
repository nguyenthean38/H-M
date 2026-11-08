import { useState } from 'react'
import { Button, Input, Select, Textarea } from '@/components/ui'
import { useUI } from '@/store/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Form liên hệ (bản demo: chỉ hiển thị thông báo, không gửi đi đâu). */
export function ContactForm() {
  const toast = useUI((s) => s.toast)
  const [f, setF] = useState({ name: '', email: '', topic: '', message: '' })
  const [sending, setSending] = useState(false)
  const valid = f.name.trim() && EMAIL_RE.test(f.email) && f.topic && f.message.trim().length >= 10
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!valid) return
        setSending(true)
        setTimeout(() => {
          setSending(false)
          setF({ name: '', email: '', topic: '', message: '' })
          toast('Đã nhận tin nhắn. Chúng tôi sẽ phản hồi qua email trong 24 giờ.', 'success')
        }, 600)
      }}
    >
      <Input label="Họ tên" required value={f.name} onChange={set('name')} />
      <Input label="Email" required type="email" value={f.email} onChange={set('email')} valid={EMAIL_RE.test(f.email)} />
      <Select label="Chủ đề" required placeholder="Chọn chủ đề" value={f.topic} onChange={set('topic')} className="sm:col-span-2">
        <option value="don-hang">Đơn hàng & giao hàng</option>
        <option value="doi-tra">Đổi trả & hoàn tiền</option>
        <option value="san-pham">Sản phẩm & size</option>
        <option value="thanh-vien">Nếp Club</option>
        <option value="khac">Khác</option>
      </Select>
      <Textarea label="Nội dung" required rows={5} value={f.message} onChange={set('message')} className="sm:col-span-2" hint="Tối thiểu 10 ký tự. Nếu hỏi về đơn hàng, vui lòng ghi kèm mã đơn." />
      <div className="sm:col-span-2">
        <Button type="submit" disabled={!valid} loading={sending}>
          Gửi tin nhắn
        </Button>
      </div>
    </form>
  )
}
