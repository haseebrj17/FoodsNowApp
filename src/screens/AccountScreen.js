import { StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { Display } from '../utils';
import { SimpleLineIcons, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

const { width, height } = Dimensions.get('screen');

const color = "#325962";
const size = 24;

const accountData = [
    {
        "name": "Personal Detials",
        "navigator": "PersonalDetials",
        "iconname": <FontAwesome name="user" size={size} color={color} />
    },
    {
        "name": "Addresses",
        "navigator": "Addresses",
        "iconname": <Entypo name="address" size={size} color={color} />
    },
    {
        "name": "Schedules",
        "navigator": "Schedules",
        "iconname": <MaterialCommunityIcons name="calendar-clock" size={size} color={color} />
    },
    {
        "name": "Orders & Reordering",
        "navigator": "OrderReordering",
        "iconname": <FontAwesome5 name="truck" size={size} color={color} />
    },
    {
        "name": "Settings",
        "navigator": "Settings",
        "iconname": <FontAwesome name="gear" size={size} color={color} />
    },
    {
        "name": "More...",
        "navigator": "More",
        "iconname": <MaterialCommunityIcons name="more" size={size} color={color} />
    },
]

const AccountScreen = ({ navigation }) => {
    const [data, setData] = useState(accountData)

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
    )
}

export default AccountScreen

const styles = StyleSheet.create({})