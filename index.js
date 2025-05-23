const API_URL = "https://68299bd66075e87073a6f677.mockapi.io/tasks";
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");

todoInput.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    addTodo();
  }
});

document.addEventListener("DOMContentLoaded", getTodos);
addButton.addEventListener("click", addTodo);
// GET FUNCTION
async function getTodos() {
  try {
    const response = await axios.get(API_URL);

    const ul = document.querySelector(".todo-list");
    ul.innerHTML = "";
    response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Duyệt mảng dữ liệu
    response.data.forEach((item) => {
      const date = new Date(item.createdAt);
      const formatDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
      // Tạo li
      const li = document.createElement("li");
      //  Gắn class todo-item
      li.className = "todo-item";
      // Gắn thằng con và nội dung từ API cho thằng con
      li.innerHTML = `             <div class="todo-content">
                        <input type="checkbox">
                        <div>
                            <span>${item.content}</span>
                            <p>Created: ${formatDate}</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                      <button onclick="handleUpdate(${item.id}, '${item.content}')"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button onclick="handleDelete(${item.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>`;
      // gắn vào UL

      ul.appendChild(li);
    });
  } catch (error) {
    console.log("Thất bại ròi" + error);
  }
}

// POST FUNCTION
async function addTodo() {
  const inputData = todoInput.value.trim();

  const newTodo = {
    createdAt: new Date().toISOString(),
    content: inputData,
    isCompleted: false,
  };
  try {
    const response = await axios.post(API_URL, newTodo);
    console.log(response);
    todoInput.value = "";
    getTodos();
    showNotification("Added successfully!");
  } catch (error) {
    console.log("Thất bại ròi" + error);
  }
}

// PUT FUNCTION
function handleUpdate(id, content) {
  Swal.fire({
    title: "Edit Your Task",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    inputValue: content,
    showCancelButton: true,
    confirmButtonText: "Save",
    showLoaderOnConfirm: true,
    preConfirm: async (dataInput) => {
      await axios.put(`${API_URL}/${id}`, {
        content: dataInput,
      });
      getTodos();
      showNotification("Updated successfully!");
    },
  });
}

// DELETE FUNCTION
function handleDelete(id) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger mr-3",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/${id}`);
        getTodos();
        showNotification("Deleted successfully!");
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
}

function showNotification(messsage) {
  Swal.fire({
    title: messsage,
    width: 600,
    padding: "3em",
    color: "#716add",
    background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
    backdrop: `
    rgba(0,0,123,0.4)
    url("https://sweetalert2.github.io/images/nyan-cat.gif")
    left top
    no-repeat
  `,
  });
}