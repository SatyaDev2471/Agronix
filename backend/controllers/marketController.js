const axios = require('axios');

// Helper to generate realistic market prices based on crop
const getBasePrice = (crop) => {
  const prices = {
    'Wheat': 2275,
    'Rice': 3200,
    'Cotton': 7100,
    'Tomato': 1800,
    'Onion': 2400,
    'Potato': 1500,
    'Maize': 2090,
    'Groundnut': 6377,
    'Sugarcane': 315,
    'Millets': 2500
  };
  return prices[crop] || 2500;
};

// Generates an array of historical prices for the chart
const generateHistory = (basePrice, days) => {
  const history = [];
  let currentPrice = basePrice * 0.95;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const volatility = currentPrice * (Math.random() * 0.045 - 0.02);
    currentPrice += volatility;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice),
      demand: Math.round(70 + Math.random() * 30),
      supply: Math.round(50 + Math.random() * 40)
    });
  }
  return history;
};

const generateForecast = (lastPrice) => {
  const forecast = [];
  let currentPrice = lastPrice;
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const volatility = currentPrice * (Math.random() * 0.03 - 0.01);
    currentPrice += volatility;
    forecast.push({
      date: date.toISOString().split('T')[0],
      predicted_price: Math.round(currentPrice),
      confidence: Math.round(95 - (i * 2))
    });
  }
  return forecast;
};

// Real Data Integration Layer
const fetchRealMarketData = async (crop) => {
  const apiKey = process.env.DATA_GOV_API_KEY; // Using the new key
  if (!apiKey) return null;

  // The main resource ID for Daily Market Rates on Data.gov.in
  const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
  
  try {
    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=50&filters[commodity]=${crop}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });
    
    if (response.data && response.data.records && response.data.records.length > 0) {
      return response.data.records;
    }
    return null; // No records found for this crop today
  } catch (err) {
    console.error("Data.gov.in API Error:", err.response?.status, err.message);
    return null; // Fallback to mock on failure
  }
};

exports.getMarketDashboard = async (req, res) => {
  try {
    const crop = req.query.crop || 'Wheat';
    let basePrice = getBasePrice(crop);
    
    // Attempt real data fetch
    const realRecords = await fetchRealMarketData(crop);
    let realAveragePrice = null;
    
    if (realRecords) {
      // Calculate real average modal price from all markets today
      let sum = 0;
      let count = 0;
      realRecords.forEach(record => {
        if (record.modal_price && !isNaN(record.modal_price)) {
          sum += parseFloat(record.modal_price);
          count++;
        }
      });
      if (count > 0) {
        realAveragePrice = Math.round(sum / count);
        basePrice = realAveragePrice; // Use real price as the baseline
      }
    }

    // Generate history (30 days) using basePrice (real if available, otherwise mock)
    const history = generateHistory(basePrice, 30);
    const todayData = history[history.length - 1];
    const yesterdayData = history[history.length - 2];
    
    // If we have real data, force today's price to be exactly the real price
    const currentPrice = realAveragePrice || todayData.price;
    const priceChange = currentPrice - yesterdayData.price;
    const priceChangePercent = (priceChange / yesterdayData.price) * 100;
    
    // Highest/lowest
    let highestToday = Math.round(currentPrice * 1.02);
    let lowestToday = Math.round(currentPrice * 0.97);
    
    // If real data, use actual min/max across all markets
    if (realRecords) {
      const maxes = realRecords.map(r => parseFloat(r.max_price)).filter(n => !isNaN(n));
      const mins = realRecords.map(r => parseFloat(r.min_price)).filter(n => !isNaN(n));
      if (maxes.length > 0) highestToday = Math.max(...maxes);
      if (mins.length > 0) lowestToday = Math.min(...mins);
    }

    const trend = priceChange > 0 ? 'Increasing' : 'Decreasing';
    const forecast = generateForecast(currentPrice);
    const nextWeekPrice = forecast[forecast.length - 1].predicted_price;
    const forecastChange = ((nextWeekPrice - currentPrice) / currentPrice) * 100;

    let aiRecommendation = {};
    if (forecastChange > 2) {
      aiRecommendation = {
        action: 'HOLD',
        reason: `The market price is expected to increase by ${forecastChange.toFixed(1)}% within the next 7 days. Export demand is driving prices up.`,
        profit_estimate: `+₹${Math.round(nextWeekPrice - currentPrice)} per quintal`,
        confidence: 88
      };
    } else if (forecastChange < -2) {
      aiRecommendation = {
        action: 'SELL NOW',
        reason: `Prices are projected to drop by ${Math.abs(forecastChange).toFixed(1)}% due to incoming regional supply gluts. Lock in today's rates.`,
        profit_estimate: `Avoid ₹${Math.round(currentPrice - nextWeekPrice)} loss per quintal`,
        confidence: 92
      };
    } else {
      aiRecommendation = {
        action: 'STABLE',
        reason: "Prices are highly stable around the monthly average. Sell if cash is needed, otherwise monitor daily.",
        profit_estimate: "Minimal expected change",
        confidence: 85
      };
    }

    res.status(200).json({
      success: true,
      crop,
      source: realRecords ? "Data.gov.in Live API" : "Agronix Math Engine",
      overview: {
        currentPrice,
        priceChange: Math.round(priceChange),
        priceChangePercent,
        highestToday,
        lowestToday,
        trend,
        weeklyAverage: Math.round(history.slice(-7).reduce((a, b) => a + b.price, 0) / 7),
        monthlyAverage: Math.round(history.reduce((a, b) => a + b.price, 0) / history.length),
      },
      history,
      forecast,
      aiRecommendation
    });
  } catch (error) {
    console.error("Error in getMarketDashboard:", error);
    res.status(500).json({ success: false, message: 'Server error fetching market data' });
  }
};

