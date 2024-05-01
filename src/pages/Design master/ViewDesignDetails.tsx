import React, { useState } from "react";
import { GlobalStyle } from "../../../globalStyle";
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-easy-icon";
import { formatDate } from "../../services/dateFormate";

const ViewDesignDetails = ({ navigation, route }: any) => {
  const [selectedImage, setSelectedImage] = useState<any>(false);
  const closeImageModal = () => {
    setSelectedImage(false);
  };
  return (
    <>
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
              Design Details
            </Text>
          </View>
        </View>
        <ScrollView style={{ padding: 10, paddingHorizontal: 15 }}>
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>
                Date
              </Text>
              <Text style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}>
                {formatDate(route.params?.date)}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>
                Stock
              </Text>
              <Text style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}>
                {route.params?.availableStocks}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>
                Design Number
              </Text>
              <Text style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}>
                {route.params?.designNo}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>
                Total
              </Text>
              <Text style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}>
                ₹{route.params?.total}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>
               Final Total
              </Text>
              <Text style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}>
                ₹{route.params ? route.params.grandTotal.toFixed(2):'0.00'}
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
              Designs
            </Text>
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
              <Image
                source={{ uri: route.params.sampleImg[0] }}
                style={{
                  width: "100%",
                  height: 200,
                  resizeMode: "cover",
                }}
              />
              {route.params.sampleImg.length - 1 !== 0 && (
                <TouchableOpacity onPress={() => setSelectedImage(true)}>
                  <Text style={{ color: "gray", alignSelf: "flex-end" }}>
                    +{route.params.sampleImg.length - 1} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {route.params.stoneDetails?.length > 0 && (
            <View>
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                Stone Details
              </Text>
              <View>
                {route.params.stoneDetails?.map((stone: any, i: any) => (
                  <View
                    key={i}
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
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Stone Type
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {stone.stoneType}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Unit
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {stone.stoneunit}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{stone.price}(1 Stone)
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{stone.totalOneStone}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          {route.params.designDetails?.length > 0 && (
            <View>
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                Design Measurement
              </Text>
              <View>
                {route.params.designDetails?.map((design: any, i: any) => (
                  <View
                    key={i}
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
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Measurement/Size
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {design.measurement}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Unit
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {design.designunit}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{design.price}(1 Meter)
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{design.totalOneDesign}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          {route.params.jobworkDetails?.length > 0 && (
            <View>
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                Job Work Details
              </Text>
              <View>
                {route.params.jobworkDetails?.map((job: any, i: any) => (
                  <View
                    key={i}
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
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Work Type
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {job.workType}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Party Name
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {job.partyName}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Unit
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {job.unit}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{job.price}(1 Unit)
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{job.totalOnewJobWork}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {selectedImage && (
        <Modal transparent={true} animationType="fade" visible={selectedImage}>
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: Platform.OS == "ios" ? 25 : 0,
            }}
          >
            <ScrollView style={{ marginTop: 50 }}>
              {route.params.sampleImg.map((img: any, i: any) => (
                <View style={{ width: "100%", alignItems: "center" }} key={i}>
                  <View
                    style={{
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 15,
                      padding: 10,
                      width: "95%",
                      height: "auto",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        aspectRatio: 1,
                        borderWidth: 2,
                        borderColor: "white",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={{ uri: img }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: Platform.OS === "ios" ? 60 : 20,
                right: 20,
              }}
              onPress={closeImageModal}
            >
              <Icon type="entypo" name="cross" color="white" size={30} />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

export default ViewDesignDetails;
