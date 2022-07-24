/**
 * [
 *    {
 *      id: string | number,
 *      title: string,
 *      author: string,
 *      year: number,
 *      isComplete: boolean,
 *      id, title, author, year, isComplete
 *    }
 * ]
 */

const books = []
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'BOOK_APPS'

function generateId() {
    return +new Date()
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }
    return -1
}

// local storage
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage')
        return false
    }
    return true
}

function saveToStorage() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serializedData)

    if (data !== null) {
        for (const book of data) {
            books.push(book)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

// end fo local stroage

function makeBook(bookObject) {
    const {
        id,
        title,
        author,
        year,
        isComplete
    } = bookObject

    const titleBook = document.createElement('h3')
    titleBook.innerText = title

    const authorBook = document.createElement('p')
    authorBook.innerText = author

    const yearBook = document.createElement('p')
    yearBook.innerText = year

    const textContainer = document.createElement('div')
    textContainer.append(titleBook, authorBook, yearBook)

    const container = document.createElement('div')
    container.classList.add('card')
    container.classList.add('listbook')
    container.classList.add('mt-3')
    container.append(textContainer)
    container.setAttribute('id', `book-${id}`)

    if (isComplete) {

        const undoButton = document.createElement('button')
        undoButton.classList.add('btn', 'btn-warning','mb-1')
        undoButton.innerText = 'Belum Selesai Dibaca'
        undoButton.addEventListener('click', function () {
            undoFromComplete(id)
        })

        const trashButton = document.createElement('button')
        trashButton.classList.add('btn', 'btn-danger','mb-1')
        trashButton.innerText = 'Hapus'
        trashButton.addEventListener('click', function () {
            removeFromComplete(id)
        })

        container.append(undoButton, trashButton)
    } else {
        const addButton = document.createElement('button')
        addButton.classList.add('btn', 'btn-success','mb-1')
        addButton.innerText = 'Selesai Dibaca'
        addButton.addEventListener('click', function () {
            addToComplete(id)
        })

        const trashButton = document.createElement('button')
        trashButton.classList.add('btn', 'btn-danger','mb-1')
        trashButton.innerText = 'Hapus'
        trashButton.addEventListener('click', function () {
            removeFromComplete(id)
        })
        container.append(addButton, trashButton)
    }

    return container
}

function addBook() {
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const year = document.getElementById('year').value

    const generatedID= generateId()
    const bookObject = generateBookObject(generatedID, title, author, year, false)
    books.push(bookObject)

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveToStorage()
}

function addToComplete(bookId) {
    const bookTarget= findBook(bookId)

    if(bookTarget==null) return

    bookTarget.isComplete = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveToStorage()
}

function removeFromComplete(bookId){
    const bookTarget= findBookIndex(bookId)

    if(bookTarget=== -1) return

    books.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveToStorage()
}

function undoFromComplete(bookId){

    const bookTarget= findBook(bookId)
    if(bookTarget== null) return

    bookTarget.isComplete = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveToStorage()
}

document.addEventListener('DOMContentLoaded', function(){

    const submitForm=document.getElementById('form')

    submitForm.addEventListener('submit', function(event){
        event.preventDefault()
        addBook()
    })

    if(isStorageExist()){
        loadDataFromStorage()
    }
})

document.addEventListener(RENDER_EVENT,function () {
    const uncompleteBOOKList=document.getElementById('books')
    const listComplete=document.getElementById('complete-books')

    uncompleteBOOKList.innerHTML=''
    listComplete.innerHTML=''

    for(const bookItem of books){
        const bookElement=makeBook(bookItem)
        if(bookItem.isComplete){
            listComplete.append(bookElement)
        }else{
            uncompleteBOOKList.append(bookElement)
        }
    }
})