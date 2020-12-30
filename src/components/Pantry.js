import React, { useEffect, useState } from "react"
import { pantryItems } from "../testData.js";

function Pantry() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(pantryItems);
    
  }, []);

//add new item to pantry
function addPantry(event){
  event.preventDefault();
  const newItem = {
    id: Math.random(),
    name: event.target["name"].value,
    expiryDate: new Date(event.target["expiryDate"].value),
   };
  setItems((prevItems) => [...prevItems, newItem]);
}

    //display todays date
    var showdate=new Date();
    var dt=showdate.toDateString();

  return (
    <div>
        <h1>Pantry</h1>
        <h4>Today : {dt} </h4> 

      <form onSubmit={addPantry}>
        <span>Add item: </span>
        <input type="text" placeholder="Item name" name="name" />
        <span>Add Expiry Date: </span>
        <input type="Date" placeholder="Expiry Date" name="expiryDate" />
        <button>Add</button>
      </form>

      <ul> <h3>Items in Pantry:</h3>
        {items.map((item) => (
          <li key={item.id}><span>{item.name}{item.expiryDate.toLocaleDateString()}</span></li>
       ))}
      </ul>
     
    </div>
  );
}

export default Pantry;