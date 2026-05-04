const BASE_URL = "http://localhost:1337";

const renderPage = async () => {
    let response = await axios.get(`${BASE_URL}/api/books?populate=*`);
    let books = response.data.data;

    books.forEach(book => {
        document.querySelector("#product-list").innerHTML += `
        <div class="product-container">
            <h2>${book.Title}</h2>
            <p>${book.Author}</p>
            <p>Pages: ${book.Pages}</p>
            <p>Release Date: ${book.Release}</p>
            <img src="${BASE_URL}${book.Cover?.url}" height="100"/>
        </div>`
    })
}
const buttonRendering = () => {
    const registerBtn = document.querySelector("#registerBtn");
    const loginBtn = document.querySelector("#loginBtn");
    const registerFrame = document.querySelector("#registerFrame");
    const loginFrame = document.querySelector("#loginFrame");
    const closeRegisterBtn = document.querySelector("#closeRegisterBtn");
    const closeLoginBtn = document.querySelector("#closeLoginBtn");

    registerBtn.addEventListener("click", () => {
        if (loginFrame.style.display === "flex"){
            loginFrame.style.display = "none";
            registerFrame.style.display = "flex";
        }
        else {
            registerFrame.style.display = "flex";
        }
    });
    loginBtn.addEventListener("click", () => {
        if (registerFrame.style.display === "flex"){
            registerFrame.style.display = "none";
            loginFrame.style.display = "flex";
        }
        else {
            loginFrame.style.display = "flex";
        }
    });
    closeRegisterBtn.addEventListener("click", () => {
        registerFrame.style.display = "none";

    });
    closeLoginBtn.addEventListener("click", () => {
        loginFrame.style.display = "none";
    });
}



buttonRendering();
renderPage();