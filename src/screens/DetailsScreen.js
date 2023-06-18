import { 
    StyleSheet, 
    FlatList, 
    View, 
    Text, 
    Image, 
    Dimensions, 
    TouchableWithoutFeedback,
} from "react-native";
import {
        NativeBaseProvider,
        Container,
        Header,
        Content,
        Card,
        CardItem,
        Body,
        Box, Heading, AspectRatio, Center, HStack, Stack, ScrollView
} from 'native-base';
import { Button } from "@react-native-material/core";
import { useState } from "react";
import { useFonts } from 'expo-font';


const { width, height } = Dimensions.get('screen');

const column = 2;

const formatData = (dish, column) => {
    const numOfFullRow = Math.floor(dish.length / column)
    let numOfElementsLastRow = dish.length - (numOfFullRow * column);
    while (numOfElementsLastRow !== column && numOfElementsLastRow !== 0) {
        dish.push({ key: `balnk-${numOfElementsLastRow}`, empty: true });
        numOfElementsLastRow = numOfElementsLastRow + 1;
    }
    return dish;
}

const DetailsScreen = ({route}) => {
    const [fontsLoaded] = useFonts({
        'PEBO': require('../assets/fonts/Poppins-ExtraBold.ttf'),
        'PBO': require('../assets/fonts/Poppins-Bold.ttf'),
        'PSB': require('../assets/fonts/Poppins-SemiBold.ttf'),
        'PM': require('../assets/fonts/Poppins-Medium.ttf'),
        'PR': require('../assets/fonts/Poppins-Regular.ttf'),
        'PL': require('../assets/fonts/Poppins-Light.ttf'),
    });
    const { dishes } = route.params.brand;
    const [dish, setDish] = useState(dishes);
    console.log(dish)
    const renderItem = ({ item: dishes }) => {

        const ListPrices = () => {
            if (dishes.restaurant === 'come a napoli') {
                return <View style={{ flexDirection: 'column', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, {fontSize: 14, fontFamily: 'PBO'}]}>S</Text>
                            <Text style={styles.SubTextPrice}>{dishes.price32}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, {fontSize: 14, fontFamily: 'PBO'}]}>M</Text>
                            <Text style={styles.SubTextPrice}>{dishes.price48}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, {fontSize: 14, fontFamily: 'PBO'}]}>L</Text>
                            <Text style={styles.SubTextPrice}>{dishes.price60}</Text>
                        </View>
                    </View>
                </View>
            }
            else {
                return <Text>{dishes.price}</Text>
            }
        }

        if (dishes.empty === true) {
            return <View style={[styles.itemInvisible, { width: 186, margin: 10 }]} />;
        }
        return <Box alignItems="center" style={styles.OfferCardBox}>
            <Box
                style={styles.OfferCard}>
                <Box>
                    <Image
                        source={
                            dishes.image
                        }
                        alt="image"
                        style={styles.ImageOfferCard}
                    />
                </Box>
                <View style={styles.textBox}>
                    <View style={styles.textAlignBox}>
                        <View>
                            <Heading style={styles.Text}>
                                {dishes.name}
                            </Heading>
                            <Text style={styles.SubTextBrand}>
                                {route.params.brand.name}
                            </Text>
                        </View>
                        <Text fontWeight="400" style={styles.SubText}>
                            {dishes.description}
                        </Text>
                        <View>
                            <HStack alignItems="center" justifyContent="space-between">
                                <ListPrices />
                            </HStack>
                        </View>
                    </View>
                    <Button
                        onPress={() => navigation.navigate('Details', {brand})}
                        title="Add to Cart"
                        color="#FFAF51"
                        titleStyle={{ color: "#325962", fontSize: 10, fontWeight: 800 }}
                        uppercase={false}
                        contentContainerStyle={styles.Button}
                        style={{
                            width: '90%',
                            marginTop: 8,
                        }}
                    />
                </View>
            </Box>
        </Box>;
    }

    const RenderImage = (props) => {
        console.log(props.cover)
        return <Image source={props.cover} style={styles.bannerImage}/>
    }

    return (
        <NativeBaseProvider>
            <ScrollView>
            <RenderImage cover={route.params.brand.cover}/>
            <Text style={{ lineHeight: 30, fontSize: 20, fontFamily: 'PBO', color: '#325962', margin: 15, letterSpacing: 1, }}>{route.params.brand.name}</Text>
            <View style={{ marginBottom: 10, height: '0.5%', width: "100%", backgroundColor: "#f1f1f1" }}></View>
            <View>
                <View>
                    
                </View>
            </View>
            <View>
                <FlatList
                    aria-expanded="false"
                    data={formatData(dish, column)}
                    contentContainerStyle={styles.container}
                    renderItem={renderItem}
                    numColumns={column}
                    keyExtractor={(item) => item.id}
                    />
            </View>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    bannerImage: {
        width: width,
        height: undefined,
        aspectRatio: 114.666/81.719,
    },
    container: {
        width: "100%",
        alignItems: 'center',
    },
    OfferCard: {
        marginHorizontal: 7,
        marginVertical: 10,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
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
    },
    ImageOfferCard: {
        width: 186,
        height: 135,
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
        width: 195,
        height: 170,
        alignItems: "center",
        justifyContent: 'flex-start',
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
    Text: {
        fontSize: 15,
        color: '#325962',
        fontWeight: "bold",
        lineHeight: 35,
    },
    SubText: {
        fontSize: 10,
    },
    SubTextBrand: {
        fontSize: 8,
        color: "#112362",
        marginBottom: 8,
        fontWeight: "700"
    },
    SubTextPrice: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#325962",
    },
    textAlignBox: {
        marginLeft: 3,
    }
})

export default DetailsScreen;