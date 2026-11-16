// Преподаватели.
// focus (необязательно) — как кадрировать фото в карточке:
//   x, y — где на фотографии находится лицо (0 — левый/верхний край, 1 — правый/нижний),
//   zoom — увеличение (1 — без увеличения).
// Если focus не указан, фото показывается по центру.
export default [
    {
        name: 'Тимофей Лавренюк',
        role: 'Сети и кибербезопасность',
        photo: 'https://fsx1.itstep.org/api/v1/files/qWhlhWSaGpp1IYL8zt0ohGjyOf_T9kFN?inline=true&f=webp&h=720',
        experience: '5 лет опыта',
        focus: { x: 0.32, y: 0.47, zoom: 1.5 },
    },
    {
        name: 'Владислав Широбоков',
        role: 'Компьютерная графика и дизайн',
        photo: 'https://fsx1.itstep.org/api/v1/files/u69TZo3ACZxS58UiX9fCZggex2QoI0fT?inline=true&f=webp&h=720',
        experience: '4 года опыта',
        focus: { x: 0.39, y: 0.24, zoom: 1.1 },
    },
    {
        name: 'Игорь Башняк',
        role: 'Разработка программного обеспечения',
        photo: 'https://fsx1.itstep.org/api/v1/files/WC1wIVUz__cz7kVXfQMN5s1_mB15Sgxs?inline=true&f=webp&h=720',
        experience: '6 лет опыта',
        focus: { x: 0.75, y: 0.28, zoom: 1.15 },
    },
];
