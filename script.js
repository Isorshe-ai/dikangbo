document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateIcon(savedTheme === 'dark');
    } else {
        // Default to dark mode if no preference
        body.classList.add('dark');
        updateIcon(true);
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
    });

    function updateIcon(isDark) {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Typing Effect for Hero
    const textToType = "DevOps Engineer | Cloud Architect | Automation Expert";
    const typingElement = document.getElementById('typing-text');
    let charIndex = 0;

    function typeText() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 50);
        }
    }

    // Start typing after a short delay
    setTimeout(typeText, 500);

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Mobile Navigation (if we add a hamburger menu later)
    // currently using a simple layout that works on mobile without a complex menu

    /* --- Interactive About Me --- */
    const toggles = document.querySelectorAll('.toggle-btn');
    const views = document.querySelectorAll('.view-content');
    const recruiterText = document.getElementById('recruiter-text').innerText;

    // Clear initial text to prepare for typing
    // document.getElementById('recruiter-text').innerText = ''; 
    // Actually, let's leave it visible by default for SEO/non-JS, and maybe animate it if triggered.
    // For this specific request, let's type it when the section is revealed or when switched to.

    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            toggles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show selected view
            const viewId = btn.getAttribute('data-view') + '-view';
            views.forEach(view => {
                if (view.id === viewId) {
                    view.style.display = 'block';
                    view.classList.add('active');
                } else {
                    view.style.display = 'none';
                    view.classList.remove('active');
                }
            });

            // Trigger animations based on view
            if (btn.getAttribute('data-view') === 'recruiter') {
                // Restart typewriter? Or just show it. 
                // Let's re-run the typewriter for effect.
                const p = document.getElementById('recruiter-text');
                p.innerText = '';
                typeWriter(p, recruiterText, 10);
            } else {
                // Dev mode usually just shows the code block.
                // We could optionally type the code too, but nice formatting is better static or faded in.
            }
        });
    });

    function typeWriter(element, text, speed) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initial typewriter on load (or scroll)
    // We can use the existing observer to trigger this if we want.
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const p = document.getElementById('recruiter-text');
                if (p.getAttribute('data-typed') !== 'true') {
                    p.innerText = '';
                    typeWriter(p, recruiterText, 20);
                    p.setAttribute('data-typed', 'true');
                }
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) aboutObserver.observe(aboutSection);

    // Dynamic Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Syntax Highlight Dev Mode
    const devText = document.getElementById('dev-text');
    if (devText) {
        const rawJson = devText.textContent;
        // Simple regex-based highlighting
        const highlighted = rawJson.replace(/(".*?")(?=:)/g, '<span class="json-key">$1</span>') // Keys
            .replace(/: ("(.*?)")/g, ': <span class="json-string">"$2"</span>') // String Values
            .replace(/: (\d+)/g, ': <span class="json-number">$1</span>') // Numbers
            .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>'); // Booleans (if any)
        devText.innerHTML = highlighted;
    }

});

