import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { motoringTips } from "@/lib/autoheads-data";
export default function Page() {
  return (
    <SiteShell>
      <main className="index-page editorial-index">
        <span>AUTOHEADS MOTORING TIPS / 10 SOURCE CATEGORIES</span>
        <h1>
          Look after the machine.
          <br />
          Enjoy the road.
        </h1>
        <div className="article-grid tips-grid">
          {motoringTips.map((tip, i) => (
            <Link
              className={i === 0 ? "lead-article" : ""}
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
      </main>
    </SiteShell>
  );
}
