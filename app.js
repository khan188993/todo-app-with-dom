//all selectors
const addTodoFormElem = document.getElementById('add-todo-form');
const allTodoWrapper = document.getElementById('all-todo-wrapper');
const completedAllBtnElem = document.getElementById('completed-all-btn');
const clearAllCompleteBtnElem = document.getElementById('clear-all-btn');
const taskLeftElem = document.getElementById('task-left');
const allFilterBtnElem = document.getElementById('all-filter-btn');
const completedFilterBtnElem = document.getElementById('complete-filter-btn');
const incompleteFilterBtnElem = document.getElementById('incomplete-filter-btn');
const globalFilterGreenBtnElem = document.getElementById('global-filter-green');
const globalFilterYellowBtnElem = document.getElementById('global-filter-yellow');
const globalFilterRedBtnElem = document.getElementById('global-filter-red');

//initial variables
let allTodos = [];
let taskLeft = '';
let filterStatusType = 'all';
let filterColorType = [];
let editTodoData = {};

//get task left number
function getLeftTask(taskLength) {
   if (taskLength > 1) {
      return `${taskLength} tasks left`;
   } else if (taskLength === 1) {
      return `${taskLength} task left`;
   } else {
      return 'No Task Left';
   }
}

//filter status style updating
function filterStatusTypeCheck(filterStatusType) {
   //filter type style add
   if (filterStatusType === 'complete') {
      completedFilterBtnElem.setAttribute('class', 'cursor-pointer font-bold');
      allFilterBtnElem.setAttribute('class', 'cursor-pointer');
      incompleteFilterBtnElem.setAttribute('class', 'cursor-pointer');
   } else if (filterStatusType === 'incomplete') {
      incompleteFilterBtnElem.setAttribute('class', 'cursor-pointer font-bold');
      completedFilterBtnElem.setAttribute('class', 'cursor-pointer');
      allFilterBtnElem.setAttribute('class', 'cursor-pointer');
   } else if (filterStatusType === 'all') {
      allFilterBtnElem.setAttribute('class', 'cursor-pointer font-bold');
      completedFilterBtnElem.setAttribute('class', 'cursor-pointer');
      incompleteFilterBtnElem.setAttribute('class', 'cursor-pointer');
   }
}

//filter color style updating
function filterColorTypeCheck(isExistFilterColors, colorName) {
   if (colorName === 'red') {
      if (!isExistFilterColors) {
         globalFilterRedBtnElem.setAttribute('class', 'h-3 w-3 border-2 border-red-500 md:hover:bg-red-500 rounded-full cursor-pointer bg-red-500');
      } else {
         globalFilterRedBtnElem.setAttribute('class', 'h-3 w-3 border-2 border-red-500 md:hover:bg-red-500 rounded-full cursor-pointer');
      }
   }
   if (colorName === 'green') {
      if (!isExistFilterColors) {
         globalFilterGreenBtnElem.setAttribute('class', 'h-3 w-3 border-2 border-green-500 md:hover:bg-green-500 rounded-full cursor-pointer bg-green-500');
      } else {
         globalFilterGreenBtnElem.setAttribute('class', 'h-3 w-3 border-2 border-green-500 md:hover:bg-green-500 rounded-full cursor-pointer');
      }
   }
   if (colorName === 'yellow') {
      if (!isExistFilterColors) {
         globalFilterYellowBtnElem.setAttribute('class', 'h-3 w-3 border-2 border-yellow-500 md:hover:bg-yellow-500 rounded-full cursor-pointer bg-yellow-500');
      } else {
         globalFilterYellowBtnElem.setAttribute('class', 'h-3 w-3 border-2 border-yellow-500 md:hover:bg-yellow-500 rounded-full cursor-pointer');
      }
   }
}

