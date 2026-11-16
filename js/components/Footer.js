import Component from '../core/Component.js';
import { brandMark, icon } from '../core/icons.js';
import { prefersReducedMotion } from '../core/utils.js';
import contacts from '../data/contacts.js';
import { navLinks } from '../data/navigation.js';

export default class Footer extends Component {
    constructor() {
        super('footer', 'site-footer');
        this.renderContent();

        this.element.querySelector('.to-top').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        });
    }

    renderContent() {
        const pages = [...navLinks, { href: '#signup', label: 'Запись на курс' }]
            .map(({ href, label }) => `<li><a href="${href}">${label}</a></li>`)
            .join('');

        const socials = contacts.socials
            .map(({ name, icon: iconName, href }) => `
                <li>
                    <a href="${href}" target="_blank" rel="noopener noreferrer">
                        ${icon(iconName, { size: 16 })}${name}
                    </a>
                </li>
            `)
            .join('');

        const hours = contacts.hours.map(({ days, time }) => `${days}: ${time}`).join('<br>');

        this.element.innerHTML = `
            <div class="container">
                <div class="site-footer__grid">
                    <div class="site-footer__brand">
                        <a class="brand" href="#about" aria-label="IT-Step — на главную">
                            ${brandMark()}
                            <span>IT-Step</span>
                        </a>
                        <p class="site-footer__about">
                            Современное IT-образование для детей, подростков и взрослых —
                            с нуля и для тех, кто хочет углубить знания.
                        </p>
                    </div>

                    <nav aria-label="Разделы сайта">
                        <h2 class="site-footer__title">// разделы</h2>
                        <ul class="site-footer__list">${pages}</ul>
                    </nav>

                    <div>
                        <h2 class="site-footer__title">// контакты</h2>
                        <ul class="site-footer__list">
                            ${socials}
                            <li>
                                <a href="${contacts.emailHref}" target="_blank" rel="noopener noreferrer">
                                    ${icon('mail', { size: 16 })}${contacts.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 class="site-footer__title">// адрес</h2>
                        <ul class="site-footer__list">
                            <li>
                                <a href="${contacts.mapHref}" target="_blank" rel="noopener noreferrer">
                                    ${icon('mapPin', { size: 16 })}${contacts.address}
                                </a>
                            </li>
                            <li>
                                <a href="${contacts.phoneHref}">
                                    ${icon('phone', { size: 16 })}${contacts.phone}
                                </a>
                            </li>
                            <li>
                                <span>${icon('clock', { size: 16 })}<span>${hours}</span></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="site-footer__bottom">
                    <p>© 2026 · Автор Файзулло</p>
                    <button class="to-top" type="button">
                        Наверх ${icon('arrowUp', { size: 16 })}
                    </button>
                </div>
            </div>
        `;
    }
}
