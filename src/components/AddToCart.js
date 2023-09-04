import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, FlatList, SectionList, Animated, Easing } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@react-native-material/core';
import { RadioButton } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Input, NativeBaseProvider } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckBox } from '@rneui/base';
import { FormControl } from 'native-base';
import { createAvatar } from '@dicebear/core';
import { adventurer, thumbs } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { Display } from '../utils';
import DishFormPizza from './DishFormPizza';
import Separator from './Separator';
import { addToCart } from '../actions/CartAction';
import { useNavigation } from '@react-navigation/native';
import { db } from '../SqlLiteDB';
import { RestaurantService } from '../services';

const { width, height } = Dimensions.get('window')

const DeliveryPrice = ({ price }) => {
    if (price === 0) {
        return <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <MaterialCommunityIcons name="truck-fast" size={24} color="#325962" />
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#325962'
                }}
            > Free Delivery</Text>
        </View>
    }
    return <View
        style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    ><MaterialCommunityIcons name="truck-fast" size={24} color="#325962" /><Text
        style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#325962'
        }}
    > € {price}</Text></View>
}

const AddToCartModal = forwardRef((props, ref) => {

    const navigation = useNavigation();

    const modalRef = useRef();

    const dish = props.dish

    const extras = props.extras

    const dips = props.dips

    const deliveryParams = props.deliveryParams

    const brandId = props.brandId

    ////////// Cart Icon Animation //////////

    // Define the height and margin of your button
    const buttonHeight = 50;
    const buttonRightMargin = 20;
    const buttonBottomMargin = 20;

    // Define the position of the cart icon
    const cartIconPositionY = -800; // Adjust based on your layout

    const buttonPositionX = width - buttonRightMargin;
    const buttonPositionY = height - buttonHeight - buttonBottomMargin;
    const cartIconPositionX = buttonPositionX;

    const dotPosition = useRef(new Animated.Value(0)).current;

    const cartIconOpacity = useRef(new Animated.Value(0)).current;

    const AnimatedDot = () => {
        const dotStyle = {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#FFAF51',
            position: 'absolute',
            marginLeft: -30,
            top: dotPosition.interpolate({
                inputRange: [0, 1],
                outputRange: [buttonPositionY, cartIconPositionY], // Set these values
            }),
            left: dotPosition.interpolate({
                inputRange: [0, 1],
                outputRange: [buttonPositionX, cartIconPositionX], // Set these values
            }),
        };

        return <Animated.View style={dotStyle} />;
    };

    const AnimatedCartIcon = () => {
        return (
            <Animated.Image
                source={require('../assets/icons/cart.png')} // Provide your cart icon here
                style={{ width: 30, height: 30, position: 'absolute', top: '5%', zIndex: 99, right: '5%', opacity: cartIconOpacity }}
            />
        );
    };

    ////////// Review and Star Mean //////////

    const sectionListRef = React.useRef(null);

    let starArray = dish?.reviewComment?.map(item => item.star);

    const StarMean = (starArray) => {
        const sum = starArray?.reduce((total, value) => total + value, 0);
        const mean = sum / (starArray?.length ?? 1);
        return parseFloat(mean.toFixed(1));
    }

    const [review, setReview] = useState(dish?.reviewComment);

    useEffect(() => {
        setReview(dish?.reviewComment);
    }, [dish]);

    useImperativeHandle(ref, () => ({
        present: () => {
            modalRef.current.present();
        },
    }));

    ///////////// Cart Management /////////////

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM cart;', [], (_, { rows }) => {
                console.log(rows)
            });
        });
    })

    const [selectedSize, setSelectedSize] = useState("Normal");

    const initialExtrasState = extras && extras.length > 0
        ? extras.reduce((acc, extra) => {
            acc[extra.Name] = false;
            return acc;
        }, {})
        : {};

    const [selectedExtras, setSelectedExtras] = useState(initialExtrasState);

    const initialDipsState = dips && dips.length > 0
        ? dips.reduce((acc, dip) => {
            acc[dip.Name] = false;
            return acc;
        }, {})
        : {};

    const [selectedDips, setSelectedDips] = useState(initialDipsState);

    console.log(selectedDips, selectedExtras, selectedSize)

    const [quantity, setQuantity] = useState(1);

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    const handleDippingsChange = (dippings) => {
        setSelectedDips(dippings); // Change to setSelectedDips
    };

    const handleToppingsChange = (toppings) => {
        setSelectedExtras(toppings);
    };

    const dishId = dish?.Id;

    const dispatch = useDispatch();

    const handleAddToCart = (dishId, selectedSize, selectedExtras, selectedDips, quantity) => {
        console.log(dishId, selectedSize, selectedExtras, selectedDips, quantity);
        dispatch(addToCart({ dishId, selectedSize, selectedExtras, selectedDips, quantity }))
            .then((result) => {
                if (result === 'OK') {
                    setQuantity(1)
                    Animated.parallel([
                        Animated.timing(dotPosition, {
                            toValue: 1,
                            duration: 1000,
                            easing: Easing.inOut(Easing.quad),
                            useNativeDriver: false,
                        }),
                        Animated.timing(cartIconOpacity, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: false,
                        }),
                    ]).start();
                    modalRef.current.dismiss();
                }
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
            })
    };

    ///////////// BottomSheet Handler /////////////

    const snapPoints = ["100%"]

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'details', title: 'Details' },
        { key: 'reviews', title: 'Reviews' },
    ]);

    const DetailsRoute = () => (
        <View style={{ height: Display.setHeight(40), overflow: 'scroll' }}>
            <View style={[styles.scene, { backgroundColor: 'white' }]} >
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#000',
                        marginLeft: Display.setHeight(1),
                        marginTop: Display.setHeight(2),
                    }}
                >Description</Text>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: '#000',
                        marginLeft: 10,
                        marginTop: Display.setHeight(0.5),
                        marginBottom: Display.setHeight(1),
                    }}
                >
                    {dish.Detail}
                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#000',
                        marginLeft: Display.setHeight(1),
                        marginTop: Display.setHeight(2),
                    }}
                >Ingredients</Text>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: '#000',
                        marginLeft: Display.setHeight(1),
                        marginTop: Display.setHeight(0.5),
                    }}
                >
                    {dish.IngredientDetail}
                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#000',
                        marginLeft: Display.setHeight(1),
                        marginTop: Display.setHeight(2),
                    }}
                >Allergien</Text>
                {
                    dish.Allergies.map((allergyItem, index) => {
                        return (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: Display.setHeight(0.5)
                                }}
                                key={index}
                            >
                                <Entypo name="dot-single" size={24} color="black"
                                    style={{
                                        marginLeft: Display.setHeight(1),
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: '#000',
                                        marginLeft: Display.setHeight(0),
                                        marginTop: Display.setHeight(0.5),
                                    }}
                                    key={index}
                                >
                                    {allergyItem.Allergy.Description}
                                </Text>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    );

    const [expanded, setExpanded] = useState(false);
    const renderComment = ({ item: comment }) => {

        // const seed = comment.comment ? comment.comment : comment.star

        // const avatar = createAvatar(thumbs, {
        //     seed: seed,
        //     backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
        //     backgroundType: [
        //         "gradientLinear",
        //         "solid"
        //     ],
        //     mouth: [
        //         "variant01",
        //         "variant05",
        //         "variant06",
        //         "variant12",
        //         "variant15",
        //         "variant16",
        //         "variant17",
        //         "variant18",
        //         "variant20",
        //         "variant21",
        //         "variant23",
        //         "variant24",
        //         "variant25",
        //         "variant26",
        //         "variant27",
        //         "variant28",
        //         "variant29",
        //         "variant30",
        //         "variant19"
        //     ],
        //     skinolor: [
        //         "ecad80",
        //         "f2d3b1",
        //         "9e5622"
        //     ],
        //     radius: 50
        //     // ... other options
        // }).toString();

        const toggleExpansion = () => {
            setExpanded(!expanded);
        };

        const commentStyle = expanded ? {} : { numberOfLines: 2 };

        return (
            <View
                style={{
                    width: '90%',
                    minHeight: 60,
                    backgroundColor: '#f1f1f1',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    alignSelf: 'center',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,
                    elevation: 4,
                    marginBottom: 20,
                    padding: 10,
                }}
            >
                <View
                    style={{
                        width: Display.setHeight(6),
                        height: Display.setHeight(6),
                        borderRadius: '50%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        backgroundColor: '#fff',
                    }}
                >
                    <FontAwesome name="user" size={24} color="black" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#325962',
                            fontWeight: '500',
                            marginBottom: 2,
                        }}
                    >
                        {comment.user}  <FontAwesome name="star" size={15} color="#FFAF51" /> {comment.star}
                    </Text>
                    <Text style={[{ fontSize: 12, color: '#000', fontWeight: '400' }, commentStyle]}>
                        {comment.comment}
                    </Text>
                </View>
            </View>
        );
    };

    const ReviewsRoute = () => (
        <ScrollView style={{ height: Display.setHeight(40), overflow: 'scroll' }}>
            <FlatList
                aria-expanded="false"
                data={review}
                renderItem={renderComment}
                style={[styles.scene, {
                    width: "100%",
                    height: "100%",
                }]}
            />
        </ScrollView>
    );

    const ListPrices = () => {
        const sortedPrices = [...dish.Prices].sort((a, b) => {
            return a.Description === 'Normal' ? -1 : 1;
        });
        const normalPrice = sortedPrices.find(price => price.Description === selectedSize);
        return (
            <Text style={[styles.SubTextPrice, { marginTop: 5 }]}>
                €{normalPrice ? normalPrice.Price : 'N/A'}
            </Text>
        );
    }

    const scrollToSection = (sectionTitle) => {
        const sectionIndex = sectionTitle === "Customize" ? 1 : 0;
        sectionListRef.current.scrollToLocation({
            sectionIndex,
            itemIndex: 1,
        });
    };

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            dismissOnPanDown={true}
            enableOverDrag
            enab
            backgroundStyle={{
                borderRadius: 30
            }}
            animateOnMount={true}
            handleStyle={{
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 5,
            }}
            handleIndicatorStyle={{ backgroundColor: '#fff' }}
        >
            <View style={styles.contentContainer}>
                <AnimatedCartIcon />
                <Image
                    source={{ uri: dish ? dish.Image : '' }}
                    style={styles.image}
                />
                <View style={styles.modalContent}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.dishName}>{dish ? dish.Name : ''}</Text>
                        <ListPrices />
                    </View>
                    <View style={styles.reviewContainer}>
                        <View style={styles.reviewItem}>
                            <FontAwesome name="star" size={22} color="#FFAF51" />
                            <Text style={styles.reviewText}>{StarMean(starArray)} ({dish ? dish?.reviewComment?.length : ''})</Text>
                        </View>
                        <View style={styles.reviewItem}>
                            <MaterialCommunityIcons name="clock-fast" size={24} color="#325962" />
                            <Text style={styles.reviewText}>{dish ? dish.EstimatedDeliveryTime : ''} mins</Text>
                        </View>
                        <DeliveryPrice price={deliveryParams ? deliveryParams.deliverCharges : ''} />
                    </View>
                    <View style={styles.divider} />
                    <SectionList
                        sections={[
                            {
                                data: [
                                    <View
                                        key="details"
                                        style={{
                                            width: "100%",
                                            height: Display.setHeight(45),
                                            flexDirection: "column",
                                        }}
                                    >
                                        <TabView
                                            navigationState={{ index, routes }}
                                            renderScene={SceneMap({
                                                details: DetailsRoute,
                                                reviews: ReviewsRoute,
                                            })}
                                            onIndexChange={setIndex}
                                            initialLayout={{ width: width }}
                                            renderTabBar={props => (
                                                <TabBar
                                                    {...props}
                                                    indicatorStyle={{ backgroundColor: '#FFAF51' }}
                                                    style={{ backgroundColor: '#fff' }}
                                                    labelStyle={{ color: '#325962' }}
                                                />
                                            )}
                                        />
                                        <View style={styles.divider} />
                                    </View>
                                ]
                            },
                            {
                                title: "Customize",
                                data: [
                                    <DishFormPizza
                                        key="customize"
                                        dish={dish ? dish : ''}
                                        extras={extras}
                                        dips={dips}
                                        onSizeChange={handleSizeChange}
                                        onToppingsChange={handleToppingsChange}
                                        onDippingsChange={handleDippingsChange}
                                        selectedSize={selectedSize}
                                        setSelectedSize={setSelectedSize}
                                        selectedExtras={selectedExtras}
                                        setSelectedExtras={setSelectedExtras}
                                        selectedDips={selectedDips}
                                        setSelectedDips={setSelectedDips}
                                    />
                                ]
                            }
                        ]}
                        ref={sectionListRef}
                        renderItem={({ item }) => item}
                        renderSectionHeader={({ section }) => section.title ?
                            <TouchableOpacity
                                onPress={() => scrollToSection(section.title)}
                            >
                                <View
                                    style={{
                                        width,
                                        height: Display.setHeight(6),
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 17,
                                            fontWeight: '300',
                                            lineHeight: Display.setHeight(5.5),
                                            color: '#325964',
                                        }}
                                    >{section.title}</Text>
                                    <View
                                        style={{
                                            width,
                                            height: 2,
                                            backgroundColor: '#FFAF51'
                                        }}
                                    >
                                    </View>
                                </View>
                            </TouchableOpacity>
                            : null}
                    />
                </View>
                <View
                    style={{
                        width,
                        height: Display.setHeight(10),
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        position: 'absolute',
                        bottom: '0%',
                    }}
                >
                    <Separator width={'100%'} height={Display.setHeight(0.1)} />
                    <View style={{
                        width: '95%',
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        position: 'absolute',
                        top: '20%'
                    }}>
                        <View style={styles.itemAddContainer}>
                            <AntDesign
                                name="minus"
                                color='#FFAF51'
                                size={20}
                                style={{
                                    marginRight: 10
                                }}
                                onPress={decrementQuantity}
                            />
                            <Text style={styles.itemCountText}>{quantity}</Text>
                            <AntDesign
                                name="plus"
                                color='#FFAF51'
                                size={20}
                                style={{
                                    marginLeft: 10
                                }}
                                onPress={incrementQuantity}
                            />
                        </View>
                        <Button
                            style={{
                                width: '50%',
                            }}
                            title="Add to Cart"
                            color="#FFAF51"
                            titleStyle={styles.buttonTitle}
                            uppercase={false}
                            contentContainerStyle={styles.buttonContent}
                            onPress={() => handleAddToCart(dishId, selectedSize, selectedExtras, selectedDips, quantity)}
                        />
                        <AnimatedDot />
                    </View>
                </View>
            </View>
        </BottomSheetModal>
    );
});

