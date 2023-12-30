export const transformImageUrl = ({ originalUrl, size }) => {
    const baseUrl = `https://ik.imagekit.io/FoodsNowGmbH${size}/sliders/`;

    const urlParts = originalUrl.split('/');

    const decodedParts = urlParts.map(part => decodeURIComponent(part));

    const relevantParts = decodedParts.slice(4);

    const transformedUrl = baseUrl + relevantParts.join('/');

    return transformedUrl;
};