// Визуальные эффекты: появление блоков при прокрутке, подсветка карточек
// под курсором и 3D-наклон карточки с кодом на главной.
import { prefersReducedMotion } from './utils.js';

const MOTION_CLASS = 'has-motion';
const REVEAL_STEP = 70; // задержка между соседними элементами, мс
const REVEAL_DURATION = 800; // с запасом на окончание CSS-перехода, мс

const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Включает анимации появления, если браузер их поддерживает и пользователь не против
export function enableMotion() {
    const supported = 'IntersectionObserver' in window && !prefersReducedMotion();
    document.documentElement.classList.toggle(MOTION_CLASS, supported);
}

// Элементы с атрибутом data-reveal плавно появляются, когда попадают в окно.
// Те, что появились одновременно, выезжают «лесенкой» — слева направо, сверху вниз.
// Возвращает функцию, которая останавливает наблюдение.
export function observeReveals(root) {
    const items = [...root.querySelectorAll('[data-reveal]')];

    if (!document.documentElement.classList.contains(MOTION_CLASS)) {
        items.forEach((item) => item.removeAttribute('data-reveal'));
        return () => {};
    }

    const timers = new Set();

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => {
                    const first = a.boundingClientRect;
                    const second = b.boundingClientRect;
                    return first.top - second.top || first.left - second.left;
                });

            visible.forEach((entry, index) => {
                const item = entry.target;
                const delay = Math.min(index, 8) * REVEAL_STEP;

                observer.unobserve(item);
                item.style.transitionDelay = `${delay}ms`;
                item.classList.add('is-visible');

                // После появления убираем служебные стили, чтобы они
                // не мешали собственным анимациям элемента (например, hover)
                const timer = setTimeout(() => {
                    timers.delete(timer);
                    item.removeAttribute('data-reveal');
                    item.classList.remove('is-visible');
                    item.style.transitionDelay = '';
                }, delay + REVEAL_DURATION);
                timers.add(timer);
            });
        },
        { rootMargin: '0px 0px -5% 0px' },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
        observer.disconnect();
        timers.forEach((timer) => clearTimeout(timer));
    };
}

// Карточки с классом .spot получают мягкое свечение, которое следует за курсором.
// Один обработчик на весь документ — работает и для страниц, добавленных позже.
export function initSpotlight() {
    if (!hasFinePointer()) return;

    let frame = 0;
    document.addEventListener(
        'pointermove',
        (event) => {
            const card = event.target instanceof Element ? event.target.closest('.spot') : null;
            if (!card) return;

            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
                card.style.setProperty('--my', `${event.clientY - rect.top}px`);
            });
        },
        { passive: true },
    );
}

// Карточка внутри stage наклоняется вслед за курсором, пока он находится над area.
// Возвращает функцию, которая снимает обработчики.
export function initTilt(area, stage, { maxX = 9, maxY = 12 } = {}) {
    if (!area || !stage || !hasFinePointer() || prefersReducedMotion()) return () => {};

    let frame = 0;
    const clamp = (value) => Math.max(-1, Math.min(1, value));

    const onMove = (event) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            const rect = stage.getBoundingClientRect();
            // Положение курсора относительно центра сцены: от -1 до 1
            const x = clamp((event.clientX - (rect.left + rect.width / 2)) / rect.width);
            const y = clamp((event.clientY - (rect.top + rect.height / 2)) / rect.height);
            stage.style.setProperty('--ry', `${(x * maxY).toFixed(2)}deg`);
            stage.style.setProperty('--rx', `${(-y * maxX).toFixed(2)}deg`);
        });
    };

    // Курсор ушёл — карточка возвращается к наклону из CSS
    const onLeave = () => {
        cancelAnimationFrame(frame);
        stage.style.removeProperty('--rx');
        stage.style.removeProperty('--ry');
    };

    area.addEventListener('pointermove', onMove, { passive: true });
    area.addEventListener('pointerleave', onLeave);

    return () => {
        cancelAnimationFrame(frame);
        area.removeEventListener('pointermove', onMove);
        area.removeEventListener('pointerleave', onLeave);
    };
}
