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

const TaskView = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({ strict: false });
  const [commentsData, setCommentsData] = useState<any>([]);
  const [singleTask, setSingleTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [commentedBy, setCommentBy] = useState<string>("");

  // Function to fetch a single task
  const getSingleTask = async (taskId: string) => {
    try {
      const response: any = await getSingleTaskAPI(taskId);
      if (response?.status === 200 || response?.status === 201) {
        setSingleTask(response?.data?.data);
      } else {
        throw new Error("Failed to fetch task");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch task");
    }
  };

  // Function to fetch all comments
  // const getAllComments = async () => {
  //   try {
  //     const response = await getCommentsAPI();
  //     if (response.success) {
  //       setCommentsData(response?.data?.data);
  //     } else {
  //       throw new Error("Failed to fetch comments");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to fetch comments");
  //   }
  // };

  // Function to add a comment
  // const addComment = async () => {
  //   setLoading(true);
  //   try {
  //     const payload = {
  //       task_id: taskId,
  //       message,
  //       commented_by: commentedBy,
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //     };
  //     const response = await addPostCommentsAPI(taskId, payload);
  //     if (response?.status === 200 || response?.status === 201) {
  //       toast.success(response?.data?.message || "Comment added successfully");
  //       // Optionally, you can refresh comments here after adding
  //       await getAllComments();
  //       setMessage(""); // Clear the message input after adding a comment
  //     } else {
  //       throw new Error("Failed to add comment");
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //     toast.error(err?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (taskId) {
      getSingleTask(taskId);
    }
  }, [taskId]);

  return (
    <div className="grid grid-cols-[60%_40%] gap-4">
      <div>
        {singleTask ? (
          <>
            <div className="flex justify-between items-center border p-6">
              <div>
                <p className="text-gray-500">Project: {singleTask.project}</p>
                <p className="font-semibold">{singleTask.title}</p>
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
        ) : (
          <p>Loading task details...</p>
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
                      <p className="font-semibold">{comment.author}</p>{" "}
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

                {/* Reply Message */}
                {comment.replyTo && (
                  <div className="flex items-start space-x-3 ml-12">
                    {/* Avatar for reply */}
                    <Avatar className="w-8 h-8 rounded-full">
                      <img
                        src={
                          singleTask?.assignedUsers[
                            (index + 1) % singleTask.assignedUsers.length
                          ]?.imageUrl || "https://i.pravatar.cc/150?img=4"
                        }
                        alt={comment.replyTo}
                      />
                    </Avatar>

                    <div className="bg-blue-50 p-4 rounded-lg shadow-md max-w-lg">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{comment.replyTo}</p>
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
                )}
              </div>
            ))}

            {/* Add Comment Section */}
            <div className="flex items-center space-x-3 mt-4">
              {/* Avatar */}
              <Avatar className="w-8 h-8 rounded-full">
                <img src="https://i.pravatar.cc/150?img=4" alt="User" />
              </Avatar>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow"
                onKeyPress={(e) => {
                  // if (e.key === "Enter") {
                  //   addComment();
                  // }
                }}
              />
              <Button
                // onClick={addComment}
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
