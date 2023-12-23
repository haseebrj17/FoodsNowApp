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
import React, { useEffect, useState, useMemo } from "react";
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
import { Display, transformImageUrl } from "../utils";
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

const RenderImage = React.memo((props) => {
    const { cover } = props;
    return (
        <Image
            source={{ uri: transformImageUrl({ originalUrl: cover, size: '/tr:w-900' }) }}
            style={styles.bannerImage}
        />
    );
});

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
        <Image source={{ uri: transformImageUrl({ originalUrl: logo, size: '/tr:w-200' }) }} style={{
            aspectRatio: imgAspect,
            resizeMode: 'contain',
            height: undefined,
            width: '90%',
            margin: Display.setHeight(0.2)
        }} />
    </View>
}

const ListHeader = React.memo(({ cover, logo, brandName }) => {
    return (
        <>
            <View style={{ height: width / 1.3 }}>
                <RenderImage cover={cover} />
                <RenderLogoBox logo={logo} />
            </View>
            <View
                style={{
                    width,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                }}
            >
                <Text style={{ fontSize: Display.setHeight(2.2), fontWeight: 'bold', color: '#325962', marginLeft: Display.setHeight(2), marginBottom: Display.setHeight(1.5), marginTop: Display.setHeight(1.2), letterSpacing: 1, }}>{brandName.toUpperCase()}
                </Text>
            </View>
            <Separator height={Display.setHeight(1)} width={'100%'} />
        </>
    )
})

const DetailsScreen = ({ route }) => {
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        Fonts
    });

    const [Brand, setBrand] = useState(route.params.brand)
    const [deliveryParams, setDeliveryParams] = useState(route.params.deliveryParams)
    const [dish, setDish] = useState(null);
    const [unfilteredDish, setUnfilteredDish] = useState(null);
    const [extras, setExtras] = useState(null);
    const [dips, setDips] = useState(null);
    const [categories, setCategories] = useState(null);
    let sortedDishes = dish ? [...dish] : [];

    const dispatch = useDispatch();

    const { cart } = useSelector(
        (state) => state.cartState
    );

    const { products, loadingProducts, error } = useSelector(
        (state) => state.productState
    );
    const categoryId = route.params.brand.Id;

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

    useEffect(() => {
        if (products) {
            setDish(products?.Products)
            setUnfilteredDish(products?.Products)
            setDips(products?.ProductExtraDippings)
            setExtras(products?.ProductExtraTroppings)
            setCategories(products?.Categories)
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

    ///////////////  Categories Funtion  ///////////////

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const filterProductsByCategory = (categoryId) => {
        console.log("Filtering for category ID:", categoryId);

        if (categoryId === null) {
            return unfilteredDish;
        } else {
            const filtered = unfilteredDish.filter(product =>
                product.ProductCategories.some(category => {
                    console.log("Comparing:", category.CategoryId, "with", categoryId);
                    return category.CategoryId === categoryId;
                })
            );
            console.log("Filtered Products:", filtered);
            return filtered;
        }
    };

    const handleCategory = (item) => {
        if (item.Id === selectedCategory?.Id) {
            setSelectedCategory(null);
            setDish(unfilteredDish);
        } else {
            setSelectedCategory(item);
            // setIsLoading(true);
            const filteredProducts = filterProductsByCategory(item.Id);
            setDish(filteredProducts);
        }
    };

    const renderCategories = ({ item }) => {
        const isSelected = item.Id === selectedCategory?.Id;
        return (
            <TouchableOpacity onPress={() => handleCategory(item)}>
                <View style={{
                    width: Display.setWidth(25),
                    height: Display.setHeight(4),
                    backgroundColor: isSelected ? '#325964' : '#F4E4CD', // Change color if selected
                    margin: Display.setHeight(1),
                    borderRadius: Display.setHeight(50),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: Display.setHeight(1.2),
                        fontWeight: '700',
                        color: isSelected ? '#F4E4CD' : '#325964' // Change text color if selected
                    }}>
                        {item.Name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    ///////////////  Render Main FlatList Item  ///////////////

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
                            uri: transformImageUrl({ originalUrl: dishes.Image, size: '/tr:w-240' })
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
                            title="Add to Cart"
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
                        <TouchableOpacity
                            onPress={() => {
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                } else {
                                    navigation.navigate('Main');
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
                        {
                            route.params.brand.Logo === null ||
                            route.params.brand.Logo === undefined ||
                            route.params.brand.Logo === "" && (
                                <View
                                    style={{
                                        width,
                                        height: Dimensions.get('window').height * 0.09,
                                        backgroundColor: '#F4E4CD',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            marginTop: 30,
                                            color: "#325962",
                                        }}
                                    >
                                        Kategorien - {route.params.brand.Name}
                                    </Text>
                                </View>
                            )
                        }
                        <View
                            style={{
                                backgroundColor: '#fff',
                            }}
                        >
                            <FlatList
                                ListHeaderComponent={
                                    <View
                                        style={{
                                            width,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {
                                            route.params.brand.Logo &&
                                            <ListHeader
                                                cover={route.params.brand.Cover}
                                                logo={route.params.brand.Logo}
                                                brandName={route.params.brand.Name}
                                                brandDescription={route.params.brand.Description}
                                            />
                                        }
                                        {
                                            categories &&
                                            <FlatList
                                                horizontal={true}
                                                data={categories}
                                                keyExtractor={(item) => item.Id}
                                                renderItem={renderCategories}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{
                                                    paddingHorizontal: Display.setWidth(2),
                                                }}
                                            />
                                        }
                                        <Separator height={Display.setHeight(1)} width={'100%'} />
                                    </View>
                                }
                                ListFooterComponent={
                                    <View
                                        style={{
                                            width: "100%",
                                            height: Display.setHeight(40),
                                            backgroundColor: "#f1f1f1",
                                            marginTop: Display.setHeight(1),
                                            marginBottom: cart.length >= 1 ? Display.setHeight(5) : 0,
                                        }}
                                    >
                                        <Image
                                            source={require('../assets/BNFooter.png')}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                resizeMode: "contain",
                                                top: 0,
                                                left: 0,
                                                aspectRatio: 800 / 646,
                                            }}
                                        />
                                    </View>
                                }
                                data={formatData(sortedDishes, column)}
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
                                            fontSize: Display.setHeight(1.6),
                                            fontWeight: 700,
                                            color: '#325964'
                                        }}
                                    >Artikel insgesamt: {cart?.length}</Text>
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
                    fontSize: Display.setHeight(1.6),
                    fontWeight: 600
                }}
            >Warenkorb ansehen</Text>
            <MaterialIcons name="shopping-cart" size={25} color="#325964" />
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
    subContainer: {
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