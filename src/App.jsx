import { useEffect, useMemo, useRef, useState } from 'react';
import {
  accessGap,
  activationHighlights,
  anchorLine,
  bramptonImpacts,
  closingMarkers,
  closingParagraphs,
  communityContributions,
  communityQuotes,
  ecosystemPillars,
  mentorImpactSummary,
  mentors,
  metrics,
  openingPillars,
  sectionMeta,
  stories,
} from './content';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

function useInView({ threshold = 0.45, once = true } = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, isInView];
}

function ArrowIcon({ direction = 'right' }) {
  const rotation = {
    right: 'rotate-0',
    left: 'rotate-180',
    up: '-rotate-90',
    down: 'rotate-90',
  }[direction];

  return (
    <svg
      className={cx('h-4 w-4', rotation)}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h12" />
      <path d="m10 4 6 6-6 6" />
    </svg>
  );
}

function HexMarker({ state = 'upcoming' }) {
  const current = state === 'current';
  const complete = state === 'complete';

  const fill = current
    ? 'var(--yellow)'
    : complete
      ? 'rgba(244, 132, 36, 0.24)'
      : 'transparent';

  const stroke = current
    ? 'var(--yellow)'
    : complete
      ? 'rgba(244, 132, 36, 0.85)'
      : 'currentColor';

  return (
    <svg
      viewBox="0 0 100 86.6"
      className={cx(
        'h-4 w-4 shrink-0 transition-transform duration-300',
        current ? 'scale-110 text-[var(--yellow)]' : complete ? 'text-[var(--orange)]' : 'text-white/35'
      )}
      aria-hidden="true"
    >
      <polygon
        points="25,1 75,1 99,43.3 75,85.6 25,85.6 1,43.3"
        fill={fill}
        stroke={stroke}
        strokeWidth="6"
      />
    </svg>
  );
}

function Chip({ children, tone = 'dark' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-xl px-3 py-1.5 font-display text-[0.8rem] uppercase tracking-[0.18em]',
        tone === 'dark'
          ? 'border border-white/10 bg-white/5 text-[var(--yellow)]'
          : 'border border-[var(--navy)]/10 bg-[rgba(244,132,36,0.1)] text-[var(--orange)]'
      )}
    >
      {children}
    </span>
  );
}

function SectionRule({ label, tone = 'dark', compact = false }) {
  return (
    <div className={cx('flex items-center gap-4', compact ? 'mb-2' : 'mb-4 md:mb-6')}>
      <Chip tone={tone}>{label}</Chip>
      <div className={cx('h-px flex-1', tone === 'dark' ? 'bg-white/15' : 'bg-[var(--navy)]/10')} />
    </div>
  );
}

function SlideBrandRow() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="flex flex-wrap items-center gap-6 md:gap-8">
      <img
        src={`${base}BNextLogo.png`}
        alt="Brampton NEXT"
        className="h-12 w-auto object-contain sm:h-16 md:h-20 lg:h-[7.5rem] xl:h-[9rem]"
      />
      <img
        src={`${base}BHiveLogo.png`}
        alt="BHive"
        className="h-10 w-auto object-contain sm:h-14 md:h-[4.5rem] lg:h-[6.75rem] xl:h-[8.25rem]"
      />
    </div>
  );
}

