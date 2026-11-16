import Component from '../core/Component.js';
import { icon } from '../core/icons.js';
import { ctaBanner, pageHero } from '../components/sections.js';

const FACTS = [
    { icon: 'calendar', value: 'С 1999 года', text: 'Академия работает уже больше двадцати лет.' },
    { icon: 'globe', value: 'Десятки стран', text: 'Международная компьютерная академия.' },
    { icon: 'monitor', value: 'IT-образование', text: 'Специализация — профессиональное обучение в сфере IT.' },
];

const ADVANTAGES = [
    {
        icon: 'refresh',
        title: 'Современные учебные программы',
        text: 'Программа регулярно обновляется в соответствии с требованиями рынка и современными технологиями.',
    },
    {
        icon: 'terminal',
        title: 'Практико-ориентированное обучение',
        text: 'Максимум практики и реальных навыков.',
    },
    {
        icon: 'monitor',
        title: 'Очный и онлайн-форматы',
        text: 'Учитесь в аудитории или дистанционно.',
    },
    {
        icon: 'folder',
        title: 'Проектная работа во время обучения',
        text: 'Каждый модуль включает теорию, практику и проектную работу.',
    },
    {
        icon: 'target',
        title: 'Подготовка к реальной работе в IT',
        text: 'Диплом академии и готовое портфолио по окончании обучения.',
    },
];

const OUTCOMES = [
    { icon: 'graduationCap', title: 'Диплом академии', text: 'Подтверждает пройденное обучение.' },
    { icon: 'briefcase', title: 'Готовое портфолио', text: 'Для трудоустройства или развития карьеры в IT.' },
];

export default class AcademyPage extends Component {
    constructor() {
        super('div', 'page-academy');
        this.renderContent();
    }

    renderContent() {
        this.element.innerHTML = `
            ${pageHero({
                eyebrow: 'об академии',
                title: 'Об Академии IT-Step',
                lead: 'IT STEP Academy — международная компьютерная академия, работающая с 1999 года. Академия представлена в десятках стран и специализируется на профессиональном IT-образовании.',
            })}
            ${this.renderFacts()}
            ${this.renderPrinciple()}
            ${this.renderAdvantages()}
            ${this.renderOutcome()}
            ${ctaBanner({
                title: 'Станьте студентом академии',
                text: 'Оставьте заявку на курс — это займёт меньше минуты.',
                secondary: { href: '#program', label: 'Программа курса' },
            })}
        `;
    }

    renderFacts() {
        const items = FACTS
            .map(({ icon: iconName, value, text }) => `
                <li class="card card--lift spot fact" data-reveal>
                    <span class="icon-tile">${icon(iconName, { size: 22 })}</span>
                    <p class="fact__value">${value}</p>
                    <p class="fact__text">${text}</p>
                </li>
            `)
            .join('');

        return `
            <section class="section section--top0 section--tight">
                <div class="container">
                    <ul class="facts">${items}</ul>
                </div>
            </section>
        `;
    }

    renderPrinciple() {
        return `
            <section class="section">
                <div class="container">
                    <div class="principle" data-reveal>
                        <p class="eyebrow">// основной принцип обучения</p>
                        <h2 class="principle__quote">
                            Максимум практики и&nbsp;<span class="grad-text">реальных навыков</span>
                        </h2>
                        <p class="principle__caption">
                            Занятия проводят преподаватели-практики с опытом работы в IT-индустрии.
                        </p>
                        <a class="link-arrow" href="#teachers">
                            Познакомиться с преподавателями ${icon('arrowRight', { size: 18 })}
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

    renderAdvantages() {
        const items = ADVANTAGES
            .map(({ icon: iconName, title, text }, index) => `
                <li class="card card--lift spot adv${index === 0 ? ' adv--wide' : ''}" data-reveal>
                    <span class="icon-tile">${icon(iconName, { size: 22 })}</span>
                    <div>
                        <h3 class="adv__title">${title}</h3>
                        <p class="adv__text">${text}</p>
                    </div>
                </li>
            `)
            .join('');

        return `
            <section class="section">
                <div class="container">
                    <div class="section-head">
                        <p class="eyebrow" data-reveal>// преимущества</p>
                        <h2 class="section-title" data-reveal>Преимущества академии</h2>
                    </div>
                    <ul class="adv-grid">${items}</ul>
                </div>
            </section>
        `;
    }

    renderOutcome() {
        const cards = OUTCOMES
            .map(({ icon: iconName, title, text }) => `
                <li class="card card--lift spot outcome-card" data-reveal>
                    <span class="icon-tile">${icon(iconName, { size: 22 })}</span>
                    <h3 class="outcome-card__title">${title}</h3>
                    <p class="outcome-card__text">${text}</p>
                </li>
            `)
            .join('');

        return `
            <section class="section">
                <div class="container outcome">
                    <div>
                        <p class="eyebrow" data-reveal>// результат</p>
                        <h2 class="section-title" data-reveal>По окончании обучения</h2>
                        <p class="section-text" data-reveal>
                            Студенты получают диплом академии и готовое портфолио для дальнейшего
                            трудоустройства или развития карьеры в IT.
                        </p>
                    </div>
                    <ul class="outcome__cards">${cards}</ul>
                </div>
            </section>
        `;
    }
}
