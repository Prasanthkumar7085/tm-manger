import CKEditorComponent from "@/components/core/CKEditor/CKEditorComponent";

const RepliedComments = ({
  mainComment,
  handleReplyChange,
  handleAddReply,
  replyText,
}: any) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
      {/* Main Comment Section */}
      <div className="mb-6">
        <div className="font-semibold text-lg text-gray-800 mb-2">
          Main Comment:
        </div>
        <div
          className="text-sm text-gray-700 bg-gray-100 p-4 rounded-md"
          dangerouslySetInnerHTML={{
            __html: mainComment?.message || "No message available",
          }}
        />
      </div>

      {/* Replies Section */}
      <div className="mb-6">
        <div className="font-semibold text-lg text-gray-800 mb-2">Replies:</div>
        {/* Render the replies here, if any */}
        {/* For now, we're just rendering a placeholder */}
        <div className="space-y-4">
          {/* Example Reply */}
          {mainComment?.replies?.length > 0 ? (
            mainComment.replies.map((reply: any) => (
              <div key={reply.id} className="flex items-start space-x-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={reply.user?.avatar || "https://i.pravatar.cc/150?img=5"}
                  alt="User Avatar"
                />
                <div className="flex flex-col space-y-1">
                  <div className="text-sm font-semibold text-gray-800">
                    {reply.user?.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-600">{reply.message}</div>
                  <div className="text-xs text-gray-500">
                    {reply.created_at}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No replies yet.</div>
          )}
        </div>
      </div>

      {/* Add a New Reply */}
      <div className="mt-6">
        <div className="font-semibold text-lg text-gray-800 mb-2">
          Add Your Reply:
        </div>
        <CKEditorComponent
          editorData={replyText}
          handleEditorChange={handleReplyChange}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddReply}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepliedComments;
