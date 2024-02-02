import React from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import PieChart from 'react-native-pie-chart'
import { GlobalStyle } from '../../../globalStyle'

const Dashboard = () => {
    const widthAndHeight = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

    return (
        <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: '100%' }]}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Stock</Text>
                    <PieChart widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: '50%'
    },
    title: {
        fontSize: 24,
        margin: 10,
    },
})
export default Dashboard
