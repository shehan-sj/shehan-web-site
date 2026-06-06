/* =============================================================
   HACKER TERMINAL PORTFOLIO — Main JS
   Boot sequence, Matrix rain, Terminal, Animations
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
    bootSequence();
});

/* --- Boot Sequence --- */
function bootSequence() {
    const screen = document.getElementById('boot-screen');
    const log = document.getElementById('boot-log');
    const lines = [
        '[BIOS]  POST check.................. OK',
        '[BIOS]  Memory test: 16384 MB....... OK',
        '[BOOT]  Loading kernel.............. OK',
        '[INIT]  network.service............ started',
        '[INIT]  ssh.service................ started',
        '[INIT]  portfolio.service.......... started',
        '[AUTH]  User: rajiv@portfolio',
        '[AUTH]  Authentication............. ✓',
        '',
        '  Welcome to Rajiv\'s Portfolio Server',
        '  Last login: ' + new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ''
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < lines.length) {
            const span = document.createElement('div');
            span.textContent = lines[i];
            span.classList.add('boot-line');
            if (lines[i].includes('✓') || lines[i].includes('Welcome')) {
                span.style.color = '#00ff41';
                span.style.fontWeight = '600';
            }
            log.appendChild(span);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                screen.classList.add('fade-out');
                setTimeout(() => {
                    screen.classList.add('hidden');
                    initAll();
                }, 500);
            }, 400);
        }
    }, 120);
}

/* --- Init All Modules --- */
function initAll() {
    initMatrix();
    initTypeWriter();
    initScrollAnimations();
    initNavigation();
    initTerminal();
    initKonamiCode();
    updateClock();
    setInterval(updateClock, 1000);
}

/* --- Matrix Rain --- */
function initMatrix() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }
    draw();
}

/* --- TypeWriter --- */
function initTypeWriter() {
    const el = document.getElementById('typed-title');
    if (!el) return;

    const phrases = [
        'Senior Validation Engineer • QA Leader',
        'Automation Architect • 14+ Years Experience',
        'AI-Powered QA • Building Tools That Scale',
        'Life Sciences • Fintech • Enterprise Security'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        const current = phrases[phraseIndex];

        if (!deleting) {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                setTimeout(() => { deleting = true; tick(); }, 2500);
                return;
            }
            setTimeout(tick, 50);
        } else {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(tick, 300);
                return;
            }
            setTimeout(tick, 25);
        }
    }
    tick();
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const gitEntries = document.querySelectorAll('.git-entry');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(s => sectionObserver.observe(s));

    const entryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
            }
        });
    }, { threshold: 0.1 });

    gitEntries.forEach(e => entryObserver.observe(e));
}

/* --- Navigation --- */
function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    navAnchors.forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
        });
    });

    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => observer.observe(s));
}

