import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000/api/admin/dashboard';

const createDashboardThunk = (type, endpoint) => createAsyncThunk(
  type,
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`);
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message || `Failed to fetch data from ${endpoint}`);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred.');
    }
  }
);

export const getDailySalesData = createDashboardThunk('dashboard/getDailySalesData', 'daily-sales');
export const getCategoryMixData = createDashboardThunk('dashboard/getCategoryMixData', 'category-mix');
export const getSalesByCountryData = createDashboardThunk('dashboard/getSalesByCountryData', 'sales-by-country');

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dailySales: [], 
    categoryMix: [], 
    salesByCountry: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Daily Sales Reducers
      .addCase(getDailySalesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDailySalesData.fulfilled, (state, action) => {
        state.dailySales = action.payload;
        state.loading = false;
      })
      .addCase(getDailySalesData.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      // Category Mix Reducers
      .addCase(getCategoryMixData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryMixData.fulfilled, (state, action) => {
        state.categoryMix = action.payload;
        state.loading = false;
      })
      .addCase(getCategoryMixData.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      // Sales by Country Reducers
      .addCase(getSalesByCountryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSalesByCountryData.fulfilled, (state, action) => {
        state.salesByCountry = action.payload;
        state.loading = false;
      })
      .addCase(getSalesByCountryData.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;