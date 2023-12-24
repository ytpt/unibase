document.addEventListener("DOMContentLoaded", function() {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const table = document.getElementById("table");
    const tbody = document.getElementById("tbody");
    const searchInput = document.getElementById("searchInput");
    let posts = [];

    const error = document.createElement("p");
    error.classList.add("error");

    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.style.display = "block";
    document.body.appendChild(loader);

    // Создание таблицы
    const createTable = (data) => {
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

    // Отправка запроса
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка соединения с сервером");
            }
            return response.json();
        })
        .then(data => {
            posts = [...data];
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

    // Сортировка
    const sortTable = (table) => {
        let sortOrder = 1;

        const getCellValue = (row, index) => {
            const cellContent = row.cells[index].textContent.trim();
            return isNaN(Number(cellContent)) ? cellContent : Number(cellContent);
        };

        const sortRows = (index) => {
            const sortedRows = Array.from(table.tBodies[0].rows)
                .sort((a, b) => {
                    const cellA = getCellValue(a, index);
                    const cellB = getCellValue(b, index);
                    return sortOrder * (cellA > cellB ? 1 : cellA < cellB ? -1 : 0);
                });
            table.tBodies[0].append(...sortedRows);
        };

        table.tHead.addEventListener("click", (e) => {
            const target = e.target.closest("th");
            if (!target) return;
            const index = Array.from(target.parentNode.cells).indexOf(target);
            if (index >= 0) {
                sortOrder *= -1;
                sortRows(index);
            }
        });
    };
    sortTable(table);

    // Фильтрация
    const filterTable = () => {
        searchInput.addEventListener("input", (event) => {
            const searchText = event.target.value.trim().toLowerCase();
            const rows = table.tBodies[0].rows;

            if (searchText === "" || searchText.length < 3) {
                restoreTable();
            } else {
                for (let i = 0; i < rows.length; i++) {
                    const rowData = rows[i].innerText.toLowerCase();

                    if (rowData.includes(searchText)) {
                        rows[i].style.display = "";
                    } else {
                        rows[i].style.display = "none";
                    }
                }
            }
        });
    }

    // Восстановление таблицы
    const restoreTable = () => {
        const rows = table.tBodies[0].rows;
        for (const row of rows) {
            row.style.display = "";
        }
    };
    filterTable();
});
