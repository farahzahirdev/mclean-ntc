import Reveal from "@/components/Reveal";
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import {
  ADDRESS_LINES,
  HOURS,
  MAPS_URL,
  MAP_EMBED_URL,
  PHONE_HREF,
  PHONE_NUMBER,
  SITE_SHORT,
  VISIT_SECTION_ID,
} from "@/lib/constants";

export default function Visit() {
  return (
    <section id={VISIT_SECTION_ID} className="section visit">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">Visit us</p>
          <h2>In McLean, open seven days a week.</h2>
          <p className="lead">
            Early mornings, evenings and weekends, so getting care doesn&rsquo;t
            mean rearranging your life.
          </p>
        </Reveal>

        <div className="visit-grid">
          <Reveal className="visit-info">
            <div className="visit-item">
              <span className="contact-icon">
                <PinIcon className="icon-sm" />
              </span>
              <div>
                <h3>Address</h3>
                <p>
                  {ADDRESS_LINES[0]}
                  <br />
                  {ADDRESS_LINES[1]}
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="visit-link"
                >
                  Get directions <ArrowIcon className="btn-arrow" />
                </a>
              </div>
            </div>

            <div className="visit-item">
              <span className="contact-icon">
                <ClockIcon className="icon-sm" />
              </span>
              <div>
                <h3>Hours</h3>
                <dl className="hours">
                  {HOURS.map((row) => (
                    <div key={row.days}>
                      <dt>{row.days}</dt>
                      <dd>{row.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="visit-item">
              <span className="contact-icon">
                <PhoneIcon className="icon-sm" />
              </span>
              <div>
                <h3>Call us</h3>
                <a href={PHONE_HREF} className="visit-phone">
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2} className="visit-map">
            <iframe
              src={MAP_EMBED_URL}
              title={`Map showing ${SITE_SHORT} at ${ADDRESS_LINES.join(", ")}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
