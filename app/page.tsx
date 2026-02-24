'use client';

import { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent } from 'react';

/* ─── Assessment Modal ─── */
function AssessmentModal({ onClose }: { onClose: () => void }) {
  const INTERVIEW_URL = 'https://talent.flowmingo.ai/interview/5a733f53-19b0-437b-9960-d96e27a9d0cb/?utm_source=chatgpt.com';

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-x" onClick={onClose} aria-label="Close">&times;</button>

        <div className="modal-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        </div>
        <h2>Profile Submitted!</h2>
        <p className="modal-desc">You&apos;re now in the Matrix Digital pipeline. Your profile will be reviewed and routed to matching projects.</p>

        <div className="modal-divider" />

        <div className="modal-assessment">
          <span className="modal-badge">Optional</span>
          <h3>Take the Technical Assessment</h3>
          <p>Complete an AI-powered interview (~15 min) to earn a <strong>Validated</strong> badge and get 3&times; more project matches.</p>
          <ul>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Conversational format — no whiteboard puzzles
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Results shared only with matched enterprises
            </li>
          </ul>
        </div>

        <div className="modal-actions">
          <a href={INTERVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            Start Assessment
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </a>
          <button className="btn btn-ghost" onClick={onClose}>Maybe Later</button>
        </div>
        <p className="modal-footnote">You can always take the assessment later.</p>
      </div>
    </div>
  );
}

/* ─── Terminal Typing Lines ─── */
const TERMINAL_LINES = [
  { prefix: '>', text: ' Initializing AI & Automation Architect pipeline...', color: 'cyan' },
  { prefix: '>', text: ' Deploying WordPress + AI Builder to production...', color: 'green' },
  { prefix: '>', text: ' Full-Stack AI Innovator → matched to 3 projects...', color: 'purple' },
  { prefix: '>', text: ' Aspiring AI Engineer → entering 32-Node journey...', color: 'yellow' },
  { prefix: '$', text: ' matrix deploy --all-nodes --status=validated ✓', color: 'green' },
];

/* ─── Archetype Data ─── */
const ARCHETYPES = [
  {
    icon: '⚡',
    title: 'AI & Automation Architect',
    desc: 'Enterprise-grade Python & Make.com workflows. You build the invisible systems that 10× operations overnight.',
    tag: 'Bimodal Agent Syncing',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  },
  {
    icon: '🧩',
    title: 'WordPress + AI Builder',
    desc: 'AI chatbots and automated content engines on WordPress. You turn static sites into living, thinking platforms.',
    tag: 'Portfolio Applications',
    gradient: 'linear-gradient(135deg, #0052FF, #38BDF8)',
  },
  {
    icon: '🚀',
    title: 'Full-Stack AI Innovator',
    desc: 'Next.js, Neon, Prisma — end to end. You architect the entire stack from database schema to deployed edge.',
    tag: 'Developer Matrix Listing',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
  },
  {
    icon: '🔬',
    title: 'Aspiring AI Engineer',
    desc: 'From Pandas theory to real-world model fine-tuning. You\'re building the foundation for tomorrow\'s breakthroughs.',
    tag: '32-Node Validation',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
  },
];

/* ─── Platform Features ─── */
const PLATFORM_FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" /><circle cx="12" cy="5" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
        <line x1="12" y1="7" x2="12" y2="10" /><line x1="14" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="10" y2="12" /><line x1="12" y1="14" x2="12" y2="18" />
      </svg>
    ),
    title: 'Developer Matrix',
    desc: 'A real-time network map of every validated node. See who\'s building what, across which stacks, and where the enterprise demand is flowing.',
    visual: 'network',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Portfolio Applications',
    desc: 'Live-feed portfolio showcases that demonstrate real deployed work — not theoretical projects. Enterprises see your code running in production.',
    visual: 'portfolio',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
      </svg>
    ),
    title: '32-Node User Journey',
    desc: 'A structured validation pipeline from profile creation to enterprise deployment. Each node is a checkpoint that proves capability, not credentials.',
    visual: 'journey',
  },
];

/* ─── 32-Node Journey Steps ─── */
const JOURNEY_NODES = [
  { num: '01', label: 'Profile Created', status: 'done' },
  { num: '08', label: 'Stack Validated', status: 'done' },
  { num: '16', label: 'Sprint Completed', status: 'active' },
  { num: '24', label: 'Enterprise Matched', status: 'pending' },
  { num: '32', label: 'Deployed to Production', status: 'pending' },
];