//fetch all todo
function fetchAllTodos() {
   const url = 'http://localhost:9000/newTodos';
   fetch(url)
      .then((res) => res.json())
      .then((data) => {
         allTodos = data;
         //getting incomplete todo
         taskLeft = allTodos.filter((todo) => todo.completed === false).length;
         //after filter incomplete task pass it and getting left task
         taskLeftElem.innerHTML = getLeftTask(taskLeft);
         displayTodos(allTodos);
      });
}
//fetch all todo initial call
fetchAllTodos();

//filtering todos with status and color types
function filterTodos(filterStatusType, filterColor) {
   console.log(filterStatusType, filterColor, allTodos);
   const filteredAllTodos = allTodos
      .filter((todo) => {
         //type filter
         if (filterStatusType === 'all') {
            return true;
         }
         if (filterStatusType === 'complete') {
            return todo.completed;
         }
         if (filterStatusType === 'incomplete') {
            return !todo.completed;
         }
      })
      .filter((todo) => {
         //color filter
         if (filterColor.length === 0) {
            return true;
         }
         if (filterColor.includes(todo.color)) {
            return true;
         }
      });
   //add filtering todos
   displayTodos(filteredAllTodos);
}

//delete todo with id and refetch
function deleteTodo(id) {
   //delete todo api call
   fetch(`http://localhost:9000/newTodos/${id}`, {
      method: 'DELETE',
   }).then(() => {
      //after delete refetch todo data again
      fetchAllTodos();
   });
}

//complete single todo and refetch
function completeTodo(id) {
   //find editing value and edit
   const editingTodo = allTodos.find((todo) => todo.id === id);

   //complete single todo api call for edit
   fetch(`http://localhost:9000/newTodos/${editingTodo?.id}`, {
      method: 'PUT',
      body: JSON.stringify({
         ...editingTodo,
         completed: !editingTodo?.completed, //if true then false otherwise true,
      }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
      },
   }).then(() => {
      //after edit done refetch todo data again
      fetchAllTodos();
   });
}

//edit todo with color into single todo
function colorEditTodo(id, colorName) {
   //find editing value and edit
   const editingTodo = allTodos.find((todo) => todo.id === id);
   const setColor = editingTodo?.color === colorName ? '' : colorName; //set color if not find any color

   //complete single todo api call for edit
   fetch(`http://localhost:9000/newTodos/${editingTodo?.id}`, {
      method: 'PUT',
      body: JSON.stringify({
         ...editingTodo,
         color: setColor, //set color if not find any color
      }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
      },
   }).then(() => {
      //after edit done refetch todo data again
      fetchAllTodos();
   });
}

//filter by status handler
function filterByStatusHandler(status) {
   filterStatusType = status;
   filterStatusTypeCheck(filterStatusType);
   filterTodos(filterStatusType, filterColorType);
}

//filter by colors handler
function filterByColorHandler(colorName) {
   const isExistFilterColors = filterColorType.includes(colorName);

   //if color not exist then add otherwise remove
   if (isExistFilterColors) {
      filterColorType = filterColorType.filter((color) => color !== colorName);
   } else {
      filterColorType = [...filterColorType, colorName];
   }
   filterColorTypeCheck(isExistFilterColors, colorName);
   filterTodos(filterStatusType, filterColorType);
}

//clear all complete todo in one click
function clearAllCompleted() {
   //find all completed todo and after find delete by foreach
   const completedTodos = allTodos.filter((todo) => todo.completed);
   completedTodos.forEach((todo) => {
      deleteTodo(todo?.id);
   });
}
clearAllCompleteBtnElem.addEventListener('click', clearAllCompleted);

//complete all incomplete todo in one click
completedAllBtnElem.addEventListener('click', function () {
   //find all completed todo and after find complete all incomplete by foreach
   const incompleteTodos = allTodos.filter((todo) => !todo.completed);
   incompleteTodos.forEach((todo) => {
      completeTodo(todo?.id);
   });
});

