import Reveal from "@/components/Reveal";
import { ArrowIcon, StarIcon } from "@/components/Icons";
import { BookButton } from "@/components/CTAButtons";
import { REVIEWS, REVIEWS_SECTION_ID, REVIEWS_URL, SITE_SHORT } from "@/lib/constants";

function Stars() {
  return (
    <span className="stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((star) => (
        <StarIcon key={star} className="icon-sm" />
      ))}
    </span>
  );
}

export default function Reviews() {
  return (
    <section id={REVIEWS_SECTION_ID} className="section reviews">
      <div className="wrap">
        <Reveal className="reviews-panel">
          <div className="reviews-copy">
            <p className="eyebrow">Patient reviews</p>
            <h2>Hear it from the people we&rsquo;ve cared for.</h2>
            <p className="lead">
              Choosing where to get help is a big decision. Our patients share
              their experiences of {SITE_SHORT} on Google, in their own words.
            </p>
            <div className="cta-row">
              <a
                href={REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy"
              >
                <span>Read our reviews on Google</span>
                <ArrowIcon className="btn-arrow" />
              </a>
              <BookButton variant="outline" />
            </div>
          </div>

          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="reviews-badge"
            aria-label={`Read ${SITE_SHORT} reviews on Google`}
          >
            <svg viewBox="0 0 48 48" className="google-g" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 7.1-10.3 7.1-17.7z" />
              <path fill="#FBBC05" d="M10.5 28.6c-.5-1.400-.8-3-.8-4.600s.3-3.200.8-4.600l-7.900-6.200C.9 16.500 0 20.100 0 24s.9 7.500 2.600 10.800l7.900-6.200z" />
              <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.700-6c-2.200 1.400-4.900 2.300-8.200 2.300-6.300 0-11.600-4.200-13.500-9.900l-7.900 6.200C6.500 42.600 14.600 48 24 48z" />
            </svg>
            <Stars />
            <span className="reviews-badge-title">Reviews on Google</span>
            <span className="reviews-badge-link">
              See what patients say <ArrowIcon className="btn-arrow" />
            </span>
          </a>
        </Reveal>

        {REVIEWS.length > 0 ? (
          <ul className="review-cards">
            {REVIEWS.map((review, index) => (
              <li key={review.name}>
                <Reveal delay={((index % 3) + 1) as 1 | 2 | 3} className="review-card">
                  <Stars />
                  <blockquote>{review.text}</blockquote>
                  <p className="review-name">{review.name}</p>
                  <p className="review-source">Google review</p>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
