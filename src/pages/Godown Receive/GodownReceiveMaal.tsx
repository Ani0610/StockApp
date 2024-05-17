import React, { useEffect, useState } from 'react'
import { Alert, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-easy-icon'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalStyle } from '../../../globalStyle'
import ActionBarModel from '../../components/ActionBarModel/ActionBarModel'
import SearchableComponent from '../../components/Search/SearchComponent'
import { RootState } from '../../redux/store'
import { setLoading, setToast } from '../../redux/action/Ui/Uislice'
import { deleteReceiveMaalDetail, getReceiveMaalDetails } from '../../services/challan/challan.service'
import { deleteReceiveMaal, setReceiveMaal } from '../../redux/action/receive_maal/receiveMaalSlice'
import { updateDesignDetails } from '../../services/Design/Design.Service'
import { editDesignMaster } from '../../redux/action/DesignsMaster/designMasterSlice'
import NoDataFound from '../../components/UI/NoData'

const GodownReceiveMaal = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<any>();
  const { receiveMaal } = useSelector((state: RootState) => state.receiveMaal);
  const { designsMaster } = useSelector((state: RootState) => state.designMaster);

  const handleFilter = () => {
    console.log('fiter')
  }

  useEffect(() => {
    dispatch(setLoading(true))
    getReceiveMaalDetails().then((res: any) => {
      if (res)
        dispatch(setReceiveMaal(res))
      else
        dispatch(setToast({ message: 'No Data Found', isVisible: true, type: 'danger' }))

    }).catch(e => console.error(e)).finally(() => {
      dispatch(setLoading(false))
    })
  }, [])

  const deleteReceiveMaalAlert = () => {
    Alert.alert("Are you sure?", `You want to delete this?It may impact on your design stock`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes", onPress: (async () => {
          dispatch(setLoading(true))
          deleteReceiveMaalDetail(data).then((res) => {
            if (res) {
              dispatch(deleteReceiveMaal(data))
            }
          }).finally(async () => {
            const data1: any = await designsMaster.find(
              (obj: any) =>
                obj.partyUID === data.partyUID
                &&
                obj.designNo == data.designNo
            );
            if (data) {
              const newData1 = {
                ...data1,
                availableStocks:
                  Number(data1.availableStocks) - Number(data?.piece),
              };
              console.log(newData1.availableStocks);
              updateDesignDetails(newData1).then((res) => {
                if (res)
                  dispatch(editDesignMaster({ ...newData1 }));
                else
                  dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
              }).finally(() => {
                dispatch(setLoading(false))
              })
            }
          })
        })
      }
    ]);
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
            data={[]}
            searchKey="jobNo"
            placeholder={"job number"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            {receiveMaal?.length ?
              <View>
                {receiveMaal?.map((item: any, i: any) => (
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
                      <Text style={GlobalStyle.label}>Party Name</Text>
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
                        {item.partyName}
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
                        <Pressable onPress={() => { setData(item); setIsVisible(true) }}>
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
              <NoDataFound />
            }
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
          onPress={() => navigation.navigate('AddEditReceiveMaal', receiveMaal)}
        >
          <Icon type="feather" name="plus" color="white" size={20} />
        </Pressable>
        {isVisible &&
          <ActionBarModel
            modalHeight={'30%'}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            isEditable={false}
            editAction={() => { navigation.navigate("AddEditReceiveMaal", { rowData: data }) }}
            deleteAction={() => deleteReceiveMaalAlert()}
            isExtraButton={true}
            extraButton={
              <TouchableOpacity
                onPress={() => navigation.navigate('AssignJobwork', { rowData: data })}
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
        }
      </SafeAreaView>
    </>
  )
}

export default GodownReceiveMaal