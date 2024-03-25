import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userMaster: [],
}
const userMasterSlice = createSlice({
    name: 'SET_USER_MASTER',
    initialState,
    reducers: {
        setUsers: (state: any, action) => {
            state.userMaster = action.payload
        },
        addUsers: (state: any, action) => {
            state.userMaster = [...state.userMaster, action.payload]
        },
        editUsers: (state: any, action) => {
            const findIndex = state.userMaster.findIndex((item: any) => item.useruid === action.payload.useruid)
            state.userMaster[findIndex] = action.payload
        },
        deleteUsers: (state: any, action) => {
            state.userMaster = state.userMaster.filter((item: any) => item.useruid !== action.payload.useruid)
        },
    }
})
export const { setUsers, addUsers, editUsers, deleteUsers } = userMasterSlice.actions;

const usersMasterReducer = userMasterSlice.reducer;
export default usersMasterReducer;