// PDF Generation Function
// PDF Generation Function
function downloadResume() {
    // 0. Confirmation Prompt
    if (!confirm("Generate and download resume as PDF?")) {
        return;
    }

    // Check if library is loaded
    if (typeof html2pdf === 'undefined') {
        alert('PDF generator library not loaded. Please try again later.');
        return;
    }

    // 1. Create a temporary container for the resume
    const resumeContainer = document.createElement('div');
    resumeContainer.classList.add('resume-print-mode');

    // 2. Build Header (Name, Title, Contact Info)
    const header = document.createElement('header');
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    header.style.borderBottom = '1px solid #333';
    header.style.paddingBottom = '10px';

    const name = document.createElement('h1');
    name.textContent = "David Ikangbo";
    name.style.margin = "0 0 5px 0";

    const title = document.createElement('p');
    title.textContent = "DevOps Engineer | Cloud Architect | Automation Expert";
    title.style.fontSize = "1.2rem";
    title.style.margin = "0 0 5px 0";
    title.style.fontWeight = "bold";

    // Extract Contact Info from JSON in CLI window to be safe/accurate, or hardcode relative to known data
    const contactInfo = document.createElement('p');
    contactInfo.innerHTML = `
        davidikangbo@gmail.com &bull; 
        +234 816 599 6623 &bull; 
        https://dikangbo.netlify.app &bull;
        Nigeria
    `;
    contactInfo.style.fontSize = "0.9rem";
    contactInfo.style.margin = "0";

    header.appendChild(name);
    header.appendChild(title);
    header.appendChild(contactInfo);
    resumeContainer.appendChild(header);

    // 3. Clone specifics sections
    function cloneResSection(id, newTitle) {
        const original = document.getElementById(id);
        if (original) {
            // Create wrapper
            const wrapper = document.createElement('section');
            wrapper.style.marginBottom = "15px";

            // Add Header
            const sectionDictHeader = document.createElement('h3');
            sectionDictHeader.textContent = newTitle;
            sectionDictHeader.style.borderBottom = "1px solid #ccc";
            sectionDictHeader.style.paddingBottom = "3px";
            sectionDictHeader.style.marginTop = "0";
            sectionDictHeader.style.marginBottom = "10px";
            sectionDictHeader.style.textTransform = "uppercase";
            sectionDictHeader.style.fontSize = "1rem";
            wrapper.appendChild(sectionDictHeader);

            const clone = original.cloneNode(true);

            // Cleanup Clone content
            // Remove original h2 headers as we added our own
            const h2 = clone.querySelector('h2');
            if (h2) h2.remove();

            // Remove icons from text if any remain (handled by CSS mostly, but cleaner DOM is better)

            // Remove "View Details" links
            const links = clone.querySelectorAll('a.project-link');
            links.forEach(l => l.remove());

            // Remove Toggles
            const toggle = clone.querySelector('.view-toggle');
            if (toggle) toggle.remove();

            // Fix About Section Text
            const recruiterView = clone.querySelector('#recruiter-view');
            if (recruiterView) {
                recruiterView.style.display = 'block';
                const cloneText = clone.querySelector('#recruiter-text');
                cloneText.textContent = "I am an experienced IT service delivery professional with over 8 years of expertise across DevOps, Cloud Infrastructure, Software Development, and IT Support. I specialize in deploying scalable systems on AWS and GCP, managing hybrid environments, and driving operational efficiency in banking, healthcare, and NGO sectors. I am passionate about automation, security (Vault), and observability (Prometheus/Grafana).";
            }

            // Remove Dev View
            const devView = clone.querySelector('#developer-view');
            if (devView) devView.remove();

            wrapper.appendChild(clone);
            resumeContainer.appendChild(wrapper);
        }
    }

    cloneResSection('about', 'Summary');
    cloneResSection('skills', 'Technical Skills');
    cloneResSection('experience', 'Professional Experience');
    cloneResSection('projects', 'Key Projects');
    cloneResSection('education', 'Education');
    cloneResSection('certifications', 'Certifications');

    // 4. Append to body temporarily
    // Use absolute positioning on top of everything to ensure full render
    resumeContainer.style.position = 'absolute';
    resumeContainer.style.top = '0';
    resumeContainer.style.left = '0';
    resumeContainer.style.width = '100%';
    resumeContainer.style.minHeight = '100vh';
    resumeContainer.style.zIndex = '10000';
    resumeContainer.style.backgroundColor = 'white';
    resumeContainer.style.padding = '40px';

    // Hide main content to prevent interference (optional but safer)
    // const mainContent = document.querySelector('main');
    // const originalMainDisplay = mainContent.style.display;
    // mainContent.style.display = 'none'; // logic with html2canvas can be tricky if we hide parent, but main is sibling.

    document.body.appendChild(resumeContainer);
    window.scrollTo(0, 0); // Scroll to top to ensure capture starts right

    // 5. Generate PDF
    const opt = {
        margin: 0.4,
        filename: 'David_Ikangbo_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Increase delay slightly to ensure DOM settle
    setTimeout(() => {
        html2pdf().set(opt).from(resumeContainer).save().finally(() => {
            document.body.removeChild(resumeContainer);
            // mainContent.style.display = originalMainDisplay;
        });
    }, 500);
}
