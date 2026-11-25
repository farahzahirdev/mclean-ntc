import { ArrowIcon, PhoneIcon } from "@/components/Icons";
import {
  BOOK_HREF,
  FORM_SECTION_ID,
  PHONE_HREF,
  PHONE_NUMBER,
} from "@/lib/constants";

type Variant = "amber" | "navy" | "outline" | "outline-light" | "white";

type ButtonProps = {
  variant?: Variant;
  className?: string;
};

const cls = (variant: Variant, className: string) =>
  `btn btn-${variant} ${className}`.trim();

const external = BOOK_HREF.startsWith("http")
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

export function BookButton({ variant = "amber", className = "" }: ButtonProps) {
  return (
    <a href={BOOK_HREF} className={cls(variant, className)} {...external}>
      <span>Book your Free Consultation</span>
      <ArrowIcon className="btn-arrow" />
    </a>
  );
}

export function CallButton({
  variant = "outline",
  className = "",
}: ButtonProps) {
  return (
    <a href={PHONE_HREF} className={cls(variant, className)}>
      <PhoneIcon className="btn-icon" />
      <span>Call {PHONE_NUMBER}</span>
    </a>
  );
}

export function QualifyButton({
  variant = "outline",
  className = "",
}: ButtonProps) {
  return (
    <a href={`#${FORM_SECTION_ID}`} className={cls(variant, className)}>
      <span>Find out if you Qualify</span>
    </a>
  );
}

/** Text-style secondary CTA. */
export function QualifyLink({ light = false }: { light?: boolean }) {
  return (
    <a
      href={`#${FORM_SECTION_ID}`}
      className={`text-cta${light ? " text-cta-light" : ""}`}
    >
      <span>Find out if you Qualify</span>
      <ArrowIcon className="btn-arrow" />
    </a>
  );
}
