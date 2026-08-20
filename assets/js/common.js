// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    const themeToggle = document.querySelector('.theme-toggle');

    function updateThemeToggle(theme) {
        if (!themeToggle) return;
        const isDark = theme === 'dark';
        const label = isDark ? 'Switch to light mode' : 'Switch to night mode';
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', label);
        themeToggle.querySelector('.theme-toggle-label').textContent = label;
        themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        const visibleLabel = themeToggle.querySelector('.theme-toggle-text');
        if (visibleLabel) visibleLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    updateThemeToggle(document.documentElement.getAttribute('data-theme'));

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            updateThemeToggle(nextTheme);
        });
    }

    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
                element.css('min-height', '0');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });

    const sectionLinks = document.querySelectorAll('.section-nav-link');
    const sections = Array.from(sectionLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    sectionLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start'
            });

            if (history.replaceState) {
                history.replaceState(null, '', this.getAttribute('href'));
            }
        });
    });

    if (sectionLinks.length && sections.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (visible.length) {
                sectionLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.section-nav-link[href="#${visible[0].target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

        sections.forEach(section => observer.observe(section));
    }
})
