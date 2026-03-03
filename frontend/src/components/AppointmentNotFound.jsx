import React from 'react'
import {CalendarX} from "lucide-react"
import {Link} from "react-router"

function AppointmentNotFound() {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
        <CalendarX className='size-12 text-primary'/>
        <h3 className='text-2xl font-bold mt-4'>No Appointments Yet</h3>
        <p className='text-base-content/70'>
         Start by Booking your first appointment.
        </p>

        <Link to="/create" className='btn btn-primary mt-4'>
         Book First Appointment
        </Link>
    

    </div>
  );
};

export default AppointmentNotFound