import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaTint, FaInfoCircle, FaClock, FaWater } from 'react-icons/fa';
import { apiService } from '../services/api';

const IrrigationScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    crop_type: '',
    soil_moisture: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    crop_stage: 'vegetative',
  });

  const cropStages = [
    { value: 'seedling', label: 'Seedling' },
    { value: 'vegetative', label: 'Vegetative' },
    { value: 'flowering', label: 'Flowering' },
    { value: 'fruiting', label: 'Fruiting' },
    { value: 'maturity', label: 'Maturity' },
  ];

  const commonCrops = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 
    'Potato', 'Sugarcane', 'Soybean', 'Chickpea', 'Mustard'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        crop_type: formData.crop_type,
        soil_moisture: parseFloat(formData.soil_moisture),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        rainfall: parseFloat(formData.rainfall),
        crop_stage: formData.crop_stage,
      };

      const response = await apiService.getIrrigationSchedule(payload);
      setResult(response);
      toast.success('Irrigation schedule generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.detail || 'Failed to get irrigation schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      crop_type: '',
      soil_moisture: '',
      temperature: '',
      humidity: '',
      rainfall: '',
      crop_stage: 'vegetative',
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <FaTint className="text-5xl text-blue-600" />
          </div>
          <h1 className="section-title">Smart Irrigation Scheduler</h1>
          <p className="section-subtitle">
            Optimize water usage with AI-powered irrigation recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Enter Crop & Field Data
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type *
                </label>
                <select
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a crop</option>
                  {commonCrops.map((crop) => (
                    <option key={crop} value={crop.toLowerCase()}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Growth Stage *
                </label>
                <select
                  name="crop_stage"
                  value={formData.crop_stage}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {cropStages.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Soil Moisture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Soil Moisture - %
                </label>
                <input
                  type="number"
                  name="soil_moisture"
                  value={formData.soil_moisture}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter soil moisture (0-100)"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use a soil moisture meter for accurate readings
                </p>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Temperature - °C
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter temperature"
                  min="-10"
                  max="60"
                  step="0.1"
                  required
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Humidity - %
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter humidity (0-100)"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recent Rainfall - mm (last 24 hours)
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter rainfall amount"
                  min="0"
                  max="500"
                  step="0.1"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="spinner mr-2"></div>
                      Calculating...
                    </span>
                  ) : (
                    'Get Schedule'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {result ? (
              <div className="space-y-6">
                {/* Main Recommendation */}
                <div className={`card ${result.irrigation_needed ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300' : 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300'}`}>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Irrigation Recommendation
                  </h2>

                  <div className="space-y-4">
                    {/* Status */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-3">
                        <FaWater className={`text-4xl mr-4 ${result.irrigation_needed ? 'text-blue-600' : 'text-green-600'}`} />
                        <div>
                          <p className="text-sm text-gray-600">Irrigation Status</p>
                          <p className={`text-2xl font-bold ${result.irrigation_needed ? 'text-blue-700' : 'text-green-700'}`}>
                            {result.irrigation_needed ? 'Required' : 'Not Needed'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Water Amount */}
                    {result.irrigation_needed && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Water Amount Required</p>
                        <p className="text-3xl font-bold text-blue-700">
                          {result.water_amount} L/m²
                        </p>
                      </div>
                    )}

                    {/* Schedule */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <FaClock className="text-blue-600 mr-3 mt-1 flex-shrink-0 text-xl" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Schedule</p>
                          <p className="text-gray-900">{result.schedule}</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Irrigation */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Next Irrigation</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(result.next_irrigation).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>

                    {/* Reasoning */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Why?</p>
                          <p className="text-gray-700">{result.reasoning}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                {result.tips && result.tips.length > 0 && (
                  <div className="card bg-yellow-50 border-2 border-yellow-200">
                    <h3 className="text-lg font-bold mb-3 text-yellow-900">
                      💡 Irrigation Tips
                    </h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, index) => (
                        <li key={index} className="flex items-start text-sm text-yellow-900">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="card bg-gray-100 flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-gray-500">
                  <FaTint className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fill in the form to get irrigation schedule</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 card bg-green-50 border-2 border-green-200"
        >
          <h3 className="text-xl font-bold mb-4 text-green-900 flex items-center">
            <FaInfoCircle className="mr-2" />
            Irrigation Best Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-green-900">
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold mb-2">⏰ Best Time to Irrigate</p>
              <p>Early morning (5-7 AM) or late evening (6-8 PM) to minimize evaporation</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold mb-2">💧 Drip Irrigation</p>
              <p>Save up to 60% water compared to flood irrigation. Highly efficient for most crops</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold mb-2">🌱 Mulching</p>
              <p>Apply organic mulch to reduce evaporation and maintain soil moisture</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold mb-2">📊 Monitor Regularly</p>
              <p>Check soil moisture daily using a meter or the finger test method</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold mb-2">🌤️ Weather Forecast</p>
              <p>Check weather predictions before irrigating. Skip if rain is expected</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold mb-2">⚠️ Avoid Overwatering</p>
              <p>Excess water leads to root diseases and nutrient leaching</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IrrigationScheduler;