import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "tailwindcss/tailwind.css";
import GlobalDateRangeFilter from "./core/DateRangePicker";

const StatsAndGraph = () => {
  const options = {
    chart: {
      type: "spline",
      height: 200,
      style: {
        borderRadius: "16px",
      },
    },
    title: {
      text: "",
      align: "left",
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        color: "#333",
      },
    },
    xAxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      tickColor: "#EAEAEA",
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineColor: "#F0F0F0",
    },
    series: [
      {
        name: "Completed",
        data: [100, 120, 140, 180, 160, 130, 120],
        color: "#8000FF", // Purple color
        marker: {
          enabled: false,
        },
        lineWidth: 4,
      },
      {
        name: "Pending",
        data: [120, 110, 150, 200, 170, 140, 130],
        color: "#FF4D4F",
        marker: {
          enabled: true,
          lineWidth: 2,
          radius: 4,
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
    plotOptions: {
      spline: {
        marker: {
          enabled: true,
          radius: 4,
        },
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

  const handleDateChange = (data: any) => {};
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
        <GlobalDateRangeFilter onChangeData={handleDateChange} />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StatsAndGraph;
