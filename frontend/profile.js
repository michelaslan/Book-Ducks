const BASE_URL = "http://localhost:1337";

const renderProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const meRes = await axios.get(`${BASE_URL}/api/users/me`, authHeader);
    const user = meRes.data;

    document.querySelector("#profile-username").textContent = user.username;

    const readlistRes = await axios.get(
        `${BASE_URL}/api/readlists?filters[users_permissions_user][id][$eq]=${user.id}&populate=books.Cover`,
        authHeader
    );
    const readlists = readlistRes.data.data;
    const container = document.querySelector("#readlist-container");

    if (readlists.length === 0 || readlists[0].books.length === 0) {
        container.innerHTML = "<p>Din läslista är tom.</p>";
        return;
    }

    readlists[0].books.forEach(book => {
        container.innerHTML += `
            <div class="book-container" onclick="window.location.href='book.html?id=${book.documentId}'">
                <img src="${BASE_URL}${book.Cover?.url}"/>
                <h2>${book.Title}</h2>
                <p>${book.Author}</p>
            </div>`;
    });
}

renderProfile();