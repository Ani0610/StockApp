import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import { setToast } from '../../redux/action/Ui/Uislice';

const Toast = ({ message, visible ,type='success' }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const dispatch = useDispatch()

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        dispatch(setToast({ message: '', isVisible: false, type: '' }))
      }, 5000); // Change the duration as needed
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
        {borderLeftColor: type==="danger"?'red':'green',borderLeftWidth:2}
      ]}
    >
      <Text style={ {color: type==="danger"?'red':'green' }}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#e9e9e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    zIndex:999,
    elevation:5
  },
});

export default Toast;