
import React from 'react'
import { useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from "react-router"
import api from '../lib/axios'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react'

const AppointmentDetailPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const timeSlots = [
    "10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30",
    "14:00","14:30","15:00","15:30",
    "16:00","16:30",
  ];

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        setAppointment(res.data);
      } catch (error) {
        toast.error("Failed to fetch appointment");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await api.put(`/appointments/${id}`, appointment);
      toast.success("Appointment updated successfully");
      navigate("/");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update");
      }
    } finally {
      setSaving(false);
    }
  };

  if(loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading..
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>

          <div className='flex justify-between mb-6'>
            <Link to="/" className='btn btn-ghost'>
              <ArrowLeftIcon className='size-5' />
              Back
            </Link>

            <button onClick={handleDelete} className='btn btn-error btn-outline'>
              <Trash2Icon className='size-5' />
              Delete
            </button>
          </div>

          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body'>

              <input type='text' className='input input-bordered mb-4' value={appointment.patientName} onChange={(e) => setAppointment({...appointment, patientName: e.target.value})}  />

              <input  type='number' className='input input-bordered mb-4' value={appointment.patientAge}  onChange={(e) => setAppointment({...appointment, patientAge: e.target.value})} />

              <select className='select select-bordered mb-4' value={appointment.gender || ""} onChange={(e) => setAppointment({...appointment, gender: e.target.value})}  >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input type='text' className='input input-bordered mb-4' value={appointment.contactNumber || ""}  onChange={(e) => setAppointment({...appointment, contactNumber: e.target.value})}  />

              <input type='text' className='input input-bordered mb-4' value={appointment.doctorName} onChange={(e) => setAppointment({...appointment, doctorName: e.target.value})} />

              <input  type='date' className='input input-bordered mb-4' value={appointment.appointmentDate} onChange={(e) => setAppointment({...appointment, appointmentDate: e.target.value})} />

              
              <select className='select select-bordered mb-4'  value={appointment.priority || "normal"}  onChange={(e) =>
                  setAppointment({...appointment, priority: e.target.value, appointmentTime: e.target.value === "emergency" ? "" : appointment.appointmentTime
                  })
                }>
                <option value="normal">Normal</option>
                <option value="emergency">Emergency</option>
              </select>

             
              <select className="select select-bordered mb-4" value={appointment.appointmentTime || ""} onChange={(e) => setAppointment({ ...appointment, appointmentTime: e.target.value })
                }
                disabled={appointment.priority === "emergency"}
              >
                <option value="">
                  {appointment.priority === "emergency"
                    ? "Auto assigned for emergency"
                    : "Select Time Slot"}
                </option>

                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              <button className='btn btn-primary' disabled={saving} onClick={handleSave}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;