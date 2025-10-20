import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import api from "../../Config/api";
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import DotsVertical from 'mdi-material-ui/DotsVertical'

const PieChart = () => {
  const [reportYearly, setReportYearly] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await api.get(`/api/dashboard/product-revenue-percentages`);
      if (res.data) {
        setReportYearly(res.data.map((item) => item.percentage));
        setLabels(res.data.map((item) => item.categoryName));
      }
    };
    getData();
  }, []);

  const series = reportYearly;
  const options = {
    chart: {
      type: "pie",
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return <Card>
  <CardHeader
    title='Doanh thu các năm'
    titleTypographyProps={{
      sx: { lineHeight: '0rem !important', letterSpacing: '0.15px !important' }
    }}
    action={
      <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
        <DotsVertical />
      </IconButton>
    }
  />
  <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}><Chart options={options} series={series} type="pie" />
  </CardContent>
    </Card>;
};

export default PieChart;