//add edit todo handler
function addEditTodo(e) {
   e.preventDefault();
   const newTodoText = e.target.newTodo.value;
   if (newTodoText) {
      if (editTodoData?.text) {
         console.log('edit todo');
         //complete single todo api call for edit
         fetch(`http://localhost:9000/newTodos/${editTodoData?.id}`, {
            method: 'PUT',
            body: JSON.stringify({
               ...editTodoData,
               text: newTodoText,
            }),
            headers: {
               'Content-type': 'application/json; charset=UTF-8',
            },
         }).then(() => {
            //after edit done refetch todo data again
            e.target.newTodo.value = ''; //clear input
            editTodoData = {}; //clearing edit data after edit done
            addTodoFormElem.imageBtn.setAttribute('class', 'appearance-none w-8 h-8 bg-[url("./images/plus.png")] bg-no-repeat bg-contain');
            fetchAllTodos();
         });
      } else {
         console.log('add todo');
         //complete single todo api call for edit
         fetch(`http://localhost:9000/newTodos`, {
            method: 'POST',
            body: JSON.stringify({
               text: newTodoText,
               completed: false,
               color: '',
            }),
            headers: {
               'Content-type': 'application/json; charset=UTF-8',
            },
         }).then(() => {
            //after edit done refetch todo data again
            e.target.newTodo.value = ''; //clear input
            fetchAllTodos();
         });
      }
   } else {
      alert('please fill the todo input properly');
   }
}

//?add new todo into api and refetch
addTodoFormElem.addEventListener('submit', addEditTodo);

//edit todo with id
function editTodo(id) {
   editTodoData = allTodos.find((todo) => todo.id === id);
   addTodoFormElem.newTodo.value = editTodoData?.text;
   addTodoFormElem.imageBtn.setAttribute('class', 'appearance-none w-8 h-8 bg-[url("./images/notes.png")] bg-no-repeat bg-contain');
}

//?display all todo
function displayTodos(allTodos) {
   let allTodoHtml = '';
   //iterate all todo and add into html
   allTodos.forEach((todo) => {
      allTodoHtml = `${allTodoHtml} <div
        class="flex justify-start items-center p-2 hover:bg-gray-100 hover:transition-all space-x-4 border-b border-gray-400/20 last:border-0"
    >
        <div
            class="rounded-full bg-white border-2 border-gray-400 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 border-green-500 focus-within:border-green-500"
        >
            <input
            onclick="completeTodo(${todo?.id})"
            type="checkbox"
            class="opacity-0 absolute rounded-full"
        />
            <svg
                class="${!todo?.completed && 'hidden'} fill-current w-3 h-3 text-green-500 pointer-events-none"
                viewBox="0 0 20 20"
            >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
        </div>

        <div class="select-none flex-1 ${todo?.completed && 'line-through'} ">
            ${todo?.text}
        </div>
        

        <div onclick="colorEditTodo(${todo?.id},'green')"
            class=" ${todo?.color === 'green' ? 'bg-green-500' : ''} flex-shrink-0 h-4 w-4 rounded-full border-2 ml-auto cursor-pointer border-green-500 hover:bg-green-500"
        ></div>

        <div onclick="colorEditTodo(${todo?.id},'yellow')"
            class=" ${todo?.color === 'yellow' ? 'bg-yellow-500' : ''} flex-shrink-0 h-4 w-4 rounded-full border-2 ml-auto cursor-pointer border-yellow-500 hover:bg-yellow-500"
        ></div>

        <div onclick="colorEditTodo(${todo?.id},'red')"
            class="${todo?.color === 'red' ? 'bg-red-500' : ''} flex-shrink-0 h-4 w-4 rounded-full border-2 ml-auto cursor-pointer border-red-500 hover:bg-red-500"
        ></div>

        <img
            onclick="deleteTodo(${todo?.id})"
            src="./images/cancel.png"
            class="flex-shrink-0 w-4 h-4 ml-2 cursor-pointer"
            alt="Cancel"
        />
        <img
            onclick="editTodo(${todo?.id})"
            src="./images/notes.png"
            class="flex-shrink-0 w-4 h-4 ml-2 cursor-pointer"
            alt="note"
        />
    </div>`;
   });
   allTodoWrapper.innerHTML = allTodoHtml;
}
