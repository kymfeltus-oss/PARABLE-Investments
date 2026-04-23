import type { ReactNode } from 'react';
/* Global styles must live in a route layout, not in a client component, or /meet can crash at runtime. */
import '@livekit/components-styles';
import './meet-teams-theme.css';

export default function MeetLayout({ children }: { children: ReactNode }) {
  return children;
}
