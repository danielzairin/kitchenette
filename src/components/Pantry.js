import React, { useEffect, useState } from "react"
import { pantryItems } from "../testData.js";

function Pantry() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(pantryItems);
  }, []);

  return (
    <div>
      <h1>Pantry</h1>

      <ul> <h3>Items in Pantry:</h3>
        {items.map((item) => (
          <li key={item.id}><span>{item.name} {item.expiryDate.toLocaleDateString()} </span></li>
        ))}
      </ul>
     
    </div>
  );
}


export default Pantry;
