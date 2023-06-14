import { View, Image, Text, FlatList, StyleSheet } from "react-native";
import { Splash } from "../../assets/Slider";
import { NativeBaseProvider } from "native-base";
import { useState } from "react";

const column = 3;

const formatData = (brands, column) => {
    const numOfFullRow = Math.floor(brands.length / column)
    let numOfElementsLastRow = brands.length - (numOfFullRow * column);
    while (numOfElementsLastRow !== column && numOfElementsLastRow !== 0) {
        brands.push({ key: `balnk-${numOfElementsLastRow}`, empty: true });
        numOfElementsLastRow = numOfElementsLastRow + 1;
    }
    return brands;
}

const SplashScreen  = () => {

    const [icon, setIcon] = useState(Splash);

    renderItem = ({ item: brandIcon }) => {
        return (
            <View>
                <Image source={brandIcon.image} />
            </View>
        )
    }

    return (
        <View>
            <NativeBaseProvider>
                <FlatList
                    aria-expanded="false"
                    // data={formatData(Splash, column)}
                    data={Splash}
                    style={styles.container}
                    renderItem={renderItem}
                    numColumns={column}
                    // keyExtractor={(item) => item.id}
                />
            </NativeBaseProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default SplashScreen;