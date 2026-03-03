import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import AppointmentCard from "../components/AppointmentCard.jsx";
import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

const WaitlistPage = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWaitlist = async () => {
    try {
      const res = await api.get("/appointments/waitlist");
      setWaitingList(res.data.data); 
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      toast.error("Failed to load waiting list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 mt-6">

        
        <Link to="/" className="btn btn-ghost mb-4">
          <ArrowLeftIcon className="size-5" />
          Back to Appointments
        </Link>

        <h2 className="text-2xl font-bold mb-6">Waiting List</h2>

        {loading && (
          <div className="text-center text-primary">
            Loading...
          </div>
        )}

        {!loading && waitingList.length === 0 && (
          <div className="text-center text-gray-500">
            No patients in waiting list
          </div>
        )}

        {!loading && waitingList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {waitingList.map((appointment, index) => (
              <div key={appointment._id} className="relative">


                <AppointmentCard
                  appointment={appointment}
                  setAppointments={setWaitingList}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WaitlistPage;