const clientsList = document.getElementById('clients-list');
const submitButton = document.getElementById('register-btn');
const userInputs = document.querySelectorAll('.form-control');
const radioButtons = document.querySelectorAll('.form-check-input');
const alertBox = document.getElementById('alertBox');

function resetInputs() {
    userInputs.forEach(input => {
        input.value = '';
    });
    radioButtons.forEach(input => {
        input.checked = false;
    });
}

// showing success or failure message based on flag
function alertMessage(flag, message) {
    alertBox.style.display = "none";
    alertBox.classList.remove('fade-out')
    if (flag) {
        alertBox.classList.add('alert-success');
        alertBox.classList.remove('alert-danger');
    } else {
        alertBox.classList.add('alert-danger');
        alertBox.classList.remove('alert-success');
    }
    alertBox.innerHTML = message;
    alertBox.style.display = "block";
    alertBox.classList.add('fade-out');
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 5000);
}

// validating form inputs
function validateForm() {
    return userInputs[0].value && userInputs[1].value &&
        userInputs[2].value && userInputs[3].value &&
        (radioButtons[0].checked || radioButtons[1].checked);
}

// Template of a list item for a new form
function getTemplate(doc) {
    const template = document.createElement('li');
    template.classList.add('list-group-item');
    template.innerHTML = `<div class="row">
                          <div class="col-md-4">First name: <span class="blue"> ${doc.firstName}</span></div>
                          <div class="col-md-4">Email: <span class="blue font">${doc.email}</span></div>
                          <div class="col-md-4 tex-right">
                            <button type="button" class="btn btn-secondary" id="editBtn${doc._id}" onclick="editClient('${doc._id}')">Edit</button>
                            <button type="button" class="btn btn-danger" id="deleteBtn${doc._id}" onclick="deleteClient('${doc._id}')">Delete</button>
                          </div>
                          <div class="col-md-4">Last name: <span class="blue">${doc.lastName}</span></div>
                          <div class="col-md-4">Sex: <span class="blue">${doc.gender}</span></div>
                          <div class="col-md-4"></div>
                          <div class="col-md-4"></div>
                          <div class="col-md-4"></div>
                        </div>`;
    return template;
}
/**
 * Post Request for registering clients
 */
submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateForm()) {
        alertMessage(false, "Please provide valid inputs!")
        return;
    }
    const gender = radioButtons[0].checked ? "MALE" : "FEMALE";
    const insertedDocument = {
        firstName: userInputs[0].value,
        lastName: userInputs[1].value,
        email: userInputs[2].value,
        password: userInputs[3].value,
        gender: gender
    }
    fetch('/', {
        method: "post",
        body: JSON.stringify(insertedDocument),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.ok && jsonResponse.n) {
            const doc = jsonResponse.ops[0];
            const newForm = getTemplate(doc);
            clientsList.append(newForm);
            alertMessage(true, "Successfully registered a new client");
        } else {
            alertMessage(false, "Error with client registration!");
            console.log(jsonResponse.error);
        }
        resetInputs();
    });
});
/**
 * Delete Request for removing clients
 */
function deleteClient(id) {
    const deletedDocument = {
        id: id
    }
    fetch('/', {
        method: "delete",
        body: JSON.stringify(deletedDocument),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.ok && !jsonResponse.error) {
            const deleteBtn = document.getElementById('deleteBtn' + jsonResponse.value._id);
            const removedChild = deleteBtn.parentNode.parentNode.parentNode;
            clientsList.removeChild(removedChild);
            alertMessage(true, "Successfully deleted client : " + jsonResponse.value.firstName + " " + jsonResponse.value.lastName);
        } else {
            alertMessage(false, "Error with deleting the form!");
            console.log(jsonResponse.error);
        }
    });
}

/**
 * PUT Request for editing forms
 */
function editClient(id) {
    const updatedDocument = { id: id };
    userInputs.forEach(input => {
        if (input.value) updatedDocument[input.name] = input.value;
    });
    if (radioButtons[0].checked || radioButtons[1].checked)
        updatedDocument.gender = radioButtons[0].checked ? "MALE" : "FEMALE";
    if (Object.keys(updatedDocument).length < 2) {
        alertMessage(false, "Please provide valid inputs!");
        return;
    }

    fetch('/', {
        method: "put",
        body: JSON.stringify(updatedDocument),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.ok && !jsonResponse.error) {
            const editBtn = document.getElementById('editBtn' + jsonResponse.value._id);
            const editedChild = editBtn.parentNode.parentNode.parentNode;
            const updatedChild = getTemplate(jsonResponse.value);
            clientsList.replaceChild(updatedChild, editedChild);
            alertMessage(true, "Successfully updated client : " + jsonResponse.value.firstName + " " + jsonResponse.value.lastName);
        } else {
            alertMessage(false, "Error with editing the form!");
            console.log(jsonResponse.error);
        }
        resetInputs();
    });
}














