import Image from "next/image";
import AtlasStage from "@/components/AtlasStage";
import { CheckIcon } from "@/components/Icons";
import { BookButton, QualifyButton } from "@/components/CTAButtons";
import { KETAMINE_STEPS, TMS_STEPS } from "@/lib/atlasSteps";
import { IMAGES, SERVICES } from "@/lib/constants";
import Reveal from "@/components/Reveal";

/** How each medicine is given: nasal spray, IV drip, injection. */
const ROUTE_ART: Record<string, { label: string; art: React.ReactNode }> = {
  tms: {
    label: "Magnetic coil",
    art: (
      <>
        <circle cx="16" cy="19" r="8" />
        <circle cx="32" cy="19" r="8" />
        <circle cx="16" cy="19" r="3" />
        <circle cx="32" cy="19" r="3" />
        <path d="M24 26v8" />
        <path d="M17 38a9 9 0 0 0 14 0" />
        <path d="M13 43a15 15 0 0 0 22 0" />
      </>
    ),
  },
  spravato: {
    label: "Nasal spray",
    art: (
      <>
        <rect x="17" y="26" width="14" height="17" rx="4" />
        <path d="M20 26v-5h8v5" />
        <path d="M22 21v-7a2 2 0 0 1 4 0v7" />
        <path d="M17 33h14" />
        <path d="M24 8V5M17.5 10l-2-2.5M30.5 10l2-2.5" />
      </>
    ),
  },
  "iv-ketamine": {
    label: "IV infusion",
    art: (
      <>
        <path d="M24 4v4" />
        <path d="M17 8h14v13a7 7 0 0 1-14 0z" />
        <path d="M17 16h14" />
        <path d="M24 28v3" />
        <rect x="21.5" y="31" width="5" height="6" rx="1.5" />
        <path d="M24 37v2a4 4 0 0 0 4 4h6" />
        <path d="M24 33.5v.5" />
      </>
    ),
  },
  "im-ketamine": {
    label: "Injection",
    art: (
      <>
        <path d="M29 7l12 12" />
        <path d="M32 10 14 28l6 6 18-18" />
        <path d="M17 31l-6 6M11 37l-5 5" />
        <path d="M22 20l3 3M26 16l3 3" />
        <path d="M38 4l6 6" />
      </>
    ),
  },
};

type Cover = NonNullable<React.ComponentProps<typeof AtlasStage>["cover"]>;

/** What each row shows beside its copy. */
const VISUALS: Record<
  string,
  { title: string; scene?: "tms" | "ketamine"; cover?: Cover }
> = {
  tms: {
    title: "From the chair to inside the brain",
    scene: "tms",
    cover: {
      image: IMAGES.tmsSession,
      alt: "A woman resting in a treatment chair while a clinician positions a TMS coil against her head.",
      tag: "A TMS session",
      title: "What a session looks like",
      body: "You sit in a chair, fully awake, while a magnetic coil rests against your head. Now look inside: this is what the pulses do in the brain.",
      at: "58% 33%",
      position: "50% 50%",
    },
  },
  spravato: {
    title: "From the spray to inside the brain",
    scene: "ketamine",
    cover: {
      image: IMAGES.spravatoSession,
      alt: "A woman holding a Spravato nasal spray device to her nose.",
      tag: "Spravato nasal spray",
      title: "A nasal spray, taken in our clinic",
      body: "You take the spray yourself while our team looks after you. Now look inside: this is how the medicine acts in the brain.",
      at: "62% 38%",
      position: "50% 50%",
    },
  },
  "iv-ketamine": {
    title: "What an infusion looks like",
    cover: {
      image: IMAGES.ivSession,
      alt: "A woman resting in a treatment chair while a clinician checks the IV line in her arm.",
      tag: "An IV ketamine infusion",
      title: "A slow infusion while you rest",
      body: "The medicine is given through a small IV in your arm, with a clinician beside you the whole time. It acts in the brain the same way as Spravato, shown above.",
      at: "62% 86%",
      position: "50% 50%",
    },
  },
  "im-ketamine": {
    title: "What an injection looks like",
    cover: {
      image: IMAGES.imSession,
      alt: "A clinician giving an injection into a patient's upper arm.",
      tag: "An IM ketamine injection",
      title: "One injection, no IV line",
      body: "The medicine is given as an injection into a muscle, with a clinician monitoring you. It is the same medicine as IV ketamine, without the IV line.",
      at: "50% 51%",
      position: "50% 50%",
    },
  },
};

/** One full row per treatment; nothing to click. The 3D models play on their own. */
export default function TreatmentRows() {
  return (
    <div className="tx">
      {SERVICES.map((service, index) => {
        const visual = VISUALS[service.id];
        const route = ROUTE_ART[service.id];
        return (
          <Reveal
            key={service.id}
            className={`tx-row${index % 2 ? " tx-row-flip" : ""}`}
          >
            <div className="tx-stage">
              <p className="tx-stage-title">{visual.title}</p>
              {visual.scene ? (
                <AtlasStage
                  scene={visual.scene}
                  steps={visual.scene === "tms" ? TMS_STEPS : KETAMINE_STEPS}
                  poster={visual.scene === "tms" ? IMAGES.tms : IMAGES.brain}
                  posterAlt={
                    visual.scene === "tms"
                      ? "3D model of the head and brain showing where the TMS coil sits."
                      : "3D model of the brain showing where ketamine and esketamine act."
                  }
                  cover={visual.cover}
                />
              ) : (
                <figure className="tx-photo">
                  <div className="tx-figure">
                    <Image
                      src={visual.cover?.image ?? service.image}
                      alt={visual.cover?.alt ?? service.imageAlt}
                      fill
                      quality={100}
                      sizes="(max-width: 960px) 100vw, 800px"
                      placeholder="blur"
                    />
                    {visual.cover ? (
                      <span className="atlas-cover-tag">{visual.cover.tag}</span>
                    ) : null}
                  </div>
                  {visual.cover ? (
                    <figcaption>
                      <h4>{visual.cover.title}</h4>
                      <p>{visual.cover.body}</p>
                    </figcaption>
                  ) : null}
                </figure>
              )}
            </div>

            <div id={service.id} className="tx-copy">
              <span className="explorer-badge">{service.badge}</span>
              <p className="eyebrow">{service.eyebrow}</p>
              <div className="tx-heading">
                {route ? (
                  <span className="tx-route" title={route.label}>
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {route.art}
                    </svg>
                  </span>
                ) : null}
                <h3>
                  {service.title}
                  <span className="service-full">{service.fullName}</span>
                </h3>
              </div>
              <p className="service-desc">{service.description}</p>
              <ul className="service-points">
                {service.points.map((point) => (
                  <li key={point}>
                    <span className="mark mark-yes">
                      <CheckIcon className="icon-xs" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <dl className="service-facts">
                {service.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="service-actions">
                <QualifyButton variant="navy" />
                <BookButton variant="outline" />
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
