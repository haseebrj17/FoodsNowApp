import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { Extras, Dips, BrandCard } from '../assets/constants/Slider';
import { useFonts } from 'expo-font';
import { Button } from "@react-native-material/core";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Display, transformImageUrl } from '../utils';
import Skeleton from './Skeleton';
import { useDispatch, useSelector } from "react-redux";

const column = 4;

const { width, height } = Dimensions.get('screen');

const formatData = (categories, column) => {
    const numOfFullRow = Math.floor(categories.length / column)
    let numOfElementsLastRow = categories.length - (numOfFullRow * column);
    while (numOfElementsLastRow !== column && numOfElementsLastRow !== 0) {
        categories.push({ key: `balnk-${numOfElementsLastRow}`, empty: true });
        numOfElementsLastRow = numOfElementsLastRow + 1;
    }
    return categories;
}

const CategoriesHome = ({ category, deliveryParams }) => {

    console.log(category);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [scroll, setScroll] = useState(false);
    const navigation = useNavigation();
    const [categories, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setImagesLoaded(prevCount => prevCount + 1);
        if (imagesLoaded + 1 === categories.length) {
            setLoading(false); // Assuming you have a setLoading function somewhere
        }
    };

    useEffect(() => {
        if (category) {
            console.log(category);
            setCategory(category);
            setLoading(false);
        }
    }, [category]);

    const ConditionalRendering = ({ categories, deliveryParams }) => {
        if (categories?.length > 8) {
            return (
                <Button
                    onPress={() => navigation.navigate('HomeNavigator', {
                        screen: 'Category',
                        params: {
                            category: categories,
                            deliveryParams: deliveryParams
                        }
                    })
                    }
                    title={custonTitle}
                    style={styles.Button}
                    color="rgba(50, 89, 98, 0.2)"
                    disableElevation={true}
                    uppercase={false}
                    leading
                />
            );
        } else {
            return null;
        }
    };

    const custonTitle = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        color: "#325962",
                        fontSize: 12,
                        fontWeight: "600",
                        letterSpacing: 0.2,
                    }}
                >Alle Kategorien Erkunden</Text>
            </View>
        )
    }

    renderItem = ({ item: category }) => {
        if (category.empty === true) {
            return <View style={[styles.BrandCard, styles.itemInvisible]} />;
        }
        const thumbnailSource = category.Thumbnail;
        let imgThumbAspect = 1;
        let imgThumbHeight = 1;
        let imgThumbWidth = 1;
        Image.getSize(
            thumbnailSource,
            (width, height) => {
                if (width && height) {
                    imgThumbWidth = width;
                    imgThumbHeight = height;
                    imgThumbAspect = width / height;
                }
            },
            (error) => {
                console.error(`Couldn't get the image size, check the URI: ${error}`);
            }
        );
        return (
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('HomeNavigator', {
                    screen: 'Details',
                    params: {
                        brand: category,
                        deliveryParams: deliveryParams
                    }
                })
                }
            >
                <View
                    style={{
                        width: Display.setWidth(18),
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                        margin: Display.setHeight(1),
                        height: Display.setWidth(18),
                        marginTop: Display.setHeight(1.8),
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Image
                            source={{ uri: transformImageUrl({ originalUrl: category.Thumbnail, size: '/tr:w-100' }) }}
                            onLoad={handleImageLoad}
                            style={{
                                aspectRatio: imgThumbAspect,
                                borderRadius: Display.setHeight(50),
                            }}
                        />
                    </View>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: Display.setHeight(0.5),
                        }}
                    >
                        <Text
                            style={styles.itemText}
                        >{category.Name}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View>
            {loading ? (
                <View>
                    <Skeleton height={Display.setHeight(2.5)} width={Display.setHeight(35)} style={{ alignSelf: 'center', marginBottom: 5, marginTop: 10, borderRadius: 6 }} />
                    <View
                        style={{
                            width: '100%',
                            height: Display.setHeight(39),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(10)} width={Display.setHeight(10)} style={{ margin: 10, borderRadius: '50%' }} />
                        </View>
                        <View>
                            <Skeleton height={50} width={240} style={{ margin: 10, borderRadius: 12 }} />
                        </View>
                    </View>
                </View>
            ) : (
                <>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            width: width * 0.9,
                        }}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: '#325962',
                            fontWeight: "bold",
                            alignSelf: "center",
                            marginTop: Display.setHeight(2),
                        }}>Vielfältige Auswahl an Kategorien!</Text>
                        <FlatList
                            contentContainerStyle={{
                                marginBottom: Display.setHeight(1),
                                marginTop: Display.setHeight(1),
                            }}
                            data={categories ? formatData(categories.slice(0, 8), column) : null}
                            renderItem={renderItem}
                            numColumns={column}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <ConditionalRendering categories={categories} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    BrandCard: {
        width: "30%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        margin: 40,
        height: Dimensions.get('window').width * 0.2,
    },
    ImageBrandCard: {
        width: 102.08,
        height: 115,
        resizeMode: "cover",
        aspectRatio: 1021 / 1151,
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
        width: width * 0.27,
        margin: Display.setHeight(1),
        height: width * 0.35,
    },
    textBox: {
        width: 102,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
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
    Button: {
        width: '60%',
        height: Display.setHeight(5),
        alignSelf: "center",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 0.4)"
    },
})

export default CategoriesHome;