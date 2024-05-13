import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-easy-icon";
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStyle } from '../../../globalStyle';
import ActionBarModel from '../../components/ActionBarModel/ActionBarModel';
import SearchableComponent from '../../components/Search/SearchComponent';
import NoDataFound from '../../components/UI/NoData';
import SegmentedControl from '../../components/UI/SegmentControl';
import { setLoading } from '../../redux/action/Ui/Uislice';
import { editAssignJob, setAssignJobs } from '../../redux/action/assignJob/assignJobSlice';
import { RootState } from '../../redux/store';
import { getAssignJobDetails, updateAssignJobDetails } from '../../services/jobwork/jobwork.service';
// import { updateJobWork } from '../../services/master/master.service';

const JobworkReport = () => {
  const [reportData, setReportData]: any = useState([]);
  const { assignJobs } = useSelector((state: RootState) => state.assignJobs)
  const dispatch = useDispatch();
  const handleFilter = () => {
    console.log('filter');
  }
  const [isVisible, setIsVisible] = useState(false);
  const [rowData, setRowData] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const segmentButton = ['PENDING', 'COMPLETED'];
  useEffect(() => {
    // setReportData(assignJobs)
    handleIndexChange(selectedIndex)
  }, [assignJobs])
  useEffect(() => {
    dispatch(setLoading(true))
    getAssignJobDetails().then((res) => {
      console.log('-----res', res);

      dispatch(setAssignJobs(res))
    }).finally(() => dispatch(setLoading(false)))
  }, [])
  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
    // console.log(index);
    if (index === 0) {
      let InChallan = assignJobs?.length && assignJobs.filter((data: any) => data?.status !== "COMPLETED")
      setReportData(InChallan)
    } else {
      let InChallan = assignJobs?.length && assignJobs.filter((data: any) => data.status === "COMPLETED")
      setReportData(InChallan)
    }
  };

  const updateJobWork = (data: any) => {
    dispatch(setLoading(true));
    const finalData = { ...data, ...{ status: "COMPLETED" } }
    updateAssignJobDetails(finalData).then((res) => {
      if (res)
        dispatch(editAssignJob(finalData))
    }).finally(() => {
      dispatch(setLoading(false));
      setIsVisible(false)
    })
  }

  return (
    <>
      <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{ paddingHorizontal: 15 }}>
          <SearchableComponent
            data={[]}
            searchKey="jobNo"
            placeholder={"job number"}
            onFilter={handleFilter}
          />
        </View>
        <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
          <SegmentedControl
            values={segmentButton}
            selectedIndex={selectedIndex}
            onValueChange={handleIndexChange}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {reportData?.length ? reportData?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Job No.</Text>
                    <Text style={GlobalStyle.label}>Challan No.</Text>
                    <Text style={GlobalStyle.label}>Design No.</Text>
                    <Text style={GlobalStyle.label}>Assign To</Text>
                    <Text style={GlobalStyle.label}>Piece</Text>
                  </View>
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
                  <View style={GlobalStyle.rightSide}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.status !== "COMPLETED" &&
                        <Pressable onPress={() => { setIsVisible(true); setRowData(item); }}>
                          <Icon
                            type="feather"
                            name="more-vertical"
                            color="gray"
                            size={30}
                          />
                        </Pressable>
                      }
                    </View>
                  </View>
                </View>
              )) : <>
                <NoDataFound />
              </>}
            </View>
          </View>
        </ScrollView>

        {isVisible &&
          <ActionBarModel
            modalHeight={'30%'}
            isVisible={isVisible}
            isEditable={false}
            isDeletable={false}
            onClose={() => setIsVisible(false)}
            editAction={() => console.log('edit Receive')}
            deleteAction={() => console.log('delete Receive')}
            isExtraButton={true}
            extraButton={
              <TouchableOpacity
                onPress={() => updateJobWork(rowData)}
                style={[GlobalStyle.btn, { borderRadius: 15 }]}
              >
                <Icon type="material" name="check-box" color="gray" size={25} />
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
        }
      </SafeAreaView>
    </>
  )
}

export default JobworkReport;