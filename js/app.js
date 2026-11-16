import Header from './components/Header.js';
import Main from './components/Main.js';
import Footer from './components/Footer.js';
import Router from './router.js';
import { enableMotion, initSpotlight } from './core/effects.js';
import { keepCompoundsTogether } from './core/typography.js';
import { DEFAULT_ROUTE, currentRoute, prefersReducedMotion } from './core/utils.js';

export default class App {
    constructor(root) {
        this.root = root;

        // Анимации включаем до создания страниц, чтобы они знали о них с первого кадра
        enableMotion();

        this.header = new Header();
        this.main = new Main();
        this.footer = new Footer();

        this.init();
    }

    init() {
        this.root.replaceChildren(
            this.createSkipLink(),
            this.header.render(),
            this.main.render(),
            this.footer.render()
        );

        keepCompoundsTogether(this.header.render());
        keepCompoundsTogether(this.footer.render());

        initSpotlight();
        this.handleSamePageLinks();

        new Router(this.main);
    }

    // Невидимая кнопка для клавиатуры: появляется по Tab и ведёт сразу к содержимому
    createSkipLink() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'skip-link';
        button.textContent = 'Перейти к содержимому';
        button.addEventListener('click', () => this.main.focus());
        return button;
    }

    // Ссылка на уже открытую страницу ничего бы не сделала —
    // вместо этого плавно прокручиваем наверх
    handleSamePageLinks() {
        document.addEventListener('click', (event) => {
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

            const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
            if (!link || link.target === '_blank') return;

            const route = link.getAttribute('href').replace(/^#\/?/, '').toLowerCase() || DEFAULT_ROUTE;
            if (route !== currentRoute()) return;

            event.preventDefault();
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        });
    }
}

const appRoot = document.getElementById('app');
new App(appRoot);
