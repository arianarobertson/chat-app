import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Platform, KeyboardAvoidingView } from "react-native";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const { user, backgroundColor, userID } = route.params;
    const [messages, setMessages] = useState([]);

    // Loads cached messages if the user is offline

    const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem('messages')) || '[]';
        setMessages(JSON.parse(cachedMessages));
    };

    let unsubMessages;

    // Function to send messages
    const onSend = (newMessages) => {
        // setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
        addDoc(collection(db, "messages"), newMessages[0])
    }

    // Function to change the background color of the message bubbles
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#000"
                    },
                    left: {
                        backgroundColor: "#FFF"
                    },
                }}
            />
        );
    };

    useEffect(() => {
        navigation.setOptions({ title: user });

        if (isConnected === true) {
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (docs) => {
                let newMessages = [];
                docs.forEach((doc) => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis()),
                    });
                });

                cachedMessages(newMessages);
                setMessages(newMessages);
            });
        }
        else loadCachedMessages();

        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);

    // Caches messaged so they can be viewed when offline

    const cachedMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    // Renders the toolbar so that users can send images, take pictures, and send location data in messages

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    // Renders the custom actions of images and location for the user

    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} userID={userID} {...props} />;
    };

    // Sends a message bubble containing the location data the user wants to send.

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // Using GiftedChat renders message bubbles as well as other important components for sending more information

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: userID,
                    username: user,
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    name: {
        marginTop: 20,
        fontSize: 16,
        color: 'white',
    },
});

export default Chat;