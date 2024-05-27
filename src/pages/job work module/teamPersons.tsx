import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { GlobalStyle } from '../../../globalStyle'

const TeamPersons = () => {
    return (
        <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
            <View>
                <Text style={{ color: 'black' }}>teamPersons</Text>
            </View>
        </SafeAreaView>
    )
}

export default TeamPersons