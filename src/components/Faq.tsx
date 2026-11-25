"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { CallButton } from "@/components/CTAButtons";
import { PlusIcon } from "@/components/Icons";
import { FAQS, FAQ_SECTION_ID, IMAGES } from "@/lib/constants";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={FAQ_SECTION_ID} className="section">
      <div className="wrap faq">
        <Reveal className="faq-head">
          <p className="eyebrow">Common questions</p>
          <h2>Questions people ask before they start.</h2>
          <p className="lead">
            Still unsure? Call us. A real person will talk it through with you,
            with no pressure.
          </p>
          <CallButton variant="outline" />
          <figure className="faq-photo">
            <Image
              src={IMAGES.frontDesk}
              alt="The front desk at McLean Neuropsychiatric Treatment Center, with the clinic logo on a blue wall."
              fill
              quality={100}
              sizes="(max-width: 900px) 100vw, 560px"
              placeholder="blur"
            />
            <figcaption>Our front desk in McLean</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={2} className="faq-list">
          {FAQS.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.q} className={`faq-item${open ? " is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${index}`}
                    className="faq-q"
                    aria-expanded={open}
                    aria-controls={`faq-a-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-plus">
                      <PlusIcon className="icon-sm" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${index}`}
                  className="faq-a"
                  role="region"
                  aria-labelledby={`faq-q-${index}`}
                  inert={!open}
                >
                  <div className="faq-a-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
