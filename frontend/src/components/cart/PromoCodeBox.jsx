import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useApplyPromo, useRemovePromo } from '@/hooks/useCart'
import { useUI } from '@/store/ui'

/**
 * Ô mã giảm giá (dùng được bên trong <form> khác — không tự tạo form lồng nhau).
 */
export function PromoCodeBox({ cart, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [code, setCode] = useState('')
  const apply = useApplyPromo()
  const remove = useRemovePromo()
  const toast = useUI((s) => s.toast)

  if (cart.promo) {
    return (
      <div className="border-b border-line pb-4">
        <p className="ds-label mb-2">Mã giảm giá</p>
        <div className="flex items-start gap-3 bg-cham-50 px-3 py-2.5 text-cham-600">
          <Tag className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
          <div className="flex-1 text-xs">
            <p className="font-semibold tracking-wide">{cart.promo.code}</p>
            <p className="mt-0.5">{cart.promo.label}</p>
          </div>
          <button
            type="button"
            onClick={() => remove.mutate(undefined, { onSuccess: () => toast('Đã bỏ mã giảm giá') })}
            disabled={remove.isPending}
            aria-label={`Bỏ mã ${cart.promo.code}`}
            className="hover:opacity-60"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  const submit = () => {
    const c = code.trim()
    if (!c) return
    apply.mutate(c, {
      onSuccess: (next) => {
        toast(`Đã áp dụng mã ${next.promo?.code ?? c.toUpperCase()}`, 'success')
        setCode('')
        setOpen(false)
      },
    })
  }

  return (
    <div className="border-b border-line pb-4">
      <div className="flex items-center justify-between">
        <p className="ds-label">Mã giảm giá</p>
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4 hover:text-cham" aria-expanded={open}>
          {open ? 'Đóng' : 'Thêm'}
        </button>
      </div>
      {open && (
        <div className="mt-3 flex animate-drop items-start gap-2">
          <Input
            aria-label="Nhập mã giảm giá"
            placeholder="Nhập mã, ví dụ NEPMOI"
            value={code}
            className="flex-1"
            inputClassName="uppercase placeholder:normal-case"
            onChange={(e) => {
              setCode(e.target.value)
              if (apply.error) apply.reset()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submit()
              }
            }}
            error={apply.error?.fields?.code ?? apply.error?.message}
          />
          <Button variant="outline" onClick={submit} loading={apply.isPending} disabled={!code.trim()}>
            Áp dụng
          </Button>
        </div>
      )}
    </div>
  )
}
