document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const birthdayDay = 27;

        function updateCountdown() {
            const now = new Date();
            let year = now.getFullYear();
            let birthday = new Date(year, 3, birthdayDay);

            if (now > birthday) {
                birthday.setFullYear(year + 1);
            }

            const diff = birthday - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownElement.innerText = `${days}天 ${hours}時 ${minutes}分 ${seconds}秒`;

            const y = birthday.getFullYear();
            const m = String(birthday.getMonth() + 1).padStart(2, '0');
            const d = String(birthday.getDate()).padStart(2, '0');

            countdownElement.title = `${y}/${m}/${d}`;
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

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

    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .hero').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
});
