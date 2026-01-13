import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

function Workspace() {
  const { user } = useUser();

  if (!user) {
    return <div>Please sign in to access the workspace.
      <Link to="/">
        <Button>Sign In</Button>
      </Link>
    </div>;
  }
  return (
    <div>
      Workspace
      <Outlet />
    </div>
  )
}

export default Workspace
