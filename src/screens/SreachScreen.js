import { Icon, StatusBar } from 'native-base'
import { Dimensions, FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Searchbar } from 'react-native-paper'
import { Fonts } from '../assets/constants'
import { useFonts } from 'expo-font'
import { Entypo, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
import { Logo } from '../assets/constants/Slider'
import { BrandCard } from '../assets/constants/Slider'
import { useState, useEffect } from 'react'

const { width, height } = Dimensions.get('screen')

const SreachScreen = ({ navigation }) => {
    const [fontsLoaded] = useFonts({
        PEBO: 'Poppins-ExtraBold.ttf',
        PBO: 'Poppins-Bold.ttf',
        PSB: 'Poppins-SemiBold.ttf',
        PM: 'Poppins-Medium.ttf',
        PR: 'Poppins-Regular.ttf',
        PL: 'Poppins-Light.ttf'
    })
    const [logo, setLogo] = useState(Logo)
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBrands, setFilteredBrands] = useState(BrandCard);
    const onChangeSearch = query => setSearchQuery(query);
    useEffect(() => {
        const results = BrandCard.filter(brand =>
            brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brand.dishes.some(dish =>
                dish.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setFilteredBrands(results);
    }, [searchQuery]);
    const renderItem = ({ item: logo }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Details', { brand: logo.name })}>
                <Image
                    source={logo.image}
                    resizeMode='contain'
                    style={styles.item}
                />
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ width: width, height: height }}>
            <View style={styles.Container}>
                <Searchbar
                    placeholder="Search for restaurants, cuisines, and more...."
                    style={styles.SearchBar}
                    inputStyle={styles.SearchBarInput}
                    iconColor="#325962"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
            </View>
            <View style={{ width: width * 0.9, alignItems: 'center', alignSelf: 'center', marginTop: 20, flexDirection: 'row' }}>
                <Entypo name="back-in-time" size={24} color="#325962" />
                <Text style={{ fontSize: 18, fontFamily: 'PBO', marginLeft: 10, fontWeight: 'bold', color: '#325962' }}>
                    Recent Sreach
                </Text>
            </View>
            <View style={{ width: width * 0.9, alignItems: 'center', alignSelf: 'center', marginTop: 20, flexDirection: 'row' }}>
                <MaterialIcons name='local-fire-department' size={24} color="#325962" />
                <Text style={{ fontSize: 18, fontFamily: 'PBO', marginLeft: 10, fontWeight: 'bold', color: '#325962' }}>
                    Most loved restaurants
                </Text>
            </View>
            <View style={{
                marginTop: 10,

            }}>
                <FlatList
                    data={logo}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                />
            </View>
            <View style={{
                marginTop: 10,
            }}>
                <FlatList
                    data={filteredBrands}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        alignContent: "center",
        justifyContent: "flex-end",
        width: width,
        height: "10%",
        backgroundColor: "#f1f1f1",
    },
    SearchBarContainer: {
        width: '90%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: 'rgba(50, 89, 98, 0.4)',
        borderWidth: 1,
    },
    SearchBar: {
        alignSelf: 'center',
        width: '90%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 12,
        fontSize: 20,
        borderColor: 'rgba(50, 89, 98, 0.4)',
        borderWidth: 1,
        marginTop: 30,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 100 },
    },
    SearchBarInput: {
        fontSize: 13,
        alignSelf: "center",
        opacity: 0.6
    },
    item: {
        width: 50,
        height: 50,
        margin: 10,
        borderRadius: 8
    }
})

export default SreachScreen