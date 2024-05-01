import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { GlobalStyle } from '../../../globalStyle';
import SearchableComponent from '../../components/Search/SearchComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/action/Ui/Uislice';
import { getAssignJobDetails } from '../../services/jobwork/jobwork.service';
import { setAssignJobs } from '../../redux/action/assignJob/assignJobSlice';
import { RootState } from '../../redux/store';
import NoDataFound from '../../components/UI/NoData';

const JobworkReport = () => {
  const [reportData, setReportData]: any = useState([]);
  const { assignJobs } = useSelector((state: RootState) => state.assignJobs)
  const dispatch = useDispatch();
  const handleFilter = () => {
    console.log('filter');
  }
  useEffect(() => {
    console.log('assignJobs-----------', assignJobs)
    setReportData(assignJobs)
  }, [assignJobs])
  useEffect(() => {
    dispatch(setLoading(true))
    getAssignJobDetails().then((res) => {
      console.log('-----res', res);

      dispatch(setAssignJobs(res))
    }).finally(() => dispatch(setLoading(false)))
  }, [])
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
                      {/* <Pressable onPress={() => setIsVisible(true)}>
                      <Icon
                        type="feather"
                        name="more-vertical"
                        color="gray"
                        size={30}
                      />
                    </Pressable> */}
                    </View>
                  </View>
                </View>
              )) : <>
                <NoDataFound />
              </>}
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
        {/* {isVisible &&
        <ActionBarModel
          modalHeight={'30%'}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          editAction={() => console.log('edit Receive')}
          deleteAction={() => console.log('delete Receive')}
          isExtraButton={true}
          extraButton={
            <TouchableOpacity
              onPress={() =>navigation.navigate('AssignJobwork') }
              style={[GlobalStyle.btn, { borderRadius: 15 }]}
            >
              <Icon type="material" name="assignment-ind" color="gray" size={25} />
              <Text
                style={{
                  color: "gray",
                  marginLeft: 10,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Assign
              </Text>
            </TouchableOpacity>
          }
        />
      } */}
      </SafeAreaView>
    </>
  )
}

export default JobworkReport;