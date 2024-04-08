import { View, Text } from 'react-native'
import React from 'react'

const NoDataFound = () => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#AAA', fontSize: 24 }} >No data found</Text>
        </View>
    )
}

export default NoDataFound