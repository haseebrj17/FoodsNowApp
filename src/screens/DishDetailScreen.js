import { StyleSheet, Text, View, Button, HStack, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DishDetailScreen = ({ route }) => {
    const navigation = useNavigation();

    const { dishes } = route.params

    return (
        <View>
            <View>
                <Image
                    source={
                        dishes.image
                    }
                    alt="image"
                    style={styles.ImageOfferCard}
                />
            </View>
        </View>
    )
}

export default DishDetailScreen

const styles = StyleSheet.create({
    ImageOfferCard: {
        width: "100%",
        height: undefined,
        resizeMode: "cover",
        aspectRatio: 166 / 115,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
})