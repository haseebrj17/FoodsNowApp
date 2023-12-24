import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, FlatList, Animated, Alert, Platform, TextInput } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons, EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { StorageService } from '../services';
import { Display } from '../utils';
import { Fonts } from '../assets/constants';
import Input from '../components/Input';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addUserAddress } from '../actions/UserAddressAction';
import { Separator, ToggleButton } from '../components';
import { getToken } from '../Store';

const { width, height } = Dimensions.get('screen');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0024;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const labelData = [
    {
        name: 'Heim',
        iconName: 'home-outline',
        tag: 'Heim'
    },
    {
        name: 'Arbeit',
        iconName: 'briefcase-outline',
        tag: 'Arbeit'
    },
    {
        name: 'Freund',
        iconName: 'person-outline',
        tag: 'Freund'
    },
    {
        name: "Andere",
        iconName: "add",
        tag: ''
    },
]

const CustomCallout = () => {
    return <TouchableOpacity
        style={{
            backgroundColor: '#325964',
            width: 100,
            height: 40,
        }}
    >
        <Text
            style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#f1f1f1'
            }}
        >Tippen Sie auf, um den Ort zu bearbeiten</Text>
    </TouchableOpacity>
}

const AddresseButton = ({ onpress }) => {
    return <Button
        name='locationButton'
        mode='contained'
        buttonColor='#FFAF51'
        textColor='#325964'
        uppercase={false}
        onPress={onpress}
        style={{
            width: width * 0.9,
            height: Display.setHeight(6),
            borderRadius: 12,
            margin: Display.setHeight(2)
        }}
        contentStyle={{
            width: '100%',
            height: '100%',
        }}
        labelStyle={{
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 1,
        }}
    >Adresse Hinzufügen</Button>
}

