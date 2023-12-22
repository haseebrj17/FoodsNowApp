import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import { StorageService } from '../services';
import { Display } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../actions/GetOrderAction';
import { FlatList } from 'react-native-gesture-handler';
import Skeleton from '../components/Skeleton';
import { Swipeable } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Ionicons, EvilIcons, Feather, SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import { getToken } from '../Store';
import { Separator } from '../components';

const { width, height } = Dimensions.get('screen');

const OrderReoderingScreen = ({ navigation }) => {

    const dispatch = useDispatch()

    const { order, loadingOrder, error } = useSelector(
        (state) => state.getOrderState
    )

    const token = useSelector(getToken);

    useEffect(() => {
        dispatch(fetchOrders(token))
    }, [])

    const rightSwipe = () => {
        return <TouchableOpacity
            style={{
                width: Display.setHeight(8),
                height: '100%'
            }}
        >
            <View
                style={{
                    width: Display.setHeight(8),
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFAF51',
                }}
            >
                <FontAwesome name="reorder" size={24} color="#325964" />
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#325964',
                        marginTop: 3
                    }}
                >Nachbestellung</Text>
            </View>
        </TouchableOpacity>
    }

    const renderItem = ({ item }) => {
        return (
            <Swipeable
                renderRightActions={rightSwipe}
            >
                    <View
                        style={{
                            width,
                            height: Display.setHeight(12),
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: width * 0.9,
                                height: Display.setHeight(10),
                                backgroundColor: '#fff',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}
                        >
                            <View
                                style={{
                                    width: '10%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: Display.setHeight(1)
                                }}
                            >
                                <MaterialCommunityIcons name="truck-outline" size={Display.setHeight(2.5)} color="#325964" />
                            </View>
                            <View
                                style={{
                                    width: '90%',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}
                            >
                                <View>
                                    {
                                        // Only display the first two products
                                        item?.Products?.slice(0, 2).map((i, index) => (
                                            <Text
                                                key={index}
                                                style={{
                                                    fontSize: Display.setHeight(1.6),
                                                    color: '#325964',
                                                    fontWeight: "bold",
                                                    marginVertical: Display.setHeight(0.5)
                                                }}
                                            >
                                                {i?.Name} x{i?.Quanity}
                                            </Text>
                                        ))
                                    }
                                    {
                                        item?.Products?.length > 2 && <Text
                                            style={{
                                                fontSize: Display.setHeight(1.6),
                                                fontWeight: "bold",
                                                color: '#696969'
                                            }}
                                        >...</Text>
                                    }
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.2),
                                            fontWeight: '400',
                                            color: '#696969'
                                        }}
                                    >
                                        {item?.Instructions}
                                    </Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.4),
                                            fontWeight: '400',
                                            color: '#696969'
                                        }}
                                    >Gesamtrechnung: {item.TotalBill}</Text>
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.4),
                                            fontWeight: '400',
                                            color: '#696969'
                                        }}
                                    >Artikel insgesamt: {item?.TotalItems}</Text>
                                </View>
                            </View>
                        </View>
                        <Separator width={Display.setWidth(95)} height={Display.setHeight(0.1)} color={'#D6DEE0'} alignSelf={'center'} />
                    </View>
            </Swipeable >
        )
    }

    return (
        <>
            {
                loadingOrder ? (
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width,
                            height
                        }}
                    >
                        <View
                            style={{
                                width,
                                height: height * 0.12,
                                backgroundColor: '#F4E4CD',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    } else {
                                        navigation.navigate('Account');
                                    }
                                }}
                                style={{
                                    position: "absolute",
                                    left: '1%',
                                    top: "10%",
                                    marginTop: 35,
                                    zIndex: 999,
                                }}
                            >
                                <MaterialIcons
                                    name="keyboard-arrow-left"
                                    size={50}
                                    color="#325962"
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    marginTop: 35,
                                    color: "#325962",
                                }}
                            >Bestellungen</Text>
                        </View>
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <View
                                style={{
                                    width: "90%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                }}>
                                <Skeleton
                                    height={Display.setHeight(10)}
                                    width={Display.setWidth(90)}
                                    style={{ margin: 10, borderRadius: 12 }}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        position: "absolute",
                                        left: "5%",
                                        top: "20%",
                                    }}>
                                    <View
                                        style={{
                                            padding: 4,
                                            flexDirection: "row",
                                            width: "100%",
                                        }}>
                                        <View
                                            style={{
                                                width: "10%",
                                                alignItems: "flex-start",
                                                justifyContent: "center",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2.5)}
                                                width={Display.setHeight(2.5)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                width: "75%",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2)}
                                                width={Display.setHeight(25)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1)}
                                                width={Display.setHeight(10)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1.6)}
                                                width={Display.setHeight(12)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "90%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                }}>
                                <Skeleton
                                    height={Display.setHeight(10)}
                                    width={Display.setWidth(90)}
                                    style={{ margin: 10, borderRadius: 12 }}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        position: "absolute",
                                        left: "5%",
                                        top: "20%",
                                    }}>
                                    <View
                                        style={{
                                            padding: 4,
                                            flexDirection: "row",
                                            width: "100%",
                                        }}>
                                        <View
                                            style={{
                                                width: "10%",
                                                alignItems: "flex-start",
                                                justifyContent: "center",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2.5)}
                                                width={Display.setHeight(2.5)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                width: "75%",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2)}
                                                width={Display.setHeight(25)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1)}
                                                width={Display.setHeight(10)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1.6)}
                                                width={Display.setHeight(12)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            width,
                            height,
                            backgroundColor: '#fff'
                        }}
                    >
                        <View
                            style={{
                                width,
                                height: height * 0.12,
                                backgroundColor: '#F4E4CD',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    } else {
                                        navigation.navigate('Account');
                                    }
                                }}
                                style={{
                                    position: "absolute",
                                    left: '1%',
                                    top: "10%",
                                    marginTop: 35,
                                    zIndex: 999,
                                }}
                            >
                                <MaterialIcons
                                    name="keyboard-arrow-left"
                                    size={50}
                                    color="#325962"
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    marginTop: 35,
                                    color: "#325962",
                                }}
                            >Bestellungen</Text>
                        </View>
                        <View
                            style={{
                                width,
                                height: height * (0.88)
                            }}
                        >
                            <FlatList
                                data={order}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                            />
                        </View>
                    </View>
                )}
        </>
    )
}

export default OrderReoderingScreen

const styles = StyleSheet.create({})