//selecting DOM (Document Object Model) elements
const container = document.querySelector(".container");
const addQuestionModal = document.getElementById("add-card-modal");
const saveBtn = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-card");
const closeBtn = document.getElementById("close-btn");

//intializing variables
let editBool = false;
let originalId = null;
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

//show the add question modal and hide the container
addQuestion.addEventListener('click', () => {
    container.classList.add('hide');
    question.value = "";
    answer.value = "";
    addQuestionModal.classList.remove('hide');
});

//close the add question modal and show the container
closeBtn.addEventListener('click', () => {
    container.classList.remove('hide');
    addQuestionModal.classList.add('hide');
    if (editBool) {
        editBool = false;
        // Re-enable edit buttons when canceling edit without saving
        disableBtns(false);
    }
});

// save the flashcard
saveBtn.addEventListener('click', () => {
    let tempQuestion = question.value.trim();
    let tempAnswer = answer.value.trim();
    if (!tempQuestion || !tempAnswer) {
        // display error message if question or answer is empty
        errorMessage.classList.remove('hide');
    } else {
        // hide error message if both fields are filled
        errorMessage.classList.add('hide');

        if (editBool) {
            // if editing an existing flashcard, remove the original flashcard from the array
            flashcards = flashcards.filter(flashcard => flashcard.id !== originalId);
            editBool = false; // reset editBool after editing
        }
        let id = Date.now();
        // add the new flashcard to the array
        flashcards.push({ id, question: tempQuestion, answer: tempAnswer });
        // save the flashcards array to local storage
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        container.classList.remove('hide');
        viewList();
        question.value = "";
        answer.value = "";
        addQuestionModal.classList.add('hide');
    }
});

//function to display the flashcards list
function viewList() {
    const cardsList = document.querySelector('.cards-list');
    cardsList.innerHTML = '';
    flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    flashcards.forEach(flashcard => {
        const div = document.createElement("div");
        div.classList.add('card');
        div.innerHTML = `
        <p class="que-div">${flashcard.question}</p>
        <p class="ans-div hide">${flashcard.answer}</p>
        <button class="show-hide-btn">Show/Hide</button>
        <div class="btns-con">
            <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        div.setAttribute('data-id', flashcard.id);
        const displayAns = div.querySelector('.ans-div');
        const showHideBtn = div.querySelector('.show-hide-btn');
        const editBtn = div.querySelector('.edit');
        const deleteBtn = div.querySelector('.delete');

        showHideBtn.addEventListener('click', () => {
            //toggle the visibility of the answer
            displayAns.classList.toggle('hide');
        });

        editBtn.addEventListener('click', () => {
            //enable editing mode and show the add question card
            editBool = true;
            modifyElement(editBtn, true);
            addQuestionModal.classList.remove('hide');
        });

        deleteBtn.addEventListener('click', () => {
            //delete the flashcard
            modifyElement(deleteBtn);
        });

        cardsList.appendChild(div);
    });
};

// function to modify a flashcard
const modifyElement = (element, edit = false) => {
    const parentDiv = element.closest('.card'); // Use closest to find the parent card
    const id = Number(parentDiv.getAttribute('data-id'));
    const parentQuestion = parentDiv.querySelector('.que-div').innerText;
    if (edit) {
        const parentAnswer = parentDiv.querySelector('.ans-div').innerText;
        answer.value = parentAnswer;
        question.value = parentQuestion;
        originalId = id;
        disableBtns(true);
        addQuestionModal.classList.remove('hide'); // Show modal for editing
    } else {
        // remove the flashcard from the array and update local storage
        flashcards = flashcards.filter(flashcard => flashcard.id !== id);
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        viewList(); // Refresh the flashcards list after deletion
        parentDiv.remove(); // Remove the card from the DOM after deletion
    }
};


//function to disable edit buttons
const disableBtns = (value) => {
    const editButtons = document.getElementsByClassName('edit');
    Array.from(editButtons).forEach((element)=> {
        element.disabled = value;
    });
};

//event listener to display the flashcards list when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    viewList();
    disableBtns(false); // Enable edit buttons when the DOM is loaded
});