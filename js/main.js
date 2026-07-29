/* ════════════════════════════════════════════════════════════
   Rajiv Silva — QA Leadership Portfolio
   Reveal on scroll, reading progress, cover letter utility
   ════════════════════════════════════════════════════════════ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initProgress();
    initNav();
    initPalette();
    initCoverLetter();
});

/* ─── Palette switcher ─────────────────────────────────── */
function initPalette() {
    const box = document.getElementById('palette');
    const toggle = document.getElementById('palette-toggle');
    const panel = document.getElementById('palette-panel');
    if (!box || !toggle || !panel) return;

    const opts = Array.from(panel.querySelectorAll('.palette-opt'));
    const root = document.documentElement;

    // The head script has already restored any saved choice before paint;
    // this only needs to mark the matching option.
    function mark(name) {
        opts.forEach(o => o.classList.toggle('is-on', o.dataset.theme === name));
    }

    function apply(name) {
        if (name) root.setAttribute('data-theme', name);
        else root.removeAttribute('data-theme');
        try { localStorage.setItem('palette', name); } catch (e) { /* storage blocked */ }
        mark(name);
    }

    function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    }

    mark(root.getAttribute('data-theme') || '');

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    opts.forEach(o => o.addEventListener('click', () => apply(o.dataset.theme)));

    document.addEventListener('click', e => {
        if (!panel.hidden && !box.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); }
    });
}

/* ─── Content reveals as it enters the viewport ─────────── */
function initReveal() {
    const items = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!items.length) return;

    const pending = new Set(items);

    // Paint straight to the finished state. GSAP is driven by
    // requestAnimationFrame, which browsers halt entirely while a tab is
    // hidden, so anything relying on it can strand content at opacity 0.
    function showInstantly() {
        for (const el of pending) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
        pending.clear();
    }

    // Reduced motion, or a tab nobody is watching: nothing to animate.
    if (REDUCED || document.hidden) {
        showInstantly();
        return;
    }

    gsap.set(items, { opacity: 0, y: 22 });

    function reveal(group) {
        group = group.filter(el => pending.has(el));
        if (!group.length) return;

        group.forEach(el => pending.delete(el));
        group.sort((a, b) => items.indexOf(a) - items.indexOf(b));

        gsap.to(group, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.07
        });
    }

    // Whatever is already on screen animates immediately, without waiting
    // on the observer, so the opening view is never blank.
    reveal(items.filter(el => el.getBoundingClientRect().top < innerHeight * 0.92));

    let batch = [];
    let flushId = null;

    const io = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            io.unobserve(entry.target);
            batch.push(entry.target);
            if (flushId === null) {
                flushId = requestAnimationFrame(() => {
                    flushId = null;
                    const group = batch;
                    batch = [];
                    reveal(group);
                });
            }
        }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    items.forEach(el => { if (pending.has(el)) io.observe(el); });

    // Backstops that do not depend on rAF.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) showInstantly();
    });
    setTimeout(showInstantly, 4000);
}

/* ─── Reading progress bar ─────────────────────────────── */
function initProgress() {
    const bar = document.getElementById('progress');
    if (!bar) return;

    // Driven by scroll events and written straight to style, so it stays
    // correct regardless of whether the animation clock is running.
    function update() {
        const max = document.documentElement.scrollHeight - innerHeight;
        const ratio = max > 0 ? Math.min(scrollY / max, 1) : 0;
        bar.style.transform = `scaleX(${ratio})`;
    }

    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
}

