import React, { useEffect, useState } from "react";
import {
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
  Alert,
} from "react-native";
import { GlobalStyle } from "../../../globalStyle";
import * as yup from "yup";
import { FieldArray, FormikProvider, useFormik } from "formik";
import Icon from "react-native-easy-icon";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { RootState } from "../../redux/store";
import {
  addjobTeam,
  editjobTeam,
  editJobworkTeamPerson,
  editTeamJobWork,
  getJobWorkTeamPersons,
  addJobworkTeamPerson,
  deletejobTeam,
} from "../../redux/action/ job work/JobTeamSlice";
import SelectDropdown from "react-native-select-dropdown";
import {
  addTeam,
  getJobWorkTeam,
  updateJobWorkTeam,
  deleteJobWorkTeamById,
  addJobWorkTeam,
  checkTeamExists,
  addJobWorkTeamPerson,
  editMyJobWorkTeam,
  editJobWorkTeamPerson,
  getMyJobWorkTeam,
  getMyJobWorkTeamPersons,
  addJobWorkTeamIfNotExists,
  addJobWorkTeamPersonIfNotExists,
} from "../../services/master/master.service";

var heightY = Dimensions.get("window").height;

interface InitialFormValues {
  partyName: string;
  workType: string;
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
  const { teams }: any = useSelector((state: RootState) => state.teams);
  const { jobWorks } = useSelector((state: RootState) => state.jobWorks);
  const [team, setTeam] = useState<any[]>([]);
  const [teamPersons, setTeamPersons] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      partyName: user.userType === "Job Work" ? user.partyName : "",
      workType: user.userType === "Job Work" ? user.workType : "",
      teamName: "",
      teamPersonName: [{ personName: "" }],
      useruid: user.userType === "Job Work" ? user.useruid : "",
      price: user.userType === "Job Work" ? user.price : "",
      id: undefined,
    }
  );
  const teamSchema = yup.object().shape({
    partyName: yup.string().required("Party Name is required"),
    workType: yup.string().required("Work Type is required"),
    itemName: yup.string().required("Team Name is required"),
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
        // Update operation
        updateJobWorkTeam(values)
          .then((res) => {
            if (res) {
              dispatch(editjobTeam({ ...values }));
              dispatch(
                setToast({
                  message: "Team updated successfully",
                  isVisible: true,
                  type: "success",
                })
              );
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
            console.error("Error updating team:", error);
            dispatch(
              setToast({
                message: "Something went wrong",
                isVisible: true,
                type: "danger",
              })
            );
          });
      } else {
        addTeam(values)
          .then(async (res) => {
            if (res) {
              dispatch(addjobTeam({ ...res }));
              dispatch(
                setToast({
                  message: "Team added successfully",
                  isVisible: true,
                  type: "success",
                })
              );

              try {
                if (await checkTeamExists(values.itemName)) {
                  setError(
                    "Team name already exists. Please choose another name."
                  );
                  return;
                }
                // await addJobWorkTeamIfNotExists();
                const teamData = {
                  teamName: values.itemName,
                  jobID: res.id,
                  partyName: values.partyName,
                  workType: values.workType,
                };
                const newTeam = await addJobWorkTeam(teamData);
                dispatch(addjobTeam(newTeam));

                //   await addJobWorkTeamPersonIfNotExists();
                if (values.teamPersonName && values.teamPersonName.length > 0) {
                  for (const member of values.teamPersonName) {
                    const personData = {
                      teamID: newTeam.id,
                      jobID: res.id,
                      personName: member.personName,
                    };
                    await addJobWorkTeamPerson(personData);
                  }
                } else {
                  console.log("No team members found");
                }
              } catch (err) {
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
            console.error("Error adding team:", error);
            setError(error.message);
            dispatch(
              setToast({
                message: "Error adding team: " + error.message,
                isVisible: true,
                type: "danger",
              })
            );
          });
      }
      setShowModal(false);
      setUpdate(false);
      resetForm();
    },
  });

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
    if (user.userType === "Job Work") {
      const tm: any = teams.filter(
        (item: any) => item.useruid === user.useruid
      );
      setTeam([...tm]);
    } else {
      setTeam([...teams]);
    }
  }, [user.userType, teams]);

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
      const fetchedData = await getJobWorkTeam();
      if (fetchedData) {
        setTeam(fetchedData);
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
    // setFieldValue("teamName", data.teamName);
    setFieldValue("itemName", data.itemName);
    setFieldValue("teamPersonName", data.teamPersonName);
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
    fetchJobWorkTeamPersonsData();
  }, []);

  const fetchJobWorkTeamData = async () => {
    try {
      const fetchedJobWorkTeam = await getMyJobWorkTeam();
      if (fetchedJobWorkTeam) {
        // Update the form fields with the fetched jobWorkTeam data
        const { teamName, partyName, workType } = fetchedJobWorkTeam;
        setFieldValue("itemName", teamName);
        setFieldValue("partyName", partyName);
        setFieldValue("workType", workType);
        setTeam(fetchedJobWorkTeam);
      } else {
        setTeam([]);
      }
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
          deleteJobWorkTeamById(data)
            .then((res) => {
              dispatch(setLoading(false));
              if (res) {
                dispatch(deletejobTeam(data));
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
                      {teamPersons && Array.isArray(teamPersons)
                        ? teamPersons
                            .filter((person: any) => person.teamID === item.id)
                            .map((person: any) => person.personName)
                            .join(", ")
                        : "No persons"}
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
            backgroundColor: "blue",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => setShowModal(true)}
        >
          <Icon type="feather" name="plus" color="white" size={35} />
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
                      Add Team Details
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
                    {user.userType === "Job Work" ? (
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
                                setFieldValue("useruid", selectedItem.id);
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
                            onChangeText={handleChange("itemName")}
                            onBlur={() => {
                              handleBlur("itemName");
                            }}
                            value={values.itemName}
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
                                  size={25}
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
