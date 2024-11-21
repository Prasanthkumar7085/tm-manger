import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { getTaskTrendsAPI } from "@/lib/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { endOfMonth, startOfMonth } from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useEffect } from "react";
import DateRangeFilter from "./core/DateRangePicker";
import Loading from "./core/Loading";

interface TaskTrendData {
  task_date: string;
  completed_count: number;
  inprogress_count: number;
}

type SelectedDateRange = [Date, Date];

interface HighchartsOptions {
  credits: {
    enabled: boolean;
  };
  chart: {
    type: string;
    height: number;
    style: {
      borderRadius: string;
    };
  };
  title: {
    text: string;
    align: string;
    style: {
      fontWeight: string;
      fontSize: string;
      color: string;
    };
  };
  xAxis: {
    categories: string[];
    tickColor: string;
  };
  yAxis: {
    title: {
      text: string;
    };
    gridLineColor: string;
  };
  series: {
    name: string;
    data: number[];
    color: string;
    marker: {
      enabled: boolean;
    };
    lineWidth: number;
  }[];
  legend: {
    layout: string;
    align: string;
    verticalAlign: string;
    symbolHeight: number;
    itemStyle: {
      color: string;
      fontSize: string;
    };
  };
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    shadow: boolean;
    style: {
      color: string;
      fontSize: string;
    };
  };
}

const StatsAndGraph: React.FC = () => {
  const today = new Date();

  const [selectedDateRange, setSelectedDateRange] = useState<SelectedDateRange>(
    [startOfMonth(today), endOfMonth(today)]
  );
  const [dateValue, setDateValue] = useState<SelectedDateRange | null>(null);

  const { data, isFetching } = useQuery<TaskTrendData[]>({
    queryKey: ["getTaskTrends", selectedDateRange],
    queryFn: async () => {
      const [fromDate, toDate] = selectedDateRange || [];
      const response = await getTaskTrendsAPI({
        from_date: fromDate?.toISOString().split("T")[0],
        to_date: toDate?.toISOString().split("T")[0],
      });

      if (response.success) {
        return response.data?.data || [];
      }
      return [];
    },
    enabled: !!selectedDateRange,
  });

  const trendData = Array.isArray(data) && data.length > 0 ? data : [];

  const categories = trendData.map((item) => item.task_date);
  const completedData = trendData.map((item) => item.completed_count);
  const inProgressData = trendData.map((item) => item.inprogress_count);

  const options: HighchartsOptions = {
    credits: {
      enabled: false,
    },
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

  const handleDateChange = (
    fromDate: Date | null,
    toDate: Date | null
  ): void => {
    if (fromDate && toDate) {
      const [fromDateUTC, toDateUTC] = changeDateToUTC(fromDate, toDate);
      setDateValue([fromDateUTC, toDateUTC]);
      setSelectedDateRange([fromDateUTC, toDateUTC]);
    } else {
      setDateValue(null);
      setSelectedDateRange([startOfMonth(today), endOfMonth(today)]);
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
