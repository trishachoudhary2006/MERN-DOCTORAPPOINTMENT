import React from 'react'
import { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router"
import api from "../lib/axios";
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from 'lucide-react';

const CreatePage= () => {

const [patientName , setPatientName] = useState("");
const [patientAge, setPatientAge] = useState("");
const [gender, setGender] =  useState("");
const [contactNumber, setContactNumber]= useState("");
const [doctorName , setDoctorName] = useState("");
const [appointmentDate, setAppointmentDate]= useState("");
const [appointmentTime, setAppointmentTime]= useState("");


const [priority, setPriority] = useState("normal");

const [appointments, setAppointments] = useState([]);
const [loading , setLoading] = useState(false);
const navigate = useNavigate ()

const timeSlots = [
  "10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30",
  "16:00","16:30",
];
const doctors = [
  "Dr Renu",
  "Dr Sharma",
  "Dr Neeraja",
  "Dr Ashish"
];

useEffect(() => {
  fetchAppointments();
}, []);

const fetchAppointments = async () => {
  try {
    const res = await api.get("/appointments");
    setAppointments(res.data);
  } catch (error) {
    toast.error("Failed to load appointments");
  }
};

const bookedSlots = appointments.filter((a) => a.doctorName === doctorName && a.appointmentDate === appointmentDate).map((a) => a.appointmentTime);

const handleSubmit = async (e) => {
  e.preventDefault();

  
  if(priority !== "emergency" && !appointmentTime) {
    toast.error("Please select time slot");
    return;
  }

  setLoading(true);

  try {
    const res = await api.post("/appointments" , {
      patientName,
      patientAge,
      gender,
      contactNumber,
      doctorName,
      appointmentDate,
      appointmentTime,
      priority, 
    });
    if (res.data.type === "booked"){
    toast.success("Appointment created successfully !");
    }
    else if (res.data.type === "waiting"){
      toast("Slots are fulled . Added to waiting list");
    }
    navigate("/")
  } catch (error) {
    console.log("Error in creating appointment" , error);
    toast.error("Failed to create appointment")
  } finally {
    setLoading(false);
  }
};

return (
  <div className='min-h-screen bg-base-200'>
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <Link to="/" className='btn btn-ghost mb-6'>
          <ArrowLeftIcon className="size-5" />
          Back to Appointment
        </Link>

        <div className='card bg-base-100 shadow-lg'>
          <div className='card-body'>
            <h2 className='card-title text-2xl mb-4'>
              Create New Appointment
            </h2>

            <form onSubmit={handleSubmit}>

              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Patient Name</span>
                </label>
                <input type='text' className='input input-bordered'  value={patientName} onChange={(e) => setPatientName(e.target.value)}
                pattern='^[A-Za-z]+$' title='Patient name should contain only letters and spaces'  required   />
              </div>

              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Patient Age</span>
                </label>
                <input type='number' className='input input-bordered' value={patientAge} onChange={(e) => setPatientAge(e.target.value)} 
                min="1"
                max="120" required/>
              </div>

              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Gender</span>
                </label>
                <select className='select select-bordered'  value={gender} onChange={(e) => setGender(e.target.value)}  required>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Contact Number</span>
                </label>
                <input type='text' className='input input-bordered'value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                  maxLength={10}  pattern='\d{10}' title='Contact number must be exactly 10 digits'  required/>
              </div>

              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Doctor Name</span>
                </label>
                <select className='select select-bordered' value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required>
                  <option value="">Select Doctor</option>
                  {doctors.map((doc,index) => (
                    <option key={index} value={doc}>
                      {doc}

                    </option>
                  ))}

                </select>
              </div>

              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Appointment Date</span>
                </label>
                <input type='date' className='input input-bordered'  value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}  required />
              </div>

              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Appointment Type</span>
                </label>
                <select  className='select select-bordered' value={priority}   onChange={(e) => {
                   setPriority(e.target.value);
                   if(e.target.value === "emergency"){
                     setAppointmentTime("");
                    }
                  }}>
                  <option value="normal">Normal</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              
              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Appointment Time</span>
                </label>

                <select  className='select select-bordered' value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)}
                  disabled={priority === "emergency"}
                  required={priority !== "emergency"}
                >
                  <option value="">
                    {priority === "emergency"
                      ? "Auto assigned for emergency"
                      : "Select Time Slot"}
                  </option>

                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className='card-action justify-end'>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {loading ? "Creating..." : "Create Appointment"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default CreatePage;