import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer
} from "redux-persist";
import jobTeamReducer from "./action/ job work/JobTeamSlice";
import worPerDayReducer from "./action/ job work/WorkPerDaySlice";
import categoryReducer from "./action/Category/categorySlice";
import challanReducer from "./action/Challan/ChallanSlice";
import designReducer from "./action/DesignDetails/designSlice";
import designMasterReducer from "./action/DesignsMaster/designMasterSlice";
import jobworkReducer from "./action/Job Work details/jobDetailsSlice";
import stoneStockReducer from "./action/Stone Stock/stoneStock";
import stoneReducer from "./action/StoneDetails/stoneSlice";
import uiReducer from "./action/Ui/Uislice";
import usersMasterReducer from "./action/User Master/userMasterSlice";
import userReducer from "./action/User/userSlice";
import deliveredDesignReducer from "./action/delivered design/deliveredDesignSlice";
import partyMasterReducer from "./action/party master/PartymasterSlice";
import receiveMaalReducer from "./action/receive_maal/receiveMaalSlice";
import assignJobReducer from "./action/assignJob/assignJobSlice";

const rootReducer = combineReducers({
  user: userReducer,
  stone: stoneReducer,
  designs: designReducer,
  jobWorks: jobworkReducer,
  designMaster: designMasterReducer,
  stoneStock: stoneStockReducer,
  perDayWorks: worPerDayReducer,
  teams: jobTeamReducer,
  userMaster: usersMasterReducer,
  challan: challanReducer,
  partyMaster: partyMasterReducer,
  ui: uiReducer,
  deliveredDesigns: deliveredDesignReducer,
  categories: categoryReducer,
  receiveMaal: receiveMaalReducer,
  assignJobs: assignJobReducer

});

const persistConfig = {
  key: "root", // key for AsyncStorage
  storage: AsyncStorage,
  whitelist: ["user"],
  blacklist: [
    "jobWorks",
    "stone",
    "designs",
    "stoneStock",
    "userMaster",
    "challan",
    "designMaster",
    "partyMaster",
    "deliveredDesigns",
    "categories",
    "receiveMaal",
    "assignedJobs"
  ]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
