import { ProgressBar } from '@/components/ui'
import { formatNumber } from '@/utils/format'

/** Hạng hiện tại + điểm + thanh tiến độ tới hạng kế tiếp. */
export function TierProgress({ me, className }) {
  const next = me.nextTier
  return (
    <div className={className}>
      <p className="text-[13px]">
        Hạng <span className="font-semibold">{me.tier.name}</span> · {formatNumber(me.points)} điểm
      </p>
      <ProgressBar value={next ? me.points / next.min : 1} className="mt-2" />
      <p className="mt-1.5 text-xs text-muted">
        {next ? (
          <>
            Còn {formatNumber(next.remaining)} điểm để lên hạng <span className="font-medium text-ink">{next.name}</span>
          </>
        ) : (
          'Bạn đang ở hạng cao nhất'
        )}
      </p>
    </div>
  )
}
