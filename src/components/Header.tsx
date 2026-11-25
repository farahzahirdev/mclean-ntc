"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowIcon, MenuIcon, PhoneIcon, XIcon } from "@/components/Icons";
import {
  BOOK_HREF,
  FORM_SECTION_ID,
  LOGO_URL,
  NAV_LINKS,
  PHONE_HREF,
  PHONE_NUMBER,
  SITE_NAME,
} from "@/lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
      >
        <div className="header-bar">
          <a
            href="#top"
            className="header-logo"
            aria-label={`${SITE_NAME} home`}
            onClick={close}
          >
            <Image
              src={LOGO_URL}
              alt={SITE_NAME}
              width={414}
              height={92}
              priority
            />
          </a>

          <nav className="header-nav" aria-label="Page sections">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a href={PHONE_HREF} className="header-phone">
              <PhoneIcon className="icon-sm" />
              <span>{PHONE_NUMBER}</span>
            </a>
            <a href={BOOK_HREF} className="btn btn-navy btn-sm header-book">
              <span>Book Free Consultation</span>
            </a>
            <button
              type="button"
              className="header-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <XIcon className="icon-md" />
              ) : (
                <MenuIcon className="icon-md" />
              )}
            </button>
          </div>
        </div>

        <div id="mobile-menu" className="mobile-menu" hidden={!open}>
          <nav aria-label="Page sections">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mobile-menu-actions">
            <a href={BOOK_HREF} className="btn btn-amber" onClick={close}>
              <span>Book your Free Consultation</span>
              <ArrowIcon className="btn-arrow" />
            </a>
            <a href={PHONE_HREF} className="btn btn-outline" onClick={close}>
              <PhoneIcon className="btn-icon" />
              <span>Call {PHONE_NUMBER}</span>
            </a>
            <a
              href={`#${FORM_SECTION_ID}`}
              className="text-cta"
              onClick={close}
            >
              <span>Find out if you Qualify</span>
              <ArrowIcon className="btn-arrow" />
            </a>
          </div>
        </div>
      </header>
      {open ? (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Close menu"
          onClick={close}
        />
      ) : null}
    </>
  );
}
