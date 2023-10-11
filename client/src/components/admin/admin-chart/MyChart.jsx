
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { adminInstance } from '../../../utils/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MyChart = () => {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'LoopNet',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Videos',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Users',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await adminInstance.get('/chartdata');

        const {  videosData, usersData } = data;

        setChartData({
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: videosData,
            },
            {
              ...chartData.datasets[1],
              data: usersData,
            },
          ],
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();

  }, []);


  return (
    <Line options={options} data={chartData} />
  )
};

export default MyChart;
