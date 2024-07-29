$(document).ready(() => {
    const addEmployeeForm = $('#addEmployeeForm');
    const showAllEmployeesBtn = $('#showAllEmployeesBtn');
    const allEmployeesTable = $('#allEmployees');
    const searchInput = $('#searchInput');

    let employees = []; // Store the employees globally for search functionality

    function showSuccessMessage(message) {
        $('#successMessage').text(message);
        $('#successModal').modal('show');
    }

    addEmployeeForm.submit(async (e) => {
        e.preventDefault();
        const id = $('#addId').val();
        const name = $('#addName').val();
        const city = $('#addCity').val();
        const position = $('#addPosition').val();
        const salary = $('#addSalary').val();

        const response = await fetch('/addEmployee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name, city, position, salary })
        });

        const result = await response.json();
        showSuccessMessage(result.message);
        $('#addEmployeeForm')[0].reset();
        loadEmployees();
    });

    async function loadEmployees() {
        const response = await fetch('/employees');
        employees = await response.json(); // Store fetched employees in a global variable
        displayEmployees(employees);
    }

    function displayEmployees(empList) {
        allEmployeesTable.empty();
        empList.forEach(employee => {
            allEmployeesTable.append(`
                <tr data-id="${employee.id}">
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.city}</td>
                    <td>${employee.position}</td>
                    <td>${employee.salary}</td>
                    <td>
                        <button class="btn btn-warning btn-sm update-btn">Update Salary</button>
                        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                    </td>
                </tr>
            `);
        });
    }

    showAllEmployeesBtn.click(loadEmployees);

    // Delegate event for dynamically created buttons
    $(document).on('click', '.delete-btn', async function () {
        const row = $(this).closest('tr');
        const id = row.data('id');
        
        const response = await fetch(`/deleteEmployee/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        showSuccessMessage(result.message);
        loadEmployees();
    });

    $(document).on('click', '.update-btn', function () {
        const row = $(this).closest('tr');
        const id = row.data('id');
        const newSalary = prompt("Enter new salary for employee ID " + id + ":");

        if (newSalary) {
            fetch('/updateSalary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, newSalary: parseFloat(newSalary) })
            })
            .then(response => response.json())
            .then(result => {
                showSuccessMessage(result.message);
                loadEmployees();
            });
        }
    });

    // Implement search functionality
    searchInput.on('keyup', function () {
        const searchValue = $(this).val().toLowerCase();
        const filteredEmployees = employees.filter(employee => {
            return employee.id.toLowerCase().includes(searchValue) || 
                   employee.name.toLowerCase().includes(searchValue);
        });
        displayEmployees(filteredEmployees);
    });
});
