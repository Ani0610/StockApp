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
  addStone,
  deleteStone,
  editStone,
  setStone,
} from "../../redux/action/StoneDetails/stoneSlice";
import SearchableComponent from "../../components/Search/SearchComponent";
import { addStones, deleteStoneByID, getStones, updateStone } from "../../services/master/master.service";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import AddEditStoneDetails from "./AddEditStoneDetails";


const StoneDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);

  const { stone } = useSelector((state: RootState) => state.stone);
  const [allStone, setAllStone] = useState<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    setAllStone([...stone]);
  }, [stone]);
  useEffect(() => {
    dispatch(setLoading(true))
    getStones().then((res) => {
      dispatch(setLoading(false))
      if (res) {
        dispatch(setStone(res))
      }
      else {
        dispatch(setToast({ message: 'No Data Found', isVisible: true, type: 'danger' }))
      }
    })
  }, []);

  const editStoneDetails=()=>{
    setUpdate(true)
    setShowModal(true)
  }

  const selectCard = (item: number) => {
    setisVisible(true);
    setdata(item);
  };
  const onClose = () => {
    setisVisible(false);
  };
 
  const deleteStoneDetails = () => {
    Alert.alert("Are you sure?", "You want to delete this?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes", onPress: () => deleteStones(data)
      },
    ]);
    setisVisible(false);
  };
  const deleteStones = (data: any) => {
    dispatch(setLoading(true));
    deleteStoneByID(data).then((res) => {
      dispatch(setLoading(false))
      if (res) {
        dispatch(deleteStone(data));
      }
      else {
        dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
      }
    })
  }
  // const handleClose = () => {
  //   setShowModal(false);
  //   setUpdate(false);
  //   resetForm();
  // };
  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setAllStone([...filteredData]);
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
            data={stone}
            searchKey="stoneType"
            placeholder={"stone type"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {allStone?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Stone Type</Text>
                    <Text style={GlobalStyle.label}>Stones/Bag</Text>
                    <Text style={GlobalStyle.label}>Price/Bag</Text>
                    <Text style={GlobalStyle.label}>Price/Stone</Text>
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.stoneType}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.stonePerBag}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.price}₹
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.pricePerStone}₹
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
          onPress={() => setShowModal(true)}
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
                onPress={() => editStoneDetails()}
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
                onPress={() => deleteStoneDetails()}
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
        <AddEditStoneDetails
        showModal={showModal}
        setShowModal={setShowModal}
        update={update}
        setUpdate={setUpdate}
        setisVisible={setisVisible}
        data={data}
        />
      )}
    </>
  );
};

export default StoneDetails;
