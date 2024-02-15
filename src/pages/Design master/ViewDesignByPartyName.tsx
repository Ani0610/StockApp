import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-easy-icon";
import { GlobalStyle } from "../../../globalStyle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatDate } from "../../services/dateFormate";
import { setLoading } from "../../redux/action/Ui/Uislice";

const ViewDesignByPartyName = ({ navigation, route }: any) => {
  const { partyMaster } = useSelector((state: RootState) => state.partyMaster);
  const dispatch = useDispatch();
  const [partyData, setPartyData] = useState<any>();
  useEffect(() => {
    const party = partyMaster.find(
      (obj: any) => obj.partyName === route.params.partyName
    );
    setPartyData(party);
  }, [route.params]);
  const editDesign = (item: any) => {
    dispatch(setLoading(true));
    navigation.navigate("Add Design", item);
  };
  return (
    <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 20,
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.goBack()}
        >
          <Icon type="feather" name="arrow-left" color="#000" size={35} />
        </TouchableOpacity>
        <View
          style={{
            flex: 5,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: -35,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Party Wise Sample
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 14, color: "gray" }}>PARTY NAME</Text>
          <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
            {route.params.partyName}
          </Text>
        </View>
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 14, color: "gray" }}>ADDRESS</Text>
          <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
            {partyData?.address ? partyData.address : ""}
          </Text>
        </View>
        <View style={{ borderWidth: 0.5, borderColor: "#000", padding: 15 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "gray" }}>Related Sample</Text>
            <View
              style={{
                backgroundColor: "#dee0e3",
                padding: 2,
                paddingHorizontal: 5,
                borderRadius: 50,
                marginLeft: 20,
              }}
            >
              <Text style={{ color: "gray" }}>{route.params.data.length}</Text>
            </View>
          </View>
        </View>

        <View>
          {route.params.data.map((item: any, index: any) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                padding: 10,
                borderBottomColor: "#000",
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
                    onPress={
                      () => editDesign(item)
                      //  navigation.navigate("Add Design", item)
                    }
                  >
                    <Icon type="feather" name="edit" color="#fff" size={15} />
                  </Pressable>
                  <Pressable
                    style={{
                      backgroundColor: "gray",
                      padding: 5,
                      borderRadius: 50,
                      marginLeft: 5,
                    }}
                    onPress={() => navigation.navigate("View Design", item)}
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
        <View style={{ padding: 15 }}>
          <Text style={{ color: "gray", fontSize: 14 }}>
            Party name & address
          </Text>
          <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
            {route.params.partyName}{" "}
            {partyData?.address ? `, ${partyData.address}` : ""}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewDesignByPartyName;
