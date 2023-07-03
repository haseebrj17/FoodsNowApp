import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@react-native-material/core';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window')

const AddToCartModal = forwardRef((props, ref) => {
    const modalRef = useRef();

    const dish = props.dish
    console.log(dish)

    useImperativeHandle(ref, () => ({
        present: () => {
            modalRef.current.present();
        },
    }));

    const handleAddToCart = () => {
        console.log('Adding to cart');
    };

    const snapPoints = ["70%", "80%"]

    const ListPrices = () => {
        if (dish.restaurant === 'come a napoli') {
            return <Text style={styles.SubTextPrice}>€{dish.price32}</Text>
        }
        else {
            return <Text style={[styles.SubTextPrice, { marginTop: 5 }]}>€{dish.price}</Text>
        }
    }

    const DeliveryPrice = () => {
        if (dish.price > 20) {
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
        > € 10</Text></View>
    }

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            dismissOnPanDown={true}
            enableOverDrag
            backgroundStyle={{
                borderRadius: 30
            }}
            animateOnMount={true}
            handleStyle={{
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 5,
            }}
            handleIndicatorStyle={{ backgroundColor: '#f1f1f1' }}
        >
            <View style={styles.contentContainer}>
                <Image
                    source={dish ? dish.image : ''}
                    style={{
                        width: "100%",
                        height: undefined,
                        resizeMode: "cover",
                        aspectRatio: 166 / 115,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}
                />
                <View
                    style={{
                        width: "100%",
                        height: "60%",
                        position: 'relative',
                        top: '-5%',
                        backgroundColor: "#f1f1f1",
                        borderRadius: 30
                    }}
                >
                    <View
                        style={{
                            width: "88%",
                            height: "10%",
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            margin: 15,
                        }}
                    >
                        <Text style={{
                            fontSize: 28,
                            color: "#325962",
                            fontWeight: 'bold',
                        }}>{dish ? dish.name : ''}</Text>
                        <ListPrices />
                    </View>
                    <View
                        style={{
                            width: "88%",
                            height: "10%",
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            margin: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome name="star" size={22} color="#FFAF51" />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325962'
                                }}
                            > {dish ? dish.review : ''}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <MaterialCommunityIcons name="clock-fast" size={24} color="#325962" />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325962'
                                }}
                            > {dish ? dish.deliverytime : ''}
                            </Text>
                        </View>
                        <DeliveryPrice />
                    </View>
                    <Button
                        // onPress={() => handleOpenModal(dishes)}
                        title="Add to Cart"
                        color="#FFAF51"
                        titleStyle={{ color: "#325962", fontSize: 12, fontWeight: 800 }}
                        uppercase={false}
                        contentContainerStyle={styles.Button}
                        style={{
                            width: '90%',
                            marginTop: 8,
                            alignSelf: 'center',
                        }}
                    />
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

});
