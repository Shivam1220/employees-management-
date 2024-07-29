const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'employees.json');

app.use(bodyParser.json());
app.use(express.static('public'));

// Read employee data from JSON file
function readDataFromFile() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

// Write employee data to JSON file
function writeDataToFile(employees) {
    fs.writeFileSync(dataFilePath, JSON.stringify(employees, null, 2));
}

// Add a new employee
app.post('/addEmployee', (req, res) => {
    const employees = readDataFromFile();
    const { id, name, city, position, salary } = req.body;
    employees.push({ id, name, city, position, salary });
    writeDataToFile(employees);
    res.send({ message: `Added employee ${name} (ID: ${id})` });
});

// Update employee salary
app.post('/updateSalary', (req, res) => {
    const employees = readDataFromFile();
    const { id, newSalary } = req.body;
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        employee.salary = newSalary;
        writeDataToFile(employees);
        res.send({ message: `Updated salary of ${employee.name} (ID: ${id}) to ${newSalary}` });
    } else {
        res.status(404).send({ message: `Employee with ID ${id} not found` });
    }
});

// Get employee info
app.get('/getEmployee/:id', (req, res) => {
    const employees = readDataFromFile();
    const { id } = req.params;
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        res.send(employee);
    } else {
        res.status(404).send({ message: `Employee with ID ${id} not found` });
    }
});
// Delete employee
app.delete('/deleteEmployee/:id', (req, res) => {
    const employees = readDataFromFile();
    const { id } = req.params;
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index !== -1) {
        employees.splice(index, 1);
        writeDataToFile(employees);
        res.send({ message: `Deleted employee with ID ${id}` });
    } else {
        res.status(404).send({ message: `Employee with ID ${id} not found` });
    }
});


// Show all employees
app.get('/employees', (req, res) => {
    const employees = readDataFromFile();
    res.send(employees);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
