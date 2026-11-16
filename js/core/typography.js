// Типографика: короткие слова с дефисом или косой чертой («IT-рынок», «Back-end»,
// «UI/UX») не должны разрываться при переносе строки — «Back-» на одной строке
// и «end» на другой выглядит неряшливо.

const COMPOUND = /[\p{L}\p{N}]+(?:[-/][\p{L}\p{N}]+)+/gu;
// Длинные слова («преподаватели-практики») переносить можно, иначе они не влезут в узкую колонку
const MAX_LENGTH = 14;
const SKIP = '.code-card, .nowrap, select, textarea, script, style';

export function keepCompoundsTogether(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
        if (/[-/]/.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
        const parent = node.parentElement;
        if (!parent || parent.closest(SKIP)) return;

        // Во flex- и grid-контейнерах каждый кусок текста стал бы отдельной колонкой
        const { display } = getComputedStyle(parent);
        if (display.includes('flex') || display.includes('grid')) return;

        const text = node.nodeValue;
        const parts = [];
        let position = 0;

        for (const match of text.matchAll(COMPOUND)) {
            if (match[0].length > MAX_LENGTH) continue;

            const word = document.createElement('span');
            word.className = 'nowrap';
            word.textContent = match[0];

            parts.push(text.slice(position, match.index), word);
            position = match.index + match[0].length;
        }

        if (parts.length) node.replaceWith(...parts, text.slice(position));
    });
}
