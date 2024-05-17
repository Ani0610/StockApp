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
  Dimensions,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-easy-icon";
import { GlobalStyle } from "../../../globalStyle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import SearchableComponent from "../../components/Search/SearchComponent";
import Accordion from "react-native-collapsible/Accordion";
import { formatDate } from "../../services/dateFormate";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import NoDataFound from "../../components/UI/NoData";
import { deleteDesignDetail, getDesignDetails } from "../../services/Design/Design.Service";
import { deleteDesignMaster, setDesignMaster } from "../../redux/action/DesignsMaster/designMasterSlice";

const DesignSample = ({ navigation }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<any>();
  // {
  //   date: "25/06/2024",
  //   partyName: "Ramu inter",
  //   designNo: "1",
  //   availableStocks: 135,
  //   sampleImg: [
  //     "https://thumbs.dreamstime.com/b/close-up-indian-saree-design-banarasi-indain-wedding-party-traditional-red-silk-sari-yellow-gold-border-great-130471986.jpg?w=768",
  //   ],
  //   stoneDeails: [],
  //   designDetails: [],
  //   jobWorkDetails: [],
  //   total: 1300,
  // },
  // {
  //   date: "15/01/2024",
  //   partyName: "Sharda inter",
  //   designNo: "2",
  //   availableStocks: 100,
  //   sampleImg: [
  //     "https://thumbs.dreamstime.com/b/indian-traditional-silk-saree-beautiful-latest-design-130345708.jpg?w=768",
  //   ],
  //   stoneDeails: [],
  //   designDetails: [],
  //   jobWorkDetails: [],
  //   total: 700,
  // },
  // {
  //   date: "06/02/2024",
  //   partyName: "Sharda inter",
  //   designNo: "3",
  //   availableStocks: 600,
  //   sampleImg: [
  //     "https://thumbs.dreamstime.com/b/black-saree-8535408.jpg?w=768",
  //   ],
  //   stoneDeails: [],
  //   designDetails: [],
  //   jobWorkDetails: [],
  //   total: 1500,
  // },
  // {
  //   date: "15/02/2024",
  //   partyName: "Anamika inter",
  //   designNo: "4",
  //   availableStocks: 754,
  //   sampleImg: [
  //     "https://thumbs.dreamstime.com/b/seamless-colorful-border-traditional-asian-design-elements-seamless-colorful-border-traditional-asian-design-elements-165011556.jpg?w=992",
  //   ],
  //   stoneDeails: [],
  //   designDetails: [],
  //   jobWorkDetails: [],
  //   total: 950,
  // },
  // ];
  const { designsMaster } = useSelector(
    (state: RootState) => state.designMaster
  );
  const dispatch = useDispatch();
  const [allsample, setallsample] = useState<any>([]);
  const [allsampleData, setallsampledata] = useState<any>([]);
  const [allsamplePartyName, setallsamplePartyName] = useState<any>([]);
  useEffect(() => {
    setallsample([...designsMaster]);
    setallsampledata([...designsMaster]);
  }, [designsMaster]);

  useEffect(()=>{
    dispatch(setLoading(true))
    getDesignDetails().then((res) => {
      dispatch(setLoading(false))
      if (res) {
        dispatch(setDesignMaster(res))
      }
      else {
        dispatch(setDesignMaster([]))
        dispatch(setToast({ message: 'No Data Found', isVisible: true, type: 'danger' }))
      }
    })
  },[])

  const renderThumbnail = (uri: any, designNo: any, total: any) => {
    return (
      <>
        <View>
          <Image source={{ uri: uri }} style={styles.thumbnail} />
          <View>
            <Text style={[styles.designNoText, styles.thumbnailTextbg]}>
              Design No: #{designNo}
            </Text>
          </View>
          <View>
            <Text style={[styles.designNoText, styles.thumbnailTextbg]}>
              Rate: ₹{total}(1 Unit)
            </Text>
          </View>
        </View>
        {/* <ImageBackground source={{ uri: uri }} style={styles.thumbnail}>
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
        </ImageBackground> */}
      </>
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

  const deleteDesign=()=>{
      Alert.alert("Are you sure?", "You want to delete this?", [
        {
          text: 'Cancel',
          onPress: () => console.log("Cancel Pressed"),
          style: 'cancel',
  
        },
        {
          text: "Yes",
          onPress: (() => {
            dispatch(setLoading(true))
            deleteDesignDetail(data).then((res) => {
              dispatch(setLoading(false))
              setShowModal(false);
              if (res) {
                dispatch(deleteDesignMaster(data));
              }
              else {
                dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
              }
            })
          })
        }
      ])
  }

  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setallsample([...filteredData]);
  };
  const [activeSections, setActiveSections] = useState([0]);

  const renderHeader = (section: any, isActive: number) => (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderRadius: 10,
          padding: 10,
          marginBottom: isActive === activeSections[0] ? 0 : 15,
          zIndex: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          // elevation: 2,
          borderBlockColor: "gray",
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: isActive === activeSections[0] ? 0 : 1,
          borderBottomLeftRadius: isActive === activeSections[0] ? 0 : 10,
          borderBottomRightRadius: isActive === activeSections[0] ? 0 : 10,
        },
      ]}
    >
      <Text style={{ color: "#000", fontSize: 16 }}>
        {section.partyName}
        {section.data.length}
      </Text>
      <View>
        {isActive === activeSections[0] ? (
          <Icon type="feather" name="chevron-down" color="gray" size={25} />
        ) : (
          <Icon type="feather" name="chevron-right" color="gray" size={25} />
        )}
      </View>
    </View>
  );
  const renderContent = (section: any) => (
    <View
      style={{
        padding: 5,
        borderRadius: 10,
        marginBottom: 15,
        zIndex: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // elevation: 2,
        borderBlockColor: "gray",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      {section.data.map((dt: any, i: any) => (
        <View key={i}>
          <Text>Design no {dt.designNo}</Text>
        </View>
      ))}
    </View>
  );
  const updateSections = (updatedSections: any) => {
    setActiveSections(updatedSections);
  };
  const editDesign = (item: any) => {
    dispatch(setLoading(true));
    navigation.navigate("Add Design", item);
  };
  return (
    <>
      <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content" // Here is where you change the font-color
        />
        {/* <View style={{ paddingHorizontal: 15 }}>
          <SearchableComponent
            data={allsampleData}
            searchKey="designNo"
            placeholder={"design no"}
            onFilter={handleFilter}
          />
        </View> */}
        <ScrollView>
          <View style={[GlobalStyle.container, { marginHorizontal: 0 }]}>
            {/* <>
              <View>
                <Accordion
                  align={"center"}
                  sections={allsamplePartyName}
                  activeSections={activeSections}
                  renderHeader={(section, isActive) =>
                    renderHeader(section, isActive)
                  }
                  renderContent={renderContent}
                  keyExtractor={(item, index) => index}
                  onChange={updateSections}
                  underlayColor={"transparenet"}
                />
              </View>
            </> */}
            {/* <>
              <View>
                {allsamplePartyName.map((partyName: any, i: any) => (
                  <View key={i}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderWidth: 0.5,
                        borderColor: "#000",
                        backgroundColor: "#f5f6f7",
                        alignItems: "center",
                        padding: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Party Wise Design", partyName)
                        }
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ color: "gray" }}>
                            {partyName.partyName}
                          </Text>
                          <View
                            style={{
                              backgroundColor: "#dee0e3",
                              padding: 2,
                              paddingHorizontal: 5,
                              borderRadius: 50,
                              marginLeft: 20,
                            }}
                          >
                            <Text style={{ color: "gray" }}>
                              {partyName.data.length}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <Pressable
                        style={{
                          backgroundColor: "gray",
                          padding: 2,
                          borderRadius: 50,
                        }}
                        onPress={() =>
                          navigation.navigate("Party Wise Design", partyName)
                        }
                      >
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#fff"
                          size={15}
                        />
                      </Pressable>
                    </View>
                    {partyName.data.map((item: any, index: any) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderBottomWidth: 0.3,
                          padding: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{ uri: item.sampleImg[0] }}
                            style={{
                              width: 80,
                              height: 80,
                              resizeMode: "cover",
                            }}
                          />
                          <View>
                            <Text
                              style={{
                                color: "#000",
                                marginLeft: 15,
                                fontSize: 16,
                              }}
                            >
                              {formatDate(item.date)}
                            </Text>
                            <Text
                              style={{
                                color: "#000",
                                marginLeft: 15,
                                fontSize: 16,
                              }}
                            >
                              {item.designNo}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                          }}
                        >
                          <Text style={{ color: "gray", fontSize: 16 }}>
                            {item.availableStocks}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-end",
                              alignSelf: "flex-end",
                              flex: 2,
                            }}
                          >
                            <Pressable
                              style={{
                                backgroundColor: "gray",
                                padding: 5,
                                borderRadius: 50,
                                marginRight: 5,
                              }}
                            >
                              <Icon
                                type="feather"
                                name="edit"
                                color="#fff"
                                size={15}
                                onPress={
                                  () => editDesign(item)
                                  // navigation.navigate("Add Design", item)
                                }
                              />
                            </Pressable>
                            <Pressable
                              style={{
                                backgroundColor: "gray",
                                padding: 5,
                                borderRadius: 50,
                                marginLeft: 5,
                              }}
                              onPress={() =>
                                navigation.navigate("View Design", item)
                              }
                            >
                              <Icon
                                type="feather"
                                name="chevron-right"
                                color="#fff"
                                size={15}
                              />
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </> */}
            <>{
              allsample.length > 0 ?
                <View
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {allsample.map((sample: any, i: any) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => onSelectCard(sample)}
                      style={{ width: "48%", marginBottom: 10 }} // Adjust the width as needed
                    >
                      <View
                        style={[
                          GlobalStyle.card,
                          GlobalStyle.shadowProp,
                          {
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            height: "auto",
                            width: "100%", // Set width to 100% to occupy the parent's width
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
                </View> :
                <NoDataFound />
            }
            </>


          </View>
        </ScrollView>
        <Pressable
          style={{
            position: "absolute",
            bottom: 90,
            right: 20,
            backgroundColor: "#24acf2",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => navigation.navigate("Add Design")}
        >
          <Icon type="feather" name="plus" color="white" size={20} />
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
                height: "20%",
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
              <TouchableOpacity
                style={[GlobalStyle.btn, { borderRadius: 15 }]}
                onPress={() => deleteDesign()}
              >
                 <Icon type="feather" name="delete" color="gray" size={25} />
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Delete
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
    height: 150,
    resizeMode: "cover",
  },
  thumbnailTextbg: { backgroundColor: "white", paddingHorizontal: 10 },
  textContainer: {
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  designNoText: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 13,
  },
  totalText: {
    color: "gray",
    fontSize: 13,
  },
  inputField: {
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    fontSize: 16,
    padding: 10,
  },
  inputLabel: { color: "#05E3D5", fontSize: 14 },
});
export default DesignSample;
