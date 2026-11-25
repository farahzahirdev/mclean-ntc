import insAetna from "../../public/images/insurance/aetna.svg";
import insAnthem from "../../public/images/insurance/anthem.png";
import insBcbs from "../../public/images/insurance/bcbs.png";
import insCigna from "../../public/images/insurance/cigna.svg";
import insJohns from "../../public/images/insurance/johns.png";
import insMedicaid from "../../public/images/insurance/medicaid.png";
import insMedicare from "../../public/images/insurance/medicare.png";
import insOptum from "../../public/images/insurance/optum.svg";
import insTricare from "../../public/images/insurance/tricare.svg";
import insUnited from "../../public/images/insurance/united.svg";
import heroImg from "../../public/images/hero-portrait.webp";
import heroWideImg from "../../public/images/hero.webp";
import receptionImg from "../../public/images/reception.webp";
import tmsImg from "../../public/images/tms-1.webp";
import tmsSessionImg from "../../public/images/tms-session.webp";
import spravatoSessionImg from "../../public/images/spravato-session.webp";
import ivSessionImg from "../../public/images/iv-ketamine-session.webp";
import frontDeskImg from "../../public/images/front-desk.webp";
import imSessionImg from "../../public/images/im-ketamine-session.webp";
import brainImg from "../../public/images/ketamine-1.webp";
import synapseImg from "../../public/images/ketamine-card.webp";
import haqImg from "../../public/images/team/haq.jpg";
import alamImg from "../../public/images/team/alam.jpg";
import kilmerImg from "../../public/images/team/kilmer.jpg";
import woodImg from "../../public/images/team/wood.jpg";
import roseImg from "../../public/images/team/rose.jpg";

export const SITE_NAME = "McLean Neuropsychiatric Treatment Center";
export const SITE_SHORT = "McLean NTC";
export const SITE_URL = "https://www.mcleanntc.com";

export const LOGO_URL = "/images/logo.png";
export const LOGO_LIGHT_URL = "/images/logo-dark.png";

/**
 * Imported (not referenced by path) so every image URL carries a content hash.
 * All photos and illustrations come from mcleanntc.com.
 */
export const IMAGES = {
  hero: heroImg,
  heroWide: heroWideImg,
  reception: receptionImg,
  tms: tmsImg,
  /** Photo supplied by the client (not from mcleanntc.com). */
  tmsSession: tmsSessionImg,
  spravatoSession: spravatoSessionImg,
  ivSession: ivSessionImg,
  imSession: imSessionImg,
  frontDesk: frontDeskImg,
  brain: brainImg,
  synapse: synapseImg,
} as const;

export const BOOKING_SECTION_ID = "book";
export const FORM_SECTION_ID = "qualify";
export const SERVICES_SECTION_ID = "treatments";
export const WHY_SECTION_ID = "why-mclean";
export const TEAM_SECTION_ID = "team";
export const INSURANCE_SECTION_ID = "insurance";
export const REVIEWS_SECTION_ID = "reviews";
export const FAQ_SECTION_ID = "faq";
export const VISIT_SECTION_ID = "visit";

/** Every "Book your Free Consultation" button scrolls to the on-page calendar. */
export const BOOK_HREF = `#${BOOKING_SECTION_ID}`;

export const FORM_ID = "U1HKvzd4sZlIWHr0B7HL";
export const FORM_IFRAME_ID = "inline-U1HKvzd4sZlIWHr0B7HL";
export const FORM_NAME = "TMS: New Web Inquiry + Params";
export const FORM_HEIGHT = "2082";

export const CALENDAR_ID = "IxPaWNxnu3WEByRtV5ms";
/** Must start with a letter: form_embed.js builds a CSS selector from this id. */
export const CALENDAR_IFRAME_ID = "EIulLw9wYcx5o030cWer_1795536491941";

/**
 * TODO before launch: replace with the Twilio tracking number.
 * The clinic's own line is used as a placeholder.
 */
export const PHONE_NUMBER = "(571) 378-1398";
export const PHONE_HREF = "tel:+15713781398";

export const ADDRESS_LINES = [
  "6849 Old Dominion Drive, Suite 315",
  "McLean, VA 22101",
] as const;

