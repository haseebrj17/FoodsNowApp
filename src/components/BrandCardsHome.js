import { useState } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { BrandCard } from '../assets/constants/Slider';
import { useFonts } from 'expo-font';
import { Button } from "@react-native-material/core";
import { useNavigation } from '@react-navigation/native';

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

const BrandCardsHome = () => {
    const navigation = useNavigation();
    const [brands, setBrand] = useState(BrandCard);
    renderItem = ({ item: brand }) => {
        if (brand.empty === true) {
            return <View style={[styles.BrandCard, styles.itemInvisible]} />;
        }
        return (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Details', {brand})}>
                <View
                    style={styles.BrandCard}
                >
                    <Image source={brand.image} style={styles.ImageBrandCard} />
                    <View style={styles.textBox}>
                        <Text style={styles.itemText}>{brand.name}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View style={styles.Container}>
            <Text style={{
                fontSize: 15,
                color: '#325962',
                fontWeight: "bold",
                alignSelf: "center",
                marginBottom: 1,
            }}>Alles in unserem FoodCourt, in EINER Lieferung!</Text>
            <FlatList
                aria-expanded="false"
                data={formatData(brands, column)}
                style={styles.container}
                renderItem={renderItem}
                numColumns={column}
                keyExtractor={(item) => item.id}
            />
            <ConditionalRendering />
        </View>
    );
};

// const collapsibleList = () => {
//     if (BrandCard.length <= 6) {
//         return (
//             renderItem = ({ item: brand }) => {
//                 if (brand.empty === true) {
//                     return <View style={[styles.BrandCard, styles.itemInvisible]} />;
//                 }
//                 return (
//                     <TouchableWithoutFeedback onPress={() => navigation.navigate('Brand', {brand})}>
//                         <View
//                             style={styles.BrandCard}
//                         >
//                             <Image source={brand.image} style={styles.ImageBrandCard} />
//                             <View style={styles.textBox}>
//                                 <Text style={styles.itemText}>{brand.name}</Text>
//                             </View>
//                         </View>
//                     </TouchableWithoutFeedback>
//                 );
//             }
//         )
//         } else {
//             for (let i = 0; i = 6; i++) {
//                 return (
//                     <TouchableWithoutFeedback onPress={() => navigation.navigate('Brand', {brand})}>
//                         <View
//                             style={styles.BrandCard}
//                         >
//                             <Image source={BrandCard.image} style={styles.ImageBrandCard} />
//                             <View style={styles.textBox}>
//                                 <Text style={styles.itemText}>{BrandCard.name}</Text>
//                             </View>
//                         </View>
//                     </TouchableWithoutFeedback>
//                 )
//             }
//             if (ConditionalRendering.Button = true) {
//                 for (let i = 0; i = BrandCard.length; i++) {
//                     return (
//                         <TouchableWithoutFeedback onPress={() => navigation.navigate('Brand', {brand})}>
//                             <View
//                                 style={styles.BrandCard}
//                             >
//                                 <Image source={BrandCard.image} style={styles.ImageBrandCard} />
//                                 <View style={styles.textBox}>
//                                     <Text style={styles.itemText}>{BrandCard.name}</Text>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                     )
//                 }
//             }
//         }
// }

const ConditionalRendering = () => {
    if (BrandCard.length > 6) {
        return <Button
            title={custonTitle}
            style={styles.Button}
            color="rgba(50, 89, 98, 0.2)"
            disableElevation={true}
            uppercase={false}
            leading
        />
    } else {
        return null
    }
}

const custonTitle = () => {
    return (
        <Text
            style={{
                color: "#325962",
                fontSize: 12,
                fontWeight: "600",
                letterSpacing: 0.2,
                // marginTop: 2,
            }}
        >Explore all Restaurants</Text>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    BrandCard: {
        width: "30%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        margin: 40,
        height: Dimensions.get('window').width * 0.2, // approximate a square
    },
    ImageBrandCard: {
        width: 102.08,
        height: 115,
        resizeMode: "cover",
        aspectRatio: 1021/1151,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    itemText: {
        fontSize: 10,
        color: "#325962",
        fontWeight: "bold"
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    textBox: {
        width: 102,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    Button: {
        width: '60%',
        height: 40,
        alignSelf: "center",
        marginTop: 10,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 0.4)"
    },
})

export default BrandCardsHome;