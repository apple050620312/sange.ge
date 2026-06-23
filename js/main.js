document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Fetch and render data
    fetch('/data.json')
        .then(res => res.json())
        .then(data => {
            const renderGrid = (containerSelector, items, isEvent) => {
                const container = document.querySelector(containerSelector);
                if (!container) return;
                
                const html = items.map(item => `
                <a href="${item.url}" target="_blank" class="default-card ${isEvent ? 'event-card' : 'team-card'}" data-aos="zoom-in">
                    <div class="default-logo">
                        <img src="${item.logo}" alt="${item.title}">
                    </div>
                    <div class="default-info">
                        <span class="default-title">${item.title}</span>
                        <p class="default-desc">${item.desc}</p>
                    </div>
                </a>
                `).join('');
                
                container.innerHTML = html;
            };

            renderGrid('#teams .team-grid', data.teams, false);
            renderGrid('#events .event-grid', data.events, true);
            renderGrid('#friends .team-grid', data.friends, false);

            // Apply AOS delay and init
            document.querySelectorAll('.default-grid').forEach(grid => {
                Array.from(grid.children).forEach((child, index) => {
                    const delay = ((index % 5) + 1) * 100;
                    child.setAttribute('data-aos-delay', delay);
                });
            });

            AOS.init({
                duration: 800,
                offset: 100,
                once: true
            });
        })
        .catch(err => console.error('Error loading data:', err));

});
