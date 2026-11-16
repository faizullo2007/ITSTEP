// Контакты академии. Используются в подвале и на странице записи.
const address = 'г. Ташкент, улица Истикбол, 14';

// Неразрывный пробел: с ним «г.» и номер дома не отрываются при переносе строки
const NBSP = String.fromCharCode(160);

export default {
    address: `г.${NBSP}Ташкент, улица Истикбол,${NBSP}14`,
    mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,

    phone: '+998 (78) 113-33-43',
    phoneHref: 'tel:+998781133343',

    email: 'info@itstep.org',
    emailHref: 'https://mail.google.com/mail/?view=cm&fs=1&to=info@itstep.org',

    hours: [
        { days: 'ПН–СБ', time: '09:30 – 19:00' },
        { days: 'ВС', time: '10:00 – 18:00' },
    ],

    socials: [
        { name: 'Telegram', icon: 'send', href: 'https://t.me/itstep_tashkent' },
        { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/itstep.tashkent/' },
        { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/itstep.tashkent' },
    ],
};
