import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import Icon from "react-native-easy-icon";
import { GlobalStyle } from "../../../globalStyle";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import SearchableComponent from "../../components/Search/SearchComponent";

const AllSampleDesign = ({ navigation }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<any>();
  const allSamples = [
    {
      designNo: "1",
      sampleImg: [
        "https://thumbs.dreamstime.com/b/close-up-indian-saree-design-banarasi-indain-wedding-party-traditional-red-silk-sari-yellow-gold-border-great-130471986.jpg?w=768",
      ],
      stoneDeails: [],
      designDetails: [],
      jobWorkDetails: [],
      total: 1300,
    },
    {
      designNo: "2",
      sampleImg: [
        "https://thumbs.dreamstime.com/b/indian-traditional-silk-saree-beautiful-latest-design-130345708.jpg?w=768",
      ],
      stoneDeails: [],
      designDetails: [],
      jobWorkDetails: [],
      total: 700,
    },
    {
      designNo: "3",
      sampleImg: [
        "https://thumbs.dreamstime.com/b/black-saree-8535408.jpg?w=768",
      ],
      stoneDeails: [],
      designDetails: [],
      jobWorkDetails: [],
      total: 1500,
    },
    {
      designNo: "4",
      sampleImg: [
        "https://thumbs.dreamstime.com/b/seamless-colorful-border-traditional-asian-design-elements-seamless-colorful-border-traditional-asian-design-elements-165011556.jpg?w=992",
      ],
      stoneDeails: [],
      designDetails: [],
      jobWorkDetails: [],
      total: 950,
    },
  ];
  const { designsMaster } = useSelector(
    (state: RootState) => state.designMaster
  );
  const [allsample, setallsample] = useState<any>([]);
  const [allsampleData, setallsampledata] = useState<any>([]);
  useEffect(() => {
    setallsample([...allSamples, ...designsMaster]);
    setallsampledata([...allSamples, ...designsMaster]);
  }, [designsMaster]);

  const renderThumbnail = (uri: any, designNo: any, total: any) => {
    return (
      <ImageBackground source={{ uri: uri }} style={styles.thumbnail}>
        <View style={styles.textContainer}>
          <Text style={[styles.designNoText, styles.thumbnailTextbg]}>
            #{designNo}
          </Text>
        </View>
        <View style={{ position: "absolute", bottom: 5, right: 5 }}>
          <Text style={[styles.designNoText, styles.thumbnailTextbg]}>
            ₹{total}
          </Text>
        </View>
      </ImageBackground>
    );
  };
  const handleClose = () => {
    setShowModal(false);
    setData(null);
  };
  const onSelectCard = (item: any) => {
    setShowModal(true);
    setData(item);
  };

  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setallsample([...filteredData]);
  };
  return (
    <>
      <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{ paddingHorizontal: 15 }}>
          <SearchableComponent
            data={allsampleData}
            searchKey="designNo"
            placeholder={"design no"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <>
              {allsample.map((sample: any, i: any) => (
                <TouchableOpacity key={i} onPress={() => onSelectCard(sample)}>
                  <View
                    style={[
                      GlobalStyle.card,
                      GlobalStyle.shadowProp,
                      {
                        paddingVertical: 8,
                        paddingHorizontal: 8,
                        height: "auto",
                      },
                    ]}
                  >
                    {renderThumbnail(
                      sample.sampleImg[0],
                      sample.designNo,
                      sample.total
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </>
            {allSamples?.length === 0 && (
              <>
                <View
                  style={[
                    GlobalStyle.card,
                    GlobalStyle.shadowProp,
                    {
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      height: "auto",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#000",
                      textAlign: "center",
                      marginTop: 50,
                    }}
                  >
                    No Data Found
                  </Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <Pressable
          style={{
            position: "absolute",
            bottom: 90,
            right: 20,
            backgroundColor: "blue",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => navigation.navigate("Add Design")}
        >
          <Icon type="feather" name="plus" color="white" size={35} />
        </Pressable>
      </SafeAreaView>
      {showModal && (
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={handleClose}
          onPointerDown={handleClose}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onTouchEnd={handleClose}
          >
            <View
              style={{
                height: "15%",
                width: "100%",
                marginTop: "auto",
                backgroundColor: "white",
                elevation: 5,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            >
              <TouchableOpacity
                style={[GlobalStyle.btn, { borderRadius: 15 }]}
                onPress={() => navigation.navigate("View Design", data)}
              >
                <Icon type="feather" name="eye" color="gray" size={25} />
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  View Design
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={GlobalStyle.btn}>
                <Icon type="entypo" name="cross" color="gray" size={25} />
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  thumbnail: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    position: "relative",
  },
  thumbnailTextbg: { backgroundColor: "black", paddingHorizontal: 10 },
  textContainer: {
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  designNoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  totalText: {
    color: "white",
    fontSize: 12,
  },
  inputField: {
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    fontSize: 16,
    padding: 10,
  },
  inputLabel: { color: "#05E3D5", fontSize: 14 },
});
export default AllSampleDesign;
