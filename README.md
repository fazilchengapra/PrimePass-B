# 🎬 PrimePass

## 📖 About PrimePass

PrimePass is a **modern movie ticket booking web application** that I built to solve the common challenges of online movie reservations — such as **concurrency issues, real-time seat availability, and seamless payments**.

The platform integrates **TMDB API** for live movie data, ensuring users always see the latest shows and details. With **WebSocket (Socket.IO)**, PrimePass prevents double-booking by handling **real-time concurrency** during seat reservations.

On the frontend, I used **React 19, Redux Toolkit, Tailwind CSS, Material UI, Radix UI, and Framer Motion** to create a fast, responsive, and engaging user interface. The backend is powered by **Node.js, Express.js, MongoDB, and Mongoose**, with **JWT authentication, Razorpay payment gateway, and Nodemailer email services** to provide a complete end-to-end experience.

- **Users** with a smooth, reliable, and interactive booking flow
- **Admins** with flexible tools for managing theaters, shows, and seat zones
- **Both** with a secure and scalable system that works in real-time

## ✨ Features

### 🎟️ Customer Features

- 🎥 **Real-Time Movie Updates** – Always stay updated with the latest movies and shows via **TMDB API** integration.
- ⚡ **Instant Seat Booking** – WebSocket-powered concurrency handling ensures accurate **real-time seat availability** without clashes.
- 🔍 **Smart Search & Filters** – Quickly search and filter movies or shows by **title, genre, or theater**.
- 💳 **Secure Payments** – Integrated payment gateway for a smooth and safe transaction experience.
- 📡 **Live Updates** – Automatic refresh for **seat status, bookings, and show timings** without page reload.
- 📩 **Email Notifications** – Instant booking confirmation emails with **rich HTML templates**.
- 📱 **Responsive UI** – Optimized and user-friendly design across **desktop and mobile devices**.

### ⏳ Seat Lock & Unlock Mechanism

PrimePass ensures fairness with a **seat lock system**:

- When a booking is initiated (`POST /api/bookings`), selected seats are **locked** with the user's ID and timestamp.
- If payment is successful within 8 minutes → the booking is **confirmed**.
- If payment is not completed within 8 minutes → the system **automatically unlocks** the seats, making them available for others in real-time.
- This process is handled via **Socket.IO events** and background jobs to maintain concurrency without conflicts.

### 🛠️ Admin Features

- 🏢 **Multi-Theater Management** – Add and manage **multiple theaters** with ease.
- 🎬 **Show Scheduling** – Create and manage **multiple shows** for each movie and theater.
- 🏟️ **Seat Zones & Mapping** – Define multiple **seat zones** (VIP, Premium, Standard, etc.) with custom layouts per screen.
- 🔐 **Authentication & Authorization** – Secure login and **role-based access** using JWT.

## 🛠️ Tech Stack

PrimePass is built with a **modern and scalable technology stack**, combining the best tools for performance, real-time interactivity, and a seamless user experience.

---

### 🎟️ Frontend (Customer Interface)

- ⚛️ **React 19** – Component-based, fast, and scalable UI library
- 🔄 **Redux Toolkit + React-Redux** – Centralized and predictable state management
- 🛣️ **React Router DOM** – Smooth client-side navigation
- 🎨 **Material UI (MUI) + Radix UI** – Elegant, accessible, and customizable components
- 🎨 **Tailwind CSS** – Utility-first styling for rapid, responsive UI design
- 🎞️ **Framer Motion** – Beautiful animations and transitions for engaging UX
- 📝 **React Hook Form + Zod** – Flexible form handling with strong validation
- 🔗 **Axios** – Efficient API communication
- ⚡ **Socket.IO Client** – Real-time seat booking updates
- 🔔 **React Toastify & Notifications** – Instant, user-friendly feedback

---

### 🛠️ Backend (APIs & Admin Dashboard)

