let menuItemsCache = [];
let selectedCoffee = null;
let orderModalInstance = null;

/** Attach event handlers for ordering coffees **/
function attachEventHandlers() {
    const menuContainer = $('#menuCards');

    menuContainer.on('click', '.order-btn', function (event) {
        event.preventDefault();

        const coffeeId = Number($(this).data('coffeeId'));
        selectedCoffee = menuItemsCache.find(item => Number(item.id) === coffeeId);

        if (!selectedCoffee) {
            M.toast({ html: 'Unable to find this coffee. Please try again.', classes: 'red darken-1' });
            return;
        }

        const orderForm = $('#orderForm')[0];
        orderForm.reset();

        $('#orderCoffeeId').val(selectedCoffee.id);
        $('#orderModalTitle').text(`Order ${selectedCoffee.name}`);
        $('#orderModalSubtitle').text(`Complete the form below to order your ${selectedCoffee.name}.`);
        M.updateTextFields();

        if (orderModalInstance) {
            orderModalInstance.open();
        } else {
            const instance = M.Modal.init(document.getElementById('orderModal'));
            instance.open();
            orderModalInstance = instance;
        }
    });

    $('#orderForm').on('submit', function (event) {
        event.preventDefault();

        const formData = {
            coffeeId: $('#orderCoffeeId').val(),
            coffeeName: selectedCoffee ? selectedCoffee.name : '',
            firstName: $('#orderCustomerFirstName').val().trim(),
            lastName: $('#orderCustomerLastName').val().trim(),
            email: $('#orderCustomerEmail').val().trim(),
            phone: $('#orderCustomerPhone').val().trim(),
            address: $('#orderCustomerAddress').val().trim(),
            suburb: $('#orderCustomerSuburb').val().trim(),
            postcode: $('#orderCustomerPostcode').val().trim(),
            state: $('#orderCustomerState').val().trim()
        };

        const missingField = Object.entries(formData).find(([key, value]) => {
            if (key === 'coffeeName') {
                return false;
            }
            return value === '';
        });

        if (missingField) {
            M.toast({ html: 'Please complete all required fields.', classes: 'red darken-1' });
            return;
        }

        if (!/^\d{4}$/.test(formData.postcode)) {
            M.toast({ html: 'Postcode must be exactly 4 digits.', classes: 'red darken-1' });
            return;
        }

        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                M.toast({ html: 'Order placed successfully!', classes: 'green darken-1' });
                $('#orderForm')[0].reset();
                M.updateTextFields();
                if (orderModalInstance) {
                    orderModalInstance.close();
                }
            })
            .catch(error => {
                console.error('Error submitting order:', error);
                M.toast({ html: 'We could not place your order. Please try again.', classes: 'red darken-1' });
            });
    });
}

/** Load coffee menu items from the API **/
function loadMenuItems() {
    const menuContainer = $('#menuCards');
    const loadingIndicator = $('#menuLoading');

    fetch('/api/menu')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadingIndicator.remove();

            if (!data.items || !data.items.length) {
                menuContainer.append(
                    '<div class="col s12 center-align"><p>No coffee items available right now. Please check back later.</p></div>'
                );
                return;
            }

            menuItemsCache = data.items.slice();

            data.items.forEach(item => {
                const cardHtml = `
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image">
                                <img src="${item.image}" alt="${item.name}">
                                <span class="card-title">${item.name}</span>
                            </div>
                            <div class="card-content">
                                <p style="margin-bottom: 0.5rem">${item.description}</p>
                                <p><strong>$${Number(item.price).toFixed(2)} · ${item.strength}</strong></p>
                            </div>
                            <div class="card-action center-align">
                                <a href="#orderModal" class="btn brown darken-2 order-btn waves-effect waves-block waves-light" data-coffee-id="${item.id}">
                                    Order
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                menuContainer.append(cardHtml);
            });
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            loadingIndicator.remove();
            menuContainer.append(
                `<div class="col s12 center-align">
                    <p>We couldn’t brew the menu right now. Please try again later.</p>
                </div>`
            );
        });
}

/** Initialize Materialize components and load menu on document ready **/
$(document).ready(function () {
    $('.materialboxed').materialbox();

    const modalElems = document.querySelectorAll('.modal');
    M.Modal.init(modalElems);
    const orderModalElem = document.getElementById('orderModal');
    if (orderModalElem) {
        orderModalInstance = M.Modal.getInstance(orderModalElem);
    }

    attachEventHandlers();
    loadMenuItems();
});
