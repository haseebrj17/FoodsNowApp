import { View, Image, Text, FlatList, StyleSheet } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from "@react-native-material/core";
import { Display } from "../utils";

const DataTrackingScreen = ({ navigation }) => {
    return (
        <View style={styles.Container}>
            <LinearGradient
                colors={[ '#E6F9B0', '#E9A7A2' ]}       
                style={styles.linearGradient}
            >
                <View style={styles.flexBox}>
                    <View style={styles.box}>
                        <Image source={require('../assets/images/DT4Asset.png')} style={styles.image} />
                        <Text style={styles.heading}>Datenverfolgung zulassen</Text>
                        <Text style={styles.subHeading}>Ihre Zustimmung hilft uns,{"\n"}Sie besser zu bedienen</Text>
                    </View>
                    <View style={styles.note}>
                        <View style={styles.noteBox}>
                            <Image style={[styles.noteImage, { aspectRatio: 35/41 }]} source={require('../assets/images/DT1Asset.png')} />
                            <Text style={styles.noteText}>Individuelles Erlebnis für Ihr Empfinden</Text>
                        </View>
                        <View style={styles.noteBox}>
                            <Image style={[styles.noteImage, { aspectRatio: 35/44 }]} source={require('../assets/images/DT2Asset.png')} />
                            <Text style={styles.noteText}>Benachrichtigungen, die Ihren{'\n'}Interessen entsprechen</Text>
                        </View>
                        <View style={styles.noteBox}>
                            <Image style={[styles.noteImage, { aspectRatio: 41/33 }]} source={require('../assets/images/DT3Asset.png')} />
                            <Text style={styles.noteText}>Personalisierte Angebote und{'\n'}Werbeaktionen</Text>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Sie können diese Optionen in der Einstellungs-App{'\n'}Ihres Telefons ändern</Text>
                        <Button
                            onPress={() => navigation.navigate('Location')}
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
        width: Display.setHeight(9),
        height: Display.setHeight(9),
        alignSelf: 'center',
        marginBottom: Display.setHeight(2),
    },
    heading: {
        fontSize: Display.setHeight(2.8),
        fontWeight: 'bold',
        color: '#325962',
        alignSelf: 'center',
        marginBottom: Display.setHeight(1.6),
        letterSpacing: 1.5,
    },
    subHeading: {
        fontSize: Display.setHeight(1.6),
        fontWeight: 'bold',
        color: '#325962',
        alignSelf: 'center',
        marginBottom: Display.setHeight(1.2),
        textAlign: 'center',
        lineHeight: Display.setHeight(2.5),
    },
    note: {
        marginTop: Display.setHeight(5),
    },
    noteBox: {
        flexDirection: 'row',
        width: "80%",
        height: Display.setHeight(7.2),
        alignItems: 'center',
        margin: Display.setHeight(1.2),
    },
    noteImage: {
        width: Display.setHeight(5),
        height: Display.setHeight(5),
    },
    noteText: {
        fontSize: Display.setHeight(1.4),
        fontWeight: 'bold',
        color: '#325962',
        marginLeft: Display.setHeight(2.2),
        lineHeight: Display.setHeight(2.1),
    },
    buttonTitle: {
        letterSpacing: 2,
        fontSize: Display.setHeight(1.5),
        fontWeight: 'bold'
    },
    buttonText: {
        fontSize: Display.setHeight(1.5),
        fontWeight: 'bold',
        color: '#325962',
        marginBottom: Display.setHeight(3.7),
        marginTop: Display.setHeight(4.2),
        textAlign: 'center',
        lineHeight: Display.setHeight(2.1),
    }
})

export default DataTrackingScreen;