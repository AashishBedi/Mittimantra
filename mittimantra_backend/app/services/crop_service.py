# app/services/crop_service.py
"""
Crop Recommendation Service
Handles crop prediction using ML model
"""

import joblib
import numpy as np
import logging
from pathlib import Path
from typing import Dict, List

logger = logging.getLogger(__name__)


class CropRecommendationService:
    """Service for crop recommendation"""
    
    def __init__(self):
        """Load crop recommendation model and label encoder"""
        try:
            model_path = Path("models/crop_planning_brain.pkl")
            encoder_path = Path("models/crop_label_encoder.pkl")
            
            self.model = joblib.load(model_path)
            self.label_encoder = joblib.load(encoder_path)
            
            logger.info("Crop recommendation model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load crop recommendation model: {str(e)}")
            raise
    
    def predict_crop(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float
    ) -> Dict:
        """
        Predict optimal crop based on soil and environmental conditions
        
        Args:
            nitrogen: Nitrogen content in soil
            phosphorus: Phosphorus content in soil
            potassium: Potassium content in soil
            temperature: Temperature in Celsius
            humidity: Relative humidity percentage
            ph: Soil pH value
            rainfall: Rainfall in mm
            
        Returns:
            Dictionary containing recommended crop and additional information
        """
        try:
            # Prepare input features
            features = np.array([[
                nitrogen, phosphorus, potassium,
                temperature, humidity, ph, rainfall
            ]])
            
            # Make prediction
            prediction = self.model.predict(features)
            
            # Get prediction probabilities if available
            confidence = None
            alternative_crops = None
            
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba(features)[0]
                confidence = float(np.max(probabilities))
                
                # Get top 3 alternatives
                top_indices = np.argsort(probabilities)[-3:][::-1]
                alternative_crops = [
                    self.label_encoder.inverse_transform([idx])[0]
                    for idx in top_indices[1:]
                ]
            
            # Decode prediction to crop name
            recommended_crop = self.label_encoder.inverse_transform(prediction)[0]
            
            # Generate reasoning
            reasoning = self._generate_reasoning(
                recommended_crop, nitrogen, phosphorus, potassium,
                temperature, humidity, ph, rainfall
            )
            
            return {
                "recommended_crop": recommended_crop,
                "confidence": confidence,
                "alternative_crops": alternative_crops,
                "reasoning": reasoning
            }
            
        except Exception as e:
            logger.error(f"Crop prediction error: {str(e)}")
            raise ValueError(f"Failed to predict crop: {str(e)}")
    
    def _generate_reasoning(
        self, crop: str, n: float, p: float, k: float,
        temp: float, humidity: float, ph: float, rainfall: float
    ) -> str:
        """Generate reasoning for crop recommendation"""
        reasons = []
        
        if temp < 15:
            reasons.append("Cool temperature suitable for cold-season crops")
        elif temp > 30:
            reasons.append("High temperature favorable for heat-tolerant crops")
        
        if rainfall > 200:
            reasons.append("High rainfall supports water-intensive crops")
        elif rainfall < 50:
            reasons.append("Low rainfall requires drought-resistant crops")
        
        if ph < 6:
            reasons.append("Acidic soil conditions")
        elif ph > 7.5:
            reasons.append("Alkaline soil conditions")
        
        npk_ratio = f"N:P:K ratio of {n:.0f}:{p:.0f}:{k:.0f}"
        reasons.append(npk_ratio)
        
        return f"{crop.capitalize()} is recommended based on: " + ", ".join(reasons)
    
    def get_crop_patterns(self) -> List[Dict]:
        """Get historical crop pattern data"""
        # Simulated historical data - replace with actual database query
        return [
            {"season": "Kharif", "popular_crops": ["rice", "maize", "cotton"], "success_rate": 85},
            {"season": "Rabi", "popular_crops": ["wheat", "mustard", "chickpea"], "success_rate": 88},
            {"season": "Zaid", "popular_crops": ["watermelon", "cucumber", "muskmelon"], "success_rate": 80}
        ]
    
    def get_seasonal_recommendations(self) -> Dict:
        """Get seasonal crop recommendations"""
        return {
            "current_season": "Kharif",
            "recommended_crops": ["rice", "maize", "soybean", "cotton"],
            "market_prices": {
                "rice": "₹2000-2500/quintal",
                "maize": "₹1800-2200/quintal",
                "soybean": "₹4000-4500/quintal"
            }
        }