function SlideSection({ id, mode = 'light', compact = false, noOverflowHidden = false, children }) {
  return (
    <section
      id={id}
      tabIndex={-1}
      className={cx(
        'relative snap-start snap-always px-3 pb-24 pt-3 md:px-6 md:py-6 lg:h-[100dvh] lg:min-h-[100dvh] lg:px-8 lg:py-6',
        !noOverflowHidden && 'lg:overflow-hidden'
      )}
    >
      <div className="mx-auto flex h-full max-w-[1680px] items-stretch justify-center">
        <div
          className={cx(
            'stage-frame stage-panel flex flex-col min-h-0 overflow-hidden',
            mode === 'dark' ? 'stage-panel--dark text-white' : 'stage-panel--light text-[var(--navy)]'
          )}
        >
          <div
            className={cx(
              'relative z-10 flex-1 overflow-y-auto',
              compact ? 'p-4 md:p-6 lg:p-8' : 'p-6 md:p-10 lg:px-14 lg:py-8'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryBreadcrumb() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.2em] text-white/55">
      <span className="inline-flex items-center gap-2">
        <HexMarker state="complete" />
        Idea
      </span>
      <span className="text-white/25">&rarr;</span>
      <span className="inline-flex items-center gap-2">
        <HexMarker state="current" />
        Mentorship
      </span>
      <span className="text-white/25">&rarr;</span>
      <span className="inline-flex items-center gap-2">
        <HexMarker state="complete" />
        Traction
      </span>
    </div>
  );
}

function FounderPhotoPlaceholder({ name, company }) {
  const initials = (name || '')
    .split(/[\s&]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex h-full min-h-[12rem] lg:min-h-0 lg:flex-1 items-center justify-center overflow-hidden rounded-[28px] bg-[var(--navy)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,202,5,0.12),transparent_50%)]" />
      <span className="font-display text-[clamp(2.5rem,8svmin,8rem)] uppercase leading-none text-white/10">
        {initials}
      </span>
      <div className="absolute bottom-4 left-5 right-5 z-10">
        <p className="font-display text-[clamp(0.95rem,2.2svmin,2rem)] uppercase leading-none text-white/25">
          {company}
        </p>
      </div>
    </div>
  );
}

function FounderPhoto({ src, alt, company, name }) {
  const base = import.meta.env.BASE_URL;
  const [imgError, setImgError] = useState(false);

  if (imgError || !src) {
    return <FounderPhotoPlaceholder name={name} company={company} />;
  }

  return (
    <div className="relative h-full min-h-[12rem] lg:min-h-0 lg:flex-1 overflow-hidden rounded-[28px]">
      <img
        src={`${base}${src}`}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
        onError={() => setImgError(true)}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.4)_35%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,202,5,0.12),transparent_50%)]" />
      <div className="absolute bottom-4 left-5 right-5 z-10">
        <p className="font-display text-[clamp(0.95rem,2.2svmin,2rem)] uppercase leading-none text-white/25">
          {company}
        </p>
      </div>
    </div>
  );
}

function StorySlideRedesigned({ story }) {
  return (
    <SlideSection id={story.id} mode="dark">
      <div className="flex h-full flex-col">
        <div className="flex-none">
          <SectionRule label={story.label} tone="dark" compact />
        </div>

        <div className="mt-3 flex min-h-0 flex-1">
          <div className="grid h-full w-full grid-cols-12 gap-5 lg:gap-6">

            <div className="col-span-12 min-h-[10rem] max-h-[14rem] lg:col-span-4 lg:max-h-none">
              <FounderPhoto
                src={story.founderPhoto}
                alt={`${story.name}, founder of ${story.company}`}
                company={story.company}
                name={story.name}
              />
            </div>

            <div className="col-span-12 flex flex-col lg:col-span-8">

              <div className="flex-none">
                <p className="text-[0.78rem] uppercase tracking-[0.22em] text-white/50">
                  {story.name}
                </p>
                <h2 className="mt-1 font-display text-[clamp(1.8rem,5.5svmin,5.2rem)] uppercase leading-[0.90] tracking-[-0.02em] text-white">
                  {story.company}
                </h2>
                <p className="mt-2 text-[clamp(0.6rem,1svmin,0.95rem)] uppercase tracking-[0.15em] text-white/35">
                  {story.companyDescription}
                </p>
              </div>

              <div className="mt-4 flex-none">
                <p className="max-w-3xl text-[clamp(0.85rem,1.6svmin,1.5rem)] leading-[1.5] text-[var(--yellow)]">
                  {story.pullQuote}
                </p>
              </div>

              <div className="min-h-4 flex-1" />

              <div className="flex-none grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="mb-3 flex-none border-b border-white/8 pb-2 text-[0.78rem] uppercase tracking-[0.22em] text-white/40">
                    Then
                  </p>
                  <p className="min-h-0 flex-1 text-[clamp(0.7rem,1.15svmin,1.15rem)] leading-[1.65] text-white/70">
                    {story.thenSnapshot}
                  </p>
                </div>

                <div className="flex flex-col overflow-hidden rounded-[24px] border border-[var(--yellow)]/25 bg-[linear-gradient(180deg,rgba(255,202,5,0.10),rgba(255,202,5,0.03)_40%,rgba(255,255,255,0.02))] p-6">
                  <p className="mb-3 flex-none border-b border-[var(--yellow)]/15 pb-2 text-[0.78rem] uppercase tracking-[0.22em] text-[var(--yellow)]/60">
                    Now
                  </p>
                  <p className="min-h-0 flex-1 text-[clamp(0.7rem,1.15svmin,1.15rem)] leading-[1.65] text-white/90">
                    {story.nowSnapshot}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex-none">
                <div className="flex flex-wrap items-center gap-2">
                  {story.microProof.slice(0, 4).map((proof) => (
                    <div
                      key={proof}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[0.9rem] font-medium text-white/80"
                    >
                      {proof}
                    </div>
                  ))}
                  <div className="mx-2 h-5 w-px bg-white/15" />
                  <StoryBreadcrumb />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideSection>
  );
}

