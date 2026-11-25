"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { AtlasStep } from "@/lib/atlasSteps";

/**
 * Interactive 3D model, using the clinic's own three.js scenes from mcleanntc.com
 * (public/atlas). The scripts are fetched only when the stage nears the screen.
 */

type Stage = {
  use: (scene: unknown) => void;
  setStep: (index: number, instant?: boolean) => void;
  snap: () => void;
  start: () => void;
  stop: () => void;
  resetView: () => void;
  renderer?: { dispose: () => void };
};

type Atlas = {
  scenes: Record<string, unknown>;
  supported: () => boolean;
  create: (el: HTMLElement, opts?: Record<string, unknown>) => Stage | null;
};

const SCRIPTS = {
  three: "/atlas/three.min.js",
  core: "/atlas/atlas-core.js",
  tms: "/atlas/scene-tms.js",
  ketamine: "/atlas/scene-ketamine.js",
} as const;

const STEP_MS = 6500;
const COVER_MS = 3600;

const pending = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const cached = pending.get(src);
  if (cached) return cached;
  const promise = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
  pending.set(src, promise);
  return promise;
}

const getAtlas = () => (window as unknown as { MNTC3D?: Atlas }).MNTC3D;

export default function AtlasStage({
  scene,
  steps,
  poster,
  posterAlt,
  cover,
  active = true,
}: {
  scene: "tms" | "ketamine";
  steps: readonly AtlasStep[];
  poster: StaticImageData;
  posterAlt: string;
  /** A photo shown first; it opens up to reveal the model, then returns after the last step. */
  cover?: {
    image: StaticImageData;
    alt: string;
    tag: string;
    title: string;
    body: string;
    /** Where the photo opens from, as "x% y%" of the stage. */
    at: string;
    /** object-position of the photo. */
    position: string;
  };
  /** Only the visible stage runs its animation loop. */
  active?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const instance = useRef<Stage | null>(null);
  const booting = useRef(false);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [phase, setPhase] = useState<"photo" | "model">(cover ? "photo" : "model");

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || state !== "ready") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const last = index === steps.length - 1;
    const timer = setTimeout(
      () => {
        if (phase === "photo") {
          setIndex(0);
          setPhase("model");
        } else if (last && cover) {
          setPhase("photo");
        } else {
          setIndex(last ? 0 : index + 1);
        }
      },
      phase === "photo" ? COVER_MS : STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [inView, state, phase, index, steps.length, cover]);

  useEffect(() => {
    if (state === "ready") instance.current?.setStep(steps[index].step);
  }, [index, state, steps]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || !near || !active || instance.current || booting.current) return;
    booting.current = true;
    let cancelled = false;

    loadScript(SCRIPTS.three)
      .then(() => loadScript(SCRIPTS.core))
      .then(() => loadScript(SCRIPTS[scene]))
      .then(() => {
        if (cancelled) return;
        const atlas = getAtlas();
        if (!atlas || !atlas.supported() || !atlas.scenes[scene]) {
          setState("failed");
          return;
        }
        const stage = atlas.create(node);
        if (!stage) {
          setState("failed");
          return;
        }
        stage.use(atlas.scenes[scene]);
        stage.setStep(steps[0].step, true);
        stage.snap();
        stage.start();
        instance.current = stage;
        setState("ready");
      })
      .catch(() => setState("failed"))
      .finally(() => {
        booting.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [near, active, scene, steps]);

  useEffect(() => {
    const stage = instance.current;
    if (!stage) return;
    if (active) stage.start();
    else stage.stop();
  }, [active, state]);

  useEffect(
    () => () => {
      instance.current?.stop();
    },
    [],
  );

  const current = steps[index];

  return (
    <div className="atlas" hidden={!active}>
      <div
        ref={stageRef}
        className={`atlas-stage${state === "failed" ? " no3d" : ""}`}
        onPointerDown={(event) => event.currentTarget.classList.add("touched")}
      >
        <Image
          src={poster}
          alt={posterAlt}
          fill
          sizes="(max-width: 960px) 100vw, 640px"
          quality={95}
          className="atlas-poster"
        />
        <div className="atlas-top">
          <span className="atlas-fig">3D model</span>
          <span className="atlas-hint">Drag to rotate</span>
        </div>
        <span className="atlas-chip" aria-live="polite" />
        {cover ? (
          <>
            <div
              className={`atlas-cover${phase === "model" ? " is-open" : ""}`}
              style={
                {
                  "--at": cover.at,
                  "--ax": cover.at.split(" ")[0],
                  "--ay": cover.at.split(" ")[1],
                } as React.CSSProperties
              }
            >
              <Image
                src={cover.image}
                alt={cover.alt}
                fill
                sizes="(max-width: 960px) 100vw, 800px"
                quality={100}
                placeholder="blur"
                style={{ objectPosition: cover.position, transformOrigin: cover.at }}
              />
              <span className="atlas-beacon" aria-hidden="true" />
              <span className="atlas-cover-tag">{cover.tag}</span>
            </div>
            <span
              key={phase}
              className={`atlas-ring${phase === "model" ? " is-on" : ""}`}
              style={{ left: cover.at.split(" ")[0], top: cover.at.split(" ")[1] }}
              aria-hidden="true"
            />
          </>
        ) : null}
      </div>

      <div className="atlas-caption">
        <div
          className={`atlas-bar${
            inView && state === "ready" && phase === "model" ? " is-playing" : ""
          }${phase === "photo" ? " is-idle" : ""}`}
          aria-hidden="true"
        >
          {steps.map((step, segment) => (
            <span
              key={step.title}
              className={
                phase === "photo"
                  ? ""
                  : segment < index
                    ? "is-done"
                    : segment === index
                      ? "is-current"
                      : ""
              }
            />
          ))}
        </div>
        {phase === "model" ? (
          <p className="atlas-count">
            {index + 1} / {steps.length}
          </p>
        ) : null}
        <div key={`${phase}-${index}`} className="atlas-text">
          <h4>{phase === "photo" && cover ? cover.title : current.title}</h4>
          <p>{phase === "photo" && cover ? cover.body : current.body}</p>
        </div>
      </div>
    </div>
  );
}
