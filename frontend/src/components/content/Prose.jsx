import { Accordion } from '@/components/ui'
import { cn } from '@/utils/cn'

/** Các khối nội dung dùng cho trang thông tin. */
export const H2 = ({ children }) => <h2 className="ds-h3 mt-10 mb-3 first:mt-0">{children}</h2>
export const P = ({ children, className }) => <p className={cn('mb-3 text-[14px] leading-relaxed text-ink-2', className)}>{children}</p>

export function List({ items, ordered }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className={cn('mb-4 space-y-2 text-[14px] text-ink-2', ordered ? 'list-decimal pl-5' : '')}>
      {items.map((it, i) => (
        <li key={i} className={cn(!ordered && 'flex items-start gap-2.5')}>
          {!ordered && <span className="mt-2 size-1.5 shrink-0 bg-cham" aria-hidden />}
          <span>{it}</span>
        </li>
      ))}
    </Tag>
  )
}

export function Faq({ items }) {
  return (
    <div className="mb-6 border-t border-line">
      {items.map(([q, a]) => (
        <Accordion key={q} title={q} titleClassName="text-[14px] font-medium">
          <p className="text-[14px] leading-relaxed text-ink-2">{a}</p>
        </Accordion>
      ))}
    </div>
  )
}

export function Table({ head, rows }) {
  return (
    <div className="mb-6 overflow-x-auto border border-line bg-surface">
      <table className="w-full min-w-[480px] text-[13px]">
        <thead>
          <tr className="bg-paper-2">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 text-left ds-label">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line align-top">
              {r.map((c, j) => (
                <td key={j} className={cn('px-4 py-3', j === 0 && 'font-medium text-ink')}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Callout({ children, tone = 'cham' }) {
  return <div className={cn('mb-6 px-5 py-4 text-[14px]', tone === 'cham' ? 'bg-cham-50 text-cham-600' : 'bg-paper-2 text-ink-2')}>{children}</div>
}
