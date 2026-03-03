import React from 'react'
import {Link} from "react-router"
import { PlusIcon } from 'lucide-react'

function Navbar() {
    
  return (
    <header className='bg-base-200 border-b border-base-content/10'>
        <div className='max-w-7xl mx-auto p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-primary tracking-tight'>
                    APPOINTMENT SYSTEM

                </h1>
                <div className='flex items-center gap-4'>
                    <Link to="/create" className='btn btn-primary'>
                    <PlusIcon className ="size-5" />
                    <span>New Appointment</span>
                    </Link>
                    
                     <Link to="/waitlist" className='btn btn-secondary'>
                     View Waiting List
                      </Link>
                      <Link to="/dashboard" className=" btn btn-accent">
                      Dashboard
                      </Link>


                </div>
            </div>
        </div>

    </header>
  )
}

export default Navbar