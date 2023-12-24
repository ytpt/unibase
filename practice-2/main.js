document.addEventListener("DOMContentLoaded", function() {
    const url = "https://jsonplaceholder.typicode.com/posts";

    const error = document.createElement("p");
    error.classList.add("error");

    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.style.display = "block";
    document.body.appendChild(loader);

    const createTable = (data) => {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = ["№", "Название", "Описание"];

        headers.forEach(headerTitle => {
            const th = document.createElement("th");
            th.appendChild(document.createTextNode(headerTitle));
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        
        data.forEach(post => {
            const row = document.createElement("tr");
            const cells = [post.id, post.title, post.body];

            cells.forEach(cellText => {
                const td = document.createElement("td");
                td.appendChild(document.createTextNode(cellText));
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        return table;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка соединения с сервером");
            }
            return response.json();
        })
        .then(data => {
            const table = createTable(data);
            document.body.appendChild(table);
        })
        .catch(err => {
            error.textContent = `Ошибка при получении данных: ${err.message}`;
            document.body.appendChild(error);
        })
        .finally(() => {
            loader.style.display = "none";
        });
});
