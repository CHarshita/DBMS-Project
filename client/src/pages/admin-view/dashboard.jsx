
/*
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { toast } = useToast();

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({
          title: "Image deleted successfully!",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative" key={featureImgItem._id}>
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <Button
                  onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                  className="absolute top-2 right-2"
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
*/


import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { getDailySalesData, getCategoryMixData, getSalesByCountryData } from "@/store/dashboard-slice"; 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Bar, Doughnut } from 'react-chartjs-2';
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

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { 
    featureImageList, 
    dailySales,
    categoryMix,
    salesByCountry 
  } = useSelector((state) => ({
    ...state.commonFeature,
    ...state.dashboardFeature
  }));

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({
          title: "Image deleted successfully!",
        });
      }
    });
  }
  
  useEffect(() => {
    const fetchAllDashboardData = () => {
      dispatch(getFeatureImages());
      dispatch(getDailySalesData());
      dispatch(getCategoryMixData());
      dispatch(getSalesByCountryData());
    };

    fetchAllDashboardData();
    const intervalId = setInterval(fetchAllDashboardData, 60000); 
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const salesChartData = {
    labels: dailySales.map(d => d.date),
    datasets: [{
      label: 'Daily Sales (₹)',
      data: dailySales.map(d => d.amount), 
      backgroundColor: 'rgba(53, 162, 235, 0.7)',
      borderColor: 'rgba(53, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  const categoryChartData = {
    labels: categoryMix.map(c => c.category),
    datasets: [{
      label: 'Sales Mix',
      data: categoryMix.map(c => c.count),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
      hoverOffset: 4
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Product Sales (Last 7 Days)</h2>
          <div className="h-[350px]">
            {dailySales && dailySales.length > 0 ? (
              <Bar data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-500">Loading sales data...</p>
            )}
          </div>
        </div>
        <div className="p-6 border rounded-lg shadow-lg bg-white flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-center">Sales by Product Category</h2>
          <div className="w-64 h-64">
            {categoryMix && categoryMix.length > 0 ? (
              <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-500">Loading category mix...</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-lg shadow-lg bg-white mb-10">
        <h2 className="text-xl font-semibold mb-4">Sales by Cities</h2>
        <div className="grid grid-cols-3 gap-4">
          {salesByCountry && salesByCountry.length > 0 ? (
            salesByCountry.map((countryData, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <span>{countryData.country}</span>
                <span className="font-medium">{countryData.count} orders</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3">Loading city data...</p>
          )}
        </div>
      </div>
      
      <hr className="my-8" />

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
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative" key={featureImgItem._id}>
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <Button
                  onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                  className="absolute top-2 right-2"
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;