function MentorCard({ mentor }) {
  return (
    <article className="rounded-[28px] border border-[var(--navy)]/10 bg-white/80 p-5 shadow-panel backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[clamp(1.3rem,3svmin,2.6rem)] uppercase leading-[0.94] text-[var(--navy)]">
            {mentor.name}
          </p>
          <p className="mt-2 text-[0.75rem] uppercase tracking-[0.2em] text-[var(--orange)]">{mentor.title}</p>
        </div>
        <Chip tone="light">Mentor</Chip>
      </div>

      <p className="mt-5 text-base leading-7 text-[var(--navy)]/80">{mentor.background}</p>

      <div className="mt-5 rounded-[22px] border border-[var(--navy)]/10 bg-[var(--soft-gray)]/70 p-4">
        <p className="mb-2 text-[0.7rem] uppercase tracking-[0.2em] text-[var(--navy)]/55">Engagement</p>
        <p className="text-[15px] leading-6 text-[var(--navy)]/80">{mentor.engagement}</p>
      </div>

      <div className="mt-4 rounded-[22px] border border-[var(--orange)]/20 bg-[rgba(244,132,36,0.08)] p-4">
        <p className="mb-2 text-[0.7rem] uppercase tracking-[0.2em] text-[var(--orange)]">Impact</p>
        <p className="text-[15px] leading-6 text-[var(--navy)]/85">{mentor.impact}</p>
      </div>
    </article>
  );
}

function QuoteBlock({ quote, attribution, role, compact = false, tight = false }) {
  return (
    <blockquote
      className={cx(
        'min-h-0 overflow-hidden rounded-[28px] border border-white/10 bg-[var(--navy)] text-white',
        tight ? 'rounded-xl p-3 md:p-4' : compact ? 'p-5' : 'p-6 md:p-8'
      )}
    >
      <div
        className={cx(
          'font-display leading-none text-[var(--yellow)]',
          tight ? 'text-2xl md:text-3xl' : 'text-[3rem]'
        )}
      >
        &ldquo;
      </div>
      <p
        className={cx(
          'leading-snug text-white',
          tight ? 'mt-1.5 text-[clamp(0.6rem,1.15svmin,1.05rem)]' : compact ? 'mt-3 text-[clamp(0.85rem,1.8svmin,1.65rem)]' : 'mt-3 text-[clamp(1rem,2.3svmin,2.4rem)]'
        )}
      >
        {quote}
      </p>
      <footer className={cx('border-t border-white/10', tight ? 'mt-2.5 pt-2' : 'mt-6 pt-4')}>
        <p className={cx('font-medium text-white', tight && 'text-sm')}>{attribution}</p>
        <p className={cx('text-white/65', tight ? 'mt-0.5 text-xs' : 'mt-1 text-sm')}>{role}</p>
      </footer>
    </blockquote>
  );
}

function AnimatedNumber({ value, suffix = '', prefersReducedMotion }) {
  const [ref, isInView] = useInView({ threshold: 0.55, once: true });
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    if (!isInView) return undefined;

    let frameId;
    let startTime;

    const tick = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 1100, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isInView, prefersReducedMotion, value]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      {displayValue}
      {suffix}
    </span>
  );
}

