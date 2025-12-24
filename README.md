# Full-Stack E-commerce Project

This is a full-stack e-commerce application built using the **MERN stack** (MongoDB, Express, React, Node.js). It features an admin dashboard for product and order management, and a customer-facing shop with cart and review functionality.

## Description

The project is divided into two main parts:

* **Client**: A React application built with Vite, utilizing Tailwind CSS for styling and Redux Toolkit for state management.
* **Server**: A Node.js and Express backend that connects to MongoDB and handles authentication, product data, and orders.

### Key Features

* **Authentication**: Secure login and registration using `bcryptjs` and `jsonwebtoken`.
* **Admin View**: Dedicated routes for managing products, orders, and dashboard analytics.
* **Shopping View**: Product listing, search, shopping cart, and user reviews.
* **Image Management**: Integration with Cloudinary for handling product image uploads.
* **Styling**: Modern UI components built with Radix UI and Tailwind CSS.

---

## Installation and Setup

### Prerequisites

* Node.js installed on your machine.
* MongoDB running locally (default: `mongodb://localhost:27017`).
* Cloudinary account for image hosting.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DBMS-Project

```

### Step 2: Server Configuration

1. Navigate to the server directory:
```bash
cd server

```


2. Install dependencies:
```bash
npm install

```


3. Create a `.env` file in the `server` folder and add your environment variables (e.g., `CLOUDINARY_URL`, `JWT_SECRET`).
4. Start the development server:
```bash
npm run dev

```


The server will run on `http://localhost:5000`.

### Step 3: Client Configuration

1. Navigate to the client directory:
```bash
cd ../client

```


2. Install dependencies:
```bash
npm install

```


3. Start the Vite development server:
```bash
npm run dev

```


The client will run on `http://localhost:5173`.

---

## Technologies Used

### Client-side

* **Framework**: React 18
* **Build Tool**: Vite
* **State Management**: Redux Toolkit
* **Routing**: React Router DOM
* **Styling**: Tailwind CSS, Lucide React (icons)
* **UI Components**: Radix UI (Avatar, Dialog, Select, etc.)

### Server-side

* **Runtime**: Node.js
* **Framework**: Express
* **Database**: MongoDB via Mongoose
* **Authentication**: JWT & Cookie-parser
* **File Uploads**: Multer & Cloudinary

---

## Available Scripts

### Client

* `npm run dev`: Starts the Vite development server.
* `npm run build`: Builds the app for production.
* `npm run lint`: Runs ESLint for code quality.

### Server

* `npm run dev`: Starts the server using `nodemon` for automatic restarts.
* `npm start`: Runs the server normally.
