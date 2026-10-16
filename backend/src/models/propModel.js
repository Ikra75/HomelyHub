import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName:{
        type:String,
         required:[true,"Please enter your property name"]
    },
    description:{
        type:String,
        required:[true,"Please add your property information"]
    },
    extraInfo:{
        type:String,
        default:"Checkin on time. good services."
    },
    propertyType:{
        type:String,
        enum:["House","Flat","Guest House","Hotel"],
        default:"House"
    },
    roomType:{
        type:String,
        enum:["AnyType","Home","Entire Home"],
        default:"AnyType"
    },
    maximumGuest:{
        type:Number,
        required:[true,"Please give the max no. of guest that can occupy"]
    },
    amenities:[
         {
            name:{
                type:String,
                required:true,
                enum:[
                    "Wifi",
                    "Kitchen",
                    "AC",
                    "Washing Machine",
                    "TV",
                    "Pool",
                    "Free Parking"

                ]
            },
            icon:{
                type:String,
                required:true
            }
         }
    ],
    images:{
        type:[
            {
                public_id:{
                    type:String
                },
                url:{
                    type:String,
                    reuired:true
                }
            }
        ],
        validate:{
            validator:function(arr){
                return arr.length >+6;
            },
            message:"The images must contain atleast 6 images"
        }
    },
    price:{
        type:Number,
        required:[true,"please enter the price per night value"],
        default:500
    },
    address:{
        area:String,
        city:String,
        state:String,
        pincode:Number
    },
    currentBookings:[
       {
    bookingId:{
         type: mongoose.Schema.Types.ObjectId,
        ref:"Booking"
        },
    fromDate:{
        type:Date
    },
    toDate:{
        type:Date
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  }
],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    slug:String,
    checkInTime:{type:String,default:"11:00"},
     checkInOut:{type:String,default:"13:00"},
})

propertySchema.pre("save",function(){
    this.slug =slugify(this.propertyName,{lower:true});
   
})

propertySchema.pre("save",function(){
    this.address.city = this.address.city.toLocaleLowerCase().replaceAll(" ","")
   
})


const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);
export{Property};