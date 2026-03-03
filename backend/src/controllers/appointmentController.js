import Appointment from "../models/appointmentModel.js"

const validSlots = [
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30"
];
const doctorEmergencyConfig = {
  "Dr Renu": { slot: "12:00", maxPerDay: 1},
  "Dr Sharma": { slot: "11:30", maxPerDay: 1 },
  "Dr Neeraja" : {slot: "10:30", maxPerDay:1},
  "Dr Ashish" : {slot: "14:30", maxPerDay:1},

};

 export async function getAllAppointments(req,res) {
    
    try{
        const{search, doctorName,appointmentDate} = req.query;
        let query ={};
        if(doctorName){
            query.doctorName=doctorName;
        }
        if(appointmentDate){
            query.appointmentDate=appointmentDate;
        }
        if(search){
            query.$or=[
                {patientName: {$regex: search, $options: "i"}},
                {doctorName :{$regex: search, $options: "i"}},
            ];
        }
        const appointments = await Appointment.find(query).sort({createdAt: -1})
        res.status(200).json(appointments);
    }catch(error){
        console.error("Error in getAllAppointment controller" , error)
        res.status(500).json({message: "Internal server error "})

    }
    
}
export async function getAppointmentByID(req,res) {
    try{
        const appointment= await Appointment.findById(req.params.id)
        if(!appointment) return res.status(404).json({message: "Appointment not found"})

        res.status(200).json(appointment)

    }catch(error){
        console.error("Error in getAppointmentByID controller" , error)
        res.status(500).json({message: "Internal server error "})

    }
    
}