/* --- Interactive Terminal --- */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    const commands = {
        help: () => [
            { text: 'Available commands:', cls: 'success' },
            { text: '  help        — Show this help menu', cls: 'output' },
            { text: '  whoami      — Quick intro', cls: 'output' },
            { text: '  about       — Full bio', cls: 'output' },
            { text: '  experience  — Career history', cls: 'output' },
            { text: '  skills      — Technical skills', cls: 'output' },
            { text: '  projects    — Side projects', cls: 'output' },
            { text: '  education   — Education & certs', cls: 'output' },
            { text: '  contact     — Get in touch', cls: 'output' },
            { text: '  neofetch    — System info', cls: 'output' },
            { text: '  clear       — Clear terminal', cls: 'output' },
            { text: '  matrix      — Toggle matrix rain', cls: 'output' },
            { text: '  theme       — Cycle terminal color', cls: 'output' },
            { text: '  sudo        — ???', cls: 'output' },
        ],

        whoami: () => [
            { text: 'Rajiv Silva — Senior Validation Engineer & QA Leader', cls: 'success' },
            { text: '14+ years in QA across Life Sciences, Fintech, and Enterprise Security', cls: 'output' },
            { text: 'Most recently @ Alira Health | Kitchener, Ontario, Canada | Remote', cls: 'output' },
        ],

        about: () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            return [{ text: '→ Scrolling to about section...', cls: 'success' }];
        },

        experience: () => {
            document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
            return [{ text: '→ Scrolling to experience section...', cls: 'success' }];
        },

        skills: () => {
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
            return [{ text: '→ Scrolling to skills section...', cls: 'success' }];
        },

        projects: () => {
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            return [{ text: '→ Scrolling to projects section...', cls: 'success' }];
        },

        education: () => {
            document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
            return [{ text: '→ Scrolling to education section...', cls: 'success' }];
        },

        contact: () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            return [{ text: '→ Scrolling to contact section...', cls: 'success' }];
        },

        neofetch: () => [
            { text: '    ██████╗ ███████╗    rajiv@portfolio', cls: 'output' },
            { text: '    ██╔══██╗██╔════╝    ─────────────────', cls: 'output' },
            { text: '    ██████╔╝███████╗    OS: QA Engineer v14.0', cls: 'output' },
            { text: '    ██╔══██╗╚════██║    Host: Kitchener, Ontario, Canada', cls: 'output' },
            { text: '    ██║  ██║███████║    Uptime: 14+ years', cls: 'output' },
            { text: '    ╚═╝  ╚═╝╚══════╝    Shell: /bin/automation', cls: 'output' },
            { text: '                         CPU: Coffee-Powered', cls: 'output' },
        ],

        clear: () => {
            output.innerHTML = '';
            return [];
        },

        matrix: () => {
            const canvas = document.getElementById('matrix-bg');
            const current = parseFloat(getComputedStyle(canvas).opacity);
            canvas.style.opacity = current > 0.05 ? '0' : '0.07';
            return [{ text: 'Matrix rain ' + (current > 0.05 ? 'disabled' : 'enabled'), cls: 'success' }];
        },

        theme: () => {
            const root = document.documentElement;
            const themes = [
                { name: 'green', green: '#00ff41', dim: '#00cc33' },
                { name: 'amber', green: '#ffb000', dim: '#cc8800' },
                { name: 'cyan',  green: '#00d4ff', dim: '#00aacc' },
                { name: 'red',   green: '#ff5555', dim: '#cc3333' },
            ];
            const current = root.style.getPropertyValue('--green') || '#00ff41';
            const idx = themes.findIndex(t => t.green === current);
            const next = themes[(idx + 1) % themes.length];
            root.style.setProperty('--green', next.green);
            root.style.setProperty('--green-dim', next.dim);
            return [{ text: 'Theme changed to: ' + next.name, cls: 'success' }];
        },

        sudo: () => {
            document.body.classList.add('party-mode');
            setTimeout(() => document.body.classList.remove('party-mode'), 5000);
            return [
                { text: '[sudo] password for visitor: ************', cls: 'output' },
                { text: 'ACCESS GRANTED — Party mode activated! 🎉', cls: 'success' },
            ];
        },

        date: () => [{ text: new Date().toString(), cls: 'output' }],

        pwd: () => [{ text: '/home/rajiv/portfolio', cls: 'output' }],

        ls: () => [
            { text: 'about.txt  experience/  skills/  projects/  education.txt  contact.txt', cls: 'output' },
        ],

        uptime: () => [
            { text: 'up 14 years, 4 months, ' + Math.floor(Math.random() * 24) + ' hours', cls: 'output' },
        ],

        echo: (args) => [{ text: args || '', cls: 'output' }],

        history: () => [
            { text: '    1  npm init portfolio', cls: 'output' },
            { text: '    2  git init', cls: 'output' },
            { text: '    3  echo "Hello World" > index.html', cls: 'output' },
            { text: '    4  # 14 years of commits later...', cls: 'output' },
            { text: '    5  git push origin main', cls: 'output' },
        ],

        exit: () => [{ text: 'Nice try. You can\'t leave that easily. 😄', cls: 'error' }],

        rm: () => [{ text: 'rm: permission denied. This portfolio is read-only.', cls: 'error' }],

        cat: (args) => {
            if (args && args.includes('resume')) {
                return [{ text: '→ Check the experience and skills sections above, or email me for a PDF!', cls: 'success' }];
            }
            return [{ text: 'cat: ' + (args || 'missing file') + ': try "about", "experience", "skills", etc.', cls: 'error' }];
        },

        ping: () => [
            { text: 'PING rajiv.dev (127.0.0.1): 56 data bytes', cls: 'output' },
            { text: '64 bytes: icmp_seq=0 ttl=64 time=0.042 ms', cls: 'output' },
            { text: '64 bytes: icmp_seq=1 ttl=64 time=0.038 ms', cls: 'output' },
            { text: '--- rajiv.dev ping statistics ---', cls: 'output' },
            { text: '2 packets transmitted, 2 received, 0% packet loss', cls: 'success' },
        ],

        curl: () => [{ text: 'You\'re already here! Try scrolling up. 😄', cls: 'success' }],

        man: () => [{ text: 'RTFM? Just type "help" like a normal person.', cls: 'output' }],

        hack: () => [
            { text: 'ACCESSING MAINFRAME...', cls: 'error' },
            { text: 'Just kidding. This is a portfolio, not a movie.', cls: 'output' },
        ],
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const raw = input.value.trim();
            if (!raw) return;

            const cmdLine = document.createElement('div');
            cmdLine.classList.add('term-line', 'cmd');
            cmdLine.textContent = 'visitor:~$ ' + raw;
            output.appendChild(cmdLine);

            const parts = raw.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1).join(' ');

            let result;
            if (commands[cmd]) {
                result = typeof commands[cmd] === 'function' ? commands[cmd](args) : commands[cmd];
            } else {
                result = [{ text: cmd + ': command not found. Type "help" for available commands.', cls: 'error' }];
            }

            result.forEach(line => {
                const div = document.createElement('div');
                div.classList.add('term-line', line.cls);
                div.textContent = line.text;
                output.appendChild(div);
            });

            input.value = '';
            output.scrollTop = output.scrollHeight;
            input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

/* --- Konami Code --- */
function initKonamiCode() {
    const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let pos = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === code[pos]) {
            pos++;
            if (pos === code.length) {
                pos = 0;
                document.body.classList.add('party-mode');
                setTimeout(() => document.body.classList.remove('party-mode'), 5000);
            }
        } else {
            pos = 0;
        }
    });
}

/* --- Clock --- */
function updateClock() {
    const el = document.getElementById('status-time');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}
