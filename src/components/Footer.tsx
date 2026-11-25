import Image from "next/image";
import {
  ADDRESS_LINES,
  HOURS,
  LOGO_LIGHT_URL,
  MAPS_URL,
  PHONE_HREF,
  PHONE_NUMBER,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="crisis">
          <strong>If you are in crisis,</strong> call or text{" "}
          <a href="tel:988">988</a>, or call <a href="tel:911">911</a>.
        </p>

        <div className="footer-grid">
          <div className="footer-brand">
            <Image src={LOGO_LIGHT_URL} alt={SITE_NAME} width={414} height={92} />
            <p>
              A psychiatrist-led interventional psychiatry and neuromodulation
              center in McLean, Virginia.
            </p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>
              <a href={PHONE_HREF}>{PHONE_NUMBER}</a>
              <br />
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                {ADDRESS_LINES[0]}
                <br />
                {ADDRESS_LINES[1]}
              </a>
            </p>
          </div>

          <div>
            <h3>Hours</h3>
            <p>
              {HOURS.map((row) => (
                <span key={row.days} className="footer-hours">
                  {row.days}: {row.time}
                </span>
              ))}
            </p>
          </div>
        </div>

        <p className="footer-legal">
          TMS is FDA-cleared for major depressive disorder. Spravato
          (esketamine) is FDA-approved for treatment-resistant depression and is
          given only in a certified clinic. Ketamine for depression is an
          off-label use. This page is for general information and is not medical
          advice. Individual results vary. Treatment is provided only after a
          clinical evaluation. Spravato is a registered trademark of its owner.
        </p>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </span>
          <span className="footer-links">
            <a href={`${SITE_URL}/privacy/index.html`} target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
            <a href={`${SITE_URL}/terms/index.html`} target="_blank" rel="noopener noreferrer">
              Terms
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
