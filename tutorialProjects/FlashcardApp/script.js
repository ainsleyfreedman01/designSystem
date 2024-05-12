// Selecting DOM (Document Object Model) elements
const container = document.querySelector(".container"); // Container div element
const addQuestionModal = document.getElementById("add-card-modal"); // Add question modal
const saveBtn = document.getElementById("save-btn"); // Save button
const question = document.getElementById("question"); // Question input field
const answer = document.getElementById("answer"); // Answer input field
const errorMessage = document.getElementById("error"); // Error message div element
const addQuestion = document.getElementById("add-card"); // Add question button
const closeBtn = document.getElementById("close-btn"); // Close button for the modal

// Initializing variables
let editBool = false; // Boolean flag to track if editing mode is active
let originalId = null; // Id of the original flashcard being edited or null if not editing
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || []; // Array to store flashcards, retrieved from local storage or initialized as an empty array

// Show the add question modal and hide the container
addQuestion.addEventListener('click', () => {
    container.classList.add('hide'); // Hide the container
    question.value = ""; // Clear the question input field
    answer.value = ""; // Clear the answer input field
    addQuestionModal.classList.remove('hide'); // Show the add question modal
});

// Close the add question modal and show the container
closeBtn.addEventListener('click', () => {
    container.classList.remove('hide'); // Show the container
    addQuestionModal.classList.add('hide'); // Hide the add question modal
    if (editBool) {
        editBool = false;
        // Re-enable edit buttons when canceling edit without saving
        disableBtns(false); // Enable edit buttons
    }
});

// Save the flashcard
saveBtn.addEventListener('click', () => {
    let tempQuestion = question.value.trim(); // Get trimmed value of question input
    let tempAnswer = answer.value.trim(); // Get trimmed value of answer input
    if (!tempQuestion || !tempAnswer) {
        // Display error message if question or answer is empty
        errorMessage.classList.remove('hide');
    } else {
        // Hide error message if both fields are filled
        errorMessage.classList.add('hide');

        if (editBool) {
            // If editing an existing flashcard, remove the original flashcard from the array
            flashcards = flashcards.filter(flashcard => flashcard.id !== originalId);
            editBool = false; // Reset editBool after editing
        }
        let id = Date.now(); // Generate unique id based on current timestamp
        // Add the new flashcard to the array
        flashcards.push({ id, question: tempQuestion, answer: tempAnswer });
        // Save the flashcards array to local storage
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        container.classList.remove('hide'); // Show the container
        viewList(); // Display the updated flashcards list
        question.value = ""; // Clear the question input field
        answer.value = ""; // Clear the answer input field
        addQuestionModal.classList.add('hide'); // Hide the add question modal
    }
});

// Function to display the flashcards list
function viewList() {
    const cardsList = document.querySelector('.cards-list'); // Cards list container
    cardsList.innerHTML = ''; // Clear previous content
    flashcards = JSON.parse(localStorage.getItem('flashcards')) || []; // Get flashcards from local storage or initialize as empty array
    flashcards.forEach(flashcard => {
        const div = document.createElement("div"); // Create card div element
        div.classList.add('card'); // Add card class to the div
        div.innerHTML = `
        <p class="que-div">${flashcard.question}</p>
        <p class="ans-div hide">${flashcard.answer}</p>
        <button class="show-hide-btn">Show/Hide</button>
        <div class="btns-con">
            <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        div.setAttribute('data-id', flashcard.id); // Set data-id attribute to identify the flashcard
        const displayAns = div.querySelector('.ans-div'); // Get answer element
        const showHideBtn = div.querySelector('.show-hide-btn'); // Get show/hide button
        const editBtn = div.querySelector('.edit'); // Get edit button
        const deleteBtn = div.querySelector('.delete'); // Get delete button

        showHideBtn.addEventListener('click', () => {
            // Toggle the visibility of the answer
            displayAns.classList.toggle('hide');
        });

        editBtn.addEventListener('click', () => {
            // Enable editing mode and show the add question modal
            editBool = true;
            modifyElement(editBtn, true);
            addQuestionModal.classList.remove('hide');
        });

        deleteBtn.addEventListener('click', () => {
            // Delete the flashcard
            modifyElement(deleteBtn);
        });

        cardsList.appendChild(div); // Append the card to the cards list container
    });
};

// Function to modify a flashcard
const modifyElement = (element, edit = false) => {
    const parentDiv = element.closest('.card'); // Use closest to find the parent card
    const id = Number(parentDiv.getAttribute('data-id')); // Get the id of the flashcard
    const parentQuestion = parentDiv.querySelector('.que-div').innerText; // Get the question text
    if (edit) {
        const parentAnswer = parentDiv.querySelector('.ans-div').innerText; // Get the answer text
        answer.value = parentAnswer; // Set the answer input field value
        question.value = parentQuestion; // Set the question input field value
        originalId = id; // Set the originalId to the id of the flashcard being edited
        disableBtns(true); // Disable edit buttons
        addQuestionModal.classList.remove('hide'); // Show modal for editing
    } else {
        // Remove the flashcard from the array and update local storage
        flashcards = flashcards.filter(flashcard => flashcard.id !== id);
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        viewList(); // Refresh the flashcards list after deletion
        parentDiv.remove(); // Remove the card from the DOM after deletion
    }
};

// Function to disable edit buttons
const disableBtns = (value) => {
    const editButtons = document.getElementsByClassName('edit'); // Get all edit buttons
    Array.from(editButtons).forEach((element) => {
        element.disabled = value; // Set disabled property based on the value
    });
};

// Event listener to display the flashcards list when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    viewList(); // Display the flashcards list
    disableBtns(false); // Enable edit buttons when the DOM is loaded
});
