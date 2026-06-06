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
    initTypeWriter();
    initScrollAnimations();
    initNavigation();
    initTerminal();
    initKonamiCode();
    initCoverLetter();
    updateClock();
    setInterval(updateClock, 1000);
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

        coverletter: () => {
            if (window.openCoverLetterModal) window.openCoverLetterModal();
            return [{ text: '→ Opening cover letter generator...', cls: 'success' }];
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

/* --- Cover Letter Generator --- */
function initCoverLetter() {
    const modal = document.getElementById('cover-letter-modal');
    const closeBtn = document.getElementById('modal-close');
    const step1 = document.getElementById('cl-step-1');
    const step2 = document.getElementById('cl-step-2');
    const step3 = document.getElementById('cl-step-3');
    const generateBtn = document.getElementById('cl-generate');
    const backBtn = document.getElementById('cl-back');
    const anotherBtn = document.getElementById('cl-another');
    const templateBtns = document.querySelectorAll('.cl-template-btn[data-template]');

    let selectedTemplate = '';

    function showStep(step) {
        [step1, step2, step3].forEach(s => s.style.display = 'none');
        step.style.display = 'block';
    }

    function openModal() {
        modal.style.display = 'flex';
        showStep(step1);
        document.getElementById('cl-company').value = '';
        document.getElementById('cl-job-title').value = '';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // Expose for terminal command
    window.openCoverLetterModal = openModal;

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTemplate = btn.dataset.template;
            // Pre-fill job title based on template
            const titles = {
                'senior-qa': 'Senior QA Engineer',
                'qa-lead': 'QA Lead',
                'qa-manager': 'QA Manager',
                'gen-ai-qa': 'Gen AI QA Engineer'
            };
            document.getElementById('cl-job-title').value = titles[selectedTemplate] || '';
            showStep(step2);
            document.getElementById('cl-company').focus();
        });
    });

    backBtn.addEventListener('click', () => showStep(step1));
    anotherBtn.addEventListener('click', () => {
        showStep(step1);
        document.getElementById('cl-company').value = '';
        document.getElementById('cl-job-title').value = '';
    });

    generateBtn.addEventListener('click', () => {
        const company = document.getElementById('cl-company').value.trim();
        const jobTitle = document.getElementById('cl-job-title').value.trim();

        if (!company || !jobTitle) return;

        generateCoverLetterPDF(selectedTemplate, company, jobTitle);
        showStep(step3);
    });
}

