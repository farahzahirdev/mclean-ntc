import Reveal from "@/components/Reveal";
import { BookButton, CallButton, QualifyLink } from "@/components/CTAButtons";

export default function FinalCta() {
  return (
    <section className="final">
      <div className="final-bg" aria-hidden="true" />
      <div className="wrap">
        <Reveal className="final-inner">
          <p className="eyebrow eyebrow-light">Whenever you&rsquo;re ready</p>
          <h2>You haven&rsquo;t run out of options.</h2>
          <p className="lead">
            Tell us what you&rsquo;ve been through. We&rsquo;ll listen, check
            your insurance, and explain honestly what could help. The first
            conversation is free, with no obligation to start treatment.
          </p>
          <div className="final-ctas">
            <BookButton variant="amber" className="btn-lg" />
            <CallButton variant="outline-light" className="btn-lg" />
          </div>
          <QualifyLink light />
        </Reveal>
      </div>
    </section>
  );
}
