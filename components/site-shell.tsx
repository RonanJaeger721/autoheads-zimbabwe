'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Menu, UserRound, X } from 'lucide-react';
import { useState } from 'react';
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="site">
      <header className="community-nav">
        <div className="nav-edition">Zimbabwe / Motoring community</div>
        <Link href="/" className="community-brand" aria-label="Autoheads home">
          <Image
            src="/images/autoheads-logo.png"
            alt="Autoheads — Your Digital Motoring Community"
            width={200}
            height={64}
            priority
          />
        </Link>
        <nav className="community-links" aria-label="Main navigation">
          <Link href="/list-makes">
            <span>01</span>Cars
          </Link>
          <Link href="/list-shops">
            <span>02</span>Spares
          </Link>
          <Link href="/list-mechanics">
            <span>03</span>Mechanics
          </Link>
          <Link href="/list-workshops">
            <span>04</span>Workshops
          </Link>
          <Link href="/list-posts">
            <span>05</span>Stories
          </Link>
        </nav>
        <div className="community-actions">
          <Link className="join-link" href="/register">
            Join community <ArrowUpRight />
          </Link>
          <Link className="login-link" href="/login" aria-label="Login">
            <UserRound size={17} />
            <span>Login</span>
          </Link>
          <button className="menu-button" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="community-mobile" aria-label="Mobile navigation">
            <small>EXPLORE AUTOHEADS</small>
            <Link href="/list-makes">Cars</Link>
            <Link href="/list-shops">Spares</Link>
            <Link href="/list-mechanics">Mechanics</Link>
            <Link href="/list-workshops">Workshops</Link>
            <Link href="/list-posts">News</Link>
            <Link href="/list-motoring-tips">Motoring Tips</Link>
            <Link href="/verified">Verified</Link>
            <Link href="/about">About</Link>
            <div>
              <Link href="/login">Login</Link>
              <Link href="/register">Sign up</Link>
              <Link href="/apply">Apply</Link>
            </div>
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
