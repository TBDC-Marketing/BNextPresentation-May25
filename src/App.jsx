import React, { useEffect, useMemo, useState } from 'react';
import {
  bramptonImpacts,
  founderStories,
  futureFocusAreas,
  metrics,
  modelPillars,
  pilotProofs,
  shortFounderStories,
} from './content.js';

const shortSections = [
  ['why-built', 'Why Built', 'Why BNext Was Built'],
  ['short-evidence', 'Outcomes', 'Evidence and Outcomes'],
  ['founder-impact', 'Impact', 'Founder Impact'],
  ['model-work', 'Model', 'What Made the Model Work'],
  ['pilot-proved', 'Proof', 'What the Pilot Proved'],
].map(([id, nav, title]) => ({ id, nav, title }));

const longSections = [
  { id: 'opening', nav: 'Opening', title: 'Title frame' },
  { id: 'evidence-outcomes', nav: 'Outcomes', title: 'Early momentum' },
  ...founderStories.map((story) => ({ id: `story-${story.id}`, nav: story.company, title: story.name })),
  { id: 'model-work-long', nav: 'Model', title: 'Support model' },
  { id: 'closing', nav: 'Closing', title: 'Future potential' },
];

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Section({ id, dark = false, children }) {
  return (
    <section id={id} className={cx('slide', dark && 'dark')}>
      <div className="panel">{children}</div>
    </section>
  );
}

function Rule({ children }) {
  return (
    <div className="rule">
      <span>{children}</span>
      <i />
    </div>
  );
}

function Brand() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="brand">
      <img src={`${base}BNextLogo.png`} alt="Brampton NEXT" />
      <img src={`${base}BHiveLogo.png`} alt="BHive" />
    </div>
  );
}

function FounderPhoto({ story }) {
  const base = import.meta.env.BASE_URL;
  const [missing, setMissing] = useState(false);
  const initials = story.company
    .split(/\s|&/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="photo">
      {missing ? (
        <b>{initials}</b>
      ) : (
        <img src={`${base}${story.photo}`} alt={`${story.name}, ${story.company}`} onError={() => setMissing(true)} />
      )}
    </div>
  );
}

function Metric({ metric }) {
  return (
    <article className="metric">
      <strong>{metric.value}</strong>
      <h3>{metric.label}</h3>
      <p>{metric.detail}</p>
    </article>
  );
}

function Nav({ sections, current, go, printMode }) {
  const [open, setOpen] = useState(false);
  if (printMode) return null;
  const active = sections[current] || sections[0];

  return (
    <>
      <button className="nav-pill" type="button" onClick={() => setOpen((value) => !value)}>
        <b>{active.nav}</b>
        <span>
          {String(current + 1).padStart(2, '0')}/{String(sections.length).padStart(2, '0')}
        </span>
      </button>
      {open && (
        <nav className="nav-panel" aria-label="Slide navigation">
          {sections.map((section, index) => (
            <button key={section.id} type="button" onClick={() => go(index)} className={index === current ? 'active' : ''}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </button>
          ))}
        </nav>
      )}
    </>
  );
}

