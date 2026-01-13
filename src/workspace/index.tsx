import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { firebaseDb } from './../../config/FirebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore"; // Added setDoc import

function Workspace() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    user && CreateNewUser();
  }, [user])
    
  // If user is not signed in
  const CreateNewUser = async () => {
    if (user) {
      // If user already exists in DB
      const docRef = doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // Insert new user
        await setDoc(doc(firebaseDb, "users", 
          user.primaryEmailAddress?.emailAddress), {
            fullName: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress, 
            createdAt: new Date(),
            credits: 2,
        })
      }
    }
  } 

  if (!user) {
    return (
      <div>Please sign in to access the workspace.
        <Link to="/">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      Workspace
      <Outlet />
    </div>
  )
}

export default Workspace