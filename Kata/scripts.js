class ShoppingCart {
    constructor() {
        this.items = {};  // Warenkorb-Artikel
        
        // Warenkorb aus dem localStorage laden, falls vorhanden
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    addItem(id, name, price, quantity = 1, department = '') {
        if (this.items[id]) {
            // Artikel existiert bereits, Menge erhöhen
            this.items[id].quantity += parseInt(quantity);
        } else {
            // Artikel hinzufügen
            this.items[id] = { 
                id, 
                name, 
                price: parseFloat(price), 
                quantity: parseInt(quantity), 
                department 
            };
        }
        
        // Warenkorb im localStorage speichern
        localStorage.setItem('cart', JSON.stringify(this.items));
        
        // Warenkorb aktualisieren
        this.updateCart();
        
        // Feedback für den Benutzer
        alert(`${quantity}x ${name} zum Warenkorb hinzugefügt!`);
    }

    removeItem(id) {
        delete this.items[id]; 
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCart();  
    }

    calculateSubtotal() {
        let subtotal = 0;
        for (const id in this.items) {
            const item = this.items[id];
            subtotal += item.price * item.quantity;
        }
        return subtotal.toFixed(2);
    }
    
    calculateDiscount() {
        // Beispiel für einen einfachen Rabatt
        const subtotal = parseFloat(this.calculateSubtotal());
        // 5% Rabatt für Einkäufe über €50
        return (subtotal > 50) ? (subtotal * 0.05).toFixed(2) : "0.00";
    }
    
    calculateTotal() {
        const subtotal = parseFloat(this.calculateSubtotal());
        const discount = parseFloat(this.calculateDiscount());
        return (subtotal - discount).toFixed(2);
    }

    updateCart() {
        const cartItemsElement = document.getElementById('cartItems');
        
        // Wenn wir uns nicht auf der Warenkorb-Seite befinden, nichts tun
        if (!cartItemsElement) return;
        
        const subtotalElement = document.getElementById('subtotal');
        const discountElement = document.getElementById('discount');
        const totalElement = document.getElementById('total');

        if (Object.keys(this.items).length === 0) {
            cartItemsElement.innerHTML = '<p>Ihr Warenkorb ist leer</p>';
            
            if (subtotalElement) subtotalElement.textContent = "€0.00";
            if (discountElement) discountElement.textContent = "-€0.00";
            if (totalElement) totalElement.textContent = "€0.00";
        } else {
            cartItemsElement.innerHTML = ''; 
            
            // Erstelle eine Tabelle für die Warenkorb-Artikel
            const table = document.createElement('table');
            table.className = 'table table-striped';
            
            // Tabellenkopf
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Produkt</th>
                    <th>Preis</th>
                    <th>Menge</th>
                    <th>Gesamt</th>
                    <th>Aktion</th>
                </tr>
            `;
            table.appendChild(thead);
            
            // Tabellenkörper
            const tbody = document.createElement('tbody');
            
            for (const id in this.items) {
                const item = this.items[id];
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.name}</td>
                    <td>€${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>€${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger remove-item" data-id="${id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
            
            table.appendChild(tbody);
            cartItemsElement.appendChild(table);
            
            // Aktualisiere die Gesamtbeträge
            if (subtotalElement) subtotalElement.textContent = `€${this.calculateSubtotal()}`;
            if (discountElement) discountElement.textContent = `-€${this.calculateDiscount()}`;
            if (totalElement) totalElement.textContent = `€${this.calculateTotal()}`;
            
            // Entfernen der Artikel aus dem Warenkorb
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.closest('.remove-item').dataset.id;
                    this.removeItem(id);
                });
            });
        }
    }
    
    clearCart() {
        this.items = {};
        localStorage.removeItem('cart');
        this.updateCart();
    }
}

// Erstelle eine globale Instanz des Warenkorbs
const cart = new ShoppingCart();

document.addEventListener('DOMContentLoaded', () => {
    // Event-Listener für die "Hinzufügen"-Buttons
    document.addEventListener('click', (e) => {
        const addToCartButton = e.target.closest('.add-to-cart');
        
        if (addToCartButton) {
            // Holen des Wertes aus den data-Attributen des Buttons
            const id = addToCartButton.dataset.id;
            const name = addToCartButton.dataset.name;
            const price = parseFloat(addToCartButton.dataset.price);
            const department = addToCartButton.dataset.department;
            
            // Dynamisch die ID des Eingabefeldes erstellen
            const quantityField = document.getElementById(`quantity-${id}`);
            const quantity = quantityField ? parseInt(quantityField.value) : 1;
            
            // Wenn eine Menge ausgewählt wurde, Artikel in den Warenkorb hinzufügen
            if (quantity > 0) {
                cart.addItem(id, name, price, quantity, department);
            } else {
                alert("Bitte wählen Sie eine Menge aus.");
            }
        }
    });
    
    // Event-Listener für den "Bezahlen"-Button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (Object.keys(cart.items).length === 0) {
                alert('Ihr Warenkorb ist leer!');
                return;
            }
            
            alert('Bezahlung abgeschlossen!');
            cart.clearCart();
        });
    }
    
    // Event-Listener für den "Leeren"-Button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (Object.keys(cart.items).length === 0) {
                alert('Ihr Warenkorb ist bereits leer!');
                return;
            }
            
            if (confirm('Möchten Sie wirklich den gesamten Warenkorb leeren?')) {
                cart.clearCart();
            }
        });
    }
    
    // Warenkorb beim Laden der Seite aktualisieren
    cart.updateCart();
});