function generateCoverLetterPDF(template, company, jobTitle) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const templates = {
        'senior-qa': {
            opening: `I wanted to reach out about the ${jobTitle} role at ${company}. I have been working in software quality assurance and test automation for over 14 years, and this position feels like a natural fit for the kind of work I do best.`,
            body: `Over the years, I have had the chance to build QA practices from the ground up across several industries, including life sciences, fintech, and enterprise security. That range has taught me how to adapt quickly, whether I am working in a heavily regulated environment or moving fast with a startup shipping new features every week. I have led validation efforts, built out automation strategies, and helped teams ship with confidence.

On the technical side, I work extensively with Selenium, Cypress, Appium, and Playwright, and I am very comfortable writing automation in Python, JavaScript, and TypeScript. I have set up and maintained CI/CD pipelines, worked with Docker and cloud platforms like AWS and Azure, and built testing infrastructure that scales with the product.

What really excites me right now is how AI is changing the way we think about quality. I have been building production applications using the Claude API, Claude Vision, and agentic workflows. I use these tools to automate test generation, analyze requirements for gaps, and build intelligent QA tooling that catches issues earlier in the cycle. It is not just a side interest for me. It is how I think the future of QA looks, and I am already doing it.`,
            closing: `I would love the chance to chat about how my experience could be useful to the team at ${company}. I think there is a lot I could bring to the table, and I am genuinely excited about the work you are doing.`
        },
        'qa-lead': {
            opening: `I came across the ${jobTitle} opening at ${company} and it caught my attention right away. I have spent the better part of 14 years in quality assurance, and a good chunk of that has been in leadership roles where I was responsible for building teams and setting the direction for how we approach quality.`,
            body: `One of the things I enjoy most is taking a QA function that is either early stage or in need of a reset and turning it into something the whole engineering org can rely on. I have done this several times now, building automation frameworks, establishing CI/CD testing pipelines, mentoring junior testers, and creating the kind of processes that actually stick. In one case, the impact of that work led directly to a promotion from lead to manager, which felt like a great validation that the approach was working.

I have led teams across a range of platforms including web, mobile, desktop, and API. My technical toolkit includes Selenium, Cypress, Appium, and Playwright, and I write most of my automation in Python, JavaScript, and TypeScript. I also have solid experience with CI/CD systems, Docker, and cloud testing platforms.

Something I have been leaning into heavily is using AI to make QA smarter. I have built production applications with the Claude API and Claude Vision, and I apply those same ideas to quality engineering. Think automated test generation, intelligent analysis of requirements, and tooling that uses large language models to surface risks before code even gets to QA. It is a huge multiplier for a team, and I am eager to bring that thinking to the right organization.`,
            closing: `I think there is a strong alignment between what I bring and what ${company} is looking for. I would welcome the chance to have a conversation about it and learn more about the team.`
        },
        'qa-manager': {
            opening: `I am reaching out about the ${jobTitle} position at ${company}. I have over 14 years in quality assurance, and my career has taken me from writing test cases to managing entire QA organizations. That full journey gives me a perspective on quality that is both strategic and deeply technical.`,
            body: `I have managed QA teams in environments where the stakes were high and the margin for error was small. Whether it was a fintech platform processing real transactions or a regulated life sciences product, I learned how to build a quality culture that balances speed with thoroughness. I care a lot about hiring well, growing people, and creating an environment where testers feel ownership over the product, not just the test plan.

On the process side, I have experience building out QA strategies from scratch, establishing standards across web and mobile, and working within compliance frameworks. I have also built automation programs that gave teams real confidence in their releases, using tools like Selenium, Cypress, Appium, and Playwright across a variety of tech stacks.

I still stay close to the technical side. I write automation in Python, JavaScript, and TypeScript. I have set up CI/CD pipelines, worked with Docker, and managed cloud testing infrastructure. I believe a QA manager who understands the tools and architecture is better equipped to make smart decisions about where to invest.

I have also been investing heavily in AI for quality engineering. I build production applications using the Claude API and Claude Vision, and I apply those same patterns to QA. Automated test generation, requirements analysis using large language models, and intelligent tooling that catches problems earlier. I see this as the future of the role, and I want to be part of shaping it.`,
            closing: `I would really enjoy the chance to talk with the team at ${company} about how I could help build and strengthen your quality organization. I am confident I can make a meaningful impact, both right away and over the long term.`
        },
        'gen-ai-qa': {
            opening: `The ${jobTitle} role at ${company} immediately stood out to me. I have over 14 years of QA experience, but what makes my background a bit different is that I have also been building real AI applications for the past two years. That combination is exactly what this kind of role needs.`,
            body: `Where I have seen AI make the biggest difference is in the work itself. I have built agentic QA frameworks that use large language models to analyze requirements and surface gaps before code even reaches testing. I have created intelligent validation tools that automate test generation based on context, not just templates, and I have integrated AI into CI/CD workflows to catch the kinds of issues that traditional automation misses. These are not ideas I am pitching. They are tools I have built and used in real quality engineering environments, using the Claude API, Claude Vision, structured output, and prompt engineering.

With 14 years of QA behind me, I know what breaks and why. I have led teams, built automation frameworks using Selenium, Cypress, Appium, and Playwright, and worked across industries including life sciences, fintech, and enterprise security. That domain knowledge is what makes the AI work effective. It is one thing to call an API. It is another to know which problems are actually worth solving with it and how to validate the output.

Outside of work, I build personal projects to push my understanding of AI further. Things like a desktop app that uses agentic workflows to score job postings against resumes, a news reader with AI powered fact checking and deepfake detection using Claude Vision, and a web based tabletop game with an AI dungeon master and voice narration. They keep me sharp and let me experiment with patterns I can bring back to my professional work.`,
            closing: `I genuinely believe that the intersection of AI and quality engineering is where the most interesting work is happening right now, and ${company} seems like exactly the right place to do it. I would love to talk more about how I can contribute.`
        }
    };

    const t = templates[template];
    if (!t) return;

    // PDF formatting
    const margin = 25;
    const pageWidth = 210 - margin * 2;
    let y = 30;

    doc.setFont('helvetica', 'normal');

    // Name header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Rajiv Silva', margin, y);
    y += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Kitchener, Ontario, Canada  |  rajivshehan@gmail.com  |  linkedin.com/in/rajiv-silva  |  github.com/shehan-sj', margin, y);
    y += 5;

    // Divider
    doc.setDrawColor(200);
    doc.line(margin, y, 210 - margin, y);
    y += 12;

    // Date
    doc.setTextColor(60);
    doc.setFontSize(10);
    doc.text(today, margin, y);
    y += 14;

    // Greeting
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Dear Hiring Manager,', margin, y);
    y += 10;

    // Helper to write wrapped paragraphs
    function writeParagraph(text) {
        const lines = doc.splitTextToSize(text, pageWidth);
        for (let i = 0; i < lines.length; i++) {
            if (y > 270) {
                doc.addPage();
                y = 25;
            }
            doc.text(lines[i], margin, y);
            y += 5.5;
        }
        y += 4;
    }

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');

    writeParagraph(t.opening);

    // Body paragraphs (split on double newline)
    t.body.split('\n\n').forEach(para => {
        writeParagraph(para.trim());
    });

    writeParagraph(t.closing);

    // Sign off
    y += 2;
    doc.text('Sincerely,', margin, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Rajiv Silva', margin, y);

    // Save
    const filename = `Rajiv_Silva_Cover_Letter_${company.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
}
