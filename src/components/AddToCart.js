import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@react-native-material/core';
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FlatList, NativeBaseProvider } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window')

const AddToCartModal = forwardRef((props, ref) => {
    const modalRef = useRef();

    const dish = props.dish

    const [review, setReview] = useState(dish?.reviewComment);

    useEffect(() => {
        setReview(dish?.reviewComment);
    }, [dish]);

    console.log(review)

    useImperativeHandle(ref, () => ({
        present: () => {
            modalRef.current.present();
        },
    }));

    const handleAddToCart = () => {
        console.log('Adding to cart');
    };

    const snapPoints = ["100%"]

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'details', title: 'Details' },
        { key: 'reviews', title: 'Reviews' },
    ]);

    const DetailsRoute = () => (
        <View style={[styles.scene, { backgroundColor: 'white' }]} >
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#000',
                    marginLeft: 10,
                    marginTop: 10,
                }}
            >Description</Text>
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: 10,
                    marginTop: 5,
                    marginBottom: 10,
                }}
            >
                {dish.description}
            </Text>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#000',
                    marginLeft: 10,
                    marginTop: 10,
                }}
            >Ingredients</Text>
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: 10,
                    marginTop: 5,
                }}
            >
                {dish.ingredient}
            </Text>
        </View>
    );

    // const renderComment = ({ item: comment }) => (
    //     <View style={{
    //         width: '90%',
    //         height: 60,
    //         backgroundColor: '#f1f1f1',
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         justifyContent: 'flex-start',
    //         alignSelf: 'center',
    //         borderRadius: 10,
    //         shadowColor: "#000",
    //         shadowOffset: {
    //             width: 0,
    //             height: 2,
    //         },
    //         shadowOpacity: 0.23,
    //         shadowRadius: 2.62,
    //         elevation: 4,
    //         marginBottom: 10,
    //         padding: 10,
    //     }}>
    //         <View
    //             style={{
    //                 width: 50,
    //                 height: 50,
    //                 borderRadius: "50%",
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 marginRight: 10,
    //                 backgroundColor: '#fff',
    //             }}
    //         >
    //             <Image source={comment.image} style={{ width: 40, height: 40, borderRadius: 10 }} />
    //         </View>
    //         <View>
    //             <Text
    //                 style={{
    //                     fontSize: 14,
    //                     color: '#325962',
    //                     fontWeight: '500'
    //                 }}
    //             >{comment.user}</Text>
    //             <Text
    //                 style={{
    //                     fontSize: 12,
    //                     color: '#000',
    //                     fontWeight: '400',
    //                 }}
    //             >{comment.comment}</Text>
    //         </View>
    //     </View>
    // )

    const [expanded, setExpanded] = useState(false);
    const renderComment = ({ item: comment }) => {

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
                    margin: 5,
                    padding: 10,
                }}
            >
                <View
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        backgroundColor: '#fff',
                    }}
                >
                    <Image
                        source={comment.image}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
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
                        {comment.user}
                    </Text>
                    <Text style={[{ fontSize: 12, color: '#000', fontWeight: '400' }, commentStyle]}>
                        {comment.comment}
                    </Text>
                </View>
            </View>
        );
    };


    const ReviewsRoute = () => (
        <NativeBaseProvider>
            <FlatList
                aria-expanded="false"
                data={review}
                renderItem={renderComment}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        </NativeBaseProvider>
    );

    const ListPrices = () => {
        if (dish.restaurant === 'come a napoli') {
            return <Text style={styles.SubTextPrice}>€{dish.price32}</Text>
        }
        else {
            return <Text style={[styles.SubTextPrice, { marginTop: 5 }]}>€{dish.price}</Text>
        }
    }

    const DeliveryPrice = () => {
        if (dish.price >= 20) {
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
                <Image
                    source={dish ? dish.image : ''}
                    style={styles.image}
                />
                <View style={styles.modalContent}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.dishName}>{dish ? dish.name : ''}</Text>
                        <ListPrices />
                    </View>
                    <View style={styles.reviewContainer}>
                        <View style={styles.reviewItem}>
                            <FontAwesome name="star" size={22} color="#FFAF51" />
                            <Text style={styles.reviewText}>{dish ? dish.review : ''} ({dish ? dish.reviewComment.length : ''})</Text>
                        </View>
                        <View style={styles.reviewItem}>
                            <MaterialCommunityIcons name="clock-fast" size={24} color="#325962" />
                            <Text style={styles.reviewText}>{dish ? dish.deliverytime : ''}</Text>
                        </View>
                        <DeliveryPrice />
                    </View>
                    <View style={styles.divider} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                width: "100%",
                                height: Dimensions.get('screen').height,
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
                                initialLayout={{ width: width, height: 400 }}
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
                            <View
                                style={{
                                    width: "100%",
                                    height: "50%",
                                    position: 'relative',
                                    // backgroundColor: "black",
                                }}
                            >
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.divider} />
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.itemAddContainer}>
                        <AntDesign
                            name="minus"
                            color='#FFAF51'
                            size={20}
                            style={{
                                marginRight: 10
                            }}
                        // onPress={() => removeFromCart(id)}
                        />
                        <Text style={styles.itemCountText}>0</Text>
                        <AntDesign
                            name="plus"
                            color='#FFAF51'
                            size={20}
                            style={{
                                marginLeft: 10
                            }}
                        // onPress={() => addToCart(id)}
                        />
                    </View>
                    <Button
                        title="Add to Cart"
                        color="#FFAF51"
                        titleStyle={styles.buttonTitle}
                        uppercase={false}
                        contentContainerStyle={styles.buttonContent}
                        onPress={handleAddToCart}
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
    buttonContainer: {
        width: '95%',
        backgroundColor: 'white',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        bottom: '3%',
        right: '2.5%',
    },
    buttonTitle: {
        color: '#325962',
        fontSize: 12,
        fontWeight: '800',
    },
    buttonContent: {
        width: '80%',
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
