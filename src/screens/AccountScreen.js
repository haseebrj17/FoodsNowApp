import { StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { Display } from '../utils';
import { SimpleLineIcons, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { Button } from "@react-native-material/core";

const { width, height } = Dimensions.get('screen');

const color = "#325962";
const size = 24;

const accountData = [
    {
        "name": "Personal Details",
        "navigator": "PersonalDetials",
        "iconname": <FontAwesome name="user" size={size} color={color} />
    },
    {
        "name": "Addresses",
        "navigator": "Addresses",
        "iconname": <Entypo name="address" size={size} color={color} />
    },
    // {
    //     "name": "Schedules",
    //     "navigator": "Schedules",
    //     "iconname": <MaterialCommunityIcons name="calendar-clock" size={size} color={color} />
    // },
    {
        "name": "Orders",
        "navigator": "OrderReordering",
        "iconname": <FontAwesome5 name="truck" size={size} color={color} />
    }
    // {
    //     "name": "Settings",
    //     "navigator": "Settings",
    //     "iconname": <FontAwesome name="gear" size={size} color={color} />
    // },
    // {
    //     "name": "More...",
    //     "navigator": "More",
    //     "iconname": <MaterialCommunityIcons name="more" size={size} color={color} />
    // },
]

const AccountScreen = ({ navigation }) => {
    const [data, setData] = useState(accountData)

    const { token } = useSelector(
        (state) => state.generalState
    )

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => navigation.navigate('AccountNavigator', { screen: `${item.navigator}` })}
            >
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(6),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: '#325964',
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '10%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 10
                            }}
                        >{item.iconname}</View>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{item.name}</Text>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                right: "5%",
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <SimpleLineIcons
                                name="arrow-right"
                                size={20}
                                color="#325962"
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            {
                token === null || token === '' ? (
                    <>
                        <View
                            style={{
                                width,
                                height,
                            }}
                        >
                            <View
                                style={{
                                    width,
                                    height: Display.setHeight(12),
                                    backgroundColor: '#F4E4CD',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 35,
                                        color: "#325962"
                                    }}
                                >Account</Text>
                            </View>
                            <View
                                style={{
                                    width,
                                    height: Display.setHeight(8),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: Display.setHeight(2)
                                }}
                            >
                                <View
                                    style={{
                                        width: '90%',
                                        height: '100%',
                                        backgroundColor: '#f1f1f1',
                                        borderRadius: Display.setHeight(1.2),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: '90%',
                                            height: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: 'bold',
                                                    color: "#FFAF51",
                                                    marginBottom: Display.setHeight(0.5)
                                                }}
                                            >Not a user yet</Text>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: "#325964"
                                                }}
                                            >Sign In or Register</Text>
                                        </View>
                                        <Button
                                            title="Sign Up"
                                            onPress={() => navigation.navigate('Registration')}
                                            color="#FFAF51"
                                            uppercase={false}
                                            titleStyle={{ color: "#325962" }}
                                            contentContainerStyle={[
                                                styles.ButtonSignUp,
                                                {
                                                    shadowOffset: {
                                                        width: 2,
                                                        height: 5,
                                                    },
                                                    shadowColor: "#000",
                                                    shadowOpacity: 0.4,
                                                    shadowRadius: 10,
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        <View
                            style={{
                                width,
                                height,
                            }}
                        >
                            <View
                                style={{
                                    width,
                                    height: Display.setHeight(12),
                                    backgroundColor: '#F4E4CD',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 35,
                                        color: "#325962"
                                    }}
                                >Profile</Text>
                            </View>
                            <FlatList
                                style={{
                                    marginTop: 20,
                                    width,
                                }}
                                data={data}
                                keyExtractor={(item) => item._id || Math.random().toString()}
                                renderItem={renderItem}
                            />
                        </View>
                    </>
                )}
        </>
    )
}

export default AccountScreen

const styles = StyleSheet.create({})