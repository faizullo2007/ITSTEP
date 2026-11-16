import Component from '../core/Component.js';
import { icon } from '../core/icons.js';
import { escapeHtml, pad2, plural, prefersReducedMotion } from '../core/utils.js';
import { ctaBanner, pageHero } from '../components/sections.js';
import program from '../data/program.js';

const MODULE_FORMS = ['модуль', 'модуля', 'модулей'];
const TOPIC_FORMS = ['тема', 'темы', 'тем'];

export default class ProgramPage extends Component {
    constructor() {
        super('div', 'page-program');
        this.renderContent();

        this.steps = [...this.element.querySelectorAll('.step')];
        this.bars = [...this.element.querySelectorAll('.stairs__bar')];
        this.toggleAllButton = this.element.querySelector('[data-toggle-all]');

        this.bindEvents();
        this.updateToggleAll();
    }

    renderContent() {
        const topicsCount = program.reduce((sum, module) => sum + module.topics.length, 0);

        this.element.innerHTML = `
            ${pageHero({
                eyebrow: 'программа',
                title: 'Программа курса',
                lead: 'Обучение в академии построено по модульной системе — от базовых знаний к профессиональному уровню. Каждый модуль включает теорию, практику и проектную работу.',
            })}

            <section class="section section--top0">
                <div class="container program">
                    <aside class="program__aside">
                        <div class="card summary" data-reveal>
                            <h2 class="summary__title">Структура программы</h2>

                            <dl class="summary__stats">
                                <div class="summary__stat">
                                    <dt>${plural(program.length, MODULE_FORMS)}</dt>
                                    <dd class="grad-text">${program.length}</dd>
                                </div>
                                <div class="summary__stat">
                                    <dt>${plural(topicsCount, TOPIC_FORMS)}</dt>
                                    <dd class="grad-text">${topicsCount}</dd>
                                </div>
                            </dl>

                            <p class="summary__label">// от базы к профессии</p>
                            <div class="stairs">${this.renderStairs()}</div>
                            <div class="stairs__legend" aria-hidden="true">
                                <span>база</span>
                                <span>профи</span>
                            </div>

                            <p class="summary__label">// в каждом модуле</p>
                            <ul class="chips-row">
                                <li class="chip chip--brand">Теория</li>
                                <li class="chip chip--brand">Практика</li>
                                <li class="chip chip--brand">Проектная работа</li>
                            </ul>

                            <a class="btn btn--primary btn--block" href="#signup">
                                Записаться на курс${icon('arrowRight', { size: 18, className: 'icon--arrow' })}
                            </a>
                        </div>

                        <p class="note" data-reveal>
                            ${icon('refresh', { size: 18 })}
                            <span>Программа регулярно обновляется в соответствии с требованиями рынка и современными технологиями.</span>
                        </p>
                    </aside>

                    <div class="program__main">
                        <div class="program__bar" data-reveal>
                            <h2 class="section-title section-title--sm">Примерная структура программы</h2>
                            <button class="btn btn--ghost btn--sm" type="button" data-toggle-all>Развернуть все</button>
                        </div>

                        <ol class="steps">${this.renderSteps()}</ol>
                    </div>
                </div>
            </section>

            ${ctaBanner({
                title: 'Пройдите программу вместе с нами',
                text: 'От первых строк кода до защиты итогового проекта и готового портфолио.',
                secondary: { href: '#teachers', label: 'Преподаватели' },
            })}
        `;
    }

    // «Лесенка»: столбик на каждый модуль, по клику — переход к модулю
    renderStairs() {
        const last = Math.max(program.length - 1, 1);

        return program
            .map((module, index) => {
                const height = Math.round(30 + (70 * index) / last);
                const isOpen = index === 0;
                const label = `Модуль ${index + 1}: ${escapeHtml(module.title)}`;

                return `<button class="stairs__bar${isOpen ? ' is-active' : ''}" type="button" style="--h:${height}%" data-go="${index}" aria-label="${label}" title="${label}"></button>`;
            })
            .join('');
    }

    renderSteps() {
        return program
            .map((module, index) => {
                const isOpen = index === 0;
                const count = module.topics.length;

                const topics = module.topics
                    .map((topic, topicIndex) => `
                        <li class="topic">
                            <span class="topic__index">${index + 1}.${topicIndex + 1}</span>
                            <span>${escapeHtml(topic)}</span>
                        </li>
                    `)
                    .join('');

                return `
                    <li class="step${isOpen ? ' is-open' : ''}" data-reveal>
                        <div class="step__rail">
                            <span class="step__num">${pad2(index + 1)}</span>
                        </div>
                        <div class="step__card">
                            <h3>
                                <button class="step__toggle" type="button" id="step-toggle-${index}" aria-expanded="${isOpen}" aria-controls="step-panel-${index}">
                                    <span class="step__title">${escapeHtml(module.title)}</span>
                                    <span class="step__meta">${count} ${plural(count, TOPIC_FORMS)}</span>
                                    <span class="step__chevron">${icon('chevronDown', { size: 18 })}</span>
                                </button>
                            </h3>
                            <div class="step__panel" id="step-panel-${index}" role="region" aria-labelledby="step-toggle-${index}">
                                <div class="step__panel-inner">
                                    <ul class="topics">${topics}</ul>
                                </div>
                            </div>
                        </div>
                    </li>
                `;
            })
            .join('');
    }

    bindEvents() {
        // Раскрытие и сворачивание модуля
        this.element.querySelector('.steps').addEventListener('click', (event) => {
            const toggle = event.target.closest('.step__toggle');
            if (!toggle) return;

            const index = this.steps.indexOf(toggle.closest('.step'));
            this.setOpen(index, !this.isOpen(index));
        });

        // Клик по «ступеньке» открывает модуль и прокручивает к нему
        this.element.querySelector('.stairs').addEventListener('click', (event) => {
            const bar = event.target.closest('[data-go]');
            if (!bar) return;

            const index = Number(bar.dataset.go);
            const step = this.steps[index];

            // Модуль ниже экрана может ещё ждать анимации появления и быть сдвинутым —
            // показываем его сразу, иначе прокрутка промахнётся на величину сдвига
            step.removeAttribute('data-reveal');

            this.setOpen(index, true);
            step.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
            step.querySelector('.step__toggle').focus({ preventScroll: true });
        });

        this.toggleAllButton.addEventListener('click', () => {
            const open = !this.areAllOpen();
            this.steps.forEach((step, index) => this.setOpen(index, open, false));
            this.updateToggleAll();
        });
    }

    isOpen(index) {
        return this.steps[index].classList.contains('is-open');
    }

    areAllOpen() {
        return this.steps.every((step) => step.classList.contains('is-open'));
    }

    setOpen(index, open, updateButton = true) {
        const step = this.steps[index];

        step.classList.toggle('is-open', open);
        step.querySelector('.step__toggle').setAttribute('aria-expanded', String(open));
        this.bars[index]?.classList.toggle('is-active', open);

        if (updateButton) this.updateToggleAll();
    }

    updateToggleAll() {
        this.toggleAllButton.textContent = this.areAllOpen() ? 'Свернуть все' : 'Развернуть все';
    }
}
