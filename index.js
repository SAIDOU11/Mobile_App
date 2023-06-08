import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-41ad1-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

let addBtnEl = document.getElementById("add-button");
let inputFieldEl = document.getElementById("input-field");
let shoppingListEl = document.getElementById("shopping-list");

addBtnEl.addEventListener("click", () => {
  let inputValue = inputFieldEl.value;
  if (inputValue === "") {
    return;
  }
  push(shoppingListInDB, inputValue);
  clearInput();
});

onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingList();
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendToList(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearShoppingList() {
  shoppingListEl.innerHTML = "";
}

function clearInput() {
  inputFieldEl.value = "";
}

function appendToList(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.addEventListener("click", () => {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  newEl.textContent = itemValue;
  shoppingListEl.append(newEl);
}
