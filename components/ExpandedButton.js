import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements';
import { Colors } from '../colors/Colors';
import {connect, dispatch} from 'react-redux';
import { LOCAL_POST, GLOBAL_POST } from '../actions/type';
const ExpandedButton = (props) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {

        return () => {
            setVisible(false)
        }
    }, [])

    const showHideOptions = () => {
        setVisible(!visible);
    }

    const showLocalPosts = () => {
        props.change('LOCAL')
        showHideOptions();
        props.props.navigation.closeDrawer();
    }

    const showGlobalPosts = () => {
        props.change('GLOBAL');
        showHideOptions();
        props.props.navigation.closeDrawer();

    }


    return (
        <View>
            <TouchableOpacity
                onPress={() => { showHideOptions() }}
                style={styles.expandableButton}>
                <Text style={styles.buttonText}>View Posts</Text>
                {
                    visible ? 
                    <Icon name="expand-less" color={Colors.textPrimary} size={30} width={25} />
                    :
                    <Icon name="expand-more" color={Colors.textPrimary} size={30} width={25} />
                }
            </TouchableOpacity>
            {
                visible &&
                <View>
                    <TouchableOpacity onPress={showLocalPosts} style={styles.optionButton}>
                        <Text style={{...styles.buttonText, fontSize: 14}}>Local</Text>
                        <Icon name="place" color={Colors.textPrimary} size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showGlobalPosts} style={styles.optionButton}>
                        <Text style={{...styles.buttonText, fontSize: 14}}>Global</Text>
                        <Icon name="public" color={Colors.textPrimary} size={20}/>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    expandableButton: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonText: {
        color: Colors.textPrimary,
        fontSize: 16
    },
    optionButton: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})
const mapStateToProps = (state) => {
    return {
        Test: "WTF",
        postView: state.postView.postView
    }
}

const mapToDispatchProps = (dispatch) => { 
    return {
        change: (post) => dispatch({type: post=='LOCAL' ? LOCAL_POST : GLOBAL_POST,postView: post})
    }
}

export default connect(mapStateToProps, mapToDispatchProps)(ExpandedButton);

