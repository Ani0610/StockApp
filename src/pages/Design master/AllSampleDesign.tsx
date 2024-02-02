import React, { } from 'react'
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, ImageBackground } from 'react-native'
import Icon from 'react-native-easy-icon'
import { GlobalStyle } from '../../../globalStyle'

const AllSampleDesign = ({ navigation }: any) => {
    const allSamples = [
        { designNo: '1', sampleImg: require('../../assets/sample1.jpg'), stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 1300 },
        { designNo: '2', sampleImg: require('../../assets/sample2.jpg'), stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 700 },
        { designNo: '3', sampleImg: require('../../assets/sample3.jpg'), stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 1500 },
        { designNo: '4', sampleImg: require('../../assets/sample4.jpg'), stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 950 },
    ];

    const renderThumbnail = (uri: any, designNo: any, total: any) => {
        return (
            <ImageBackground source={uri} style={styles.thumbnail}>
                <View style={styles.textContainer}>
                    <Text style={[styles.designNoText, styles.thumbnailTextbg]}>#{designNo}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                    <Text style={[styles.designNoText, styles.thumbnailTextbg]}>₹{total}</Text>
                </View>
            </ImageBackground>
        );
    };

    return (
        <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: '100%' }]}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <ScrollView>
                <View style={[GlobalStyle.container]}>
                    {allSamples.map((sample: any, i: any) => (

                        <View key={i} style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            height: 'auto',

                        }]}>
                            {renderThumbnail(sample.sampleImg, sample.designNo, sample.total)}

                        </View>
                    ))}
                </View>
            </ScrollView>
            <Pressable style={{ position: 'absolute', bottom: 90, right: 20, backgroundColor: 'blue', padding: 16, borderRadius: 50 }} onPress={() => navigation.navigate('Add Design')}>
                <Icon type="feather" name="plus" color="white" size={35} />
            </Pressable>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    thumbnail: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        position: 'relative',
    },
    thumbnailTextbg: { backgroundColor: 'black', paddingHorizontal: 10 },
    textContainer: {
        position: 'absolute',
        bottom: 5,
        left: 5,
    },
    designNoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalText: {
        color: 'white',
        fontSize: 12,
    },
    inputField: {
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        fontSize: 16,
        padding: 10,
    },
    inputLabel: { color: '#05E3D5', fontSize: 14 },
});
export default AllSampleDesign
