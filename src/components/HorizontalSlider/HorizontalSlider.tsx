import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const { width } = Dimensions.get("window");

const HorizontalSlider = ({ children }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevChildrenLength = useRef(children.length);

  const goToNext = () => {
    if (currentIndex+1 <= children.length) {        
        setCurrentIndex(currentIndex + 1);
    }
  };
  const goToPrevious = () => {
    setCurrentIndex(currentIndex - 1);
  };
  useEffect(() => {
    if (currentIndex >= children.length) {
      setCurrentIndex(children.length - 1);
    }
  }, [children, currentIndex]);
  useEffect(() => {
    // Check if new items were added to children array
    if (children.length > prevChildrenLength.current) {       
      setCurrentIndex(children.length - 1); // Set currentIndex to the last item
    }
    prevChildrenLength.current = children.length; // Update previous length reference
  }, [children]);
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Pressable onPress={goToPrevious} style={styles.leftButton}>
        {currentIndex !==0 &&
          <Icon name="left" size={25} color="blue" />
        }
        </Pressable>
        <View style={styles.centerContainer}>
          <View style={styles.childContainer}>{children[currentIndex]}</View>
        </View>      
        <Pressable onPress={goToNext} style={styles.rightButton}>
          {currentIndex < children.length - 1  &&

          <Icon name="right" size={25} color="blue" />
        }
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 0,
  },
  leftButton: {
    alignSelf: "center",
    marginHorizontal:0,
    paddingHorizontal:0,
    width:25

  },
  rightButton: {
    alignSelf: "center",
    marginHorizontal:0,
    paddingHorizontal:0,
    width:25

  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width - 50, // Adjust the width as needed
  },
  childContainer: {
    width: "100%", // Fixed width for children
  },
});

export default HorizontalSlider;
