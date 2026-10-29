import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  GraduationCap,
  Library,
  Mail,
  MapPin,
  Menu,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  ZoomIn,
  ZoomOut,
  Send,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Calendar
} from 'lucide-react';
import {
  PROFILE,
  CERTIFICATIONS,
  EXPERIENCES,
  EDUCATION_LIST,
  RESEARCH_AREAS,
  RESEARCH_METHODOLOGIES,
  SKILL_CATEGORIES,
  Certificate,
  Experience
} from './data/profileData';

/* =========================================================================
   ROUTER TYPES & PATH NORMALIZER
   Supports clean pathnames (/about) and hash fallbacks (#/about)
========================================================================= */
export type RoutePath =
  | '/'
  | '/about'
  | '/experience'
  | '/education'
  | '/research'
  | '/certifications'
  | '/skills'
  | '/contact';

function normalizePath(pathname: string, hash: string): RoutePath {
  const hashClean = hash.replace(/^#\/?/, '').toLowerCase().trim();
  if (hashClean) {
    if (hashClean === 'about') return '/about';
    if (hashClean === 'experience' || hashClean === 'work') return '/experience';
    if (hashClean === 'education') return '/education';
    if (hashClean === 'research' || hashClean === 'writing') return '/research';
    if (hashClean === 'certifications' || hashClean === 'certificates') return '/certifications';
    if (hashClean === 'skills' || hashClean === 'expertise') return '/skills';
    if (hashClean === 'contact') return '/contact';
    if (hashClean === '' || hashClean === 'hero') return '/';
  }

  const pathClean = pathname.replace(/^\//, '').toLowerCase().trim();
  if (pathClean === 'about') return '/about';
  if (pathClean === 'experience') return '/experience';
  if (pathClean === 'education') return '/education';
  if (pathClean === 'research') return '/research';
  if (pathClean === 'certifications') return '/certifications';
  if (pathClean === 'skills') return '/skills';
  if (pathClean === 'contact') return '/contact';

  return '/';
}

/* =========================================================================
   3D TILT CARD COMPONENT (Responsive, fine-pointer only)
========================================================================= */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxTilt?: number;
  glare?: boolean;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  'data-cursor'?: string;
}

function TiltCard({
  children,
  className = '',
  onClick,
  maxTilt = 4,
  glare = true,
  role,
  tabIndex,
  onKeyDown,
  'data-cursor': dataCursor
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsFinePointer(fine && !reduced);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    const tiltX = ((y / rect.height) - 0.5) * -maxTilt * 2;
    const tiltY = ((x / rect.width) - 0.5) * maxTilt * 2;

    setTransformStyle(`perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
    setGlarePosition({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    if (!isFinePointer) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isFinePointer) return;
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      data-cursor={dataCursor}
      style={{
        transform: isFinePointer ? transformStyle : undefined,
        transition: isHovered
          ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease-out'
      }}
      className={`tilt-card relative overflow-hidden ${className}`}
    >
      {children}
      {glare && isFinePointer && (
        <div
          className="tilt-glare"
          style={{
            ['--mouse-x' as string]: `${glarePosition.x}%`,
            ['--mouse-y' as string]: `${glarePosition.y}%`
          }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   HELPER FOR PILLAR ICONS
========================================================================= */
function getPillarIcon(title: string) {
  if (title.toLowerCase().includes('employability') || title.toLowerCase().includes('training')) {
    return <Users className="w-5 h-5 text-[#7251A3]" />;
  }
  if (title.toLowerCase().includes('corporate') || title.toLowerCase().includes('regulatory') || title.toLowerCase().includes('law') || title.toLowerCase().includes('practice')) {
    return <Scale className="w-5 h-5 text-[#7251A3]" />;
  }
  if (title.toLowerCase().includes('mindset') || title.toLowerCase().includes('leadership') || title.toLowerCase().includes('coaching')) {
    return <Sparkles className="w-5 h-5 text-[#7251A3]" />;
  }
  return <BookOpen className="w-5 h-5 text-[#7251A3]" />;
}

/* =========================================================================
   MAIN APP ROUTER COMPONENT
========================================================================= */
export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname, window.location.hash);
    }
    return '/';
  });

  // Certificate Modal State
  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);
  const [certZoom, setCertZoom] = useState<number>(1);

  // Experience filter state: strictly 'training' | 'research' | 'legal', defaults to 'training'
  const [experienceFilter, setExperienceFilter] = useState<'training' | 'legal' | 'research'>('training');

  // Skills live search
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>('');

  // Mobile navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Reading scroll progress for current page
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Hero interactive 3D subtle mouse tilt
  const [heroMouse, setHeroMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom cursor position state
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [cursorHoverType, setCursorHoverType] = useState<string | null>(null);

  // Contact form submission feedback state
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  /* -------------------------------------------------------------------------
     URL ROUTING & HISTORY NAVIGATION
  ------------------------------------------------------------------------- */
  const navigate = (path: RoutePath) => {
    if (currentPath !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      const target = normalizePath(window.location.pathname, window.location.hash);
      setCurrentPath(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  /* -------------------------------------------------------------------------
     CUSTOM DESKTOP CURSOR (FINE POINTER ONLY)
  ------------------------------------------------------------------------- */
  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) {
        setCursorHoverType(null);
        return;
      }

      if (target.closest('[data-cursor="cert"]')) {
        setCursorHoverType('cert');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.tilt-card')
      ) {
        setCursorHoverType('hover');
      } else {
        setCursorHoverType(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  /* -------------------------------------------------------------------------
     KEYBOARD ACCESSIBILITY (ESC TO CLOSE LIGHTBOX)
  ------------------------------------------------------------------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCertIndex(null);
        setCertZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* -------------------------------------------------------------------------
     SCROLL PROGRESS & REVEAL ANIMATIONS
  ------------------------------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPath]);

  useEffect(() => {
    const items = document.querySelectorAll('.reveal-item');
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80) {
        el.classList.add('revealed');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.05, rootMargin: '40px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPath, experienceFilter, skillSearchQuery]);

  /* -------------------------------------------------------------------------
     MEMOIZED DATA FILTERS
  ------------------------------------------------------------------------- */
  const filteredExperiences = useMemo(() => {
    return EXPERIENCES.filter((exp: Experience) => exp.category === experienceFilter);
  }, [experienceFilter]);

  const totalMatchingSkills = useMemo(() => {
    if (!skillSearchQuery.trim()) return 999;
    const q = skillSearchQuery.toLowerCase();
    return SKILL_CATEGORIES.reduce((total, cat) => {
      const matches = cat.skills.filter((s) => s.name.toLowerCase().includes(q));
      return total + matches.length;
    }, 0);
  }, [skillSearchQuery]);

  const activeCert: Certificate | null = useMemo(() => {
    if (activeCertIndex === null) return null;
    return CERTIFICATIONS[activeCertIndex] || null;
  }, [activeCertIndex]);

  /* -------------------------------------------------------------------------
     HANDLERS
  ------------------------------------------------------------------------- */
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroMouse({ x, y });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!formState.email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email.trim())) {
      setFormError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }
    if (!formState.subject.trim()) {
      setFormError('Please enter a subject.');
      return;
    }
    if (!formState.message.trim()) {
      setFormError('Please enter your message.');
      return;
    }
    setFormError(null);
    setFormSubmitted(true);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  /* -------------------------------------------------------------------------
     NAVIGATION LINKS
  ------------------------------------------------------------------------- */
  const NAV_LINKS: { path: RoutePath; label: string }[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/experience', label: 'Experience' },
    { path: '/education', label: 'Education' },
    { path: '/research', label: 'Research & Writing' },
    { path: '/certifications', label: 'Certifications' },
    { path: '/skills', label: 'Skills & Expertise' },
  ];

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-clip flex flex-col bg-[#FFFCF6] text-[#10152D] font-sans antialiased selection:bg-[#EAE1F7] selection:text-[#7251A3] ${
      cursorHoverType === 'hover' ? 'cursor-hover' : ''
    } ${cursorHoverType === 'cert' ? 'cursor-cert-hover' : ''}`}>

      {/* =========================================================================
          CUSTOM DESKTOP CURSOR (Fixed Overlay - Hidden on touch/mobile)
      ========================================================================= */}
      <div
        className="hidden md:block custom-cursor-dot pointer-events-none"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        aria-hidden="true"
      />
      <div
        className="hidden md:block custom-cursor-ring pointer-events-none"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        aria-hidden="true"
      />

      {/* =========================================================================
          HAIRLINE READING PROGRESS BAR
      ========================================================================= */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#FFF0B3] via-[#F8DCE8] via-[#7251A3] to-[#10152D] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* =========================================================================
          GLOBAL NAVBAR (Refined Editorial Top Bar)
      ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFCF6]/95 backdrop-blur-md border-b border-[#EAE1F7] transition-all">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6 min-w-0">
          {/* Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-xl lg:text-2xl font-serif font-bold tracking-tight text-[#10152D] min-w-0 hover:text-[#7251A3] transition-colors group shrink"
          >
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#FFF0B3] via-[#F8DCE8] to-[#EAE1F7] border border-[#EAE1F7] text-[#7251A3] font-serif font-bold text-xs sm:text-sm inline-flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              MS
            </span>
            <span className="truncate">Muskan Shokeen</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[#2D3748]">
            {NAV_LINKS.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#7251A3] ${
                    isActive ? 'text-[#10152D] font-bold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7251A3] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Primary Action Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact');
              }}
              className={`px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98] border ${
                currentPath === '/contact'
                  ? 'bg-[#583B85] text-white border-[#583B85]'
                  : 'bg-[#7251A3] text-white hover:bg-[#583B85] border-[#7251A3]'
              }`}
            >
              <span className="hidden sm:inline">Get in Touch</span>
              <span className="sm:hidden">Contact</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#7251A3] hover:text-[#10152D] bg-[#FFFCF6] rounded-lg border border-[#EAE1F7] focus:outline-none focus:ring-2 focus:ring-[#7251A3]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#EAE1F7] bg-[#FFFCF6] px-4 sm:px-6 py-4 space-y-3 shadow-md animate-in fade-in duration-150">
            {NAV_LINKS.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`block text-sm font-medium transition-colors ${
                  currentPath === item.path ? 'text-[#7251A3] font-bold' : 'text-[#2D3748] hover:text-[#7251A3]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact');
              }}
              className="block text-sm font-semibold text-[#7251A3] pt-2 border-t border-[#EAE1F7]"
            >
              Initiate Consultation →
            </a>
          </div>
        )}
      </header>

      {/* =========================================================================
          PAGE ROUTING VIEWPORT: Renders strictly the content of the selected page
      ========================================================================= */}
      <main className="flex-1">

        {/* -----------------------------------------------------------------------
            PAGE 1: HOME (/) — Editorial Narrative Monograph
        ----------------------------------------------------------------------- */}
        {currentPath === '/' && (
          <div className="animate-in fade-in duration-200">
            {/* Editorial Hero Section */}
            <section
              onMouseMove={handleHeroMouseMove}
              className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 md:pt-20 md:pb-24 border-b border-[#EAE1F7] overflow-hidden bg-gradient-to-br from-[#FFFCF6] via-[#FDF4F8] via-[#F6F1FC] to-[#FFF9E6]"
            >
              {/* Harmonious Ambient Orbs */}
              <div
                aria-hidden="true"
                style={{
                  transform: `translate(${heroMouse.x * -16}px, ${heroMouse.y * -16}px)`
                }}
                className="absolute -top-24 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-[#FFF0B3]/75 via-[#F8DCE8]/60 to-transparent blur-3xl pointer-events-none animate-orb-glow"
              />
              <div
                aria-hidden="true"
                style={{
                  transform: `translate(${heroMouse.x * 20}px, ${heroMouse.y * 20}px)`
                }}
                className="absolute -bottom-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-[#EAE1F7]/90 via-[#F8DCE8]/50 to-transparent blur-2xl pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/3 w-60 h-60 rounded-full bg-[#FFF0B3]/35 blur-3xl pointer-events-none"
              />

              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 relative z-10 w-full min-w-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-center">
                  {/* Left Column: Typographic Editorial Impact */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6 min-w-0">
                    {/* Eyebrow Kicker */}
                    <div className="reveal-item flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#7251A3]" />
                      <span>Advocate · PROTOUCH Certified Corporate Trainer · PhD Scholar</span>
                    </div>

                    {/* Headline with serif italic accents */}
                    <h1 className="reveal-item delay-75 text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-serif font-bold text-[#10152D] leading-[1.12] tracking-tight break-words">
                      Empowering minds. <br className="hidden sm:inline" />
                      <span className="italic font-normal text-[#7251A3]">Enriching lives.</span> <br className="hidden sm:inline" />
                      Advocating justice.
                    </h1>

                    {/* Engaging human editorial introduction */}
                    <p className="reveal-item delay-150 text-sm sm:text-base md:text-lg text-[#232B47] leading-relaxed max-w-2xl font-normal break-words">
                      Muskan Shokeen unites the analytical discipline of legal advocacy with the transformative energy of corporate communication. Currently mentoring future leaders at St. Andrews Institute and advancing doctoral legal scholarship in contemporary commercial jurisprudence.
                    </p>

                    {/* Clean unboxed metadata strip */}
                    <div className="reveal-item delay-225 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#4A5568] pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-[#10152D]">
                        <MapPin className="w-3.5 h-3.5 text-[#7251A3]" />
                        <span>Delhi, India</span>
                      </span>
                      <span className="text-[#D6C5EE] hidden sm:inline">·</span>
                      <span className="flex items-center gap-1.5 font-medium text-[#10152D]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#7251A3]" />
                        <span>Participant PRO-79635</span>
                      </span>
                      <span className="text-[#D6C5EE] hidden sm:inline">·</span>
                      <span className="flex items-center gap-1.5 font-medium text-[#10152D]">
                        <GraduationCap className="w-3.5 h-3.5 text-[#7251A3]" />
                        <span>GD Goenka PhD Scholar</span>
                      </span>
                    </div>

                    {/* Hero Action Buttons */}
                    <div className="reveal-item delay-300 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full">
                      <a
                        href="/certifications"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/certifications');
                        }}
                        className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#7251A3] hover:bg-[#583B85] border border-[#7251A3] rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Award className="w-4 h-4 text-[#FFF0B3]" />
                        <span>View Verified Certifications</span>
                      </a>
                      <a
                        href="/research"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/research');
                        }}
                        className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold text-[#10152D] bg-[#FFF0B3] hover:bg-[#FFE894] border border-[#F6E18B] rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Explore Legal Scholarship</span>
                        <ChevronRight className="w-4 h-4 text-[#7251A3]" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Editorial Monogram & Credential Seal Card */}
                  <div className="lg:col-span-5 relative mt-4 lg:mt-0 min-w-0">
                    <div
                      style={{
                        transform: `translate(${heroMouse.x * -14}px, ${heroMouse.y * -14}px)`
                      }}
                      className="hidden md:flex absolute -top-4 -left-3 lg:-left-6 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#EAE1F7] shadow-sm animate-float-gentle text-xs font-medium text-[#10152D]"
                    >
                      <div className="w-6 h-6 rounded-md bg-[#EAE1F7] flex items-center justify-center text-[#7251A3]">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <span>Advocate & PhD Scholar</span>
                    </div>

                    <div
                      style={{
                        transform: `translate(${heroMouse.x * 16}px, ${heroMouse.y * 16}px)`
                      }}
                      className="hidden md:flex absolute -bottom-4 -right-2 lg:-right-4 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#F8DCE8] shadow-sm animate-float-inverse text-xs font-medium text-[#10152D]"
                    >
                      <div className="w-6 h-6 rounded-md bg-[#F8DCE8] flex items-center justify-center text-[#7251A3]">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span>SHRM & CPD Certified</span>
                    </div>

                    <TiltCard
                      maxTilt={5}
                      className="mx-auto w-full max-w-[280px] sm:max-w-xs md:max-w-md bg-white rounded-2xl border-2 border-[#EAE1F7] p-4 sm:p-6 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="relative aspect-square sm:aspect-4/5 rounded-xl border-2 border-dashed border-[#7251A3]/30 bg-gradient-to-b from-[#FFFDF8] via-[#FDF2F7]/70 to-[#F6F1FC] flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden group">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#FFF0B3] via-[#F8DCE8] to-[#EAE1F7] shadow-xs flex items-center justify-center mb-3 sm:mb-4 border border-[#EAE1F7] transform transition-transform duration-300 group-hover:scale-105">
                          <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-[#7251A3]" />
                        </div>

                        <span className="text-[10px] sm:text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-1">
                          Official Profile Monograph
                        </span>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-[#10152D] mb-1">
                          Muskan Shokeen
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#4A5568] max-w-xs leading-relaxed hidden xs:block">
                          B.A. LL.B. · LL.M. (AI & Cyber Law) · Ph.D. Scholar
                        </p>

                        <div className="mt-3 px-3 py-1 rounded-md bg-[#EAE1F7] border border-[#D6C5EE] text-[10px] sm:text-[11px] font-semibold text-[#583B85] shadow-2xs">
                          Portrait slot reserved for official photo
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2.5 pt-1 text-center">
                        <div className="p-2.5 bg-[#FFFDF0] rounded-xl border border-[#F6E6A8]">
                          <div className="text-[10px] font-medium text-[#7C6A18] uppercase tracking-wider">Accreditations</div>
                          <div className="text-xs font-bold text-[#10152D] mt-0.5">SHRM, CPD, HRCI</div>
                        </div>
                        <div className="p-2.5 bg-[#FEF5F9] rounded-xl border border-[#F8DCE8]">
                          <div className="text-[10px] font-medium text-[#8F3E69] uppercase tracking-wider">Appointments</div>
                          <div className="text-xs font-bold text-[#10152D] mt-0.5">St. Andrews & Goenka</div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </div>

                {/* 4-Metric Monograph Strip */}
                <div className="reveal-item delay-375 mt-8 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-[#FFFDF2] via-[#FEF5F9] via-[#FAF6FE] to-[#FFFDF2] rounded-2xl border-2 border-[#EAE1F7] shadow-xs max-w-full">
                  <div className="space-y-1 p-2 rounded-lg bg-white/70 min-w-0">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#10152D] tabular-nums">4+</div>
                    <div className="text-xs text-[#4A5568]">Verified Global Accreditations</div>
                  </div>
                  <div className="space-y-1 p-2 rounded-lg bg-white/70 min-w-0">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#7251A3] tabular-nums">60+</div>
                    <div className="text-xs text-[#4A5568]">Recertification Credits (PDCs & HR)</div>
                  </div>
                  <div className="space-y-1 p-2 rounded-lg bg-white/70 min-w-0">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#10152D] tabular-nums">3</div>
                    <div className="text-xs text-[#4A5568]">Core Degrees (Ph.D., LL.M., LL.B.)</div>
                  </div>
                  <div className="space-y-1 p-2 rounded-lg bg-white/70 min-w-0">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#7251A3] tabular-nums">100%</div>
                    <div className="text-xs text-[#4A5568]">Verified Institutional Track</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Editorial Marquee Ribbon */}
            <div className="w-full bg-[#10152D] text-[#FFF0B3] py-3 overflow-hidden border-y border-[#7251A3]/30">
              <div className="animate-marquee whitespace-nowrap text-xs font-semibold uppercase tracking-widest flex items-center gap-8">
                <span>CORPORATE FACILITATOR</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>PROTOUCH CERTIFIED (PRO-79635)</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>ADVOCATE IN LAW</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>GD GOENKA PH.D. SCHOLAR</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>AI & CYBER JURISPRUDENCE (LL.M.)</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>ST. ANDREWS CAMPUS MENTOR</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>SHRM & CPD ACCREDITED</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>CORPORATE FACILITATOR</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>PROTOUCH CERTIFIED (PRO-79635)</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>ADVOCATE IN LAW</span>
                <span className="text-[#F8DCE8]">✦</span>
                <span>GD GOENKA PH.D. SCHOLAR</span>
                <span className="text-[#F8DCE8]">✦</span>
              </div>
            </div>

            {/* Editorial Showcase: Core Architecture */}
            <section className="py-12 sm:py-20 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="reveal-item max-w-3xl mb-8 sm:mb-14 min-w-0">
                  <div className="text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                    Professional Architecture
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#10152D] break-words">
                    The Nexus of Legal Precision and Human Communication
                  </h2>
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-[#4A5568] leading-relaxed break-words">
                    Explore curated sections detailing Muskan Shokeen&rsquo;s verified professional background, institutional teaching appointments, formal degrees, and international accreditations.
                  </p>
                </div>

                {/* 4 Feature Preview Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  {/* Card 1: About */}
                  <TiltCard
                    maxTilt={3}
                    className="reveal-item p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#FAF5FE] to-white border-2 border-[#EAE1F7] hover:border-[#7251A3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#EAE1F7] text-[#7251A3] flex items-center justify-center mb-4 border border-[#D6C5EE]">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#10152D] mb-2 break-words">
                        Professional Biography & Pillars
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mb-4 break-words">
                        Discover Muskan&rsquo;s interdisciplinary journey spanning university campus bootcamps, court litigation under NI & SARFAESI Acts, and adult learning psychology.
                      </p>
                    </div>
                    <a
                      href="/about"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/about');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7251A3] hover:text-[#583B85] pt-2"
                    >
                      <span>Read Full Biography</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </TiltCard>

                  {/* Card 2: Experience */}
                  <TiltCard
                    maxTilt={3}
                    className="reveal-item p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#FFFDF0] to-white border-2 border-[#F6E6A8] hover:border-[#7251A3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#FFF0B3] text-[#594400] flex items-center justify-center mb-4 border border-[#F4DE85]">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#10152D] mb-2 break-words">
                        Work Track & Verified Roles
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mb-4 break-words">
                        Chronological record across St. Andrews Institute of Technology & Management, Protouch, TruLegalSolutions, and Delhi judicial chambers.
                      </p>
                    </div>
                    <a
                      href="/experience"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/experience');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7251A3] hover:text-[#583B85] pt-2"
                    >
                      <span>View Experience Timeline</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </TiltCard>

                  {/* Card 3: Certifications */}
                  <TiltCard
                    maxTilt={3}
                    className="reveal-item p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#FEF5F9] to-white border-2 border-[#F8DCE8] hover:border-[#7251A3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#F8DCE8] text-[#7251A3] flex items-center justify-center mb-4 border border-[#ECC0D5]">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#10152D] mb-2 break-words">
                        Authentic Credentials Gallery
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mb-4 break-words">
                        Four verified certificate scans with high-resolution inspection, SHRM recertification credits (60 PDCs), and HRCI accreditations.
                      </p>
                    </div>
                    <a
                      href="/certifications"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/certifications');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7251A3] hover:text-[#583B85] pt-2"
                    >
                      <span>Inspect Scanned Certificates</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </TiltCard>

                  {/* Card 4: Research */}
                  <TiltCard
                    maxTilt={3}
                    className="reveal-item p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#FAF6FE] to-white border-2 border-[#DDD0F0] hover:border-[#7251A3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#EAE1F7] text-[#7251A3] flex items-center justify-center mb-4 border border-[#D6C5EE]">
                        <Library className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#10152D] mb-2 break-words">
                        Academic Writing & Legal Research
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mb-4 break-words">
                        Doctrinal statutory interpretation across AI ethics, cyber governance, SEBI compliance, and Companies Act jurisprudence.
                      </p>
                    </div>
                    <a
                      href="/research"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/research');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7251A3] hover:text-[#583B85] pt-2"
                    >
                      <span>Explore Legal Writing</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </TiltCard>
                </div>
              </div>
            </section>

            {/* Philosophy Pull-Quote */}
            <section className="reveal-item py-12 sm:py-16 bg-gradient-to-r from-[#FFFDF0] via-[#FEF5F9] to-[#FAF5FE] border-b border-[#EAE1F7]">
              <div className="max-w-4xl mx-auto px-3.5 sm:px-6 text-center space-y-3 sm:space-y-4 min-w-0">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white shadow-2xs border border-[#EAE1F7] text-xs font-semibold text-[#7251A3] uppercase tracking-wider max-w-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#7251A3] shrink-0" />
                  <span className="truncate">Philosophy on Continuous Growth</span>
                </div>
                <blockquote className="text-lg sm:text-2xl md:text-3xl font-serif italic text-[#10152D] leading-relaxed break-words">
                  &ldquo;Each certification represents more than just completing a course; it reflects the time invested in learning new skills, strengthening existing ones, and continuously pushing myself to grow both personally and professionally.&rdquo;
                </blockquote>
                <div className="text-xs font-bold text-[#7251A3] pt-1 sm:pt-2 break-words">
                  — Muskan Shokeen · ProTouch Certified Facilitator & Advocate
                </div>
              </div>
            </section>

            {/* Institutional Collaboration Banner */}
            <section className="py-12 sm:py-18 bg-[#FFFCF6]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 text-center w-full min-w-0">
                <div className="reveal-item max-w-2xl mx-auto p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[#FEF5F9] via-[#FAF5FE] to-[#FFFDF2] border-2 border-[#EAE1F7] shadow-sm space-y-3 sm:space-y-4 min-w-0">
                  <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#10152D] break-words">
                    Available for Institutional Training & Placement Bootcamps
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed break-words">
                    Facilitating university campus employability drives, executive corporate workshops, and specialized legal research consulting.
                  </p>
                  <div className="pt-2">
                    <a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/contact');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#7251A3] hover:bg-[#583B85] rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                    >
                      <span>Initiate Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            PAGE 2: ABOUT (/about) — Narrative Biography & Core Pillars
        ----------------------------------------------------------------------- */}
        {currentPath === '/about' && (
          <div className="animate-in fade-in duration-200">
            {/* Page Header Banner */}
            <div className="bg-gradient-to-b from-[#FAF5FE] to-[#FFFCF6] py-8 sm:py-14 border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                    className="hover:underline text-[#4A5568]"
                  >
                    Home
                  </a>
                  <span>/</span>
                  <span>Professional Narrative</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#10152D] break-words">
                  About Muskan Shokeen
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-[#4A5568] max-w-2xl break-words">
                  Advocate, PROTOUCH Certified Corporate Trainer, and Doctoral Legal Scholar bridging academic rigor and corporate employability.
                </p>
              </div>
            </div>

            {/* Narrative Editorial Profile */}
            <section className="py-10 sm:py-18 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-start">
                  {/* Left Column: At a Glance Sidebar */}
                  <div className="reveal-item lg:col-span-5 space-y-4 min-w-0">
                    <div className="text-xs font-semibold text-[#7251A3] uppercase tracking-wider">
                      Verified Identity
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#10152D] leading-tight break-words">
                      Transforming student potential into workplace readiness.
                    </h2>

                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FEF5F9] via-[#FAF5FE] to-[#FFFDF2] border-2 border-[#EAE1F7] space-y-3 shadow-xs min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#7251A3]">
                        Scholarly Trajectory
                      </div>
                      <div className="text-xs sm:text-sm text-[#10152D] leading-relaxed break-words">
                        <strong>Ph.D. Scholar in Law</strong> at GD Goenka University, following an <strong>LL.M. in Artificial Intelligence and Cyber Law</strong> from Chandigarh University and a five-year <strong>B.A. LL.B.</strong> from Lloyd Law College.
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#EAE1F7] space-y-2.5 text-xs min-w-0">
                      <div className="font-bold text-[#10152D] uppercase tracking-wider text-[11px] text-[#7251A3]">
                        Key Highlights
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#FAF5FE]">
                        <span className="text-[#4A5568]">Current Campus:</span>
                        <span className="font-semibold text-[#10152D]">St. Andrews Institute</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#FAF5FE]">
                        <span className="text-[#4A5568]">Accreditation ID:</span>
                        <span className="font-semibold text-[#7251A3]">PRO - 79635</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#FAF5FE]">
                        <span className="text-[#4A5568]">Bar Practice:</span>
                        <span className="font-semibold text-[#10152D]">Delhi Courts & DRT</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#4A5568]">Jurisprudence Focus:</span>
                        <span className="font-semibold text-[#10152D]">AI, Cyber & Companies Act</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Editorial Narrative Prose */}
                  <div className="reveal-item delay-150 lg:col-span-7 space-y-4 sm:space-y-6 text-[#232B47] text-sm sm:text-base leading-relaxed min-w-0">
                    <p className="text-base sm:text-lg text-[#10152D] font-medium leading-relaxed break-words">
                      {PROFILE.about.lead}
                    </p>
                    <p className="break-words">
                      {PROFILE.about.currentRole} By organizing structured interview bootcamps, group discussion simulations,
                      and individualized feedback cycles, students develop the practical verbal clarity and psychological resilience
                      required to thrive in competitive campus placement drives.
                    </p>
                    <p className="break-words">
                      {PROFILE.about.interdisciplinaryEdge} Her background in litigation and commercial laws gives students and corporate
                      teams an authentic understanding of professional workplace accountability, regulatory compliance, and workplace ethics.
                    </p>

                    {/* Verified Milestones */}
                    <div className="pt-4 border-t border-[#EAE1F7] grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFFDF0] border border-[#F6E6A8] shadow-2xs min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#FFF0B3] flex items-center justify-center text-[#7251A3] shrink-0 mt-0.5 border border-[#F4DE85]">
                          <CheckCircle className="w-4 h-4 text-[#7251A3]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-[#10152D] break-words">Holistic Employability</div>
                          <div className="text-xs text-[#4A5568] break-words">Personalized resume building, mock interviews, and GD rubrics.</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF5FE] border border-[#E2D5F3] shadow-2xs min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#EAE1F7] flex items-center justify-center text-[#7251A3] shrink-0 mt-0.5 border border-[#D6C5EE]">
                          <CheckCircle className="w-4 h-4 text-[#7251A3]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-[#10152D] break-words">Corporate Law Research</div>
                          <div className="text-xs text-[#4A5568] break-words">Specialist writing on Companies Act, SEBI, and Insolvency.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Pillars of Practice */}
            <section className="py-10 sm:py-18 bg-gradient-to-b from-[#F7F2FC]/70 via-[#FFFDF5]/40 to-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="reveal-item max-w-2xl mb-8 sm:mb-12 min-w-0">
                  <div className="text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                    Core Pillars of Practice
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#10152D] break-words">
                    Where Legal Rigor Meets Human Development
                  </h2>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-[#4A5568] leading-relaxed break-words">
                    Synthesizing legal precision, emotional intelligence, and instructional acumen into impactful training and research.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {PROFILE.pillars.map((pillar, idx) => {
                    const cardStyles = [
                      { bg: 'bg-gradient-to-b from-[#FFFDF2] to-white', border: 'border-[#F6E6A8]', iconBg: 'bg-[#FFF0B3] border-[#F4DE85] text-[#594400]' },
                      { bg: 'bg-gradient-to-b from-[#FAF5FE] to-white', border: 'border-[#E2D5F3]', iconBg: 'bg-[#EAE1F7] border-[#D6C5EE] text-[#7251A3]' },
                      { bg: 'bg-gradient-to-b from-[#FEF5F9] to-white', border: 'border-[#F8DCE8]', iconBg: 'bg-[#F8DCE8] border-[#ECC0D5] text-[#7251A3]' },
                      { bg: 'bg-gradient-to-b from-[#FAF6FE] to-white', border: 'border-[#DDD0F0]', iconBg: 'bg-[#EAE1F7] border-[#D6C5EE] text-[#7251A3]' }
                    ][idx % 4];

                    return (
                      <TiltCard
                        key={idx}
                        maxTilt={4}
                        className={`reveal-item p-5 sm:p-6 rounded-2xl ${cardStyles.bg} border-2 ${cardStyles.border} hover:border-[#7251A3] hover:shadow-md transition-all flex flex-col justify-between min-w-0`}
                      >
                        <div>
                          <div className={`w-10 h-10 rounded-xl ${cardStyles.iconBg} border flex items-center justify-center mb-4 sm:mb-5 shadow-2xs`}>
                            {getPillarIcon(pillar.title)}
                          </div>
                          <h3 className="text-base sm:text-lg font-serif font-bold text-[#10152D] mb-2 break-words">
                            {pillar.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed break-words">
                            {pillar.description}
                          </p>
                        </div>
                      </TiltCard>
                    );
                  })}
                </div>

                {/* Subpage Footer Navigation */}
                <div className="mt-10 sm:mt-12 pt-6 border-t border-[#EAE1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                  <a
                    href="/experience"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/experience');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#7251A3] hover:text-[#583B85]"
                  >
                    <span>Proceed to Professional Experience Timeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/contact');
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#7251A3] rounded-xl hover:bg-[#583B85] transition-all"
                  >
                    <span>Connect for Advisory / Training</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            PAGE 3: EXPERIENCE (/experience) — Editorial Timeline & Journey
        ----------------------------------------------------------------------- */}
        {currentPath === '/experience' && (
          <div className="animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-[#FFFDF0] via-[#FAF5FE]/50 to-[#FFFCF6] py-8 sm:py-14 border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                    className="hover:underline text-[#4A5568]"
                  >
                    Home
                  </a>
                  <span>/</span>
                  <span>Career Trajectory</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#10152D] break-words">
                  Professional Experience
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-[#4A5568] max-w-2xl break-words">
                  A chronological milestone journey across campus soft skills facilitation, corporate litigation practice, and academic legal research consultancy.
                </p>
              </div>
            </div>

            {/* Experience Content with Verified 3 Filters */}
            <section className="py-10 sm:py-18 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                {/* Filter Controls Row */}
                <div className="reveal-item flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-12 gap-3 sm:gap-4 w-full min-w-0">
                  <div className="text-xs text-[#4A5568]">
                    Showing <strong className="text-[#10152D] font-bold">{filteredExperiences.length}</strong> verified role{filteredExperiences.length === 1 ? '' : 's'} in selected track
                  </div>

                  <div className="w-full sm:w-auto min-w-0 flex items-center gap-1.5 p-1 bg-[#FAF5FE] rounded-xl border border-[#EAE1F7] overflow-x-auto max-w-full scrollbar-none shadow-xs">
                    <button
                      onClick={() => setExperienceFilter('training')}
                      className={`shrink-0 px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        experienceFilter === 'training'
                          ? 'bg-[#7251A3] text-white shadow-xs'
                          : 'text-[#583B85] hover:text-[#10152D] hover:bg-white/80'
                      }`}
                    >
                      Training & Placement
                    </button>
                    <button
                      onClick={() => setExperienceFilter('research')}
                      className={`shrink-0 px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        experienceFilter === 'research'
                          ? 'bg-[#7251A3] text-white shadow-xs'
                          : 'text-[#583B85] hover:text-[#10152D] hover:bg-white/80'
                      }`}
                    >
                      Academic Research
                    </button>
                    <button
                      onClick={() => setExperienceFilter('legal')}
                      className={`shrink-0 px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        experienceFilter === 'legal'
                          ? 'bg-[#7251A3] text-white shadow-xs'
                          : 'text-[#583B85] hover:text-[#10152D] hover:bg-white/80'
                      }`}
                    >
                      Legal Practice
                    </button>
                  </div>
                </div>

                {/* Editorial Timeline Cards */}
                <div className="reveal-item space-y-6 sm:space-y-8 relative before:hidden md:before:block before:absolute before:left-8 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#7251A3] before:via-[#F8DCE8] before:to-[#EAE1F7]">
                  {filteredExperiences.length === 0 ? (
                    <div className="p-8 text-center bg-[#FAF5FE] rounded-2xl border border-[#EAE1F7] text-[#583B85] text-sm">
                      No roles found in this category.
                    </div>
                  ) : (
                    filteredExperiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="relative md:pl-20 min-w-0"
                      >
                        {/* Timeline Node on Desktop */}
                        <div className="hidden md:flex absolute left-6 top-8 w-5 h-5 rounded-full bg-white border-4 border-[#7251A3] shadow-xs z-10" />

                        <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-white border-2 border-[#EAE1F7] shadow-xs hover:border-[#7251A3] hover:shadow-md transition-all min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 min-w-0">
                            <div className="min-w-0">
                              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#10152D] break-words">
                                {exp.title}
                              </h3>
                              <div className="text-xs sm:text-sm font-bold text-[#7251A3] mt-0.5 break-words">
                                {exp.company}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs max-w-full">
                              <span className="font-semibold text-[#594400] bg-[#FFF0B3] border border-[#F4DE85] px-2.5 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#594400]" />
                                <span>{exp.period}</span>
                              </span>
                              <span className="font-medium text-[#7251A3] bg-[#F8DCE8] px-2.5 py-0.5 rounded-md shrink-0">{exp.type}</span>
                              <span className="text-[#4A5568] break-words">{exp.location}</span>
                            </div>
                          </div>

                          {exp.summary && (
                            <p className="text-xs sm:text-sm text-[#4A5568] italic mb-3 sm:mb-4 break-words">
                              {exp.summary}
                            </p>
                          )}

                          <ul className="space-y-2 mb-4 sm:mb-6">
                            {exp.responsibilities.map((resp, rIdx) => (
                              <li key={rIdx} className="text-xs sm:text-sm text-[#232B47] flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7251A3] mt-2 shrink-0" />
                                <span className="leading-relaxed break-words">{resp}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="pt-3 sm:pt-4 border-t border-[#EAE1F7] flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-full">
                            <span className="text-xs font-semibold text-[#583B85]">Key Competencies:</span>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs max-w-full">
                              {exp.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2.5 py-0.5 rounded-md bg-[#FAF5FE] border border-[#EAE1F7] text-[#583B85] font-medium hover:bg-[#EAE1F7] hover:text-[#10152D] transition-colors break-words"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subpage Link to Certifications */}
                <div className="mt-10 sm:mt-14 pt-6 border-t border-[#EAE1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                  <a
                    href="/certifications"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/certifications');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#7251A3] hover:text-[#583B85]"
                  >
                    <span>View Accredited Certifications from ProTouch & SHRM</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/contact');
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#7251A3] rounded-xl hover:bg-[#583B85] transition-all"
                  >
                    <span>Inquire for Placement Drives</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            PAGE 4: EDUCATION (/education) — Visual Academic Pathway
        ----------------------------------------------------------------------- */}
        {currentPath === '/education' && (
          <div className="animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-[#FFFDF5] via-[#FAF5FE]/40 to-[#FFFCF6] py-8 sm:py-14 border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                    className="hover:underline text-[#4A5568]"
                  >
                    Home
                  </a>
                  <span>/</span>
                  <span>Academic Foundations</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#10152D] break-words">
                  Degrees & Doctoral Research
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-[#4A5568] max-w-2xl break-words">
                  Rigorous formal legal training spanning undergraduate law, postgraduate AI & cyber legal scholarship, and active doctoral inquiry.
                </p>
              </div>
            </div>

            {/* Academic Pathway Pathway Grid */}
            <section className="py-10 sm:py-18 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                {/* Visual Pathway Connector Bar on Desktop */}
                <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[#FFFDF0] via-[#FEF5F9] to-[#FAF5FE] border border-[#EAE1F7] flex flex-wrap items-center justify-between text-xs text-[#583B85] gap-2">
                  <span className="font-semibold text-[#10152D]">Academic Journey:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">B.A. LL.B. (Lloyd)</span>
                    <span>→</span>
                    <span className="font-bold">LL.M. in AI & Cyber Law (Chandigarh)</span>
                    <span>→</span>
                    <span className="font-bold text-[#7251A3]">Ph.D. Scholar in Law (GD Goenka)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
                  {EDUCATION_LIST.map((edu, idx) => {
                    const eduThemes = [
                      {
                        card: 'bg-gradient-to-b from-[#FAF5FE] to-white border-[#D6C5EE]',
                        periodText: 'text-[#7251A3]',
                        statusBadge: 'bg-[#EAE1F7] text-[#583B85] border-[#D6C5EE]',
                        instText: 'text-[#7251A3]',
                        step: 'Step 3 · Doctoral Research'
                      },
                      {
                        card: 'bg-gradient-to-b from-[#FEF5F9] to-white border-[#F6D0E1]',
                        periodText: 'text-[#A13A68]',
                        statusBadge: 'bg-[#F8DCE8] text-[#8F3E69] border-[#F6D0E1]',
                        instText: 'text-[#A13A68]',
                        step: 'Step 2 · Postgraduate LL.M.'
                      },
                      {
                        card: 'bg-gradient-to-b from-[#FFFDF0] to-white border-[#F6E6A8]',
                        periodText: 'text-[#594400]',
                        statusBadge: 'bg-[#FFF0B3] text-[#594400] border-[#F4DE85]',
                        instText: 'text-[#7251A3]',
                        step: 'Step 1 · Integrated Law Degree'
                      }
                    ][idx % 3];

                    return (
                      <TiltCard
                        key={idx}
                        maxTilt={4}
                        className={`reveal-item p-5 sm:p-7 rounded-2xl ${eduThemes.card} border-2 hover:border-[#7251A3] hover:shadow-lg transition-all flex flex-col justify-between min-w-0`}
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#7251A3] mb-1">
                            {eduThemes.step}
                          </div>
                          <div className="flex items-center justify-between text-xs mb-3 min-w-0">
                            <span className={`font-bold ${eduThemes.periodText}`}>{edu.period}</span>
                            <span className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${eduThemes.statusBadge}`}>
                              {edu.status}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#10152D] mb-1 break-words">
                            {edu.degree}
                          </h3>
                          <div className="text-xs sm:text-sm font-semibold text-[#2D3748] mb-1 break-words">
                            {edu.field}
                          </div>
                          <div className={`text-xs font-bold ${eduThemes.instText} mb-3 break-words`}>
                            {edu.institution}
                          </div>

                          <p className="text-xs text-[#4A5568] leading-relaxed pt-3 border-t border-[#EAE1F7]/60 break-words">
                            {edu.highlights}
                          </p>
                        </div>
                      </TiltCard>
                    );
                  })}
                </div>

                {/* Subpage Link to Research */}
                <div className="mt-10 sm:mt-14 pt-6 border-t border-[#EAE1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                  <a
                    href="/research"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/research');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#7251A3] hover:text-[#583B85]"
                  >
                    <span>View Academic Legal Research & Publications</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            PAGE 5: RESEARCH & WRITING (/research) — Scholarly Briefs
        ----------------------------------------------------------------------- */}
        {currentPath === '/research' && (
          <div className="animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-[#FAF6FE] via-[#FEF7FA]/40 to-[#FFFCF6] py-8 sm:py-14 border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                    className="hover:underline text-[#4A5568]"
                  >
                    Home
                  </a>
                  <span>/</span>
                  <span>Scholarship & Jurisprudence</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#10152D] break-words">
                  Academic Writing & Legal Research
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-[#4A5568] max-w-2xl break-words">
                  Doctrinal analysis, statutory interpretation, and legal research consulting spanning corporate governance, financial regulations, and artificial intelligence law.
                </p>
              </div>
            </div>

            {/* Research Content */}
            <section className="py-10 sm:py-18 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                {/* 4 Curated Research Focus Themes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mb-10 sm:mb-12">
                  {RESEARCH_AREAS.map((res, rIdx) => {
                    const resStyles = [
                      {
                        card: 'bg-gradient-to-b from-[#FAF5FE] to-white border-[#EAE1F7]',
                        badge: 'bg-[#EAE1F7] text-[#583B85] border-[#D6C5EE]',
                        topicTag: 'bg-[#FFFDF2] border-[#F6E6A8] text-[#10152D]',
                        number: '01'
                      },
                      {
                        card: 'bg-gradient-to-b from-[#FEF5F9] to-white border-[#F8DCE8]',
                        badge: 'bg-[#F8DCE8] text-[#7251A3] border-[#F6D0E1]',
                        topicTag: 'bg-[#FAF5FE] border-[#EAE1F7] text-[#10152D]',
                        number: '02'
                      },
                      {
                        card: 'bg-gradient-to-b from-[#FFFDF0] to-white border-[#F6E6A8]',
                        badge: 'bg-[#FFF0B3] text-[#594400] border-[#F4DE85]',
                        topicTag: 'bg-[#FAF5FE] border-[#EAE1F7] text-[#10152D]',
                        number: '03'
                      },
                      {
                        card: 'bg-gradient-to-b from-[#FAF6FE] to-white border-[#DDD0F0]',
                        badge: 'bg-[#EAE1F7] text-[#7251A3] border-[#D6C5EE]',
                        topicTag: 'bg-[#FEF5F9] border-[#F8DCE8] text-[#10152D]',
                        number: '04'
                      }
                    ][rIdx % 4];

                    return (
                      <TiltCard
                        key={res.id}
                        maxTilt={4}
                        className={`reveal-item p-5 sm:p-7 rounded-2xl ${resStyles.card} border-2 hover:border-[#7251A3] hover:shadow-md transition-all flex flex-col justify-between min-w-0`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center justify-between text-xs mb-3 min-w-0">
                            <span className="font-serif font-bold text-lg text-[#7251A3] opacity-60">{resStyles.number}</span>
                            <span className={`font-bold px-2.5 py-0.5 rounded-md border ${resStyles.badge} shrink-0`}>{res.category}</span>
                            <span className="text-[11px] text-[#4A5568] italic font-medium truncate ml-2">{res.scope}</span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#10152D] mb-2 break-words">
                            {res.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed mb-4 break-words">
                            {res.doctrinalFocus}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#EAE1F7] min-w-0">
                          <div className="text-[11px] font-bold text-[#583B85] uppercase tracking-wider mb-2">
                            Core Subject Matter
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs max-w-full">
                            {res.topics.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className={`px-2.5 py-1 rounded-md border font-medium ${resStyles.topicTag} break-words`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </TiltCard>
                    );
                  })}
                </div>

                {/* Research Methodologies */}
                <div className="reveal-item p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-[#FAF5FE] via-[#FEF7FA] to-[#FFFDF2] border-2 border-[#EAE1F7] space-y-4 sm:space-y-6 shadow-xs min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#7251A3] uppercase tracking-wider min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-[#EAE1F7] flex items-center justify-center text-[#7251A3] shrink-0">
                      <Library className="w-3.5 h-3.5" />
                    </div>
                    <span className="break-words">Research Rigor & Academic Writing Methodology</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {RESEARCH_METHODOLOGIES.map((meth, mIdx) => (
                      <div key={mIdx} className="space-y-1.5 p-4 rounded-xl bg-white/80 border border-[#EAE1F7] min-w-0">
                        <div className="text-sm font-bold text-[#10152D] break-words">{meth.title}</div>
                        <div className="text-xs text-[#4A5568] leading-relaxed break-words">{meth.description}</div>
                      </div>
                    ))}
                  </div>

                  {/* Academic Notice */}
                  <div className="pt-4 border-t border-[#EAE1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs text-[#4A5568] min-w-0">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#7251A3] shrink-0 mt-0.5" />
                      <span className="break-words">
                        <strong className="text-[#10152D]">Academic Milestone Notice:</strong> Active doctoral research at GD Goenka University and commercial research writing. Verified papers and monographs will be indexed here with authoritative citations as they are formally published.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subpage Links */}
                <div className="mt-10 sm:mt-14 pt-6 border-t border-[#EAE1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                  <a
                    href="/certifications"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/certifications');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#7251A3] hover:text-[#583B85]"
                  >
                    <span>Inspect Verified Certifications Gallery</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            PAGE 6: CERTIFICATIONS (/certifications) — Verified Credentials Gallery
        ----------------------------------------------------------------------- */}
        {currentPath === '/certifications' && (
          <div className="animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-[#FEF5F9] via-[#FAF5FE]/50 to-[#FFFCF6] py-8 sm:py-14 border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                    className="hover:underline text-[#4A5568]"
                  >
                    Home
                  </a>
                  <span>/</span>
                  <span>Credentials</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full min-w-0">
                  <div className="min-w-0">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#10152D] break-words">
                      Authentic Credentials & Accreditations
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm md:text-base text-[#4A5568] max-w-2xl break-words">
                      Directly verified from official training institute assessments and accreditation registries. Click on any certificate to inspect the high-resolution scanned document.
                    </p>
                  </div>
                  <div className="w-full sm:w-auto text-[11px] sm:text-xs text-[#594400] bg-[#FFFDF0] p-3 rounded-xl border border-[#F6E6A8] shadow-2xs font-medium max-w-full flex flex-wrap items-center gap-1.5 shrink-0 self-start md:self-auto">
                    <span className="font-bold text-[#10152D]">Participant ID:</span>
                    <span>PRO - 79635</span>
                    <span className="text-[#D4A017] hidden sm:inline">·</span>
                    <span className="font-bold text-[#10152D]">Date:</span>
                    <span>August 23, 2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Gallery */}
            <section className="py-10 sm:py-18 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  {CERTIFICATIONS.map((cert, cIdx) => (
                    <TiltCard
                      key={cert.id}
                      maxTilt={4}
                      data-cursor="cert"
                      onClick={() => {
                        setActiveCertIndex(cIdx);
                        setCertZoom(1);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveCertIndex(cIdx);
                          setCertZoom(1);
                        }
                      }}
                      className="reveal-item group cursor-pointer rounded-2xl bg-gradient-to-b from-[#FAF5FE] to-white border-2 border-[#EAE1F7] hover:border-[#7251A3] transition-all overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between min-w-0"
                    >
                      {/* Visual Certificate Frame */}
                      <div className="relative aspect-16/10 bg-white border-b-2 border-[#EAE1F7] overflow-hidden p-3 sm:p-4 flex items-center justify-center">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain rounded transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-[#10152D]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
                          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#7251A3] text-[11px] sm:text-xs font-semibold text-white rounded-lg shadow-md flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-transform border border-white/20">
                            <Eye className="w-3.5 h-3.5 text-[#FFF0B3]" />
                            <span>Inspect High-Resolution Certificate</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 min-w-0">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs mb-2 max-w-full">
                            <span className="font-bold text-[#7251A3] bg-[#EAE1F7] px-2 py-0.5 rounded-md border border-[#D6C5EE] shrink-0">{cert.issuer}</span>
                            <span aria-hidden="true" className="text-[#D6C5EE] shrink-0">·</span>
                            <span className="font-medium text-[#4A5568] break-words">{cert.partnerOrAccreditor}</span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#10152D] group-hover:text-[#7251A3] transition-colors break-words">
                            {cert.title}
                          </h3>

                          <p className="mt-2 text-xs sm:text-sm text-[#4A5568] leading-relaxed break-words">
                            {cert.summary}
                          </p>
                        </div>

                        <div className="pt-3 sm:pt-4 border-t border-[#EAE1F7] flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs max-w-full">
                          <div className="text-[#4A5568] text-[11px] sm:text-xs break-words">
                            <span className="font-bold text-[#10152D]">Signatory:</span> {cert.signatory}
                          </div>
                          {cert.creditsDescription && (
                            <div className="font-semibold text-[#583B85] bg-[#EAE1F7] px-2.5 py-1 rounded-md text-[11px] sm:text-xs border border-[#D6C5EE] break-words">
                              {cert.creditsDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  ))}
                </div>

                {/* Subpage Link to Skills */}
                <div className="mt-10 sm:mt-14 pt-6 border-t border-[#EAE1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                  <a
                    href="/skills"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/skills');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#7251A3] hover:text-[#583B85]"
                  >
                    <span>View Matrix of Core Skills & Workplace Competencies</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/contact');
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#7251A3] rounded-xl hover:bg-[#583B85] transition-all"
                  >
                    <span>Request Verified Dossier</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            PAGE 7: SKILLS & EXPERTISE (/skills) — Capability Matrix
        ----------------------------------------------------------------------- */}
        {currentPath === '/skills' && (
          <div className="animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-[#F6F1FC]/50 via-[#FFFDF5]/30 to-[#FFFCF6] py-8 sm:py-14 border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                    className="hover:underline text-[#4A5568]"
                  >
                    Home
                  </a>
                  <span>/</span>
                  <span>Core Competencies</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full min-w-0">
                  <div className="min-w-0">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#10152D] break-words">
                      Skills & Domains of Expertise
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm md:text-base text-[#4A5568] max-w-2xl break-words">
                      Verified skills recorded across corporate training programs, court litigation practice, and academic legal research.
                    </p>
                  </div>

                  {/* Search Input with Clear Button */}
                  <div className="relative w-full md:w-72 max-w-full shrink-0">
                    <Search className="w-4 h-4 text-[#7251A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search skills (e.g., Training, Legal)..."
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-white border-2 border-[#EAE1F7] focus:outline-none focus:border-[#7251A3] focus:ring-2 focus:ring-[#7251A3]/20 transition-all shadow-xs"
                    />
                    {skillSearchQuery && (
                      <button
                        onClick={() => setSkillSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#7251A3] hover:text-[#10152D] cursor-pointer"
                        aria-label="Clear search query"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Content */}
            <section className="py-10 sm:py-18 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                {totalMatchingSkills === 0 ? (
                  <div className="p-6 sm:p-8 text-center bg-white rounded-2xl border-2 border-[#EAE1F7] space-y-2 shadow-sm max-w-md mx-auto min-w-0">
                    <p className="text-sm font-semibold text-[#10152D] break-words">
                      No skills matching &ldquo;{skillSearchQuery}&rdquo;
                    </p>
                    <p className="text-xs text-[#4A5568] break-words">
                      Try searching for keywords such as &ldquo;Communication&rdquo;, &ldquo;Research&rdquo;, &ldquo;Placement&rdquo;, or &ldquo;Legal&rdquo;.
                    </p>
                    <button
                      onClick={() => setSkillSearchQuery('')}
                      className="mt-2 px-3.5 py-1.5 text-xs font-semibold text-[#7251A3] bg-[#EAE1F7] border border-[#D6C5EE] rounded-lg hover:bg-[#D6C5EE] transition-colors cursor-pointer"
                    >
                      Clear Search Filter
                    </button>
                  </div>
                ) : (
                  <div className="reveal-item grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
                    {SKILL_CATEGORIES.map((cat, idx) => {
                      const filteredSkills = cat.skills.filter((s) =>
                        s.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
                      );

                      if (skillSearchQuery && filteredSkills.length === 0) return null;

                      const catThemes = [
                        { topBorder: 'border-t-4 border-t-[#7251A3]', border: 'border-[#EAE1F7]', titleColor: 'text-[#10152D]', badgeBg: 'bg-[#EAE1F7] text-[#583B85]' },
                        { topBorder: 'border-t-4 border-t-[#D96B9B]', border: 'border-[#F8DCE8]', titleColor: 'text-[#10152D]', badgeBg: 'bg-[#F8DCE8] text-[#8F3E69]' },
                        { topBorder: 'border-t-4 border-t-[#D4A017]', border: 'border-[#F6E6A8]', titleColor: 'text-[#10152D]', badgeBg: 'bg-[#FFF0B3] text-[#594400]' }
                      ][idx % 3];

                      return (
                        <div
                          key={idx}
                          className={`p-5 sm:p-7 bg-white rounded-2xl ${catThemes.topBorder} border-x-2 border-b-2 ${catThemes.border} shadow-sm hover:shadow-md transition-shadow min-w-0`}
                        >
                          <h3 className={`text-lg sm:text-xl font-serif font-bold ${catThemes.titleColor} mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-[#FAF5FE] break-words`}>
                            {cat.category}
                          </h3>
                          <div className="space-y-2.5 sm:space-y-3">
                            {filteredSkills.map((s, sIdx) => (
                              <div key={sIdx} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg group hover:bg-[#FAF5FE] transition-colors min-w-0">
                                <span className="font-medium text-[#10152D] group-hover:text-[#7251A3] transition-colors truncate">
                                  {s.name}
                                </span>
                                {s.context && (
                                  <span className={`text-[10px] sm:text-[11px] ${catThemes.badgeBg} px-2 py-0.5 rounded font-medium shrink-0 ml-1.5`}>{s.context}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subpage Link to Experience */}
                <div className="mt-10 sm:mt-14 pt-6 border-t border-[#EAE1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                  <a
                    href="/experience"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/experience');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#7251A3] hover:text-[#583B85]"
                  >
                    <span>Inspect How These Skills Are Applied in Verified Roles</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            PAGE 8: CONTACT (/contact) — Consultation & Inquiry Space
        ----------------------------------------------------------------------- */}
        {currentPath === '/contact' && (
          <div className="animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-[#FAF5FE] via-[#FEF5F9]/40 to-[#FFFCF6] py-8 sm:py-14 border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                    className="hover:underline text-[#4A5568]"
                  >
                    Home
                  </a>
                  <span>/</span>
                  <span>Connect</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#10152D] break-words">
                  Initiate a Consultation
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-[#4A5568] max-w-2xl break-words">
                  Available for campus soft skills bootcamps, employability and placement training, corporate facilitation, and academic legal research consulting.
                </p>
              </div>
            </div>

            {/* Contact Details & Inquiry Form */}
            <section className="py-10 sm:py-18 bg-[#FFFCF6] border-b border-[#EAE1F7]">
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start w-full min-w-0">
                  <div className="reveal-item lg:col-span-5 space-y-4 sm:space-y-6 min-w-0">
                    <div>
                      <div className="text-xs font-semibold text-[#7251A3] uppercase tracking-wider mb-2">
                        Engagement Scope
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#10152D] break-words">
                        Collaboration Channels
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#4A5568] leading-relaxed break-words">
                        Direct outreach options for academic institutions, university placement departments, corporate HR teams, and legal research initiatives.
                      </p>
                    </div>

                    {/* Direct Info Card */}
                    <div className="p-5 sm:p-6 bg-white rounded-2xl border-2 border-[#EAE1F7] space-y-4 text-xs shadow-sm min-w-0">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#EAE1F7] flex items-center justify-center text-[#7251A3] shrink-0 mt-0.5 border border-[#D6C5EE]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#10152D] text-sm break-words">Location</div>
                          <div className="text-[#4A5568] mt-0.5 break-words">Delhi, India (Available for on-site & remote engagements)</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#F8DCE8] flex items-center justify-center text-[#7251A3] shrink-0 mt-0.5 border border-[#ECC0D5]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#10152D] text-sm break-words">Direct Contact Channel</div>
                          <div className="text-[#4A5568] mt-0.5 break-all">
                            {PROFILE.emailPlaceholder}
                            <span className="block text-[11px] font-semibold text-[#7251A3] mt-0.5 break-words">
                              (Official email reserved — use the form below for immediate inquiries)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#FFF0B3] flex items-center justify-center text-[#594400] shrink-0 mt-0.5 border border-[#F4DE85]">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#10152D] text-sm break-words">Current Primary Engagement</div>
                          <div className="text-[#4A5568] mt-0.5 break-words">
                            Soft Skill Trainer at St. Andrews Institute of Technology & Management
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Inquiry Form */}
                  <div className="reveal-item delay-150 lg:col-span-7 min-w-0">
                    <div className="p-5 sm:p-7 md:p-8 bg-white rounded-2xl border-2 border-[#EAE1F7] shadow-md min-w-0">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#10152D] mb-1 sm:mb-2 break-words">
                        Send a Message
                      </h3>
                      <p className="text-xs text-[#4A5568] mb-4 sm:mb-6 break-words">
                        Complete the form below to initiate an inquiry for corporate training programs, placement schedule collaborations, or academic research.
                      </p>

                      {formSubmitted ? (
                        <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF5FE] border-2 border-[#D6C5EE] text-center space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200 min-w-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#FFF0B3] via-[#F8DCE8] to-[#EAE1F7] text-[#7251A3] flex items-center justify-center mx-auto shadow-sm border border-[#D6C5EE]">
                            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#7251A3]" />
                          </div>
                          <div className="space-y-1.5 min-w-0">
                            <h4 className="text-lg sm:text-xl font-serif font-bold text-[#10152D] break-words">
                              Thanks for reaching out!
                            </h4>
                            <p className="text-sm font-semibold text-[#7251A3] break-words">
                              The contact form will be available soon.
                            </p>
                          </div>
                          <p className="text-xs text-[#4A5568] max-w-md mx-auto leading-relaxed break-words">
                            Thank you, <strong>{formState.name}</strong>. Direct message dispatch is currently being prepared as Muskan Shokeen's official professional email and mail service are finalized. Your inquiry regarding <em>&ldquo;{formState.subject}&rdquo;</em> has been captured in this browser session.
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                setFormSubmitted(false);
                                setFormState({
                                  name: '',
                                  email: '',
                                  subject: '',
                                  message: ''
                                });
                              }}
                              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-[#7251A3] bg-white border-2 border-[#D6C5EE] rounded-xl hover:bg-[#FAF5FE] hover:border-[#7251A3] transition-all shadow-xs cursor-pointer"
                            >
                              Send Another Message
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-4 min-w-0">
                          {formError && (
                            <div className="p-3 text-xs text-red-800 bg-red-50/90 border border-red-200 rounded-xl flex items-center gap-2 break-words">
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                              <span>{formError}</span>
                            </div>
                          )}

                          {/* Recipient Display Field (Pre-filled, non-editable) */}
                          <div className="min-w-0">
                            <label className="block text-xs font-semibold text-[#10152D] mb-1.5">
                              Recipient
                            </label>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:px-3.5 sm:py-2.5 bg-[#FAF5FE] border-2 border-[#EAE1F7] rounded-xl text-xs sm:text-sm min-w-0">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-[#7251A3] text-[#FFF0B3] flex items-center justify-center font-serif font-bold text-[11px] shrink-0">
                                  MS
                                </div>
                                <div className="min-w-0 truncate">
                                  <span className="font-semibold text-[#10152D]">Muskan Shokeen</span>
                                  <span className="text-[11px] text-[#4A5568] hidden sm:inline ml-2">
                                    · Corporate Trainer & Legal Researcher
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-medium text-[#7251A3] bg-[#EAE1F7] px-2.5 py-0.5 rounded-full border border-[#D6C5EE] self-start sm:self-auto shrink-0">
                                Email to be added later
                              </span>
                            </div>
                          </div>

                          {/* Your Name and Your Email Address */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 min-w-0">
                            <div className="min-w-0">
                              <label htmlFor="contact-name" className="block text-xs font-semibold text-[#10152D] mb-1.5">
                                Your Name *
                              </label>
                              <input
                                id="contact-name"
                                type="text"
                                required
                                value={formState.name}
                                onChange={(e) => {
                                  setFormState({ ...formState, name: e.target.value });
                                  if (formError) setFormError(null);
                                }}
                                placeholder="e.g. Dr. Rajesh Sharma"
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border-2 border-[#EAE1F7] bg-white text-[#10152D] placeholder-slate-400 focus:outline-none focus:border-[#7251A3] focus:ring-2 focus:ring-[#7251A3]/20 transition-all hover:border-[#D6C5EE] min-w-0 max-w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label htmlFor="contact-email" className="block text-xs font-semibold text-[#10152D] mb-1.5">
                                Your Email Address *
                              </label>
                              <input
                                id="contact-email"
                                type="email"
                                required
                                value={formState.email}
                                onChange={(e) => {
                                  setFormState({ ...formState, email: e.target.value });
                                  if (formError) setFormError(null);
                                }}
                                placeholder="e.g. name@institution.edu"
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border-2 border-[#EAE1F7] bg-white text-[#10152D] placeholder-slate-400 focus:outline-none focus:border-[#7251A3] focus:ring-2 focus:ring-[#7251A3]/20 transition-all hover:border-[#D6C5EE] min-w-0 max-w-full"
                              />
                            </div>
                          </div>

                          {/* Subject */}
                          <div className="min-w-0">
                            <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#10152D] mb-1.5">
                              Subject *
                            </label>
                            <input
                              id="contact-subject"
                              type="text"
                              required
                              value={formState.subject}
                              onChange={(e) => {
                                setFormState({ ...formState, subject: e.target.value });
                                if (formError) setFormError(null);
                              }}
                              placeholder="e.g. Corporate Training Inquiry / Placement Schedule / Academic Research"
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border-2 border-[#EAE1F7] bg-white text-[#10152D] placeholder-slate-400 focus:outline-none focus:border-[#7251A3] focus:ring-2 focus:ring-[#7251A3]/20 transition-all hover:border-[#D6C5EE] min-w-0 max-w-full"
                            />
                          </div>

                          {/* Message */}
                          <div className="min-w-0">
                            <label htmlFor="contact-message" className="block text-xs font-semibold text-[#10152D] mb-1.5">
                              Message *
                            </label>
                            <textarea
                              id="contact-message"
                              required
                              rows={4}
                              value={formState.message}
                              onChange={(e) => {
                                setFormState({ ...formState, message: e.target.value });
                                if (formError) setFormError(null);
                              }}
                              placeholder="Please describe your student cohort size, workshop objectives, dates, or collaboration scope..."
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border-2 border-[#EAE1F7] bg-white text-[#10152D] placeholder-slate-400 focus:outline-none focus:border-[#7251A3] focus:ring-2 focus:ring-[#7251A3]/20 transition-all hover:border-[#D6C5EE] resize-y min-w-0 max-w-full"
                            />
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-[#7251A3] hover:bg-[#583B85] border border-[#7251A3] rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#7251A3] focus:ring-offset-2 flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                              <Send className="w-4 h-4 text-[#FFF0B3]" />
                              <span>Send Message</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* =========================================================================
          GLOBAL FOOTER (Consistent Across All Pages)
      ========================================================================= */}
      <footer className="mt-auto border-t-2 border-[#7251A3]/30 bg-gradient-to-b from-[#10152D] to-[#160E2E] text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-white/10 min-w-0">
            <div className="md:col-span-6 space-y-3 min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-[#7251A3] border border-[#D6C5EE]/40 text-[#FFF0B3] font-serif font-bold text-xs inline-flex items-center justify-center shrink-0">
                  MS
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-white break-words">Muskan Shokeen</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed font-normal break-words">
                Soft Skills Trainer · PROTOUCH Certified Corporate Facilitator · Advocate · Academic Legal Researcher · PhD Scholar in Law.
              </p>
              <div className="text-xs text-[#F8DCE8] pt-1 font-serif italic break-words">
                &ldquo;Empowering minds. Enriching lives. Advocating justice.&rdquo;
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col sm:flex-row justify-between md:justify-end gap-6 sm:gap-8 text-xs text-slate-300 min-w-0">
              <div className="space-y-2 min-w-0">
                <div className="text-[#FFF0B3] font-semibold uppercase tracking-wider text-[11px]">Distinct Pages</div>
                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                      }}
                      className="hover:text-[#FFF0B3] transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/about');
                      }}
                      className="hover:text-[#FFF0B3] transition-colors"
                    >
                      About Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/experience"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/experience');
                      }}
                      className="hover:text-[#FFF0B3] transition-colors"
                    >
                      Work Track
                    </a>
                  </li>
                  <li>
                    <a
                      href="/education"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/education');
                      }}
                      className="hover:text-[#FFF0B3] transition-colors"
                    >
                      Education
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 min-w-0">
                <div className="text-[#F8DCE8] font-semibold uppercase tracking-wider text-[11px]">Credentials & Work</div>
                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="/research"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/research');
                      }}
                      className="hover:text-[#F8DCE8] transition-colors"
                    >
                      Legal Research & Writing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/certifications"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/certifications');
                      }}
                      className="hover:text-[#F8DCE8] transition-colors"
                    >
                      Verified Certifications
                    </a>
                  </li>
                  <li>
                    <a
                      href="/skills"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/skills');
                      }}
                      className="hover:text-[#F8DCE8] transition-colors"
                    >
                      Competencies Matrix
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/contact');
                      }}
                      className="hover:text-[#F8DCE8] transition-colors"
                    >
                      Inquire / Consult
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400 min-w-0">
            <div className="break-words">
              © {new Date().getFullYear()} Muskan Shokeen. All rights reserved.
            </div>
            <div className="text-[11px] text-slate-400 break-words text-center sm:text-right">
              Verified portfolio documentation based on official academic & professional records.
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          GLOWING FLOATING BACK BUTTON
      ========================================================================= */}
      <button
        type="button"
        onClick={handleGoBack}
        aria-label="Go back to previous page"
        title="Go back to previous page (or Home)"
        data-cursor="hover"
        className="fixed bottom-4 left-4 z-40 sm:bottom-8 sm:left-8 group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-xs border-2 border-[#EAE1F7] hover:border-[#7251A3] text-[#7251A3] hover:text-[#583B85] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#7251A3] focus:ring-offset-2 focus:ring-offset-[#FFFCF6] animate-pulse-glow cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span className="sr-only">Go back to previous page</span>
      </button>

      {/* =========================================================================
          GLOBAL CERTIFICATE INSPECTION MODAL (Lightbox with Zoom, Reset, & Prev/Next)
      ========================================================================= */}
      {activeCert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setActiveCertIndex(null);
            setCertZoom(1);
          }}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] border-2 border-[#EAE1F7] animate-in zoom-in-95 duration-200 m-1 sm:m-0 min-w-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-3 py-2.5 sm:px-6 sm:py-4 border-b border-[#EAE1F7] flex items-center justify-between gap-2 sm:gap-3 bg-[#FAF5FE] min-w-0">
              <div className="truncate pr-1 min-w-0 flex-1">
                <div className="text-[10px] sm:text-[11px] font-bold text-[#7251A3] uppercase tracking-wider truncate">
                  Verified Official Document · {activeCert.issuer}
                </div>
                <h3 className="text-sm sm:text-lg font-serif font-bold text-[#10152D] truncate">
                  {activeCert.title}
                </h3>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setCertZoom((prev) => Math.min(prev + 0.25, 2.5))}
                  className="p-1.5 rounded-lg border border-[#EAE1F7] bg-white text-[#7251A3] hover:text-[#10152D] transition-colors hover:bg-[#EAE1F7] cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCertZoom((prev) => Math.max(prev - 0.25, 0.75))}
                  className="p-1.5 rounded-lg border border-[#E8E4D9] bg-white text-[#7251A3] hover:text-[#10152D] transition-colors hover:bg-[#EAE1F7] cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCertZoom(1)}
                  className="p-1.5 rounded-lg border border-[#EAE1F7] bg-white text-[#7251A3] hover:text-[#10152D] transition-colors hover:bg-[#EAE1F7] cursor-pointer"
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveCertIndex(null);
                    setCertZoom(1);
                  }}
                  className="p-1.5 rounded-lg border border-[#EAE1F7] bg-white text-[#7251A3] hover:text-[#10152D] transition-colors hover:bg-[#EAE1F7] cursor-pointer"
                  title="Close (ESC)"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Certificate Viewport with Previous/Next Arrows */}
            <div className="relative p-2 sm:p-6 bg-[#10152D] flex-1 overflow-auto flex items-center justify-center min-h-[220px] sm:min-h-[380px]">
              <button
                onClick={() => {
                  setActiveCertIndex((prev) => (prev !== null ? (prev - 1 + CERTIFICATIONS.length) % CERTIFICATIONS.length : 0));
                  setCertZoom(1);
                }}
                className="absolute left-2 sm:left-4 z-10 p-1.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-[#7251A3] transition-colors shadow-md backdrop-blur-xs cursor-pointer"
                title="Previous Certificate (←)"
                aria-label="Previous Certificate"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div
                style={{ transform: `scale(${certZoom})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200"
              >
                <img
                  src={activeCert.image}
                  alt={activeCert.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[50vh] sm:max-h-[60vh] max-w-full object-contain rounded shadow-lg bg-white"
                />
              </div>

              <button
                onClick={() => {
                  setActiveCertIndex((prev) => (prev !== null ? (prev + 1) % CERTIFICATIONS.length : 0));
                  setCertZoom(1);
                }}
                className="absolute right-2 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-[#7251A3] transition-colors shadow-md backdrop-blur-xs cursor-pointer"
                title="Next Certificate (→)"
                aria-label="Next Certificate"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Detail Drawer */}
            <div className="px-3 py-2.5 sm:px-6 sm:py-4 bg-[#FAF5FE] border-t border-[#EAE1F7] text-xs min-w-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-2 min-w-0">
                <div className="min-w-0">
                  <span className="text-[#4A5568] block text-[10px] sm:text-[11px]">Participant ID</span>
                  <span className="font-bold text-[#10152D] truncate block">{activeCert.participantId}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[#4A5568] block text-[10px] sm:text-[11px]">Date of Issue</span>
                  <span className="font-bold text-[#10152D] truncate block">{activeCert.date}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[#4A5568] block text-[10px] sm:text-[11px]">Accreditation</span>
                  <span className="font-bold text-[#10152D] truncate block">{activeCert.partnerOrAccreditor}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[#4A5568] block text-[10px] sm:text-[11px]">Authorized Signatory</span>
                  <span className="font-bold text-[#10152D] truncate block">{activeCert.signatory}</span>
                </div>
              </div>

              {activeCert.creditsDescription && (
                <div className="mt-1.5 pt-1.5 border-t border-[#EAE1F7] text-[#7251A3] font-semibold flex items-center gap-1.5 text-[11px] sm:text-xs min-w-0">
                  <CheckCircle className="w-3.5 h-3.5 text-[#7251A3] shrink-0" />
                  <span className="break-words">{activeCert.creditsDescription}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
