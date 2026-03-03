import React from 'react';
import {Link,useLocation} from "react-router";
import { CalendarDays,User,Stethoscope,Clock,Trash2, Edit2 ,XCircle, CheckCircle} from 'lucide-react';
import { formatData } from '../lib/utils';
import api from "../lib/axios";
import toast from 'react-hot-toast';
import {useState} from "react";

const AppointmentCard =({appointment,setAppointments, index}) => {
    const [showModal,setShowModal] = useState(false);
    const location= useLocation();

    const isActive=location.pathname === `/appointment/${appointment._id}`;

    const handleDelete = async () => {
        try {
            await api.delete(`/appointments/${appointment._id}`);

            setAppointments((prev) => prev.filter((a) => a._id  !== appointment._id)
        );
        toast.success("Appointment deleted successfully");
        } catch (error) {
            toast.error("Failed to delete appointment");
        }finally{
            setShowModal(false);
        }
    };

    const handleCancle = async () => {
        try {
            await api.put(`/appointments/cancel/${appointment._id}`);
            
            const res = await api.get("/appointments");
            setAppointments(res.data);
            toast.success("Appointment cancelled successfully");
        } catch (error) {
            toast.error("Failed to cancel appointment");
            }
};
    const handleComplete = async() => {
        try {
            await api.put(`/appointments/complete/${appointment._id}`);
            setAppointments((prev) => prev.map((a) => a._id === appointment._id ? {...a,appointmentStatus: "Completed"}:a)
        );
        toast.success("Appointment completed successfully");

        } catch (error) {
            toast.error("Failed to complete appointment");
        }
    };
    const getBadgeClass = () => {
        if (appointment.appointmentStatus === "Booked" && appointment.priority === "emergency"){
            return "badge badge-error";
        }
        if (appointment.appointmentStatus === "Booked") return " badge badge-primary";
        if (appointment.appointmentStatus === "Completed") return "badge badge-success";
        if (appointment.appointmentStatus === "Cancelled") return "badge badge-neutral";
        if (appointment.appointmentStatus === "Waiting") return "badge badge-warning";
        return "badge-secondary";
    };

    return (
        <>
        <Link to ={`/appointment/${appointment._id}`} className={`block rounded-xl bg-base-100 p-4 border transition-all duration-200 ${isActive ? "border-primary shadow-lg" : "border-base-300"}
        hover:border-primary hover:shadow-xl`}>
            
            <div className='flex justify-between items-start'>
                <p className='text-xs text-base-content/60 truncate'>{appointment._id}</p>
                
                <span className={`${getBadgeClass()} flex items-center gap-1`}>
                    {appointment.appointmentStatus}
                    {appointment.appointmentStatus === "Waiting" && index !== undefined && (
                        <span className="font-semibold">#{index + 1}</span>
                         )}
               </span>

            </div>
            
            <div className='mt-4 space-y-2'>
                <div className='flex items-center gap-2'>
                    <User className='size-4 text-primary'/>
                    <p className='font-medium'>
                        {appointment.patientName}

                    </p>
                </div> 
                <div className='flex items-center gap-2'>
                    <Stethoscope className='size-4 text-primary'/>
                    <p>{appointment.doctorName}</p>
                    
                </div>

                <div className='flex items-center gap-2'>
                    <CalendarDays className='size-4 text-primary'/>
                    <p>{appointment.appointmentDate}</p>

                </div>
                <div className='flex items-center gap-2'>
                    <Clock className='size-4 text-primary'/> 
                    <p>
                        {appointment.appointmentTime}
                    </p>

                </div>

            </div>

            <div className='mt-6 flex justify-between items-center'>
                <span className='text-xs text-base-content/60'>
                {formatData(new Date(appointment.createdAt))}

                </span>
                <div className='flex items-center gap-4'>
                    <div className='tooltip tooltip-warning' data-tip="Edit Appointment">
                       <Edit2 className='size-4 text-warning hover:scale-110 transition' /> 

                    </div>
                      {appointment.appointmentStatus === "Booked" && (
                        <div className='tooltip tooltip-info' data-tip="Mark as Completed">
                            <button onClick={(e) => {e.preventDefault(); handleComplete()}} className='text-success hover:scale-110 transition'>
                                <CheckCircle className='size-4' />

                            </button>

                        </div>
                      )}
                      {appointment.appointmentStatus === "Booked" && (
                        <div className='tooltip tooltip-info' data-tip="Cancel appointment">
                            <button onClick={(e) => {e.preventDefault(); handleCancle()}} className='text-info hover:scale-110 transition'>
                                <XCircle className='size-4' />

                            </button>

                        </div>
                      )}

                      <div className='tooltip tooltip-error' data-tip="Delete Appointment" >
                        <button onClick={(e) => {e.preventDefault(); setShowModal(true);}} className='text-error hover:scale-110 transition'>
                            <Trash2 className='size-4' />

                        </button>

                      </div>


                </div>


         </div>
        </Link>
        {showModal && (
            <dialog className='modal modal-open'>
                <div className='modal-box'>
                    <h3 className='font-bold text-lg text-error flex items-center gap-2'>
                        <Trash2 className='size-5' />
                        Delete Appointment 
                         </h3>
                        <p className='py-4 text-base-content/70'>
                            Are you sure you want to delete this appointment ? <br/>
                            This action cannot be undaone   </p>
                            <div className='modal-action'>
                                <button className='btn btn-ghost' onClick={() => setShowModal(false)}>
                                    CANCEL

                                </button>
                                <button className='btn btn-error flex items-center gap-2' onClick={handleDelete}>
                                    <Trash2 className='size-4' />
                                    DELETE

                                </button>
                            </div>

                </div>


            </dialog>
        )}
        </>
    );
};

export default AppointmentCard