exports.getVendorsAndMandis = async (req, res) => {
  try {
    const crop = req.query.crop || 'Wheat';
    const realRecords = await fetchRealMarketData(crop);
    
    let mandis = [];
    
    if (realRecords && realRecords.length > 0) {
      // Map real market data to our UI format
      mandis = realRecords.slice(0, 5).map((r, i) => ({
        id: i,
        name: `${r.market} Market`,
        district: r.district,
        state: r.state,
        price: Math.round(parseFloat(r.modal_price)),
        distance: `${Math.round(10 + Math.random() * 40)} km`,
        updated: "Live"
      })).sort((a, b) => b.price - a.price);
    } else {
      const basePrice = getBasePrice(crop);
      mandis = [
        { id: 1, name: "Azadpur Mandi", district: "North Delhi", state: "Delhi", price: Math.round(basePrice * 1.05), distance: "12 km", updated: "10 mins ago" },
        { id: 2, name: "Okhla Sabzi Mandi", district: "South Delhi", state: "Delhi", price: Math.round(basePrice * 0.98), distance: "24 km", updated: "1 hour ago" },
        { id: 3, name: "Ghazipur Mandi", district: "East Delhi", state: "Delhi", price: Math.round(basePrice * 1.02), distance: "18 km", updated: "30 mins ago" },
      ].sort((a, b) => b.price - a.price);
    }

    const vendorBasePrice = mandis[0]?.price || getBasePrice(crop);
    const vendors = [
      { id: 101, name: "AgriCorp India", rating: 4.8, distance: "8 km", buyingPrice: Math.round(vendorBasePrice * 1.06), phone: "+91 98765 43210" },
      { id: 102, name: "Kisan Trading Co.", rating: 4.5, distance: "15 km", buyingPrice: Math.round(vendorBasePrice * 1.01), phone: "+91 98765 11111" },
      { id: 103, name: "GreenFields Exports", rating: 4.9, distance: "32 km", buyingPrice: Math.round(vendorBasePrice * 1.10), phone: "+91 98765 22222" }
    ].sort((a, b) => b.buyingPrice - a.buyingPrice);

    res.status(200).json({
      success: true,
      crop,
      topMandis: mandis,
      topVendors: vendors
    });
  } catch (error) {
    console.error("Error in getVendorsAndMandis:", error);
    res.status(500).json({ success: false, message: 'Server error fetching vendor data' });
  }
};

exports.getGlobalMarket = async (req, res) => {
  try {
    const crop = req.query.crop || 'Wheat';
    const globalData = [
      { country: "United States", trend: "Up", demand: "High", priceDiffPercent: 12 },
      { country: "China", trend: "Stable", demand: "Very High", priceDiffPercent: -4 },
      { country: "European Union", trend: "Up", demand: "Medium", priceDiffPercent: 18 },
      { country: "Brazil", trend: "Down", demand: "Low", priceDiffPercent: -8 },
      { country: "Middle East", trend: "Up", demand: "High", priceDiffPercent: 22 },
    ];
    res.status(200).json({ success: true, globalData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching global market data' });
  }
};

exports.getMarketNews = async (req, res) => {
  try {
    const crop = req.query.crop || 'Wheat';
    const news = [
      { id: 1, source: "Agri Business Times", title: `Government increases procurement of ${crop} by 15%`, date: new Date().toISOString(), type: "Policy" },
      { id: 2, source: "Global Trade Watch", title: `International export demand for ${crop} hits record high`, date: new Date(Date.now() - 86400000).toISOString(), type: "Export" },
      { id: 3, source: "Weather Analytics India", title: `Early monsoons might affect ${crop} harvest in Southern states`, date: new Date(Date.now() - 172800000).toISOString(), type: "Weather" }
    ];
    res.status(200).json({ success: true, crop, news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching market news' });
  }
};

exports.getGovernmentMSP = async (req, res) => {
  try {
    const crop = req.query.crop || 'Wheat';
    const basePrice = getBasePrice(crop);
    
    // Simulate realistic MSP data
    const mspData = {
      crop,
      currentYear: new Date().getFullYear(),
      currentMsp: Math.round(basePrice * 0.95), // MSP is usually slightly below market
      previousMsp: Math.round(basePrice * 0.88),
      procurementStatus: "Active",
      activeCenters: 1240,
      targetProcurement: "15.4 Million Tonnes",
      officialLink: "https://dfpd.gov.in/msp"
    };
    
    res.status(200).json({ success: true, mspData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching MSP data' });
  }
};
