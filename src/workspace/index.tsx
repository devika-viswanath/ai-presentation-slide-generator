import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useContext, use } from 'react';
import { Outlet, Link , useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { firebaseDb } from './../../config/FirebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserDetailContext } from '../../context/UserDetailContext';
import Header from '@/components/custom/Header';
import PromptBox from '@/components/custom/PromptBox';
import MyProjects from '@/components/custom/MyProjects';

function Workspace() {
  const { user, isLoaded } = useUser();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const location = useLocation();
  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  // Create New User If Not Exists
  const CreateNewUser = async () => {
    if (!user) return;

    const docRef = doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserDetails(docSnap.data());
    } else {
      const data = {
        fullName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        credits: 2,
      };

      // Correct syntax for setDoc
      await setDoc(doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress), data);

      setUserDetails(data); 
    }
  };

  if (!user) {
    return (
      <div>
        Please sign in to access the workspace.
        <Link to="/">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
     <Header/>
     {location.pathname ==='/workspace' && <div>
        <PromptBox />
        <MyProjects />
        
      </div>}
      <Outlet />
    </div>
  );
}

export default Workspace;
