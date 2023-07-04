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
    Switch
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
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useRef, useCallback } from "react";
import Animated from "react-native-reanimated";
import { MaterialIcons } from '@expo/vector-icons';
import CustomBackdrop from "../components/CustomBackdrop";
import UseModal from "../components/UseModal";
import AddToCart from "../components/AddToCart";

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

const DetailsScreen = ({ route }) => {
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        Fonts
    });

    const { dishes } = route.params.brand;

    const [dish, setDish] = useState(dishes);

    ///////////////  Add to Cart Modal  ///////////////

    const modalRef = useRef();

    const [selectedDish, setSelectedDish] = useState(null);

    const handleOpenModal = (dish) => {
        setSelectedDish(dish);
        if (modalRef.current) {
            modalRef.current.present();
        }
    };

    ///////////////  Sorting Modal  ///////////////

    let sortedDishes = [...dish];

    const [isOpen, setIsOpen] = useState(true)

    const [isEnabled, setIsEnabled] = useState(false);

    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["50%"];

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
    }

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        setIsOpen(index > 0 ? true : false);
    }, []);

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        bottomSheetModalRef.current.close();
    }, []);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop {...props} onPress={closeBottomSheet} />
        ),
        [closeBottomSheet]
    );

    const [sortByName, setSortByName] = useState(false);
    const [sortByPriceLowHigh, setSortByPriceLowHigh] = useState(false);
    const [sortByPriceHighLow, setSortByPriceHighLow] = useState(false);
    const [sortBySpiceLowHigh, setSortBySpiceLowHigh] = useState(false);
    const [sortBySpiceHighLow, setSortBySpiceHighLow] = useState(false);

    const toggleSwitch = (sortType) => {
        switch (sortType) {
            case "name":
                setSortByName(previousState => {
                    if (!previousState) {
                        setSortByPriceLowHigh(false);
                        setSortByPriceHighLow(false);
                        setSortBySpiceLowHigh(false);
                        setSortBySpiceHighLow(false);
                    }
                    return !previousState;
                });
                break;
            case "priceLowHigh":
                setSortByPriceLowHigh(previousState => {
                    if (!previousState) {
                        setSortByName(false);
                        setSortByPriceHighLow(false);
                        setSortBySpiceLowHigh(false);
                        setSortBySpiceHighLow(false);
                    }
                    return !previousState;
                });
                break;
            case "priceHighLow":
                setSortByPriceHighLow(previousState => {
                    if (!previousState) {
                        setSortByName(false);
                        setSortByPriceLowHigh(false);
                        setSortBySpiceLowHigh(false);
                        setSortBySpiceHighLow(false);
                    }
                    return !previousState;
                });
                break;
            case "spiceLowHigh":
                setSortBySpiceLowHigh(previousState => {
                    if (!previousState) {
                        setSortByName(false);
                        setSortByPriceLowHigh(false);
                        setSortByPriceHighLow(false);
                        setSortBySpiceHighLow(false);
                    }
                    return !previousState;
                });
                break;
            case "spiceHighLow":
                setSortBySpiceHighLow(previousState => {
                    if (!previousState) {
                        setSortByName(false);
                        setSortByPriceLowHigh(false);
                        setSortByPriceHighLow(false);
                        setSortBySpiceLowHigh(false);
                    }
                    return !previousState;
                });
                break;
            default:
                console.log("Invalid sort type");
                break;
        }
    }


    if (sortByName) {
        sortedDishes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortByPriceLowHigh) {
        sortedDishes.sort((a, b) => a.price - b.price);
    } else if (sortByPriceHighLow) {
        sortedDishes.sort((a, b) => b.price - a.price);
    } else if (sortBySpiceLowHigh) {
        sortedDishes.sort((a, b) => a.spice - b.spice);
    } else if (sortBySpiceHighLow) {
        sortedDishes.sort((a, b) => b.spice - a.spice);
    }

    ///////////////  Sorting Modal  ///////////////

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
                            <Text style={[styles.SubTextPrice, { fontSize: 14, fontFamily: 'PBO' }]}>S</Text>
                            <Text style={styles.SubTextPrice}>€{dishes.price32}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, { fontSize: 14, fontFamily: 'PBO' }]}>M</Text>
                            <Text style={styles.SubTextPrice}>€{dishes.price48}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}>
                            <Text style={[styles.SubTextPrice, { fontSize: 14, fontFamily: 'PBO' }]}>L</Text>
                            <Text style={styles.SubTextPrice}>€{dishes.price60}</Text>
                        </View>
                    </View>
                </View>
            }
            else {
                styles.textBox.height = 145
                return <Text style={[styles.SubTextPrice, { marginTop: 5 }]}>€{dishes.price}</Text>
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
                            {dishes.ingredient}
                        </Text>
                        <View>
                            <HStack alignItems="center" justifyContent="space-between">
                                <ListPrices />
                            </HStack>
                        </View>
                    </View>
                    <Button
                        onPress={() => handleOpenModal(dishes)}
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
        return <Image source={props.cover} style={styles.bannerImage} />
    }

    const RenderLogoBox = (props) => {
        return <Image source={props.logo} style={styles.logoBox} />
    }

    return (
        <BottomSheetModalProvider>
            <NativeBaseProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    onAnimate={handleSheetChanges}
                    index={0}
                    enablePanDownToClose={true}
                    onClose={() => setIsOpen(false)}
                    backgroundStyle={{
                        borderRadius: 30
                    }}
                    animateOnMount={true}
                >
                    <View style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'start',
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                margin: 10,
                                color: '#325962'
                            }}>
                                Sort and Filter
                            </Text>
                        </View>
                        <View style={{
                            width: '90%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            margin: 10
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: '#325962'
                            }}>
                                Sort by name
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#325962' }}
                                thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch("name")}
                                value={sortByName}
                            />
                        </View>
                        <View style={{
                            width: '90%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            margin: 10
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: '#325962'
                            }}>
                                Low to High Price
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#325962' }}
                                thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch("priceLowHigh")}
                                value={sortByPriceLowHigh}
                            />
                        </View>
                        <View style={{
                            width: '90%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            margin: 10
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: '#325962'
                            }}>
                                High to Low Price
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#325962' }}
                                thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch("priceHighLow")}
                                value={sortByPriceHighLow}
                            />
                        </View>
                        <View style={{
                            width: '90%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            margin: 10
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: '#325962'
                            }}>
                                Low to High Spice
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#325962' }}
                                thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch("spiceLowHigh")}
                                value={sortBySpiceLowHigh}
                            />
                        </View>
                        <View style={{
                            width: '90%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            margin: 10
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: '#325962'
                            }}>
                                High to Low Spice
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#325962' }}
                                thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch("spiceHighLow")}
                                value={sortBySpiceHighLow}
                            />
                        </View>
                    </View>
                </BottomSheetModal>
                <TouchableOpacity
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Home');
                        }
                    }}
                    style={{
                        zIndex: 9999
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={50}
                        color="#325962"
                        style={{
                            position: "absolute",
                            margin: 30,
                            marginLeft: 0,
                        }}
                    />
                </TouchableOpacity>
                <ScrollView
                    style={{
                        backgroundColor: "#fff"
                    }}
                >
                    <View style={{ height: width / 1.3 }}>
                        <RenderImage cover={route.params.brand.cover} />
                        <RenderLogoBox logo={route.params.brand.logobox} />
                    </View>
                    <Text style={{ fontSize: 20, fontFamily: 'PEBO', fontWeight: 'bold', color: '#325962', marginLeft: 15, marginBottom: 10, marginTop: 10, letterSpacing: 1, }}>{route.params.brand.name.toUpperCase()}</Text>
                    <Text style={{ lineHeight: 15, fontSize: 12, fontFamily: 'PBO', fontWeight: 'bold', color: '#325962', letterSpacing: 0.5, marginLeft: 15, marginBottom: 2 }}>{route.params.brand.description}</Text>
                    <View style={{ marginBottom: 5, height: '0.5%', width: "100%", backgroundColor: "#f1f1f1" }}></View>
                    <View style={{ width: "100%", height: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', left: '4%' }}
                            onPress={handlePresentModal}
                        >
                            <Text style={{ marginRight: 3, fontFamily: 'PSB', color: '#325962', opacity: 0.6 }}>Sort/Filter</Text>
                            <Icon
                                name="sliders"
                                type="font-awesome"
                                color="#325962"
                                size={18}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', right: '5%' }}
                            onPress={handleOpenModal}
                        >
                            <Text style={{ marginRight: 3, fontFamily: 'PSB', color: '#325962', opacity: 0.6 }}>Search</Text>
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
                            data={formatData(sortedDishes, column)}
                            contentContainerStyle={styles.container}
                            renderItem={renderItem}
                            numColumns={column}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                </ScrollView>
                <AddToCart
                    ref={modalRef}
                    dish={selectedDish}
                />
            </NativeBaseProvider>
        </BottomSheetModalProvider>
    )
}


const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    bannerImage: {
        width: width,
        height: undefined,
        aspectRatio: 114.666 / 81.719,
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
        aspectRatio: 166 / 115,
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
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'white',
        position: 'absolute',
        bottom: '0%'
    }
})

export default DetailsScreen;