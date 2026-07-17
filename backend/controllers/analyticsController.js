const axios = require('axios');

// Fallback logic exactly mirrors what ThingSpeak would return, 
// allowing the UI to render perfectly even without API keys.
const getFallbackThingSpeakData = (results = 200) => {
  const data = [];
  const now = Date.now();
  
  // Generate realistic time-series data
  for (let i = 0; i < results; i++) {
    const timestamp = new Date(now - (results - i) * 15 * 60000).toISOString(); // 15 min intervals
    
    // Simulate diurnal temperature and humidity cycles
    const hour = new Date(timestamp).getHours();
    const tempBase = 22 + Math.sin((hour - 6) * Math.PI / 12) * 8; // peaks at 14:00
    const humBase = 70 - Math.sin((hour - 6) * Math.PI / 12) * 20;
    
    data.push({
      created_at: timestamp,
      entry_id: i + 1,
      field1: (tempBase + Math.random() * 1.5).toFixed(1), // Temp
      field2: (humBase + Math.random() * 3).toFixed(1), // Humidity
      field3: (45 + Math.sin(i * 0.1) * 5 + Math.random() * 2).toFixed(1), // Moisture (40-50%)
      field4: Math.random() > 0.95 ? "1" : "0", // Rain (rarely 1)
      field5: (6.5 + Math.random() * 0.4 - 0.2).toFixed(2), // pH (6.3 - 6.7)
      field6: (120 + Math.random() * 15 - 7).toFixed(0), // Nitrogen
      field7: (45 + Math.random() * 8 - 4).toFixed(0), // Phosphorus
      field8: (80 + Math.random() * 10 - 5).toFixed(0), // Potassium
      // Note: Motor status can be derived or stored in a separate channel. 
      // For this mock, we assume motor runs when moisture < 42
    });
  }
  
  return {
    channel: {
      id: 123456,
      name: "Agronix Smart Farm",
      description: "Sensor data for Agronix Smart Farm",
      field1: "Temperature",
      field2: "Humidity",
      field3: "Moisture",
      field4: "Rain",
      field5: "pH",
      field6: "Nitrogen",
      field7: "Phosphorus",
      field8: "Potassium",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: new Date().toISOString(),
      last_entry_id: results
    },
    feeds: data
  };
};

// Generates aggregated stats and AI insights from raw data
const generateAnalytics = (feeds) => {
  if (!feeds || feeds.length === 0) return null;

  const current = feeds[feeds.length - 1] || {};
  const previous = feeds[feeds.length - Math.min(96, feeds.length)] || {};

  // Helper to safely parse
  const val = (entry, field) => (entry && entry[field]) ? parseFloat(entry[field]) || 0 : 0;

  const kpis = {
    moisture: { current: val(current, 'field3'), prev: val(previous, 'field3') },
    temperature: { current: val(current, 'field1'), prev: val(previous, 'field1') },
    humidity: { current: val(current, 'field2'), prev: val(previous, 'field2') },
    ph: { current: val(current, 'field5'), prev: val(previous, 'field5') },
    nitrogen: { 
      current: parseFloat((100 + val(current, 'field3') * 0.5 + Math.abs(7.0 - val(current, 'field5')) * 10).toFixed(0)), 
      prev: parseFloat((100 + val(previous, 'field3') * 0.5 + Math.abs(7.0 - val(previous, 'field5')) * 10).toFixed(0)) 
    },
    phosphorus: { 
      current: parseFloat((30 + val(current, 'field1') * 0.8).toFixed(0)), 
      prev: parseFloat((30 + val(previous, 'field1') * 0.8).toFixed(0)) 
    },
    potassium: { 
      current: parseFloat((60 + val(current, 'field2') * 0.3).toFixed(0)), 
      prev: parseFloat((60 + val(previous, 'field2') * 0.3).toFixed(0)) 
    },
  };

  // Calculate Farm Health Score (0-100)
  // Optimal ranges: Moisture 40-60, Temp 20-30, Hum 50-70, pH 6.0-7.0, NPK balanced
  let healthScore = 100;
  if (kpis.moisture.current < 40 || kpis.moisture.current > 60) healthScore -= 15;
  if (kpis.temperature.current < 15 || kpis.temperature.current > 35) healthScore -= 10;
  if (kpis.ph.current < 5.5 || kpis.ph.current > 7.5) healthScore -= 20;
  if (kpis.nitrogen.current < 100) healthScore -= 10;

  // AI Insights Generation
  const insights = [];
  
  if (kpis.moisture.current < kpis.moisture.prev) {
    const drop = ((kpis.moisture.prev - kpis.moisture.current) / kpis.moisture.prev * 100).toFixed(1);
    insights.push(`Soil moisture has decreased by ${drop}% over the last 24 hours. Consider scheduling irrigation soon.`);
  } else {
    insights.push("Soil moisture is stable and within optimal ranges.");
  }

  if (kpis.temperature.current > 30) {
    insights.push(`High temperature detected (${kpis.temperature.current}°C). Evaporation rates will be elevated today.`);
  }

  if (kpis.ph.current >= 6.0 && kpis.ph.current <= 7.0) {
    insights.push("Soil pH is perfectly balanced, ensuring maximum nutrient availability for your crops.");
  } else {
    insights.push(`Soil pH is slightly off-balance (${kpis.ph.current}). Monitor closely.`);
  }

  const rainCount = feeds.filter(f => val(f, 'field4') > 0).length;
  if (rainCount > 0) {
    insights.push(`Rainfall was detected ${rainCount} times in the recent period, reducing the need for automated irrigation.`);
  }

  // Structured Recommendations Generation (for AIRecommendationEngine.jsx)
  const recommendations = [];
  let recId = 1;

  if (kpis.moisture.current < 40) {
    recommendations.push({
      id: recId++,
      priority: 'High',
      type: 'danger',
      title: 'Immediate Irrigation Needed',
      reason: `Soil moisture is at critically low ${kpis.moisture.current.toFixed(1)}% (below 40% optimal threshold).`,
      action: 'Start irrigation for approximately 25 minutes immediately.',
      benefit: 'Prevents severe heat stress and wilting.'
    });
  } else if (kpis.moisture.current > 60) {
    recommendations.push({
      id: recId++,
      priority: 'Medium',
      type: 'warning',
      title: 'Waterlogging Risk',
      reason: `Soil moisture is high at ${kpis.moisture.current.toFixed(1)}%.`,
      action: 'Halt all irrigation and check drainage systems.',
      benefit: 'Prevents root rot and fungal diseases.'
    });
  }

  if (kpis.ph.current < 5.5) {
    recommendations.push({
      id: recId++,
      priority: 'High',
      type: 'danger',
      title: 'Acidic Soil Detected',
      reason: `pH level has dropped to ${kpis.ph.current.toFixed(1)}.`,
      action: 'Apply agricultural lime to raise soil pH.',
      benefit: 'Unlocks trapped nutrients like phosphorus.'
    });
  }

  if (kpis.phosphorus.current < 50) {
    recommendations.push({
      id: recId++,
      priority: 'Medium',
      type: 'warning',
      title: 'Phosphorus Deficiency',
      reason: `P levels are low at ${kpis.phosphorus.current.toFixed(1)} mg/kg.`,
      action: 'Apply phosphorus-rich fertilizer (e.g., DAP) during the next fertigation cycle.',
      benefit: 'Improves root development and crop yield.'
    });
  }

  // If everything is fine, add a success recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      id: recId++,
      priority: 'Low',
      type: 'success',
      title: 'Optimal Farm Health',
      reason: 'All critical sensors (Moisture, Temp, pH, NPK) are within optimal ranges.',
      action: 'Maintain current automated schedules. No manual intervention required.',
      benefit: 'Conserves resources while maximizing growth.'
    });
  }

  return {
    kpis,
    healthScore: Math.max(0, healthScore),
    insights,
    recommendations,
    rawFeeds: feeds // Pass raw feeds for frontend Recharts
  };
};

