import { SiteShell } from "@/components/site-shell";
import { aboutCopy } from "@/lib/autoheads-data";
export default function Page() {
  return (
    <SiteShell>
      <main className="article-page about-page">
        <header>
          <small>ABOUT AUTOHEADS</small>
          <h1>Your Digital Motoring Community.</h1>
          <p>Cars · Spares · Mechanics · People</p>
        </header>
        <article className="long-copy">
          {aboutCopy.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </main>
    </SiteShell>
  );
}
