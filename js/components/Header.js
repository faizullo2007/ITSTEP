import Component from '../core/Component.js';
import { brandMark, icon } from '../core/icons.js';
import { currentRoute, prefersReducedMotion, storage } from '../core/utils.js';
import { navLinks, signupLink } from '../data/navigation.js';

const THEME_KEY = 'theme';
// Цвет адресной строки в мобильных браузерах — под цвет фона сайта
const THEME_COLORS = { light: '#f4f6fb', dark: '#070a13' };

export default class Header extends Component {
    constructor() {
        super('header', 'site-header');
        this.renderContent();

        this.nav = this.element.querySelector('.site-nav');
        this.indicator = this.element.querySelector('.site-nav__indicator');
        this.burger = this.element.querySelector('.burger');
        this.themeToggle = this.element.querySelector('.theme-toggle');
        this.isMenuOpen = false;

        this.initTheme();
        this.initMenu();
        this.initScrollState();
        this.setActive();

        window.addEventListener('hashchange', () => {
            this.closeMenu();
            this.setActive();
        });

        // Ширина пунктов меняется (загрузились шрифты, изменился размер окна) —
        // индикатор активного пункта нужно пересчитать
        new ResizeObserver(() => this.moveIndicator()).observe(this.nav);
    }

    renderContent() {
        const links = navLinks
            .map(({ href, label }) => `<a class="site-nav__link" href="${href}" data-link>${label}</a>`)
            .join('');

        this.element.innerHTML = `
            <div class="container site-header__inner">
                <a class="brand" href="#about" aria-label="IT-Step — на главную">
                    ${brandMark()}
                    <span>IT-Step</span>
                </a>

                <nav class="site-nav" id="site-nav" aria-label="Основная навигация">
                    <span class="site-nav__indicator" aria-hidden="true"></span>
                    ${links}
                    <a class="btn btn--primary site-nav__cta" href="${signupLink.href}">${signupLink.label}</a>
                </nav>

                <div class="site-header__actions">
                    <button class="icon-btn theme-toggle" type="button">
                        ${icon('sun', { className: 'icon--sun' })}
                        ${icon('moon', { className: 'icon--moon' })}
                    </button>
                    <a class="btn btn--primary btn--sm site-header__cta" href="${signupLink.href}">${signupLink.label}</a>
                    <button class="icon-btn burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="site-nav">
                        <span class="burger__box"><i></i><i></i><i></i></span>
                    </button>
                </div>
            </div>
        `;
    }

    /* ---------- Тема ---------- */

    initTheme() {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
        const saved = storage.get(THEME_KEY);

        // Тему уже выставил скрипт в index.html (чтобы не было вспышки);
        // здесь только синхронизируем кнопку и запасной вариант
        const initial = saved === 'dark' || saved === 'light'
            ? saved
            : document.documentElement.dataset.theme || (systemDark.matches ? 'dark' : 'light');
        this.applyTheme(initial);

        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Пока пользователь не выбрал тему сам — следуем за системной
        systemDark.addEventListener('change', (event) => {
            if (!storage.get(THEME_KEY)) this.applyTheme(event.matches ? 'dark' : 'light');
        });
    }

    applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        this.themeToggle.setAttribute(
            'aria-label',
            theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему',
        );
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
    }

    toggleTheme() {
        const root = document.documentElement;
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        const apply = () => {
            this.applyTheme(next);
            storage.set(THEME_KEY, next);
        };

        // Старые браузеры и режим «меньше анимаций» — просто переключаем
        if (!document.startViewTransition || prefersReducedMotion()) {
            apply();
            return;
        }

        // Новая тема «разливается» кругом из-под кнопки
        const { left, top, width, height } = this.themeToggle.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        root.classList.add('theme-switching');
        const transition = document.startViewTransition(apply);

        transition.ready
            .then(() => {
                root.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                    {
                        duration: 550,
                        easing: 'cubic-bezier(.4, 0, .2, 1)',
                        pseudoElement: '::view-transition-new(root)',
                    },
                );
            })
            .catch(() => {});

        transition.finished
            .catch(() => {})
            .then(() => root.classList.remove('theme-switching'));
    }

    /* ---------- Мобильное меню ---------- */

    initMenu() {
        this.burger.addEventListener('click', (event) => {
            if (this.isMenuOpen) {
                this.closeMenu();
                return;
            }
            this.setMenu(true);
            // Открыли с клавиатуры — сразу переносим фокус на первый пункт
            if (event.detail === 0) this.nav.querySelector('a')?.focus();
        });

        // Клик по пункту закрывает меню, даже если страница не изменилась
        this.nav.addEventListener('click', (event) => {
            if (event.target.closest('a')) this.closeMenu();
        });

        document.addEventListener('click', (event) => {
            if (this.isMenuOpen && !this.element.contains(event.target)) this.closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
                this.burger.focus();
            }
        });

        window.matchMedia('(min-width: 960px)').addEventListener('change', () => this.closeMenu());
    }

    closeMenu() {
        if (this.isMenuOpen) this.setMenu(false);
    }

    setMenu(open) {
        this.isMenuOpen = open;
        this.nav.classList.toggle('is-open', open);
        this.burger.setAttribute('aria-expanded', String(open));
        this.burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    }

    /* ---------- Состояние шапки ---------- */

    initScrollState() {
        const update = () => this.element.classList.toggle('is-scrolled', window.scrollY > 8);
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    setActive() {
        const hash = `#${currentRoute()}`;

        // Отмечаем текущую страницу и в меню, и на кнопках «Записаться»
        this.element.querySelectorAll('[data-link], .site-header__cta, .site-nav__cta').forEach((link) => {
            const isActive = link.getAttribute('href') === hash;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        this.moveIndicator();
    }

    // Передвигает «таблетку» под активный пункт меню
    moveIndicator() {
        const active = this.nav.querySelector('.site-nav__link.is-active');

        if (!active || !active.offsetWidth) {
            this.indicator.style.opacity = '0';
            return;
        }

        this.indicator.style.width = `${active.offsetWidth}px`;
        this.indicator.style.transform = `translateX(${active.offsetLeft}px)`;
        this.indicator.style.opacity = '1';

        // Анимацию включаем только после первой расстановки,
        // иначе при загрузке индикатор «приезжает» из левого угла
        if (!this.indicator.classList.contains('is-ready')) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => this.indicator.classList.add('is-ready'));
            });
        }
    }
}
