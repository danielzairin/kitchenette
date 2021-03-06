import { useEffect, createContext, useState } from "react";
import firebase from "../firebase";

export const UserContext = createContext();

export function UserContextProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // No user is signed in
        firebase
          .auth()
          .signInAnonymously();
      }
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
