import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ForgotComponent from '@/components/auth/Forgot';

export const Route = createFileRoute("/forgot-password")({
  component: () => (
    <div>
      <ForgotComponent />
    </div>
  ),
});