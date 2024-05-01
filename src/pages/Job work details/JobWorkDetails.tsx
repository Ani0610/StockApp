import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GlobalStyle } from "../../../globalStyle";
import Icon from "react-native-easy-icon";
import { ScrollView } from "react-native-gesture-handler";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addDesign,
  deleteDesign,
  editDesign,
} from "../../redux/action/DesignDetails/designSlice";
import {
  addJobWork,
  deleteJobWork,
  editJobWork,
} from "../../redux/action/Job Work details/jobDetailsSlice";
import SearchableComponent from "../../components/Search/SearchComponent";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { addJobWorks, deleteJobWorkById, updateJobWork } from "../../services/master/master.service";
import AddEditJobwork from "./AddEditJobwork";
var heightY = Dimensions.get("window").height;

const JobWorkDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);

  const { jobWorks } = useSelector((state: RootState) => state.jobWorks);
  const [allJobWork, setAlljobWork] = useState<any>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setAlljobWork([...jobWorks]);
  }, [jobWorks]);


  const selectCard = (item: number) => {
    setisVisible(true);
    setdata(item);
  };
  const onClose = () => {
    setisVisible(false);
  };

  const deleteJobWorkDetails = () => {
    Alert.alert("Are you sure?", "You want to delete this?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes", onPress: (() => {
          setisVisible(false);
          dispatch(setLoading(true))
          deleteJobWorkById(data).then((res) => {
            dispatch(setLoading(false))
            setisVisible(false);
            if (res) {
              dispatch(deleteJobWork(data));
            }
            else {
              dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
            }
          })
        })
      }
    ]);
  };




  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setAlljobWork([...filteredData]);
    // setallsample([...filteredData]);
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
            data={jobWorks}
            searchKey="workType"
            placeholder={"workType"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {allJobWork?.map((item: any, i: any) => (
                <View
                  key={i}
                  style={[
                    GlobalStyle.card,
                    GlobalStyle.shadowProp,
                    {
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      height: "auto",
                      flexDirection: "row",
                    },
                  ]}
                >
                  <View style={GlobalStyle.leftSide}>
                    <Text style={GlobalStyle.label}>Party Name</Text>
                    <Text style={GlobalStyle.label}>Work Type</Text>
                    <Text style={GlobalStyle.label}>Item Name</Text>
                    <Text style={GlobalStyle.label}>Price</Text>
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.partyName}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.workType}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.itemName}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.price}₹(1 Unit)
                    </Text>
                  </View>
                  <View style={GlobalStyle.rightSide}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pressable onPress={() => selectCard(item)}>
                        <Icon
                          type="feather"
                          name="more-vertical"
                          color="gray"
                          size={30}
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* <View style={{ flex: 1, width: 'auto' }}>
                                        <View style={{
                                            display: 'flex', flexDirection: 'column',
                                        }}>
                                            <Text style={[GlobalStyle.blackColor, Style.partyName]}>
                                                Stone Type :-{item.partyName}
                                            </Text>
                                            <Text style={[GlobalStyle.blackColor, Style.price]}>
                                                Price :- {item.price}
                                            </Text>
                                        </View>

                                    </View> */}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <Pressable
          style={{
            position: "absolute",
            bottom: 40,
            right: 20,
            backgroundColor: "blue",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => { setShowModal(true); setdata(null) }}
        >
          <Icon type="feather" name="plus" color="white" size={35} />
        </Pressable>
      </SafeAreaView>
      {isVisible && (
        <Modal
          visible={isVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
          onPointerDown={onClose}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onTouchEnd={onClose}
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
                onPress={() => {
                  setShowModal(true);
                  setisVisible(false)
                }}
                style={[GlobalStyle.btn, { borderRadius: 15 }]}
              >
                <Icon type="feather" name="edit" color="gray" size={25} />
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteJobWorkDetails()}
                style={[GlobalStyle.btn, { borderRadius: 15 }]}
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
              <TouchableOpacity onPress={onClose} style={GlobalStyle.btn}>
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
      {showModal && (
        <AddEditJobwork
          showModal={showModal}
          setShowModal={setShowModal}
          data={data}
        />
      )}
    </>
  );
};

export default JobWorkDetails;
