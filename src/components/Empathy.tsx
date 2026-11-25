import Reveal from "@/components/Reveal";
import { QualifyLink } from "@/components/CTAButtons";
import { EMPATHY_POINTS } from "@/lib/constants";

export default function Empathy() {
  return (
    <section className="section empathy" aria-labelledby="empathy-heading">
      <div className="wrap empathy-grid">
        <Reveal className="empathy-copy">
          <p className="eyebrow">If this sounds like you</p>
          <h2 id="empathy-heading">
            You have tried. It still hasn&rsquo;t lifted. That is exactly who we
            are here for.
          </h2>
          <p className="lead">
            Many of the people who come to us have been through several
            medications and years of trying. We start by listening, then explain
            in plain language what else is possible.
          </p>
          <QualifyLink />
        </Reveal>

        <ol className="empathy-list">
          {EMPATHY_POINTS.map((point, index) => (
            <li key={point.title}>
              <Reveal delay={(index + 1) as 1 | 2 | 3} className="empathy-card">
                <span className="empathy-num">0{index + 1}</span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
