import { 
    StyleSheet, 
    FlatList, 
    View, 
    Text, 
    Image, 
    Dimensions, 
    TouchableWithoutFeedback,
    TextInput,
    TouchableOpacity,
} from "react-native";
import {
    NativeBaseProvider,
    Container,
    Header,
    Content,
    Card,
    CardItem,
    Body,
    Box, Heading, AspectRatio, Center, HStack, Stack, ScrollView, StatusBar
} from 'native-base';
import { Button } from "@react-native-material/core";
import { useState } from "react";
import { useFonts } from 'expo-font';
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from "../assets/constants";
import Slider from "../components/Slider";
import { Icon } from "@rneui/base";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef } from "react";

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
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({
        Fonts
    });
    const { dishes } = route.params.brand;
    const [dish, setDish] = useState(dishes);
    const [isOpen, setIsOpen] = useState(true)
    console.log(dish)

    const renderItem = ({ item: dishes }) => {

        const ListPrices = () => {
            if (dishes.restaurant === 'come a napoli') {
                styles.textBox.height = 170;
                return <View style={{ flexDirection: 'column', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, {fontSize: 14, fontFamily: 'PBO'}]}>S</Text>
                            <Text style={styles.SubTextPrice}>€{dishes.price32}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, {fontSize: 14, fontFamily: 'PBO'}]}>M</Text>
                            <Text style={styles.SubTextPrice}>€{dishes.price48}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, {fontSize: 14, fontFamily: 'PBO'}]}>L</Text>
                            <Text style={styles.SubTextPrice}>€{dishes.price60}</Text>
                        </View>
                    </View>
                </View>
            }
            else {
                styles.textBox.height = 145
                return <Text style={[styles.SubTextPrice, {marginTop: 5}]}>€{dishes.price}</Text>
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
        return <Image source={props.cover} style={styles.bannerImage}/>
    }

    const RenderLogoBox = (props) => {
        return <Image source={props.logo} style={styles.logoBox}/>
    }

    // const bottomSheetModalRef = useRef(null);
    // const snapPoints = ["20%"];

    // function handlePresentModal() {
    //     bottomSheetModalRef.current?.present();
    // }

    return (
        <NativeBaseProvider>
            {/* <BottomSheetModalProvider>
                <View style={{
                    flex: 1,
                    backgroundColor: 'gray',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    lk b<BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        onClose={() => setIsOpen(false)}
                    >
                        <View>
                            <Text>
                                Hello
                            </Text>
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider> */}
            <ScrollView>
                <View style={{height: width / 1.3}}>
                    <RenderImage cover={route.params.brand.cover}/>
                    <RenderLogoBox logo={route.params.brand.logobox}/>
                </View>
                <Text style={{ fontSize: 20, fontFamily: 'PEBO', fontWeight: 'bold', color: '#325962', marginLeft: 15, marginBottom: 10, marginTop: 10, letterSpacing: 1, }}>{route.params.brand.name.toUpperCase()}</Text>
                <Text style={{ lineHeight: 15, fontSize: 12, fontFamily: 'PBO', fontWeight: 'bold', color: '#325962', letterSpacing: 0.5, marginLeft: 15, marginBottom: 2 }}>{route.params.brand.description}</Text>
                <View style={{ marginBottom: 5, height: '0.5%', width: "100%", backgroundColor: "#f1f1f1" }}></View>
                <View style={{width: "100%", height: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5,}}>
                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', left: '4%'}}
                    // onPress={handlePresentModal}
                >
                    <Text style={{marginRight: 3, fontFamily: 'PSB', color: '#325962', opacity: 0.6}}>Sort/Filter</Text>
                        <Icon
                            name="sliders"
                            type="font-awesome"
                            color="#325962"
                            size={18}
                        />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('search')} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', right: '5%'}}>
                    <Text style={{marginRight: 3, fontFamily: 'PSB', color: '#325962', opacity: 0.6}}>Search</Text>
                        <Icon
                            name="search"
                            type="font-awesome"
                            color="#325962"
                            size={18}
                        />
                </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10, height: '0.5%', width: "100%", backgroundColor: "#f1f1f1" }}></View>
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
        height: 150,
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
    },
    logoBox: {
        width: 90,
        height: 90,
        marginLeft: 15,
        borderRadius: "10%",
        borderWidth: 0.5,
        borderColor: 'white',
        position: 'absolute',
        bottom: '0%'
    }
})

export default DetailsScreen;