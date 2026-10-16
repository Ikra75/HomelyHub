import { propertyAction } from "./property-slice.js";
import {axiosInstance} from "../../utils/axios";

//get all props
//start api req
//tell redux loading started
//get search parameter
//call backend api and wait for response
//get prop data
//send data to redux store
//if error send error to r


//dispatch is send to redux

export  const getAllProperties=()=>async(dispatch,getState)=>{
    try{
        console.log("API call started");
        dispatch(propertyAction.getRequests())
        const{searchParams} = getState().properties
        console.log(searchParams);
       const response = await axiosInstance.get(`/v1/rent/listing`,{
            params:{...searchParams}
      });
        if(!response){
            throw new Error("Could not fetch any properties")
        }
        const {data}= response;
        console.log(data);
        dispatch(propertyAction.getProperties(data))
    }catch(error){
         dispatch(propertyAction.getErrors(error.message))
    }
}