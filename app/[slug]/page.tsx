import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { motoringTips, posts } from "@/lib/autoheads-data";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isTip = slug.startsWith("view-motoring-tip-");
  const id = slug.replace(isTip ? "view-motoring-tip-" : "view-", "");
  const item = isTip
    ? motoringTips.find((x) => x.id === id)
    : posts.find((x) => x.id === id);
  if (!item) notFound();
  return (
    <SiteShell>
      <main className="article-page">
        <header>
          <small>
            {item.category}
            {"source" in item && item.source ? ` / SOURCE: ${item.source}` : ""}
          </small>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
        </header>
        {!isTip && (
          <div className="article-image">
            <Image
              src={"image" in item ? item.image : "/images/castrol.png"}
              fill
              alt="Autoheads editorial artwork"
            />
          </div>
        )}
        <article className="long-copy">
          {"author" in item && item.author && (
            <p>
              <b>By {item.author}</b>
            </p>
          )}
          {item.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
        <Link
          className="article-utility"
          href={isTip ? "/list-motoring-tips" : "/list-posts"}
        >
          Continue exploring <b>{isTip ? "motoring tips" : "Autoheads news"}</b>
          <ArrowRight />
        </Link>
      </main>
    </SiteShell>
  );
}
