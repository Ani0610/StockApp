import { StyleSheet, Platform } from "react-native";

export const GlobalStyle = StyleSheet.create({
  textinputColor: {
    color: "#000",
  },
  safeAreaCotainer: {
    backgroundColor: "#fff",
  },
  centerContentPage: {
    backgroundColor: "#ffffff",
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  title: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#949494",
    fontSize: 20,
  },
  fieldwithIcon: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
    borderRadius: 15,
    // borderWidth: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 30,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "#05E3D5",
  },
  btntext: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  themeColor: {
    color: "#05E3D5",
  },
  greyColor: {
    color: "#989898",
  },
  blackColor: {
    color: "#1E1E1E",
    fontSize: 16,
  },
  errorMsg: {
    fontSize: 16,
    color: "red",
  },
  container: {
    margin: 15,
    paddingBottom: 85,
  },
  homecontainer: {
    margin: 25,
    paddingBottom: 85,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
    marginVertical: 10,
  },
  leftSide: {
    flex: 3,
    marginRight: 10,
    borderRightWidth: 1,
    borderColor: "black",
    paddingRight: 10,
  },
  middleSide: {
    flex: 6,
  },
  textcolor: {
    fontSize: 14,
    color: "gray",
  },
  rightSide: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  btn: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  shadowProp: {
    shadowColor: "#555",
    shadowOffset: { width: -5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerLeft: { display: "flex", alignItems: "center", flexDirection: "row" },
  tabBar: {
    borderWidth: 0,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -5,
    },

    shadowColor: "#555",
    shadowOpacity: 0.2,
    borderColor: "#fff",
    elevation: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#f5f5f5",
    position: "absolute",
    padding: 10,
    width: "100%",
    height: 80,
  },
  noTabBar: {
    position: "absolute",
    height: 0,
    display: Platform.OS === "ios" ? "none" : "flex",
  },
  profileImg: {
    height: 65,
    width: 65,
    borderRadius: 35, // Half of the height or width for a circular effect
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 2, // Android shadow
  },
});
