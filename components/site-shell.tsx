"use client";
import Link from "next/link";
import Image from "next/image";
import { BriefcaseBusiness, Menu, Search, X } from "lucide-react";
import { useState } from "react";
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="site">
      <header className="nav-shell">
        <Link href="/" className="brand" aria-label="Autoheads home">
          <Image
            src="/images/autoheads-logo.png"
            alt="Autoheads — Your Digital Motoring Community"
            width={200}
            height={64}
          />
        </Link>
        <nav className="desktop-nav">
          <Link href="/cars">Cars</Link>
          <Link href="/list-shops">Spares</Link>
          <Link href="/list-mechanics">Mechanics</Link>
          <Link href="/workshops">Workshops</Link>
          <Link href="/motoring">Motoring</Link>
          <Link href="/verified">Verified</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/#search" aria-label="Search">
            <Search size={19} />
          </Link>
          <Link className="business-login" href="/login" aria-label="Business login">
            <BriefcaseBusiness size={18} /><span>Business login</span>
          </Link>
          <button className="menu-button" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="mobile-nav">
            <Link href="/cars">Cars</Link>
            <Link href="/list-shops">Spares</Link>
            <Link href="/list-mechanics">Mechanics</Link>
            <Link href="/workshops">Workshops</Link>
            <Link href="/motoring">Motoring</Link>
            <Link href="/verified">Verified</Link>
            <Link href="/about">About</Link>
            <Link href="/login">Business login</Link>
            <Link href="/register">Register a business</Link>
          </nav>
        )}
      </header>
      {children}
      <footer>
        <div>
          <Image
            src="/images/autoheads-logo.png"
            alt="Autoheads — Your Digital Motoring Community"
            width={200}
            height={64}
          />
          <p>
            Zimbabwe’s digital motoring community.
            <br />
            Cars · Spares · Mechanics · People
          </p>
        </div>
        <div>
          <b>Cars</b>
          <Link href="/list-makes">Makes</Link>
          <Link href="/cars#guides">Vehicle guides</Link>
        </div>
        <div>
          <b>Find</b>
          <Link href="/list-shops">Spares</Link>
          <Link href="/list-mechanics">Mechanics</Link>
          <Link href="/workshops">Workshops</Link>
          <Link href="/motoring">Motoring</Link>
          <Link href="/verified">Verified</Link>
          <Link href="/about">About</Link>
        </div>
        <div>
          <b>For businesses</b>
          <Link href="/login">Business login</Link>
          <Link href="/register">Create business account</Link>
          <Link href="/apply">List your business</Link>
        </div>
      </footer>
    </div>
  );
}
export function SectionHead({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="section-head">
      <span>{kicker}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}
