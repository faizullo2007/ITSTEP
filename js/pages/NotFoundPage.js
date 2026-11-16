import Component from '../core/Component.js';
import { icon } from '../core/icons.js';

// Показывается, если в адресе после «#» указана несуществующая страница
export default class NotFoundPage extends Component {
    constructor() {
        super('div', 'page-notfound');
        this.renderContent();
    }

    renderContent() {
        this.element.innerHTML = `
            <section class="notfound">
                <div class="container">
                    <p class="notfound__code grad-text" data-reveal aria-hidden="true">404</p>
                    <h1 class="notfound__title" data-reveal>Страница не найдена</h1>
                    <p class="lead notfound__text" data-reveal>
                        Такой страницы нет. Возможно, ссылка устарела или в адресе опечатка.
                    </p>
                    <a class="btn btn--primary btn--lg" href="#about" data-reveal>
                        ${icon('home', { size: 18 })}На главную
                    </a>
                </div>
            </section>
        `;
    }
}
