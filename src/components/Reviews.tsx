import Reveal from "@/components/Reveal";
import SwipeArrows from "@/components/SwipeArrows";
import { ArrowIcon, StarIcon } from "@/components/Icons";
import { BookButton } from "@/components/CTAButtons";
import { REVIEWS, REVIEWS_SECTION_ID, REVIEWS_URL, SITE_SHORT } from "@/lib/constants";

/** The sentence pulled out large on the featured card. It is a word-for-word line from that review. */
const FEATURED_LINE = "This program has finally given me hope for a fulfilling life.";

function Stars() {
  return (
    <span className="stars" aria-label="5 out of 5 stars" role="img">
      {[0, 1, 2, 3, 4].map((star) => (
        <StarIcon key={star} className="icon-sm" />
      ))}
    </span>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="google-g" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 7.1-10.3 7.1-17.7z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function Author({ name, date }: { name: string; date: string }) {
  return (
    <footer className="rv-author">
      <span className="rv-avatar" aria-hidden="true">
        {name.charAt(0)}
      </span>
      <span>
        <strong>{name}</strong>
        <em>Google review · {date}</em>
      </span>
      <GoogleG />
    </footer>
  );
}

export default function Reviews() {
  const [featured, ...rest] = REVIEWS;

  return (
    <section id={REVIEWS_SECTION_ID} className="section rv">
      <div className="wrap rv-grid">
        <Reveal className="rv-intro">
          <p className="eyebrow">Patient reviews</p>
          <h2>Hear it from the people we&rsquo;ve cared for.</h2>
          <p className="lead">
            Choosing where to get help is a big decision. Our patients share
            their experiences of {SITE_SHORT} on Google, in their own words.
          </p>
          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rv-google"
            aria-label={`Read ${SITE_SHORT} reviews on Google`}
          >
            <GoogleG />
            <span>
              <Stars />
              <strong>Read all our reviews on Google</strong>
            </span>
            <ArrowIcon className="btn-arrow" />
          </a>
          <BookButton variant="navy" />
        </Reveal>

        {featured ? (
          <div className="rv-scroller">
            <div id="review-row" className="rv-cards">
            <Reveal delay={1} className="rv-card rv-featured">
              <span className="rv-quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <Stars />
              <blockquote>
                <p className="rv-pull">{FEATURED_LINE}</p>
                <p>{featured.text}</p>
              </blockquote>
              <Author name={featured.name} date={featured.date} />
            </Reveal>

            {rest.map((review, index) => (
              <Reveal
                key={review.name}
                delay={((index % 2) + 2) as 2 | 3}
                className="rv-card"
              >
                <Stars />
                <blockquote>
                  <p>{review.text}</p>
                </blockquote>
                <Author name={review.name} date={review.date} />
              </Reveal>
            ))}
            </div>
            <SwipeArrows targetId="review-row" label="review" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
