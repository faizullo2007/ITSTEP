// Готовые блоки разметки, которые повторяются на нескольких страницах.
import { icon } from '../core/icons.js';
import contacts from '../data/contacts.js';

const arrow = () => icon('arrowRight', { size: 18, className: 'icon--arrow' });

// Заголовок внутренней страницы: надзаголовок, h1 и вводный текст
export function pageHero({ eyebrow, title, lead = '' }) {
    return `
        <header class="page-hero">
            <div class="container">
                <p class="eyebrow" data-reveal>// ${eyebrow}</p>
                <h1 class="page-hero__title" data-reveal>${title}</h1>
                ${lead ? `<p class="lead page-hero__lead" data-reveal>${lead}</p>` : ''}
            </div>
        </header>
    `;
}

// Яркий баннер с призывом к действию в конце страницы
export function ctaBanner({
    title,
    text,
    primary = { href: '#signup', label: 'Записаться на курс' },
    secondary = null,
}) {
    return `
        <section class="section">
            <div class="container">
                <div class="cta" data-reveal>
                    <div class="cta__body">
                        <h2 class="cta__title">${title}</h2>
                        <p class="cta__text">${text}</p>
                    </div>
                    <div class="cta__actions">
                        <a class="btn btn--light btn--lg" href="${primary.href}">${primary.label}${arrow()}</a>
                        ${secondary ? `<a class="btn btn--glass btn--lg" href="${secondary.href}">${secondary.label}</a>` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Строки с контактами: телефон, адрес и время работы
export function contactRows() {
    const hours = contacts.hours.map(({ days, time }) => `${days}: ${time}`).join('<br>');

    return `
        <a class="contact-row" href="${contacts.phoneHref}">
            <span class="icon-tile">${icon('phone', { size: 18 })}</span>
            <span>
                <span class="contact-row__label">Телефон</span>
                <span class="contact-row__value">${contacts.phone}</span>
            </span>
        </a>
        <a class="contact-row" href="${contacts.mapHref}" target="_blank" rel="noopener noreferrer">
            <span class="icon-tile">${icon('mapPin', { size: 18 })}</span>
            <span>
                <span class="contact-row__label">Адрес · открыть на карте</span>
                <span class="contact-row__value">${contacts.address}</span>
            </span>
        </a>
        <div class="contact-row">
            <span class="icon-tile">${icon('clock', { size: 18 })}</span>
            <span>
                <span class="contact-row__label">Время работы</span>
                <span class="contact-row__value">${hours}</span>
            </span>
        </div>
    `;
}
