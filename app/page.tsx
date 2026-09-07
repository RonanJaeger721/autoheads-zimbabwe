"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CarFront,
  MapPinned,
  Wrench,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SiteShell, SectionHead } from "@/components/site-shell";
import { GlobalSearch } from "@/components/global-search";
import { CurvedBadge } from "@/components/curved-badge";
import { vehicles, posts, shops, categories } from "@/lib/autoheads-data";
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: {
    duration: 0.65,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};
export default function Home() {
  const { scrollYProgress } = useScroll();
  const carX = useTransform(scrollYProgress, [0.14, 0.48], ["7%", "-3%"]);
  return (
    <SiteShell>
      <main className="fluid-home">
        <section className="hero hero-v2">
          <motion.div
            className="hero-media"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <Image
              src="/images/hilux-road.webp"
              fill
              priority
              alt="Silver pickup travelling on an African road"
            />
          </motion.div>
          <div className="hero-shade" />
          <div className="road-orbit" />
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span>AUTOHEADS ZIMBABWE</span>
            <h1>
              <i>Know your car.</i>
              <br />
              <em>Find what it needs.</em>
            </h1>
            <p>
              Zimbabwe’s vehicle knowledge, spares, mechanics and motoring
              culture—connected.
            </p>
          </motion.div>
          <motion.div
            className="hero-ring"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            <CurvedBadge />
          </motion.div>
          <motion.div
            className="hero-search"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <GlobalSearch />
            <div className="quick-links">
              {[
                ["Vehicles", "/list-makes"],
                ["Find spares", "/list-shops"],
                ["Mechanics", "/list-mechanics"],
                ["Motoring", "/list-posts"],
              ].map(([x, h]) => (
                <Link href={h} key={x}>
                  {x}
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
        <section className="discovery section fluid-discovery">
          <motion.div {...reveal}>
            <SectionHead
              kicker="01 / CHOOSE YOUR ROUTE"
              title="One road. Four ways in."
            />
          </motion.div>
          <div className="discovery-orbit">
            {[
              [
                CarFront,
                "A vehicle",
                "Understand your next car.",
                "/list-makes",
              ],
              [Wrench, "A spare", "Find the right supplier.", "/list-shops"],
              [
                MapPinned,
                "A mechanic",
                "Get expert help nearby.",
                "/list-mechanics",
              ],
              [BookOpen, "Advice", "Learn from the garage.", "/list-posts"],
            ].map(([Icon, title, copy, href], i) => {
              const I = Icon as typeof CarFront;
              return (
                <motion.div
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.08 }}
                  className={`orbit-item orbit-${i + 1}`}
                  key={title as string}
                >
                  <Link href={href as string}>
                    <span>0{i + 1}</span>
                    <I />
                    <h3>{title as string}</h3>
                    <p>{copy as string}</p>
                    <ArrowRight />
                  </Link>
                </motion.div>
              );
            })}
            <div className="orbit-line" />
          </div>
        </section>
        <section className="showroom">
          <div className="showroom-word">HILUX</div>
          <motion.div className="showroom-copy" {...reveal}>
            <span>02 / FEATURED VEHICLE</span>
            <h2>
              Built for the
              <br />
              road ahead.
            </h2>
            <p>{vehicles[0].intro}</p>
            <Link href="/vehicle/1/6">
              Explore guide <ArrowRight />
            </Link>
          </motion.div>
          <motion.div className="cutout-car" style={{ x: carX }}>
            <Image
              src="/images/pickup-cutout-v2.png"
              fill
              alt="Silver double-cab utility pickup"
            />
          </motion.div>
          <div className="vehicle-hud">
            <small>MODEL</small>
            <b>TOYOTA HILUX</b>
            <small>GUIDE</small>
            <b>AVAILABLE</b>
          </div>
          <div className="showroom-badge">
            <CurvedBadge text="VIEW VEHICLE GUIDE · AUTOHEADS · ZIMBABWE ·" />
          </div>
          <div className="vehicle-selector">
            {vehicles.slice(0, 5).map((v, i) => (
              <Link
                className={i === 0 ? "active" : ""}
                key={v.id}
                href={`/vehicle/${v.makeId}/${v.id}`}
              >
                <span>0{i + 1}</span>
                {v.name}
              </Link>
            ))}
          </div>
        </section>
        <section className="spares-flow">
          <div className="spares-arc" />
          <motion.div className="spares-copy" {...reveal}>
            <span>03 / FIND WHAT FITS</span>
            <h2>
              Parts discovery,
              <br />
              <i>without the runaround.</i>
            </h2>
            <p>
              Search audited supplier listings, then call or get directions
              directly.
            </p>
          </motion.div>
          <div className="part-search">
            <span>WHAT PART DO YOU NEED?</span>
            <Link href="/list-shops">
              Search the directory <ArrowRight />
            </Link>
          </div>
          <div className="category-marquee">
            <div>
              {[...categories.slice(4, 21), ...categories.slice(4, 21)].map(
                (c, i) => (
                  <span key={`${c}${i}`}>
                    {c}
                    <b>•</b>
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="supplier-flow">
            {shops.slice(0, 4).map((s, i) => (
              <Link href="/list-shops" key={s.name}>
                <span>0{i + 1}</span>
                <b>{s.name}</b>
                <small>{s.tags.join(" · ")}</small>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </section>
        <section className="editorial editorial-v2">
          <motion.div {...reveal}>
            <SectionHead kicker="04 / FROM THE GARAGE" title="Read the road." />
          </motion.div>
          <div className="article-mosaic">
            {posts.map((p, i) => (
              <motion.div
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.12 }}
                className={i === 0 ? "feature-story" : "side-story"}
                key={p.id}
              >
                <Link href={`/view-${p.id}`}>
                  <div className="story-image">
                    <Image
                      src={p.image}
                      fill
                      alt="Automotive lubricant editorial artwork"
                    />
                  </div>
                  <small>{p.category}</small>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span>
                    Read article <ArrowRight />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="topic-track">
            <div>
              MAINTENANCE <b>•</b> ENGINE OIL <b>•</b> BRAKES <b>•</b>{" "}
              SUSPENSION <b>•</b> TYRES <b>•</b> SPARES <b>•</b> VEHICLE GUIDES{" "}
              <b>•</b>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
