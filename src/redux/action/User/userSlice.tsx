import { createSlice } from '@reduxjs/toolkit'
import { store } from '../../store'

const initialState = {
    user: null,
}
const userSlice = createSlice({
    name: 'SET_USER',
    initialState,
    reducers: {
        setUser: (state: any, action) => {
            state.user = action.payload
        },
        logOut: (state: any) => {
            state.user = null
            state.stone = []
            state.designs = []
            state.jobWorks = []
            state.designMaster = []
            state.stoneStock = []
            state.perDayWorks = []
            state.jobworkTeam = []
            state.userMaster = []
            state.challan = []
            state.partyMaster = []
            state.deliveredDesigns = []
            state.categories = []
        },
    },

})
export const { setUser, logOut } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
