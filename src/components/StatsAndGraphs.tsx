import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "tailwindcss/tailwind.css";
import GlobalDateRangeFilter from "./core/DateRangePicker";
import { useState } from "react";
import DatePickerField from "./core/DateRangePicker";
import { useQuery } from "@tanstack/react-query";
import { getTaskTrendsAPI } from "@/lib/services/dashboard";

const StatsAndGraph = () => {
  const [projectDetails, setProjectDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const { data } = useQuery({
    queryKey: ["getTaskTrends"],
    queryFn: async () => {
      try {
        const response = await getTaskTrendsAPI();
        if (response.success) {
          setProjectDetails(response.data?.data);
          return response.data?.data;
        } else {
          throw new Error("Failed to fetch project details");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: true,
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const completedData = data?.data
    ? data.data.map((item: any) => item.completed_count)
    : Array(7).fill(0);
  const inProgressData = data?.data
    ? data.data.map((item: any) => item.inprogress_count)
    : Array(7).fill(0);

  const options = {
    chart: {
      type: "spline",
      height: 200,
      style: {
        borderRadius: "16px",
      },
    },
    title: {
      text: "Tasks",
      align: "left",
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        color: "#333",
      },
    },
    xAxis: {
      categories: daysOfWeek,
      tickColor: "#EAEAEA",
    },
    yAxis: {
      title: {
        text: "Count",
      },
      gridLineColor: "#F0F0F0",
    },
    series: [
      {
        name: "Completed",
        data: completedData,
        color: "#8000FF",
        marker: {
          enabled: false,
        },
        lineWidth: 4,
      },
      {
        name: "In Progress",
        data: inProgressData,
        color: "#FF4D4F",
        marker: {
          enabled: false,
        },
        lineWidth: 4,
      },
    ],
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      symbolHeight: 10,
      itemStyle: {
        color: "#333",
        fontSize: "12px",
      },
    },
    tooltip: {
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderRadius: 8,
      shadow: true,
      style: {
        color: "#333",
        fontSize: "12px",
      },
    },
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <DatePickerField value={selectedDate} onChange={handleDateChange} />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StatsAndGraph;
