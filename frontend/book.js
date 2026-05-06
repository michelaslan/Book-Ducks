const BASE_URL = "http://localhost:1337";
const id = new URLSearchParams(location.search).get("id");

const renderBook = async () => {
    const response = await axios.get(`${BASE_URL}/api/books/${id}?populate=*`);
    const book = response.data.data;
    const bookImgContainer = document.querySelector("#bookImg-container");
    const bookInfoContainer = document.querySelector("#bookInfo-container");

    bookImgContainer.innerHTML = `
        <img src="${BASE_URL}${book.Cover?.url}"/>
    `;

    bookInfoContainer.innerHTML = `
        <h1>${book.Title}</h1>
        <h2>${book.Author}</h2>
        <br>
        <p>${book.Pages} pages</p>
        <p>Released ${book.Release}</p>
        <br>
        <p>Snittbetyg:<br><span style="color: #F59E0B;">★</span> ${book.Rating}</p>`;
}

async function addToReadList() {
    const addToReadBtn = document.querySelector("#addToReadBtn");

    addToReadBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        const meRes = await axios.get(`${BASE_URL}/api/users/me`, authHeader);
        const userId = meRes.data.id;

        const res = await axios.get(
            `${BASE_URL}/api/readlists?filters[users_permissions_user][id][$eq]=${userId}&populate=books`,
            authHeader
        );
        const readlists = res.data.data;

        if (readlists.length > 0) {
            const readlist = readlists[0];
            const existingBooks = readlist.books.map(b => b.documentId);
            await axios.put(`${BASE_URL}/api/readlists/${readlist.documentId}`, {
                data: { books: [...existingBooks, id] }
            }, authHeader);
        } else {
            await axios.post(`${BASE_URL}/api/readlists`, {
                data: { books: [id], users_permissions_user: userId }
            }, authHeader);
        }
    });
}

renderBook();
addToReadList();
