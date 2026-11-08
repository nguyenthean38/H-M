import { useState } from 'react'
import { Button, Modal, Notice, Radio } from '@/components/ui'
import { useCancelOrder, useCancelReasons } from '@/hooks/useOrders'

/**
 * Luồng huỷ đơn 2 bước: xác nhận → chọn lý do (có thể bỏ qua).
 * `step`: null | 'confirm' | 'reason'
 */
export function CancelOrderFlow({ order, step, setStep, onCancelled, email }) {
  const [reason, setReason] = useState('')
  const { data: reasons = [] } = useCancelReasons()
  const cancel = useCancelOrder()
  const close = () => {
    setStep(null)
    setReason('')
    cancel.reset()
  }
  const submit = (r) =>
    cancel.mutate(
      { number: order.number, reason: r || null, email },
      {
        onSuccess: (o) => {
          close()
          onCancelled?.(o)
        },
      },
    )

  return (
    <>
      <Modal
        open={step === 'confirm'}
        onClose={close}
        title="Huỷ đơn hàng"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={close}>
              Quay lại
            </Button>
            <Button size="sm" className="bg-son hover:bg-son/90" onClick={() => setStep('reason')}>
              Huỷ đơn
            </Button>
          </div>
        }
      >
        <p className="font-display text-2xl">Bạn chắc chắn muốn huỷ?</p>
        <p className="mt-3 text-[13px] text-ink-2">Nếu huỷ đơn rồi đổi ý, bạn sẽ cần đặt lại từ đầu và ưu đãi đi kèm có thể không còn.</p>
        <p className="mt-3 text-[13px] text-ink-2">
          Đơn hàng <strong>{order.number}</strong> sẽ được hoàn tiền đầy đủ (nếu đã thanh toán) hoặc không bị trừ tiền, tuỳ phương thức bạn chọn.
        </p>
      </Modal>

      <Modal
        open={step === 'reason'}
        onClose={close}
        title="Huỷ đơn hàng"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => submit(null)} disabled={cancel.isPending}>
              Bỏ qua
            </Button>
            <Button size="sm" onClick={() => submit(reason)} disabled={!reason} loading={cancel.isPending}>
              Gửi
            </Button>
          </div>
        }
      >
        <p className="font-display text-2xl">Vì sao bạn huỷ đơn?</p>
        <p className="mt-2 text-[13px] text-muted">Góp ý của bạn giúp Nếp phục vụ tốt hơn.</p>
        <fieldset className="mt-5 space-y-3.5">
          <legend className="sr-only">Lý do huỷ đơn</legend>
          {reasons.map((r) => (
            <Radio key={r} name="cancel-reason" value={r} label={r} checked={reason === r} onChange={() => setReason(r)} />
          ))}
        </fieldset>
        {cancel.error && (
          <Notice tone="error" className="mt-4">
            {cancel.error.message}
          </Notice>
        )}
      </Modal>
    </>
  )
}
