import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  addPostCommentsAPI,
  getCommentsAPI,
  getSingleTaskAPI,
} from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TaskView = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({ strict: false });
  const [commentsData, setCommentsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const {
    data: singleTask,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["getSingleTask", taskId],
    queryFn: async () => {
      if (!taskId) return;
      const response = await getSingleTaskAPI(taskId);
      if (response?.status === 200 || response?.status === 201) {
        return response?.data?.data;
      } else {
        throw new Error("Failed to fetch task");
      }
    },
    enabled: Boolean(taskId),
  });

  useEffect(() => {
    // You can fetch comments here if needed
    // const getAllComments = async () => {
    //   const response = await getCommentsAPI();
    //   if (response.success) {
    //     setCommentsData(response?.data?.data);
    //   } else {
    //     throw new Error("Failed to fetch comments");
    //   }
    // };
    // getAllComments();
  }, []);

  const addComment = async () => {
    setLoading(true);
    try {
      const payload = {
        task_id: taskId,
        message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const response = await addPostCommentsAPI(taskId, payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Comment added successfully");
        // Optionally, refresh comments here after adding
        // await getAllComments();
        setMessage(""); // Clear the message input after adding a comment
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const title = singleTask?.description;
  const shouldShowDescriptionTooltip = title && title.length > 30;
  const truncatedDescription = shouldShowDescriptionTooltip
    ? `${title.substring(0, 30)}...`
    : title;

  return (
    <div className="grid grid-cols-[60%_40%] gap-4">
      <div>
        {isFetching ? (
          <p>Loading task details...</p>
        ) : error ? (
          <p>Error fetching task: {error.message}</p>
        ) : (
          singleTask && (
            <>
              <div className="flex justify-between items-center border p-6">
                <div>
                  <p className="text-gray-500">Project: {singleTask.project}</p>
                  <p className="font-semibold">{singleTask.title}</p>
                  <p className="text-gray-500">
                    Description :
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-gray-500 cursor-pointer ">
                              {truncatedDescription}
                            </span>
                          </TooltipTrigger>
                          {shouldShowDescriptionTooltip && (
                            <TooltipContent
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                borderRadius: "4px",
                                padding: "8px",
                                maxWidth: "300px",
                                fontSize: "14px",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }}
                            >
                              <div className="tooltipContent">{title}</div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Tags</h4>
                  <div className="flex space-x-2">
                    {singleTask.tags?.map((tag: any, idx: any) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Assigned To</h4>
                <div className="border rounded p-4">
                  {singleTask.assignedUsers?.map((user: any, index: any) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-3">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <Avatar className="w-8 h-8 rounded-full">
                          <img src={user.imageUrl} alt={user.name} />
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                      <span className="text-green-600">{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Attachments</h4>
                <div className="space-y-2">
                  {singleTask.attachments?.map((attachment: any) => (
                    <div
                      key={attachment.id}
                      className="flex justify-between items-center border p-2 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">📄</span>
                        <p>{attachment.name}</p>
                      </div>
                      <div className="text-gray-500">
                        <p>{attachment.size}</p>
                        <p>{attachment.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="bg-red-500 flex items-center space-x-2">
                  <UploadIcon className="w-4 h-4" />
                  <span>Upload</span>
                </Button>
              </div>
            </>
          )
        )}
      </div>

      <div className="space-y-2 border p-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Comments</h4>
          <div className="space-y-4">
            {commentsData.map((comment: any, index: any) => (
              <div key={comment.id} className="space-y-2">
                {/* Comment Bubble */}
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 rounded-full">
                    <img
                      src={
                        singleTask?.assignedUsers[
                          index % singleTask.assignedUsers.length
                        ]?.imageUrl || "https://i.pravatar.cc/150?img=4"
                      }
                      alt={comment.author}
                    />
                  </Avatar>

                  <div className="bg-purple-50 p-4 rounded-lg shadow-md max-w-lg">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{comment.author}</p>
                      <p className="text-xs text-gray-500">
                        {comment.timestamp}
                      </p>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                    <p className="text-xs text-blue-500 cursor-pointer mt-2">
                      Reply
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Comment Section */}
            <div className="flex items-center space-x-3 mt-4">
              <Avatar className="w-8 h-8 rounded-full">
                <img src="https://i.pravatar.cc/150?img=4" alt="User" />
              </Avatar>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addComment();
                  }
                }}
              />
              <Button
                onClick={addComment}
                disabled={loading}
                className="bg-blue-500"
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
