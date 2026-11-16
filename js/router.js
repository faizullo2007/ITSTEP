import AboutPage from './pages/AboutPage.js';
import ProgramPage from './pages/ProgramPage.js';
import TeachersPage from './pages/TeachersPage.js';
import SignupPage from './pages/SignupPage.js';
import AcademyPage from './pages/AcademyPage.js';
import NotFoundPage from './pages/NotFoundPage.js';
import { currentRoute } from './core/utils.js';

const SITE_NAME = 'IT-Step';

// Адрес после «#» → заголовок вкладки и класс страницы
const routes = {
    about: { title: 'О курсе', Page: AboutPage },
    program: { title: 'Программа курса', Page: ProgramPage },
    teachers: { title: 'Преподаватели', Page: TeachersPage },
    signup: { title: 'Запись на курс', Page: SignupPage },
    academy: { title: 'Об академии', Page: AcademyPage },
};

const notFound = { title: 'Страница не найдена', Page: NotFoundPage };

export default class Router {
    constructor(main) {
        this.main = main;
        this.isFirstRoute = true;

        window.addEventListener('hashchange', () => this.route());
        this.route();
    }

    route() {
        const { title, Page } = routes[currentRoute()] ?? notFound;

        document.title = `${title} — ${SITE_NAME}`;
        this.main.setContent(new Page());

        // При переходе между страницами начинаем с самого верха
        // и переносим фокус на содержимое (важно для клавиатуры и скринридеров)
        if (!this.isFirstRoute) {
            window.scrollTo(0, 0);
            this.main.focus();
        }
        this.isFirstRoute = false;
    }
}
