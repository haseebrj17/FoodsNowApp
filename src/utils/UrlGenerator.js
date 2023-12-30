export const transformImageUrl = ({ originalUrl, size }) => {
    const baseUrl = `https://ik.imagekit.io/FoodsNowGmbH${size}/sliders/`;

    // Split the original URL to get the parts after the domain
    const urlParts = originalUrl.split('/');

    // Decode each part to transform non-ASCII characters to their actual characters
    const decodedParts = urlParts.map(part => decodeURIComponent(part));

    // Extract the relevant parts (assuming they start from the 4th segment in the array)
    const relevantParts = decodedParts.slice(4);

    // Join the parts back into a URL string
    const transformedUrl = baseUrl + relevantParts.join('/');

    console.log(transformedUrl);
    return transformedUrl;
};