function Deck({ sections, printMode = false, children }) {
  const ids = useMemo(() => sections.map((section) => section.id), [sections]);
  const [current, setCurrent] = useState(0);

  const go = (index) => {
    const safe = Math.max(0, Math.min(index, ids.length - 1));
    document.getElementById(ids[safe])?.scrollIntoView({ behavior: printMode ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    if (printMode) return undefined;
    let frame = 0;
    const update = () => {
      const center = window.scrollY + window.innerHeight / 2;
      const next = ids.reduce((best, id, index) => {
        const node = document.getElementById(id);
        if (!node) return best;
        const distance = Math.abs(node.offsetTop + node.offsetHeight / 2 - center);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Infinity }).index;
      setCurrent(next);
      frame = 0;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids, printMode]);

  useEffect(() => {
    if (printMode) return undefined;
    const onKey = (event) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        go(current + 1);
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        go(current - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, printMode]);

  return (
    <div className={cx('deck', printMode && 'print-mode')}>
      <Nav sections={sections} current={current} go={go} printMode={printMode} />
      <main>{children}</main>
    </div>
  );
}

function Metrics({ short = false }) {
  return (
    <div className={cx('metrics-slide', short && 'short')}>
      {!short && (
        <div className="intro">
          <Rule>Evidence and outcomes</Rule>
          <h2>Early momentum, made visible.</h2>
          <p>Early indicators show strong engagement, increasing demand, and expanding participation across the BNext ecosystem.</p>
        </div>
      )}
      {short && <Rule>Evidence and outcomes</Rule>}
      <div className="metrics">{metrics.map((metric) => <Metric key={metric.label} metric={metric} />)}</div>
      <div className="brampton">
        <b>What this means for Brampton</b>
        {bramptonImpacts.map((item) => <p key={item}>{item}</p>)}
      </div>
    </div>
  );
}

function LongDeck() {
  return (
    <Deck sections={longSections}>
      <Section id="opening" dark>
        <div className="hero">
          <Brand />
          <Rule>BNext impact story</Rule>
          <h1>From potential to traction</h1>
          <p>Brampton Next enables global entrepreneurs to turn ideas into businesses through mentorship, networks, and ecosystem access.</p>
        </div>
      </Section>
      <Section id="evidence-outcomes"><Metrics /></Section>
      {founderStories.map((story) => (
        <Section id={`story-${story.id}`} dark key={story.id}>
          <div className="story">
            <FounderPhoto story={story} />
            <div>
              <Rule>Founder impact story</Rule>
              <h2>{story.company}</h2>
              <p>{story.fullThen}</p>
              <strong>{story.fullNow}</strong>
            </div>
          </div>
        </Section>
      ))}
      <Section id="model-work-long">
        <ModelSlide />
      </Section>
      <Section id="closing" dark>
        <ProofSlide />
      </Section>
    </Deck>
  );
}

function ModelSlide() {
  return (
    <div className="model">
      <Rule>What Made the Model Work</Rule>
      <h2>What Made the Model Work</h2>
      <p>The pilot succeeded because it combined:</p>
      <div className="pillars">
        {modelPillars.map((pillar, index) => (
          <article key={pillar}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{pillar}</b>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProofSlide() {
  return (
    <div className="proof">
      <Rule>What the Pilot Proved</Rule>
      <h2>What the Pilot Proved</h2>
      <div className="proof-grid">
        <div>{pilotProofs.map((item) => <p key={item}>{item}</p>)}</div>
        <aside>
          <b>Potential future focus areas</b>
          {futureFocusAreas.map((item) => <span key={item}>{item}</span>)}
        </aside>
      </div>
    </div>
  );
}

function ShortDeck({ printMode }) {
  return (
    <Deck sections={shortSections} printMode={printMode}>
      <Section id="why-built" dark>
        <div className="hero short-hero">
          <Brand />
          <Rule>Why BNext Was Built</Rule>
          <h1>Why BNext Was Built</h1>
          <p>This is not a gap in talent. It is a structural gap in access.</p>
          <div className="access">
            <p>International founders often arrive with strong skills and viable ideas, but limited access to:</p>
            {['networks', 'mentorship', 'ecosystem navigation', 'early customer and capital pathways'].map((item) => <b key={item}>{item}</b>)}
          </div>
          <h3>Brampton Next was designed to close that gap.</h3>
        </div>
      </Section>
      <Section id="short-evidence"><Metrics short /></Section>
      <Section id="founder-impact" dark>
        <div className="founders">
          <Rule>Founder Impact</Rule>
          <h2>Founder Impact</h2>
          <div>
            {shortFounderStories.map((story) => (
              <article key={story.id}>
                <FounderPhoto story={story} />
                <h3>{story.company}</h3>
                <p>{story.then}</p>
                <strong>{story.now}</strong>
              </article>
            ))}
          </div>
        </div>
      </Section>
      <Section id="model-work"><ModelSlide /></Section>
      <Section id="pilot-proved" dark><ProofSlide /></Section>
    </Deck>
  );
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isShort = params.get('deck') === 'short';
  const printMode = isShort && params.get('print') === '1';
  return isShort ? <ShortDeck printMode={printMode} /> : <LongDeck />;
}
