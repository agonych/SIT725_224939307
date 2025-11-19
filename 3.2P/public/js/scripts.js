let menuItemsCache = [];
let selectedCoffee = null;
let orderModalInstance = null;

/** Show a toast message using Materialize or fallback to alert **/
function showToast(message, classes = '', duration = 4000) {
    if (window.M && typeof M.toast === 'function') {
        M.toast({ html: message, classes, displayLength: duration });
    } else {
        alert(message);
    }
}

/** Update validation state of a form field **/
function updateValidationState(selector, isValid) {
    const $field = $(selector);
    if (!$field.length) return;
    $field.removeClass('valid invalid');
    $field.addClass(isValid ? 'valid' : 'invalid');
}

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
        $('#orderForm .validate').removeClass('valid invalid');
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
            coffeeName: selectedCoffee ? selectedCoffee.name : ''
        };

        const fieldDefinitions = [
            { key: 'firstName', selector: '#orderCustomerFirstName', label: 'first name' },
            { key: 'lastName', selector: '#orderCustomerLastName', label: 'last name' },
            { key: 'email', selector: '#orderCustomerEmail', label: 'email address' },
            { key: 'phone', selector: '#orderCustomerPhone', label: 'phone number' },
            { key: 'address', selector: '#orderCustomerAddress', label: 'street address' },
            { key: 'suburb', selector: '#orderCustomerSuburb', label: 'suburb' },
            { key: 'postcode', selector: '#orderCustomerPostcode', label: 'postcode' },
            { key: 'state', selector: '#orderCustomerState', label: 'state' }
        ];

        let invalidField = null;

        fieldDefinitions.forEach(field => {
            const value = $(field.selector).val().trim();
            formData[field.key] = value;
            const isValid = value !== '';
            updateValidationState(field.selector, isValid);
            if (!isValid && !invalidField) {
                invalidField = field;
            }
        });

        if (invalidField) {
            showToast(`Please enter your ${invalidField.label}.`, 'red darken-1');
            $(invalidField.selector).focus();
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            updateValidationState('#orderCustomerEmail', false);
            showToast('Please enter a valid email address.', 'red darken-1');
            $('#orderCustomerEmail').focus();
            return;
        } else {
            updateValidationState('#orderCustomerEmail', true);
        }

        if (!/^\d{4}$/.test(formData.postcode)) {
            updateValidationState('#orderCustomerPostcode', false);
            showToast('Postcode must be exactly 4 digits.', 'red darken-1');
            $('#orderCustomerPostcode').focus();
            return;
        } else {
            updateValidationState('#orderCustomerPostcode', true);
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
                showToast('Order placed successfully!', 'green darken-1');
                $('#orderForm')[0].reset();
                $('#orderForm .validate').removeClass('valid invalid');
                M.updateTextFields();
                if (orderModalInstance) {
                    orderModalInstance.close();
                }
            })
            .catch(error => {
                console.error('Error submitting order:', error);
                showToast('We could not place your order. Please try again.', 'red darken-1');
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
