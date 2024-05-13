import { View, Text, StatusBar, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { GlobalStyle } from '../../../globalStyle'
import SearchableComponent from '../../components/Search/SearchComponent'
import Icon from 'react-native-easy-icon'
import ActionBarModel from '../../components/ActionBarModel/ActionBarModel'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getAssignJobDetailsForUID, updateAssignJobDetails } from '../../services/jobwork/jobwork.service'
import { setLoading } from '../../redux/action/Ui/Uislice'
import { editAssignJob, setAssignJobs } from '../../redux/action/assignJob/assignJobSlice'
import NoDataFound from '../../components/UI/NoData'
import SegmentedControl from '../../components/UI/SegmentControl'

const CurrentJobWork = () => {
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const [rowData, setRowData] = useState()
  const { user }: any = useSelector((state: RootState) => state.user);
  const { assignJobs }: any = useSelector((state: RootState) => state.assignJobs);
  const [reportData, setReportData]: any = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0);
  const segmentButton = ['PENDING', 'COMPLETED'];
  useEffect(() => {
    if (user && user.partyUid)
      dispatch(setLoading(true))
    getAssignJobDetailsForUID(user?.partyUid).then((res) => {
      console.log('jobworks', res)
      if (res)
        dispatch(setAssignJobs(res))
    }
    ).finally(() => dispatch(setLoading(false)))
  }, [user])

  useEffect(() => {
    if (assignJobs?.length)
      setReportData(assignJobs)
    else
      setReportData([])
    handleIndexChange(selectedIndex)
  }, [assignJobs])
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
    console.log('data------------', data);
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

  const handleFilter = () => {
    console.log('filter');
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
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View style={{ paddingTop: 10 }}>
              <SegmentedControl
                values={segmentButton}
                selectedIndex={selectedIndex}
                onValueChange={handleIndexChange}
              />
            </View>
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
                    {/* <Text style={GlobalStyle.label}>Assign To</Text> */}
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
                    {/* <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.assignedTo}
                      </Text> */}
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.piece}
                    </Text>
                  </View>
                  <View style={GlobalStyle.rightSide}>
                    {item.status !== "COMPLETED" &&
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Pressable onPress={() => {
                          setIsVisible(true);
                          setRowData(item);
                        }}>
                          <Icon
                            type="feather"
                            name="more-vertical"
                            color="gray"
                            size={30}
                          />
                        </Pressable>
                      </View>
                    }
                  </View>
                </View>
              )) :
                <View>
                  <NoDataFound />
                </View>}
            </View>
          </View>
        </ScrollView>
        {/* <Pressable
            style={{
              position: "absolute",
              bottom: 40,
              right: 20,
              backgroundColor: "blue",
              padding: 16,
              borderRadius: 50,
            }}
            onPress={() => navigation.navigate('AddEditReceiveMaal')}
          >
            <Icon type="feather" name="plus" color="white" size={35} />
          </Pressable> */}
        {isVisible &&
          <ActionBarModel
            modalHeight={'30%'}
            isEditable={false}
            isDeletable={false}
            isVisible={isVisible}
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
                  Job Completed
                </Text>
              </TouchableOpacity>
            }
          />
        }
      </SafeAreaView>
    </>
  )
}

export default CurrentJobWork;