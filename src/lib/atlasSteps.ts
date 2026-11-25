/**
 * Plain-language steps for the 3D models, taken from the clinic's own guides
 * on mcleanntc.com (by Aazaz Haq, MD). `step` is the step index in the scene.
 */
export type AtlasStep = { step: number; title: string; body: string };

export const TMS_STEPS: readonly AtlasStep[] = [
  {
    step: 0,
    title: "Magnetic pulses",
    body: "A small magnetic coil rests against the head, over the left front of the brain. It sends quick pulses that pass painlessly through the skull. Each ring leaving the coil is one pulse.",
  },
  {
    step: 1,
    title: "In depression, part of the brain is less active",
    body: "On brain scans, an area at the left front of the brain uses less energy during depression. When depression improves, activity here tends to come back toward normal.",
  },
  {
    step: 2,
    title: "This area helps steady your mood",
    body: "It helps regulate deeper parts of the brain that are involved in mood. Pathways run from the front area down to two deeper mood centers, shown in orange.",
  },
  {
    step: 3,
    title: "The skull is in the way",
    body: "Electric current applied from outside does not pass through the skull easily. A magnetic field is different: it passes through skin and bone.",
  },
  {
    step: 4,
    title: "A changing magnetic field makes cells fire",
    body: "Each pulse creates a tiny current in the nerve cells right under the coil, and they fire. Cells farther away stay at rest.",
  },
  {
    step: 5,
    title: "Whole networks switch back on",
    body: "When the cells under the coil fire again and again, the activity spreads along their connections and activates the networks that have been underactive.",
  },
  {
    step: 6,
    title: "Repetition makes the change last",
    body: "The treatment is repeated over several weeks. With repetition, the connections in these networks grow stronger, much as practice strengthens a skill.",
  },
];

export const KETAMINE_STEPS: readonly AtlasStep[] = [
  {
    step: 0,
    title: "The prefrontal cortex",
    body: "The front of the brain helps regulate mood and decision-making. In depression, connections between nerve cells here are often weakened. These medicines act in this area and others.",
  },
  {
    step: 1,
    title: "Inhibition holds signaling back",
    body: "Inhibitory nerve cells normally restrain nearby signaling cells, limiting how much glutamate, the brain’s main excitatory messenger, they release.",
  },
  {
    step: 2,
    title: "Two mirror-image molecules",
    body: "Ketamine is an equal mix of two molecules that are mirror images of each other. One is esketamine. Spravato contains only esketamine.",
  },
  {
    step: 3,
    title: "The medicine blocks a receptor",
    body: "Ketamine and esketamine block a receptor on the inhibitory cells, which reduces their restraining effect. The medicine is shown in pink.",
  },
  {
    step: 4,
    title: "Glutamate signaling increases",
    body: "With less inhibition, signaling cells release a burst of glutamate, shown as orange dots streaming to the receiving cell.",
  },
  {
    step: 5,
    title: "New connections grow",
    body: "The burst releases a growth signal. Over hours to days, nerve cells grow new connections, which may help mood improve.",
  },
  {
    step: 6,
    title: "Mood circuits reconnect",
    body: "The new connections may help mood-regulating brain areas communicate more effectively. This may help explain why these medicines can work faster than standard antidepressants for some people.",
  },
];
