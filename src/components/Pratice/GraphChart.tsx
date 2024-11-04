import { getTaskTrendsAPI } from '@/lib/services/dashboard';
import Highcharts from "highcharts";
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { changeDateToUTC } from '@/lib/helpers/apiHelpers';
import DateRangeFilter from '../core/DateRangePicker';
import HighchartsReact from 'highcharts-react-official';

    const GraphChart = () => {
        const [selectedDateRange, setSelectedDateRange] = useState<[Date, Date] | null>(null);
        const [dateValue, setDateValue] = useState<[Date, Date] | null>(null);
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

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
      
        const categories = Array.isArray(data) ? data.map((item) => item.date) : [];
        const completedData = Array.isArray(data) ? data.map((item) => item.completed_count) : [];
        const inProgressData = Array.isArray(data) ? data.map((item) => item.inprogress_count) : [];
      
        const options = {
          chart: { type: "line", height: 200, style: { borderRadius: "16px" } },
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
                marker: { enabled: true, radius: 4 },
                lineWidth: 2,
              },
              {
                name: "In Progress",
                data: inProgressData,
                color: "#FF4D4F",
                marker: { enabled: true, radius: 4 },
                lineWidth: 2,
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
      
        const handleDateChange = (fromDate:any, toDate:any) => {
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
              <DateRangeFilter dateValue={dateValue} onChangeData={handleDateChange} />
            </div>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        );
      };
      
export default GraphChart
