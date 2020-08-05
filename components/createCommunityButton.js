import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../colors/Colors';
const CreateCommunityButton = () => {
    const navigation = useNavigation();

    const buttonAction = () => {
        navigation.navigate('CreateCommunity');
    }

    return (
        <TouchableOpacity style={styles.button} onPress={buttonAction}>
            <Icon name="users" type="font-awesome" color={Colors.textPrimary} size={20} />
            <Text style={styles.buttonText}>Create Community</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    buttonText: {
        color: Colors.textPrimary,
        marginLeft: 10
    }
})
export default CreateCommunityButton;