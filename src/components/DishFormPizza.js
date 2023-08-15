import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, FlatList } from 'react-native';
import { Button } from '@react-native-material/core';
import { FormControl, Radio, Checkbox, WarningOutlineIcon, NativeBaseProvider, extendTheme } from 'native-base';
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Display } from '../utils';
import Separator from './Separator';

const { width, height } = Dimensions.get('window');

const DishFormPizza = ({ dish, extras, dips }) => {

    const [value, setValue] = useState("32cm");

    const [valid, setValid] = useState(true);

    ////////////////// Extra Management //////////////////

    const initialExtrasState = extras.reduce((acc, extra) => {
        acc[extra.name] = false;
        return acc;
    }, {});

    const [selectedExtras, setSelectedExtras] = useState(initialExtrasState);

    console.log(selectedExtras)

    const handleExtraToggle = (extraName) => {
        setSelectedExtras(prevState => ({
            ...prevState,
            [extraName]: !prevState[extraName]
        }));
    };

    const renderItemExtras = ({ item: extra }) => {

        const price = (extra) => {
            if (value === "") {
                return extra.price32
            } else {
                if (value === "32cm") {
                    return extra.price32
                } else if (value === "48cm") {
                    return extra.price48
                }
            }
        }

        return (
            <View
                style={{
                    width: width * 0.90,
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    margin: Display.setHeight(1),
                }}
            >
                <Checkbox
                    value={extra.Name}
                    isChecked={selectedExtras[extra.Name]}
                    onChange={() => handleExtraToggle(extra.Name)}
                    size={'lg'}
                    style={{
                        borderRadius: "50%",
                    }}
                    _checked={{ backgroundColor: '#324859' }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginTop: Display.setHeight(0.5),
                            marginLeft: 10,
                        }}
                    >{extra.Name}</Text>
                </Checkbox>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        marginTop: Display.setHeight(0.5),
                    }}
                >€{price(extra)}</Text>
            </View>
        );
    };

    ////////////////// Dip Management //////////////////

    const initialDipsState = dips.reduce((acc, dip) => {
        acc[dip.name] = false;
        return acc;
    }, {});

    const [selectedDips, setSelectedDips] = useState(initialDipsState);

    console.log(selectedDips)

    const handleDipToggle = (dipName) => {
        setSelectedDips(prevState => ({
            ...prevState,
            [dipName]: !prevState[dipName]
        }));
    };

    const renderItemDips = ({ item: dip }) => {

        const price = (dip) => {
            if (value === "") {
                return dip.price32
            } else {
                if (value === "32cm") {
                    return dip.price32
                } else if (value === "48cm") {
                    return dip.price48
                }
            }
        }

        return (
            <View
                style={{
                    width: width * 0.90,
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    margin: Display.setHeight(1),
                }}
            >
                <Checkbox
                    value={dip.name}
                    isChecked={selectedDips[dip.name]}
                    onChange={() => handleDipToggle(dip.name)}
                    size={'lg'}
                    style={{
                        borderRadius: "50%",
                    }}
                    _checked={{ backgroundColor: '#324859' }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginTop: Display.setHeight(0.5),
                            marginLeft: 10,
                        }}
                    >{dip.name}</Text>
                </Checkbox>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        marginTop: Display.setHeight(0.5),
                    }}
                >€{price(dip)}</Text>
            </View>
        );
    };

    return (
        <View
            style={{
                width,
                height: Display.setHeight(110),
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: 10,
            }}
        >
            <View
                style={{
                    alignSelf: 'center',
                    margin: Display.setHeight(1)
                }}
            >
                <NativeBaseProvider>
                    <FormControl>
                        <View
                            style={{
                                alignSelf: 'center',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <View
                                style={{
                                    width: width * 0.90,
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    margin: Display.setHeight(1)
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >Please choose a size</Text>
                                <View
                                    style={{
                                        width: Display.setHeight(9),
                                        height: Display.setHeight(3),
                                        borderRadius: Display.setHeight(3),
                                        backgroundColor: '#FFAF51',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#325964',
                                        }}
                                    >Required</Text>
                                </View>
                            </View>
                            <Text
                                style={{
                                    marginLeft: Display.setHeight(1),
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >Select 1</Text>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    margin: Display.setHeight(2),
                                }}
                            >
                                <View
                                    style={{
                                        width: width * 0.91,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            color: '#325964'
                                        }}
                                    >Size</Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            color: '#325964'
                                        }}
                                    >Price</Text>
                                </View>
                            </View>
                        </View>
                        <Radio.Group
                            onChange={nextValue => {
                                setValue(nextValue);
                            }}
                            value={value}
                            accessibilityLabel="Pizza Size"
                            style={{
                                width,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setValue("32cm")
                                }}
                                style={{
                                    width: width * 0.90,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <View>
                                    <Radio value="32cm" size="lg" accessibilityLabel='32 centimeters'
                                        _checked={{ backgroundColor: '#324859', color: '#325964' }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: '600',
                                                marginTop: Display.setHeight(0.5),
                                                marginLeft: 10,
                                            }}
                                        >Normal (32 cm)</Text>
                                    </Radio>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        marginTop: Display.setHeight(0.5),
                                    }}
                                >€{dish ? dish.price32 : ''}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setValue("48cm")
                                }}
                                style={{
                                    width: width * 0.90,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <View>
                                    <Radio value="48cm" size="lg" accessibilityLabel='48 centimeters'
                                        _checked={{ backgroundColor: '#324859' }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: '600',
                                                marginTop: Display.setHeight(0.5),
                                                marginLeft: 10,
                                            }}
                                        >Party (48 cm)</Text>
                                    </Radio>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        marginTop: Display.setHeight(0.5),
                                    }}
                                >€{dish ? dish.price48 : ''}</Text>
                            </TouchableOpacity>
                        </Radio.Group>
                        <Separator width={width} height={Display.setHeight(0.1)} marginTop={10} />
                        <View
                            style={{
                                alignSelf: 'center',
                                margin: Display.setHeight(1),
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <View
                                style={{
                                    width: width * 0.90,
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    margin: Display.setHeight(1)
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >Please choose toppings</Text>
                                <View
                                    style={{
                                        width: Display.setHeight(9),
                                        height: Display.setHeight(3),
                                        borderRadius: Display.setHeight(3),
                                        backgroundColor: '#FFAF51',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#325964',
                                        }}
                                    >Optional</Text>
                                </View>
                            </View>
                            <Text
                                style={{
                                    marginLeft: Display.setHeight(1),
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >Select any</Text>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <View
                                    style={{
                                        width: width * 0.91,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            color: '#325964'
                                        }}
                                    >Topping</Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            color: '#325964'
                                        }}
                                    >Price</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <FlatList
                                    data={extras}
                                    keyExtractor={(item) => (item._id)}
                                    renderItem={renderItemExtras}
                                />
                            </View>
                        </View>
                        <Separator width={width} height={Display.setHeight(0.1)} />
                        <View
                            style={{
                                alignSelf: 'center',
                                margin: Display.setHeight(1),
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <View
                                style={{
                                    width: width * 0.91,
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >Please choose dips</Text>
                                <View
                                    style={{
                                        width: Display.setHeight(9),
                                        height: Display.setHeight(3),
                                        borderRadius: Display.setHeight(3),
                                        backgroundColor: '#FFAF51',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#325964',
                                        }}
                                    >Optional</Text>
                                </View>
                            </View>
                            <Text
                                style={{
                                    marginLeft: Display.setHeight(1),
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >Select any</Text>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <View
                                    style={{
                                        width: width * 0.90,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            color: '#325964'
                                        }}
                                    >Dip</Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            color: '#325964'
                                        }}
                                    >Price</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <FlatList
                                    data={dips}
                                    keyExtractor={(item) => (item._id)}
                                    renderItem={renderItemDips}
                                />
                            </View>
                        </View>
                    </FormControl>
                </NativeBaseProvider>
            </View>
            {/* <View
                style={{
                    alignSelf: 'center',
                    margin: Display.setHeight(1)
                }}
            >
                <NativeBaseProvider>
                    <Checkbox.Group onChange={setGroupValues} value={groupValues} accessibilityLabel="choose numbers">
                        <Checkbox value="one" my={2}>
                            <Text>UX Research</Text>
                        </Checkbox>
                        <Checkbox value="two">
                            <Text>UX Research</Text>
                        </Checkbox>
                    </Checkbox.Group>
                </NativeBaseProvider>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({

})

export default DishFormPizza;