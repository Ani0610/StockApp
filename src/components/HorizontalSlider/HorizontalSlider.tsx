import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const { width } = Dimensions.get("window");

const HorizontalSlider = ({ children }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevChildrenLength = useRef(children.length);

  const goToNext = () => {
    if (currentIndex + 1 <= children.length) {
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
      <View>
        <View style={styles.centerContainer}>
          <View style={styles.childContainer}>{children[currentIndex]}</View>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={goToPrevious}
            style={[
              styles.leftButton,
              { backgroundColor: currentIndex !== 0 ? "blue" : "lightgray" },
            ]}
            disabled={currentIndex !== 0 ? false : true}
          >
            {/* {currentIndex !== 0 &&  */}
            <Icon name="arrowleft" size={20} color="white" />
            {/* } */}
          </Pressable>
          <Pressable
            onPress={goToNext}
            style={[
              styles.rightButton,
              {
                backgroundColor:
                  currentIndex < children.length - 1 ? "blue" : "lightgray",
              },
            ]}
            disabled={currentIndex < children.length - 1 ? false : true}
          >
            {/* {currentIndex < children.length - 1 && ( */}

            <Icon name="arrowright" size={20} color="white" />
            {/* )} */}
          </Pressable>
        </View>
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
    justifyContent: "center",
  },
  leftButton: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    marginRight: 5,
  },
  rightButton: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    marginLeft: 5,
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
