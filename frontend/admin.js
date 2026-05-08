const BASE_URL = "http://localhost:1337";
const token = localStorage.getItem("token");
const authHeader = { headers: { Authorization: `Bearer ${token}` } };

async function createBook() {
    const title = document.querySelector("#addBook-title").value;
    const author = document.querySelector("#addBook-author").value;
    const pages = document.querySelector("#addBook-pages").value;
    const release = document.querySelector("#addBook-release").value;
    const imageFile = document.querySelector("#addBook-image").files[0];

    const formData = new FormData();
    formData.append("files", imageFile);
    const uploadRes = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const imageId = uploadRes.data[0].id;

    await axios.post(`${BASE_URL}/api/books`, {
        data: {
            Title: title,
            Author: author,
            Pages: parseInt(pages),
            Release: release,
            Cover: imageId
        }
    }, authHeader);

    window.location.href = "index.html";
}
