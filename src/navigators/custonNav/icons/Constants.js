import { Dimensions, PixelRatio } from "react-native";

const { width } = Dimensions.get("window");

export const ICON_SIZE = PixelRatio.roundToNearestPixel(width / 5) - 48;

export const Colors = {
    primary: "#0AC66F",
    border: "#616164",
};

export const DURATION = 450;
export const PADDING = 16;
export const SEGMENT = PixelRatio.roundToNearestPixel(width / 5);
