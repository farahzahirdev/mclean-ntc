import Image from "next/image";
import { BookButton, CallButton, QualifyLink } from "@/components/CTAButtons";
import {
  ArrowIcon,
  ChartIcon,
  CheckIcon,
  ClockIcon,
  ShieldIcon,
  TargetIcon,
  WaveIcon,
} from "@/components/Icons";
import {
  BOOK_HREF,
  HERO_CHIPS,
  IMAGES,
  SITE_SHORT,
  TEAM,
  TRUST_ITEMS,
} from "@/lib/constants";

const ICONS = {
  shield: ShieldIcon,
  target: TargetIcon,
  clock: ClockIcon,
  chart: ChartIcon,
  wave: WaveIcon,
  check: CheckIcon,
} as const;

const PHOTO_ALT = "A woman smiling, seated in an armchair in a bright room.";

function Photo() {
  return (
    <Image
      quality={100}
      src={IMAGES.hero}
      alt={PHOTO_ALT}
      fill
      priority
      sizes="(max-width: 960px) 100vw, 720px"
      placeholder="blur"
      className="hx-photo"
    />
  );
}

function Avatars() {
  return (
    <span className="hx-avatars" aria-hidden="true">
      {TEAM.slice(0, 4).map((person) => (
        <span key={person.name}>
          <Image src={person.image} alt="" fill sizes="120px" quality={95} />
        </span>
      ))}
    </span>
  );
}

function PhotoTile({ className = "" }: { className?: string }) {
  return (
    <div className={`hx-tile hx-tile-photo ${className}`.trim()}>
      <Photo />
      <span className="hx-tile-tag">Accepting new patients</span>
    </div>
  );
}

function BookTile({ className = "" }: { className?: string }) {
  return (
    <a href={BOOK_HREF} className={`hx-tile hx-tile-book ${className}`.trim()}>
      <span className="hx-tile-kicker">Free consultation</span>
      <strong>No obligation to start treatment.</strong>
      <span className="hx-tile-arrow">
        <ArrowIcon className="icon-sm" />
      </span>
    </a>
  );
}

function ClinicTile({ className = "", tag = true }: { className?: string; tag?: boolean }) {
  return (
    <div className={`hx-tile hx-tile-clinic ${className}`.trim()}>
      <Image
        src={IMAGES.reception}
        alt="The waiting area at McLean NTC."
        fill
        sizes="(max-width: 960px) 100vw, 640px"
        quality={95}
        placeholder="blur"
        className="hx-photo"
      />
      {tag ? <span className="hx-tile-tag">Our McLean clinic</span> : null}
    </div>
  );
}

function TeamTile() {
  return (
    <div className="hx-tile hx-tile-team">
      <Avatars />
      <span>
        <strong>Board-certified clinicians</strong>
        Psychiatrist-led · Georgetown training site
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="hx"
      aria-labelledby="hero-heading"
    >
      <span className="hx-bg" aria-hidden="true" />
      <div className="wrap hx-grid">
        <div className="hx-copy">
          <p className="hx-tagline">
            <span className="hx-tagline-dot" />
            Offering hope for depression · McLean, Virginia
          </p>

          <h1 id="hero-heading">
            Tried treatment after treatment?{" "}
            <em>There is more we can do.</em>
          </h1>

          <p className="hx-lead">
            Advanced, psychiatrist-led care for treatment-resistant depression:
            TMS, Spravato and ketamine under one roof. It starts with a free,
            no-obligation consultation.
          </p>

          <ul className="hx-chips" aria-label="What to expect">
            {HERO_CHIPS.map((chip) => {
              const Icon = ICONS[chip.icon];
              return (
                <li key={chip.label}>
                  <Icon className="icon-sm" />
                  {chip.label}
                </li>
              );
            })}
          </ul>

          <div className="hx-ctas">
            <BookButton variant="navy" />
            <CallButton variant="outline" />
          </div>
          <div className="hx-secondary">
            <QualifyLink />
          </div>
        </div>

        <div className="hx-visual hx-bento">
          <PhotoTile />
          <BookTile />
          <ClinicTile />
          <TeamTile />
        </div>
      </div>

      <div className="wrap">
        <ul className="hx-trust" aria-label={`Why ${SITE_SHORT}`}>
          {TRUST_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.title}>
                <span className="hx-trust-icon">
                  <Icon className="icon-md" />
                </span>
                <div>
                  <p className="trust-title">{item.title}</p>
                  <p className="trust-subtitle">{item.subtitle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
