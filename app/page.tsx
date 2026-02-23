'use client';

import { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent } from 'react';

/* ─── Assessment Modal ─── */
function AssessmentModal({ onClose }: { onClose: () => void }) {
  const INTERVIEW_URL = 'https://talent.flowmingo.ai/interview/6da06d55-d960-409e-b3c5-9f8a0ca53e31/?utm_source=chatgpt.com';

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

  useEffect(() => {
    const onS = () => setNavSolid(window.scrollY > 40);
    window.addEventListener('scroll', onS);
    return () => window.removeEventListener('scroll', onS);
  }, []);

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
    {/* Navbar */}
    <nav className={`nav${navSolid ? ' nav--solid' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <img src="/Matrix_logo.jpg" alt="Matrix Digital" className="nav-logo" />
          <span>Matrix Digital</span>
        </a>
        <div className="nav-links hide-mobile">
          <a href="#how">How It Works</a>
          <a href="#why">Why Join</a>
          <a href="#network">Network</a>
        </div>
        <a href="#apply" className="btn btn-primary btn-sm">Apply Now</a>
      </div>
    </nav>

    {/* Hero */}
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-inner">
        <div className="hero-content">
          <div className="pill">
            <span className="pill-dot" />
            Developer-First Platform
          </div>
          <h1>Where top developers<br />get <span className="text-accent">discovered.</span></h1>
          <p className="hero-desc">Skip the resume black hole. Showcase your real work, pass a validation sprint, and get matched with enterprise projects — automatically.</p>
          <div className="hero-ctas">
            <a href="#apply" className="btn btn-primary btn-lg">
              Get Started — It&apos;s Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatars">
              {['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'].map((c, i) => (
                <div key={i} className="avatar" style={{ background: c, zIndex: 4 - i }}>{String.fromCharCode(65 + i)}</div>
              ))}
            </div>
            <p><strong>200+</strong> developers validated this month</p>
          </div>
        </div>
        <div className="hero-visual hide-mobile">
          <div className="code-card">
            <div className="code-dots"><span /><span /><span /></div>
            <pre><code><span className="ck">const</span> <span className="cv">developer</span> = {'{'}{'\n'}  name: <span className="cs">&quot;You&quot;</span>,{'\n'}  stack: [<span className="cs">&quot;React&quot;</span>, <span className="cs">&quot;Node&quot;</span>, <span className="cs">&quot;Python&quot;</span>],{'\n'}  status: <span className="cs">&quot;Validated ✓&quot;</span>,{'\n'}  matches: <span className="cn">3</span>{'\n'}{'}'}</code></pre>
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

    {/* How It Works */}
    <section className="section" id="how">
      <div className="container">
        <p className="section-tag">How It Works</p>
        <h2>Three steps to your<br /><span className="text-accent">next project.</span></h2>
        <p className="section-desc">No recruiter calls. No resume parsing. Just pure signal.</p>
        <div className="steps-grid">
          {[
            { num: '01', title: 'Submit your profile', desc: 'Add your stack, links, and a short bio. Takes about 2 minutes.' },
            { num: '02', title: 'Complete a sprint', desc: 'A quick, AI-powered assessment validates your skills in ~15 minutes.' },
            { num: '03', title: 'Get matched', desc: 'Your validated profile is routed to active enterprise projects automatically.' },
          ].map((s) => (
            <div key={s.num} className="step-card">
              <span className="step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Join */}
    <section className="section section--alt" id="why">
      <div className="container">
        <div className="split">
          <div className="split-text">
            <p className="section-tag">Why Join</p>
            <h2>Built for developers<br />who <span className="text-accent">ship.</span></h2>
            <p className="section-desc" style={{ textAlign: 'left', margin: 0 }}>We eliminate busywork so you can focus on building things that work.</p>
            <ul className="check-list">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <div><strong>No resume parsing</strong><span>Your repos and live projects do the talking.</span></div>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <div><strong>Guaranteed matching</strong><span>Validated developers are routed to active projects instantly.</span></div>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <div><strong>Own your architecture</strong><span>Showcase the frameworks and systems you&apos;ve actually built.</span></div>
              </li>
            </ul>
          </div>
          <div className="split-visual hide-mobile">
            <div className="terminal">
              <div className="terminal-bar"><span /><span /><span /></div>
              <div className="terminal-body">
                <p><span className="t-green">$</span> matrix validate --profile</p>
                <p className="t-dim">Scanning repos ............. <span className="t-green">✓</span></p>
                <p className="t-dim">Analyzing stack ............ <span className="t-green">✓</span></p>
                <p className="t-dim">Running sprint ............. <span className="t-green">✓</span></p>
                <p className="t-dim">Routing to pipelines ....... <span className="t-green">✓</span></p>
                <p>&nbsp;</p>
                <p className="t-status"><span>VALIDATED</span></p>
                <p className="t-dim t-small">Profile active · 3 project matches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Network CTA */}
    <section className="section section--center" id="network">
      <div className="container" style={{ maxWidth: 640 }}>
        <p className="section-tag">Network</p>
        <h2>Join <span className="text-accent">200+</span> validated developers.</h2>
        <p className="section-desc">Access enterprise projects, connect with builders, and grow your career on your terms.</p>
        <a href="#apply" className="btn btn-outline btn-lg">Create Your Profile</a>
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

    {/* Footer */}
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/Matrix_logo.jpg" alt="Matrix Digital" className="nav-logo" />
          <span>Matrix Digital</span>
        </div>
        <div className="footer-links">
          <div><h4>Platform</h4><a href="#apply">Developer Sign Up</a><a href="#how">How It Works</a></div>
          <div><h4>Network</h4><a href="#network">Status</a><a href="#">Support</a></div>
          <div><h4>Company</h4><a href="#">About</a><a href="#">Contact</a></div>
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
