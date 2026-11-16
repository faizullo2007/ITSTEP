import Component from '../core/Component.js';
import { initTilt } from '../core/effects.js';
import { icon } from '../core/icons.js';
import { escapeHtml, pad2, plural } from '../core/utils.js';
import { ctaBanner } from '../components/sections.js';
import directions from '../data/directions.js';
import program from '../data/program.js';

// Подсветка синтаксиса для декоративной карточки с кодом
const kw = (text) => `<span class="tok-k">${text}</span>`;
const str = (text) => `<span class="tok-s">'${text}'</span>`;
const fn = (text) => `<span class="tok-f">${text}</span>`;
const prop = (text) => `<span class="tok-p">${text}</span>`;
const comment = (text) => `<span class="tok-c">${text}</span>`;

const CODE_LINES = [
    comment('// путь студента IT-Step'),
    `${kw('const')} student = {`,
    `  ${prop('level')}: ${str('с нуля')},`,
    `  ${prop('goal')}: ${str('профессия в IT')},`,
    '};',
    '',
    `${kw('for')} (${kw('const')} module ${kw('of')} program) {`,
    `  ${kw('await')} student.${fn('learn')}(module);`,
    '}',
    '',
    `student.${fn('get')}(${str('диплом')}, ${str('портфолио')});`,
];

const HERO_TICKS = ['Практика и проекты', 'Очно и онлайн', 'Диплом и портфолио'];

const FEATURES = [
    {
        icon: 'terminal',
        title: 'Практическая работа',
        text: 'Знания сразу закрепляются на практике, а не остаются теорией.',
    },
    {
        icon: 'folder',
        title: 'Выполнение проектов',
        text: 'Проекты, сделанные во время обучения, складываются в портфолио.',
    },
    {
        icon: 'award',
        title: 'Профессиональные навыки',
        text: 'Развитие навыков, которые нужны для реальной работы в IT.',
    },
];

const AUDIENCE = [
    {
        icon: 'rocket',
        title: 'Новичкам без опыта',
        text: 'Обучение с нуля: начинаем с основ и идём к профессиональному уровню.',
    },
    {
        icon: 'graduationCap',
        title: 'Студентам',
        text: 'Практические навыки, которые нужны для работы в IT-сфере.',
    },
    {
        icon: 'trendingUp',
        title: 'Тем, кто уже знаком с IT',
        text: 'Возможность углубить уже имеющиеся знания в сфере информационных технологий.',
    },
];

const arrow = () => icon('arrowRight', { size: 18, className: 'icon--arrow' });

export default class AboutPage extends Component {
    constructor() {
        super('div', 'page-about');
        this.renderContent();
    }

    mount() {
        // Карточка с кодом наклоняется вслед за курсором
        const stopTilt = initTilt(
            this.element.querySelector('.hero'),
            this.element.querySelector('.stage'),
        );
        this.onDestroy(stopTilt);
    }

    renderContent() {
        this.element.innerHTML = `
            ${this.renderHero()}
            ${this.renderStats()}
            ${this.renderDirections()}
            ${this.renderFeatures()}
            ${this.renderAudience()}
            ${ctaBanner({
                title: 'Готовы сделать первый шаг?',
                text: 'Оставьте заявку на курс — это займёт меньше минуты.',
                secondary: { href: '#academy', label: 'Об академии' },
            })}
        `;
    }

    renderHero() {
        const ticks = HERO_TICKS
            .map((text) => `<li>${icon('check', { size: 16, strokeWidth: 2.6 })}${text}</li>`)
            .join('');

        return `
            <section class="hero">
                <div class="container hero__grid">
                    <div class="hero__content">
                        <p class="chip" data-reveal>
                            <span class="chip__dot"></span>IT STEP Academy · Ташкент
                        </p>
                        <h1 class="hero__title" data-reveal>
                            Войдите в&nbsp;IT <span class="grad-text">шаг за&nbsp;шагом</span>
                        </h1>
                        <p class="lead hero__lead" data-reveal>
                            IT STEP Academy — это современное IT-образование для детей, подростков
                            и взрослых. Курсы разработаны для обучения с нуля и для тех, кто хочет
                            углубить уже имеющиеся знания в сфере информационных технологий.
                        </p>
                        <div class="hero__actions" data-reveal>
                            <a class="btn btn--primary btn--lg" href="#signup">Записаться на курс${arrow()}</a>
                            <a class="btn btn--ghost btn--lg" href="#program">Смотреть программу</a>
                        </div>
                        <ul class="hero__ticks" data-reveal>${ticks}</ul>
                    </div>

                    <div class="hero__visual" data-reveal aria-hidden="true">
                        ${this.renderCodeCard()}
                    </div>
                </div>
            </section>
        `;
    }