const PLACE_ID = "ChIJe1mRbhW1t4kR31wKWJ9HPLE";
export const MAPS_URL = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`;
export const REVIEWS_URL = `https://search.google.com/local/reviews?placeid=${PLACE_ID}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  "McLean Neuropsychiatric Treatment Center, 6849 Old Dominion Drive, Suite 315, McLean, VA 22101",
)}&z=15&output=embed`;

export const HOURS = [
  { days: "Monday to Friday", time: "7:30 AM to 8:00 PM" },
  { days: "Saturday", time: "8:00 AM to 6:30 PM" },
  { days: "Sunday", time: "9:00 AM to 3:00 PM" },
] as const;

export const HOURS_LABEL = "Open 7 days a week";

export const NAV_LINKS = [
  { label: "Treatments", href: `#${SERVICES_SECTION_ID}` },
  { label: "Why McLean NTC", href: `#${WHY_SECTION_ID}` },
  { label: "Our team", href: `#${TEAM_SECTION_ID}` },
  { label: "Insurance", href: `#${INSURANCE_SECTION_ID}` },
  { label: "FAQ", href: `#${FAQ_SECTION_ID}` },
  { label: "Visit", href: `#${VISIT_SECTION_ID}` },
] as const;

export const HERO_CHIPS = [
  { icon: "check", label: "Free consultation" },
  { icon: "shield", label: "No obligation to start treatment" },
  { icon: "clock", label: "Accepting new patients" },
] as const;

export const TRUST_ITEMS = [
  {
    icon: "chart",
    title: "Psychiatrist-led",
    subtitle: "Founded and directed by a psychiatrist",
  },
  {
    icon: "shield",
    title: "Board-certified clinicians",
    subtitle: "Psychiatrists, nurse practitioners and a PA",
  },
  {
    icon: "target",
    title: "A Georgetown training site",
    subtitle: "Psychiatry residents train here",
  },
  {
    icon: "wave",
    title: "Insurance accepted",
    subtitle: "Medicare, Virginia Medicaid, Tricare and more",
  },
] as const;

export const MARQUEE_ITEMS = [
  "Free consultation",
  "TMS",
  "Spravato",
  "IV Ketamine",
  "IM Ketamine",
  "Psychiatrist-led",
  "Board-certified clinicians",
  "Georgetown training site",
  "Medicare",
  "Virginia Medicaid",
  "Tricare",
  "Open 7 days a week",
  "Accepting new patients",
] as const;

export const EMPATHY_POINTS = [
  {
    title: "You’ve done what you were told to do",
    body: "The medications, the dose changes, the waiting. Still feeling this way is not a failure on your part.",
  },
  {
    title: "It has a name, and it is common",
    body: "When depression hasn’t lifted after several treatments, doctors call it treatment-resistant depression. It is the focus of our practice.",
  },
  {
    title: "There are other ways to treat it",
    body: "TMS, Spravato and ketamine work differently from the antidepressants you’ve already tried.",
  },
] as const;

