import Component from '../core/Component.js';
import { icon } from '../core/icons.js';
import { escapeHtml, formatPhone, prefersReducedMotion, storage } from '../core/utils.js';
import { contactRows } from '../components/sections.js';
import directions from '../data/directions.js';

const STORAGE_KEY = 'signup';

// Проверки полей: возвращают текст ошибки или пустую строку, если всё в порядке
const VALIDATORS = {
    name(value) {
        if (!value) return 'Укажите имя';
        if (value.length < 2) return 'Имя слишком короткое — минимум 2 символа';
        return '';
    },

    email(value) {
        if (!value) return 'Укажите email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            return 'Проверьте email — он должен выглядеть как name@example.com';
        }
        return '';
    },

    tel(value) {
        if (!value) return 'Укажите номер телефона';
        const digits = value.replace(/\D/g, '').length;
        if (digits < 9 || digits > 15) {
            return 'Введите номер полностью, например +998 90 123-45-67';
        }
        return '';
    },
};

const CHECKS = [
    'Обучение с нуля — опыт не нужен',
    'Очный и онлайн-форматы',
    'Диплом академии и готовое портфолио',
];

// «16 ноября в 14:05»; пустая строка, если даты нет
function formatDate(iso) {
    const date = new Date(iso);
    if (!iso || Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export default class SignupPage extends Component {
    constructor() {
        super('div', 'page-signup');
        this.renderContent();

        this.card = this.element.querySelector('.form-card');
        this.form = this.element.querySelector('#signup-form');
        this.formError = this.element.querySelector('.form__error');
        this.saved = this.element.querySelector('.saved');
        this.success = this.element.querySelector('.success');

        this.bindEvents();
        this.showSaved();
    }

    renderContent() {
        const checks = CHECKS
            .map((text) => `
                <li>
                    <span class="check-list__mark">${icon('check', { size: 14, strokeWidth: 3 })}</span>
                    ${text}
                </li>
            `)
            .join('');

        const options = directions
            .map(({ title }) => `<option>${escapeHtml(title)}</option>`)
            .join('');

        this.element.innerHTML = `
            <section class="signup">
                <div class="container signup__grid">
                    <div class="signup__intro">
                        <p class="eyebrow" data-reveal>// запись</p>
                        <h1 class="page-hero__title" data-reveal>Запись на курс</h1>
                        <p class="lead signup__lead" data-reveal>
                            Оставьте контакты и сделайте первый шаг в IT.
                            Форма займёт меньше минуты.
                        </p>

                        <ul class="check-list" data-reveal>${checks}</ul>
                    </div>

                    <div class="signup__form" data-reveal>
                        <div class="form-card">
                            <h2 class="form-card__title">Заявка на обучение</h2>
                            <p class="form-card__text">Три обязательных поля — и готово.</p>

                            <div class="saved" hidden>
                                ${icon('checkCircle', { size: 18 })}
                                <div class="saved__body">
                                    <p class="saved__title"></p>
                                    <p class="saved__meta"></p>
                                </div>
                                <button class="saved__remove" type="button" aria-label="Удалить сохранённую заявку" title="Удалить заявку">
                                    ${icon('trash', { size: 18 })}
                                </button>
                            </div>

                            <form class="form" id="signup-form" novalidate>
                                <div class="field">
                                    <label class="field__label" for="signup-name">Имя</label>
                                    <div class="field__control">
                                        ${icon('user', { size: 18, className: 'field__icon' })}
                                        <input class="input" id="signup-name" type="text" name="name" placeholder="Как к вам обращаться" autocomplete="name" required aria-describedby="signup-name-error">
                                    </div>
                                    <p class="field__error" id="signup-name-error" role="alert"></p>
                                </div>

                                <div class="field">
                                    <label class="field__label" for="signup-email">Email</label>
                                    <div class="field__control">
                                        ${icon('mail', { size: 18, className: 'field__icon' })}
                                        <input class="input" id="signup-email" type="email" name="email" placeholder="name@example.com" autocomplete="email" inputmode="email" required aria-describedby="signup-email-error">
                                    </div>
                                    <p class="field__error" id="signup-email-error" role="alert"></p>
                                </div>

                                <div class="field">
                                    <label class="field__label" for="signup-tel">Номер телефона</label>
                                    <div class="field__control">
                                        ${icon('phone', { size: 18, className: 'field__icon' })}
                                        <input class="input" id="signup-tel" type="tel" name="tel" placeholder="+998 (90) 123-45-67" autocomplete="tel" inputmode="tel" required aria-describedby="signup-tel-error">
                                    </div>
                                    <p class="field__error" id="signup-tel-error" role="alert"></p>
                                </div>

                                <div class="field">
                                    <label class="field__label" for="signup-direction">
                                        Направление <span class="field__optional">— необязательно</span>
                                    </label>
                                    <div class="field__control">
                                        ${icon('layers', { size: 18, className: 'field__icon' })}
                                        <select class="input" id="signup-direction" name="direction">
                                            <option value="">Пока не выбрано</option>
                                            ${options}
                                        </select>
                                        ${icon('chevronDown', { size: 18, className: 'field__chevron' })}
                                    </div>
                                </div>

                                <p class="field__error form__error" role="alert"></p>

                                <button class="btn btn--primary btn--lg btn--block" type="submit">
                                    Отправить${icon('arrowRight', { size: 18, className: 'icon--arrow' })}
                                </button>
                                <p class="form__hint">Заявка сохраняется в этом браузере.</p>
                            </form>

                            <div class="success" hidden tabindex="-1">
                                <svg class="success__icon" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
                                    <circle cx="28" cy="28" r="25"/>
                                    <path d="M17 29l8 8 15-17"/>
                                </svg>
                                <h2 class="success__title">Заявка сохранена!</h2>
                                <p class="success__text"></p>
                                <dl class="success__summary"></dl>
                                <div class="success__actions">
                                    <button class="btn btn--ghost" type="button" data-new>Новая заявка</button>
                                    <a class="btn btn--primary" href="#program">Смотреть программу</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="signup__contacts" data-reveal>
                        <div class="card contact-card">
                            <p class="contact-card__title">// или свяжитесь напрямую</p>
                            <div class="contact-list">${contactRows()}</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    bindEvents() {
        this.form.addEventListener('submit', (event) => this.onSubmit(event));

        // Проверяем поле, когда пользователь из него вышел…
        this.form.addEventListener('focusout', (event) => {
            const { name, value } = event.target;
            if (!(name in VALIDATORS) || !value.trim()) return;

            if (name === 'tel') event.target.value = formatPhone(value);
            this.validateField(name);
        });

        // …а если в поле уже есть ошибка — снимаем её сразу, как только исправили
        this.form.addEventListener('input', (event) => {
            const field = event.target.closest('.field');
            if (field?.classList.contains('is-invalid')) this.validateField(event.target.name);
            this.formError.textContent = '';
        });

        // В телефоне остаются только цифры и знаки номера: буквы убираются сразу,
        // в том числе при вставке текста. Курсор при этом остаётся на своём месте.
        const tel = this.form.elements.tel;
        const clean = (text) => text.replace(/[^\d+\-() ]/g, '');

        tel.addEventListener('input', (event) => {
            const value = clean(tel.value);
            if (event.isComposing || value === tel.value) return;

            const caret = clean(tel.value.slice(0, tel.selectionStart)).length;
            tel.value = value;
            tel.setSelectionRange(caret, caret);
        });

        this.card.addEventListener('animationend', () => this.card.classList.remove('is-shaking'));

        this.saved.querySelector('.saved__remove').addEventListener('click', () => {
            storage.remove(STORAGE_KEY);
            this.showSaved();
        });

        this.success.querySelector('[data-new]').addEventListener('click', () => {
            this.success.hidden = true;
            this.form.hidden = false;
            this.showSaved();
            this.form.elements.name.focus();
        });
    }

    // Показывает или прячет ошибку поля; возвращает true, если поле заполнено верно
    validateField(name) {
        const input = this.form.elements[name];
        const field = input.closest('.field');
        const message = VALIDATORS[name](input.value.trim());

        field.classList.toggle('is-invalid', Boolean(message));
        field.classList.toggle('is-valid', !message);
        input.setAttribute('aria-invalid', String(Boolean(message)));
        field.querySelector('.field__error').textContent = message;

        return !message;
    }

    onSubmit(event) {
        event.preventDefault();

        const invalid = Object.keys(VALIDATORS).filter((name) => !this.validateField(name));
        if (invalid.length) {
            this.form.elements[invalid[0]].focus();
            this.card.classList.add('is-shaking');
            return;
        }

        const { name, email, tel, direction } = this.form.elements;
        const application = {
            name: name.value.trim(),
            email: email.value.trim(),
            tel: formatPhone(tel.value),
        };
        if (direction.value) application.direction = direction.value;
        application.createdAt = new Date().toISOString();

        if (!storage.setJSON(STORAGE_KEY, application)) {
            this.formError.textContent = 'Не удалось сохранить заявку: браузер запретил доступ к хранилищу.';
            return;
        }

        this.resetForm();
        this.showSuccess(application);
    }

    resetForm() {
        this.form.reset();
        this.formError.textContent = '';

        this.form.querySelectorAll('.field').forEach((field) => {
            field.classList.remove('is-invalid', 'is-valid');
            field.querySelector('.input').removeAttribute('aria-invalid');
            const error = field.querySelector('.field__error');
            if (error) error.textContent = '';
        });
    }

    showSuccess(application) {
        const rows = [
            ['Имя', application.name],
            ['Email', application.email],
            ['Телефон', application.tel],
            ['Направление', application.direction],
        ].filter(([, value]) => value);

        // Данные пользователя вставляем как текст, а не как HTML
        const summary = this.success.querySelector('.success__summary');
        summary.replaceChildren(
            ...rows.map(([label, value]) => {
                const row = document.createElement('div');
                const term = document.createElement('dt');
                const details = document.createElement('dd');

                row.className = 'success__row';
                term.textContent = label;
                details.textContent = value;
                row.append(term, details);
                return row;
            }),
        );

        this.success.querySelector('.success__text').textContent =
            `Спасибо, ${application.name}! Ваши данные записаны.`;

        this.saved.hidden = true;
        this.form.hidden = true;
        this.success.hidden = false;
        this.success.focus({ preventScroll: true });

        // Карточка стала короче — убеждаемся, что её начало осталось на экране
        this.card.scrollIntoView({
            block: 'nearest',
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
    }

    // Напоминание о заявке, которая уже лежит в хранилище браузера
    showSaved() {
        const application = storage.getJSON(STORAGE_KEY);
        const hasApplication = Boolean(application && typeof application === 'object' && application.name);

        this.saved.hidden = !hasApplication;
        if (!hasApplication) return;

        const date = formatDate(application.createdAt);
        this.saved.querySelector('.saved__title').textContent = date
            ? `Заявка сохранена ${date}`
            : 'Заявка уже сохранена';
        this.saved.querySelector('.saved__meta').textContent = [application.name, application.email, application.tel]
            .filter(Boolean)
            .join(' · ');
    }
}
