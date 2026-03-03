import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const totalAppointments = appointments.length;

  const todayAppointments = appointments.filter((a) => a.appointmentDate === today).length;

  const cancelledCount = appointments.filter((a) => a.appointmentStatus === "Cancelled").length;

  const completedCount = appointments.filter((a) => a.appointmentStatus === "Completed").length;

  const waitingCount = appointments.filter((a) => a.appointmentStatus === "Waiting").length;

  const emergencyCount = appointments.filter((a) => a.priority === "emergency" ).length;

  const busyDoctors = appointments.filter((a) => a.appointmentDate === today &&a.appointmentStatus === "Booked" );

  const uniqueBusyDoctors = [ ...new Set(busyDoctors.map((a) => a.doctorName)),
  ];

  const doctorCounts = appointments.reduce((acc, curr) => {
    acc[curr.doctorName] = (acc[curr.doctorName] || 0) + 1;
    return acc;
  }, {});

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.doctorName.localeCompare(b.doctorName);
    } else {
      return b.doctorName.localeCompare(a.doctorName);
    }
  });

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
            
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Link to="/" className="btn btn-primary">
            Back to Appointments
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">

          <div className="card bg-blue-100 p-4">
            <h3 className="font-bold">Total Appointments</h3>
            <p className="text-2xl">{totalAppointments}</p>
          </div>

          <div className="card bg-green-100 p-4">
            <h3 className="font-bold">Today's Appointments</h3>
            <p className="text-2xl">{todayAppointments}</p>
          </div>

          <div className="card bg-yellow-100 p-4">
            <h3 className="font-bold">Completed</h3>
            <p className="text-2xl">{completedCount}</p>
          </div>

          <div className="card bg-red-100 p-4">
            <h3 className="font-bold">Cancelled</h3>
            <p className="text-2xl">{cancelledCount}</p>
          </div>

          <div className="card bg-purple-100 p-4">
            <h3 className="font-bold">Waiting</h3>
            <p className="text-2xl">{waitingCount}</p>
          </div>

          <div className="card bg-orange-100 p-4">
            <h3 className="font-bold">Emergency</h3>
            <p className="text-2xl">{emergencyCount}</p>
          </div>

        </div>

        <div className="card bg-base-100 p-4 mb-8">
          <h3 className="font-bold text-lg mb-2">Busy Doctors Today</h3>
          {uniqueBusyDoctors.length === 0 ? (
            <p>No doctors busy today</p>
          ) : (uniqueBusyDoctors.map((doc) => (
              <p key={doc} className="badge badge-error mr-2">
                {doc}
              </p>
            ))
          )}
        </div>

        <div className="card bg-base-100 p-4 mb-8">
          <h3 className="font-bold text-lg mb-4">
            Doctor Wise Appointment Count
          </h3>
          {Object.keys(doctorCounts).map((doc) => (
            <p key={doc}>
              {doc} : {doctorCounts[doc]}
            </p>
          ))}
        </div>

        <div className="mb-4">
          <select className="select select-bordered" onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Sort Doctor A-Z</option>
            <option value="desc">Sort Doctor Z-A</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-base-100 p-4 rounded-lg">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((app) => (
                <tr key={app._id}>
                  <td>{app.patientName}</td>
                  <td>{app.doctorName}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;