/* ─── Nav: stuck state, section spy, mobile menu ────────── */
function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    addEventListener('scroll', () => {
        nav?.classList.toggle('is-stuck', scrollY > 40);
    }, { passive: true });

    toggle?.addEventListener('click', () => {
        const open = links.classList.toggle('is-open');
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    links?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('is-open');
            toggle?.classList.remove('is-open');
            toggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Highlight the section currently under the top of the viewport.
    const sections = Array.from(links?.querySelectorAll('a') ?? [])
        .map(a => ({ link: a, el: document.querySelector(a.getAttribute('href')) }))
        .filter(s => s.el);

    if (!sections.length) return;

    function spy() {
        const line = scrollY + innerHeight * 0.3;
        let current = null;
        for (const s of sections) {
            if (s.el.offsetTop <= line) current = s;
        }
        sections.forEach(s => s.link.classList.toggle('is-active', s === current));
    }

    spy();
    addEventListener('scroll', spy, { passive: true });
}

/* ════════════════════════════════════════════════════════════
   Cover letter utility
   Open with: triple-click the footer mark, Ctrl+Shift+L, or ?cl=1
   ════════════════════════════════════════════════════════════ */
function initCoverLetter() {
    const modal = document.getElementById('cl-modal');
    if (!modal) return;

    const steps = {
        1: document.getElementById('cl-step-1'),
        2: document.getElementById('cl-step-2'),
        3: document.getElementById('cl-step-3')
    };
    let chosen = null;

    function show(step) {
        Object.entries(steps).forEach(([n, el]) => { el.hidden = Number(n) !== step; });
    }

    function open() {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        chosen = null;
        show(1);
    }

    function close() {
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    window.openCoverLetter = open;

    const mark = document.getElementById('foot-mark');
    let clicks = 0, timer = null;
    mark?.addEventListener('click', () => {
        clicks++;
        clearTimeout(timer);
        timer = setTimeout(() => { clicks = 0; }, 800);
        if (clicks >= 3) { clicks = 0; open(); }
    });

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            open();
        }
        if (e.key === 'Escape' && !modal.hidden) close();
    });

    if (new URLSearchParams(location.search).get('cl') === '1') open();

    document.getElementById('cl-close')?.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    modal.querySelectorAll('.cl-tpl').forEach(btn => {
        btn.addEventListener('click', () => {
            chosen = btn.dataset.template;
            show(2);
            document.getElementById('cl-company')?.focus();
        });
    });

    document.getElementById('cl-back')?.addEventListener('click', () => show(1));
    document.getElementById('cl-another')?.addEventListener('click', () => { chosen = null; show(1); });

    document.getElementById('cl-generate')?.addEventListener('click', () => {
        const company = document.getElementById('cl-company').value.trim() || 'your organization';
        const title = document.getElementById('cl-job-title').value.trim() || 'this role';
        generateCoverLetterPDF(chosen, company, title);
        show(3);
    });

    ['cl-company', 'cl-job-title'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') document.getElementById('cl-generate')?.click();
        });
    });
}

