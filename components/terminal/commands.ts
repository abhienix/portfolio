export interface CommandResult {
  output: string[];
  isError?: boolean;
}

const COMMANDS: Record<string, () => CommandResult> = {
  help: () => ({
    output: [
      '╔══════════════════════════════════════════════════╗',
      '║          ABHIMANYU KUMAR — TERMINAL v1.0         ║',
      '╚══════════════════════════════════════════════════╝',
      '',
      '  whoami          Analyst profile summary',
      '  resume          Download & view resume record',
      '  projects        List featured engineering projects',
      '  skills          Security & engineering capabilities',
      '  certs           List verified industry certifications',
      '  contact         Get in touch with analyst',
      '  scan            Run threat scan simulation',
      '  ping abhimanyu  Ping analyst home node',
      '  sudo hire me    Request hiring access',
      '  globe status    Globe and threat map status',
      '  threat map      ASCII world map with location',
      '  clear           Clear terminal',
      '  exit            Close terminal',
      '',
    ],
  }),

  whoami: () => ({
    output: [
      '┌─ ANALYST PROFILE ─────────────────────────────────┐',
      '│                                                   │',
      '│  NAME:     Abhimanyu Kumar                        │',
      '│  ROLE:     Cybersecurity Engineer | SOC Analyst   │',
      '│            DevSecOps Engineer                     │',
      '│  LOCATION: Pune, Maharashtra, India               │',
      '│  EMAIL:    abhimanyu9272@gmail.com                │',
      '│  GITHUB:   github.com/abhienix                    │',
      '│  LINKEDIN: linkedin.com/in/abhimanyu-sec          │',
      '│                                                   │',
      '│  EXP:      IT Executive (10 Feb 2025 – 20 Feb 26) │',
      '│  EDUCATION:PGCP-ITISS @ C-DAC IACSD, Pune (80.0%) │',
      '│  DEGREES:  MCA (73.2%), BCA (78.9%) · Ranchi Univ │',
      '│  STATUS:   OPEN TO OPPORTUNITIES                  │',
      '│                                                   │',
      '└───────────────────────────────────────────────────┘',
      '',
    ],
  }),

  resume: () => ({
    output: [
      '┌─ RESUME RECORD ───────────────────────────────────┐',
      '│  Candidate: Abhimanyu Kumar                       │',
      '│  File:      /Abhimanyu_Kumar_Resume.pdf           │',
      '│  Education: PGCP-ITISS (C-DAC IACSD, Pune, 80%)   │',
      '│             MCA (73.25%), BCA (78.9%)             │',
      '│  Experience: IT Executive (10 Feb 25 – 20 Feb 26) │',
      '│  Prior:      HDFC Life Ins. (05 Aug 24 – 31 Jan 25)│',
      '│  Certs (5): Cisco Ethical Hacker, Cisco Intro     │',
      '│             IBM CyberSec, IBM AI, Mastercard Sim  │',
      '│  Download:  Click "RESUME ↓" in navigation HUD    │',
      '└───────────────────────────────────────────────────┘',
      '',
    ],
  }),

  scan: () => {
    const threats = [
      'Scanning network perimeter..........  [OK]',
      'Checking open ports................  [OK]',
      'Analyzing traffic patterns.........  [OK]',
      'Running SAST on codebase...........  [CLEAN]',
      'Checking container images..........  [CLEAN]',
      'Running DAST against endpoints.....  [OK]',
      'Scanning for secrets/credentials...  [CLEAN]',
      'Verifying WAF rules................  [ACTIVE]',
      'Checking IDS/IPS signatures........  [UPDATED]',
      'SIEM correlation engine............  [RUNNING]',
      '',
      '>>> SCAN COMPLETE — 0 CRITICAL, 0 HIGH, 0 MEDIUM',
      '>>> All systems secured. Analyst on duty.',
      '',
    ];
    return { output: threats };
  },

  projects: () => ({
    output: [
      'TOTAL: 4 DEPLOYED & VERIFIED PROJECTS',
      '────────────────────────────────────────────────────────',
      '',
      '1. SecureFlow/       [CRITICAL]  DevSecOps Pipeline + AI Analysis',
      '   Stack: GitHub Actions, Gitleaks, Semgrep, Trivy, ZAP, Ollama',
      '   URL:   github.com/abhienix/SecureFlow',
      '',
      '2. RedFlagDetector/  [HIGH]      AI Phishing & Threat Analysis',
      '   Stack: Python, FastAPI, 24 Regex Heuristics, Groq LLM',
      '   URL:   github.com/abhienix/AI-red-flag-detector',
      '',
      '3. SentryVault/      [HIGH]      Enterprise Banking SOC Lab',
      '   Stack: Wazuh SIEM, Suricata NIDS, Coraza WAF, Python SOAR',
      '   URL:   github.com/abhienix',
      '',
      '4. MedHelp/          [INFO]      Rural Community Healthcare Portal',
      '   Stack: HTML5, CSS3, Bootstrap, JavaScript',
      '   URL:   github.com/abhienix/MedHelp-Smart-Healthcare-Portal.git',
      '',
    ],
  }),

  'ls projects': () => COMMANDS.projects(),

  skills: () => ({
    output: [
      '=== CYBERSECURITY & SOC ===',
      'Wazuh SIEM, Coraza WAF (CRS3), Suricata NIDS/IPS,',
      'OWASP ZAP DAST, Sysmon, FIM Analysis, Tier-1/2 Triage',
      '',
      '=== DEVSECOPS & AUTOMATION ===',
      'Gitleaks, Semgrep SAST, Trivy Container Scanner,',
      'Jenkins CI/CD, GitHub Actions, Python SOAR (iptables)',
      '',
      '=== INFRASTRUCTURE & CLOUD ===',
      'Linux System Hardening, Network Segmentation (VLANs),',
      'Docker Sandboxing, GCP Cloud Run, PKI / DSC Management',
      '',
      '=== CORE METHODOLOGY ===',
      'DISCOVER → DETECT → ANALYZE → RESPOND → HARDEN → AUTOMATE',
      '',
    ],
  }),

  'cat skills.txt': () => COMMANDS.skills(),

  certs: () => ({
    output: [
      '=== VERIFIED INDUSTRY CREDENTIALS (5) ===',
      '──────────────────────────────────────────',
      '1. Cisco: Ethical Hacker',
      '   Focus: Penetration Testing & Reconnaissance',
      '',
      '2. Cisco: Introduction to Cybersecurity',
      '   Focus: Network Defense & Attack Mitigations',
      '',
      '3. IBM SkillBuild: Cybersecurity Fundamentals',
      '   Focus: Defensive Architectures & SOC Triage',
      '',
      '4. IBM SkillBuild: AI Fundamentals',
      '   Focus: Cognitive Security & Heuristic Detection',
      '',
      '5. Mastercard: Cybersecurity Job Simulation',
      '   Focus: Real-world Phishing & Incident Response',
      '',
    ],
  }),

  certifications: () => COMMANDS.certs(),

  contact: () => ({
    output: [
      '=== CONTACT ANALYST ===',
      '───────────────────────',
      'Email:    abhimanyu9272@gmail.com',
      'LinkedIn: https://linkedin.com/in/abhimanyu-sec',
      'GitHub:   https://github.com/abhienix',
      'Location: Pune, Maharashtra, India',
      '',
      'Status: Available for Cybersecurity / SOC / DevSecOps roles.',
      '',
    ],
  }),

  'ping abhimanyu': () => ({
    output: [
      'PING 20.5937N 78.9629E (Pune, Maharashtra, India)',
      '',
      '64 bytes from station-india: time=12ms',
      '64 bytes from station-india: time=9ms',
      '64 bytes from station-india: time=11ms',
      '',
      '--- ping statistics ---',
      '3 packets transmitted, 3 received, 0% packet loss',
      '',
      '>>> HOST: ACTIVE',
      '>>> STATUS: Open to new opportunities',
      '>>> RESPONSE: abhimanyu9272@gmail.com',
      '',
    ],
  }),

  'sudo hire me': () => ({
    output: [
      '[sudo] password for recruiter: ••••••••',
      '',
      'Verifying credentials............  [OK]',
      'Checking skill clearance.........  [GRANTED]',
      'Validating experience............  [12+ months (10 Feb 25 – 20 Feb 26)]',
      'Validating certifications........  [5 credentials verified]',
      'Reading portfolio................  [IMPRESSIVE]',
      '',
      '╔══════════════════════════════════════╗',
      '║  ACCESS GRANTED — LET\'S TALK         ║',
      '║  Email:    abhimanyu9272@gmail.com   ║',
      '║  LinkedIn: in/abhimanyu-sec          ║',
      '║  Resume:   /Abhimanyu_Kumar_Resume.pdf║',
      '╚══════════════════════════════════════╝',
      '',
    ],
  }),

  'globe status': () => ({
    output: [
      'GLOBE SYSTEM STATUS',
      '───────────────────────────────────────',
      'Renderer:    THREE.js WebGL2            [ONLINE]',
      'Atmosphere:  Fresnel GLSL shader        [ACTIVE]',
      'Coastlines:  Merged LineSegments        [RENDERED]',
      'Threat Arcs: Geodesic SLERP Arcs        [PULSING]',
      'Cables:      Subsea Global Corridors    [FLOWING]',
      'Intel Feed:  CISA KEV + GeoIP           [LIVE]',
      'Nav Nodes:   6 tactical stations online [ACTIVE]',
      '',
      '>>> Globe nominal. All defensive grids active.',
      '',
    ],
  }),

  'threat map': () => ({
    output: [
      '    GLOBAL THREAT INTELLIGENCE MAP',
      '    ────────────────────────────────────────────────',
      '     ....USA....         .....EUROPE.....',
      '    .          .    *arc*        *arc*   .',
      '    .           .──────────────────────── .',
      '    .                        RUSSIA/CHINA .',
      '    .SOUTH                               .',
      '    . AMERICA      [★ INDIA — HOME NODE] .',
      '    .               20.59°N 78.96°E      .',
      '    ................AFRICA.......SEA......',
      '                              AUSTRALIA',
      '',
      '    ★ = Abhimanyu Kumar — Pune, Maharashtra',
      '    * = Active threat vectors (CISA KEV monitored)',
      '',
    ],
  }),
};

export function executeCommand(input: string): CommandResult {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === '') return { output: [] };
  if (COMMANDS[trimmed]) return COMMANDS[trimmed]();
  return {
    output: [`command not found: ${input}`, 'Type "help" for available commands.', ''],
    isError: true,
  };
}

export const COMMAND_LIST = Object.keys(COMMANDS);
