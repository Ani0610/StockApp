import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import userReducer from "./action/User/userSlice";
import stoneReducer from "./action/StoneDetails/stoneSlice";
import designReducer from "./action/DesignDetails/designSlice";
import jobworkReducer from "./action/Job Work details/jobDetailsSlice";
import designMasterReducer from "./action/DesignsMaster/designMasterSlice";
import stoneStockReducer from "./action/Stone Stock/stoneStock";
import jobTeamReducer from "./action/ job work/JobTeamSlice";
import worPerDayReducer from "./action/ job work/WorkPerDaySlice";
import usersMasterReducer from "./action/User Master/userMasterSlice";
import challanReducer from "./action/Challan/ChallanSlice";

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
});

const persistConfig = {
  key: "root", // key for AsyncStorage
  storage: AsyncStorage,
  whitelist: [
    "user",
    "jobWorks",
    "stone",
    "designs",
    "stoneStock",
    "userMaster",
    "challan",
    "designMaster",
  ],
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
