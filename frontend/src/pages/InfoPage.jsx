import { useEffect } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Breadcrumbs, Button } from '@/components/ui'
import { findInfoPage, infoGroups, infoPages } from '@/content/info'
import { cn } from '@/utils/cn'

function SideNav({ current }) {
  return (
    <nav aria-label="Trang thông tin" className="space-y-7">
      {infoGroups.map((g) => (
        <div key={g.key}>
          <p className="ds-eyebrow mb-2.5">{g.label}</p>
          <ul className="space-y-1.5">
            {infoPages
              .filter((p) => p.group === g.key)
              .map((p) => (
                <li key={p.slug}>
                  <NavLink
                    to={`/thong-tin/${p.slug}`}
                    className={cn('block border-l-2 py-0.5 pl-3 text-[14px] transition-colors', p.slug === current ? 'border-cham font-semibold text-ink' : 'border-transparent text-ink-2 hover:text-ink')}
                  >
                    {p.title}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export default function InfoPage() {
  const { slug } = useParams()
  const page = findInfoPage(slug)

  useEffect(() => {
    document.title = `${page?.title ?? 'Không tìm thấy trang'} — Nếp`
  }, [page])

  return (
    <div className="ds-container py-8 lg:py-10">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Thông tin', href: '/thong-tin/tro-giup' },
          { label: page?.title ?? 'Không tìm thấy', href: null },
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="order-2 lg:order-1">
          <div className="lg:sticky lg:top-32">
            <SideNav current={slug} />
          </div>
        </aside>
        <article className="order-1 max-w-3xl lg:order-2">
          {page ? (
            <>
              <h1 className="ds-h1">{page.title}</h1>
              {page.intro && <p className="mt-4 mb-10 max-w-2xl font-display text-xl leading-snug text-ink-2 italic">{page.intro}</p>}
              <div key={page.slug} className="animate-fade-in">
                {page.body()}
              </div>
            </>
          ) : (
            <div className="py-10">
              <FileQuestion className="mb-4 size-10 text-cham" strokeWidth={1.25} />
              <h1 className="ds-h1">Không tìm thấy trang</h1>
              <p className="mt-4 max-w-md text-[14px] text-ink-2">Trang thông tin bạn tìm không tồn tại hoặc đã được chuyển đi. Có thể bạn đang cần:</p>
              <ul className="mt-4 space-y-1.5 text-[14px]">
                {['tro-giup', 'giao-hang', 'doi-tra', 'bang-size'].map((s) => (
                  <li key={s}>
                    <Link to={`/thong-tin/${s}`} className="underline underline-offset-2 hover:text-cham">
                      {findInfoPage(s).title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Button to="/" variant="outline" className="mt-8">
                Về trang chủ
              </Button>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