/* ════════════════════════════════════════════ */
/*               MAIN PAGE                     */
/* ════════════════════════════════════════════ */
export default function HomePage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [step, setStep] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const skillRef = useRef<HTMLInputElement>(null);

  /* Terminal typing state */
  const [termLine, setTermLine] = useState(0);
  const [termChar, setTermChar] = useState(0);
  const [termDone, setTermDone] = useState<string[]>([]);

  useEffect(() => {
    const onS = () => setNavSolid(window.scrollY > 40);
    window.addEventListener('scroll', onS);
    return () => window.removeEventListener('scroll', onS);
  }, []);

  /* Terminal typing animation */
  useEffect(() => {
    if (termLine >= TERMINAL_LINES.length) {
      const reset = setTimeout(() => {
        setTermLine(0);
        setTermChar(0);
        setTermDone([]);
      }, 3000);
      return () => clearTimeout(reset);
    }
    const currentText = TERMINAL_LINES[termLine].text;
    if (termChar < currentText.length) {
      const speed = 25 + Math.random() * 30;
      const t = setTimeout(() => setTermChar(c => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const full = TERMINAL_LINES[termLine].prefix + currentText;
      const t = setTimeout(() => {
        setTermDone(prev => [...prev, full]);
        setTermLine(l => l + 1);
        setTermChar(0);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [termLine, termChar]);

  const flash = useCallback((msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 4000); }, []);

  /* Skills */
  const addSkill = (v: string) => { const s = v.trim(); if (s && !skills.includes(s) && skills.length < 15) setSkills(prev => [...prev, s]); setSkillInput(''); };
  const removeSkill = (i: number) => setSkills(skills.filter((_, j) => j !== i));
  const onSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput); }
    else if (e.key === 'Backspace' && !skillInput && skills.length) setSkills(skills.slice(0, -1));
  };

  /* Enter key guard */
  const guardEnter = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') e.preventDefault();
  };

  /* Validation */
  const STEPS = 3;
  const validate = (s: number): boolean => {
    if (!formRef.current) return false;
    const fd = new FormData(formRef.current);
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!fd.get('name')?.toString().trim()) errs.name = 'Required';
      const email = fd.get('email')?.toString().trim() ?? '';
      if (!email) errs.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email';
      if (!fd.get('role')?.toString()) errs.role = 'Required';
      if (!fd.get('experience')?.toString()) errs.experience = 'Required';
    } else if (s === 1) {
      const bio = fd.get('bio')?.toString().trim() ?? '';
      if (!bio) errs.bio = 'Required';
      else if (bio.length < 20) errs.bio = 'At least 20 characters';
    }
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const goTo = (target: number) => {
    if (target > step) { for (let i = step; i < target; i++) if (!validate(i)) { setStep(i); return; } }
    setErrors({});
    setStep(target);
  };

  /* Submit */
  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    for (let i = 0; i < STEPS; i++) { if (!validate(i)) { setStep(i); flash('Please fill all required fields.', false); return; } }

    setIsSubmitting(true);
    const fd = new FormData(formRef.current!);
    const body = {
      name: fd.get('name'), email: fd.get('email'), role: fd.get('role'),
      bio: fd.get('bio'), skills,
      portfolioUrl: fd.get('portfolioUrl') || null,
      githubUrl: fd.get('githubUrl') || null,
      linkedinUrl: fd.get('linkedinUrl') || null,
      experience: fd.get('experience'),
      location: fd.get('location') || null
    };
    try {
      const res = await fetch('/api/developers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) { flash('Profile submitted successfully!', true); formRef.current!.reset(); setSkills([]); setStep(0); setErrors({}); setShowAssessment(true); }
      else flash(data.error || 'Something went wrong.', false);
    } catch { flash('Network error — please try again.', false); }
    finally { setIsSubmitting(false); }
  };

  return (<>
    {/* ═══ Navbar ═══ */}
    <nav className={`nav${navSolid ? ' nav--solid' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <img src="/Matrix_logo.jpg" alt="Matrix Digital" className="nav-logo" />
          <span>Matrix Digital</span>
        </a>
        <div className="nav-links hide-mobile">
          <a href="#archetypes">Archetypes</a>
          <a href="#platform">Platform</a>
          <a href="#standard">Standard</a>
        </div>
        <a href="#apply" className="btn btn-primary btn-sm">Claim Your Node</a>
      </div>
    </nav>

    {/* ═══ 1. Terminal Hero ═══ */}
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid-bg" />
      <div className="hero-inner">
        <div className="hero-content">
          <div className="pill">
            <span className="pill-dot" />
            Founding Architect Pipeline
          </div>
          <h1>Plug Into the<br /><span className="text-accent">Matrix Digital</span> Pipeline.</h1>
          <p className="hero-desc">
            We don&apos;t hire developers. We deploy <strong>founding architects</strong> — engineers who build, ship, and own their stack inside enterprise-grade AI infrastructure.
          </p>
          <div className="hero-ctas">
            <a href="#archetypes" className="btn btn-primary btn-lg">
              Claim Your Node
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#platform" className="btn btn-outline">Explore Platform</a>
          </div>
          <div className="hero-proof">
            <div className="avatars">
              {['#6366F1', '#0052FF', '#059669', '#F59E0B'].map((c, i) => (
                <div key={i} className="avatar" style={{ background: c, zIndex: 4 - i }}>{String.fromCharCode(65 + i)}</div>
              ))}
            </div>
            <p><strong>200+</strong> nodes deployed this quarter</p>
          </div>
        </div>
        <div className="hero-visual hide-mobile">
          <div className="hero-terminal">
            <div className="hero-terminal-bar">
              <span /><span /><span />
              <span className="hero-terminal-title">matrix_pipeline.sh</span>
            </div>
            <div className="hero-terminal-body">
              {termDone.map((line, i) => (
                <p key={i} className={`term-line term-${TERMINAL_LINES[i]?.color ?? 'green'}`}>{line}</p>
              ))}
              {termLine < TERMINAL_LINES.length && (
                <p className={`term-line term-${TERMINAL_LINES[termLine].color}`}>
                  {TERMINAL_LINES[termLine].prefix}
                  {TERMINAL_LINES[termLine].text.slice(0, termChar)}
                  <span className="term-cursor">▊</span>
                </p>
              )}
              {termLine >= TERMINAL_LINES.length && (
                <p className="term-line term-status">
                  <span className="term-badge">ALL NODES ACTIVE</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Trust Bar */}
    <section className="trust-bar">
      <p>Powering talent pipelines for</p>
      <div className="trust-logos">
        {['Tata Steel', 'Tinplate Company of India', 'Tata Motors', 'Tata Consultancy Services', 'Tata Communications'].map(name => (
          <span key={name} className="trust-logo">{name}</span>
        ))}
      </div>
    </section>

    {/* ═══ 2. Archetype Bento Grid ═══ */}
    <section className="section" id="archetypes">
      <div className="container">
        <p className="section-tag">Your Archetype</p>
        <h2>Four paths. One <span className="text-accent">ecosystem.</span></h2>
        <p className="section-desc">Every developer fits an archetype. Each one plugs into a different layer of the Matrix Digital infrastructure. Find yours.</p>
        <div className="bento-grid">
          {ARCHETYPES.map((a, i) => (
            <div key={i} className={`bento-card bento-card--${i}`}>
              <div className="bento-icon" style={{ background: a.gradient }}>{a.icon}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              <span className="bento-tag">{a.tag}</span>
              <a href="#apply" className="bento-cta">
                Claim this node
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ 3. Platform Feature Highlights ═══ */}
    <section className="section section--alt" id="platform">
      <div className="container">
        <p className="section-tag">Platform</p>
        <h2>Infrastructure that<br /><span className="text-accent">validates builders.</span></h2>
        <p className="section-desc">Not another portfolio site. A living system that routes validated developers to enterprise demand in real time.</p>

        {PLATFORM_FEATURES.map((feat, i) => (
          <div key={i} className={`feature-row${i % 2 === 1 ? ' feature-row--reverse' : ''}`}>
            <div className="feature-text">
              <div className="feature-icon-circle">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
            <div className="feature-visual">
              {feat.visual === 'network' && (
                <div className="viz-network">
                  <div className="viz-node viz-node--center"><span>YOU</span></div>
                  {['React', 'Python', 'AI/ML', 'DevOps', 'Next.js'].map((label, j) => (
                    <div key={j} className={`viz-node viz-node--${j}`}><span>{label}</span></div>
                  ))}
                  <svg className="viz-lines" viewBox="0 0 300 200">
                    <line x1="150" y1="100" x2="60" y2="40" stroke="var(--accent-b)" strokeWidth="1.5" />
                    <line x1="150" y1="100" x2="240" y2="40" stroke="var(--accent-b)" strokeWidth="1.5" />
                    <line x1="150" y1="100" x2="40" y2="160" stroke="var(--accent-b)" strokeWidth="1.5" />
                    <line x1="150" y1="100" x2="260" y2="160" stroke="var(--accent-b)" strokeWidth="1.5" />
                    <line x1="150" y1="100" x2="150" y2="20" stroke="var(--accent-b)" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
              {feat.visual === 'portfolio' && (
                <div className="viz-portfolio">
                  {['AI Chatbot Dashboard', 'E-Commerce Platform', 'Real-Time Analytics'].map((name, j) => (
                    <div key={j} className="viz-project-card">
                      <div className="viz-project-dot" style={{ background: ['#6366F1', '#059669', '#F59E0B'][j] }} />
                      <div>
                        <strong>{name}</strong>
                        <span>Live · Deployed</span>
                      </div>
                      <span className="viz-live-badge">● Live</span>
                    </div>
                  ))}
                </div>
              )}
              {feat.visual === 'journey' && (
                <div className="viz-journey">
                  {JOURNEY_NODES.map((node, j) => (
                    <div key={j} className={`viz-journey-node viz-journey--${node.status}`}>
                      <div className="viz-journey-num">{node.num}</div>
                      <div className="viz-journey-label">{node.label}</div>
                      {j < JOURNEY_NODES.length - 1 && <div className="viz-journey-line" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ═══ 4. The Matrix Standard ═══ */}
    <section className="section section--standard" id="standard">
      <div className="container">
        <div className="standard-inner">
          <div className="standard-badge">The Matrix Standard</div>
          <h2>No Spoon-Feeding.</h2>
          <p className="standard-lead">
            We provide the stack, the mentorship, and the enterprise pipeline.<br />
            But we require <strong>Neeyat</strong> — intention, fire, and follow-through.
          </p>
          <div className="standard-grid">
            <div className="standard-card">
              <div className="standard-card-icon">🔥</div>
              <h4>We Give You</h4>
              <ul>
                <li>Production-grade infrastructure</li>
                <li>Real enterprise project routing</li>
                <li>AI-powered skill validation</li>
                <li>Stack mentorship & architecture reviews</li>
              </ul>
            </div>
            <div className="standard-card standard-card--dark">
              <div className="standard-card-icon">⚡</div>
              <h4>We Expect From You</h4>
              <ul>
                <li>Self-driven learning & shipping</li>
                <li>Ownership of your architecture</li>
                <li>Commitment to the 32-node journey</li>
                <li>No hand-holding — just building</li>
              </ul>
            </div>
          </div>
          <p className="standard-quote">&ldquo;The ones who ship, lead. The ones who wait, watch.&rdquo;</p>
        </div>
      </div>
    </section>

    {/* Application Form */}
    <section className="section section--form" id="apply">
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="form-header">
          <div className="form-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <p className="section-tag">Apply</p>
          <h2>Create your <span className="text-accent">developer profile.</span></h2>
          <p className="section-desc">Join 200+ validated developers. Takes ~2 minutes — no credit card, no commitments.</p>
          <div className="form-trust-row">
            <span className="form-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Free forever
            </span>
            <span className="form-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              No spam
            </span>
            <span className="form-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Data encrypted
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {['Your Info', 'Bio & Skills', 'Links'].map((label, i) => (
            <button key={i} type="button" className={`stepper-step${step === i ? ' stepper-step--active' : ''}${step > i ? ' stepper-step--done' : ''}`} onClick={() => goTo(i)}>
              <span className="stepper-circle">{step > i ? '✓' : i + 1}</span>
              <span className="stepper-label">{label}</span>
            </button>
          ))}
          <div className="stepper-bar"><div className="stepper-bar-fill" style={{ width: `${(step / (STEPS - 1)) * 100}%` }} /></div>
        </div>

        <form ref={formRef} className="form" onSubmit={e => e.preventDefault()} onKeyDown={guardEnter} noValidate>
          {/* Step 0 – Your info */}
          <div className={`form-panel${step === 0 ? '' : step > 0 ? ' form-panel--left' : ' form-panel--right'}`}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="f-name">Full name *</label>
                <input id="f-name" name="name" type="text" placeholder="Jane Doe" autoComplete="name" />
                {errors.name && <span className="field-err">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-email">Email *</label>
                <input id="f-email" name="email" type="email" placeholder="jane@example.com" autoComplete="email" />
                {errors.email && <span className="field-err">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-role">Role *</label>
                <select id="f-role" name="role" defaultValue="">
                  <option value="" disabled>Select a role</option>
                  <option>Frontend Developer</option><option>Backend Developer</option><option>Full Stack Developer</option>
                  <option>Mobile Developer</option><option>DevOps Engineer</option><option>Data Scientist</option>
                  <option>UI/UX Designer</option><option>AI/ML Engineer</option><option>Cloud Architect</option><option>Other</option>
                </select>
                {errors.role && <span className="field-err">{errors.role}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-exp">Experience *</label>
                <select id="f-exp" name="experience" defaultValue="">
                  <option value="" disabled>Select level</option>
                  <option>0-1 years</option><option>1-3 years</option><option>3-5 years</option><option>5-10 years</option><option>10+ years</option>
                </select>
                {errors.experience && <span className="field-err">{errors.experience}</span>}
              </div>
            </div>
          </div>

          {/* Step 1 – Bio & Skills */}
          <div className={`form-panel${step === 1 ? '' : step > 1 ? ' form-panel--left' : ' form-panel--right'}`}>
            <div className="field">
              <label htmlFor="f-bio">Bio *</label>
              <textarea id="f-bio" name="bio" rows={4} placeholder="Tell us about your experience, what you build, and what excites you..." />
              {errors.bio && <span className="field-err">{errors.bio}</span>}
            </div>
            <div className="field">
              <label>Skills</label>
              <div className="tags-box" onClick={() => skillRef.current?.focus()}>
                {skills.map((s, i) => (
                  <span key={i} className="tag">
                    {s}
                    <button type="button" onClick={() => removeSkill(i)}>&times;</button>
                  </span>
                ))}
                <input ref={skillRef} className="tags-input" type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={onSkillKey} onBlur={() => { if (skillInput.trim()) addSkill(skillInput); }} placeholder={skills.length ? '' : 'React, Python, AWS...'} />
              </div>
              <span className="field-hint">Press Enter to add a skill</span>
            </div>
            <div className="field">
              <label htmlFor="f-loc">Location <span className="field-opt">(optional)</span></label>
              <input id="f-loc" name="location" type="text" placeholder="San Francisco, CA" />
            </div>
          </div>

          {/* Step 2 – Links */}
          <div className={`form-panel${step === 2 ? '' : step > 2 ? ' form-panel--left' : ' form-panel--right'}`}>
            <p className="form-panel-note">All fields below are optional — you can add them later.</p>
            <div className="field field--icon">
              <label htmlFor="f-portfolio">Portfolio</label>
              <div className="field-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                <input id="f-portfolio" name="portfolioUrl" type="url" placeholder="https://yoursite.com" />
              </div>
            </div>
            <div className="field field--icon">
              <label htmlFor="f-github">GitHub</label>
              <div className="field-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
                <input id="f-github" name="githubUrl" type="url" placeholder="https://github.com/username" />
              </div>
            </div>
            <div className="field field--icon">
              <label htmlFor="f-linkedin">LinkedIn</label>
              <div className="field-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                <input id="f-linkedin" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/username" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="form-footer">
            {step > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => { setErrors({}); setStep(step - 1); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
              </button>
            )}
            <div className="spacer" />
            {step < STEPS - 1 ? (
              <button type="button" className="btn btn-primary" onClick={() => goTo(step + 1)}>
                Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-lg" disabled={isSubmitting} style={{ width: '100%' }} onClick={() => handleSubmit()}>
                {isSubmitting ? (<><span className="spinner" /> Submitting...</>) : (<>Submit Your Profile <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg></>)}
              </button>
            )}
          </div>
        </form>
        <p className="form-secure-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          Your information is encrypted and never shared without your consent.
        </p>
      </div>
    </section>

    {/* ═══ 5. Tech Architecture Footer ═══ */}
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <img src="/Matrix_logo.jpg" alt="Matrix Digital" className="nav-logo" />
            <span>Matrix Digital</span>
          </div>
          <p className="footer-tagline">Building the developer infrastructure for enterprise AI.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="#apply">Developer Sign Up</a>
            <a href="#archetypes">Archetypes</a>
            <a href="#platform">Features</a>
          </div>
          <div>
            <h4>Standard</h4>
            <a href="#standard">The Matrix Standard</a>
            <a href="#">Support</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-tech">
        <p className="footer-tech-label">Built With</p>
        <div className="footer-tech-stack">
          {[
            { name: 'Next.js 15', icon: '▲' },
            { name: 'Neon DB', icon: '⚡' },
            { name: 'Prisma ORM', icon: '◆' },
            { name: 'Vercel Edge', icon: '●' },
          ].map((t) => (
            <span key={t.name} className="footer-tech-item">
              <span className="footer-tech-icon">{t.icon}</span>
              {t.name}
            </span>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Matrix Digital. All rights reserved.</p>
      </div>
    </footer>

    {/* Toast */}
    {toast && <div className={`toast${toast.ok ? ' toast--ok' : ' toast--err'}`}>{toast.ok ? '✓' : '✕'}&ensp;{toast.msg}</div>}

    {/* Assessment Modal */}
    {showAssessment && <AssessmentModal onClose={() => setShowAssessment(false)} />}
  </>);
}
