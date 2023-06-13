import { View, Image, Text, FlatList, StyleSheet } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from "@react-native-material/core";

const DataTracking = ({ navigation }) => {
    return (
        <View style={styles.Container}>
            <LinearGradient
                colors={[ '#E6F9B0', '#E9A7A2' ]}       
                style={styles.linearGradient}
            >
                <View style={styles.flexBox}>
                    <View style={styles.box}>
                        <Image source={require('../../assets/images/DT4Asset.png')} style={styles.image} />
                        <Text style={styles.heading}>Datenverfolgung zulassen</Text>
                        <Text style={styles.subHeading}>Ihre Zustimmung hilft uns,{"\n"}Sie besser zu bedienen</Text>
                    </View>
                    <View style={styles.note}>
                        <View style={styles.noteBox}>
                            <Image style={[styles.noteImage, { aspectRatio: 35/41 }]} source={require('../../assets/images/DT1Asset.png')} />
                            <Text style={styles.noteText}>Individuelles Erlebnis für Ihr Empfinden</Text>
                        </View>
                        <View style={styles.noteBox}>
                            <Image style={[styles.noteImage, { aspectRatio: 35/44 }]} source={require('../../assets/images/DT2Asset.png')} />
                            <Text style={styles.noteText}>Benachrichtigungen, die Ihren{'\n'}Interessen entsprechen</Text>
                        </View>
                        <View style={styles.noteBox}>
                            <Image style={[styles.noteImage, { aspectRatio: 41/33 }]} source={require('../../assets/images/DT3Asset.png')} />
                            <Text style={styles.noteText}>Personalisierte Angebote und{'\n'}Werbeaktionen</Text>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Sie können diese Optionen in der Einstellungs-App{'\n'}Ihres Telefons ändern</Text>
                        <Button
                            onPress={() => navigation.navigate('Home')}
                            title='weiter'
                            color="#325962"
                            contentContainerStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                        />
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        width: "100%",
        height: "100%",
    },
    linearGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: "100%"
    },
    flexBox: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: '100%'
    },
    image: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 18,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#325962',
        alignSelf: 'center',
        marginBottom: 12,
        letterSpacing: 1.5,
    },
    subHeading: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#325962',
        alignSelf: 'center',
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 20,
    },
    note: {
        marginTop: 40,
    },
    noteBox: {
        flexDirection: 'row',
        width: "80%",
        height: 60,
        alignItems: 'center',
        margin: 10,
    },
    noteImage: {
        width: 40,
        height: 40,
    },
    noteText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#325962',
        marginLeft: 20,
        lineHeight: 18,
    },
    buttonTitle: {
        letterSpacing: 2,
        fontSize: 12,
        fontWeight: 'bold'
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#325962',
        marginBottom: 35,
        marginTop: 40,
        textAlign: 'center',
        lineHeight: 18,
    }
})

export default DataTracking;