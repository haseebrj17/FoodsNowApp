export const transformImageUrl = ({ originalUrl, size }) => {
    const baseUrl = `https://ik.imagekit.io/FoodsNowGmbH${size}/sliders/`;
    const urlParts = originalUrl.split('/');
    const relevantParts = urlParts.slice(4);
    return baseUrl + relevantParts.join('/');
}