    // Декоративная карточка: «код», по которому студент проходит программу
    renderCodeCard() {
        const lineStep = 70;
        const codeStart = 350;

        const code = CODE_LINES
            .map((line, index) => `<span class="code-line" style="--d:${codeStart + index * lineStep}ms">${line}</span>`)
            .join('');

        // В «консоли» — первые модули настоящей программы курса
        const consoleStart = codeStart + CODE_LINES.length * lineStep + 200;
        const modules = program.slice(0, 3);
        const output = modules
            .map((module, index) => {
                const delay = consoleStart + (index + 1) * 350;
                const title = escapeHtml(module.title);
                const isCurrent = index === modules.length - 1;

                return isCurrent
                    ? `<span class="out-line out-line--run" style="--d:${delay}ms"><span class="out-line__mark"><i class="spinner"></i></span>${title}<i class="caret"></i></span>`
                    : `<span class="out-line" style="--d:${delay}ms"><span class="out-line__mark">${icon('check', { size: 12, strokeWidth: 3 })}</span>${title}</span>`;
            })
            .join('');

        return `
            <div class="stage">
                <div class="stage__glow"></div>
                <div class="stage__float">
                    <div class="code-card">
                        <div class="code-card__bar">
                            <i class="code-card__dot"></i><i class="code-card__dot"></i><i class="code-card__dot"></i>
                            <span class="code-card__file">step.js</span>
                        </div>
                        <div class="code-card__body">${code}</div>
                        <div class="code-card__out">
                            <span class="out-line out-line--cmd" style="--d:${consoleStart}ms"><span class="out-line__mark">$</span>node step.js</span>
                            ${output}
                        </div>

                        <div class="float-badge float-badge--a">
                            <span class="icon-tile icon-tile--solid">${icon('graduationCap', { size: 18 })}</span>
                            Диплом академии
                        </div>
                        <div class="float-badge float-badge--b">
                            <span class="icon-tile icon-tile--solid">${icon('briefcase', { size: 18 })}</span>
                            Готовое портфолио
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStats() {
        const directionsCount = directions.length;
        const modulesCount = program.length;

        const stats = [
            { value: '1999', label: 'год основания академии' },
            {
                value: directionsCount,
                label: `${plural(directionsCount, ['направление', 'направления', 'направлений'])} обучения`,
            },
            {
                value: modulesCount,
                label: `${plural(modulesCount, ['модуль', 'модуля', 'модулей'])} в программе курса`,
            },
            { value: '2', label: 'формата обучения: очно и онлайн' },
        ];

        const items = stats
            .map(({ value, label }) => `
                <div class="stat">
                    <dt class="stat__label">${label}</dt>
                    <dd class="stat__value grad-text">${value}</dd>
                </div>
            `)
            .join('');

        return `
            <section class="section section--tight">
                <div class="container">
                    <dl class="stats" data-reveal>${items}</dl>
                </div>
            </section>
        `;
    }

    renderDirections() {
        const cards = directions
            .map(({ icon: iconName, title, text }, index) => `
                <li class="card card--lift spot dir-card" data-reveal>
                    <span class="dir-card__num">${pad2(index + 1)}</span>
                    <span class="icon-tile">${icon(iconName, { size: 22 })}</span>
                    <h3 class="dir-card__title">${escapeHtml(title)}</h3>
                    <p class="dir-card__text">${escapeHtml(text)}</p>
                </li>
            `)
            .join('');

        return `
            <section class="section">
                <div class="container">
                    <div class="section-head">
                        <p class="eyebrow" data-reveal>// направления</p>
                        <h2 class="section-title" data-reveal>Основные направления обучения</h2>
                        <p class="section-text" data-reveal>
                            Обучение проводится по актуальным направлениям IT-рынка —
                            выберите то, что ближе именно вам.
                        </p>
                    </div>

                    <ul class="dir-grid">
                        ${cards}
                        <li class="dir-cta" data-reveal>
                            <a class="dir-cta__link" href="#signup">
                                <div>
                                    <h3 class="dir-cta__title">Не знаете, с чего начать?</h3>
                                    <p class="dir-cta__text">Оставьте заявку — первый шаг проще, чем кажется.</p>
                                </div>
                                <span class="dir-cta__more">Записаться на курс ${icon('arrowRight', { size: 18 })}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        `;
    }

    renderFeatures() {
        const items = FEATURES
            .map(({ icon: iconName, title, text }, index) => `
                <li class="card card--lift spot feature" data-reveal>
                    <span class="icon-tile">${icon(iconName, { size: 22 })}</span>
                    <div>
                        <h3 class="feature__title">${title}</h3>
                        <p class="feature__text">${text}</p>
                    </div>
                    <span class="feature__num">${pad2(index + 1)}</span>
                </li>
            `)
            .join('');

        return `
            <section class="section">
                <div class="container split">
                    <div class="split__aside">
                        <p class="eyebrow" data-reveal>// как проходит обучение</p>
                        <h2 class="section-title" data-reveal>Что входит в обучение</h2>
                        <p class="section-text" data-reveal>
                            Обучение проводится по актуальным направлениям IT-рынка и включает в себя
                            практическую работу, выполнение проектов и развитие профессиональных навыков.
                        </p>
                        <a class="link-arrow" href="#program" data-reveal>
                            Смотреть программу ${icon('arrowRight', { size: 18 })}
                        </a>
                    </div>

                    <ul class="feature-list">${items}</ul>
                </div>
            </section>
        `;
    }

    renderAudience() {
        const items = AUDIENCE
            .map(({ icon: iconName, title, text }) => `
                <li class="card card--lift spot audience__item" data-reveal>
                    <span class="icon-tile">${icon(iconName, { size: 22 })}</span>
                    <h3 class="audience__title">${title}</h3>
                    <p class="audience__text">${text}</p>
                </li>
            `)
            .join('');

        return `
            <section class="section">
                <div class="container">
                    <div class="section-head section-head--center">
                        <p class="eyebrow" data-reveal>// для кого</p>
                        <h2 class="section-title" data-reveal>Кому подойдут курсы</h2>
                        <p class="section-text" data-reveal>
                            Курсы подходят как новичкам без опыта, так и студентам, желающим получить
                            практические навыки для работы в IT-сфере.
                        </p>
                    </div>

                    <ul class="audience">${items}</ul>

                    <ul class="chips-row chips-row--center" data-reveal>
                        <li class="chip">Для детей</li>
                        <li class="chip">Для подростков</li>
                        <li class="chip">Для взрослых</li>
                    </ul>
                </div>
            </section>
        `;
    }
}
