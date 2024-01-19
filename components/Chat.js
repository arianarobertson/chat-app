import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name, backgroundColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name })
    })
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.text}>Chat Screen</Text>
            <Text style={styles.name}>User: </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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