import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import crypto from "node:crypto";
import { type } from "node:os";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        trim:true,
        maxLength:[50,"Your name cannot be longer than 50 characters"]
    },
    email:{
         type:String,
         required:[true,"Please enter your email ID"],
         unique:true,
         lowecase:true,
         trim:true,
         validate: {
            validator: (value) => 
                validator.isEmail(value),
            message:"Please enter valid email address"
         }
       //  validate:[validate.isEmail,"Please enter valid email address"]
    },
    password:{
         type:String,
         required:[true,"Please enter Password"],
         minlength:[6,"Your password must be longer than 6 characters"],
         select:false
    },
    passwordConfirm:{
         type:String,
         required:[true,"Please confirm your Password"],
         validate:{
            validator:function(el){
                return el === this.password
            },
            message:"Password are not the same !"
         }
    },
    phoneNumber:{
        type:String,
        required:[true,"Please enter your phone number"],
        unique:true,
        trim:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    avatar:{
        url:{type:String},
        public_id:{type:String}
    },
    passwordChangedAt:{
        type:Date
    },
    passwordResetToken:{
        type:String,
        select:false,
        index:true
    },
    passwordResetExpires:{
        type:Date,
        select:false
    },
}, {timestamps:true}
);


//for extra setting to not pass the response from the server
userSchema.set("toJSON",{
    transform:function(doc,ret){
        delete ret.password;
         delete ret.passwordConfirm;
         delete ret.passwordResetToken;
         delete ret.passwordResetExpires;
         delete ret.__v;
         return ret;
    }
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined
    next();
});


//login check
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
           this.passwordChangedAt.getTime() / 1000,
           10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};


//forget password
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetToken = Date.now() +10 *60 *100;
    return resetToken;
}


const User = mongoose.model("User", userSchema);
export default User;
