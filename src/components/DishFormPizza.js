import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, FlatList } from 'react-native';
import { Button } from '@react-native-material/core';
import { FormControl, Radio, Checkbox, WarningOutlineIcon, NativeBaseProvider, extendTheme } from 'native-base';
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Display } from '../utils';
import Separator from './Separator';

const { width, height } = Dimensions.get('window');

const DishFormPizza = ({ dish, extras, dips, onSizeChange, onToppingsChange, onDippingsChange }) => {

    const [value, setValue] = useState("Normal");

    const [valid, setValid] = useState(true);

    const sortedPrices = [...dish].sort((a, b) => (a.Description === "Normal" ? -1 : 1));

    ////////////////// Cart Management //////////////////

    useEffect(() => {
        onSizeChange(value);
    }, [value]);

    // useEffect(() => {
    //     onDippingsChange(selectedDips);
    // }, [selectedDips]);

    // useEffect(() => {
    //     onToppingsChange(selectedExtras);
    // }, [selectedExtras]);

    useEffect(() => {
        console.log("Sending selectedDips to parent:", selectedDips);
        onDippingsChange(selectedDips);
    }, [selectedDips]);
    
    useEffect(() => {
        console.log("Sending selectedExtras to parent:", selectedExtras);
        onToppingsChange(selectedExtras);
    }, [selectedExtras]);
    

    ////////////////// Extra Management //////////////////

    // const initialExtrasState = extras.reduce((acc, extra) => {
    //     acc[extra.Name] = false; // Using extra.Name instead of extra.name
    //     return acc;
    // }, {});
    const initialExtrasState = extras.reduce((acc, extra) => {
        // console.log("Initial Extras State - Extra:", extra);
        acc[extra.Name] = false;
        return acc;
    }, {});

    const [selectedExtras, setSelectedExtras] = useState(initialExtrasState);

    // const handleExtraToggle = (extraName) => {
    //     console.log("Extra toggled:", extraName); // Add this
    //     setSelectedExtras(prevState => ({
    //         ...prevState,
    //         [extraName]: !prevState[extraName]
    //     }));
    // };

    const handleExtraToggle = (extraName) => {
        // console.log("Toggling Extra:", extraName);
        setSelectedExtras(prevState => {
            // console.log("Previous Extra State:", prevState);
            return {
                ...prevState,
                [extraName]: !prevState[extraName]
            };
        });
    };

    const renderItemExtras = ({ item: extra }) => {

        const price = (extra) => {
            if (value === "") {
                return extra.Prices.find(p => p.Description === "Price32").Price;
            } else if (value === "Normal") {
                return extra.Prices.find(p => p.Description === "Price32").Price;
            } else if (value === "Party") {
                return extra.Prices.find(p => p.Description === "Price48").Price;
            }
        };

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
        // console.log("Initial Dips State - Dip:", dip);
        acc[dip.Name] = false;
        return acc;
    }, {});

    const [selectedDips, setSelectedDips] = useState(initialDipsState);

    // const handleDipToggle = (dipName) => {
    //     setSelectedDips(prevState => ({
    //         ...prevState,
    //         [dipName]: !prevState[dipName]
    //     }));
    // };

    const handleDipToggle = (dipName) => {
        // console.log("Toggling Dip:", dipName);
        setSelectedDips(prevState => {
            // console.log("Previous Dip State:", prevState);
            return {
                ...prevState,
                [dipName]: !prevState[dipName]
            };
        });
    };

    const renderItemDips = ({ item: dip }) => {

        const price = (dip) => {
            if (value === "") {
                return dip.Prices.find(p => p.Description === "PriceSm").Price;
            } else if (value === "Normal") {
                return dip.Prices.find(p => p.Description === "PriceSm").Price;
            } else if (value === "Party") {
                return dip.Prices.find(p => p.Description === "PriceXl").Price;
            }
        };

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
                    value={dip.Name}
                    isChecked={selectedDips[dip.Name]}
                    onChange={() => handleDipToggle(dip.Name)}
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
                    >{dip.Name}</Text>
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
                            {sortedPrices.map((item, index) => (
                                <TouchableOpacity
                                    key={index.toString()}
                                    onPress={() => {
                                        setValue(item.Description)
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
                                        <Radio value={item.Description} size="lg" accessibilityLabel={`${item.Description}`}
                                            _checked={{ backgroundColor: '#324859', color: '#325964' }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: '600',
                                                    marginTop: Display.setHeight(0.5),
                                                    marginLeft: 10,
                                                }}
                                            >{item.Description}</Text>
                                        </Radio>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '600',
                                            marginTop: Display.setHeight(0.5),
                                        }}
                                    >€{item.Price}</Text>
                                </TouchableOpacity>
                            ))}
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
                                    keyExtractor={(_, index) => index.toString()}
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
                                    keyExtractor={(_, index) => index.toString()}
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