import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const image = require('../img/Background_Image.png');
    const icon = require('../img/icon.svg');

    const auth = getAuth();

    const signInUser = () => {
        signInAnonymously(auth)
            .then((result) => {
                // Ensure user is authenticated before navigating
                if (result.user) {
                    navigation.navigate("Chat", {
                        userID: result.user.uid,
                        user: user,
                        background: '#757083',
                    });
                    Alert.alert("Signed In Successfully!");
                } else {
                    Alert.alert("Authentication failed.");
                }
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, try again later.");
            });
    };

    const [user, setUser] = useState("");

    const handleColorSelection = (color) => {
        setSelectedColor(color);
    };

    //const handleStartChatting = () => {
    // navigation.navigate('Chat', { name, backgroundColor: selectedColor });
    //};

    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.text}>Chat App</Text>

                <View style={styles.containerWhite}>
                    <View style={styles.inputContainer}>
                        <Image source={icon} style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            value={user}
                            onChangeText={setUser}
                            placeholder="Your username"
                            placeholderTextColor="#757083"
                        />
                    </View>

                    <Text style={styles.text1}>Choose Background Color:</Text>

                    <View style={styles.colorButtonsContainer}>
                        <TouchableOpacity
                            // Adds accessibility features
                            accessible={true}
                            accessibilityLabel="More options"
                            accessibilityHint="Lets you choose to send an image or your geolocation."
                            accessibilityRole="button"
                            style={[styles.colorButton, { backgroundColor: '#090C08' }]}
                            onPress={() => handleColorSelection('#090C08')}
                        />
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="More options"
                            accessibilityHint="Lets you choose to send an image or your geolocation."
                            accessibilityRole="button"
                            style={[styles.colorButton, { backgroundColor: '#474056' }]}
                            onPress={() => handleColorSelection('#474056')}
                        />
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="More options"
                            accessibilityHint="Lets you choose to send an image or your geolocation."
                            accessibilityRole="button"
                            style={[styles.colorButton, { backgroundColor: '#8A95A5' }]}
                            onPress={() => handleColorSelection('#8A95A5')}
                        />
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="More options"
                            accessibilityHint="Lets you choose to send an image or your geolocation."
                            accessibilityRole="button"
                            style={[styles.colorButton, { backgroundColor: '#B9C6AE' }]}
                            onPress={() => handleColorSelection('#B9C6AE')}
                        />
                    </View>

                    <Button
                        title="Start Chatting"
                        onPress={signInUser}
                        style={styles.buttonStartChatting}
                        color="#757083"
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
    },
    containerWhite: {
        width: '88%',
        height: '44%',
        justifyContent: 'center',
        backgroundColor: 'white',
        bottom: 0,
        alignItems: 'center',
        marginBottom: '6%',
    },
    text: {
        padding: '25%',
        flex: 6,
        // fontFamily: 'serif',
        fontSize: 45,
        fontWeight: '600',
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#757083',
        padding: 18,
        marginTop: 15,
        marginBottom: 15,
        opacity: 0.5,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    text1: {
        fontSize: 16,
        color: '#757083',
        fontWeight: '300',
        opacity: 1,
        marginTop: 10,
    },
    colorButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
    },
    buttonStartChatting: {
        backgroundColor: '#757083',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
    },
});

export default Start;