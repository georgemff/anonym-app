import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, AsyncStorage } from 'react-native';
import { Colors } from '../colors/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { community } from '../firebaseInit'
const CreateCommunity = (props) => {
    const [communityName, setCommunityName] = useState('');
    const [privacy, setPrivacy] = useState(0);
    const [nextStep, setNextStep] = useState(false);

    const goToNextStep = () =>  {
        setNextStep(true);
    }

    const goToPrevStep = () =>  {
        setNextStep(false);
    }

    const choosePrivacy = (p) => {
        setPrivacy(p)
    }

    const registerCommunity = async () => {
        community.add({
            name: communityName,
            privacy: privacy,
            author: await AsyncStorage.getItem('uuid')
        })
        .then(() => {
            props.navigation.navigate('Home');
        })
    }

    return (
        <View style={styles.screen}>
            {
                !nextStep ?
                    <View style={styles.textInputContainer}>
                        <View style={styles.counterTextContainer}>
                            <Text style={styles.counterText}>{communityName.length}/18</Text>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Community Name"
                            placeholderTextColor={'rgba(255,255,255,.5)'}
                            maxLength={18}
                            value={communityName}
                            onChangeText={setCommunityName}
                        />
                        <View style={styles.nextButtonContainer}>
                            <TouchableOpacity style={styles.nextButton} disabled={communityName.length === 0} onPress={goToNextStep}>
                                <Text style={styles.next}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: Colors.textPrimary, fontSize: 22, fontWeight: 'bold', marginBottom: 10}}>Choose Privacy</Text>
                        <View style={{ borderRadius: 7, marginVertical: 10}}>
                            <TouchableOpacity style={{width: 150, alignItems: 'center', paddingVertical: 15, backgroundColor: Colors.primary, borderRadius: 4}} onPress={() => {choosePrivacy(0)}}>
                                <Text style={{color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold'}}>Public</Text>
                            </TouchableOpacity>
                        </View> 
                        <View style={{borderRadius: 7, marginVertical: 10}}>
                            <TouchableOpacity style={{width: 150, alignItems: 'center', paddingVertical: 15, backgroundColor: Colors.primary, borderRadius: 4}} onPress={() => {choosePrivacy(1)}}>
                                <Text style={{color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold'}}>Private</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View style={{...styles.nextButtonContainer, marginTop: 10, marginRight: 10}}>
                                <TouchableOpacity style={{...styles.nextButton, width: 150, alignItems: 'center'}} disabled={communityName.length === 0} onPress={goToPrevStep}>
                                    <Text style={styles.next}>Back</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{...styles.nextButtonContainer, marginTop: 10}}>
                                <TouchableOpacity style={{...styles.nextButton, width: 150, alignItems: 'center'}} onPress={registerCommunity}>
                                    <Text style={styles.next}>Finish</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingTop: '20%',
        alignItems: 'center',
        backgroundColor: Colors.backgroundPrimary
    },
    textInputContainer: {
        borderWidth: 1,
        width: '80%',
    },
    counterTextContainer: {
        alignItems: 'flex-end'
    },
    counterText: {
        color: Colors.textPrimary
    },
    textInput: {
        padding: 5,
        borderBottomColor: Colors.textPrimary,
        borderBottomWidth: 1,
        color: Colors.textPrimary,
        marginBottom: 10
    },
    nextButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: Colors.activeTab,
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 3
    },
    next: {
        color: Colors.textPrimary
    }
})

export default CreateCommunity;