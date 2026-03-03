import mongoose from "mongoose";
const appointmentSchema= new mongoose.Schema({
    
    patientName:{
        type:String,
        required: true,
    },

    patientAge: {
        type : String,
        required : true,
    },

    gender: {
        type: String,
        required: true,
    },

    contactNumber: {
        type:String,
        required : true,
    },

    doctorName: {
        type : String,
        required: true,
    },
    priority:{
        type : String,
        required: true,
    },

    appointmentDate: {
        type : String,
        required: true,
    },

    appointmentTime: {
        type: String,
        required: true,
    },

    appointmentStatus : {
        type : String,
        default : "Booked",
    }
},
       {timestamps: true}
)

const Appointment= mongoose.model("Appointment" , appointmentSchema)
export default Appointment