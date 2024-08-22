"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    const roundedPrice = parseFloat(newItem.price).toFixed(2); // Round price to 2 decimal places
    if (
      newItem.name !== "" &&
      newItem.price !== "" &&
      newItem.quantity !== ""
    ) {
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        price: roundedPrice,
        quantity: newItem.quantity,
      });
      setNewItem({ name: "", price: "", quantity: "" });
    }
  };

  // Read items from database and calculate total
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Calculate total price based on quantity and price
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
          0
        );
        setTotal(totalPrice.toFixed(2));
      };
      calculateTotal();
    });

    return () => unsubscribe();
  }, []);

  // Restrict the price input field to 2 decimal places
  const handlePriceChange = (e) => {
    let value = e.target.value;
    // Allow numbers with up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setNewItem({ ...newItem, price: value });
    }
  };

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  //Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">PantryAPP</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-12 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-4 p-3 border mx-3"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.price}
              onChange={handlePriceChange}
              className="col-span-4 p-3 border mx-3"
              type="text"
              placeholder="Enter $"
            />
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter Quantity"
            />
            <button
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl col-span-2 mx-3"
              type="submit"
            >
              +
            </button>
          </form>

          {/* Search input field */}
          <div className="grid grid-cols-12 items-center text-black py-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-4 p-3 border mx-3 text-black"
              type="text"
              placeholder="Search Items"
            />
          </div>

          <ul>
            {filteredItems.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>${item.price}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {filteredItems.length < 1 ? (
            ""
          ) : (
            <div className="flex justify-between p-3">
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
