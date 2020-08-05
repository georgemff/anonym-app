import React, { useState, useRef } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../colors/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
const CreateCommunity = (props) => {
    const [communityName, setCommunityName] = useState('');
    const [nextStep, setNextStep] = useState(false);

    const goToNextStep = () =>  {
        setNextStep(true);
    }

    const goToPrevStep = () =>  {
        setNextStep(false);
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
                        <Text style={{color: Colors.textPrimary, fontSize: 22, fontWeight: 'bold', marginBottom: 10}}>Choose Category</Text>
                        <View style={{ borderRadius: 7, marginVertical: 10}}>
                            <TouchableOpacity style={{width: 150, alignItems: 'center', paddingVertical: 15, backgroundColor: Colors.primary, borderRadius: 4}}>
                                <Text style={{color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold'}}>Art</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{borderRadius: 7, marginVertical: 10}}>
                            <TouchableOpacity style={{width: 150, alignItems: 'center', paddingVertical: 15, backgroundColor: Colors.primary, borderRadius: 4}}>
                                <Text style={{color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold'}}>Funny</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{...styles.nextButtonContainer, marginTop: 10}}>
                            <TouchableOpacity style={{...styles.nextButton, width: 150, alignItems: 'center'}} disabled={communityName.length === 0} onPress={goToPrevStep}>
                                <Text style={styles.next}>Back</Text>
                            </TouchableOpacity>
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