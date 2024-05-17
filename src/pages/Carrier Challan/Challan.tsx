import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-easy-icon";
import { useDispatch, useSelector } from "react-redux";
import { GlobalStyle } from "../../../globalStyle";
import SearchableComponent from "../../components/Search/SearchComponent";
import SegmentedControl from "../../components/UI/SegmentControl";
import {
  deleteChallan,
  setChallan
} from "../../redux/action/Challan/ChallanSlice";
import { RootState } from "../../redux/store";
import { formatDate } from "../../services/dateFormate";
import { getChallanDetails } from "../../services/challan/challan.service";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import NoDataFound from "../../components/UI/NoData";

const Challan = ({ navigation }: any) => {
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);
  const { challan } = useSelector((state: RootState) => state.challan);
  const { user }: any = useSelector((state: RootState) => state.user);
  const [challans, setchallans] = useState<any>([]);
  const [challansData, setchallansData] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const segmentButton = ['In', 'Out'];

  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
    // console.log(index);
    if (index === 0) {
      let InChallan = challan?.length && challan.filter((data: any) => data.challanType === "In")
      setchallans(InChallan)
    } else {
      let InChallan = challan?.length && challan.filter((data: any) => data.challanType === "Out")
      setchallans(InChallan)
    }

  };
  const dispatch = useDispatch();
  const selectCard = (item: number) => {
    setisVisible(true);
    setdata(item);
  };
  useEffect(() => {
    if (challan && challan.length) {
      if (user?.userType === "Carrier") {
        const cha: any = challan.filter(
          (item: any) => item.carrierPersonUid === user.useruid
        );
        setchallans([...cha]);
        setchallansData([...cha]);
      } else {
        // console.log(challan, '-------------------challan');

        if (selectedIndex === 0) {
          let InChallan: any = challan?.length && challan.filter((data: any) => data.challanType === "In")
          setchallansData(InChallan);
          setchallans(InChallan);
        } else {
          let outChallan: any = challan?.length && challan.filter((data: any) => data.challanType === "Out")
          setchallansData(outChallan);
          setchallans(outChallan);
        }

      }
    }
  }, [user?.userType, challan]);

  useEffect(() => {
    dispatch(setLoading(true));
    getChallanDetails().then((res) => {
      if (res) {
        dispatch(setChallan(res))
      } else {
        dispatch(setToast({ message: 'No Data Found', isVisible: true, type: 'danger' }))
      }
    }).catch((e) => console.error(e))
      .finally(() => dispatch(setLoading(false)))
  }, [])

  const onClose = () => {
    setisVisible(false);
  };
  const editchallanDetails = () => {
    setUpdate(true);
    navigation.navigate("Create Challan", data);
    setisVisible(false);
  };
  const deletechallanDetails = () => {
    dispatch(deleteChallan(data));
    setisVisible(false);
  };
  const handleFilter = (filteredData: any) => {
    // console.log("Filtered Data:", filteredData);
    setchallans([...filteredData]);
  };
  return (
    <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      />
      <View style={{ paddingHorizontal: 15 }}>
        <SearchableComponent
          data={challansData}
          searchKey="partyName"
          placeholder={"party name"}
          onFilter={handleFilter}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>

        <View style={[GlobalStyle.container]}>
          <View>
            <SegmentedControl
              values={segmentButton}
              selectedIndex={selectedIndex}
              onValueChange={handleIndexChange}
            />
          </View>
          {challans?.length ?
            <View>
              {challans?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Challan No.</Text>
                    <Text style={GlobalStyle.label}>Date</Text>
                    {/* <Text style={GlobalStyle.label}>Design No</Text> */}
                    <Text style={GlobalStyle.label}>Party Name</Text>
                    <Text style={GlobalStyle.label}>Pieces</Text>
                    <Text style={GlobalStyle.label}>Carrier</Text>
                    <Text style={GlobalStyle.label}>Mobile No</Text>
                    {/* <Text style={GlobalStyle.label}>Status</Text> */}
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.challanNo || "-"}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatDate(item.date)}
                    </Text>
                    {/* <Text
                    style={GlobalStyle.textcolor}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.designNo}
                  </Text> */}
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
                      {item.piece}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.carrierPersonName}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.carrierPersonMobNo}
                    </Text>
                    {/* <Text
                    style={GlobalStyle.textcolor}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.status}
                  </Text> */}
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
            :
            <View>
              <NoDataFound />
            </View>
          }
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
        onPress={() => navigation.navigate("Create Challan")}
      >
        <Icon type="feather" name="plus" color="white" size={20} />
      </Pressable>
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
                onPress={() => editchallanDetails()}
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
                onPress={() => deletechallanDetails()}
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
    </SafeAreaView>
  );
};

export default Challan;
