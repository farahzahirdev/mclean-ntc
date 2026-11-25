import Reveal from "@/components/Reveal";
import SwipeArrows from "@/components/SwipeArrows";
import TreatmentRows from "@/components/TreatmentRows";
import { GLANCE_ROWS, SERVICES_SECTION_ID } from "@/lib/constants";

export default function Services() {
  return (
    <section id={SERVICES_SECTION_ID} className="section section-mist services">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">Our treatments</p>
          <h2>See how each treatment works, in 3D.</h2>
          <p className="lead">
            Four ways forward when antidepressants haven&rsquo;t been enough.
            The 3D models below play through what each one does in the brain.
          </p>
        </Reveal>

        <TreatmentRows />

        <Reveal className="glance-table">
          <div className="glance-table-head">
            <p className="eyebrow">At a glance</p>
            <h3>The four treatments, side by side</h3>
          </div>
          <div className="glance-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Treatment</th>
                  <th scope="col">How it&rsquo;s given</th>
                  <th scope="col">Time in clinic</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cost</th>
                </tr>
              </thead>
              <tbody id="glance-row">
                {GLANCE_ROWS.map((row) => (
                  <tr key={row.name}>
                    <th scope="row">{row.name}</th>
                    <td data-label="How it’s given">{row.how}</td>
                    <td data-label="Time in clinic">{row.time}</td>
                    <td data-label="Status">
                      <span className="pill">{row.status}</span>
                    </td>
                    <td data-label="Cost">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SwipeArrows targetId="glance-row" label="treatment" />
          <p className="glance-note">
            Off-label means the medicine is FDA-approved for another use and
            prescribed for depression at a clinician&rsquo;s judgment. Whether
            any treatment is right for you is decided after an evaluation.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
