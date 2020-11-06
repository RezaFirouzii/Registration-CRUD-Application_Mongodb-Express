const clientsList = document.getElementById('clients-list');
const submitButton = document.getElementById('register-btn');
const userInputs = document.querySelectorAll('.form-control');
const radioButtons = document.querySelectorAll('.form-check-input');

function resetInputs() {
    userInputs.forEach(input => {
        input.value = '';
    });
}
// Template of a list item for a new form
function getTemplate(doc) {
    return `<div class="row">
              <div class="col-md-4">First name: <span class="blue"> ${ doc.firstName }</span></div>
              <div class="col-md-4">Email: <span class="blue font">${ doc.email }</span></div>
              <div class="col-md-4 tex-right">
                <button type="button" class="btn btn-secondary">Edit</button>
                <button type="button" class="btn btn-danger" id="deleteBtn${ doc._id }" onclick="deleteClient(${ doc._id })">Delete</button>
              </div>
              <div class="col-md-4">Last name: <span class="blue">${ doc.lastName }</span></div>
              <div class="col-md-4">Sex: <span class="blue">${ doc.gender }</span></div>
              <div class="col-md-4"></div>
              <div class="col-md-4"></div>
              <div class="col-md-4"></div>
            </div>`;
}
/**
 * Post Request for registering clients
 */
submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!userInputs[0].value ||
        !userInputs[1].value ||
        !userInputs[2].value ||
        !userInputs[3].value) {
        alert("Please provide valid inputs!");
        return;
    }
    const gender = radioButtons[0].checked ? "MALE" : "FEMALE";
    fetch('/', {
        method: "post",
        body: JSON.stringify({
            firstName: userInputs[0].value,
            lastName: userInputs[1].value,
            email: userInputs[2].value,
            password: userInputs[3].value,
            gender: gender
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.ok && jsonResponse.n) {
            const doc = jsonResponse.ops[0];
            const newForm = document.createElement('li');
            newForm.classList.add('list-group-item');
            newForm.innerHTML = getTemplate(doc);
            clientsList.append(newForm);
        }
        resetInputs();
    });
});
/**
 * Delete Request for removing clients
 */
function deleteClient(id) {
    console.log(id);
    fetch('/', {
        method: "delete",
        body: JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.ok) {
            const deleteBtn = document.getElementById('deleteBtn' + jsonResponse.value._id);
            const removedChild = deleteBtn.parentNode.parentNode.parentNode;
            clientsList.removeChild(removedChild);
        }
    });
}