export const SERVICES = [
  {
    id: "tms",
    title: "TMS",
    fullName: "Transcranial magnetic stimulation",
    badge: "FDA-cleared",
    eyebrow: "No medication · No anesthesia",
    description:
      "A magnetic coil rests against your head and sends gentle pulses to the part of the brain that helps control mood. You sit in a chair, fully awake, and nothing enters your body. We treat with the MagVenture TMS system.",
    points: [
      "FDA-cleared for major depression, including depression with anxiety",
      "No anesthesia and no sedation",
      "Sessions fit into a normal day, and we are open 7 days a week",
      "Covered by most plans when criteria are met, including Medicare and Virginia Medicaid",
    ],
    facts: [
      { label: "Session", value: "About 19 min" },
      { label: "Course", value: "About 36 sessions" },
      { label: "Insurance", value: "Usually covered" },
    ],
    image: IMAGES.tms,
    imageAlt:
      "Illustration of a TMS coil resting against the head, sending pulses to the front of the brain.",
    imagePosition: "center",
  },
  {
    id: "spravato",
    title: "Spravato",
    fullName: "Esketamine nasal spray",
    badge: "FDA-approved",
    eyebrow: "A nasal spray taken in our clinic",
    description:
      "Spravato is a nasal spray you take yourself in our clinic while our team looks after you. It is never sent home with you. You rest with us for at least two hours afterward, then someone drives you home.",
    points: [
      "FDA-approved for treatment-resistant depression",
      "Given in our certified clinic, with our clinical team watching over you",
      "Twice a week for the first 4 weeks, then less often",
      "Usually covered by insurance when plan criteria are met",
    ],
    facts: [
      { label: "Visit", value: "2 to 2½ hours" },
      { label: "Start", value: "Twice a week" },
      { label: "Insurance", value: "Usually covered" },
    ],
    image: IMAGES.brain,
    imageAlt:
      "Illustration of the brain with the area that responds to esketamine highlighted in blue.",
    imagePosition: "center",
  },
  {
    id: "iv-ketamine",
    title: "IV Ketamine",
    fullName: "Ketamine infusion",
    badge: "About 40 minutes",
    eyebrow: "A slow infusion, monitored throughout",
    description:
      "Ketamine is given slowly through a small IV in your arm while you rest in our clinic. A clinician stays with you and monitors you the whole time. Your schedule is planned around you after a psychiatric evaluation.",
    points: [
      "Used off-label for treatment-resistant depression",
      "A clinician monitors you for the entire treatment",
      "Your plan is set after a psychiatric evaluation",
      "You can’t drive yourself home, so please arrange a ride",
    ],
    facts: [
      { label: "Infusion", value: "About 40 min" },
      { label: "Schedule", value: "Individualized" },
      { label: "Cost", value: "$400, self-pay" },
    ],
    image: IMAGES.synapse,
    imageAlt:
      "Illustration of two brain cells passing signals, showing where ketamine acts.",
    imagePosition: "42% center",
  },
  {
    id: "im-ketamine",
    title: "IM Ketamine",
    fullName: "Ketamine injection",
    badge: "No IV needed",
    eyebrow: "The same medicine, given as an injection",
    description:
      "The same medicine as IV ketamine, given as an injection into a muscle instead of through an IV line. It is given here in our clinic with a clinician monitoring you, and it can suit people who would rather not have an IV.",
    points: [
      "Used off-label for treatment-resistant depression",
      "No IV line to place",
      "Given in our clinic with a clinician monitoring you throughout",
      "You can’t drive yourself home, so please arrange a ride",
    ],
    facts: [
      { label: "Given as", value: "An injection" },
      { label: "Schedule", value: "Individualized" },
      { label: "Cost", value: "$400, self-pay" },
    ],
    image: IMAGES.reception,
    imageAlt:
      "The reception and waiting area at McLean NTC, with armchairs along a blue wall.",
    imagePosition: "60% center",
  },
] as const;

export const GLANCE_ROWS = [
  {
    name: "TMS",
    how: "Magnetic pulses from a coil on the head",
    time: "About 19 minutes",
    status: "FDA-cleared",
    cost: "Usually covered by insurance",
  },
  {
    name: "Spravato",
    how: "Nasal spray you take in our clinic",
    time: "2 to 2½ hours",
    status: "FDA-approved",
    cost: "Usually covered by insurance",
  },
  {
    name: "IV Ketamine",
    how: "Slow infusion through an IV",
    time: "About 40 minutes",
    status: "Off-label use",
    cost: "$400 per treatment, self-pay",
  },
  {
    name: "IM Ketamine",
    how: "Injection into a muscle",
    time: "Set at your evaluation",
    status: "Off-label use",
    cost: "$400 per treatment, self-pay",
  },
] as const;

export const WHY_POINTS = [
  {
    icon: "chart",
    title: "Led by a psychiatrist",
    body: "Our founder and medical director, Dr. Aazaz Haq, is board-certified in adult and geriatric psychiatry and completed a TMS fellowship at Duke.",
  },
  {
    icon: "target",
    title: "Four treatments under one roof",
    body: "TMS, Spravato, IV ketamine and IM ketamine in one clinic, so the recommendation fits you and not just what one clinic happens to offer.",
  },
  {
    icon: "shield",
    title: "A teaching clinic",
    body: "We are an approved clinical training site for Georgetown University psychiatry residents.",
  },
  {
    icon: "clock",
    title: "Open 7 days a week",
    body: "Early mornings, evenings and weekends, so treatment can fit around work and family.",
  },
  {
    icon: "wave",
    title: "Insurance welcomed",
    body: "We accept Medicare, Virginia Medicaid, Tricare and many commercial plans, and we check your plan for you.",
  },
  {
    icon: "check",
    title: "No pressure, ever",
    body: "Care starts with a free consultation. Nothing commits you to treatment.",
  },
] as const;

export const FOUNDER = {
  name: "Aazaz Haq, MD",
  role: "Adult and Geriatric Psychiatrist · Founder and Medical Director",
  image: haqImg,
  credentials: [
    "Board-certified in Adult and Geriatric Psychiatry (ABPN)",
    "MD and psychiatry residency, University of Michigan",
    "Geriatric psychiatry fellowship, UCLA",
    "Neuromodulation (TMS) fellowship, Duke University",
    "Former director of neuromodulation, Philadelphia VA Medical Center",
  ],
} as const;

