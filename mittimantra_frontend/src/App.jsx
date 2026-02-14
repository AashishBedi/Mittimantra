import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main Pages
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import IrrigationScheduler from './pages/IrrigationScheduler';
import PestControl from './pages/PestControl';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
  {/* Auth Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Layout Wrapped Routes */}
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/crop-recommendation" element={<CropRecommendation />} />
    <Route path="/disease-detection" element={<DiseaseDetection />} />
    <Route path="/irrigation-scheduler" element={<IrrigationScheduler />} />
    <Route path="/pest-control" element={<PestControl />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route path="/about" element={<About />} />
  </Route>
</Routes>


          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;