var hamburger = document.querySelector(".hamburger");
var wrapper  = document.querySelector(".wrapper");
var backdrop = document.querySelector(".backdrop");

const searchBookTitle = document.getElementById("searchBookTitle");
const searchSubmit = document.getElementById("searchSubmit");
const completeBookshelfList = document.getElementById("completeBookshelfList");
const unCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
const dialogNotFound = document.querySelector(".dialog.not-found");
const dialogFound = document.querySelector(".dialog.found");
const searchInput = document.getElementById("searchBookTitle");
const closeDialogBtns = document.querySelectorAll(".close-dialog");

dialogNotFound.style.display = "none";
dialogFound.style.display = "none";

const book = [];
const RENDER_EVENT = 'render-book'

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

hamburger.addEventListener("click", function(){
  wrapper.classList.add("active");
})

backdrop.addEventListener("click", function(){
  wrapper.classList.remove("active");
})


document.addEventListener('DOMContentLoaded', function(){
  const submitform = document.getElementById('inputBook');
  submitform.addEventListener('submit', function(event){
    event.preventDefault();
    addBook(event);
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook(event){
  const bookTitle = document.getElementById("inputBookTitle").value
  const bookAuthor = document.getElementById("inputBookAuthor").value
  const bookYear = document.getElementById("inputBookYear").value
  const bookCategory = document.getElementById("inputCategory").value
  const bookIsCompleted = document.getElementById("inputBookIsComplete").checked

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookCategory,
    bookIsCompleted
  )

  book.push(bookObject)
  document.dispatchEvent(new Event(RENDER_EVENT));
  snackbar(bookTitle)
  saveData(event);
}

function generateId() {
   return +new Date();
}

function generateBookObject(id, title, author, year, category, isComplete) {
  year = Number(year)
  return{
    id,
    title,
    author,
    year,
    category,
    isComplete
  }
}

document.addEventListener(RENDER_EVENT, function(){
  const unCompleteBookShelfList = document.getElementById('incompleteBookshelfList');
  unCompleteBookShelfList.innerHTML = '';

  const completeBookShelfList = document.getElementById('completeBookshelfList');
  completeBookShelfList.innerHTML = '';

  for (const bookItem of book){
      const bookElement = makeBooks(bookItem);
      if(!bookItem.isComplete){
        unCompleteBookShelfList.append(bookElement)
      } else
      completeBookShelfList.append(bookElement);
  }
});

function makeBooks(bookObject) {
  const article = document.createElement('article')
  article.classList.add('book-item')

  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Author: ' + bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Year: ' + bookObject.year;

  const textCategory = document.createElement('p');
  textCategory.innerText = 'Category: ' + bookObject.category;

  
  const containerAction = document.createElement('div');
  containerAction.classList.add('action');
  article.append(textTitle,textAuthor,textYear,textCategory, containerAction)
  if (bookObject.isComplete) {
    const buttonGreen = document.createElement('button');
    buttonGreen.classList.add('green');
    buttonGreen.innerText = 'Add to reading List';
    buttonGreen.setAttribute('id', `book-${bookObject.id}`);
  
    const buttonRed = document.createElement('button');
    buttonRed.classList.add('red');
    buttonRed.innerText = "Delete Book";
    buttonRed.setAttribute('id', `book-${bookObject.id}`);

    buttonGreen.addEventListener('click', function(event) {
       addToReadingList(bookObject.id,event)
    });

    buttonRed.addEventListener('click', function(event) {
      var modal_delete = document.getElementById('id01');
      modal_delete.style.display = 'block';
      window.onclick = function(event) {
        if (event.target == modal_delete) {
          modal_delete.style.display = "none";
        }
      }
      var buttonDelete = document.getElementById('deletebtn');
      buttonDelete.addEventListener('click',function(event){
        deleteBook(bookObject.id,event)
      });

      var buttonCancel = document.getElementById('cancelbtn');
      buttonCancel.addEventListener('click', function(){
        modal_delete.style.display = "none";
      });

      var buttonX = document.getElementById('xclose');
      buttonX.addEventListener('click', function(){
        modal_delete.style.display = "none";
      });
           
    });
    containerAction.append(buttonGreen, buttonRed);
  } else{
    const buttonGreen = document.createElement('button');
    buttonGreen.classList.add('green');
    buttonGreen.innerText = 'Done Reading';
    buttonGreen.setAttribute('id', `book-${bookObject.id}`);
  
    const buttonRed = document.createElement('button');
    buttonRed.classList.add('red');
    buttonRed.innerText = "Delete Book";
    buttonRed.setAttribute('id', `book-${bookObject.id}`);

    buttonGreen.addEventListener('click', function(event) {
      
       addToCompleteReading(bookObject.id,event)
    });

    buttonRed.addEventListener('click', function(event) {
      var modal_delete = document.getElementById('id01');
      modal_delete.style.display = 'block';
      window.onclick = function(event) {
        if (event.target == modal_delete) {
          modal_delete.style.display = "none";
        }
      }
      var buttonDelete = document.getElementById('deletebtn');
      buttonDelete.addEventListener('click',function(event){
        deleteBook(bookObject.id,event)
      });

      var buttonCancel = document.getElementById('cancelbtn');
      buttonCancel.addEventListener('click', function(){
        modal_delete.style.display = "none";
      });

      var buttonX = document.getElementById('xclose');
      buttonX.addEventListener('click', function(){
        modal_delete.style.display = "none";
      });
           
    });

    containerAction.append(buttonGreen, buttonRed);
  }
  return article;
}

function addToCompleteReading(bookId,event){
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
 
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(event)
}

function deleteBook(bookId,event){
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  book.splice(bookTarget, 1);
  var modal_delete = document.getElementById('id01');
  modal_delete.style.display = 'none';
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(event)
}

function addToReadingList(bookId,event){
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(event)
}

function findBook(bookId) {
  for (const bookItem of book) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId){
  for (const index in book) {
     if(book[index].id === bookId){
      return index;
     }
  }
  return -1
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
      alert('Your Browser not support local storage');
      return false;
    }
    return true;
}

function snackbar(title) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = `The Book entitled <b>&nbsp;${title}&nbsp;</b> was successfully added`;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function saveData(event) {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const item of data) {
      book.push(item);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    search();
  }
});

searchSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  search();
});

function search() {
  const title = searchBookTitle.value.toLowerCase();
  if (title.trim() === "") {
    dialogNotFound.style.display = "block";
    dialogFound.style.display = "none";
  } else {
    const filteredBooks = book.filter((book) => book.title.toLowerCase().includes(title));
    console.log(filteredBooks)
    if (filteredBooks.length === 0) {
      dialogNotFound.style.display = "block";
      dialogFound.style.display = "none";
    } else {
      dialogNotFound.style.display = "none";
      dialogFound.style.display = "block";
    }
    completeBookshelfList.innerHTML = "";
    unCompleteBookshelfList.innerHTML = "";

    filteredBooks.forEach((book) => {
      const bookElement = makeBooks(book);
      if (!book.isComplete) {
        unCompleteBookshelfList.append(bookElement);
      } else {
        completeBookshelfList.append(bookElement);
      }
    });

    searchBookTitle.value = "";
  }
}

closeDialogBtns.forEach(btn => {
  btn.addEventListener("click", (event) => {
    const dialog = btn.parentElement;
    dialog.style.display = "none";
    searchInput.value = "";
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
});
