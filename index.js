import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-61cb0-default-rtdb.europe-west1.firebasedatabase.app/"
} /**shopping list updates in firebase  */

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button") /**adds items by ID to shopping cart */
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value /**clears previous cart items */
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

/*const fruits = [
  { name: 'Apple', image: 'apple.jpg', price: 1.50 },
  { name: 'Banana', image: 'banana.jpg', price: 0.50 },
  // Add more fruits as needed
];*/

const searchInput = document.getElementById('searchInput');
const fruitResults = document.getElementById('fruitResults');
const cart = document.getElementById('cart');
//
onValue(shoppingListInDB, function(snapshot) {
    
   if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    /*call the display cart to initially load items  */
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB) 
    })
    
    shoppingListEl.append(newEl)
}

function displayResults(query) {
  fruitResults.innerHTML = '';
  const filteredFruits = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(query.toLowerCase())
  );
  filteredFruits.forEach(fruit => {
    const fruitDiv = document.createElement('div');
    fruitDiv.innerHTML = `
      <img src="${fruit.image}" alt="${fruit.name}">
      <p>${fruit.name} - $${fruit.price}</p> 
      <button onclick="addToCart('${fruit.name}', '${fruit.image}', ${fruit.price})">Add to Cart</button>
    `;
    fruitResults.appendChild(fruitDiv);
  });
}
