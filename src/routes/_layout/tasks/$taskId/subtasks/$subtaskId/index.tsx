import AddSubTask from '@/components/Tasks/subtasks/Add'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_layout/tasks/$taskId/subtasks/$subtaskId/',
)({
  component: () => (
    <div>
      <AddSubTask />
    </div>
  ),
})
