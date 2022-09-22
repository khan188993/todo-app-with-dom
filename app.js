const addTodoFormElem = document.getElementById('add-todo-form');
const allTodoWrapper = document.getElementById('all-todo-wrapper');
const completedAllBtnElem = document.getElementById('completed-all-btn');
const clearAllBtnElem = document.getElementById('clear-all-btn');
const taskLeftElem = document.getElementById('task-left');
const allFilterBtnElem = document.getElementById('all-filter-btn');
const completedFilterBtnElem = document.getElementById('complete-filter-btn');
const incompleteFilterBtnElem = document.getElementById('incomplete-filter-btn');

let allTodos = [];

//fetch all todos
function fetchAllTodos() {
   fetch('http://localhost:9000/newTodos')
      .then((res) => res.json())
      .then((data) => {
         allTodos = data;
         displayTodos(allTodos);
      });
}

fetchAllTodos();

function displayTodos(allTodos) {
   let allTodoHtml = '';
   //iterate all todo and add into html
   allTodos.forEach((todo, index) => {
      const { id, text, completed, color } = todo || {};
      allTodoHtml = `${allTodoHtml} <div
        class="flex justify-start items-center p-2 hover:bg-gray-100 hover:transition-all space-x-4 border-b border-gray-400/20 last:border-0"
    >
        <div
            class="rounded-full bg-white border-2 border-gray-400 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 border-green-500 focus-within:border-green-500"
        >
            <input
                type="checkbox"
                class="opacity-0 absolute rounded-full"
            />
            <svg
                class="hidden fill-current w-3 h-3 text-green-500 pointer-events-none"
                viewBox="0 0 20 20"
            >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
        </div>

        <div class="select-none flex-1 ${completed && 'line-through'} ">
            Learn React from Learn with Sumit YouTube Channel
        </div>

        <div
            class="flex-shrink-0 h-4 w-4 rounded-full border-2 ml-auto cursor-pointer border-green-500 hover:bg-green-500 bg-green-500"
        ></div>

        <div
            class="flex-shrink-0 h-4 w-4 rounded-full border-2 ml-auto cursor-pointer border-yellow-500 hover:bg-yellow-500"
        ></div>

        <div
            class="flex-shrink-0 h-4 w-4 rounded-full border-2 ml-auto cursor-pointer border-red-500 hover:bg-red-500"
        ></div>

        <img
            onclick="deleteTodo(${id})"
            src="./images/cancel.png"
            class="flex-shrink-0 w-4 h-4 ml-2 cursor-pointer"
            alt="Cancel"
        />
    </div>`;
   });
   allTodoWrapper.innerHTML = allTodoHtml;
}

//delete todo and refetch
function deleteTodo(id) {
   //delete todo api call
   fetch(`http://localhost:9000/newTodos/${id}`, {
      method: 'DELETE',
   }).then(() => {
      //after delete refetch todo data again
      fetchAllTodos();
   });
}

/**
 * get all todo and set into allTodo array after then loop the allTodo array and add todo child into wrapper,
 * set onClick into completed, edit,deleted btn,
 *
 */
