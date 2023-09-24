import React from 'react';
import { View } from 'react-native';

const Separator = ({ height, width, color, ...extraProps }) => (
    <View style={{ backgroundColor: color ? color : '#f1f1f1', height, width, ...extraProps }} />
);

Separator.defaultProps = {
    height: 0,
    width: 0,
};

export default Separator;