/* ─── PDF generation ────────────────────────────────────── */
function generateCoverLetterPDF(template, company, jobTitle) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const templates = {
        'senior-qa': {
            opening: `I wanted to reach out about the ${jobTitle} role at ${company}. I have been working in software quality assurance and test automation for over 15 years, and this position feels like a natural fit for the kind of work I do best.`,
            body: `Over the years, I have had the chance to build QA practices from the ground up across several industries, including life sciences, fintech, and enterprise security. That range has taught me how to adapt quickly, whether I am working in a heavily regulated environment or moving fast with a startup shipping new features every week. I have led validation efforts, built out automation strategies, and helped teams ship with confidence.

On the technical side, I work extensively with Selenium, Cypress, Appium, and Playwright, and I am very comfortable writing automation in Python, JavaScript, and TypeScript. I have set up and maintained CI/CD pipelines, worked with Docker and cloud platforms like AWS and Azure, and built testing infrastructure that scales with the product.

What really excites me right now is how AI is changing the way we think about quality. I have been building production applications using the Claude API, Claude Vision, and agentic workflows. I use these tools to automate test generation, analyze requirements for gaps, and build intelligent QA tooling that catches issues earlier in the cycle. It is not just a side interest for me. It is how I think the future of QA looks, and I am already doing it.`,
            closing: `I would love the chance to chat about how my experience could be useful to the team at ${company}. I think there is a lot I could bring to the table, and I am genuinely excited about the work you are doing.`
        },
        'qa-lead': {
            opening: `I came across the ${jobTitle} opening at ${company} and it caught my attention right away. I have spent the better part of 15 years in quality assurance, and a good chunk of that has been in leadership roles where I was responsible for building teams and setting the direction for how we approach quality.`,
            body: `One of the things I enjoy most is taking a QA function that is either early stage or in need of a reset and turning it into something the whole engineering org can rely on. I have done this several times now, building automation frameworks, establishing CI/CD testing pipelines, mentoring junior testers, and creating the kind of processes that actually stick. In one case, the impact of that work led directly to a promotion from lead to manager, which felt like a great validation that the approach was working.

I have led teams across a range of platforms including web, mobile, desktop, and API. My technical toolkit includes Selenium, Cypress, Appium, and Playwright, and I write most of my automation in Python, JavaScript, and TypeScript. I also have solid experience with CI/CD systems, Docker, and cloud testing platforms.

Something I have been leaning into heavily is using AI to make QA smarter. I have built production applications with the Claude API and Claude Vision, and I apply those same ideas to quality engineering. Think automated test generation, intelligent analysis of requirements, and tooling that uses large language models to surface risks before code even gets to QA. It is a huge multiplier for a team, and I am eager to bring that thinking to the right organization.`,
            closing: `I think there is a strong alignment between what I bring and what ${company} is looking for. I would welcome the chance to have a conversation about it and learn more about the team.`
        },
        'qa-manager': {
            opening: `I am reaching out about the ${jobTitle} position at ${company}. I have over 15 years in quality assurance, and my career has taken me from writing test cases to managing entire QA organizations. That full journey gives me a perspective on quality that is both strategic and deeply technical.`,
            body: `I have managed QA teams in environments where the stakes were high and the margin for error was small. Whether it was a fintech platform processing real transactions or a regulated life sciences product, I learned how to build a quality culture that balances speed with thoroughness. I care a lot about hiring well, growing people, and creating an environment where testers feel ownership over the product, not just the test plan.

On the process side, I have experience building out QA strategies from scratch, establishing standards across web and mobile, and working within compliance frameworks. I have also built automation programs that gave teams real confidence in their releases, using tools like Selenium, Cypress, Appium, and Playwright across a variety of tech stacks.

I still stay close to the technical side. I write automation in Python, JavaScript, and TypeScript. I have set up CI/CD pipelines, worked with Docker, and managed cloud testing infrastructure. I believe a QA manager who understands the tools and architecture is better equipped to make smart decisions about where to invest.

I have also been investing heavily in AI for quality engineering. I build production applications using the Claude API and Claude Vision, and I apply those same patterns to QA. Automated test generation, requirements analysis using large language models, and intelligent tooling that catches problems earlier. I see this as the future of the role, and I want to be part of shaping it.`,
            closing: `I would really enjoy the chance to talk with the team at ${company} about how I could help build and strengthen your quality organization. I am confident I can make a meaningful impact, both right away and over the long term.`
        },
        'gen-ai-qa': {
            opening: `The ${jobTitle} role at ${company} immediately stood out to me. I have over 15 years of QA experience, but what makes my background a bit different is that I have also been building real AI applications for the past two years. That combination is exactly what this kind of role needs.`,
            body: `Where I have seen AI make the biggest difference is in the work itself. I have built agentic QA frameworks that use large language models to analyze requirements and surface gaps before code even reaches testing. I have created intelligent validation tools that automate test generation based on context, not just templates, and I have integrated AI into CI/CD workflows to catch the kinds of issues that traditional automation misses. These are not ideas I am pitching. They are tools I have built and used in real quality engineering environments, using the Claude API, Claude Vision, structured output, and prompt engineering.

With 15 years of QA behind me, I know what breaks and why. I have led teams, built automation frameworks using Selenium, Cypress, Appium, and Playwright, and worked across industries including life sciences, fintech, and enterprise security. That domain knowledge is what makes the AI work effective. It is one thing to call an API. It is another to know which problems are actually worth solving with it and how to validate the output.

Outside of work, I build personal projects to push my understanding of AI further. Things like a self-hosted assistant that runs entirely offline with its own memory and retrieval layer, a desktop app that uses agentic workflows to score job postings against resumes, and a web based tabletop game with an AI dungeon master. They keep me sharp and let me experiment with patterns I can bring back to my professional work.`,
            closing: `I genuinely believe that the intersection of AI and quality engineering is where the most interesting work is happening right now, and ${company} seems like exactly the right place to do it. I would love to talk more about how I can contribute.`
        }
    };

    const t = templates[template];
    if (!t) return;

    const margin = 25;
    const pageWidth = 210 - margin * 2;
    let y = 30;

    doc.setFont('helvetica', 'normal');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Rajiv Silva', margin, y);
    y += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Kitchener, Ontario, Canada  |  rajivshehan@gmail.com  |  linkedin.com/in/rajiv-silva  |  github.com/shehan-sj', margin, y);
    y += 5;

    doc.setDrawColor(200);
    doc.line(margin, y, 210 - margin, y);
    y += 12;

    doc.setTextColor(60);
    doc.setFontSize(10);
    doc.text(today, margin, y);
    y += 14;

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text('Dear Hiring Manager,', margin, y);
    y += 10;

    function writeParagraph(text) {
        const lines = doc.splitTextToSize(text, pageWidth);
        for (const line of lines) {
            if (y > 270) { doc.addPage(); y = 25; }
            doc.text(line, margin, y);
            y += 5.5;
        }
        y += 4;
    }

    doc.setFontSize(10.5);
    writeParagraph(t.opening);
    t.body.split('\n\n').forEach(p => writeParagraph(p.trim()));
    writeParagraph(t.closing);

    y += 2;
    doc.text('Sincerely,', margin, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Rajiv Silva', margin, y);

    const safe = company.replace(/[^a-z0-9]/gi, '_');
    doc.save(`Rajiv_Silva_Cover_Letter_${safe}.pdf`);
}
