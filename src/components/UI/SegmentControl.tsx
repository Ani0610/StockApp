import React, { useState } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text } from 'react-native';

const SegmentedControl = ({ values, selectedIndex, onValueChange }: any) => {
    return (
        <View style={styles.container}>
            {values.map((value: any, index: number) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.segment,
                        index === selectedIndex && styles.selectedSegment,
                        index === 0 && styles.firstSegment,
                        index === values.length - 1 && styles.lastSegment,
                    ]}
                    onPress={() => onValueChange(index)}
                >
                    <Text
                        style={[
                            styles.segmentText,
                            index === selectedIndex && styles.selectedSegmentText,
                        ]}
                    >
                        {value}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    firstSegment: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    lastSegment: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    selectedSegment: {
        backgroundColor: '#007bff',
    },
    segmentText: {
        color: '#000',
    },
    selectedSegmentText: {
        color: '#fff',
    },
});

export default SegmentedControl;
