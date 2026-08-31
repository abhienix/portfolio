'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cyber3DCard from '@/components/shared/Cyber3DCard';
import CyberScrambleText from '@/components/shared/CyberScrambleText';

const RESUME_URL = '/Abhimanyu_Kumar_Resume.pdf';

type ContactTab = 'direct' | 'message' | 'pgp';

export default function ContactPanel() {
  const [activeTab, setActiveTab] = useState<ContactTab>('direct');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied]   = useState<string | null>(null);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const buildMailto = () => {
    const subject = encodeURIComponent('Opportunity / Enquiry — Abhimanyu Kumar');
    const body = encodeURIComponent(
      `Hi Abhimanyu,\n\nFrom: ${name || '[your name]'}\nEmail: ${email || '[your email]'}\n\n${message || '[your message]'}`
    );
    return `mailto:abhimanyu9272@gmail.com?subject=${subject}&body=${body}`;
  };

  const DIRECT_CHANNELS = [
    {
      label: 'EMAIL',
      value: 'abhimanyu9272@gmail.com',
      href: 'mailto:abhimanyu9272@gmail.com',
      icon: '✉',
      hint: 'Primary contact — click to open email',
      color: 'text-cyber-cyan',
    },
    {
      label: 'LINKEDIN',
      value: 'linkedin.com/in/abhimanyu-sec',
      href: 'https://linkedin.com/in/abhimanyu-sec',
      icon: '⬡',
      hint: 'Professional profile & networking',
      color: 'text-cyber-cyan',
    },
    {
      label: 'GITHUB',
      value: 'github.com/abhienix',
      href: 'https://github.com/abhienix',
      icon: '⌥',
      hint: 'Project source code & contributions',
      color: 'text-cyber-cyan',
    },
    {
      label: 'LOCATION',
      value: 'Pune, Maharashtra, India',
      href: null,
      icon: '◉',
      hint: 'Open to remote & hybrid roles',
      color: 'text-slate-300',
    },
  ];

  return (
    <motion.div
      className="max-w-xl w-full max-h-[88vh] overflow-y-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Cyber3DCard className="p-6 md:p-7 shadow-2xl border border-cyber-cyan/30 bg-cyber-bg/95" maxTilt={6}>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-inter text-[10px] text-cyber-cyan tracking-[0.25em] uppercase font-semibold">
              <CyberScrambleText text="CONTACT // OPEN TO OPPORTUNITIES" speed={20} />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyber-green beacon-dot" />
              <span className="font-orbitron text-[8.5px] text-cyber-green font-bold">AVAILABLE</span>
            </div>
          </div>
          <h2 className="font-orbitron text-xl font-black text-white tracking-wider flex items-center gap-2">
            <span className="text-cyber-cyan">✉</span> GET IN TOUCH
          </h2>
          <div className="h-px bg-gradient-to-r from-cyber-cyan/80 via-cyber-border to-transparent mt-2.5" />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 p-1 bg-cyber-ocean/50 border border-cyber-border/80 rounded-sm mb-5">
          {[
            { id: 'direct' as ContactTab,  label: 'DIRECT CONTACT', icon: '✉' },
            { id: 'message' as ContactTab, label: 'SEND MESSAGE',    icon: '◈' },
            { id: 'pgp' as ContactTab,     label: 'PGP KEY',         icon: '🔑' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`flex-1 py-2 px-2 rounded-xs font-orbitron text-[9px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1 ${
                activeTab === tab.id
                  ? 'text-cyber-bg bg-cyber-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="hidden sm:inline">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">

          {/* ══ DIRECT CONTACT ══ */}
          {activeTab === 'direct' && (
            <motion.div key="direct" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">

              {/* Resume download — top priority */}
              <a
                href={RESUME_URL}
                download="Abhimanyu_Kumar_Resume.pdf"
                className="block w-full p-3.5 bg-cyber-cyan/10 border border-cyber-cyan/50 rounded-sm hover:bg-cyber-cyan/15 hover:border-cyber-cyan transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                aria-label="Download resume PDF"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-orbitron text-xs font-bold text-cyber-cyan mb-0.5">DOWNLOAD RESUME ↓</div>
                    <div className="font-inter text-[10.5px] text-slate-300">Abhimanyu_Kumar_Resume.pdf · Official Resume</div>
                  </div>
                  <span className="text-cyber-cyan text-xl">↓</span>
                </div>
              </a>

              {/* Contact channels */}
              {DIRECT_CHANNELS.map(ch => (
                <div
                  key={ch.label}
                  className="p-3.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm hover:border-cyber-cyan/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-orbitron text-[9px] text-slate-400 font-bold tracking-widest">{ch.label}</span>
                    <div className="flex items-center gap-2">
                      {ch.href ? (
                        <a
                          href={ch.href}
                          target={ch.href.startsWith('http') ? '_blank' : undefined}
                          rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="font-orbitron text-[8.5px] text-cyber-cyan border border-cyber-cyan/40 px-2 py-0.5 rounded-xs hover:bg-cyber-cyan/10 transition-colors"
                          aria-label={`Open ${ch.label}`}
                        >
                          OPEN ↗
                        </a>
                      ) : null}
                      <button
                        onClick={() => copyText(ch.value, ch.label)}
                        className="font-orbitron text-[8.5px] text-slate-400 border border-cyber-border px-2 py-0.5 rounded-xs hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-colors focus:outline-none"
                        aria-label={`Copy ${ch.label}`}
                      >
                        {copied === ch.label ? '✓ COPIED' : 'COPY'}
                      </button>
                    </div>
                  </div>
                  <div className={`font-mono text-xs font-medium ${ch.color}`}>{ch.value}</div>
                  <div className="font-inter text-[9.5px] text-slate-500 mt-0.5">{ch.hint}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ══ SEND MESSAGE (mailto form) ══ */}
          {activeTab === 'message' && (
            <motion.div key="message" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <p className="font-inter text-[10.5px] text-slate-400 mb-4 leading-relaxed">
                Fill in your details and click <strong className="text-white">SEND VIA EMAIL</strong> — this will open your email client with your message pre-filled and ready to send.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-orbitron text-[9px] text-slate-400 tracking-widest block mb-1.5" htmlFor="contact-name">
                    YOUR NAME
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="cyber-input text-sm"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="font-orbitron text-[9px] text-slate-400 tracking-widest block mb-1.5" htmlFor="contact-email">
                    YOUR EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="cyber-input text-sm"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="font-orbitron text-[9px] text-slate-400 tracking-widest block mb-1.5" htmlFor="contact-message">
                    YOUR MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Hi Abhimanyu, I'd like to discuss..."
                    className="cyber-input text-sm resize-none"
                  />
                </div>
                <a
                  href={buildMailto()}
                  className="block w-full py-3 text-center font-orbitron text-xs font-bold text-cyber-bg bg-cyber-cyan hover:brightness-110 transition-all rounded-xs tracking-wider focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                  aria-label="Send message via email"
                >
                  SEND VIA EMAIL ✉
                </a>
                <p className="font-inter text-[9px] text-slate-600 text-center leading-relaxed">
                  Opens your email client with message pre-filled. No data is sent to any server.
                </p>
              </div>
            </motion.div>
          )}

          {/* ══ PGP KEY ══ */}
          {activeTab === 'pgp' && (
            <motion.div key="pgp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="p-3 bg-amber-400/8 border border-amber-400/30 rounded-sm mb-4 flex items-start gap-2">
                <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠</span>
                <p className="font-inter text-[10.5px] text-amber-300 leading-relaxed">
                  <strong>Note:</strong> This is a placeholder key for demonstration purposes. For actual PGP-encrypted communication, contact via email first to exchange verified keys.
                </p>
              </div>
              <div className="p-3 bg-black/60 border border-cyber-border/70 rounded-sm">
                <div className="font-orbitron text-[9px] text-cyber-cyan font-bold mb-2 flex items-center justify-between">
                  <span>OPENSSL RSA-4096 PUBLIC KEY</span>
                  <span className="font-mono text-[8px] text-slate-500">PLACEHOLDER</span>
                </div>
                <pre className="font-mono text-[9px] text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
{`-----BEGIN PGP PUBLIC KEY BLOCK-----
UID: Abhimanyu Kumar <abhimanyu9272@gmail.com>
Algorithm: RSA-4096 / SHA-512
Status: PLACEHOLDER — contact for real key
-----END PGP PUBLIC KEY BLOCK-----`}
                </pre>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href="mailto:abhimanyu9272@gmail.com?subject=PGP Key Exchange"
                  className="flex-1 py-2.5 text-center font-orbitron text-[9px] font-bold text-cyber-cyan border border-cyber-cyan/50 hover:bg-cyber-cyan/10 rounded-xs transition-all focus:outline-none"
                >
                  REQUEST REAL KEY ↗
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-cyber-border/60">
          <div className="font-inter text-[9.5px] text-slate-500 text-center leading-relaxed">
            Abhimanyu Kumar · Pune, Maharashtra, India · Open to remote & hybrid roles
          </div>
        </div>

      </Cyber3DCard>
    </motion.div>
  );
}
