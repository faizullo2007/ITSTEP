import Component from '../core/Component.js';
import { observeReveals } from '../core/effects.js';
import { keepCompoundsTogether } from '../core/typography.js';

export default class Main extends Component {
    constructor() {
        super('main', 'main');
        this.element.id = 'main';
        this.element.tabIndex = -1; // чтобы на main можно было перевести фокус из кода
        this.page = null;
        this.stopReveals = null;
    }

    // Показывает новую страницу вместо текущей
    setContent(page) {
        this.stopReveals?.();
        this.page?.destroy();
        this.page = page;

        const content = page.render();
        content.classList.add('page');
        this.element.replaceChildren(content);

        keepCompoundsTogether(content);
        page.mount();
        this.stopReveals = observeReveals(content);
    }

    focus() {
        this.element.focus({ preventScroll: true });
    }
}
