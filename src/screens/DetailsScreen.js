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
    Switch,
    SectionList
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
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from "../assets/constants";
import Slider from "../components/Slider";
import { Icon } from "@rneui/base";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useRef, useCallback } from "react";
import Animated from "react-native-reanimated";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import CustomBackdrop from "../components/CustomBackdrop";
import UseModal from "../components/UseModal";
import AddToCart from "../components/AddToCart";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../actions/ProductActions';
import { Display } from "../utils";
import { Separator } from "../components";
import Skeleton from "../components/Skeleton";
import { GetImageAspectRatio } from "../utils/ImageAspect";
import { addToCart, getCartItems } from "../actions/CartAction";

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

    const [Brand, setBrand] = useState(route.params.brand)
    const [deliveryParams, setDeliveryParams] = useState(route.params.deliveryParams)
    const [dish, setDish] = useState(null);
    const [extras, setExtras] = useState(null);
    const [dips, setDips] = useState(null);

    const dispatch = useDispatch();

    const { cart } = useSelector(
        (state) => state.cartState
    );

    const { products, loadingProducts, error } = useSelector(
        (state) => state.productState
    );
    const categoryId = route.params.brand.Id;
    // console.log(categoryId)

    useEffect(() => {
        dispatch(fetchProducts(categoryId));
    }, [categoryId]);

    const [height, setHeight] = useState(null)

    useEffect(() => {

        const screenWidth = width;

        if (screenWidth <= 375) {
            setHeight(72)
        } else if (screenWidth > 375 && screenWidth < 414) {
            setHeight(60)
        } else if (screenWidth >= 414 && screenWidth < 480) {
            setHeight(58)
        } else if (screenWidth >= 480) {
            setHeight(60)
        }
    }, [])

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop {...props} onPress={closeBottomSheet} />
        ),
        [closeBottomSheet]
    );

    useEffect(() => {
        if (products) {
            console.log(loadingProducts)
            setDish(products.Products)
            setDips(products.ProductExtraDippings)
            setExtras(products.ProductExtraTroppings)
        }
    }, [products])

    ///////////////  Add To Cart Funtion  ///////////////

    const handleCart = (dishes) => {
        if (dishes.showExtraTropping === false && dishes.showExtraDipping === false && dishes.Prices.length === 1) {
            const newInput = {
                ...input,
                dishId: dishes.Id
            };
            setInput(newInput);
            handleAddToCart(newInput);
        } else {
            handleOpenModal(dishes);
        }
    };

    const [input, setInput] = useState({
        dishId: null,
        selectedSize: "Normal",
        selectedExtras: {},
        selectedDips: {},
        quantity: 1
    })

    const handleAddToCart = (newInput) => {
        const { dishId, selectedSize, selectedExtras, selectedDips, quantity } = newInput;
        dispatch(addToCart({ dishId, selectedSize, selectedExtras, selectedDips, quantity }))
            .then((result) => {
                if (result === 'OK') {
                    dispatch(getCartItems())
                }
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
            })
    };

    ///////////////  Extras and Dips for Dish Form  ///////////////

    const Extras = (selectedDish) => {
        if (selectedDish === null) {
            return null
        } else {
            if (selectedDish.showExtraTropping) {
                return extras
            }
        }
        return null
    }

    const Dips = (selectedDish) => {
        if (selectedDish === null) {
            return null
        } else {
            if (selectedDish.showExtraDipping) {
                return dips
            }
            return null
        }
    }

    ///////////////  Add to Cart Modal  ///////////////

    const modalRef = useRef();

    const [selectedDish, setSelectedDish] = useState(null);

    const handleOpenModal = (dish) => {
        setSelectedDish(dish);
        if (modalRef.current) {
            modalRef.current.present();
        }
    };

    let sortedDishes = dish ? [...dish] : [];

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
        sortedDishes.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortByPriceLowHigh) {
        sortedDishes.sort((a, b) => {
            const priceA = a.Prices.find(price => price.Description === "Normal")?.Price || 0;
            const priceB = b.Prices.find(price => price.Description === "Normal")?.Price || 0;
            return priceA - priceB;
        });
    } else if (sortByPriceHighLow) {
        sortedDishes.sort((a, b) => {
            const priceA = a.Prices.find(price => price.Description === "Normal")?.Price || 0;
            const priceB = b.Prices.find(price => price.Description === "Normal")?.Price || 0;
            return priceB - priceA;
        });
    } else if (sortBySpiceLowHigh) {
        sortedDishes.sort((a, b) => a.SpiceLevel - b.SpiceLevel);
    } else if (sortBySpiceHighLow) {
        sortedDishes.sort((a, b) => b.SpiceLevel - a.SpiceLevel);
    }

    ///////////////  Sorting Modal  ///////////////

    const renderItem = ({ item: dishes }) => {
        const brand = Brand

        const ListPrices = () => {
            const sortedPrices = [...dishes.Prices].sort((a, b) => {
                return a.Description === 'Normal' ? -1 : 1;
            });
            if (brand.Name === 'Come A Napoli') {
                return (
                    <View style={{ flexDirection: 'column', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            {sortedPrices.map((price, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: "center",
                                        marginRight: 10,
                                    }}
                                >
                                    <Text style={[styles.SubTextPrice, { fontSize: Display.setHeight(1.6) }]}>
                                        {price.Description === 'Normal' ? 'S' : 'L'}
                                    </Text>
                                    <Text style={styles.SubTextPrice}>€{price.Price}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            } else {
                const normalPrice = sortedPrices.find(price => price.Description === 'Normal');
                return (
                    <Text style={[styles.SubTextPrice, { marginTop: 5 }]}>
                        €{normalPrice ? normalPrice.Price : 'N/A'}
                    </Text>
                );
            }
        };

        if (dishes.empty === true) {
            return <View style={[styles.itemInvisible, { width: 186, margin: 10 }]} />;
        }
        return <Box alignItems="center">
            <Box
                style={styles.OfferCard}>
                <Box>
                    <Image
                        source={{
                            uri:
                                dishes.Image
                        }}
                        alt="image"
                        style={styles.ImageOfferCard}
                    />
                </Box>
                <View style={styles.textBox}>
                    <View style={styles.textAlignBox}>
                        <View>
                            <Heading numberOfLines={1} style={styles.Text}>
                                {dishes.Name}
                            </Heading>
                            <Text style={styles.SubTextBrand}>
                                {brand.Name}
                            </Text>
                        </View>
                        <Text fontWeight="400" numberOfLines={2} style={styles.SubText}>
                            {dishes.IngredientSummary}
                        </Text>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            position: 'absolute',
                            bottom: '5%'
                        }}
                    >
                        <View>
                            <HStack
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    margin: Display.setHeight(1)
                                }}
                            >
                                <ListPrices />
                            </HStack>
                        </View>
                        <Button
                            onPress={() => handleCart(dishes)}
                            title="In den Warenkorb"
                            color="#FFAF51"
                            titleStyle={{ color: "#325962", fontSize: Display.setHeight(1.2), fontWeight: 800 }}
                            uppercase={false}
                            contentContainerStyle={styles.Button}
                            style={{
                                width: '90%',
                                alignSelf: 'center',
                            }}
                        />
                    </View>
                </View>
            </Box>
        </Box>
    }

    const RenderImage = (props) => {
        const { cover } = props;
        return <Image source={{ uri: cover }} style={styles.bannerImage} />
    }

    const colorObject = JSON.parse(route.params.brand?.Color?.replace(/'/g, "\""));
    const color1 = colorObject.color1;

    const RenderLogoBox = (props) => {
        const { logo } = props
        let imgAspect = 1; // Default aspect ratio

        GetImageAspectRatio(logo, (aspectRatio) => {
            imgAspect = aspectRatio;
        });
        return <View style={[
            styles.logoBox,
            {
                backgroundColor: '#f1f1f1'
            }
        ]}>
            <Image source={{ uri: logo }} style={{
                aspectRatio: imgAspect,
                resizeMode: 'contain',
                height: undefined,
                width: '90%',
                margin: Display.setHeight(0.2)
            }} />
        </View>
    }

    const SkeletonRender = () => {
        return (
            <View
                style={{
                    backgroundColor: '#fff'
                }}
            >
                <Skeleton height={Display.setHeight(30)} width={Display.setWidth(100)} style={{ alignSelf: 'center', borderRadius: 6 }} />
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: Display.setHeight(0.2)
                    }}
                >
                    <View>
                        <Skeleton height={Display.setHeight(8)} width={Display.setWidth(100)} style={{ borderRadius: 2 }} />
                        <View
                            style={{
                                width: Display.setHeight(5),
                                height: Display.setHeight(5),
                                borderRadius: 2,
                                position: 'absolute',
                                left: '5%',
                                top: '-70%',
                            }}
                        >
                            <Skeleton height={Display.setHeight(9)} width={Display.setHeight(9)} style={{ borderRadius: 2 }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(30)} style={{ borderRadius: 5, marginTop: Display.setHeight(1) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                        </View>
                    </View>
                    <View>
                        <Skeleton height={Display.setHeight(6)} width={Display.setWidth(100)} style={{ borderRadius: 2, marginTop: Display.setHeight(0.2) }} />
                        <View
                            style={{
                                width: Display.setWidth(90),
                                position: 'absolute',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(10)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(10)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                        </View>
                    </View>
                    <View>
                        <View
                            style={{
                                width: Display.setWidth(100),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                margin: Display.setHeight(1)
                            }}
                        >
                            <View>
                                <Skeleton height={Display.setHeight(35)} width={Display.setWidth(45)} style={{ borderRadius: 2, marginTop: Display.setHeight(0.2) }} />
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: '0%',
                                        alignSelf: 'center',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        width: Display.setWidth(40),
                                        marginBottom: Display.setHeight(1)
                                    }}
                                >
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(34)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(8)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                </View>
                            </View>
                            <View>
                                <Skeleton height={Display.setHeight(35)} width={Display.setWidth(45)} style={{ borderRadius: 2, marginTop: Display.setHeight(0.2) }} />
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: '0%',
                                        alignSelf: 'center',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        width: Display.setWidth(40),
                                        marginBottom: Display.setHeight(1)
                                    }}
                                >
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(34)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(8)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width: Display.setWidth(100),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                margin: Display.setHeight(1)
                            }}
                        >
                            <View>
                                <Skeleton height={Display.setHeight(35)} width={Display.setWidth(45)} style={{ borderRadius: 2, marginTop: Display.setHeight(0.2) }} />
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: '0%',
                                        alignSelf: 'center',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        width: Display.setWidth(40),
                                        marginBottom: Display.setHeight(1)
                                    }}
                                >
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(34)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(8)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                </View>
                            </View>
                            <View>
                                <Skeleton height={Display.setHeight(35)} width={Display.setWidth(45)} style={{ borderRadius: 2, marginTop: Display.setHeight(0.2) }} />
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: '0%',
                                        alignSelf: 'center',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        width: Display.setWidth(40),
                                        marginBottom: Display.setHeight(1)
                                    }}
                                >
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(34)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(3)} width={Display.setWidth(8)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                    <Skeleton height={Display.setHeight(4)} width={Display.setWidth(40)} style={{ borderRadius: 5, marginTop: Display.setHeight(2) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <>
            {loadingProducts ? (
                <SkeletonRender />
            ) : (
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
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: Display.setHeight(2.4),
                                        fontWeight: 'bold',
                                        alignSelf: 'center',
                                        margin: 10,
                                        color: '#325962'
                                    }}>
                                        Sortieren/Filtern
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
                                        fontSize: Display.setHeight(1.7),
                                        fontWeight: '500',
                                        color: '#325962'
                                    }}>
                                        Niedriger bis hoher Preis
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
                                        fontSize: Display.setHeight(1.7),
                                        fontWeight: '500',
                                        color: '#325962'
                                    }}>
                                        Hoher bis niedriger Preis
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
                                        fontSize: Display.setHeight(1.7),
                                        fontWeight: '500',
                                        color: '#325962'
                                    }}>
                                        Niedrig bis hoch Gewürz
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
                                        fontSize: Display.setHeight(1.7),
                                        fontWeight: '500',
                                        color: '#325962'
                                    }}>
                                        Hoch bis Niedrig Gewürz
                                    </Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#325962' }}
                                        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleSwitch("spiceHighLow")}
                                        value={sortBySpiceHighLow}
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
                                        fontSize: Display.setHeight(1.7),
                                        fontWeight: '500',
                                        color: '#325962'
                                    }}>
                                        Nach Name sortieren
                                    </Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#325962' }}
                                        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleSwitch("name")}
                                        value={sortByName}
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
                            <AntDesign
                                name="leftcircle"
                                size={28}
                                color="#325964"
                                style={{
                                    position: "absolute",
                                    margin: Display.setHeight(4),
                                    marginLeft: Display.setHeight(2),
                                }}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                backgroundColor: '#fff'
                            }}
                        >
                            <FlatList
                                ListHeaderComponent={
                                    <>
                                        <View
                                            style={{
                                                width,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <View style={{ height: width / 1.3 }}>
                                                <RenderImage cover={route.params.brand.Cover} />
                                                <RenderLogoBox logo={route.params.brand.Logo} />
                                            </View>
                                            <View
                                                style={{
                                                    width,
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'flex-start'
                                                }}
                                            >
                                                <Text style={{ fontSize: Display.setHeight(2.2), fontWeight: 'bold', color: '#325962', marginLeft: Display.setHeight(2), marginBottom: Display.setHeight(1.5), marginTop: Display.setHeight(1.2), letterSpacing: 1, }}>{route.params.brand.Name.toUpperCase()}
                                                </Text>
                                                <Text style={{ lineHeight: 15, fontSize: Display.setHeight(1.4), fontWeight: 'bold', color: '#325962', letterSpacing: 0.5, marginLeft: Display.setHeight(2), marginBottom: Display.setHeight(0.5) }}>{route.params.brand.Description ? route.params.brand.Description : null}
                                                </Text>
                                            </View>
                                            <Separator height={Display.setHeight(1)} width={'100%'} />
                                            <View
                                                style={{
                                                    width: "100%",
                                                    height: Display.setHeight(4),
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 5,
                                                }}
                                            >
                                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', left: '4%' }}
                                                    onPress={handlePresentModal}
                                                >
                                                    <Text style={{ marginRight: 3, color: '#325962', opacity: 0.6 }}>Sort/Filter</Text>
                                                    <Icon
                                                        name="sliders"
                                                        type="font-awesome"
                                                        color="#325962"
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <Separator height={Display.setHeight(1)} width={'100%'} />
                                        </View>
                                    </>
                                }
                                data={formatData(sortedDishes, column)}
                                contentContainerStyle={styles.container}
                                renderItem={renderItem}
                                numColumns={column}
                                keyExtractor={(item) => item.Id}
                                backgroundColor='#fff'
                            />
                        </View>
                        {
                            cart.length >= 1 &&
                            <View
                                style={{
                                    width,
                                    height: Display.setHeight(10),
                                    borderRadius: 12,
                                    backgroundColor: '#f1f1f1',
                                    position: 'absolute',
                                    bottom: '0%',
                                    shadowColor: '#000000',
                                    shadowOffset: {
                                        width: 0,
                                        height: -10,
                                    },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    flexDirection: 'row'
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.8),
                                            fontWeight: 700,
                                            color: '#325964'
                                        }}
                                    >Total items in cart: {cart?.length}</Text>
                                </View>
                                <Button
                                    onPress={() => navigation.navigate('Cart')}
                                    title={<CustomTitleCart />}
                                    color="#FFAF51"
                                    titleStyle={{ color: "#325962", fontSize: Display.setHeight(1.7), fontWeight: 800 }}
                                    uppercase={false}
                                    contentContainerStyle={{
                                        height: Display.setHeight(5),
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                ></Button>
                            </View>
                        }
                        <AddToCart
                            ref={modalRef}
                            dish={selectedDish}
                            extras={Extras(selectedDish)}
                            dips={Dips(selectedDish)}
                            deliveryParams={deliveryParams}
                            brandId={route.params.brand.Id}
                        />
                    </NativeBaseProvider>
                </BottomSheetModalProvider>
            )}
        </>
    )
}

