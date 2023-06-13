import { useState } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { KidSpecial } from '../../assets/Slider';
import { useFonts } from 'expo-font';
import { Button } from "@react-native-material/core";
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

const KidSpecialOffer = ({ navigation }) => {
    const [loaded] = useFonts({
        Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
    });
    const [kidSpecial, setKidSpecial] = useState(KidSpecial);

    renderItem = ({ item: offer }) => {
        return <Box alignItems="center" style={styles.OfferCardBox}>
            <Box maxW="80"
                style={styles.OfferCard}>
                <Box>
                    <Image
                        source={
                            offer.image
                        }
                        alt="image"
                        style={styles.ImageOfferCard}
                    />
                </Box>
                <Stack p="2">
                    <Stack>
                        <Heading style={styles.Text}>
                            {offer.name}
                        </Heading>
                        <Text style={styles.SubTextBrand}>
                            {offer.brandname}
                        </Text>
                    </Stack>
                    <Text fontWeight="400" style={styles.SubText}>
                        {offer.description}
                    </Text>
                    <HStack alignItems="center" space={4} justifyContent="space-between">
                        <HStack alignItems="center">
                            <Text style={styles.SubTextPrice}>
                                {offer.price}
                            </Text>
                        </HStack>
                    </HStack>
                </Stack>
            </Box>
        </Box>;
    };

    return (
        <View style={styles.Container}>
            <Text style={{
                fontSize: 15,
                color: '#325962',
                fontWeight: "bold",
                alignSelf: "center",
                marginBottom: 10,
                marginTop: 5,
            }}>Kids Special</Text>
            <NativeBaseProvider>
                <FlatList
                    onScrollAnimationEnd={true}
                    horizontal={true}
                    aria-expanded="false"
                    data={kidSpecial}
                    style={styles.container}
                    renderItem={renderItem}
                // keyExtractor={(item) => item.id.toString()}
                />
            </NativeBaseProvider>
            <Button
                title={custonTitle}
                style={styles.Button}
                color="rgba(50, 89, 98, 0.2)"
                disableElevation={true}
                uppercase={false}
                leading
            />
            {/* <NativeBaseProvider>
            <Center flex={1} px="3">
                <Example />
            </Center>
        </NativeBaseProvider> */}
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
        flex: 1,
        width: "100%",
        height: 300,
        marginTop: 5,
        marginBottom: 150,
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
    itemInvisible: {
        backgroundColor: 'transparent',
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
        borderColor: "rgba(50, 89, 98, 0.4)"
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
    }
})

export default KidSpecialOffer;