import Image from "next/image";
import Reveal from "@/components/Reveal";
import { BookButton, CallButton } from "@/components/CTAButtons";
import {
  ChartIcon,
  CheckIcon,
  ClockIcon,
  ShieldIcon,
  TargetIcon,
  WaveIcon,
} from "@/components/Icons";
import {
  FOUNDER,
  SITE_SHORT,
  TEAM,
  TEAM_SECTION_ID,
  WHY_POINTS,
  WHY_SECTION_ID,
} from "@/lib/constants";

const ICONS = {
  shield: ShieldIcon,
  target: TargetIcon,
  clock: ClockIcon,
  chart: ChartIcon,
  wave: WaveIcon,
  check: CheckIcon,
} as const;

export default function Why() {
  return (
    <section id={WHY_SECTION_ID} className="section why">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">Why {SITE_SHORT}</p>
          <h2>Specialists in depression that hasn&rsquo;t responded to treatment.</h2>
          <p className="lead">
            This is what our practice is built around: experienced clinicians,
            several proven treatments in one place, and time to explain them
            properly.
          </p>
        </Reveal>

        <ul className="why-grid">
          {WHY_POINTS.map((point, index) => {
            const Icon = ICONS[point.icon];
            return (
              <li key={point.title}>
                <Reveal delay={((index % 3) + 1) as 1 | 2 | 3} className="why-card">
                  <span className="why-icon">
                    <Icon className="icon-md" />
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div className="doctor founder">
          <Reveal className="doctor-media">
            <div className="doctor-photo">
              <Image
                quality={95}
                src={FOUNDER.image}
                alt={`${FOUNDER.name}, founder and medical director of ${SITE_SHORT}.`}
                sizes="(max-width: 960px) 100vw, 520px"
                placeholder="blur"
              />
            </div>
            <div className="doctor-badge">
              <strong>Duke</strong>
              TMS fellowship
            </div>
          </Reveal>

          <Reveal delay={2} className="doctor-copy">
            <p className="eyebrow">Meet our medical director</p>
            <h3 className="founder-name">{FOUNDER.name}</h3>
            <p className="doctor-name">{FOUNDER.role}</p>
            <p className="lead">
              Dr. Haq specializes in treatment-resistant depression and complex
              mood disorders. He founded {SITE_SHORT} to bring TMS, esketamine
              and ketamine together in one psychiatrist-led clinic.
            </p>
            <ul className="check-list">
              {FOUNDER.credentials.map((item) => (
                <li key={item}>
                  <span className="mark mark-yes">
                    <CheckIcon className="icon-xs" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="cta-row">
              <BookButton variant="navy" />
              <CallButton variant="outline" />
            </div>
          </Reveal>
        </div>

        <div id={TEAM_SECTION_ID} className="team">
          <Reveal className="team-head">
            <p className="eyebrow">Our clinicians</p>
            <h3>Experienced clinicians. Compassionate care.</h3>
          </Reveal>
          <ul className="team-grid">
            {TEAM.slice(1).map((person, index) => (
              <li key={person.name}>
                <Reveal delay={((index % 4) + 1) as 1 | 2 | 3 | 4} className="team-card">
                  <div className="team-photo">
                    <Image
                      quality={95}
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(max-width: 640px) 60vw, 360px"
                      placeholder="blur"
                      style={{ objectPosition: person.position }}
                    />
                  </div>
                  <p className="team-name">{person.name}</p>
                  <p className="team-role">{person.role}</p>
                  <p className="team-note">{person.note}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
