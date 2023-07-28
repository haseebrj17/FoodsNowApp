import React from 'react';
import { View } from 'react-native';

const Separator = ({ height, width, ...extraProps }) => (
    <View style={{ backgroundColor: '#f1f1f1', height, width, ...extraProps }} />
);

Separator.defaultProps = {
    height: 0,
    width: 0,
};

export default Separator;