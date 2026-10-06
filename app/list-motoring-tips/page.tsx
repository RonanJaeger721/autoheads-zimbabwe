import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { motoringTips } from '@/lib/autoheads-data';
export default function Page() {
  const groups = Array.from(new Set(motoringTips.map((tip) => tip.category)));
  return (
    <SiteShell>
      <main className="index-page editorial-index">
        <span>AUTOHEADS MOTORING TIPS / 10 SOURCE CATEGORIES</span>
        <h1>
          Look after the machine.
          <br />
          Enjoy the road.
        </h1>
        <nav className="tip-category-nav" aria-label="Motoring tip categories">
          {groups.map((group) => (
            <a
              href={`#${group.toLowerCase().replaceAll(' ', '-')}`}
              key={group}
            >
              {group}
            </a>
          ))}
        </nav>
        {groups.map((group) => (
          <section
            className="tip-category-section"
            id={group.toLowerCase().replaceAll(' ', '-')}
            key={group}
          >
            <header>
              <small>MOTORING TIPS / CATEGORY</small>
              <h2>{group}</h2>
            </header>
            <div className="article-grid tips-grid">
              {motoringTips
                .filter((tip) => tip.category === group)
                .map((tip, i) => (
                  <Link
                    className={i === 0 ? 'lead-article' : ''}
                    href={`/view-motoring-tip-${tip.id}`}
                    key={tip.id}
                  >
                    <small>{tip.category}</small>
                    <h3>{tip.title}</h3>
                    <p>{tip.excerpt}</p>
                    <span>
                      Read motoring tip <ArrowRight />
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </main>
    </SiteShell>
  );
}
