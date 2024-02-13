import React, { useEffect, useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, ImageBackground } from 'react-native'
import Icon from 'react-native-easy-icon'
import { GlobalStyle } from '../../../globalStyle'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const AllSampleDesign = ({ navigation }: any) => {
    const allSamples = [
        { designNo: '1', sampleImg: ['https://thumbs.dreamstime.com/b/close-up-indian-saree-design-banarasi-indain-wedding-party-traditional-red-silk-sari-yellow-gold-border-great-130471986.jpg?w=768'], stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 1300 },
        { designNo: '2', sampleImg:['https://thumbs.dreamstime.com/b/indian-traditional-silk-saree-beautiful-latest-design-130345708.jpg?w=768'], stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 700 },
        { designNo: '3', sampleImg: ['https://thumbs.dreamstime.com/b/black-saree-8535408.jpg?w=768'], stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 1500 },
        { designNo: '4', sampleImg: ['https://thumbs.dreamstime.com/b/seamless-colorful-border-traditional-asian-design-elements-seamless-colorful-border-traditional-asian-design-elements-165011556.jpg?w=992'], stoneDeails: [], designDetails: [], jobWorkDetails: [], total: 950 },
    ];
    const { designsMaster } = useSelector((state: RootState) => state.designMaster)
const [allsample ,setallsample]=useState<any>([])
useEffect(() => {
    console.log('designsMaster',designsMaster);
    
  setallsample([...allSamples,...designsMaster])
}, [designsMaster])

    const renderThumbnail = (uri: any, designNo: any, total: any) => {
        return (
            <ImageBackground source={{uri:uri}} style={styles.thumbnail}>
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
                    {allsample.map((sample: any, i: any) => (

                        <View key={i} style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            height: 'auto',

                        }]}>
                            {renderThumbnail(sample.sampleImg[0], sample.designNo, sample.total)}

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
