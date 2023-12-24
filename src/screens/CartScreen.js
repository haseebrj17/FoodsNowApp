import { StyleSheet, Text, View, Image, ScrollView, Dimensions, FlatList, SectionList } from 'react-native'
import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addListener, removeListener } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react'
import { Display, transformImageUrl } from '../utils'
import { StatusBar } from 'native-base'
import { RestaurantService } from '../services'
import Skeleton from '../components/Skeleton'
import { CountryCode } from '../assets/constants'
import { StorageService } from '../services'
import { FontAwesome, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { getCartItems, incrementQuantity, decrementQuantity, beginDecrementing, endDecrementing } from '../actions/CartAction'
import { Separator } from '../components'
import Button from '../components/Button'
import empty from '../assets/icons/emptycart.png'
import { Store } from '../Store';
import { ActivityIndicator } from 'react-native-paper';
import globalEventEmitter from '../events/globalEventEmitter';
import LoadingOverlay from '../components/LoadingOverlay';
import ActiveTabContext from '../context/ActiveTabContext';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {

    const { setActiveTab } = useContext(ActiveTabContext);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCartItems());
    }, [dispatch]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(getCartItems());
        });

        return unsubscribe;
    }, [navigation, dispatch]);

    const { cart, isLoading, error, subLoading, isDecrementing } = useSelector(
        (state) => state.cartState
    );

    const { isAppLoading, token, isFirstTimeUse, userData, location } = useSelector(
        (state) => state.generalState
    );

    useEffect(() => {
        console.log(location);
    }, [isAppLoading, token, isFirstTimeUse, userData, location]);

    useEffect(() => {
        const handleRefetch = () => {
            dispatch(getCartItems());
        };

        // Start listening to the event
        globalEventEmitter.addListener('refetchCart', handleRefetch);

        // Cleanup on component unmount
        return () => {
            globalEventEmitter.removeListener('refetchCart', handleRefetch);
        };
    }, []);

    const [loading, setLoading] = useState(true);

    const cartItems = useSelector(state => state.cartState.cart);

    const [grandTotal, setGrandTotal] = useState(null);

    const [itemTotal, setItemTotal] = useState(null);

    const [cartData, setCartData] = useState([]);

    const [checkout, setCheckout] = useState(null);

    const [locationData, setLocationData] = useState(null);

    const [minOrder, setMinOrder] = useState(null);

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (dataLoaded) {
            setLoading(false);
        }
    }, [dataLoaded]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (location && location?.Country) {
                    setLocationData(location);
                    setMinOrder(location?.DeliveryParams?.minOrderValue);
                }

                await calculateTotalPrice(cartItems).then(response => {
                    setItemTotal(response.grandTotal);
                    setGrandTotal(response.grandTotal + location.DeliveryParams.deliverCharges);
                    setCartData(response.productDetailsArray);
                    setCheckout(response.checkoutArray);
                })
            } catch (error) {
                console.error("Error while fetching data:", error);
                setLoading(false);
            } finally {
                setTimeout(() => {
                    setDataLoaded(true);
                }, 2500);
            }
        };

        fetchData();
    }, [cartItems]);

    const calculateTotalPrice = async (cartItems) => {
        let grandTotal = 0;
        const productDetailsArray = [];
        const checkoutArray = [];

        // Iterate over cartItems to fetch product details
        const productPromises = cartItems?.map(async item => {
            try {
                const parsedProductId = JSON.parse(item.product_id);
                if (parsedProductId && parsedProductId.dishId) {
                    const productDetails = await RestaurantService.getProductById(parsedProductId.dishId);
                    return productDetails;
                }
                return null;
            } catch (error) {
                console.error("Error in productPromises map:", error);
                return null;
            }
        });

        const allProductDetails = await Promise.all(productPromises);

        allProductDetails.forEach((productDetails, index) => {
            if (!productDetails) return;

            const cartItem = cartItems[index];
            const productId = JSON.parse(cartItem.product_id);
            const quantity = JSON.parse(cartItem.quantity)

            let itemTotal = 0;

            const basePrice = productDetails.data.Product.Prices.find(price => price.Description === productId.selectedSize)?.Price || 0;
            itemTotal += basePrice;

            const isEmpty = (obj) => {
                return Object.keys(obj).length === 0;
            }

            if (productDetails.data.ProductExtraTroppings && !isEmpty(productId.selectedToppings)) {
                productDetails.data.ProductExtraTroppings.forEach(extra => {
                    const selectedExtra = productId.selectedToppings[extra.Name];
                    if (selectedExtra && selectedExtra.selected) {
                        const extraPrice = extra.Prices.find(price => price.Description === selectedExtra.priceDescription)?.Price || 0;
                        console.log("Extra Price for", extra.Name, ":", extraPrice);
                        itemTotal += extraPrice;
                    }
                });
            }

            if (productDetails.data.ProductExtraDippings && !isEmpty(productId.selectedDippings)) {
                productDetails.data.ProductExtraDippings.forEach(dip => {
                    const selectedDip = productId.selectedDippings[dip.Name];
                    if (selectedDip && selectedDip.selected) {
                        const dipPrice = dip.Prices.find(price => price.Description === selectedDip.priceDescription)?.Price || 0;
                        console.log("Dip Price for", dip.Name, ":", dipPrice);
                        itemTotal += dipPrice;
                    }
                });
            }

            itemTotal *= quantity;

            grandTotal += itemTotal;

            const selectedDips = productDetails.data.ProductExtraDippings && !isEmpty(productId.selectedDippings)
                ? productDetails.data.ProductExtraDippings.filter(dip => productId.selectedDippings[dip.Name])
                : [];

            const selectedToppings = productDetails.data.ProductExtraTroppings && !isEmpty(productId.selectedToppings)
                ? productDetails.data.ProductExtraTroppings.filter(topping => productId.selectedToppings[topping.Name])
                : [];

            productDetailsArray.push({
                id: cartItem.id,
                Product: productDetails.data.Product,
                ProductExtraDippings: selectedDips,
                ProductExtraTroppings: selectedToppings,
                itemTotal,
                quantity: quantity,
            });
            checkoutArray.push({
                Quantity: quantity,
                ProductId: productDetails.data.Product.Id,
                ProductPriceId: productDetails.data.Product.Prices.find(price => price.Description === productId.selectedSize)?.Id,
                OrderProductExtraDippings: selectedDips.map(dip => ({
                    Quantity: "1",
                    ProductExtraDippingId: dip.Id,
                    ProductExtraDippingPriceId: dip.Prices.find(price => price.Description === productId.selectedDippings[dip.Name].priceDescription)?.Id
                })),
                OrderProductExtraToppings: selectedToppings.map(topping => ({
                    Quantity: "1",
                    ProductExtraToppingId: topping.Id,
                    ProductExtraToppingPriceId: topping.Prices.find(price => price.Description === productId.selectedToppings[topping.Name].priceDescription)?.Id
                }))
            })
        });

        return {
            grandTotal,
            productDetailsArray,
            checkoutArray
        };
    }

    const RenderItem = ({ item }) => {
        return (
            <View
                style={{
                    width: width * 0.9,
                    height: Display.setHeight(12),
                    backgroundColor: '#f1f1f1',
                    borderRadius: 15,
                    marginTop: Display.setHeight(0.5),
                    marginBottom: Display.setHeight(0.5),
                    alignSelf: 'center',
                    flexDirection: 'row',
                }}
            >
                <View
                    style={{
                        flex: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={{
                            uri: transformImageUrl({ originalUrl: item?.Product?.Image, size: '/tr:w-200' })
                        }}
                        style={{
                            width: '80%',
                            height: '65%',
                            resizeMode: 'cover',
                            borderRadius: 12,
                        }}
                    />
                </View>
                <View
                    style={{
                        flex: 4,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: '#325964',
                            marginTop: Display.setHeight(2)
                        }}
                    >{item.Product.Name}</Text>
                    <View
                        style={{
                            width: '95%',
                            height: Display.setHeight(5),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: Display.setHeight(1.5),
                            position: 'absolute',
                            bottom: '15%'
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                paddingVertical: Display.setHeight(1),
                                paddingHorizontal: Display.setHeight(1),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#325964',
                                }}
                            >€ {item.itemTotal}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: "#d9d9d9",
                            paddingVertical: Display.setHeight(0.8),
                            paddingHorizontal: Display.setHeight(2),
                            borderRadius: 8,
                        }}>
                            <AntDesign
                                name="minus"
                                color='#FFAF51'
                                size={Display.setHeight(2.6)}
                                style={{
                                    marginRight: Display.setHeight(1)
                                }}
                                onPress={() => {
                                    if (!isDecrementing) {
                                        dispatch(beginDecrementing());
                                        dispatch(decrementQuantity(item.id))
                                            .then(() => {
                                                dispatch(endDecrementing());
                                            })
                                            .catch(() => {
                                                dispatch(endDecrementing());
                                            });
                                    }
                                }}
                                disabled={isDecrementing}
                            />
                            <Text style={{
                                color: '#325962',
                                fontSize: Display.setHeight(1.8),
                                lineHeight: Display.setHeight(2),
                                marginHorizontal: 8,
                            }}>{item.quantity}</Text>
                            <AntDesign
                                name="plus"
                                color='#FFAF51'
                                size={Display.setHeight(2.6)}
                                style={{
                                    marginLeft: Display.setHeight(1)
                                }}
                                onPress={() => dispatch(incrementQuantity(item.id))}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    if (subLoading) {
        return <LoadingOverlay />
    }

    return (
        <>
            {
                cartItems.length === 0 ? (
                    <View>
                        <View
                            style={{
                                width,
                                height: Display.setHeight(12),
                                backgroundColor: '#F4E4CD',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    marginTop: 35,
                                    color: "#325962",
                                }}
                            >Einkaufswagen</Text>
                        </View>
                        <View
                            style={{
                                width,
                                height: height - Display.setHeight(35),
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Image source={empty}
                                style={{
                                    width: width * 0.5,
                                    height: width * 0.5
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: Display.setHeight(2.4),
                                    fontWeight: 'bold',
                                    color: '#325964',
                                }}
                            >Ihr Einkaufswagen ist leer</Text>
                            <View
                                style={{
                                    width: width * 0.8,
                                    alignSelf: 'center',
                                    marginTop: Display.setHeight(4)
                                }}
                            >
                                <Button
                                    title='Add Something'
                                    onPress={() => {
                                        navigation.navigate('Home')
                                        setActiveTab("Home")
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                ) : (
                    <>
                        {
                            loading ?
                                (
                                    <View>
                                        <View
                                            style={{
                                                width,
                                                height: Display.setHeight(12),
                                                backgroundColor: '#F4E4CD',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'row'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: 'bold',
                                                    marginTop: 35,
                                                    color: "#325962",
                                                }}
                                            >Einkaufswagen</Text>
                                        </View>
                                        <View>
                                            <Skeleton height={Display.setHeight(15)} width={Display.setWidth(90)} style={{ borderRadius: 12, alignSelf: 'center', marginTop: Display.setHeight(1.5) }} />
                                            <View
                                                style={{
                                                    width: Display.setHeight(5),
                                                    height: Display.setHeight(5),
                                                    borderRadius: 2,
                                                    flexDirection: 'row',
                                                    position: 'absolute',
                                                    left: '10%',
                                                    top: '15%',
                                                }}
                                            >
                                                <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ borderRadius: 2, marginTop: Display.setHeight(1) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                <View
                                                    style={{
                                                        padding: 10
                                                    }}
                                                >
                                                    <Skeleton height={Display.setHeight(3)} width={Display.setHeight(18)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                    <Skeleton height={Display.setHeight(2)} width={Display.setHeight(27)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            padding: 10,
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Skeleton height={Display.setHeight(3)} width={Display.setHeight(7)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                        <Skeleton height={Display.setHeight(3)} width={Display.setHeight(10)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View>
                                            <Skeleton height={Display.setHeight(15)} width={Display.setWidth(90)} style={{ borderRadius: 12, alignSelf: 'center', marginTop: Display.setHeight(1.5) }} />
                                            <View
                                                style={{
                                                    width: Display.setHeight(5),
                                                    height: Display.setHeight(5),
                                                    borderRadius: 2,
                                                    flexDirection: 'row',
                                                    position: 'absolute',
                                                    left: '10%',
                                                    top: '15%',
                                                }}
                                            >
                                                <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ borderRadius: 2, marginTop: Display.setHeight(1) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                <View
                                                    style={{
                                                        padding: 10
                                                    }}
                                                >
                                                    <Skeleton height={Display.setHeight(3)} width={Display.setHeight(18)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                    <Skeleton height={Display.setHeight(2)} width={Display.setHeight(27)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            padding: 10,
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Skeleton height={Display.setHeight(3)} width={Display.setHeight(7)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                        <Skeleton height={Display.setHeight(3)} width={Display.setHeight(10)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <>
                                        <SectionList
                                            sections={[{ title: 'My Cart', data: cartData }]}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item }) => <RenderItem item={item} />}
                                            ListHeaderComponent={
                                                <View
                                                    style={{
                                                        width,
                                                        height: Display.setHeight(12),
                                                        backgroundColor: '#F4E4CD',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            marginTop: 35,
                                                            color: "#325962",
                                                        }}
                                                    >Einkaufswagen</Text>
                                                </View>
                                            }
                                            ListFooterComponent={
                                                <View>
                                                    <Separator width={'100%'} height={Display.setHeight(0.1)} />
                                                    <View>
                                                        <View
                                                            style={{
                                                                width,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                alignSelf: 'center',
                                                                marginTop: Display.setHeight(2),
                                                                marginBottom: Display.setHeight(2)
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    width: width * 0.9,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    flexDirection: 'row',
                                                                    margin: Display.setHeight(0.5)
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        fontWeight: '600',
                                                                        color: '#325964'
                                                                    }}
                                                                >Posten Gesamt</Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        fontWeight: '600',
                                                                        color: '#325964'
                                                                    }}
                                                                >€ {itemTotal}</Text>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    width: width * 0.9,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    flexDirection: 'row',
                                                                    margin: Display.setHeight(0.5)
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        fontWeight: '600',
                                                                        color: '#325964',
                                                                    }}
                                                                >Lieferkosten</Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        fontWeight: '600',
                                                                        color: '#325964',
                                                                    }}
                                                                >{location?.DeliveryParams?.deliverCharges === 0 ? 'Free' : `€ ${location?.DeliveryParams?.deliverCharges}`}</Text>
                                                            </View>
                                                        </View>
                                                        <Separator width={'100%'} height={Display.setHeight(0.1)} />
                                                        <View
                                                            style={{
                                                                width,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                alignSelf: 'center',
                                                                marginTop: Display.setHeight(2),
                                                                marginBottom: Display.setHeight(2)
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    width: width * 0.9,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    flexDirection: 'row',
                                                                    margin: Display.setHeight(0.5)
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: 20,
                                                                        fontWeight: 'bold',
                                                                        color: '#325964'
                                                                    }}
                                                                >Gesamtbetrag</Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 20,
                                                                        fontWeight: 'bold',
                                                                        color: '#325964'
                                                                    }}
                                                                >€ {grandTotal}</Text>
                                                            </View>
                                                        </View>
                                                        <Separator width={'100%'} height={Display.setHeight(0.1)} />
                                                        {
                                                            grandTotal >= minOrder ? (
                                                                <></>
                                                            ) : (
                                                                <>
                                                                    <View
                                                                        style={{
                                                                            width,
                                                                            height: Display.setHeight(8),
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                        }}
                                                                    >
                                                                        <View
                                                                            style={{
                                                                                width: width * 0.8,
                                                                                height: '80%',
                                                                                backgroundColor: '#d9d9d9',
                                                                                borderRadius: 12,
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                padding: Display.setHeight(1)
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    fontSize: Display.setHeight(1.5),
                                                                                    color: '#000'
                                                                                }}
                                                                            >Bitte legen Sie weitere Artikel in den Warenkorb, um den Mindestbestellwert von {minOrder} € zu erreichen.</Text>
                                                                        </View>
                                                                    </View>
                                                                    <Separator width={'100%'} height={Display.setHeight(0.1)} />
                                                                </>
                                                            )
                                                        }
                                                        <View
                                                            style={{
                                                                width: width * 0.8,
                                                                alignSelf: 'center',
                                                            }}
                                                        >
                                                            {
                                                                token === null || token === '' ? (
                                                                    <Button
                                                                        title='Anmeldung zur Kasse'
                                                                        onPress={() => navigation.navigate('Registration')}
                                                                    />
                                                                ) : (
                                                                    <Button
                                                                        disabled={grandTotal >= minOrder ? false : true}
                                                                        color={grandTotal >= minOrder ? null : '#d9d9d9'}
                                                                        title='Weiter zum Checkout'
                                                                        onPress={() => navigation.navigate('CartNavigator', { screen: 'Checkout', params: { checkoutData: checkout, cartData: cartData, grandTotal: grandTotal } })}
                                                                    />
                                                                )}
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </>
                                )
                        }
                    </>
                )}
        </>
    )
}

export default CartScreen

const styles = StyleSheet.create({})