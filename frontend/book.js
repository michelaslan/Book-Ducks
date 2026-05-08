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
        <p>Rating:<br><span style="color: #F59E0B;">★</span> ${book.Rating}</p>`;
}

async function addToReadList() {
    const addToReadBtn = document.querySelector("#addToReadBtn");

    addToReadBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        const { data: user } = await axios.get(`${BASE_URL}/api/users/me`, authHeader);

        const { data: readlistRes } = await axios.get(
            `${BASE_URL}/api/readlists?filters[users_permissions_user][id][$eq]=${user.id}&populate=books`,
            authHeader
        );
        const readlist = readlistRes.data[0];

        if (readlist) {
            const existingBooks = readlist.books.map(b => b.documentId);
            await axios.put(`${BASE_URL}/api/readlists/${readlist.documentId}`, {
                data: { books: [...existingBooks, id] }
            }, authHeader);
        } else {
            await axios.post(`${BASE_URL}/api/readlists`, {
                data: { books: [id], users_permissions_user: user.id }
            }, authHeader);
        }
    });
}

async function rateBook() {
    const token = localStorage.getItem("token");
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const { data: user } = await axios.get(`${BASE_URL}/api/users/me`, authHeader);

    const { data: existing } = await axios.get(
        `${BASE_URL}/api/user-ratings?filters[users_permissions_user][id][$eq]=${user.id}&filters[book][documentId][$eq]=${id}`,
        authHeader
    );
    let ratingDocumentId = existing.data[0]?.documentId || null;
    const existingRatingValue = existing.data[0]?.Rating || null;

    const stars = document.querySelectorAll("#stars span");

    // Visa befintligt betyg vid sidladdning
    if (existingRatingValue) {
        stars.forEach(s => {
            s.textContent = parseInt(s.dataset.value) <= existingRatingValue ? "★" : "☆";
            s.style.color = parseInt(s.dataset.value) <= existingRatingValue ? "gold" : "";
        });
    }

    stars.forEach(star => {
        star.addEventListener("click", async () => {
            const rating = parseInt(star.dataset.value);

            stars.forEach(s => {
                s.textContent = parseInt(s.dataset.value) <= rating ? "★" : "☆";
                s.style.color = parseInt(s.dataset.value) <= rating ? "gold" : "";
            });

            if (ratingDocumentId) {
                await axios.put(`${BASE_URL}/api/user-ratings/${ratingDocumentId}`, {
                    data: { Rating: rating }
                }, authHeader);
            } else {
                const res = await axios.post(`${BASE_URL}/api/user-ratings`, {
                    data: { Rating: rating, book: id, users_permissions_user: user.id }
                }, authHeader);
                ratingDocumentId = res.data.data.documentId;
            }
        });
    });
}

async function checkReadlistStatus() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const { data: user } = await axios.get(`${BASE_URL}/api/users/me`, authHeader);
    const { data: readlistRes } = await axios.get(
        `${BASE_URL}/api/readlists?filters[users_permissions_user][id][$eq]=${user.id}&populate=books`,
        authHeader
    );
    const readlist = readlistRes.data[0];
    const addToReadBtn = document.querySelector("#addToReadBtn");

    if (readlist?.books.some(b => b.documentId === id)) {
        addToReadBtn.style.backgroundColor = "#e74c3c";
        addToReadBtn.style.color = "#fff";
    }
}

renderBook();
addToReadList();
rateBook();
checkReadlistStatus();
