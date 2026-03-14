import React from 'react'
import { Link } from "react-router";
import { useEffect, useState } from 'react'
import Navbar from "../components/Navbar.jsx";
import api from "../lib/axios.js";
import toast from 'react-hot-toast';
import AppointmentCard from "../components/AppointmentCard.jsx";
import AppointmentNotFound from "../components/AppointmentNotFound.jsx";

const HomePage= () => {
  const [appointments , setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const[doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const [activeTab, setActiveTab] = useState("All");

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments", {
        params: {search, doctorName,appointmentDate} ,
      });
 
      setAppointments(res.data);

    } catch (error) {
      console.log("Error fetching appointments")
      console.log(error)
      toast.error("Failed to load appointments");
    } finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchAppointments();
  }, [search , doctorName, appointmentDate]);

  const filteredAppointments = appointments.filter((appointment) =>{
    if(activeTab === "All") return true;
    return appointment.appointmentStatus === activeTab;
  });

  return(
    <div className='min-h-screen bg-base-200'>
      <Navbar />

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        
      <div className='flex gap-6 mb-6 border-b pb-2'>
        {["All", "Booked", "Completed", "Cancelled"].map((tab) =>(
          <button key={tab} onClick={() => setActiveTab(tab)}
          className={`pb-2 transition ${activeTab === tab ? "border-primary text-primary font-semibold" : "text-gray-500"}`}>
            {tab}

          </button>
        ))}

      </div>
        

        <div className='grid md:grid-cols-3 gap-4 mb-6'>

          <input type="text" placeholder='Search by Patient or Doctor...' 
          className='input input-bordered' value={search} onChange={(e) => setSearch(e.target.value)} />

          {/* <input type="text" placeholder='Filter by Doctor...' 
          className='input input-bordered' value={doctorName} onChange={(e) => setDoctorName(e.target.value)} /> */}
          <select className="select select-bordered" value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
            <option value="">All Doctors</option>
            <option value="Dr Renu">Dr Renu</option>
            <option value="Dr Sharma">Dr Sharma</option>
            <option value="Dr Neeraja">Dr Neeraja</option>
            <option value="Dr Ashish">Dr Ashish</option>
           </select>

          <input type="date" className='input input-bordered' value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />


        </div>
        {loading && ( 
          <div className='text-center text-primary'>
            Loading...
        </div>
        )}

        {filteredAppointments.length === 0 && !loading && (
          <AppointmentNotFound />
        )}

        {filteredAppointments.length >0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' >

          { filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment._id} appointment={appointment}

            setAppointments={setAppointments} />
          ))}
          </div> 
        )}

      </div>

    </div>
  );
};



export default HomePage
