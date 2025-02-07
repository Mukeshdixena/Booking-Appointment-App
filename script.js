document.addEventListener("DOMContentLoaded", initApp);

let editId = null; // Store the ID of the item being edited

async function initApp() {
    await fetchData();
    document.getElementById("myForm").addEventListener("submit", handleSubmit);
    document.getElementById("detailsList").addEventListener("click", handleListActions);
}

async function fetchData() {
    try {
        const response = await axios.get("http://localhost:3000/api/getInfo");
        console.log(response);
        response.data.forEach(({ id, name, number, email }) => addToList(id, name, number, email));
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.name.value.trim();
    const number = form.number.value.trim();
    const email = form.email.value.trim();

    if (!name || !number || !email) return alert("Please fill in all fields.");

    try {
        if (editId) {
            // Update existing item
            await axios.put(`http://localhost:3000/api/editInfo/${editId}`, { name, number, email });
            updateListItem(editId, name, number, email);
            editId = null; // Reset edit mode
        } else {
            // Create new item
            const response = await axios.post("http://localhost:3000/api/postInfo", { name, number, email });
            addToList(response.data.id, name, number, email);
        }
        form.reset();
    } catch (error) {
        console.error("Error submitting data:", error);
    }
}

function addToList(id, name, number, email) {
    if (document.querySelector(`li[data-id='${id}']`)) return;

    const li = document.createElement("li");
    li.dataset.id = id;
    li.innerHTML = `
        <span>${id} - ${name} - ${number} - ${email}</span>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>`;

    document.getElementById("detailsList").appendChild(li);
}

function updateListItem(id, name, number, email) {
    const li = document.querySelector(`li[data-id='${id}']`);
    if (li) {
        li.querySelector("span").textContent = `${id} - ${name} - ${number} - ${email}`;
    }
}

async function handleListActions(event) {
    const btn = event.target;
    const li = btn.closest("li");
    const id = li?.dataset.id;

    if (!id) return;

    if (btn.classList.contains("delete")) {
        await deleteInfo(id);
        li.remove();
    } else if (btn.classList.contains("edit")) {
        editItem(li);
    }
}

async function deleteInfo(id) {
    try {
        await axios.delete(`http://localhost:3000/api/deleteInfo/${id}`);
    } catch (error) {
        console.error("Error deleting item:", error);
    }
}

function editItem(li) {
    const [id, name, number, email] = li.querySelector("span").textContent.split(" - ");
    const form = document.getElementById("myForm");

    form.name.value = name;
    form.number.value = number;
    form.email.value = email;

    editId = id; // Set edit mode
}