export default AddToCartModal;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#325962',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
    },
    buttonText: {
        color: '#ffffff',
    },
    SubTextPrice: {
        fontSize: 25,
        color: '#FFAF51',
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: undefined,
        resizeMode: 'cover',
        aspectRatio: 166 / 115,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    modalContent: {
        width: '100%',
        height: '65%',
        position: 'relative',
        top: '-5%',
        backgroundColor: '#fff',
        borderRadius: 30,
    },
    infoContainer: {
        width: '88%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 10
    },
    dishName: {
        fontSize: 28,
        color: '#325962',
        fontWeight: 'bold',
    },
    subTextPrice: {
        fontSize: 25,
        color: '#FFAF51',
        fontWeight: 'bold',
    },
    reviewContainer: {
        width: '88%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    reviewItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#325962',
        marginLeft: 5,
    },
    deliveryPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryPriceText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#325962',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#f1f1f1',
    },
    buttonTitle: {
        color: '#325962',
        fontSize: 12,
        fontWeight: '800',
    },
    buttonContent: {
        width: '100%',
        height: 40,
        alignSelf: 'center',
    },
    scene: {
        padding: 10,
    },
    description: {
        fontSize: 12,
        fontWeight: '400',
        color: '#000',
        marginTop: 5,
        marginBottom: 10,
    },
    reviewList: {
        width: '100%',
        height: '100%',
    },
    commentContainer: {
        width: '90%',
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginBottom: 10,
        padding: 10,
    },
    commentAvatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 14,
        color: '#325962',
        fontWeight: '500',
    },
    commentText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '400',
    },
    itemAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#f1f1f1",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    itemCountText: {
        color: '#325962',
        fontSize: 20,
        lineHeight: 14 * 1.4,
        marginHorizontal: 8,
    },
});
