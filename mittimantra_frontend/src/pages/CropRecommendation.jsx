import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaSeedling, FaInfoCircle } from 'react-icons/fa';
import { apiService } from '../services/api';

const CropRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

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
      // Convert string values to numbers
      const payload = {
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
      };

      const response = await apiService.predictCrop(payload);
      setResult(response);
      toast.success('Crop recommendation generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.detail || 'Failed to get crop recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
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
            <FaSeedling className="text-5xl text-primary-600" />
          </div>
          <h1 className="section-title">Crop Recommendation System</h1>
          <p className="section-subtitle">
            Get AI-powered crop suggestions based on your soil and environmental conditions
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
              Enter Soil & Weather Data
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nitrogen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nitrogen (N) - kg/ha
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter nitrogen content (0-200)"
                  min="0"
                  max="200"
                  step="0.1"
                  required
                />
              </div>

              {/* Phosphorus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phosphorus (P) - kg/ha
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter phosphorus content (0-200)"
                  min="0"
                  max="200"
                  step="0.1"
                  required
                />
              </div>

              {/* Potassium */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potassium (K) - kg/ha
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter potassium content (0-300)"
                  min="0"
                  max="300"
                  step="0.1"
                  required
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature - °C
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter temperature (-10 to 60)"
                  min="-10"
                  max="60"
                  step="0.1"
                  required
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humidity - %
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

              {/* pH */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil pH
                </label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter soil pH (3.0-10.0)"
                  min="3"
                  max="10"
                  step="0.1"
                  required
                />
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rainfall - mm
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter rainfall (0-500)"
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
                      Analyzing...
                    </span>
                  ) : (
                    'Get Recommendation'
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
              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-300">
                <h2 className="text-2xl font-bold mb-6 text-primary-900">
                  Recommendation Result
                </h2>

                <div className="space-y-4">
                  {/* Recommended Crop */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-2">
                      <FaSeedling className="text-3xl text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Recommended Crop</p>
                        <p className="text-3xl font-bold text-primary-700 capitalize">
                          {result.recommended_crop}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Confidence */}
                  {result.confidence && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Confidence Score</p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                          <div
                            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${result.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-lg font-bold text-primary-700">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Alternative Crops */}
                  {result.alternative_crops && result.alternative_crops.length > 0 && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-3 font-medium">Alternative Options</p>
                      <div className="flex flex-wrap gap-2">
                        {result.alternative_crops.map((crop, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reasoning */}
                  {result.reasoning && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Why This Crop?</p>
                          <p className="text-gray-700">{result.reasoning}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card bg-gray-100 flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-gray-500">
                  <FaSeedling className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fill in the form to get crop recommendations</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 card bg-blue-50 border-2 border-blue-200"
        >
          <h3 className="text-xl font-bold mb-4 text-blue-900 flex items-center">
            <FaInfoCircle className="mr-2" />
            How to Use This Tool
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
            <div>
              <p className="font-semibold mb-2">📊 Soil Testing:</p>
              <p>Get your soil tested at a local agricultural lab to obtain accurate NPK values and pH levels.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">🌡️ Weather Data:</p>
              <p>Use current temperature, humidity, and seasonal rainfall data from your region.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✅ Accuracy:</p>
              <p>More accurate inputs lead to better recommendations. Use recent soil test results.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">🌾 Crop Selection:</p>
              <p>Consider the recommended crop along with market demand and your farming experience.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CropRecommendation;