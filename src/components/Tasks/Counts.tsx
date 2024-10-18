import GlobalDateRangeFilter from "../core/DateRangePicker";
import { Card, CardContent, CardHeader } from "../ui/card";

const TotalCounts = () => {
  return (
    <div className="flex gap-6">
      <Card className="rounded-lg shadow-sm p-2 h-24 bg-white overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <h3 className="text-sm font-semibold">Total Tasks</h3>
          <CardContent className="flex-grow flex items-center justify-start overflow-hidden">
            <p className="text-lg text-gray-600 truncate">200</p>
          </CardContent>
        </CardHeader>
      </Card>

      <Card className="rounded-lg shadow-sm p-2 h-24 bg-white overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <h3 className="text-sm font-semibold">To Do</h3>
          <CardContent className="flex-grow flex items-center justify-start overflow-hidden">
            <p className="text-lg text-gray-600 truncate">200</p>
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="rounded-lg shadow-sm p-2 h-24 bg-white overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <h3 className="text-sm font-semibold">In progress</h3>
          <CardContent className="flex-grow flex items-center justify-start overflow-hidden">
            <p className="text-lg text-gray-600 truncate">200</p>
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="rounded-lg shadow-sm p-2 h-24 bg-white overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <h3 className="text-sm font-semibold">Overdue</h3>
          <CardContent className="flex-grow flex items-center justify-start overflow-hidden">
            <p className="text-lg text-gray-600 truncate">200</p>
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="rounded-lg shadow-sm p-2 h-24 bg-white overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <h3 className="text-sm font-semibold">Completed</h3>
          <CardContent className="flex-grow flex items-center justify-start overflow-hidden">
            <p className="text-lg text-gray-600 truncate">200</p>
            <img
              src={"src/assets/stats.svg"}
              alt="img"
              className="h-[33px] w-[33px]"
            />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TotalCounts;
