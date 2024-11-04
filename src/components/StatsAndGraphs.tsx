import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTaskTrendsAPI } from "@/lib/services/dashboard";
import DateRangeFilter from "./core/DateRangePicker";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";

const StatsAndGraph = ({ selectedDate }: any) => {
  const today = new Date();

  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date, Date] | null
  >([new Date(today.setHours(0, 0, 0, 0)), new Date()]);
  const [dateValue, setDateValue] = useState<[Date, Date] | null>();
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["getTaskTrends", selectedDateRange],
    queryFn: async () => {
      const [fromDate, toDate] = selectedDateRange || [];
      const response = await getTaskTrendsAPI({
        from_date: fromDate?.toISOString().split("T")[0],
        to_date: toDate?.toISOString().split("T")[0],
      });

      if (response.success) {
        return response.data?.data;
      }
    },
    enabled: !!selectedDateRange,
  });

  const dummyData = [
    { date: "2024-10-30", completed_count: 5, inprogress_count: 3 },
    { date: "2024-10-31", completed_count: 8, inprogress_count: 2 },
    { date: "2024-11-01", completed_count: 4, inprogress_count: 6 },
    { date: "2024-11-02", completed_count: 7, inprogress_count: 1 },
  ];

  const trendData = Array.isArray(data) && data.length > 0 ? data : dummyData;

  const categories = trendData.map((item: any) => item.date);
  const completedData = trendData.map((item: any) => item.completed_count);
  const inProgressData = trendData.map((item: any) => item.inprogress_count);

  const options = {
    chart: { type: "spline", height: 200, style: { borderRadius: "16px" } },
    title: {
      text: "Tasks",
      align: "left",
      style: { fontWeight: "bold", fontSize: "16px", color: "#333" },
    },
    xAxis: { categories, tickColor: "#EAEAEA" },
    yAxis: { title: { text: "Count" }, gridLineColor: "#F0F0F0" },
    series: [
      {
        name: "Completed",
        data: completedData,
        color: "#8000FF",
        marker: { enabled: false },
        lineWidth: 4,
      },
      {
        name: "In Progress",
        data: inProgressData,
        color: "#FF4D4F",
        marker: { enabled: false },
        lineWidth: 4,
      },
    ],
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      symbolHeight: 10,
      itemStyle: { color: "#333", fontSize: "12px" },
    },
    tooltip: {
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderRadius: 8,
      shadow: true,
      style: { color: "#333", fontSize: "12px" },
    },
  };

  const handleDateChange = (fromDate: Date | null, toDate: Date | null) => {
    if (fromDate && toDate) {
      const [fromDateUTC, toDateUTC] = changeDateToUTC(fromDate, toDate);
      setDateValue([fromDateUTC, toDateUTC]);
      setSelectedDateRange([fromDateUTC, toDateUTC]);
    } else {
      setDateValue(null);
      setSelectedDateRange(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <DateRangeFilter
          dateValue={dateValue}
          onChangeData={handleDateChange}
        />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
      {isFetching && <div>Loading data...</div>}
    </div>
  );
};

export default StatsAndGraph;
