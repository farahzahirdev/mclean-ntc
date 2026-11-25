import { MARQUEE_ITEMS } from "@/lib/constants";

/** Decorative scrolling band. The same content appears as real text elsewhere on the page. */
export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div key={group} className="marquee-group">
            {MARQUEE_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
