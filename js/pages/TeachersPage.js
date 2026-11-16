import Component from '../core/Component.js';
import { icon } from '../core/icons.js';
import { escapeHtml } from '../core/utils.js';
import { ctaBanner, pageHero } from '../components/sections.js';
import teachers from '../data/teachers.js';

// Соотношение сторон рамки фото (ширина / высота) — такое же, как в CSS
const FRAME_RATIO = 4 / 5;
// Где в рамке должно оказаться лицо, в процентах от её размеров
const FACE_AT = { x: 50, y: 38 };

// «Тимофей Лавренюк» → «ТЛ» (показывается, если фото не загрузилось)
const initials = (name) => name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase();

// Кадрирует фотографию так, чтобы лицо оказалось в нужной точке рамки.
// Фото всегда закрывает рамку целиком, даже если точка фокуса у самого края.
function framePhoto(image, { x = 0.5, y = 0.3, zoom = 1 } = {}) {
    const ratio = image.naturalWidth / image.naturalHeight;
    const isWide = ratio > FRAME_RATIO;

    // Размеры фото в процентах от рамки
    const width = (isWide ? ratio / FRAME_RATIO : 1) * zoom * 100;
    const height = (isWide ? 1 : FRAME_RATIO / ratio) * zoom * 100;

    // Смещение не может открыть пустое место: от (100 − размер) до 0
    const offset = (target, focus, size) => Math.min(0, Math.max(100 - size, target - focus * size));

    Object.assign(image.style, {
        width: `${width}%`,
        height: `${height}%`,
        left: `${offset(FACE_AT.x, x, width)}%`,
        top: `${offset(FACE_AT.y, y, height)}%`,
        transformOrigin: `${x * 100}% ${y * 100}%`,
    });
}

export default class TeachersPage extends Component {
    constructor() {
        super('div', 'page-teachers');
        this.renderContent();
    }

    renderContent() {
        this.element.innerHTML = `
            ${pageHero({
                eyebrow: 'преподаватели',
                title: 'Преподаватели',
                lead: 'Занятия проводят преподаватели-практики с опытом работы в IT-индустрии.',
            })}

            <section class="section section--top0">
                <div class="container">
                    <ul class="teachers"></ul>
                </div>
            </section>

            ${ctaBanner({
                title: 'Учитесь у практиков',
                text: 'Максимум практики и реальных навыков — с первого модуля.',
                secondary: { href: '#program', label: 'Программа курса' },
            })}
        `;

        const list = this.element.querySelector('.teachers');
        teachers.forEach((teacher) => list.append(this.createCard(teacher)));
    }

    createCard(teacher) {
        const card = document.createElement('li');
        card.className = 'teacher';
        card.dataset.reveal = '';

        card.innerHTML = `
            <div class="teacher__photo">
                <span class="teacher__initials" aria-hidden="true">${escapeHtml(initials(teacher.name))}</span>
                <img src="${escapeHtml(teacher.photo)}" alt="${escapeHtml(teacher.name)}" decoding="async">
                <span class="teacher__badge">${icon('briefcase', { size: 14 })}${escapeHtml(teacher.experience)}</span>
            </div>
            <div class="teacher__body">
                <h2 class="teacher__name">${escapeHtml(teacher.name)}</h2>
                <p class="teacher__role">${escapeHtml(teacher.role)}</p>
            </div>
        `;

        const image = card.querySelector('img');

        const onLoad = () => {
            framePhoto(image, teacher.focus);
            image.classList.add('is-loaded');
        };

        if (image.complete && image.naturalWidth) {
            onLoad();
        } else {
            image.addEventListener('load', onLoad, { once: true });
            // Фото недоступно — остаются инициалы на градиенте
            image.addEventListener('error', () => image.remove(), { once: true });
        }

        return card;
    }
}