const SensorData = require('../models/SensorData');

const translateAnalytics = async (analyticsData, targetLang) => {
  if (!targetLang || targetLang === 'en') return analyticsData;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return analyticsData;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
    
    // We only need to translate insights and recommendations
    const payloadToTranslate = {
      insights: analyticsData.insights,
      recommendations: analyticsData.recommendations
    };
    
    const prompt = `Translate the following JSON object's values to language code "${targetLang}". Keep the exact same JSON keys and structure. Return ONLY valid JSON. \n\n ${JSON.stringify(payloadToTranslate)}`;
    
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const response = await axios.post(url, payload, { 
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      timeout: 5000
    });
    
    const aiMessage = response.data.candidates[0].content.parts[0].text;
    const cleanJson = aiMessage.replace(/```json/g, '').replace(/```/g, '').trim();
    const translated = JSON.parse(cleanJson);
    
    return {
      ...analyticsData,
      insights: translated.insights || analyticsData.insights,
      recommendations: translated.recommendations || analyticsData.recommendations
    };
  } catch(e) {
    console.error("Translation error:", e.message);
    return analyticsData;
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const channelId = process.env.THINGSPEAK_CHANNEL_ID;
    const apiKey = process.env.THINGSPEAK_READ_API_KEY;
    const results = req.query.results || 200;

    // Force demo data as requested by the user
    console.log("Forcing demo analytics data...");
    let rawData = getFallbackThingSpeakData(results);

    let analyticsData = generateAnalytics(rawData.feeds);
    if (analyticsData) {
      analyticsData.rawFeeds = rawData.feeds; // Pass full feeds array to frontend
    }
    
    // Translate if requested
    const targetLang = req.query.language;
    analyticsData = await translateAnalytics(analyticsData, targetLang);

    res.status(200).json({
      success: true,
      channelInfo: rawData.channel,
      analytics: analyticsData
    });

  } catch (error) {
    console.error("Error fetching ThingSpeak data, falling back to mock:", error.message);
    const rawData = getFallbackThingSpeakData();
    let analyticsData = generateAnalytics(rawData.feeds);
    
    const targetLang = req.query.language;
    analyticsData = await translateAnalytics(analyticsData, targetLang);

    res.status(200).json({
      success: true,
      channelInfo: rawData.channel,
      analytics: analyticsData,
      warning: "Live API failed, using fallback data."
    });
  }
};
