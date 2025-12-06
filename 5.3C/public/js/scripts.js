document.addEventListener('DOMContentLoaded', () => {

    // Find all necessary DOM elements
    const loadButton = document.getElementById('books-load');
    const booksRow = document.getElementById('books-row');
    const booksList = document.getElementById('books-list');
    const modal = document.getElementById('book-modal');
    const closeModalButton = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalAuthor = document.getElementById('modal-author');
    const modalYear = document.getElementById('modal-year');
    const modalGenre = document.getElementById('modal-genre');
    const modalSummary = document.getElementById('modal-summary');
    const modalPrice = document.getElementById('modal-price');

    // Show the modal
    const showModal = () => {
        modal.classList.add('open');
    };

    // Hide the modal
    const hideModal = () => {
        modal.classList.remove('open');
    };

    // Fetch book details by ID and display them in the modal
    const fetchBookDetails = async (bookId) => {
        if (!bookId) return;

        try {
            const response = await fetch(`/api/books/${bookId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }
            const payload = await response.json();
            const book = payload.data;
            if (!book) {
                throw new Error('Book details unavailable');
            }
            modalTitle.textContent = book.title;
            modalAuthor.textContent = book.author;
            modalYear.textContent = book.year;
            modalGenre.textContent = book.genre;
            modalSummary.textContent = book.summary;
            modalPrice.textContent = `${book.price} AUD`;
            showModal();
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    // Click handler for individual book links
    const handleBookClick = (event) => {
        event.preventDefault();
        const link = event.currentTarget;          // the <a> itself
        const bookId = link.dataset.bookId;
        fetchBookDetails(bookId);
    };

    // Render the list of books as clickable links
    const renderBooks = (books) => {
        booksList.innerHTML = '';

        books.forEach((book) => {
            // Create a new list item element
            const listItem = document.createElement('li');
            listItem.className = 'book-item';

            // Create the a new link element
            const link = document.createElement('a');
            link.className = 'book-link';
            link.href = '#';
            link.dataset.bookId = book.id;
            link.textContent = `${book.title} | ${book.price} AUD`;

            // Attach the click handler
            link.addEventListener('click', handleBookClick);

            // Attach the link and the list item to the books list
            listItem.appendChild(link);
            booksList.appendChild(listItem);
        });
    };

    // Fetch books from the API and render them
    const fetchBooks = async () => {
        try {
            const response = await fetch('/api/books');
            if (!response.ok) {
                throw new Error('Failed to load books');
            }
            const payload = await response.json();
            const books = payload.data ?? [];
            if (books.length === 0) {
                booksRow.classList.remove('visible');
            } else {
                renderBooks(books);
                booksRow.classList.add('visible');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    // Attach global event listeners
    closeModalButton.addEventListener('click', hideModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            hideModal();
        }
    });

    loadButton.addEventListener('click', fetchBooks);

});