const LocationDetailScreen = ({ route, navigation }) => {
    const address = route.params.address;
    const selectedLocation = route.params.selectedLocation;

    console.log(address)

    const dispatch = useDispatch()

    const token = useSelector(getToken);

    const processAddressAddition = async (inputs, token) => {
        try {

            console.log(inputs)

            // Handle address addition
            const response = await dispatch(addUserAddress({ inputs: inputs, token }));
            if (response === "OK") {
                navigation.navigate('Main');
            } else {
                throw new Error('Unexpected response when adding address.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred while adding the address.');
            navigation.navigate('Main');
        }
    };

    const [userId, setUserId] = useState()
    const [region, setRegion] = useState(null);
    const [newAddress, setNewAddress] = useState(null);
    const [showCallout, setShowCallout] = useState(true);
    const [data, setData] = useState(labelData);
    const [inputHeight, setInputHeight] = useState(new Animated.Value(0));
    const [otherTagInput, setOtherTagInput] = useState("");
    const [color, setColor] = useState("#fff");
    const [HEIGHT, setHEIGHT] = useState(height * 1.05)
    const [clickedTag, setClickedTag] = useState(null);
    const scrollRef = useRef();

    const setStates = () => {
        setNewAddress(address);
        setRegion({
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        });
    }

    const [inputs, setInputs] = React.useState({
        StreetAddress: address?.street,
        House: address?.streetNumber,
        District: address?.district,
        UnitNumber: '',
        FloorNumber: '',
        Notes: '',
        Tag: '',
        IsDefault: false,
        Latitude: selectedLocation?.latitude,
        Longitude: selectedLocation?.longitude,
        CityName: address?.city,
        PostalCode: address?.postalCode,
        CountryName: address?.country,
        StateName: address?.region
    });

    const onToggleChange = (newState) => {
        setInputs(prevState => ({ ...prevState, IsDefault: newState }));
        console.log(inputs)
    };

    const handleOnchange = (text, input) => {
        if (input === 'Tag') {
            setOtherTagInput(text);
            if (text !== 'Heim' && text !== 'Arbeit' && text !== 'Freund') {
                setInputs(prevState => ({ ...prevState, [input]: text }));
            }
            return text
            setData(newData);
        } else {
            setInputs(prevState => ({ ...prevState, [input]: text }));
            console.log(inputs)
        }
    };

    const handleTagChange = (tag, name) => {
        if (tag === clickedTag) {
            if (tag === clickedTag && name === 'Andere') {
                Animated.timing(inputHeight, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
                setClickedTag(null);
                setInputs(prevState => ({ ...prevState, 'tag': '' }));
            } else {
                setClickedTag(null);
                setInputs(prevState => ({ ...prevState, 'tag': '' }));
            }
        } else {
            setClickedTag(tag);
            setInputs(prevState => ({ ...prevState, 'Tag': tag }));

            if (name === 'Andere') {
                Animated.timing(inputHeight, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
                setHEIGHT(height * 1.15);
                setTimeout(() => {
                    scrollRef.current.scrollToEnd({ animated: true });
                }, 100);
            } else {
                Animated.timing(inputHeight, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
        }
    };

    useEffect(() => {
        setStates();
    }, [])

    const mapRef = useRef()

    const renderItem = ({ item }) => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        handleTagChange(item.tag, item.name)
                    }}
                >
                    <View
                        style={{
                            width: Display.setHeight(8),
                            height: Display.setHeight(8),
                            borderRadius: Display.setHeight(4),
                            backgroundColor: item.tag === clickedTag ? "#FFAF51" : color,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.4,
                            shadowRadius: 5,
                            elevation: 10,
                            margin: Display.setHeight(1)
                        }}
                    >
                        <Ionicons name={item.iconName} size={28} color='#325964' />
                    </View>
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#325964'
                    }}
                >{item.name}</Text>
            </View>
        )
    }

    return (
        <View
            style={{
                height,
                width,
                alignItems: 'center',
                backgroundColor: '#fff'
            }}
        >
            <View
                style={{
                    width,
                    height: height * 0.43,
                    position: 'absolute',
                    top: '0%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    mapType={'mutedStandard'}
                    ref={mapRef}
                    showsUserLocation
                    initialRegion={region}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    onPress={() => setShowCallout(false)}
                >
                </MapView>
                <View
                    style={{
                        left: '44.6%',
                        position: 'absolute',
                        top: Display.setHeight(43) * 0.50,
                    }}
                >
                    <TouchableOpacity onPress={() => setShowCallout(true)}>
                        <MaterialIcons name="location-pin" size={Display.setHeight(5)} color="#FFAF51" />
                    </TouchableOpacity>
                    {showCallout &&
                        <View
                            style={{
                                position: 'absolute',
                                bottom: Display.setHeight(6.5),
                                right: Display.setHeight(-4),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                width: Display.setHeight(13),
                                height: Display.setHeight(4.5),
                                backgroundColor: '#325964',
                                borderRadius: 12,
                                padding: Display.setWidth(1)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    } else {
                                        navigation.navigate('Home');
                                    }
                                }}
                            >
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        left: '-5%',
                                        top: '90%',
                                        fontSize: Display.setHeight(1),
                                        fontWeight: '600',
                                        color: '#f1f1f1'
                                    }}
                                >Zum Bearbeiten tippen</Text>
                                <SimpleLineIcons
                                    name="arrow-right"
                                    size={Display.setHeight(1.5)}
                                    color="#f1f1f1"
                                    style={{
                                        position: "absolute",
                                        top: "60%",
                                        right: "-10%",
                                    }}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    top: '40%',
                                    width: 0,
                                    height: 0,
                                    backgroundColor: 'transparent',
                                    borderStyle: 'solid',
                                    borderLeftWidth: 10,
                                    borderRightWidth: 10,
                                    borderBottomWidth: 20,
                                    borderLeftColor: 'transparent',
                                    borderRightColor: 'transparent',
                                    borderBottomColor: '#325964',
                                    transform: [
                                        { rotate: '180deg' }
                                    ]
                                }}
                            />
                        </View>
                    }
                </View>
            </View>
            <ScrollView
                ref={scrollRef}
                style={{
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    width,
                    height: height * 0.5,
                    top: height * 0.39,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        height: HEIGHT,
                        marginBottom: Display.setHeight(15)
                    }}
                >
                    <View
                        style={{
                            width: width * 0.9,
                            height: Display.setHeight(8),
                            borderRadius: 10,
                            backgroundColor: "#f1f1f1",
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            padding: "2%",
                            marginTop: Display.setHeight(3)
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="info" size={20} color="#6d6d6d" />
                        </View>
                        <View
                            style={{
                                width: '90%',
                                marginLeft: 5
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.5),
                                    fontWeight: '400'
                                }}
                            >Ihr Fahrer liefert an die angegebene Adresse. Sie können Ihre schriftliche Adresse für mehr Genauigkeit bearbeiten.</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            width: width * 0.9,
                            marginTop: Display.setHeight(2)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: '#325964',
                            }}
                        >Eine neue Adresse hinzufügen</Text>
                    </View>
                    <View
                        style={{
                            width: width * 0.9,
                            height: Display.setHeight(6),
                            justifyContent: 'center',
                            flexDirection: 'row',
                            marginVertical: Display.setHeight(2)
                        }}
                    >
                        <View
                            style={{
                                width: '15%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <EvilIcons name="location" size={Display.setHeight(4)} color="#325964" />
                        </View>
                        <View
                            style={{
                                width: '85%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        marginVertical: Display.setHeight(0.5)
                                    }}
                                >{address.name ? address.name : ''}</Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: '#7f7f7f'
                                    }}
                                >{address.city ? address.city : ''}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    } else {
                                        navigation.navigate('Main');
                                    }
                                }}
                            >
                                <Feather name="edit-2" size={22} color="#325964" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "90%",
                            alignSelf: 'center',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View
                                style={{
                                    height: height * 0.06,
                                    width: '48%',
                                    backgroundColor: '#f1f1f1',
                                    flexDirection: 'row',
                                    paddingHorizontal: 15,
                                    borderWidth: 0.5,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <TextInput
                                    value={address.streetNumber}
                                    onChangeText={text => handleOnchange(text, 'streetNumber')}
                                    style={{
                                        marginVertical: 5,
                                        fontSize: 14,
                                        color: "grey",
                                    }}
                                    placeholder='Haus'
                                />
                            </View>
                            <View
                                style={{
                                    height: height * 0.06,
                                    width: '48%',
                                    backgroundColor: '#f1f1f1',
                                    flexDirection: 'row',
                                    paddingHorizontal: 15,
                                    borderWidth: 0.5,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <TextInput
                                    value={address.street}
                                    onChangeText={text => handleOnchange(text, 'street')}
                                    style={{
                                        marginVertical: 5,
                                        fontSize: 14,
                                        color: "grey",
                                    }}
                                    placeholder='Straßenname'
                                />
                            </View>
                        </View>
                        <Input
                            keyboardType="numeric"
                            onChangeText={text => handleOnchange(text, 'UnitNumber')}
                            placeholder="Appartmentnummer"
                        />
                        <Input
                            keyboardType="numeric"
                            onChangeText={text => handleOnchange(text, 'FloorNumber')}
                            placeholder="Stockwerk Nummer"
                        />
                    </View>
                    <View
                        style={{
                            width: '90%',
                            marginTop: Display.setHeight(2)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: '#325964',
                                marginTop: Display.setHeight(2)
                            }}
                        >Standard einstellen</Text>
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 25,
                                fontWeight: '300'
                            }}
                        >Diese Adresse als Standardadresse hinzufügen?</Text>
                        <View
                            style={{
                                width,
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginTop: Display.setHeight(2)
                            }}
                        >
                            <ToggleButton size={1} onToggle={onToggleChange} />
                        </View>
                    </View>
                    <View
                        style={{
                            width: '90%',
                            marginTop: Display.setHeight(2)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: '#325964',
                                marginTop: Display.setHeight(2)
                            }}
                        >Anweisungen für die Lieferung</Text>
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 25,
                                fontWeight: '300'
                            }}
                        >Geben Sie uns mehr Informationen über Ihre Adresse.</Text>
                        <Input
                            onChangeText={text => handleOnchange(text, 'Notes')}
                            placeholder="Note to rider - e.g. landmark"
                        />
                    </View>
                    <View
                        style={{
                            width: '90%',
                            marginTop: Display.setHeight(2),
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: '#325964',
                                marginTop: Display.setHeight(2)
                            }}
                        >Ein Etikett hinzufügen</Text>
                        <FlatList
                            horizontal
                            data={data}
                            keyExtractor={(item, index) => item + '-' + index}
                            renderItem={renderItem}
                        />
                        <Animated.View style={{ height: inputHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }), overflow: 'hidden' }}>
                            <Input value={otherTagInput} onChangeText={(text) => handleOnchange(text, 'Tag')} placeholder="Enter custom label..." />
                        </Animated.View>
                    </View>
                </View>
            </ScrollView>
            <View
                style={{
                    height: Display.setHeight(5),
                    width,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? '0%' : '10%'
                }}
            >
                <Separator
                    width={Display.setWidth(100)}
                    height={Display.setHeight(0.1)}
                />
                <AddresseButton
                    onpress={() => {
                        processAddressAddition(inputs, token)
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})

export default LocationDetailScreen