function MetricCard({ metric, prefersReducedMotion }) {
  return (
    <article className="rounded-[26px] border border-[var(--navy)]/10 bg-white/80 p-5 shadow-panel backdrop-blur-sm">
      <div className="font-display text-[clamp(1.8rem,5svmin,5rem)] uppercase leading-none tracking-[-0.03em] text-[var(--navy)]">
        <AnimatedNumber
          value={metric.value}
          suffix={metric.suffix ?? ''}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
      <p className="mt-3 text-lg leading-snug text-[var(--navy)]">{metric.label}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--navy)]/65">{metric.detail}</p>
    </article>
  );
}

function ToggleSwitch({ enabled, onChange, label, id }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cx(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        enabled ? 'bg-[var(--orange)]' : 'bg-white/15'
      )}
      aria-label={label}
    >
      <span
        className={cx(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          enabled ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

function FullscreenIcon({ isFullscreen }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {isFullscreen ? (
        <>
          <path d="M6 2H2v4" />
          <path d="M10 2h4v4" />
          <path d="M6 14H2v-4" />
          <path d="M10 14h4v-4" />
        </>
      ) : (
        <>
          <path d="M2 6V2h4" />
          <path d="M14 6V2h-4" />
          <path d="M2 10v4h4" />
          <path d="M14 10v4h-4" />
        </>
      )}
    </svg>
  );
}

function NavigationControls({ sections, currentIndex, onNavigate, isOpen, onToggle, arrowNavEnabled, onToggleArrowNav, isFullscreen, onToggleFullscreen }) {
  const current = sections[currentIndex];

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-3">
        {isOpen ? (
          <div className="pointer-events-auto w-[18rem] rounded-[24px] border border-white/10 bg-[rgba(5,5,5,0.76)] p-4 text-white shadow-glow backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/45">Presenter controls</p>
              <button
                type="button"
                onClick={onToggle}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close navigation (Escape)"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>

            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-[1.6rem] uppercase leading-none text-white">{current.nav}</p>
                <p className="mt-1 text-sm text-white/65">{current.title}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                <div className="text-[0.62rem] uppercase tracking-[0.24em] text-white/40">Section</div>
                <div className="mt-1 font-display text-[1.7rem] leading-none text-[var(--yellow)]">
                  {String(currentIndex + 1).padStart(2, '0')}
                  <span className="text-white/25">/{String(sections.length).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="nav-button"
                disabled={currentIndex === 0}
                onClick={() => onNavigate(currentIndex - 1)}
              >
                <ArrowIcon direction="left" />
                Prev
              </button>
              <button
                type="button"
                className="nav-button"
                disabled={currentIndex === sections.length - 1}
                onClick={() => onNavigate(currentIndex + 1)}
              >
                Next
                <ArrowIcon direction="right" />
              </button>
            </div>

            <div className="mb-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-white/85">Arrow key navigation</p>
                  <p className="mt-0.5 text-[0.62rem] text-white/40">Left / Right arrows move between sections</p>
                </div>
                <ToggleSwitch enabled={arrowNavEnabled} onChange={onToggleArrowNav} label="Arrow key navigation" id="arrow-nav-toggle" />
              </div>

              <button
                type="button"
                onClick={onToggleFullscreen}
                className="nav-button w-full"
                aria-pressed={isFullscreen}
              >
                <FullscreenIcon isFullscreen={isFullscreen} />
                {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {sections.map((section, index) => {
                const state = index === currentIndex ? 'current' : index < currentIndex ? 'complete' : 'upcoming';
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => onNavigate(index)}
                    className="group flex items-center justify-center rounded-lg p-1 transition hover:bg-white/5"
                    aria-label={`Jump to ${section.nav}: ${section.title}`}
                    title={`${section.nav}: ${section.title}`}
                  >
                    <HexMarker state={state} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="pointer-events-auto group flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(5,5,5,0.76)] px-4 py-3 text-white shadow-glow backdrop-blur-xl transition hover:border-white/20"
            aria-label="Open presenter navigation (N)"
            title="Press N to toggle"
          >
            <HexMarker state="current" />
            <div className="text-left">
              <p className="font-display text-sm uppercase leading-none text-white">{current.nav}</p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-white/45">
                {String(currentIndex + 1).padStart(2, '0')}/{String(sections.length).padStart(2, '0')} &middot; N
                {arrowNavEnabled && ' · Keys'}
              </p>
            </div>
          </button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 border-t border-white/10 bg-[rgba(5,5,5,0.92)] px-4 py-3 text-white backdrop-blur-xl">
          <button
            type="button"
            className="nav-button nav-button--mobile"
            disabled={currentIndex === 0}
            onClick={() => onNavigate(currentIndex - 1)}
            aria-label="Go to previous section"
          >
            <ArrowIcon direction="left" />
          </button>

          <div className="min-w-0 text-center">
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/45">{current.nav}</p>
            <p className="truncate font-display text-[1.25rem] uppercase leading-none text-white">{current.title}</p>
          </div>

          <button
            type="button"
            className="nav-button nav-button--mobile"
            disabled={currentIndex === sections.length - 1}
            onClick={() => onNavigate(currentIndex + 1)}
            aria-label="Go to next section"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionIds = useMemo(() => sectionMeta.map((section) => section.id), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [arrowNavEnabled, setArrowNavEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToSection = (index) => {
    const safeIndex = Math.max(0, Math.min(index, sectionIds.length - 1));
    const target = document.getElementById(sectionIds[safeIndex]);

    if (!target) return;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen toggle failed', err);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash || !sectionIds.includes(hash)) return;

    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }, [sectionIds]);

  useEffect(() => {
    let frameId = 0;

    const updateCurrentSection = () => {
      const viewportCenter = window.scrollY + window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id, index) => {
        const node = document.getElementById(id);
        if (!node) return;

        const top = node.offsetTop;
        const height = node.offsetHeight;
        const center = top + height / 2;
        const distance = Math.abs(center - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex(closestIndex);
      frameId = 0;
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateCurrentSection);
    };

    requestUpdate();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [sectionIds]);

  useEffect(() => {
    const id = sectionIds[currentIndex];
    if (!id) return;
    const nextHash = `#${id}`;

    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  }, [currentIndex, sectionIds]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (navOpen) { setNavOpen(false); event.preventDefault(); }
        return;
      }

      const active = document.activeElement;
      const isTextInput = active?.matches?.('input, textarea, [contenteditable="true"]');

      if ((event.key === 'n' || event.key === 'N') && !isTextInput) {
        event.preventDefault();
        setNavOpen((v) => !v);
        return;
      }

      if ((event.key === 'f' || event.key === 'F') && !isTextInput) {
        event.preventDefault();
        toggleFullscreen();
        return;
      }

      if (arrowNavEnabled && !isTextInput && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        if (event.key === 'ArrowRight' && currentIndex < sectionIds.length - 1) {
          event.preventDefault();
          goToSection(currentIndex + 1);
          return;
        }
        if (event.key === 'ArrowLeft' && currentIndex > 0) {
          event.preventDefault();
          goToSection(currentIndex - 1);
          return;
        }
      }

      const isInteractive = active?.closest?.('button, a, input, textarea, select');
      if (isInteractive) return;

      let targetIndex = null;

      if (event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        targetIndex = currentIndex + 1;
      }

      if (event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        targetIndex = currentIndex - 1;
      }

      if (event.key === 'Home') targetIndex = 0;
      if (event.key === 'End') targetIndex = sectionIds.length - 1;

      if (targetIndex === null) return;

      event.preventDefault();
      goToSection(targetIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sectionIds.length, prefersReducedMotion, navOpen, arrowNavEnabled]);

  return (
    <div className={cx('page-shell pb-20 md:pb-0 transition-[padding] duration-300 ease-in-out', navOpen && 'md:pr-[21rem]')}>
      <NavigationControls sections={sectionMeta} currentIndex={currentIndex} onNavigate={goToSection} isOpen={navOpen} onToggle={() => setNavOpen((v) => !v)} arrowNavEnabled={arrowNavEnabled} onToggleArrowNav={setArrowNavEnabled} isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />

      <main>
        {/* 1. Opening */}
        <SlideSection id="opening" mode="dark" compact noOverflowHidden>
          <div className="flex h-full flex-col">
            {/* Compact header: logos + eyebrow */}
            <div className="flex-none">
              <SlideBrandRow />
              <div className="mt-2 lg:mt-3">
                <SectionRule label="BNext impact story" tone="dark" compact />
              </div>
            </div>

            {/* Flexible main: headline + body */}
            <div className="flex min-h-0 flex-1 flex-col">
              <h1 className="mt-3 flex-none font-display text-[clamp(1.75rem,5.5svmin,5.5rem)] uppercase leading-[0.88] tracking-[-0.03em] text-white lg:mt-4">
                From potential to traction
              </h1>
              <p className="mt-3 max-w-2xl flex-1 text-[clamp(0.7rem,1.35svmin,1.2rem)] leading-[1.4] text-white/75 lg:mt-4">
                {anchorLine}
              </p>
            </div>

            {/* Compact bottom: 3 cards */}
            <div className="mt-3 flex-none sm:mt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {openingPillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
                  >
                    <p className="font-display text-[clamp(0.8rem,1.8svmin,1.35rem)] uppercase leading-none text-[var(--yellow)]">{pillar.title}</p>
                    <p className="mt-2 text-[clamp(0.55rem,0.95svmin,0.9rem)] leading-[1.35] text-white/72">{pillar.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SlideSection>

        {/* 2. Early momentum / metrics */}
        <SlideSection id="evidence-outcomes" mode="light">
          <div className="grid h-full gap-4 md:grid-cols-12 md:gap-6">
            <div className="flex h-full min-h-0 flex-col justify-between md:col-span-4">
              <div>
                <SectionRule label="Evidence and outcomes" tone="light" />
                <h2 className="max-w-2xl font-display text-[clamp(1.6rem,4.8svmin,5rem)] uppercase leading-[0.92] tracking-[-0.03em] text-[var(--navy)]">
                  Early momentum, made visible.
                </h2>
                <p className="mt-6 max-w-xl text-[clamp(0.7rem,1.12svmin,1.08rem)] leading-8 text-[var(--navy)]/80">
                  Early indicators show strong engagement, increasing demand, and expanding participation across the BNext ecosystem. The numbers matter because they point to founder progress, ecosystem activation, and a stronger regional pipeline.
                </p>
              </div>

              <div className="rounded-[28px] border border-[var(--navy)]/10 bg-[var(--navy)] p-6 text-white shadow-glow">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/50">What this means for Brampton</p>
                <ul className="mt-4 space-y-3">
                  {bramptonImpacts.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/78">
                      <HexMarker state="complete" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {metrics.map((metric) => (
                  <MetricCard key={`${metric.label}-${metric.value}`} metric={metric} prefersReducedMotion={prefersReducedMotion} />
                ))}
              </div>
            </div>
          </div>
        </SlideSection>

        {/* 3–16. Founder stories */}
        {stories.map((story) => (
          <StorySlideRedesigned key={story.id} story={story} />
        ))}

        {/* 17. Mentor network */}
        <SlideSection id="mentor-network" mode="light">
          <div className="grid h-full gap-4 md:grid-cols-12 md:gap-6">
            <div className="flex h-full min-h-0 flex-col justify-between md:col-span-4">
              <div>
                <SectionRule label="Mentor network and support model" tone="light" />
                <h2 className="max-w-2xl font-display text-[clamp(1.6rem,4.8svmin,5rem)] uppercase leading-[0.92] tracking-[-0.03em] text-[var(--navy)]">
                  Experienced operators, directly engaged.
                </h2>
                <p className="mt-6 max-w-xl text-[clamp(0.7rem,1.12svmin,1.1rem)] leading-8 text-[var(--navy)]/80">
                  Unlike programs built around limited advisory touchpoints, BNext connects founders to mentors who actively shape decisions, accelerate learning, and open doors to critical opportunities.
                </p>
              </div>

              <div className="rounded-[28px] border border-[var(--navy)]/10 bg-[var(--soft-gray)]/70 p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--orange)]">Mentor network impact</p>
                <ul className="mt-4 space-y-3">
                  {mentorImpactSummary.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-7 text-[var(--navy)]/80">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--orange)]/20 bg-[rgba(244,132,36,0.08)] text-[var(--orange)]">
                        <ArrowIcon direction="right" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-4 lg:grid-cols-3">
                {mentors.map((mentor) => (
                  <MentorCard key={mentor.name} mentor={mentor} />
                ))}
              </div>
            </div>
          </div>
        </SlideSection>

        {/* 18. Access gap */}
        <SlideSection id="access-gap" mode="light">
          <div className="grid h-full gap-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-6">
              <SectionRule label="Program overview and purpose" tone="light" />
              <h2 className="max-w-3xl font-display text-[clamp(1.75rem,5svmin,5.4rem)] uppercase leading-[0.92] tracking-[-0.03em] text-[var(--navy)]">
                {accessGap.headlineA}
              </h2>
              <h3 className="mt-2 max-w-3xl font-display text-[clamp(1.4rem,4svmin,4.2rem)] uppercase leading-[0.95] tracking-[-0.025em] text-[var(--orange)]">
                {accessGap.headlineB}
              </h3>

              <div className="mt-6 max-w-2xl space-y-4 text-[clamp(0.7rem,1.15svmin,1.12rem)] leading-8 text-[var(--navy)]/80">
                {accessGap.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="grid h-full gap-4 sm:grid-cols-2">
                {accessGap.themes.slice(0, 2).map((item) => (
                  <article key={item.title} className="rounded-[28px] border border-[var(--navy)]/10 bg-white/80 p-5 shadow-panel">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--orange)]">Focus area</p>
                    <h4 className="mt-3 font-display text-[2rem] uppercase leading-[0.92] text-[var(--navy)]">
                      {item.title}
                    </h4>
                    <p className="mt-3 text-base leading-7 text-[var(--navy)]/78">{item.body}</p>
                  </article>
                ))}

                <article className="sm:col-span-2 rounded-[28px] border border-[var(--orange)]/18 bg-[linear-gradient(180deg,rgba(244,132,36,0.08),rgba(255,255,255,0.92))] p-6 shadow-panel">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--orange)]">Why BNext matters</p>
                  <div className="mt-4 grid gap-5 md:grid-cols-[1fr_0.9fr] md:items-end">
                    <div>
                      <p className="font-display text-[clamp(1.4rem,4svmin,3.8rem)] uppercase leading-[0.94] text-[var(--navy)]">
                        High-potential ideas move faster when access is intentional.
                      </p>
                      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--navy)]/78">
                        {accessGap.themes[2].body}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-[var(--navy)]/10 bg-[var(--navy)] p-5 text-white">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/50">Core framing</p>
                      <p className="mt-3 font-display text-[2rem] uppercase leading-[0.95] text-[var(--yellow)]">
                        Talent is already here.
                      </p>
                      <p className="mt-2 text-lg leading-7 text-white/75">The missing piece is ecosystem access.</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </SlideSection>

        {/* 19. Ecosystem role */}
        <SlideSection id="ecosystem-role" mode="light">
          <div className="grid h-full gap-4 md:grid-cols-12 md:gap-6">
            <div className="flex h-full min-h-0 flex-col justify-between md:col-span-5">
              <div>
                <SectionRule label="The role BNext plays in the ecosystem" tone="light" />
                <h2 className="max-w-3xl font-display text-[clamp(1.7rem,5svmin,5.1rem)] uppercase leading-[0.92] tracking-[-0.03em] text-[var(--navy)]">
                  Infrastructure, not only programming.
                </h2>
                <p className="mt-6 max-w-2xl text-[clamp(0.7rem,1.15svmin,1.12rem)] leading-8 text-[var(--navy)]/80">
                  Over the past year, BNext has become a trusted hub where immigrant founders, mentors, and ecosystem partners come together. It shortens the time it takes for founders to access the relationships, guidance, and opportunities that usually take years to build.
                </p>
              </div>

              <div className="rounded-[28px] border border-[var(--orange)]/20 bg-[rgba(244,132,36,0.08)] p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--orange)]">Why the model is distinct</p>
                <p className="mt-3 font-display text-[2rem] uppercase leading-[0.95] text-[var(--navy)]">
                  A connective layer for founder momentum.
                </p>
                <p className="mt-4 text-base leading-7 text-[var(--navy)]/80">
                  BNext helps globally trained talent fully participate in &mdash; and contribute to &mdash; the regional innovation economy.
                </p>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                {ecosystemPillars.map((pillar) => (
                  <article key={pillar.title} className="rounded-[26px] border border-[var(--navy)]/10 bg-white/80 p-5 shadow-panel">
                    <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--orange)]">Support pillar</p>
                    <h3 className="mt-3 font-display text-[1.9rem] uppercase leading-[0.94] text-[var(--navy)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[var(--navy)]/78">{pillar.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 rounded-[28px] border border-[var(--navy)]/10 bg-[var(--navy)] p-6 text-white shadow-glow">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/50">Ecosystem activation highlights</p>
                    <p className="mt-2 font-display text-[2rem] uppercase leading-[0.95] text-white">
                      Activity that turns access into participation.
                    </p>
                  </div>
                  <Chip tone="dark">Growing inbound demand</Chip>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {activationHighlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SlideSection>

        {/* 20. Community */}
        <SlideSection id="community-support" mode="light" compact noOverflowHidden>
          <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
            {/* Left: compact header + flexible quote */}
            <div className="flex min-h-0 flex-col md:col-span-6">
              <div className="flex-none">
                <SectionRule label="Community and ecosystem engagement" tone="light" compact />
                <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.2rem,3.6svmin,3.4rem)] uppercase leading-[0.88] tracking-[-0.03em] text-[var(--navy)] lg:mt-4">
                  Support extends beyond the startup itself.
                </h2>
                <p className="mt-3 max-w-2xl text-[clamp(0.6rem,1.05svmin,0.98rem)] leading-[1.45] text-[var(--navy)]/80 lg:mt-4">
                  Founders are not only building companies &mdash; they are navigating a new country, new systems, and new networks. By supporting both business development and day-to-day integration, BNext makes it easier to focus on long-term growth.
                </p>
              </div>
              <div className="mt-3 flex min-h-0 flex-1 flex-col md:mt-4">
                <QuoteBlock {...communityQuotes[0]} tight />
              </div>
            </div>

            {/* Right: compact grid + flexible quote */}
            <div className="flex min-h-0 flex-col md:col-span-6">
              <div className="flex-none">
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {communityContributions.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-xl border border-[var(--navy)]/10 bg-white/80 p-3 shadow-panel"
                    >
                      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[var(--orange)]">Support layer</p>
                      <h3 className="mt-1.5 font-display text-[clamp(0.65rem,1.35svmin,1.15rem)] uppercase leading-[0.95] text-[var(--navy)]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[0.75rem] leading-[1.35] text-[var(--navy)]/78">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex min-h-0 flex-1 flex-col md:mt-4">
                <QuoteBlock {...communityQuotes[1]} compact tight />
              </div>
            </div>
          </div>
        </SlideSection>

        {/* 21. Closing */}
        <SlideSection id="closing" mode="dark" compact noOverflowHidden>
          <div className="grid h-full min-h-0 gap-4 md:grid-cols-12 md:gap-6">
            {/* Left column: 3 zones */}
            <div className="flex min-h-0 flex-col md:col-span-8">
              {/* Compact header */}
              <div className="flex-none">
                <SlideBrandRow />
                <div className="mt-2 lg:mt-3">
                  <SectionRule label="Momentum and future potential" tone="dark" compact />
                </div>
              </div>

              {/* Flexible main text */}
              <div className="flex min-h-0 flex-1 flex-col">
                <h2 className="mt-3 flex-none font-display text-[clamp(1.5rem,4.5svmin,4.5rem)] uppercase leading-[0.88] tracking-[-0.03em] text-white lg:mt-4">
                  Access can change what happens next.
                </h2>
                <div className="mt-3 flex-1 space-y-2 text-[clamp(0.65rem,1.05svmin,1rem)] leading-[1.45] text-white/78 lg:mt-4">
                  {closingParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Compact bottom cards */}
              <div className="mt-3 flex-none sm:mt-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  {closingMarkers.map((marker) => (
                    <div key={marker} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm leading-[1.4] text-white/78">
                      {marker}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: centered bounded closing card */}
            <div className="flex items-center justify-center md:col-span-4">
              <div className="story-surface relative w-full max-h-[18rem] flex flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(255,202,5,0.28),transparent_24%),radial-gradient(circle_at_14%_100%,rgba(244,132,36,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_40%)]" />
                <div className="relative z-10">
                  <Chip tone="dark">Closing frame</Chip>
                  <p className="mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-white/55">Regional significance</p>
                  <p className="mt-2 font-display text-[clamp(1rem,2.5svmin,2rem)] uppercase leading-[0.94] text-[var(--yellow)]">
                    Brampton Next helps globally trained founders fully participate in the region's innovation economy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideSection>
      </main>
    </div>
  );
}
