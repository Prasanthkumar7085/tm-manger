// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { useParams } from "@tanstack/react-router";
// import { getCommentsAPI, postCommentsAPI } from "@/lib/services/tasks";
// import { Button } from "@/components/ui/button";
// import Textarea from "@/components/ui/textarea"; // Assuming you're using a custom Textarea component

// const ViewAll = () => {
//   const { taskId } = useParams({strict:false}); // Get taskId from params
//   const [commentsText, setCommentsText] = useState("");

//   // Fetch comments using TanStack Query
//   const {
//     data: commentsData,
//     refetch: refetchComments,
//     isLoading,
//   } = useQuery(
//     ["comments", taskId], // Ensure taskId is used as the query key
//     () => getCommentsAPI(taskId), // Fetch comments based on taskId

//   );

//   // Mutation to post a new comment
//   const postCommentMutation = useMutation({
//     mutationFn: (payload) => postCommentsAPI(taskId, payload),
//     onSuccess: () => {
//       refetchComments(); // Refetch comments after posting
//     },
//   });

//   // Function to handle posting a comment
//   const handlePostComment = () => {
//     if (!commentsText.trim()) return; // Prevent empty comments from being posted

//     postCommentMutation.mutate({ message: commentsText });
//     setCommentsText(""); // Clear the input field after posting
//   };

//   // Loading state
//   if (isLoading) return <p>Loading comments...</p>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Comments Section */}
//       <div className="mt-6 p-4 bg-white shadow rounded">
//         <h3 className="text-lg font-bold mb-4">Comments</h3>

//         {/* Textarea for new comment */}
//         <Textarea
//           rows={4}
//           placeholder="Enter your comment"
//           value={commentsText}
//           onChange={(e:any) => setCommentsText(e.target.value)}
//           className="w-full mb-4"
//         />

//         <Button onClick={handlePostComment}>Post Comment</Button>
//       </div>

//       {/* Display the list of comments */}
//       <div className="mt-6 p-4 bg-white shadow rounded">
//         <h3 className="text-lg font-bold mb-4">All Comments</h3>

//         {commentsData?.length ? (
//           <ul>
//             {commentsData?.map((comment, index) => (
//               <li key={index} className="mb-2">
//                 <p>
//                   <strong>{comment.commented_by}:</strong> {comment.message}
//                 </p>
//                 <small>{new Date(comment.created_at).toLocaleString()}</small>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No comments yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewAll;
