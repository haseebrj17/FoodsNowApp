import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

const CacheImage = ({ uri, style }) => {
    const [source, setSource] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const name = shorthash.unique(uri);
            const path = `${FileSystem.cacheDirectory}${name}`;
            const image = await FileSystem.getInfoAsync(path);

            if (image.exists) {
                console.log('read image from cache');
                setSource({ uri: image.uri });
            } else {
                console.log('downloading image to cache');
                const newImage = await FileSystem.downloadAsync(uri, path);
                setSource({ uri: newImage.uri });
            }
        };

        fetchImage();
    }, [uri]);

    return <Image style={style} source={source} />;
};

export default CacheImage;