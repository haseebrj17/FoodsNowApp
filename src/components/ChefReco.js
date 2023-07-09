import { useState } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { ChefReco } from '../assets/constants/Slider';
import { useFonts } from 'expo-font';
import { Button } from "@react-native-material/core";
import {LinearGradient} from 'expo-linear-gradient';
import {
    NativeBaseProvider,
    Container,
    Header,
    Content,
    Card,
    CardItem,
    Body,
    Box, Heading, AspectRatio, Center, HStack, Stack
} from 'native-base';
const column = 3;

// const formatData = (brands, column) => {
//     const numOfFullRow = Math.floor(brands.length / column)
//     let numOfElementsLastRow = brands.length - (numOfFullRow * column);
//     while (numOfElementsLastRow !== column && numOfElementsLastRow !== 0) {
//         brands.push({ key: `balnk-${numOfElementsLastRow}`, empty: true });
//         numOfElementsLastRow = numOfElementsLastRow + 1;
//     }
//     return brands;
// }

const ChefRecommendation = ({ navigation }) => {

    const [reco, setReco] = useState(ChefReco);

    renderItem = ({ item: reco }) => {
        return <Box alignItems="center" style={styles.OfferCardBox}>
            <Box maxW="80"
                style={styles.OfferCard}>
                <Box>
                    <Image
                        source={
                            reco.image
                        }
                        alt="image"
                        style={styles.ImageOfferCard}
                    />
                </Box>
                <Stack p="2">
                    <Stack>
                        <Heading style={styles.Text}>
                            {reco.name}
                        </Heading>
                        <Text style={styles.SubTextBrand}>
                            {reco.brandname}
                        </Text>
                    </Stack>
                    <Text fontWeight="400" style={styles.SubText}>
                        {reco.description}
                    </Text>
                    <HStack alignItems="center" space={4} justifyContent="space-between">
                        <HStack alignItems="center">
                            <Text style={styles.SubTextPrice}>
                                €{reco.price}
                            </Text>
                        </HStack>
                    </HStack>
                </Stack>
            </Box>
        </Box>;
    };

    return (
        <View style={styles.Container}>
            <LinearGradient
                colors={['#FFF2AF', '#FFC736' ]} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}        
                style={styles.linearGradient}
            >
                <Text style={{
                    fontSize: 15,
                    color: '#325962',
                    fontWeight: "bold",
                    alignSelf: "center",
                    marginBottom: 10,
                    marginTop: 10,
                }}>Chef's Recommendation</Text>
                <NativeBaseProvider>
                    <FlatList
                        onScrollAnimationEnd={true}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        aria-expanded="false"
                        data={reco}
                        style={styles.container}
                        renderItem={renderItem}
                    // keyExtractor={(item) => item.id.toString()}
                    />
                </NativeBaseProvider>
                <Button
                    title={custonTitle}
                    style={styles.Button}
                    color= "#D6DEE0"
                    disableElevation={true}
                    uppercase={false}
                    leading
                />
            </LinearGradient>
        </View>
    );
};

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
        >Explore all Offers</Text>
    )
}

const styles = StyleSheet.create({
    Container: {
        width: "100%",
        height: 320,
    },
    linearGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: "100%"
    },
    OfferCardBox: {
        height: "90%",
    },
    OfferCard: {
        backgroundColor: '#ffffff',
        flex: 1,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        borderRadius: 12,
        elevation: 10,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        marginLeft: 10,
        marginRight: 10,
        height: Dimensions.get('window').width * 0.2, // approximate a square
    },
    ImageOfferCard: {
        width: 166,
        height: 115,
        resizeMode: "cover",
        aspectRatio: 166/115,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    itemText: {
        fontSize: 10,
        color: "#325962",
        fontWeight: "bold"
    },
    textBox: {
        width: 165,
        height: 20,
        textAlign: "center",
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
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 1)",
        marginBottom: 10,
    },
    Text: {
        fontSize: 15,
        color: '#325962',
        fontWeight: "bold",
    },
    SubText: {
        fontSize: 10,
    },
    SubTextBrand: {
        fontSize: 8,
        color: "#112362",
        marginBottom: 3,
        fontWeight: "700"
    },
    SubTextPrice: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#325962",
        marginTop: 8
    },
})

export default ChefRecommendation;