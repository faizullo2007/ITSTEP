// Небольшие вспомогательные функции, которыми пользуются разные части сайта.

export const DEFAULT_ROUTE = 'about';

// Имя текущей страницы из адресной строки: «#program» → «program»
export function currentRoute() {
    const route = location.hash.replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
    return route || DEFAULT_ROUTE;
}

// Защита от HTML-инъекций при подстановке данных в шаблон
export function escapeHtml(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, (char) => entities[char]);
}

// Склонение по числу: plural(3, ['тема', 'темы', 'тем']) → «темы»
export function plural(count, [one, few, many]) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
}

// 3 → «03»
export const pad2 = (number) => String(number).padStart(2, '0');

// Пользователь попросил систему уменьшить количество анимаций
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Приводит телефон к виду «+998 (90) 123-45-67», если это номер Узбекистана.
// Остальные номера оставляет как есть, убирая только лишние символы.
export function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    let local = null;
    if (digits.length === 9) local = digits;
    if (digits.length === 12 && digits.startsWith('998')) local = digits.slice(3);

    if (local) {
        return `+998 (${local.slice(0, 2)}) ${local.slice(2, 5)}-${local.slice(5, 7)}-${local.slice(7)}`;
    }
    return value.replace(/[^\d+\-() ]/g, '').replace(/\s+/g, ' ').trim();
}

// localStorage бывает недоступен (приватный режим, запрет в настройках браузера),
// поэтому все обращения к нему идут через эту обёртку.
export const storage = {
    get(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch {
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch {
            // хранилище недоступно — удалять нечего
        }
    },

    getJSON(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },

    setJSON(key, value) {
        return this.set(key, JSON.stringify(value));
    },
};
