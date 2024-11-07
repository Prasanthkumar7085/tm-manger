import CKEditorComponent from "@/components/core/CKEditor/CKEditorComponent";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCommentsAPI,
  deleteCommentsAPI,
  getCommentsForTaskAPI,
  updateCommentsAPI,
} from "@/lib/services/tasks";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import LoadingComponent from "@/components/core/LoadingComponent";
import RepliedComments from "./RepliedComments";
const TaskComments = ({ taskId }: any) => {
  const userID = useSelector(
    (state: any) => state.auth?.user?.user_details?.id
  );
  const [commentText, setCommentText] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [groupedComments, setGroupedComments] = useState<any>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openReplies, setOpenReplies] = useState<any>({
    commentId: null,
    open: false,
  });
  const [replyText, setReplyText] = useState("");
  const handleTestDetailsChange = (data: string) => {
    setCommentText(data);
  };
  const handleReplyChange = (data: string) => {
    setReplyText(data);
  };
  const {
    isLoading,
    isFetching,
    data: commentsData,
    error,
  } = useQuery({
    queryKey: ["getComments", taskId, refreshCount],
    queryFn: async () => {
      const response = await getCommentsForTaskAPI(taskId);
      try {
        if (response?.status === 200 || response?.status === 201) {
          return response?.data?.data;
        } else if (response?.status === 404) {
          return [];
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
      }
    },
    enabled: !!taskId,
  });
  useEffect(() => {
    if (commentsData) {
      const sortedComments = [...commentsData].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB;
      });
      const grouped: any = [];
      sortedComments.forEach((comment: any) => {
        const commentDate = new Date(comment.created_at);
        const formattedDate = format(commentDate, "yyyy-MM-dd");
        if (!grouped[formattedDate]) {
          grouped[formattedDate] = [];
        }
        grouped[formattedDate].push(comment);
      });
      const groupedArray = Object.keys(grouped).map((date) => ({
        date,
        comments: grouped[date],
      }));
      setGroupedComments(groupedArray);
    }
  }, [commentsData]);
  const mutation = useMutation({
    mutationFn: async (newComment: {
      message: string;
      commented_by: number;
      reply_to: number;
    }) => {
      setLoading(true);
      const response = await addCommentsAPI(taskId, newComment);
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to add comment");
    },
    onSuccess: (data) => {
      toast.success("Comment added successfully!");
      setCommentText("");
      setRefreshCount(refreshCount + 1);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error adding comment");
      setLoading(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (payload: any) => {
      setLoading(true);
      const response = await deleteCommentsAPI(taskId, payload?.comment_id);
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to delete comment");
    },
    onSuccess: (data) => {
      toast.success("Comment deleted successfully!");
      setCommentText("");
      setRefreshCount(refreshCount + 1);
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || "Error removing comment");
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (payload: { comment_id: number; message: string }) => {
      setLoading(true);
      const response = await updateCommentsAPI(taskId, payload.comment_id, {
        message: payload.message,
      });
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to update comment");
    },
    onSuccess: (data) => {
      toast.success("Comment updated successfully!");
      setEditingCommentId(null);
      setRefreshCount(refreshCount + 1);
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || "Error updating comment");
    },
  });
  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    const payload: any = {
      message: commentText,
      commented_by: userID,
      reply_to: null,
    };
    mutation.mutate(payload);
  };
  const handleDeleteComment = (commentId: number) => {
    deleteMutation.mutate({ comment_id: commentId });
  };
  const handleEditComment = (commentId: number, message: string) => {
    setEditingCommentId(commentId);
    setCommentText(message);
  };
  const handleSaveEdit = () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    updateMutation.mutate({
      comment_id: editingCommentId!,
      message: commentText,
    });
  };
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setCommentText("");
  };
  const handleReplyComment = (commentId: number) => {
    setOpenReplies({ commentId: commentId, open: true });
  };
  const IsUserCommentOrNot = (comment: any) => {
    const isUserComment = comment.commented_by === userID;
    return isUserComment;
  };
  const formatCommentTime = (comment: any) => {
    const formattedDistance = formatDistanceToNow(
      new Date(comment.created_at),
      {
        addSuffix: true,
      }
    );
    return formattedDistance;
  };
  const handleAddReply = () => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    const payload: any = {
      message: replyText,
      commented_by: userID,
      reply_to: openReplies.commentId,
    };
    mutation.mutate(payload);
    setReplyText("");
  };
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [groupedComments]);
  return (
    <div className="flex flex-row">
      <div
        style={{ height: "calc(100vh - 50px)" }}
        className={`${openReplies?.open ? " w-[60%]" : "w-[100%]"}`}
      >
        <div className="card-header flex justify-between px-4 py-2 items-center mb-4 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-medium">Comments</h3>
          <button className="check-activity-button btn px-5 py-2 bg-[#28A74533] rounded-lg text-[#28A745] font-medium">
            Check Activity
          </button>
        </div>
        <div className="card-body px-4 flex flex-col h-[calc(100vh-300px)] overflow-y-auto">
          <div
            className="member-comments space-y-3 overflow-y-scroll flex-1 pr-3"
            ref={commentsContainerRef}
          >
            {groupedComments?.length > 0
              ? groupedComments?.map((group: any, index: number) => {
                  const formattedDate = format(new Date(group.date), "PPP");
                  return (
                    <div key={index} className="group space-y-3">
                      <div className="my-4 text-center text-gray-500 text-xs">
                        <span className="bg-white px-2">{formattedDate}</span>
                      </div>
                      {group.comments?.length > 0
                        ? group.comments.map((comment: any) => {
                            const isEdited =
                              comment.updated_at &&
                              comment.created_at !== comment.updated_at;
                            return (
                              <div
                                key={comment.id}
                                className={`each-member flex flex-col bg-[#FEF7FD] py-4 px-4 rounded-md w-[70%] ${IsUserCommentOrNot(comment) ? "ml-auto text-right" : "mr-auto text-left"}`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="member-details flex items-center space-x-3">
                                    <div className="member-profile-image">
                                      <img
                                        className="w-8 h-8 rounded-full"
                                        src={
                                          comment.user?.avatar ||
                                          "https://i.pravatar.cc/150?img=5"
                                        }
                                        alt="Avatar"
                                      />
                                    </div>
                                    <div className="member-name">
                                      <span className="font-semibold">
                                        {IsUserCommentOrNot(comment)
                                          ? "You"
                                          : comment.user?.name || "Unknown"}
                                      </span>
                                      <span className="text-[#67727E] font-normal text-sm pl-2">
                                        {formatCommentTime(comment)}{" "}
                                        {isEdited && (
                                          <span className="text-xs text-gray-400">
                                            (edited)
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger>
                                      <button className="text-gray-500 hover:text-gray-800">
                                        <DotsHorizontalIcon className="w-5 h-5" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="bg-white p-2 rounded-md shadow-lg"
                                    >
                                      <DropdownMenuItem
                                        className={`cursor-pointer ${IsUserCommentOrNot(comment) ? "" : "hidden"}`}
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className={`cursor-pointer ${IsUserCommentOrNot(comment) ? "" : "hidden"}`}
                                        onClick={() =>
                                          handleEditComment(
                                            comment.id,
                                            comment.message
                                          )
                                        }
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleReplyComment(comment.id)
                                        }
                                      >
                                        Reply
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <div className="person-message mt-2 text-slate-500 leading-snug">
                                  {editingCommentId === comment.id ? (
                                    <div className="flex flex-col">
                                      <CKEditorComponent
                                        editorData={commentText}
                                        handleEditorChange={
                                          handleTestDetailsChange
                                        }
                                      />
                                      <div className="mt-3 flex justify-end space-x-3">
                                        <button
                                          className="text-gray-500"
                                          onClick={handleCancelEdit}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="text-[#28A745]"
                                          onClick={handleSaveEdit}
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: comment.message,
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })
                        : "Comments not found"}
                    </div>
                  );
                })
              : "No comments found"}
          </div>
        </div>
        <div className="card-footer sticky bottom-0 left-0 right-0 bg-white px-4 py-4  z-10 overflow-hidden">
          <div className="grid grid-cols-[50px,auto]">
            <div className="profile-image">
              <img
                className="shadow-lg rounded-full"
                src="/profile-avatar.png"
                alt="User"
              />
            </div>
            <div className="text-area-group border border-[#A9A9A9] rounded-lg items-start space-x-3 grid grid-cols-[90%,auto]">
              <div>
                {taskId && (
                  <CKEditorComponent
                    editorData={commentText}
                    handleEditorChange={handleTestDetailsChange}
                  />
                )}
              </div>
              <div>
                <button
                  className="rounded-md pt-2 pr-2"
                  onClick={handleAddComment}
                >
                  <img
                    src="/add-comment-arrow.svg"
                    alt="icon"
                    className="w-[40px] h-[40px]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <LoadingComponent loading={loading} />
      </div>
      {openReplies?.open && (
        <div
          style={{ height: "calc(100vh - 50px)" }}
          className={`${openReplies?.open ? "w-[40%]" : ""}`}
        >
          <RepliedComments
            mainComment={groupedComments
              ?.flatMap((group: any) => group.comments)
              .find((comment: any) => comment.id === openReplies.commentId)}
            handleReplyChange={handleReplyChange}
            handleAddReply={handleAddReply}
            replyText={replyText}
            IsUserCommentOrNot={IsUserCommentOrNot}
            formatCommentTime={formatCommentTime}
            setOpenReplies={setOpenReplies}
          />
        </div>
      )}
    </div>
  );
};
export default TaskComments;
