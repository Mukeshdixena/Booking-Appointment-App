document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;
    let email = document.getElementById("email").value;

    if (name && number && email) {
        axios.post('http://localhost:3000/api/postInfo', {
            name: name,
            number: number,
            email: email
        })
            .then(response => {
                console.log('Data posted:', response.data);
                addToList(response.data.id, name, number, email);
                document.getElementById("myForm").reset();
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        alert("Please fill in all fields.");
    }
});

function addToList(id, name, number, email) {
    let list = document.getElementById("detailsList");
    let li = document.createElement("li");
    li.setAttribute("data-id", id);
    li.innerHTML = `<span>${id} - ${name} - ${number} - ${email}</span>
                    <button class="edit" onclick="editItem(this)">Edit</button>
                    <button class="delete" onclick="deleteItem(this)">Delete</button>`;
    list.appendChild(li);
}

function deleteItem(btn) {
    let li = btn.parentElement;
    let id = li.getAttribute("data-id");

    if (!id) {
        console.error("No ID found for deletion.");
        return;
    }
    let infoId = parseInt(id);
    deleteInfo(infoId)
        .then(() => li.remove())
        .catch(error => console.error("Failed to delete:", error));
}

function editItem(btn) {
    let details = btn.parentElement.firstChild.textContent.split(" - ");
    document.getElementById("name").value = details[1];
    document.getElementById("number").value = details[2];
    document.getElementById("email").value = details[3];
    btn.parentElement.remove();
}

function getData() {
    axios.get('http://localhost:3000/api/getInfo')
        .then(response => {
            console.log('Fetched info:', response.data.data);
            for (let info of response.data.data) {
                const { id, name, number, email } = info;
                addToList(id, name, number, email);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

window.onload = getData;

async function deleteInfo(infoId) {
    console.log(infoId)

    const response = await axios.delete(`http://localhost:3000/api/deleteInfo/${infoId}`);
    console.log(response.data);

}
