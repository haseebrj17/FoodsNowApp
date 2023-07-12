// const config = require('../../../package.json').projectConfig;
// const BACKEND_BASE_URL = config.backendApiBaseUrl;

const COUNTRY_FLAG = {
    BASE_URL: `https://flagsapi.com`,
    SIZE: { 16: '16.png', 24: '24.png', 32: '32.png', 48: '48.png', 64: '64.png' },
    STYLE: { FLAT: 'flat', SHINY: 'shiny' },
};

// const STATIC_IMAGE = {
//     BASE_URL: `${BACKEND_BASE_URL}/images`,
//     TYPE: { POSTER: 'poster', LOGO: 'logo', GALLERY: 'gallery' },
//     SIZE: { SQUARE: 'square', LANDSCAPE: 'landscape', PORTRAIT: 'portrait' },
//     QUALITY: { SD: 'sd', HD: 'hd' },
// };

// const BACKEND_API = {
//     BASE_API_URL: `${BACKEND_BASE_URL}/api`,
//     REGISTER: '/register',
//     LOGIN: '/login',
//     USER_EXIST: '/user-exist',
//     USER: '/user',
//     REFRESH_TOKEN: '/refresh-token',
//     RESTAURANT: '/restaurant',
//     CART: '/cart',
//     FOOD: '/food',
//     BOOKMARK: '/bookmark',
// };

export default { COUNTRY_FLAG }