- 🟢 **Node.js + Express.js** – High-performance backend framework
- 🍃 **MongoDB + Mongoose** – Flexible and scalable NoSQL database
- 🔐 **JWT Authentication** – Secure login & role-based access control
- 🔑 **Bcrypt.js** – Strong password encryption
- 🔌 **Socket.IO** – Real-time WebSocket communication for concurrency booking
- 💳 **Razorpay Integration** – Secure and reliable online payments
- 📩 **Nodemailer (HTML Email)** – Rich booking confirmation emails
- ✅ **Joi Validation** – Request validation and error handling
- ⚙️ **Dotenv** – Secure environment variable management
- 🌍 **CORS + Middleware Tools** – Robust server configurations

---

## 📡 API Documentation

### 🔐 Auth Routes

| Method | Endpoint             | Parameters      | Type   | Description                                     |
| ------ | -------------------- | --------------- | ------ | ----------------------------------------------- |
| POST   | `/api/auth/register` | `userAuth`      | object | Register a new user (username, email, password) |
| POST   | `/api/auth/login`    | `credentials`   | object | Authenticate user and return JWT token          |
| GET    | `/api/auth/me`       | `Authorization` | string | Get logged-in user details                      |

---

### 🎭 Theater Routes

| Method | Endpoint            | Parameters    | Type   | Description                  |
| ------ | ------------------- | ------------- | ------ | ---------------------------- |
| POST   | `/api/theaters`     | `theaterData` | object | Create a new theater         |
| GET    | `/api/theaters`     | -             | -      | Get all theaters             |
| GET    | `/api/theaters/:id` | `id`          | string | Get a specific theater by ID |
| PUT    | `/api/theaters/:id` | `theaterData` | object | Update theater details       |
| DELETE | `/api/theaters/:id` | `id`          | string | Delete a theater             |

---

### 📺 Screen Routes

| Method | Endpoint                      | Parameters   | Type   | Description             |
| ------ | ----------------------------- | ------------ | ------ | ----------------------- |
| POST   | `api/screens`                 | `screenData` | object | Create new screen       |
| GET    | `/api/screens/:id`            | `screenId`   | string | Get a specific screen   |
| GET    | `/api/screens/by-theater/:id` | `theaterId`  | string | Get screen by theaterId |
| PUT    | `/api/screens/:id`            | `screenId`   | string | Update screen details   |
| DELETE | `/api/screens/:id`            | `screenId`   | string | Delete a screen         |

---

### 🏟️ Zone & Seat Routes

| Method | Endpoint                | Parameters  | Type   | Description                        |
| ------ | ----------------------- | ----------- | ------ | ---------------------------------- |
| POST   | `/api/zones`            | `zoneData`  | object | Add a new zone to a theater screen |
| GET    | `/api/zones/:theaterId` | `theaterId` | string | Get all zones for a theater        |
| POST   | `/api/seats`            | `seatData`  | object | Add seats to a zone                |
| GET    | `/api/seats/:showId`    | `showId`    | string | Get seat availability for a show   |

---

### 🎬 Show & Movie Routes

| Method | Endpoint              | Parameters | Type   | Description                   |
| ------ | --------------------- | ---------- | ------ | ----------------------------- |
| POST   | `/api/shows`          | `showData` | object | Create a new show for a movie |
| GET    | `/api/shows/:movieId` | `movieId`  | string | Get all shows for a movie     |

---

### 💳 Booking & Payment Routes

| Method | Endpoint                | Parameters        | Type   | Description                        |
| ------ | ----------------------- | ----------------- | ------ | ---------------------------------- |
| POST   | `/api/bookings`         | `bookingData`     | object | Book seats for a show              |
| GET    | `/api/bookings/:userId` | `userId`          | string | Get all bookings for a user        |
| POST   | `/api/payments/create`  | `paymentDetails`  | object | Initialize payment (Razorpay)      |
| POST   | `/api/payments/verify`  | `paymentResponse` | object | Verify payment and confirm booking |
