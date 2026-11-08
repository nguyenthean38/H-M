import { useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'
import { Button, Drawer, Input } from '@/components/ui'
import { useMe } from '@/hooks/useAuth'
import { useNotifyMe } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'

/** "Báo khi có hàng" cho size đã hết (ảnh thiết kế #45–#47). */
export function NotifyMeDrawer({ open, onClose, product, color, initialSize }) {
  const { data: me } = useMe()
  const notify = useNotifyMe()
  const [size, setSize] = useState(initialSize)
  const [email, setEmail] = useState('')
  useEffect(() => {
    if (open) {
      setSize(initialSize)
      setEmail(me?.email ?? '')
      notify.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  if (!product || !color) return null
  const done = notify.isSuccess
  return (
    <Drawer
      open={open}
      onClose={onClose}
      onBack={done ? () => notify.reset() : undefined}
      title="Báo khi có hàng"
      footer={
        done ? (
          <Button block onClick={onClose}>
            Tiếp tục mua sắm
          </Button>
        ) : (
          <Button block loading={notify.isPending} disabled={!size || !email} onClick={() => notify.mutate({ id: product.id, colorCode: color.code, size, email })}>
            Báo cho tôi
          </Button>
        )
      }
    >
      {done ? (
        <div className="px-5 py-8">
          <BellRing className="size-8 text-cham" strokeWidth={1.5} />
          <h3 className="mt-4 ds-h3">Đã đăng ký thành công!</h3>
          <p className="mt-2 text-[13px] text-ink-2">
            Khi {product.name} màu {color.name.toLowerCase()} size {size} có hàng trở lại, chúng tôi sẽ gửi email đến <strong>{notify.data.email}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-6 px-5 py-5">
          <div className="flex gap-3">
            <img src={color.images[0].url} alt="" className="h-20 w-[60px] object-cover" />
            <div className="text-[13px]">
              <p>{product.name}</p>
              <p className="text-muted">Màu: {color.name}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 ds-label">Size đã chọn: {size ?? '—'}</p>
            <div className="grid grid-cols-5 gap-1.5">
              {color.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  disabled={s.inStock}
                  onClick={() => setSize(s.label)}
                  className={cn('h-10 border text-xs', s.inStock ? 'border-line text-subtle' : size === s.label ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink')}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Chỉ có thể đăng ký cho size đang hết hàng.</p>
          </div>
          <Input label="Email nhận thông báo" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={notify.error?.fields?.email ?? notify.error?.message} />
        </div>
      )}
    </Drawer>
  )
}
