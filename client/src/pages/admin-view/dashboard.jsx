/*
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Bar, Doughnut } from 'react-chartjs-2';
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { getDashboardStats, getDailySalesData, getCategoryMixData, getSalesByCountryData } from "@/store/dashboard-slice"; 
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";

// Icons for the stat cards
import { Users, DollarSign, ShoppingBag } from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, change, icon: Icon, changeType }) => (
  <div className="bg-white p-6 rounded-lg border shadow-lg flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  </div>
);

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { 
    stats,
    dailySales, 
    categoryMix, 
    salesByCountry, 
    loading: dashboardLoading 
  } = useSelector((state) => state.dashboardFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getDashboardStats());
    dispatch(getDailySalesData());
    dispatch(getCategoryMixData());
    dispatch(getSalesByCountryData());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      toast({
        title: "Please select an image first.",
        variant: "destructive",
      });
      return;
    }
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Feature image uploaded successfully!" });
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      } else {
        toast({
          title: "Failed to upload feature image.",
          variant: "destructive",
        });
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({ title: "Image deleted successfully!" });
      }
    });
  }

  const salesChartData = {
    labels: dailySales.map(d => d.date),
    datasets: [{
      label: 'Revenue',
      data: dailySales.map(d => d.amount),
      backgroundColor: '#36A2EB',
      borderRadius: 4,
    }]
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const categoryChartData = {
    labels: categoryMix.map(c => c.category),
    datasets: [{
      data: categoryMix.map(c => c.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      borderColor: '#fff',
      borderWidth: 2,
    }]
  };
  
  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} change="All time" icon={DollarSign} changeType="increase" />
        <StatCard title="Total Customers" value={(stats.totalCustomers || 0).toLocaleString()} change="All time" icon={Users} changeType="increase" />
        <StatCard title="Total Orders" value={(stats.totalOrders || 0).toLocaleString()} change="All time" icon={ShoppingBag} changeType="increase" />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        <div className="bg-white p-6 rounded-lg border shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Sales (Last 7 Days)</h2>
          <div className="h-[350px]">
            {dashboardLoading ? <p>Loading...</p> : <Bar options={salesChartOptions} data={salesChartData} />}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
          <div className="h-[250px] relative mx-auto flex justify-center items-center">
             {dashboardLoading ? <p>Loading...</p> : <Doughnut data={categoryChartData} options={categoryChartOptions} />}
          </div>
           <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {categoryMix.map((item, index) => (
              <div key={item.category} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: categoryChartData.datasets[0].backgroundColor[index] }}></span>
                <span>{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      

      <div className="bg-white p-6 rounded-lg border shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales by Cities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dashboardLoading ? <p>Loading data...</p> : salesByCountry.map((city) => (
            <div key={city.country} className="flex justify-between p-2 border-b">
              <span className="text-gray-600">{city.country}</span>
              <span className="font-medium">{city.count} orders</span>
            </div>
          ))}
        </div>
      </div>
      
      <hr className="my-8" />

      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Feature Image Management</h2>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button disabled={imageLoadingState} onClick={handleUploadFeatureImage} className="mt-5 w-full">
          {imageLoadingState ? 'Uploading...' : 'Upload Feature Image'}
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureImgItem) => (
                <div className="relative" key={featureImgItem._id}>
                  <img src={featureImgItem.image} alt="Feature" className="w-full h-[200px] object-cover rounded-lg" />
                  <Button onClick={() => handleDeleteFeatureImage(featureImgItem._id)} className="absolute top-2 right-2" variant="destructive">
                    Delete
                  </Button>
                </div>
              ))
            : <p className="col-span-full">No feature images uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
*/
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Bar, Doughnut } from 'react-chartjs-2';
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { getDashboardStats, getDailySalesData, getCategoryMixData, getSalesByCountryData } from "@/store/dashboard-slice"; 
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";

// Icons for the stat cards
import { Users, DollarSign, ShoppingBag } from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, change, icon: Icon, changeType }) => (
  <div className="bg-white p-6 rounded-lg border shadow-lg flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  </div>
);

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { 
    stats,
    dailySales, 
    categoryMix, 
    salesByCountry, 
    loading: dashboardLoading 
  } = useSelector((state) => state.dashboardFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getDashboardStats());
    dispatch(getDailySalesData());
    dispatch(getCategoryMixData());
    dispatch(getSalesByCountryData());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      toast({
        title: "Please select an image first.",
        variant: "destructive",
      });
      return;
    }
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Feature image uploaded successfully!" });
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      } else {
        toast({
          title: "Failed to upload feature image.",
          variant: "destructive",
        });
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({ title: "Image deleted successfully!" });
      }
    });
  }

  // === CHART DATA UPDATED HERE ===
  const salesChartData = {
    labels: dailySales.map(d => d.date),
    datasets: [
      {
        label: 'Gross margin',
        data: dailySales.map(d => d.amount * 0.7), // Simulating margin as 70% of revenue
        backgroundColor: '#36A2EB', // Blue color
        borderRadius: 4,
      },
      {
        label: 'Revenue',
        data: dailySales.map(d => d.amount),
        backgroundColor: '#FF9F40', // Orange color
        borderRadius: 4,
      },
    ]
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top', 
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: {
          color: '#eee' // Lighter grid lines
        }
      },
      x: {
        grid: {
          display: false // Hide vertical grid lines
        }
      }
    },
  };

  const categoryChartData = {
    labels: categoryMix.map(c => c.category),
    datasets: [{
      data: categoryMix.map(c => c.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      borderColor: '#fff',
      borderWidth: 2,
    }]
  };
  
  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} change="All time" icon={DollarSign} changeType="increase" />
        <StatCard title="Total Customers" value={(stats.totalCustomers || 0).toLocaleString()} change="All time" icon={Users} changeType="increase" />
        <StatCard title="Total Orders" value={(stats.totalOrders || 0).toLocaleString()} change="All time" icon={ShoppingBag} changeType="increase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Product Sales</h2>
          <div className="h-[350px]">
            {dashboardLoading ? <p>Loading...</p> : <Bar options={salesChartOptions} data={salesChartData} />}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
          <div className="h-[250px] relative mx-auto flex justify-center items-center">
             {dashboardLoading ? <p>Loading...</p> : <Doughnut data={categoryChartData} options={categoryChartOptions} />}
          </div>
           <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {categoryMix.map((item, index) => (
              <div key={item.category} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: categoryChartData.datasets[0].backgroundColor[index] }}></span>
                <span>{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales by Cities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dashboardLoading ? <p>Loading data...</p> : salesByCountry.map((city) => (
            <div key={city.country} className="flex justify-between p-2 border-b">
              <span className="text-gray-600">{city.country}</span>
              <span className="font-medium">{city.count} orders</span>
            </div>
          ))}
        </div>
      </div>
      
      <hr className="my-8" />

      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Feature Image Management</h2>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button disabled={imageLoadingState} onClick={handleUploadFeatureImage} className="mt-5 w-full">
          {imageLoadingState ? 'Uploading...' : 'Upload Feature Image'}
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureImgItem) => (
                <div className="relative" key={featureImgItem._id}>
                  <img src={featureImgItem.image} alt="Feature" className="w-full h-[200px] object-cover rounded-lg" />
                  <Button onClick={() => handleDeleteFeatureImage(featureImgItem._id)} className="absolute top-2 right-2" variant="destructive">
                    Delete
                  </Button>
                </div>
              ))
            : <p className="col-span-full">No feature images uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;