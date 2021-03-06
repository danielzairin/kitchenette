import React, { useContext, useEffect, useState } from "react";
import GroceryList from "./components/grocery-list/GroceryList";
import Pantry from "./components/pantry/Pantry";
import Recipes from "./components/recipes/Recipes";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import firebase from "./firebase";

function App() {
  const user = useContext(UserContext);
  const [groceryItems, setGroceryItems] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection("groceryItems")
        .where("userId", "==", user.uid)
        .onSnapshot((snapshot) => {
          setGroceryItems(
            snapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            })
          );
        });

      firebase
        .firestore()
        .collection("pantryItems")
        .where("userId", "==", user.uid)
        .onSnapshot((snapshot) => {
          setPantryItems(
            snapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
                expiryDate: new Date(doc.data().expiryDate.seconds * 1000),
                daysUntilExpired: Math.ceil(
                  (doc.data().expiryDate.seconds - new Date() / 1000) / 86400
                ),
              };
            })
          );
        });
    }
  }, [user]);

  useEffect(() => {
    if (pantryItems.length === 0) {
      setRecipes([]);
      return;
    };

    const urlQuery = pantryItems
      .filter((item) => item.daysUntilExpired > 0)
      .map((item) => item.name)
      .toString();

    fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.REACT_APP_API_KEY}&number=5&ranking=2&ingredients=${urlQuery}`
    )
      .then((response) => response.json())
      .then((recipes) => setRecipes(recipes));
  }, [pantryItems]);

  async function addToCollection(data, collectionName) {
    return firebase
      .firestore()
      .collection(collectionName)
      .add({ userId: user.uid, ...data });
  }

  async function deleteFromCollection(id, collectionName) {
    return firebase.firestore().collection(collectionName).doc(id).delete();
  }

  async function updateInColletion(id, data, collectionName) {
    return firebase.firestore().collection(collectionName).doc(id).update(data);
  }

  return (
    <Router>
      {user ? (
        <div className="container">
          <Switch>
            <Route path="/groceryList">
              <GroceryList
                groceryItems={groceryItems}
                addToCollection={addToCollection}
                deleteFromCollection={deleteFromCollection}
                updateInCollection={updateInColletion}
              />
            </Route>
            <Route path="/pantry">
              <Pantry
                pantryItems={pantryItems}
                addToCollection={addToCollection}
                deleteFromCollection={deleteFromCollection}
              />
            </Route>
            <Route path="/recipes">
              <Recipes recipes={recipes} addToCollection={addToCollection} />
            </Route>
            <Redirect to="/pantry" />
          </Switch>
          <Navbar />
        </div>
      ) : (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}
    </Router>
  );
}

export default App;
