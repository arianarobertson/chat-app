import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const actionSheet = useActionSheet();

    //Get the user's location and send it as a message in chat
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }

    //Generates a reference for the database to use create and retrieve the image in the database.
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    }

    //handling to send an image to the database to be stored as a blob with the generatedReference id.
    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref)
            onSend({ image: imageURL })
        });
    }

    //Allows the user to pick through their library for images to be sent. 
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted");
        }
    };

    // Allows the user to use the camera on their device to take a picture and send it.
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted");
        }
    }

    //Displays the extra actions a user can preform being take a picture, send a picture from their library, and send their location. 
    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            },
        );
    };

    // Generates the button and calls all functions so that more actions are able to be performed then basic chat

    return (
        <TouchableOpacity
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Let's you choose to send an image or your geolocation."
            style={styles.container}
            onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 10,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;