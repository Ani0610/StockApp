import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-easy-icon";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { GlobalStyle } from "../../../globalStyle";
import NoDataFound from "../../components/UI/NoData";
import {
  addJobworkTeam,
  deleteJobworkTeam,
  editTeamJobwork,
  setJobworkTeam,
} from "../../redux/action/ job work/JobTeamSlice";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { RootState } from "../../redux/store";
import {
  addJobWorkTeamPerson,
  checkTeamExists,
  createJobWorkTeam,
  deleteJobWorkTeamById,
  deleteNewJobWorkTeamById,
  getJobWorkTeam,
  getMyJobWorkTeam,
  getMyJobWorkTeamPersons,
  editMyJobWorkTeam
} from "../../services/master/master.service";

var heightY = Dimensions.get("window").height;

interface InitialFormValues {
  partyName: string;
  workType: string;
  jobId: string;
  teamName: string;
  teamPersonName: any;
  useruid: "";
  price: "";
  id: undefined;
}
const JobWorkTeam = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);
  const [error, setError] = useState(null);
  const [personName, setPersonName] = useState("");
  // const error = useSelector((state) => state.jobTeamPerson.error);
  const { user }: any = useSelector((state: RootState) => state.user);
  const { jobworkTeams }: any = useSelector((state: RootState) => state.jobworkTeam);
  const { jobWorks } = useSelector((state: RootState) => state.jobWorks);
  const [team, setTeam] = useState<any[]>([]);
  const [teamPersons, setTeamPersons] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      partyName: user.userType === "jobwork" ? user.partyName : "",
      workType: user.userType === "jobwork" ? user.workType : "",
      jobId: "",
      teamName: "",
      teamPersonName: [{ personName: "" }],
      useruid: user.userType === "jobwork" ? user.useruid : "",
      price: user.userType === "jobwork" ? user.price : "",
      id: undefined,
    }
  );
  const teamSchema = yup.object().shape({
    partyName: yup.string().required("Party Name is required"),
    workType: yup.string().required("Work Type is required"),
    teamName: yup.string().required("Team Name is required"),
    teamPersonName: yup.array().of(
      yup.object().shape({
        personName: yup.string().required("Person name is required"),
      })
    ),
  });

  //Old Intial code
  // const formik = useFormik<InitialFormValues>({
  //     initialValues: initialFormValues,
  //     validationSchema: teamSchema,
  //     onSubmit: (async (values: any) => {
  //         console.log(values);
  //         if (update) {
  //             dispatch(editjobTeam({ ...values }))
  //         } else {
  //             values.id = Math.floor(2000 + Math.random() * 9000)
  //             dispatch(addjobTeam({ ...values }))
  //         }
  //         setShowModal(false)
  //         setUpdate(false)
  //         resetForm();
  //     }),
  // });



  //New code
  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: teamSchema,
    onSubmit: async (values: any) => {
      if (update) {
        dispatch(editTeamJobwork({ ...values }));
        dispatch(
          setToast({
            message: "Team updated successfully",
            isVisible: true,
            type: "success",
          })
        );





        // try {
        //   const teamData = {
        //     teamName: values.teamName,
        //     jobId: values.jobId,
        //     partyName: values.partyName,
        //     workType: values.workType,
        //     personName: values.teamPersonName.map((person: any) => person.personName).join(", "),
        //   };
    
        //   console.log("Team Data:", teamData);
        //   console.log("Team Members:", values.teamPersonName);
    
        //   let newTeam = null;
        //   if (update) {
        //     newTeam = await editMyJobWorkTeam(teamData);
        //   } else {
        //     const res = await checkTeamExists(values.teamName);
        //     if (res) {
        //       dispatch(setToast({
        //         message: "Team name already exists. Please choose another name.",
        //         isVisible: true,
        //         type: "danger",
        //       }));
        //       return;
        //     }
        //     newTeam = await createJobWorkTeam(teamData);
        //   }
    
        //   if (newTeam) {
        //     if (update) {
        //       dispatch(editTeamJobwork(newTeam));
        //       dispatch(setToast({
        //         message: "Team updated successfully",
        //         isVisible: true,
        //         type: "success",
        //       }));










      } else {
        console.log(values, 'values')
        dispatch(setLoading(true));
        checkTeamExists(values.teamName).then(async (res) => {
          if (res) {
            dispatch(setToast({
              message: "Team name already exists. Please choose another name.",
              isVisible: true,
              type: "danger",
            }));
            dispatch(setLoading(false));
            return;
          }
          else {
            try {
              const teamData = {
                teamName: values.teamName,
                jobId: values.jobId,
                partyName: values.partyName,
                workType: values.workType,
                personName: values.teamPersonName.map((person: any) => person.personName).join(", ")
              };
              console.log(teamData, values.teamPersonName.map((person: any) => person.personName).join(", "))
              createJobWorkTeam(teamData).then((newTeam: any) => {
                dispatch(addJobworkTeam(newTeam));
                if (values.teamPersonName && values.teamPersonName.length > 0) {
                  for (const member of values.teamPersonName) {
                    const personData = {
                      teamID: newTeam.id,
                      jobId: values.jobId,
                      personName: member.personName,
                    };
                    addJobWorkTeamPerson(personData);
                  }
                } else {
                  console.log("No team members found");
                }
                dispatch(
                  setToast({
                    message: "Team added successfully",
                    isVisible: true,
                    type: "success",
                  })
                )
              }).finally(() => {
                dispatch(setLoading(false))
                setShowModal(false);
                setUpdate(false);
                resetForm();
              })

            } catch (err: any) {
              setError(err.message);
              console.error("Error adding team:", err);
              dispatch(
                setToast({
                  message: "Error adding team: " + err.message,
                  isVisible: true,
                  type: "danger",
                })
              );
            }
          }
        })
      }

      // await addJobWorkTeamIfNotExists();


    }
  })


  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isValid,
    touched,
    setFieldValue,
    resetForm,
  } = formik;
  const handleClose = () => {
    setShowModal(false);
    setUpdate(false);
    resetForm();
  };
  useEffect(() => {
    if (user.userType === "job") {
      const tm: any = jobworkTeams.filter(
        (item: any) => item.useruid === user.useruid
      );
      setTeam([...tm]);
    } else {
      console.log('jobworkTeams-----------------', jobworkTeams)
      setTeam([...jobworkTeams]);
    }
  }, [user.userType, jobworkTeams]);

  const selectCard = (item: number) => {
    setisVisible(true);
    setdata(item);
  };
  const onClose = () => {
    setisVisible(false);
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  
  const fetchTeamData = async () => {
    try {
      await dispatch(setLoading(true));
      const fetchedData = await getJobWorkTeam();
      console.log('fetchedData', fetchedData)
      await dispatch(setLoading(false))
      if (fetchedData) {
        dispatch(setJobworkTeam(fetchedData))
      } else {
        setTeam([]);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      setTeam([]);
    }
  };

  const editTeam = () => {
    setFieldValue("partyName", data.partyName);
    setFieldValue("workType", data.workType);
    setFieldValue("teamName", data.teamName);
    // setFieldValue("itemName", data.itemName);
    //setFieldValue("teamPersonName", data.personName);

    const personNameArray = data.personName.split(", ").map((name: any) => ({ personName: name }));
    setFieldValue("teamPersonName", personNameArray);


    setFieldValue("useruid", data.useruid);
    setFieldValue("price", data.price);
    setFieldValue("id", data.id);
    setUpdate(true);
    setisVisible(false);
    setShowModal(true);
  };
  //   const deleteTeam = () => {
  //     dispatch(deletejobTeam(data));
  //     setisVisible(false);
  //   };

  useEffect(() => {
    fetchJobWorkTeamData();
    // fetchJobWorkTeamPersonsData();
  }, []);

  const fetchJobWorkTeamData = async () => {
    try {
      dispatch(setLoading(true));
      getMyJobWorkTeam().then((res) => {
        if (res && res.length) {
          dispatch(setJobworkTeam(res));
          // setTeam(res);
        } else {
          dispatch(setJobworkTeam([]));
          // setTeam([]);
        }
      }).finally(() => dispatch(setLoading(false)))
    } catch (error) {
      console.error("Error fetching team data:", error);
      setTeam([]);
    }
  };

  const fetchJobWorkTeamPersonsData = async () => {
    try {
      const fetchedJobWorkTeamPersons = await getMyJobWorkTeamPersons();
      if (fetchedJobWorkTeamPersons) {
        setTeamPersons(fetchedJobWorkTeamPersons);
        console.log(
          "Fetched Job Work Team Persons:",
          fetchedJobWorkTeamPersons
        );
      } else {
        setTeamPersons([]);
      }
    } catch (error) {
      console.error("Error fetching team persons data:", error);
      setTeamPersons([]);
    }
  };

  const deleteTeam = () => {
    Alert.alert("Are you sure?", "You want to delete this?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          dispatch(setLoading(true));
          deleteNewJobWorkTeamById(data)
            .then((res) => {
              dispatch(setLoading(false));
              if (res) {
                dispatch(deleteJobworkTeam(data));
                setShowModal(false); // Update the visibility by closing the modal
              } else {
                dispatch(
                  setToast({
                    message: "Something went wrong",
                    isVisible: true,
                    type: "danger",
                  })
                );
              }
            })
            .catch((error) => {
              dispatch(setLoading(false));
              dispatch(
                setToast({
                  message: "Something went wrong",
                  isVisible: true,
                  type: "danger",
                })
              );
              console.error("Error deleting job team: ", error);
            });
        },
      },
    ]);
  };

  return (
    <>
      <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content" // Here is where you change the font-color
        />
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            {team && team.length ?
              <View>
                {team?.map((item: any, i: any) => (
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
                      <Text style={GlobalStyle.label}>Team Name</Text>
                      <Text style={GlobalStyle.label}>Party Name</Text>
                      <Text style={GlobalStyle.label}>Work Type</Text>
                      <Text style={GlobalStyle.label}>Persons</Text>
                    </View>
                    <View style={GlobalStyle.middleSide}>
                      <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.teamName}
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
                        {item.workType}
                      </Text>
                      <Text
                        style={GlobalStyle.textcolor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                       {item.personName}
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
          onPress={() => setShowModal(true)}
        >
          <Icon type="feather" name="plus" color="white" size={25} />
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
                onPress={() => editTeam()}
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
                onPress={() => deleteTeam()}
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
        <Modal visible={showModal} transparent={false} animationType="slide">
          <ScrollView>
            <FormikProvider value={formik}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  marginVertical: Platform.OS === "ios" ? 30 : 0,
                  zIndex: 0,
                }}
              >
                <View
                  style={{
                    margin: 20,
                    flex: 1,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "black", fontSize: 20 }}>
                      {update ? 'Update Team Details' : 'Add Team Details'}
                    </Text>
                    <Pressable onPress={() => handleClose()}>
                      <Icon
                        type="entypo"
                        name="cross"
                        color="black"
                        size={35}
                      />
                    </Pressable>
                  </View>

                  <View
                    style={{
                      padding: 10,
                    }}
                  >
                    {user.userType === "jobwork" ? (
                      <View style={{ marginTop: 10 }}>
                        <View style={Style.inputField}>
                          <Text style={Style.inputLabel}>Party Name</Text>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TextInput
                              onChangeText={handleChange("partyName")}
                              onBlur={() => {
                                handleBlur("partyName");
                              }}
                              value={values.partyName}
                              style={{ flex: 1, fontSize: 16, color: "#000" }}
                              placeholderTextColor="gray"
                              placeholder="Enter Party Name"
                              editable={false}
                            />
                          </View>
                        </View>
                        {errors.partyName && touched.partyName && (
                          <Text
                            style={[
                              GlobalStyle.errorMsg,
                              { marginHorizontal: 10 },
                            ]}
                          >
                            {errors.partyName}
                          </Text>
                        )}
                      </View>
                    ) : (
                      <View style={{ marginTop: 10 }}>
                        <View style={Style.inputField}>
                          <Text style={Style.inputLabel}>Select Party</Text>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <SelectDropdown
                              data={[...jobWorks]}
                              onSelect={(selectedItem) => {
                                console.log(selectedItem, "selecteditem");
                                setFieldValue("jobId", selectedItem.id);
                                setFieldValue(
                                  "partyName",
                                  selectedItem.partyName
                                );
                                setFieldValue(
                                  "workType",
                                  selectedItem.workType
                                );
                                setFieldValue("price", selectedItem.price);
                              }}
                              buttonTextAfterSelection={(
                                selectedItem: any,
                                index: number
                              ) => {
                                return `${selectedItem?.partyName} `;
                              }}
                              rowTextForSelection={(
                                item: any,
                                index: number
                              ) => {
                                return `${item.partyName}- ${item?.workType}`;
                              }}
                              buttonStyle={{
                                backgroundColor: "transparent",
                                width: "90%",
                              }}
                              defaultButtonText="Select Party Name"
                              buttonTextStyle={{
                                textAlign: "right",
                                marginLeft: -6,
                              }}
                              dropdownStyle={{ width: "80%", borderRadius: 10 }}
                              defaultValue={jobWorks.find(
                                (job: any) => job.id === values.useruid
                              )}
                            />
                          </View>
                        </View>
                      </View>
                    )}
                    <View style={{ marginTop: 15 }}>
                      <View style={Style.inputField}>
                        <Text style={Style.inputLabel}>Work Type</Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <TextInput
                            onChangeText={handleChange("workType")}
                            onBlur={() => {
                              handleBlur("workType");
                            }}
                            value={values.workType}
                            style={{
                              textAlign: "right",
                              fontSize: 16,
                              color: "#000",
                            }}
                            placeholderTextColor="gray"
                            placeholder="Enter work Type"
                            editable={false}
                          />
                        </View>
                      </View>
                      {errors.workType && touched.workType && (
                        <Text
                          style={[
                            GlobalStyle.errorMsg,
                            { marginHorizontal: 10 },
                          ]}
                        >
                          {errors.workType}
                        </Text>
                      )}
                    </View>
                    <View style={{ marginTop: 15 }}>
                      <View style={Style.inputField}>
                        <Text style={Style.inputLabel}>Team Name</Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <TextInput
                            onChangeText={handleChange("teamName")}
                            onBlur={() => {
                              handleBlur("teamName");
                            }}
                            value={values.teamName}
                            style={{
                              textAlign: "right",
                              fontSize: 16,
                              color: "#000",
                            }}
                            placeholderTextColor="gray"
                            placeholder="Enter team name"
                          />
                        </View>
                      </View>
                      {errors.teamName && touched.teamName && (
                        <Text
                          style={[
                            GlobalStyle.errorMsg,
                            { marginHorizontal: 10 },
                          ]}
                        >
                          {errors.teamName}
                        </Text>
                      )}
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <FieldArray name="teamPersonName">
                        {({ replace, remove, push }) => (
                          <View>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{ fontSize: 16, fontWeight: "bold" }}
                              >
                                Team Person Name
                              </Text>
                              <Pressable
                                onPress={() =>
                                  push({
                                    personName: "",
                                  })
                                }
                              >
                                <Icon
                                  type="feather"
                                  name="plus"
                                  color="blue"
                                  size={30}
                                />
                              </Pressable>
                            </View>
                            {values.teamPersonName?.length > 0 &&
                              values.teamPersonName.map(
                                (person: any, i: any) => (
                                  <View
                                    key={i}
                                    style={[
                                      {
                                        borderRadius: 10,
                                        width: "100%",
                                        // marginVertical: 10,
                                      },
                                      {
                                        borderWidth: 0.5,
                                        borderColor: "lightgray",
                                        padding: 5,
                                        marginVertical: 5,
                                      },
                                    ]}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      <Pressable onPress={() => remove(i)}>
                                        <Icon
                                          type="entypo"
                                          name="cross"
                                          color="black"
                                          size={25}
                                        />
                                      </Pressable>
                                    </View>
                                    <View>
                                      <View style={{ marginTop: 15 }}>
                                        <View style={Style.inputField}>
                                          <Text style={Style.inputLabel}>
                                            Person Name
                                          </Text>
                                          <View
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                            }}
                                          >
                                            <TextInput
                                              onChangeText={(text) => {
                                                replace(i, {
                                                  ...person,
                                                  personName: text,
                                                });
                                              }}
                                              value={person.personName}
                                              style={{
                                                textAlign: "right",
                                                fontSize: 16,
                                                color: "#000",
                                              }}
                                              placeholderTextColor="gray"
                                              placeholder="Enter person Name"
                                            />
                                          </View>
                                        </View>
                                        {errors.teamPersonName &&
                                          errors.teamPersonName[i] &&
                                          touched.teamPersonName &&
                                          touched.teamPersonName[i] && (
                                            <Text
                                              style={[
                                                GlobalStyle.errorMsg,
                                                { marginHorizontal: 10 },
                                              ]}
                                            >
                                              {
                                                errors.teamPersonName[i]
                                                  .personName
                                              }
                                            </Text>
                                          )}
                                      </View>
                                    </View>
                                  </View>
                                )
                              )}
                          </View>
                        )}
                      </FieldArray>
                    </View>
                    <Pressable
                      style={GlobalStyle.button}
                      onPress={() => handleSubmit()}
                    >
                      <Text style={GlobalStyle.btntext}>
                        {update ? "Update" : "Submit"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </FormikProvider>
          </ScrollView>
        </Modal>
      )}
    </>
  );
};
const Style = StyleSheet.create({
  cardContainer: { marginBottom: 0 },
  inputField: {
    display: "flex",
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    fontSize: 16,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: { color: "#05E3D5", fontSize: 14 },
  partyName: {
    fontSize: heightY * 0.018,
    marginHorizontal: 10,
    paddingTop: 10,
    fontWeight: "bold",
  },
  price: {
    fontSize: heightY * 0.018,
    margin: 10,
  },
});
export default JobWorkTeam;
