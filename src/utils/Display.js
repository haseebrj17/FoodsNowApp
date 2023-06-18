import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const setHeight = (h) => (height/100) * h;
const setWidth = (h) => (width/100) * h;

export {setHeight, setWidth}