const BASE_URL = "http://localhost:1337";

const renderPage = async () => {
    let response = await axios.get(`${BASE_URL}/api/books?populate=*`);
    let books = response.data.data;

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-container";
        card.innerHTML = `
            <img src="${BASE_URL}${book.Cover?.url}"/>
            <h2>${book.Title}</h2>
            <p>${book.Author}</p>
            <p>${book.Pages} pages</p>
            <p>Released ${book.Release}</p>
            <p><span style="color: #F59E0B;">★</span> ${book.Rating}</p>`;
        card.addEventListener("click", () => {
            window.location.href = `book.html?id=${book.documentId}`;
        });
        document.querySelector("#book-list").appendChild(card);
    })
}
const buttonRendering = () => {
    const registerBtn = document.querySelector("#registerBtn");
    const loginBtn = document.querySelector("#loginBtn");
    const registerFrame = document.querySelector("#registerFrame");
    const loginFrame = document.querySelector("#loginFrame");
    const closeRegisterBtn = document.querySelector("#closeRegisterBtn");
    const closeLoginBtn = document.querySelector("#closeLoginBtn");

    const openRegisterFrame = () => {
        loginFrame.style.display = "none";
        registerFrame.style.display = "flex";
    }

    const openLoginFrame = () => {
        registerFrame.style.display = "none";
        loginFrame.style.display = "flex";
    }

    const closeRegisterFrame = () => {
        registerFrame.style.display = "none";
    }

    const closeLoginFrame = () => {
        loginFrame.style.display = "none";
    }

    registerBtn.addEventListener("click", openRegisterFrame);
    loginBtn.addEventListener("click", openLoginFrame);
    closeRegisterBtn.addEventListener("click", closeRegisterFrame);
    closeLoginBtn.addEventListener("click", closeLoginFrame);
}
buttonRendering();

renderPage();