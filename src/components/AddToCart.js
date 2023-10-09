import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, SectionList } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@react-native-material/core';
import { FontAwesome, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { Display } from '../utils';
import DishFormPizza from './DishFormPizza';
import Separator from './Separator';
import { addToCart } from '../actions/CartAction';
import { useNavigation } from '@react-navigation/native';
import { db } from '../SqlLiteDB';

const { width, height } = Dimensions.get('window')

const DetailsRoute = ({ dish }) => (
    <View style={{ height: Display.setHeight(40), overflow: 'scroll' }}>
        <View style={[styles.scene, { backgroundColor: 'white' }]} >
            <Text
                style={{
                    fontSize: Display.setHeight(1.9),
                    fontWeight: 'bold',
                    color: '#000',
                    marginLeft: Display.setHeight(1),
                    marginTop: Display.setHeight(2),
                }}
            >Description</Text>
            <Text
                style={{
                    fontSize: Display.setHeight(1.5),
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
                    fontSize: Display.setHeight(1.9),
                    fontWeight: 'bold',
                    color: '#000',
                    marginLeft: Display.setHeight(1),
                    marginTop: Display.setHeight(2),
                }}
            >Ingredients</Text>
            <Text
                style={{
                    fontSize: Display.setHeight(1.5),
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
                    fontSize: Display.setHeight(1.9),
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
                                    fontSize: Display.setHeight(1.7),
                                    fontWeight: '600',
                                    color: '#000',
                                    marginLeft: Display.setHeight(0),
                                    marginTop: Display.setHeight(0.8),
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

const ListPrices = ({ dish, selectedSize }) => {
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
                    fontSize: Display.setHeight(1.6),
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
            fontSize: Display.setHeight(1.6),
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

    ////////// Review and Star Mean //////////

    const sectionListRef = React.useRef(null);

    let starArray = dish?.reviewComment?.map(item => item.star);

    const StarMean = (starArray) => {
        const sum = starArray?.reduce((total, value) => total + value, 0);
        const mean = sum / (starArray?.length ?? 1);
        return parseFloat(mean.toFixed(1));
    }

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
                    modalRef.current.dismiss();
                }
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
            })
    };

    ///////////// BottomSheet Handler /////////////

    const snapPoints = ["100%"]

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
                borderRadius: Display.setHeight(3.2)
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
                <Image
                    source={{ uri: dish ? dish.Image : '' }}
                    style={styles.image}
                />
                <View style={styles.modalContent}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.dishName}>{dish ? dish.Name : ''}</Text>
                        <ListPrices dish={dish} selectedSize={selectedSize} />
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
                        removeClippedSubviews={false}
                        sections={[
                            {
                                key: "details",
                                data: [{ type: "details" }],
                                title: "Details"
                            },
                            {
                                title: "Customize",
                                data: [
                                    {
                                        type: "customize",
                                        dish: dish ? dish : '',
                                        extras: extras,
                                        dips: dips,
                                        onSizeChange: handleSizeChange,
                                        onToppingsChange: handleToppingsChange,
                                        onDippingsChange: handleDippingsChange,
                                        selectedSize: selectedSize,
                                        setSelectedSize: setSelectedSize,
                                        selectedExtras: selectedExtras,
                                        setSelectedExtras: setSelectedExtras,
                                        selectedDips: selectedDips,
                                        setSelectedDips: setSelectedDips
                                    }
                                ]
                            }
                        ]}
                        ref={sectionListRef}
                        renderItem={({ item }) => {
                            if (item.type === "details") {
                                return (
                                    <>
                                        <DetailsRoute dish={dish} />
                                        <Separator width={Display.setWidth(100)} height={Display.setHeight(0.1)} />
                                    </>
                                );
                            } else if (item.type === "customize") {
                                return (
                                    <DishFormPizza
                                        dish={item.dish ? item.dish : ''}
                                        extras={item.extras}
                                        dips={item.dips}
                                        onSizeChange={item.onSizeChange}
                                        onToppingsChange={item.onToppingsChange}
                                        onDippingsChange={item.onDippingsChange}
                                        selectedSize={item.selectedSize}
                                        setSelectedSize={item.setSelectedSize}
                                        selectedExtras={item.selectedExtras}
                                        setSelectedExtras={item.setSelectedExtras}
                                        selectedDips={item.selectedDips}
                                        setSelectedDips={item.setSelectedDips}
                                    />
                                );
                            }
                        }}
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
                                            fontSize: Display.setHeight(2),
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
        fontSize: Display.setHeight(2.6),
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#325962',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: Display.setHeight(0.6),
    },
    buttonText: {
        color: '#ffffff',
    },
    SubTextPrice: {
        fontSize: Display.setHeight(2.5),
        color: '#FFAF51',
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: undefined,
        resizeMode: 'cover',
        aspectRatio: 166 / 115,
        borderTopLeftRadius: Display.setHeight(3.2),
        borderTopRightRadius: Display.setHeight(3.2),
    },
    modalContent: {
        width: '100%',
        height: '65%',
        position: 'relative',
        top: '-5%',
        backgroundColor: '#fff',
        borderRadius: Display.setHeight(3.2),
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
        fontSize: Display.setHeight(2.8),
        color: '#325962',
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
        fontSize: Display.setHeight(1.8),
        fontWeight: '500',
        color: '#325962',
        marginLeft: 5,
    },
    deliveryPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryPriceText: {
        fontSize: Display.setHeight(1.8),
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
        fontSize: Display.setHeight(1.4),
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
        fontSize: Display.setHeight(1.4),
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
        borderRadius: Display.setHeight(1.2),
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
        borderRadius: Display.setHeight(2.7),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: Display.setHeight(1.2),
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: Display.setHeight(1.6),
        color: '#325962',
        fontWeight: '500',
    },
    commentText: {
        fontSize: Display.setHeight(1.4),
        color: '#000',
        fontWeight: '400',
    },
    itemAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#f1f1f1",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: Display.setHeight(1),
    },
    itemCountText: {
        color: '#325962',
        fontSize: Display.setHeight(2.2),
        lineHeight: 14 * 1.4,
        marginHorizontal: 8,
    },
});
