// Базовый класс для всех компонентов и страниц.
// Создаёт корневой элемент и даёт простой жизненный цикл: render → mount → destroy.
export default class Component {
    constructor(tag = 'div', className = '') {
        this.element = document.createElement(tag);
        if (className) this.element.className = className;
        this.cleanups = [];
    }

    // Корневой DOM-элемент компонента
    render() {
        return this.element;
    }

    // Вызывается после того, как элемент оказался на странице
    mount() {}

    // Запоминает функцию, которую нужно выполнить при уходе со страницы
    // (например, снять обработчики событий)
    onDestroy(cleanup) {
        this.cleanups.push(cleanup);
    }

    destroy() {
        this.cleanups.forEach((cleanup) => cleanup());
        this.cleanups = [];
    }
}
