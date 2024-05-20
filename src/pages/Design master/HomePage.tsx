import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import Card from "../../components/Card/Card"; // Ensure this path is correct
import Icon from "react-native-easy-icon";
import { useDispatch, useSelector } from "react-redux";
import { GlobalStyle } from "../../../globalStyle";
import ActionBarModel from "../../components/ActionBarModel/ActionBarModel";
import NoDataFound from "../../components/UI/NoData";
import { setLoading } from "../../redux/action/Ui/Uislice";
import {
  editAssignJob,
  setAssignJobs,
} from "../../redux/action/assignJob/assignJobSlice";
import { RootState } from "../../redux/store";
import {
  getAssignJobDetails,
  updateAssignJobDetails,
} from "../../services/jobwork/jobwork.service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDesignDetails, getTotalDesignCount } from "../../services/Design/Design.Service";
const HomePage = ({ navigation}: any) => {
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchTotalCount = async () => {
      const storedCount = await AsyncStorage.getItem('totalCount');
      if (storedCount !== null) {
        setTotalCount(parseInt(storedCount));
      } else {
        const count = await getTotalDesignCount();
        setTotalCount(count);
        await AsyncStorage.setItem('totalCount', count.toString());
      }
    };
    fetchTotalCount();
  }, []);

  const sampleDetails = [{ label: "Sample Created", value: totalCount }];

  const deliveredDetails = [{ label: "Order", value: 0 }];
  const pendingDetails = [{ label: "Order", value: 0 }];

  const [pendingJobs, setPendingJobs] = useState([]);
  const { assignJobs } = useSelector((state: RootState) => state.assignJobs);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    getAssignJobDetails()
      .then((res) => {
        dispatch(setAssignJobs(res));
      })
      .finally(() => dispatch(setLoading(false)));
  }, []);

  // Filter pending jobs
  useEffect(() => {
    if (assignJobs && assignJobs.length) {
      const pendingJobs = assignJobs?.filter(
        (data: any) => data?.status !== "COMPLETED"
      );
      setPendingJobs(pendingJobs);
    }
  }, [assignJobs]);

  const updateJobWork = (data: any) => {
    dispatch(setLoading(true));
    const finalData = { ...data, ...{ status: "COMPLETED" } };
    updateAssignJobDetails(finalData)
      .then((res) => {
        if (res) dispatch(editAssignJob(finalData));
      })
      .finally(() => {
        dispatch(setLoading(false));
        setIsVisible(false);
      });
  };


  return (
    <>
      <View style={styles.mainBlueColor}></View>
      <View style={styles.mainView}>
        <ScrollView style={styles.container}>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllSampleDesign")}
            >
              <Card title="Sample" details={sampleDetails} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("DeliveredDesign")}
            >
              <Card title="Delivered" details={deliveredDetails} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Pending Design")}>
                <Card title="Pending Design" details={pendingDetails} />
            </TouchableOpacity>
          </View>

          {/* See More Navigation */}
          {
            pendingJobs?.length ? (
              <View style={styles.pendingView}>
                <Text style={styles.text}>Pending Job Work</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("JobworkReport")}
                >
                  <Text style={{ color: "blue" }}>See more</Text>
                </TouchableOpacity>

              </View>)
              :
              <>
              </>
          }

          {/* Pending Design Report data */}
          <View style={GlobalStyle.container}>
            {pendingJobs?.length ? (
              pendingJobs
                .slice(0, showAll ? pendingJobs.length : 3)
                .map((item: any, i: any) => (
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
                    {/* Left side */}
                    <View style={GlobalStyle.leftSide}>
                      <Text style={GlobalStyle.label}>Job No.</Text>
                      <Text style={GlobalStyle.label}>Challan No.</Text>
                      <Text style={GlobalStyle.label}>Design No.</Text>
                      <Text style={GlobalStyle.label}>Assign To</Text>
                      <Text style={GlobalStyle.label}>Piece</Text>
                    </View>

                    {/* Middle side */}
                    <View style={GlobalStyle.middleSide}>
                      <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.jobNo}
                      </Text>
                      <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.challanNo}
                      </Text>
                      <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.designNo}
                      </Text>
                      <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.jobwork}&nbsp;-&nbsp;{item.partyName}
                      </Text>
                      <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.piece}
                      </Text>
                    </View>

                    {/* Right side */}
                    <View style={GlobalStyle.rightSide}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Action button */}
                        {item.status !== "COMPLETED" && (
                          <Pressable
                            onPress={() => {
                              setIsVisible(true);
                              setRowData(item);
                            }}
                          >
                            <Icon
                              type="feather"
                              name="more-vertical"
                              color="gray"
                              size={30}
                            />
                          </Pressable>
                        )}
                      </View>
                    </View>
                  </View>
                ))
            ) : (
              <NoDataFound />
            )}
          </View>

          {/* Action model */}
          {isVisible && (
            <ActionBarModel
              modalHeight={"30%"}
              isVisible={isVisible}
              isEditable={false}
              isDeletable={false}
              onClose={() => setIsVisible(false)}
              editAction={() => console.log("edit Receive")}
              deleteAction={() => console.log("delete Receive")}
              isExtraButton={true}
              extraButton={
                <TouchableOpacity
                  onPress={() => updateJobWork(rowData)}
                  style={[GlobalStyle.btn, { borderRadius: 15 }]}
                >
                  <Icon
                    type="material"
                    name="check-box"
                    color="gray"
                    size={25}
                  />
                  <Text
                    style={{
                      color: "gray",
                      marginLeft: 10,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    Mark as complete
                  </Text>
                </TouchableOpacity>
              }
            />
          )}
        </ScrollView>
        <Pressable
          style={{
            position: "absolute",
            bottom: 110,
            right: 20,
            backgroundColor: "#24acf2",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => navigation.navigate("Add Design")}
        >
          <Icon type="feather" name="plus" color="white" size={20} />
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#FFF",
    padding: 16,
  },
  mainBlueColor: {
    height: 100,
    backgroundColor: "#24acf2",
  },
  mainView: {
    height: "100%",
    position: "relative",
    top: -80,
    paddingBottom: 50,
  },
  topHalf: {
    flex: 1,
    backgroundColor: "#e5e5e5",
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  text: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  HeaderTitle: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  pendingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  bg: {
    backgroundColor: "red",
    height: 100,
    padding: 0,
    position: "absolute",
    zIndex: 99999,
    top: 100,
  },
  poSi: {
    position: "relative",
  },
});

export default HomePage;
