import { 
    StyleSheet, 
    FlatList, 
    View, 
    Text, 
    Image, 
    Dimensions, 
    TouchableWithoutFeedback,
} from "react-native";
import {
        NativeBaseProvider,
        Container,
        Header,
        Content,
        Card,
        CardItem,
        Body,
        Box, Heading, AspectRatio, Center, HStack, Stack
} from 'native-base';
import { Button } from "@react-native-material/core";
import BrandCardsHome from "../components/BrandCardsHome";

const { width } = Dimensions.get('window');

const column = 3;

const formatData = (brands, column) => {
    const numOfFullRow = Math.floor(brands.length / column)
    let numOfElementsLastRow = brands.length - (numOfFullRow * column);
    while (numOfElementsLastRow !== column && numOfElementsLastRow !== 0) {
        brands.push({ key: `balnk-${numOfElementsLastRow}`, empty: true });
        numOfElementsLastRow = numOfElementsLastRow + 1;
    }
    return brands;
}

const DetailsScreen = ({ route }) => {
    const { id } = route.params;
    const { dishes } = BrandCardsHome.filter((dishes) => dishes.id === id )
    console.log(dishes)
    const renderItem = ({ item: dishes }) => {
        return <Box alignItems="center" style={styles.OfferCardBox}>
            <Box maxW="80"
                style={styles.OfferCard}>
                <Box>
                    <Image
                        source={
                            dishes.image
                        }
                        alt="image"
                        style={styles.ImageOfferCard}
                    />
                </Box>
                <Stack p="2">
                    <Stack>
                        <Heading style={styles.Text}>
                            {dishes.name}
                        </Heading>
                        <Text style={styles.SubTextBrand}>
                            {dishes.restaurant}
                        </Text>
                    </Stack>
                    <Text fontWeight="400" style={styles.SubText}>
                        {dishes.description}
                    </Text>
                    <HStack alignItems="center" space={4} justifyContent="space-between">
                        <HStack alignItems="center">
                            <Text style={styles.SubTextPrice}>
                                {dishes.price32}
                            </Text>
                        </HStack>
                    </HStack>
                </Stack>
            </Box>
        </Box>;
    }
    return (
        <View>
            <Image source={require('../../assets/images/PizzaBanner.png')} style={styles.bannerImage} />
            <NativeBaseProvider>
                <FlatList
                    onScrollAnimationEnd={true}
                    data={formatData(dishes, column)}
                    aria-expanded="false"
                    style={styles.container}
                    renderItem={renderItem}
                // keyExtractor={(item) => item.id.toString()}
                />
            </NativeBaseProvider>
        </View>
    )
}

const ConditionalRendering = () => {
    if (BrandCard.length > 6) {
        return <Button
            title={custonTitle}
            style={styles.Button}
            color="rgba(50, 89, 98, 0.2)"
            disableElevation={true}
            uppercase={false}
            leading
        />
    } else {
        return null
    }
}

const custonTitle = () => {
    return (
        <Text
            style={{
                color: "#325962",
                fontSize: 12,
                fontWeight: "600",
                letterSpacing: 0.2,
                // marginTop: 2,
            }}
        >Explore all Restaurants</Text>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        
    },
    bannerImage: {
        width: width,
        height: undefined,
        aspectRatio: 114.666/81.719,
    },
    BrandCard: {
        width: "30%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        margin: 40,
        height: Dimensions.get('window').width * 0.2, // approximate a square
    },
    ImageBrandCard: {
        width: 102.08,
        height: 115,
        resizeMode: "cover",
        aspectRatio: 1021/1151,
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
        height: 40,
        alignSelf: "center",
        marginTop: 10,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 0.4)"
    },
})

export default DetailsScreen;