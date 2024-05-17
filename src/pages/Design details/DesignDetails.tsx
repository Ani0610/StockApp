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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addDesign,
  deleteDesign,
  editDesign,
  setDesign,
} from "../../redux/action/DesignDetails/designSlice";
import SearchableComponent from "../../components/Search/SearchComponent";
import { addPapers, deletePaperByID, getPapers, updatePaper } from "../../services/master/master.service";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import AddEditDesignDetails from "./AddEditDesignDetails";


const DesignDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);

  const { designs } = useSelector((state: RootState) => state.designs);
  const [allDesign, setAllDesign] = useState<any>([]);
  const dispatch = useDispatch();

  const selectCard = (item: number) => {
    setisVisible(true);
    setdata(item);
  };
  useEffect(() => {
    setAllDesign([...designs]);
  }, [designs]);
  useEffect(() => {
    dispatch(setLoading(true))
    getPapers().then((res) => {
      dispatch(setLoading(false))
      if (res) {
        dispatch(setDesign(res))
      }
      else {
        dispatch(setToast({ message: 'No data Found', isVisible: true, type: 'danger' }))
      }
    })
  }, []);

  const onClose = () => {
    setisVisible(false);
  };
  const editDesignDetails = () => {
    setisVisible(false);
    setShowModal(true);
  };
  const deleteDesignDetails = () => {
    Alert.alert("Are you sure?", "You want to delete this?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes", onPress: () => deletePaper(data)
      },
    ]);
    setisVisible(false);
  };
  const deletePaper = (data: any) => {
    dispatch(setLoading(true))
    deletePaperByID(data).then((res) => {
      dispatch(setLoading(false))
      if (res)
        dispatch(deleteDesign(data));
      else
        dispatch(setToast({ message: 'No data Found', isVisible: true, type: 'danger' }))

    })
  }

  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setAllDesign([...filteredData]);
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
            data={designs}
            searchKey="mesurement"
            placeholder={"mesurement"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {allDesign?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Mesurement</Text>
                    <Text style={GlobalStyle.label}>Price</Text>
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.mesurement}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.price}₹(1 Meter)
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
            backgroundColor: "#24acf2",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => { setShowModal(true); setdata(null); }}
        >
          <Icon type="feather" name="plus" color="white" size={20} />
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
                onPress={() => editDesignDetails()}
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
                onPress={() => deleteDesignDetails()}
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
        <AddEditDesignDetails
          showModal={showModal}
          setShowModal={setShowModal}
          data={data}
        />
      )}
    </>
  );
};


export default DesignDetails;
