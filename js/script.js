document.addEventListener("DOMContentLoaded", function () {
    const customerForm = document.getElementById("customerForm");
    const searchBar = document.getElementById("searchBar"); // Get reference to the search bar input field

    // Event listener for form submission
    customerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form input values
        const name = document.getElementById("name").value;
        const date = document.getElementById("date").value;
        const product = document.getElementById("product").value;
        const price = document.getElementById("price").value;
        const paymentType = document.getElementById("payment").value;

        // Validate input
        if (name.trim() === "" || date === "" || price === "") {
            showModal("Please fill in all fields.");
            return;
        }

        // Add customer data to list
        addCustomerToList(name, date, product, price, paymentType);

        // Clear form fields
        customerForm.reset();

        // Calculate totals
        calculateTotals();
    });

    // Function to add customer data to list
    function addCustomerToList(name, date, product, price, paymentType) {
        let customerSection = document.getElementById(name);
        if (!customerSection) {
            // Create a new section for the customer if it doesn't exist
            customerSection = document.createElement("section");
            customerSection.id = name;
            customerSection.classList.add("customer-section"); // Add a class for styling
            customerSection.innerHTML = `<h2>${name}</h2>`;
            document.getElementById("customerList").appendChild(customerSection);
        }

        // Check if there is an existing entry for this customer
        const existingItem = customerSection.querySelector(`li[data-date="${date}"][data-product="${product}"]`);
        if (existingItem) {
            // Replace existing data with edited data
            existingItem.innerHTML = `
                <span><strong>Product:</strong> ${product}</span>
                <span><strong>Date:</strong> ${date}</span>
                <span><strong>Price:</strong> PKR ${price}</span>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            `;
            return;
        }

        // Create list item for the customer data
        const listItem = document.createElement("li");
        listItem.dataset.date = date; // Set data attributes for identifying the entry
        listItem.dataset.product = product;
        listItem.innerHTML = `
            <span><strong>Product:</strong> ${product}</span>
            <span><strong>Date:</strong> ${date}</span>
            <span><strong>Price:</strong> PKR ${price}</span>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;

        // Apply style based on payment type
        if (paymentType === "cash") {
            listItem.classList.add("cash");
            listItem.style.color = "green";
        } else if (paymentType === "deferred") {
            listItem.classList.add("deferred");
            listItem.style.color = "red";
        }

        // Append the list item to the customer section
        customerSection.appendChild(listItem);

        // Add event listeners for edit and delete buttons
        const editButton = listItem.querySelector(".edit-button");
        editButton.addEventListener("click", function () {
            editCustomer(listItem);
        });

        const deleteButton = listItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", function () {
            confirmDelete(listItem);
        });
    }

    // Function to handle editing customer entries
    function editCustomer(listItem) {
        // Populate form fields with customer data for editing
        const product = listItem.querySelector("span:nth-child(1)").textContent.split(": ")[1];
        const date = listItem.querySelector("span:nth-child(2)").textContent.split(": ")[1];
        const price = listItem.querySelector("span:nth-child(3)").textContent.split("PKR ")[1];
        document.getElementById("product").value = product;
        document.getElementById("date").value = date;
        document.getElementById("price").value = price;
        document.getElementById("name").value = listItem.parentElement.id; // Fill name field with customer name
    }

    // Function to handle confirming deletion of a customer entry
    function confirmDelete(listItem) {
        if (confirm("Are you sure you want to delete this entry?")) {
            deleteCustomer(listItem);
        }
    }

    // Function to handle deleting customer entries
    function deleteCustomer(listItem) {
        // Remove the list item from the customer section
        const customerSection = listItem.parentElement;
        listItem.remove();

        // Check if the customer section is empty
        if (customerSection.querySelectorAll("li").length === 0) {
            // Remove the customer section if it has no list items
            customerSection.remove();
        }
    }

    // Add event listener to the search bar input field
    searchBar.addEventListener("input", function () {
        const searchQuery = searchBar.value.trim().toLowerCase(); // Get the search query from the input field
        filterCustomers(searchQuery); // Call the function to filter customers based on the search query
    });

    // Function to filter customers based on the search query
    function filterCustomers(query) {
        const customerSections = document.querySelectorAll(".customer-section");
        customerSections.forEach(function (section) {
            const customerName = section.querySelector("h2").textContent.toLowerCase(); // Get the customer name
            if (customerName.includes(query)) {
                section.style.display = ""; // Show the customer section if the name matches the search query
            } else {
                section.style.display = "none"; // Hide the customer section if the name does not match the search query
            }
        });
    }

    // Calculate and display total cash amount and total amount for each customer
    function calculateTotals() {
        const customerSections = document.querySelectorAll(".customer-section");
        customerSections.forEach(function (section) {
            const cashItems = section.querySelectorAll(".cash");
            const deferredItems = section.querySelectorAll(".deferred");
            let cashTotal = 0;
            let total = 0;

            // Calculate cash total
            cashItems.forEach(function (item) {
                const price = parseFloat(item.textContent.split("PKR ")[1]);
                cashTotal += price;
            });

            // Calculate total (including deferred payments)
            total = cashTotal;
            deferredItems.forEach(function (item) {
                const price = parseFloat(item.textContent.split("PKR ")[1]);
                total += price;
            });

            // Remove existing total buttons if any
            section.querySelectorAll(".total-button").forEach(button => button.remove());

            // Create and append buttons for total cash amount and total amount
            const totalCashButton = document.createElement("button");
            totalCashButton.textContent = `Total Cash Amount: PKR ${cashTotal.toFixed(2)}`;
            totalCashButton.classList.add("total-button");
            totalCashButton.addEventListener("click", function () {
                showModal(`Total Cash Amount: PKR ${cashTotal.toFixed(2)}`);
            });
            section.appendChild(totalCashButton);

            const totalButton = document.createElement("button");
            totalButton.textContent = `Total Amount: PKR ${total.toFixed(2)}`;
            totalButton.classList.add("total-button");
            totalButton.addEventListener("click", function () {
                showModal(`Total Amount: PKR ${total.toFixed(2)}`);
            });
            section.appendChild(totalButton);
        });
    }

    // Function to display modal dialogs
    function showModal(message) {
        // Implement your modal display logic here
        alert(message);
    }
});
