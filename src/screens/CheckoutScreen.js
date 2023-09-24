import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Animated,
    SectionList,
} from "react-native";
import { Display } from "../utils";
import { MaterialIcons } from "@expo/vector-icons";
import { Separator } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAddresses } from "../actions/UserAddressAction";
import { StorageService } from "../services";
import {
    FormControl,
    Radio,
    WarningOutlineIcon,
    NativeBaseProvider,
    extendTheme,
    Center,
} from "native-base";
import { CheckBox } from "@rneui/base";
import TimePicker from "../components/TimePicker";
import Skeleton from "../components/Skeleton";
import format from "date-fns/format";
import Button from "../components/Button";
import Input from "../components/Input";

const { width, height } = Dimensions.get("screen");

const CheckoutScreen = ({ route, navigation }) => {
    const { checkoutData, cartData, grandTotal } = route?.params;

    const dispatch = useDispatch();

    useEffect(() => {
        const FetchAddresses = async () => {
            const Data = await StorageService.getUserData();
            const { Id } = JSON.parse(Data);
            setId(Id);
            const LocationData = await StorageService.getLocation();
            const FranchiseId = LocationData.FranchiseId
            setFranchiseId(FranchiseId)
        };

        FetchAddresses();
    });

    const [Id, setId] = useState(null);
    const [franchiseId, setFranchiseId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        if (Id) {
            dispatch(fetchUserAddresses(Id));
        } else {
            console.log("User Id not available");
        }
    }, [Id]);

    const { addresses, loadingAddress, error } = useSelector(
        (state) => state.addressState
    );

    const [inputs, setInputs] = useState({
        Instructions: '',
        Products: checkoutData,
    })

    useEffect(() => {
        // Update inputs whenever Id, selectedAddressId, franchiseId or deliveryDetails changes
        setInputs(prevState => ({
            ...prevState,
            CustomerId: Id,
            CustomerAddressId: selectedAddressId,
            FranchiseId: franchiseId,
            Time: deliveryDetails,
        }));

        console.log(inputs)
    }, [Id, selectedAddressId, franchiseId, deliveryDetails]);

    const initialTime = format(new Date(), "h:mm a");
    const [deliveryDetails, setDeliveryDetails] = useState({
        option: "now",
        time: initialTime,
    });
    const animationValue = useRef(new Animated.Value(0)).current;

    const handleCheckboxChange = (option) => {
        if (option === "now") {
            const currentTime = format(new Date(), "h:mm a");
            setDeliveryDetails((prev) => ({ ...prev, option, time: currentTime }));
        } else {
            setDeliveryDetails((prev) => ({ ...prev, option }));
        }

        setDeliveryDetails((prev) => ({ ...prev, option }));

        if (option === "scheduled") {
            Animated.timing(animationValue, {
                toValue: 50,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleTimeChange = (selectedTime) => {
        setDeliveryDetails((prev) => ({ ...prev, time: selectedTime }));
    };

    const handleOnchange = (text, input) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
        console.log(inputs)
    };

    useEffect(() => {
        const defaultAddress = addresses?.find((address) => address.IsDefault);
        if (defaultAddress) {
            setSelectedAddressId(defaultAddress.Id);
        }
    }, [addresses]);

    console.log(selectedAddressId, deliveryDetails);

    const onlinePaymentFormHeight = useRef(new Animated.Value(0)).current;

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);

        if (method === "online") {
            Animated.timing(onlinePaymentFormHeight, {
                toValue: 100,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(onlinePaymentFormHeight, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    };

    const RenderAddressItem = ({ item }) => {
        return (
            <>
                {loadingAddress ? (
                    <>
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
                                                width: "75%",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(3)}
                                                width={Display.setHeight(18)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(2)}
                                                width={Display.setHeight(27)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                width: "25%",
                                                alignItems: "center",
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
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                ) : (
                    <View
                        style={{
                            width: width,
                            height: Display.setHeight(10),
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: Display.setHeight(1),
                        }}>
                        <View
                            style={{
                                width: "90%",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f1f1f1",
                                borderRadius: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.4,
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowRadius: 6,
                            }}>
                            <View
                                style={{
                                    width: "90%",
                                    height: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "row",
                                }}>
                                <View
                                    style={{
                                        width: "85%",
                                        height: "100%",
                                        alignItems: "start",
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            color: "#325964",
                                            marginBottom: Display.setHeight(0.2),
                                        }}>
                                        {item.Tag}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "500",
                                            color: "#325964",
                                            marginBottom: Display.setHeight(0.1),
                                        }}>
                                        {item.StreetAddress} {item.House}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: "500",
                                            color: "#696969",
                                        }}>
                                        {item.District} {item.PostalCode}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: "15%",
                                        height: "100%",
                                        alignItems: "end",
                                        justifyContent: "center",
                                    }}>
                                    <CheckBox
                                        containerStyle={{
                                            backgroundColor: "#f1f1f1",
                                        }}
                                        iconType="material-community"
                                        checkedIcon="checkbox-outline"
                                        checkedColor="#325964"
                                        uncheckedColor="#696969"
                                        uncheckedIcon={"checkbox-blank-outline"}
                                        checked={selectedAddressId === item.Id}
                                        onPress={() => {
                                            if (selectedAddressId === item.Id) {
                                                setSelectedAddressId(null); // Uncheck if it's already checked
                                            } else {
                                                setSelectedAddressId(item.Id); // Set the new selected address ID
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </>
        );
    };

    const RenderItem = ({ item }) => {
        return (
            <>
                <View
                    style={{
                        width: width,
                        height: Display.setHeight(4),
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: Display.setHeight(1),
                    }}>
                    <View
                        style={{
                            width: "90%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row",
                        }}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#325964",
                                fontWeight: "bold",
                            }}>
                            {item.Product.Name} ({item.quantity}x)
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#325964",
                                fontWeight: "bold",
                            }}>
                            €{item.itemTotal}
                        </Text>
                    </View>
                    <Separator
                        width={"100%"}
                        color={"#d9d9d9"}
                        height={Display.setHeight(0.1)}
                    />
                </View>
            </>
        );
    };

    const SectionFooter = ({ section }) => {
        if (section.title === "Addresses") {
            return (
                // <View style={{
                //     width: width,
                //     height: Display.setHeight(4),
                //     backgroundColor: 'lightgray',
                //     alignItems: 'center',
                //     justifyContent: 'center'
                // }}>
                //     <Text>Footer for {section.title}</Text>
                // </View>
                <Separator
                    width={"100%"}
                    color={"#d9d9d9"}
                    marginTop={Display.setHeight(2)}
                    height={Display.setHeight(0.1)}
                />
            );
        } else if (section.title === "My Cart") {
            return (
                <View
                    style={{
                        width,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <View
                        style={{
                            width: "90%",
                            height: Display.setHeight(4),
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row",
                        }}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: "#325964",
                                fontWeight: "bold",
                            }}>
                            Grand Total
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                color: "#325964",
                                fontWeight: "bold",
                            }}>
                            €{grandTotal}
                        </Text>
                    </View>
                    <Separator
                        width={"100%"}
                        color={"#d9d9d9"}
                        height={Display.setHeight(0.1)}
                    />
                </View>
            );
        }
    };

    const sectionsData = [
        { title: "My Cart", data: cartData ? cartData : [] },
        { title: "Addresses", data: addresses ? addresses : [] },
    ];

    return (
        <View
            style={{
                width,
                height,
                backgroundColor: "#fff",
            }}>
            <SectionList
                sections={sectionsData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, section }) =>
                    section.title === "My Cart" ? (
                        <RenderItem item={item} />
                    ) : (
                        <RenderAddressItem item={item} />
                    )
                }
                renderSectionHeader={({ section: { title } }) => (
                    <Text
                        style={{
                            fontSize: 20,
                            color: "#325964",
                            fontWeight: "bold",
                            margin: Display.setHeight(2),
                        }}>
                        {title}
                    </Text>
                )}
                ListHeaderComponent={
                    <View
                        style={{
                            width,
                            height: Display.setHeight(12),
                            backgroundColor: "#F4E4CD",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                } else {
                                    navigation.navigate("Account");
                                }
                            }}
                            style={{
                                position: "absolute",
                                left: "1%",
                                top: "10%",
                                marginTop: 35,
                                zIndex: 999,
                            }}>
                            <MaterialIcons
                                name="keyboard-arrow-left"
                                size={50}
                                color="#325962"
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                marginTop: 35,
                                color: "#325962",
                            }}>
                            Checkout
                        </Text>
                    </View>
                }
                renderSectionFooter={({ section }) => (
                    <SectionFooter section={section} />
                )}
                ListFooterComponent={
                    <>
                        <View
                            style={{
                                width,
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <View
                                style={{
                                    width,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <View
                                    style={{
                                        width: width,
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color: "#325964",
                                            fontWeight: "bold",
                                            marginTop: Display.setHeight(2),
                                            marginLeft: Display.setHeight(2),
                                        }}>
                                        Delivery Instructions
                                    </Text>
                                    <View
                                        style={{
                                            width: width * 0.9,
                                            alignSelf: 'center',
                                        }}
                                    >
                                        <Input
                                            onChangeText={text => handleOnchange(text, 'Instructions')}
                                            placeholder="Note to rider - e.g. landmark"
                                        />
                                    </View>
                                    <Separator
                                        width={"100%"}
                                        color={"#d9d9d9"}
                                        height={Display.setHeight(0.1)}
                                        marginTop={Display.setHeight(1)}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width,
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <View
                                style={{
                                    width,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <View
                                    style={{
                                        width: width,
                                        justifyContent: "center",
                                        margin: Display.setHeight(1),
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color: "#325964",
                                            fontWeight: "bold",
                                            margin: Display.setHeight(2),
                                        }}>
                                        Delivery Options
                                    </Text>
                                    <View style={{ flex: 1 }}>
                                        <NativeBaseProvider>
                                            <View
                                                style={{
                                                    paddingLeft: Display.setHeight(2),
                                                    paddingRight: Display.setHeight(2),
                                                    paddingTop: Display.setHeight(2),
                                                }}>
                                                <Radio.Group
                                                    onChange={handleCheckboxChange}
                                                    value={deliveryDetails.option}
                                                    accessibilityLabel="Delivery Option"
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}>
                                                    <TouchableOpacity
                                                        onPress={() => handleCheckboxChange("now")}
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                        }}>
                                                        <Radio
                                                            value="now"
                                                            size="lg"
                                                            accessibilityLabel="Deliver Now"
                                                            _checked={{
                                                                backgroundColor: "#325964",
                                                                color: "#325964",
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontWeight: "600",
                                                                marginLeft: 10,
                                                                color: "#325964",
                                                            }}>
                                                            Deliver Now
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => handleCheckboxChange("scheduled")}
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                        }}>
                                                        <Radio
                                                            value="scheduled"
                                                            size="lg"
                                                            accessibilityLabel="Schedule Delivery"
                                                            _checked={{
                                                                backgroundColor: "#325964",
                                                                color: "#325964",
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontWeight: "600",
                                                                marginLeft: 10,
                                                                color: "#325964",
                                                            }}>
                                                            Schedule Delivery
                                                        </Text>
                                                    </TouchableOpacity>
                                                </Radio.Group>
                                            </View>
                                            <Animated.View
                                                style={{
                                                    height: animationValue,
                                                    overflow: "hidden",
                                                    marginTop: Display.setHeight(1),
                                                }}>
                                                <TimePicker onTimeChange={handleTimeChange} />
                                            </Animated.View>
                                            <Separator
                                                width={"100%"}
                                                color={"#d9d9d9"}
                                                height={Display.setHeight(0.1)}
                                                marginTop={Display.setHeight(1)}
                                            />
                                        </NativeBaseProvider>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <View
                                style={{
                                    width,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <View
                                    style={{
                                        width: width,
                                        justifyContent: "center",
                                        margin: Display.setHeight(1),
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color: "#325964",
                                            fontWeight: "bold",
                                            margin: Display.setHeight(2),
                                        }}>
                                        Payment Options
                                    </Text>
                                    <View style={{ flex: 1 }}>
                                        <NativeBaseProvider>
                                            <View
                                                style={{
                                                    paddingLeft: Display.setHeight(2),
                                                    paddingRight: Display.setHeight(2),
                                                    paddingTop: Display.setHeight(2),
                                                }}>
                                                <Radio.Group
                                                    onChange={handlePaymentMethodChange}
                                                    value={paymentMethod}
                                                    accessibilityLabel="Payment Method"
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}>
                                                    <TouchableOpacity
                                                        onPress={() => handlePaymentMethodChange("cash")}
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                        }}>
                                                        <Radio
                                                            value="cash"
                                                            size="lg"
                                                            accessibilityLabel="Cash on Delivery"
                                                            _checked={{
                                                                backgroundColor: "#325964",
                                                                color: "#325964",
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontWeight: "600",
                                                                marginLeft: 10,
                                                                color: "#325964",
                                                            }}>
                                                            Cash on Delivery
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => handlePaymentMethodChange("online")}
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                        }}>
                                                        <Radio
                                                            value="online"
                                                            size="lg"
                                                            accessibilityLabel="Online Payment"
                                                            _checked={{
                                                                backgroundColor: "#325964",
                                                                color: "#325964",
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontWeight: "600",
                                                                marginLeft: 10,
                                                                color: "#325964",
                                                            }}>
                                                            Online Payment
                                                        </Text>
                                                    </TouchableOpacity>
                                                </Radio.Group>
                                            </View>
                                            <Animated.View
                                                style={{
                                                    height: onlinePaymentFormHeight,
                                                    overflow: "hidden",
                                                    marginTop: Display.setHeight(1),
                                                }}>
                                                <View
                                                    style={{
                                                        backgroundColor: "#f1f1f1",
                                                        height: 100,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}>
                                                    <Text style={{
                                                        color: "#000",
                                                        fontSize: 16,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        We will be launching this feature soon
                                                    </Text>
                                                </View>
                                            </Animated.View>
                                            <Separator
                                                width={"100%"}
                                                color={"#d9d9d9"}
                                                height={Display.setHeight(0.1)}
                                                marginTop={Display.setHeight(1)}
                                            />
                                        </NativeBaseProvider>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width: width * 0.8,
                                alignSelf: 'center',
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: Display.setHeight(1),
                                marginBottom: Display.setHeight(5)
                            }}
                        >
                            <Button
                                title={'Place Order'}
                                onPress={() => handleOrder}
                            />
                        </View>
                    </>
                }
            />
        </View>
    );
};

export default CheckoutScreen;