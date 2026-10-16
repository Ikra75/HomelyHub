import {propertyDetailsAction} from "./propertyDetails-slice"
import { axiosInstance } from "../../utils/axios"

//from id
//rec prop id
//start loading
//call backend api
//wait for res
//get data
//store details in redux
//error store in redux if happen


export const getPropertyDetails = (id) => async(dispatch) =>{
    try{
        dispatch(propertyDetailsAction.getListRequest());
        const response = await axiosInstance(`/v1/rent/listing/${id}`)
        console.log(response);
        if(!response){
            throw new Error("Could not fetch any propertyDetails");
        }
        const {data}= response.data;
        dispatch(propertyDetailsAction.getPropertyDetails(data))
    }catch(error){
       // const errorMessage = error.response?.data?.error || error.message || "something went wrong";
         dispatch(propertyDetailsAction.getErrors(error.response.data.error));
    }
}
