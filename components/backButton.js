import React from 'react'
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../colors/Colors';
const BackButton = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ backgroundColor: Colors.primary }}
            onPress={() => { navigation.goBack() }}>
            <Icon name="navigate-before" color={Colors.textPrimary} size={30} />
        </TouchableOpacity>
    )
}

export default BackButton;