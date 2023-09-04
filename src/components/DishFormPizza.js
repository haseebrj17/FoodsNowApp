import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, FlatList } from 'react-native';
import { Button } from '@react-native-material/core';
import { FormControl, Radio, Checkbox, WarningOutlineIcon, NativeBaseProvider, extendTheme } from 'native-base';
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Display } from '../utils';
import Separator from './Separator';

const { width, height } = Dimensions.get('window');

const DishFormPizza = ({ dish, extras, dips, selectedSize, setSelectedSize, selectedExtras, setSelectedExtras, selectedDips, setSelectedDips, onSizeChange, onToppingsChange, onDippingsChange }) => {

    const [value, setValue] = useState("Normal");

    const [valid, setValid] = useState(true);

    const sortedPrices = [...dish.Prices].sort((a, b) => (a.Description === "Normal" ? -1 : 1));

    ////////////////// Cart Management //////////////////

    useEffect(() => {
        onSizeChange(value);
    }, [value]);

    useEffect(() => {
        console.log("Sending selectedDips to parent:", selectedDips);
        onDippingsChange(selectedDips);
    }, [selectedDips]);

    useEffect(() => {
        console.log("Sending selectedExtras to parent:", selectedExtras);
        onToppingsChange(selectedExtras);
    }, [selectedExtras]);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    ////////////////// Extra Management //////////////////

    const handleExtraToggle = (extraName, priceDescription) => {
        setSelectedExtras(prevState => {
            const newState = {
                ...prevState,
                [extraName]: {
                    Name: extraName,
                    selected: !prevState[extraName]?.selected,
                    priceDescription
                }
            };
            onToppingsChange(newState);
            return newState;
        });
    };

    const renderItemExtras = ({ item: extra }) => {

        const price = (extra) => {
            let description;
            if (value === "" || value === "Normal") {
                description = "Price32";
            } else if (value === "Party") {
                description = "Price48";
            }
            const priceValue = extra.Prices.find(p => p.Description === description).Price;
            return { value: priceValue, description };
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
                    isChecked={selectedExtras[extra.Name]?.selected}
                    onChange={() => handleExtraToggle(extra.Name, price(extra).description)}
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
                >€{price(extra).value}</Text>
            </View>
        );
    };

    ////////////////// Dip Management //////////////////

    const handleDipToggle = (dipName, priceDescription) => {
        setSelectedDips(prevState => {
            const newState = {
                ...prevState,
                [dipName]: {
                    Name: dipName,
                    selected: !prevState[dipName]?.selected,
                    priceDescription
                }
            };
            onDippingsChange(newState);
            return newState;
        });
    };    

    const renderItemDips = ({ item: dip }) => {

        const price = (dip) => {
            let description;
            if (value === "" || value === "Normal") {
                description = "PriceSm";
            } else if (["Party", "With Fries", "With Fries and Wings"].includes(value)) {
                description = "PriceXl";
            }
        
            const priceValue = dip.Prices.find(p => p.Description === description).Price;
        
            return {
                value: priceValue,
                description: description
            };
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
                    isChecked={selectedDips[dip.Name]?.selected}
                    onChange={() => handleDipToggle(dip.Name, price(dip).description)}
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
                >€{price(dip).value}</Text>
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
                        {
                            dish.Prices.length > 1 ? (
                                <>
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
                                </>
                            ) : (
                                <></>
                            )
                        }

                        {dish.showExtraTropping === true ? (
                            <>
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
                            </>
                        ) : (
                            <></>
                        )}
                        {dish.showExtraDipping === true ? (
                            <>
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
                            </>
                        ) : (
                            <></>
                        )}

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