import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTaskTrendsAPI } from "@/lib/services/dashboard";
import DateRangeFilter from "./core/DateRangePicker";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import LoadingComponent from "./core/LoadingComponent";
import Loading from "./core/Loading";

const StatsAndGraph = ({ selectedDate }: any) => {
  const today = new Date();

  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date, Date] | null
  >([new Date(), new Date()]);
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

  const trendData = Array.isArray(data) && data.length > 0 ? data : [];

  const categories = trendData.map((item: any) => item.task_date);

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
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-sans font-medium text-gray-800">Tasks</h2>
        <DateRangeFilter
          dateValue={selectedDateRange}
          onChangeData={handleDateChange}
        />
      </div>
      <div className="stats-and-graph-chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

      {isFetching && (
        <div>
          <Loading loading />
        </div>
      )}
    </div>
  );
};

export default StatsAndGraph;
