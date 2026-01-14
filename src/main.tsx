import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import Workspace from './workspace/index.tsx'
import Project from './workspace/project/index.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { UserDetailContext } from './../context/UserDetailContext.tsx'
import { useState } from 'react'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/workspace',
    element: <Workspace />,
    children: [{
      path: 'project/:projectId',
      element: <Project />,
    }],
  },
])
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

function Root() {
  const [ userDetails, setUserDetails ] = useState();
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails}}>
     <RouterProvider router={router} />
     </UserDetailContext.Provider>
     </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
   
  </StrictMode>,
)