export async function createAppointment(req,res) {
    try{
        const{
            patientName,
            patientAge,
            gender,
            contactNumber,
            doctorName,
            appointmentDate,
            appointmentTime,
            priority = "normal"
        } = req.body

        if(!patientName || !patientAge || !gender || !contactNumber || !doctorName || !appointmentDate){
            return res.status(400).json({message: "All fields are required"})
        }

        if (!/^\d{10}$/.test(contactNumber)){
            return res.status(400).json({message: "Contact number must be exactly 10 digits"})
        }

        const selectedDate = new Date(appointmentDate);
        selectedDate.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (selectedDate < today ) {
            return res.status(400).json({message: "Cannot book appointment for past dates"});
        } 

        let finalTime;

        if(priority === "emergency"){
            const config = doctorEmergencyConfig[doctorName];

            if(!config){
                return res.status(400).json({message: "Emergency not available for this doctor"});
            }

            const count = await Appointment.countDocuments({
                doctorName,
                appointmentDate,
                priority: "emergency",
                appointmentStatus: { $ne: "Cancelled" }
            });

            if(count >= config.maxPerDay){
                
                const waitingPatient = new Appointment({
                    patientName,
                    patientAge,
                    gender,
                    doctorName,
                    contactNumber,
                    appointmentDate,
                    appointmentTime: config.slot,
                    priority,
                    appointmentStatus: "Waiting" 
                });

                await waitingPatient.save();

                return res.status(200).json({type:"waiting", message: "Emergency full.Added to waiting list"});
            }

            finalTime = config.slot;
        }

        else{
            if(!appointmentTime){
                return res.status(400).json({message: "Time is required for normal appointment"});
            }

            if(!validSlots.includes(appointmentTime)){
                return res.status(400).json({message: "Invalid time slot selected"});
            }

            finalTime = appointmentTime;
        }

        const alreadyBooked = await Appointment.findOne({
            doctorName,
            appointmentDate,
            appointmentTime: finalTime,
            appointmentStatus: "Booked"
        });

        if (alreadyBooked){
           
            const waitingPatient = new Appointment({
                patientName,
                patientAge,
                gender,
                doctorName,
                contactNumber,
                appointmentDate,
                appointmentTime: finalTime,
                priority,
                appointmentStatus: "Waiting" 
            });

            await waitingPatient.save();

            return res.status(200).json({type:"waiting", message: "Slot full. Added to waiting list"});
        }

        const appointment = new Appointment({
            patientName,
            patientAge,
            gender,
            doctorName,
            contactNumber,
            appointmentDate,
            appointmentTime: finalTime,
            priority,
            appointmentStatus : "Booked"
        });

        const savedAppointment = await appointment.save();
        
        return res.status(201).json({type: "booked" , message: "Appointment booked successfully", data:savedAppointment, });

    }catch(error){
        console.error("Error in createAppointment controller" , error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function updateAppointment(req,res) {
    try{
        const{
            patientName,
            patientAge,
            gender,
            doctorName,
            contactNumber,
            appointmentDate,
            appointmentTime,
            appointmentStatus,
            priority 
        } = req.body

        const existingAppointment = await Appointment.findById(req.params.id);
        
        if (!existingAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if(contactNumber && !/^\d{10}$/.test(contactNumber)){
            return res.status(400).json({message: "Contact number must be exactly 10 digits"})
        }

        const selectedDate = appointmentDate ? new Date(appointmentDate) : new Date(existingAppointment.appointmentDate);
        selectedDate.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (selectedDate < today ) {
            return res.status(400).json({message: "Cannot book appointment for past dates"});
        } 

        const finalDoctor = doctorName || existingAppointment.doctorName;
        const finalDate = appointmentDate || existingAppointment.appointmentDate;
        const finalPriority = priority || existingAppointment.priority; 

        let finalTime = appointmentTime || existingAppointment.appointmentTime;

        
        if(finalPriority === "emergency"){
            const config = doctorEmergencyConfig[finalDoctor];

            if(!config){
                return res.status(400).json({message: "Emergency not available"});
            }

            const count = await Appointment.countDocuments({
                _id: { $ne: req.params.id },
                doctorName: finalDoctor,
                appointmentDate: finalDate,
                priority: "emergency",
                appointmentStatus: { $ne: "Cancelled" }
            });

            if(count >= config.maxPerDay){
                return res.status(400).json({message: "Emergency limit reached"});
            }

            finalTime = config.slot; 
        }

        
        else if(appointmentTime){
            if(!validSlots.includes(appointmentTime)){
                return res.status(400).json({message: "Invalid time slot selected"});
            }
        }

        const conflict = await Appointment.findOne({
            _id: { $ne: req.params.id },
            doctorName: finalDoctor,
            appointmentDate: finalDate,
            appointmentTime: finalTime,
            appointmentStatus: "Booked"
        });

        if (conflict) {
            return res.status(400).json({message: "Selected time slot already booked"});
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,{
                patientName,
                patientAge,
                gender,
                contactNumber,
                doctorName: finalDoctor,
                appointmentDate: finalDate,
                appointmentTime: finalTime, 
                priority: finalPriority, 
                appointmentStatus
            },
            {new: true}
        );

        res.status(200).json(updatedAppointment);

    }catch(error){
        console.error("Error in updateAppointment controller" , error);
        res.status(500).json({message: "Internal server error"});
    }
}


export async function deleteAppointment(req,res) {
    try {
        const deleteAppointment = await Appointment.findByIdAndDelete(req.params.id)

        if(!deleteAppointment){
            return res.status(404).json({message: "Appointment not found"})
        }
        res.status(200).json({message : "Appointment deleted successfully"})

    } catch (error) {
        console.error("Error in deleteAppointment controller" , error)
        res.status(500).json({message: "Internal server error "})
    }
    
}

export async function cancelAppointment(req,res) {
    try{
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {appointmentStatus: "Cancelled"},
            {new:true}
        );

        if(!appointment){
            return res.status(404).json({message: "Appointment not found"})
        }

        
        const nextPatient = await Appointment.findOne({
            doctorName: appointment.doctorName,
            appointmentDate: appointment.appointmentDate,
            appointmentStatus: "Waiting"
        }).sort({ createdAt: 1 });

        if(nextPatient){
            nextPatient.appointmentStatus = "Booked";
            nextPatient.appointmentTime = appointment.appointmentTime;
            await nextPatient.save();
        }

        return res.status(200).json({ message: "Appointment cancelled -> waiting patient booked if exists"
        });

    }catch(error){
        console.error("Error in cancelAppointment controller" , error)
        res.status(500).json({message: "Internal server error "})
    }
}

export const completeAppointment = async (req,res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id,
            {appointmentStatus: "Completed"},
            {new:true}
        );
        if(!updatedAppointment) {
            return res.status(404).json({message:"Appointment not found"});
        }
        return res.status(200).json({message: "Appointment Completed Successfully", updatedAppointment})
    } catch (error) {
        console.error("Error in completing Appointment controller" , error)
        res.status(500).json({message: "Internal server error "})
    }
}

export async function getWaitlist(req, res) {
  try {
    const list = await Appointment.find({appointmentStatus: "Waiting" }).sort({ createdAt: 1 });

    return res.status(200).json({message: "Waiting list fetched successfully",
      data: list
    });

  } catch (error) {
    console.error("Error in getWaitlist controller", error);
    res.status(500).json({message: "Internal server error"});
  }
}