import { Property } from "../models/propModel.js";
import { Booking } from "../models/bookingModel.js";

const createOrder = async(req,res)=>{
    const {amount,propertyId,fromDate, toDate, guests} = req.body;
    const orderId = "order_" + Date.now();
    res.json({
        success:true,
        message:"Order created successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })
}

const verifyPayment = async(req,res)=>{
    const {orderId,bookingDetails,forceStatus} = req.body;
    if(forceStatus === "Success"){
        const paymentId = "pay_"+ Date.now();
        const newBooking = await Booking.create({
           user: req.user._id,
           property: bookingDetails.propertyId,
           price:bookingDetails.price,
           fromDate:bookingDetails.fromDate,
           toDate:bookingDetails.toDate,
           guests:bookingDetails.guests,
           numberOfnights:bookingDetails.nights,
           paid:true
        });
        

        const updatedProperty = await Property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push:{
                    currentBookings:{
                        bookingId:newBooking._id,
                        fromDate:bookingDetails.fromDate,
                        toDate:bookingDetails.toDate,
                        userId:req.user_id
                    }
                }
            },
            {new:true}
        );

        res.json({
            success:true,
            message:"Payment successful , Booking confirmed! ",
            paymentId,
            orderId,
            booking: newBooking
        });
    }else{
        res.status(400).json({
            success:false,
            message:"Payment failed",
            orderId
        });
    }
}


const getUserBookings = async(req,res)=>{
    try{
      const bookings = await Booking.find({user:req.user._id});
      res.status(200).json({
        status:"success",
        data:{
            bookings
        }
      })
    }catch(error){
       res.status(401).json({
        status:"fail",
        message:error.message
       })
    }
}

const getBookingDetails = async(req,res)=>{
    try{
        const bookings = await Booking.findById(req.params.bookingId);
        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })
    }catch(error){
         res.status(401).json({
        status:"fail",
        message:error.message
       })
    }
}

export{getBookingDetails,getUserBookings,createOrder,verifyPayment};