#  Doctor Appointment Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed for hospitals and clinics to efficiently manage patient appointments, emergency slots, and waiting lists.

This system helps administrative staff organize, monitor, and control appointment scheduling in a structured and automated manner.

---

##  Project Overview

The Appointment Management System is developed to assist hospitals and clinics in managing patient appointments efficiently. It allows staff to create, update, cancel, delete, and track appointment statuses while handling emergency bookings and waiting lists automatically.

This system is primarily designed for internal hospital or clinic management rather than direct public patient access.

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- DaisyUI
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

### Live Demo
https://doctorappointment-9pg8.onrender.com

##  Features

###  Search & Filter
- Search by patient name
- Search by doctor name
- Filter by doctor
- Filter by appointment date

# sort by doctorName

###  Appointment Management
- Create new appointments
- Update appointment details
- Delete appointments
- Cancel appointments
- Mark appointments as completed

###  Fixed Time Slot System
- Each doctor has predefined time slots
- Appointments can only be booked within fixed available slots
- Prevents double booking
- Automatic conflict detection

###  Emergency Appointment Handling
- Each doctor has a predefined emergency time slot
- Emergency time is automatically assigned by the system
- Limited emergency appointments allowed per doctor per day
- If emergency limit is reached → Patient is added to waiting list automatically

###  Automatic Waiting List Management
- If a normal slot is already booked Patient is added to waiting list
- If a booked appointment is cancelled  The first waiting patient is automatically promoted to booked
- Maintains appointment order based on booking time

###  Validation & Controls
- Prevent past date booking
- Contact number must be exactly 10 digits
- Required field validation
- Time slot validation

## createdAt
## updatedAt


##  CRUD Operations

###  Create
- Add new appointment
- Emergency or normal booking
- Automatic waiting list if slot is full

###  Read
- View all appointments
- View single appointment details
- Search and filter appointments
- View waiting list

###  Update
- Modify appointment details
- Change appointment date, time, doctor

- Update appointment status

###  Delete
- Permanently remove an appointment from the system

---

##  Project Structure
```

MERN-DOCTORAPPOINTMENT/
│
├── backend/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── appointmentController.js
│       ├── models/
│       │   └── appointmentModel.js
│       ├── routes/
│       │   └── appointmentRoutes.js
│       └── server.js
│
├── frontend/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── README.md
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── AppointmentCard.jsx
│       │   ├── AppointmentNotFound.jsx
│       │   └── Navbar.jsx
│       ├── lib/
│       │   ├── axios.js
│       │   └── utils.js
│       └── pages/
│           ├── HomePage.jsx
│           ├── Dashboard.jsx
│           ├── CreatePage.jsx
│           ├── AppointmentDetailPage.jsx
│           └── WaitlistPage.jsx
|__README.md

```

## System Workflow

 creates appointment.

System checks:

Valid date

Valid time slot

Slot availability

If slot available → Appointment booked.

If slot full → Added to waiting list.

If appointment cancelled → First waiting patient gets booked automatically.

# installation and setup

### backend
- cd backend
- npm install
- npm start

### frontend
- cd frontend
- npm install
- npm run dev



## Future Implementation

The following enhancements can be added in future versions of the system:

### Role-Based Authentication
- Admin, Receptionist, and Patient roles
- Different access permissions based on user role
- Secure login and authorization using JWT

### Patient Portal
- Patient self-registration
- Patients can view and manage their own appointments
- Appointment history tracking

### Notification System
- Email notifications for appointment confirmation
- SMS reminders before appointment time
- Cancellation alerts

### Online Payment Integration
- Online consultation fee payment
- Payment status tracking
- Invoice generation

### Analytics Dashboard
- Daily, weekly, and monthly appointment reports
- Doctor workload statistics
- Emergency booking statistics


### Author
- Trisha Choudhary 

