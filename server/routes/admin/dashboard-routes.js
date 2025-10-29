
/*
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User'); // Import User model

// Helper function to get the date 7 days ago
const getPastDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

// NEW: API for fetching all key stats at once
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });

    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalCustomers,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching stats." });
  }
});


// API for Daily Sales (Bar Chart Data)
router.get('/daily-sales', async (req, res) => {
  try {
    const lastWeek = getPastDate();
    const salesData = await Order.aggregate([
      { $match: { orderDate: { $gte: lastWeek } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          totalSales: { $sum: "$totalAmount" },
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          amount: "$totalSales"
        }
      }
    ]);
    res.status(200).json({ success: true, data: salesData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching sales data." });
  }
});

// API for Sales by Category (Doughnut Chart Data)
router.get('/category-mix', async (req, res) => {
  try {
    const categoryMixData = await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $addFields: {
          'cartItems.productIdObj': { $toObjectId: '$cartItems.productId' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartItems.productIdObj',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          count: { $sum: "$cartItems.quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: "$count"
        }
      }
    ]);
    res.status(200).json({ success: true, data: categoryMixData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching category data." });
  }
});

// API for Sales by City
router.get('/sales-by-country', async (req, res) => {
  try {
    const cityData = await Order.aggregate([
      {
        $group: {
          _id: "$addressInfo.city",
          count: { $sum: 1 },
        }
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          country: "$_id", // Renamed for frontend compatibility
          count: "$count"
        }
      }
    ]);
    res.status(200).json({ success: true, data: cityData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching city data." });
  }
});

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');

// API for fetching all key stats at once
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });

    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalCustomers,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching stats." });
  }
});

// API for Daily Sales (Bar Chart Data)
router.get('/daily-sales', async (req, res) => {
  try {
    // 1. Create a map of the last 7 days with 0 sales
    const salesMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      salesMap.set(dateString, 0);
    }

    // 2. Get sales data from the database
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const salesDataFromDB = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate", timezone: "Asia/Kolkata" } },
          totalSales: { $sum: "$totalAmount" },
        }
      }
    ]);

    // 3. Populate the map with actual sales data
    salesDataFromDB.forEach(item => {
      salesMap.set(item._id, item.totalSales);
    });

    // 4. Convert the map to the array format the chart expects
    const salesData = Array.from(salesMap, ([date, amount]) => ({ date, amount }));

    res.status(200).json({ success: true, data: salesData });
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    res.status(500).json({ success: false, message: "Server error fetching sales data." });
  }
});


// API for Sales by Category (Doughnut Chart Data)
router.get('/category-mix', async (req, res) => {
  try {
    const categoryMixData = await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $addFields: {
          'cartItems.productIdObj': { $toObjectId: '$cartItems.productId' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartItems.productIdObj',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          count: { $sum: "$cartItems.quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: "$count"
        }
      }
    ]);
    res.status(200).json({ success: true, data: categoryMixData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching category data." });
  }
});

// API for Sales by City
router.get('/sales-by-country', async (req, res) => {
  try {
    const cityData = await Order.aggregate([
      {
        $group: {
          _id: "$addressInfo.city",
          count: { $sum: 1 },
        }
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          country: "$_id", // Renamed for frontend compatibility
          count: "$count"
        }
      }
    ]);
    res.status(200).json({ success: true, data: cityData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching city data." });
  }
});

module.exports = router;