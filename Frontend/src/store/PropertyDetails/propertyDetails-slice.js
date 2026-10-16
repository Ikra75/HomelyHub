//create initial state
//req start
//prop data receive
//error occur
//export actions and slice


import { createSlice } from "@reduxjs/toolkit";

const propertyDetailsSlice = createSlice({
    name:"propertyDetails",
    initialState:{
        propertydetails: null,
        loading:false,
        error:null
    },
    reducers:{
        getListRequest(state){
            state.loading = true
        },
        getPropertyDetails(state,action){
            state.propertydetails = action.payload;
            state.loading = false
        },
        getErrors(state,action){
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const propertyDetailsAction = propertyDetailsSlice.actions;
export default propertyDetailsSlice;