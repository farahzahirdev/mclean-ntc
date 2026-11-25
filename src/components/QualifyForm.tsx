"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import { ClockIcon, PhoneIcon } from "@/components/Icons";
import {
  FORM_HEIGHT,
  FORM_ID,
  FORM_IFRAME_ID,
  FORM_NAME,
  FORM_SECTION_ID,
  HOURS_LABEL,
  PHONE_HREF,
  PHONE_NUMBER,
} from "@/lib/constants";
import { mountAndBindGhlForm, unmountGhlEmbed } from "@/lib/ghlEmbed";

const FORM_MIN_HEIGHT = "900px";

const STEPS = [
  "Share a few details about you and what you’ve tried",
  "Our team reviews your answers and checks your insurance",
  "We call you to talk through your options",
] as const;

export default function QualifyForm() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const unbind = mountAndBindGhlForm(host, {
      id: FORM_ID,
      name: FORM_NAME,
      height: FORM_HEIGHT,
      iframeId: FORM_IFRAME_ID,
      minHeight: FORM_MIN_HEIGHT,
      borderRadius: "14px",
    });

    const iframe = host.querySelector("iframe");
    if (iframe) {
      iframe.setAttribute("data-cookie-consent", "true");
      iframe.setAttribute("data-cookie-consent-provider", "auto");
    }

    return () => {
      unbind();
      unmountGhlEmbed(host);
    };
  }, []);

  return (
    <section
      id={FORM_SECTION_ID}
      className="section section-mist embed-section"
    >
      <div className="wrap embed-layout">
        <Reveal className="embed-copy">
          <p className="eyebrow">Get started</p>
          <h2>Find out if you Qualify</h2>
          <p className="lead">
            Answer a few quick questions and our team will follow up about
            eligibility, insurance coverage, and which treatment may be a fit
            for you.
          </p>

          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step}>
                <span className="steps-num">{index + 1}</span>
                <div>
                  <p className="steps-line">{step}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="embed-private">
            Private and confidential. Takes about two minutes.
          </p>

          <ul className="contact-list">
            <li>
              <a href={PHONE_HREF} className="contact-item">
                <span className="contact-icon">
                  <PhoneIcon className="icon-sm" />
                </span>
                <span>
                  <span className="contact-label">Prefer to talk first?</span>
                  <span className="contact-value">{PHONE_NUMBER}</span>
                </span>
              </a>
            </li>
            <li>
              <div className="contact-item">
                <span className="contact-icon">
                  <ClockIcon className="icon-sm" />
                </span>
                <span>
                  <span className="contact-label">Clinic hours</span>
                  <span className="contact-value">{HOURS_LABEL}</span>
                </span>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={2} className="embed-panel">
          <div
            ref={hostRef}
            className="embed-host"
            style={{ minHeight: FORM_MIN_HEIGHT }}
            aria-label="Qualification form"
          />
        </Reveal>
      </div>
    </section>
  );
}