export const TEAM = [
  {
    name: "Aazaz Haq, MD",
    role: "Adult and Geriatric Psychiatrist",
    note: "Founder and Medical Director",
    image: haqImg,
    position: "center 20%",
  },
  {
    name: "Sonia Alam, MD",
    role: "Adult Psychiatrist",
    note: "Board-certified in Psychiatry (ABPN)",
    image: alamImg,
    position: "center 20%",
  },
  {
    name: "Jennifer Kilmer, PMHNP-BC",
    role: "Psychiatric Nurse Practitioner",
    note: "More than two decades of experience",
    image: kilmerImg,
    position: "center 20%",
  },
  {
    name: "Ryan Wood, PMHNP-BC",
    role: "Psychiatric Nurse Practitioner",
    note: "Board-certified, 10+ years in care",
    image: woodImg,
    position: "center 20%",
  },
  {
    name: "Krista Rose, MPAS, PA-C",
    role: "Physician Assistant, Psychiatry",
    note: "Board-certified, CAQ in Psychiatry",
    image: roseImg,
    position: "center 20%",
  },
] as const;

export const INSURERS = [
  { name: "Medicare", logo: insMedicare },
  { name: "Virginia Medicaid", logo: insMedicaid },
  { name: "Tricare", logo: insTricare },
  { name: "Aetna", logo: insAetna },
  { name: "Anthem", logo: insAnthem },
  { name: "CareFirst BlueCross BlueShield", logo: insBcbs },
  { name: "Cigna", logo: insCigna },
  { name: "Johns Hopkins", logo: insJohns },
  { name: "Optum", logo: insOptum },
  { name: "UnitedHealthcare", logo: insUnited },
] as const;

export const INSURANCE_STEPS = [
  {
    title: "Start with a free consultation",
    body: "A relaxed conversation about what you’ve been living with and what you’ve already tried. It costs nothing.",
  },
  {
    title: "We check your plan for you",
    body: "We look at what your insurance covers for each treatment and explain any costs before you decide anything.",
  },
  {
    title: "You choose whether to go ahead",
    body: "There is no obligation to start treatment. If you do, we handle the insurance paperwork.",
  },
] as const;

export const COVERAGE = [
  { name: "TMS", note: "Usually covered when plan criteria are met" },
  { name: "Spravato", note: "Usually covered when plan criteria are met" },
  {
    name: "IV and IM Ketamine",
    note: "$400 per treatment, self-pay. Not usually covered by insurance",
  },
] as const;

/**
 * Google reviews. Left empty on purpose: mcleanntc.com shows no review text,
 * and we do not invent quotes. Paste real reviews here (with the reviewer's
 * permission) and the section shows them as cards automatically.
 */
export const REVIEWS: readonly { name: string; text: string }[] = [];

export const FAQS = [
  {
    q: "What is treatment-resistant depression?",
    a: "It means depression that hasn’t improved enough after trying antidepressants. It is common, and it doesn’t mean nothing will help. It means it may be time to try a treatment that works in a different way.",
  },
  {
    q: "Is the consultation really free?",
    a: "Yes. Your first consultation is free, and there is no obligation to start treatment. We listen, answer your questions and explain which options may fit you.",
  },
  {
    q: "How do I know which treatment is right for me?",
    a: "You don’t have to work that out alone. We offer TMS, Spravato, IV ketamine and IM ketamine in one clinic, so our clinicians can recommend what fits your history, your health and your insurance.",
  },
  {
    q: "Will my insurance cover it?",
    a: "We accept Medicare, Virginia Medicaid, Tricare and many commercial plans. TMS and Spravato are usually covered when your plan’s criteria are met. Ketamine is not usually covered by insurance and is $400 per treatment, self-pay. We check your plan and explain any costs before you decide.",
  },
  {
    q: "What does TMS feel like?",
    a: "You sit in a chair, awake the whole time. Most people feel a tapping on the scalp during the pulses. There is no anesthesia. A standard session takes about 19 minutes.",
  },
  {
    q: "Can I drive myself home?",
    a: "After Spravato or ketamine, no. Please arrange for someone to take you home. With Spravato you also stay with us for at least two hours after your dose so our team can look after you.",
  },
  {
    q: "What is the difference between Spravato and ketamine?",
    a: "Spravato is a nasal spray that is FDA-approved for treatment-resistant depression and is usually covered by insurance. Ketamine is given by IV infusion or injection. Its use for depression is off-label, and it is usually self-pay.",
  },
  {
    q: "Are you accepting new patients?",
    a: "Yes, we are currently accepting new patients. We are open 7 days a week, including early mornings and evenings.",
  },
] as const;
