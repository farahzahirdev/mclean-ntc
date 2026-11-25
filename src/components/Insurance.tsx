import Image from "next/image";
import Reveal from "@/components/Reveal";
import { BookButton, QualifyButton } from "@/components/CTAButtons";
import { CheckIcon, ShieldIcon } from "@/components/Icons";
import {
  COVERAGE,
  INSURANCE_SECTION_ID,
  INSURANCE_STEPS,
  INSURERS,
} from "@/lib/constants";

function LogoRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="ins-logos" aria-hidden={hidden || undefined}>
      {INSURERS.map((insurer) => (
        <li key={insurer.name}>
          <Image
            src={insurer.logo}
            alt={hidden ? "" : insurer.name}
            unoptimized
          />
        </li>
      ))}
    </ul>
  );
}

export default function Insurance() {
  return (
    <section id={INSURANCE_SECTION_ID} className="section section-mist ins">
      <div className="wrap">
        <Reveal className="ins-head">
          <p className="eyebrow">Insurance and eligibility</p>
          <h2>We accept most major plans, and it costs nothing to find out.</h2>
          <p className="lead">
            Medicare, Virginia Medicaid, Tricare and many commercial plans are
            accepted. There is no commitment to start: the first step is a free
            consultation.
          </p>
        </Reveal>
      </div>

      <Reveal className="ins-marquee">
        <div className="ins-track">
          <LogoRow />
          <LogoRow hidden />
        </div>
      </Reveal>

      <div className="wrap ins-grid">
        <Reveal className="ins-steps">
          <span className="ins-steps-glow" aria-hidden="true" />
          <p className="ins-kicker">How it works</p>
          <h3>Three steps, no pressure.</h3>
          <ol>
            {INSURANCE_STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="ins-num">{index + 1}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <BookButton variant="white" />
        </Reveal>

        <Reveal delay={2} className="ins-cover">
          <div className="ins-cover-head">
            <span className="plans-icon">
              <ShieldIcon className="icon-md" />
            </span>
            <div>
              <h3>What each treatment costs</h3>
              <p>Every plan is different, so we check yours specifically.</p>
            </div>
          </div>

          <ul className="ins-cover-list">
            {COVERAGE.map((item) => {
              const covered = item.note.startsWith("Usually");
              return (
                <li key={item.name}>
                  <span className={`ins-mark${covered ? "" : " ins-mark-pay"}`}>
                    {covered ? <CheckIcon className="icon-xs" /> : "$"}
                  </span>
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.note}</p>
                  </div>
                  <span className={`ins-chip${covered ? "" : " ins-chip-pay"}`}>
                    {covered ? "Insurance" : "Self-pay"}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="ins-note">
            Don&rsquo;t see your plan? Send us your details and we will check
            for you. A benefits check isn&rsquo;t a guarantee of payment. Your
            insurer makes the final decision.
          </p>
          <QualifyButton variant="navy" className="btn-block" />
        </Reveal>
      </div>
    </section>
  );
}