const CustomTitleCart = ({ CartItem }) => {
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
            }}
        >
            <Text
                style={{
                    color: "#325962",
                    fontSize: Display.setHeight(1.7),
                    fontWeight: 800
                }}
            >View Cart </Text>
            <MaterialIcons name="shopping-cart" size={28} color="#325964" />
        </View>
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
        width: Display.setWidth(45.5),
        height: undefined,
        resizeMode: "cover",
        aspectRatio: 166 / 115,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    itemText: {
        fontSize: Display.setHeight(1.2),
        color: "#325962",
        fontWeight: "bold"
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    textBox: {
        width: Display.setWidth(46),
        height: Display.setHeight(20),
        alignItems: "flex-start",
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
        paddingRight: Display.setHeight(1),
        lineHeight: 25,
        fontSize: Display.setHeight(1.5),
        color: '#325962',
        fontWeight: "bold",
    },
    SubText: {
        paddingRight: Display.setHeight(1),
        fontSize: Display.setHeight(1.2),
    },
    SubTextBrand: {
        paddingRight: Display.setHeight(1),
        fontSize: Display.setHeight(1),
        color: "#112362",
        marginBottom: 8,
        fontWeight: "700"
    },
    SubTextPrice: {
        fontSize: Display.setHeight(1.4),
        fontWeight: "bold",
        color: "#325962",
    },
    textAlignBox: {
        paddingLeft: Display.setHeight(0.8),
        marginTop: Display.setHeight(0.5)
    },
    logoBox: {
        width: 90,
        height: 90,
        marginLeft: Display.setHeight(2),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'white',
        position: 'absolute',
        bottom: '0%'
    },
})

export default DetailsScreen;