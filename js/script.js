let fullData = [];
let chart;

document.addEventListener("DOMContentLoaded", () => {

    const errorBox = document.getElementById("error");

    fetch("json/data.json")
        .then(res => {
            if (!res.ok) throw new Error("No se pudo cargar el JSON");
            return res.json();
        })
        .then(data => {
            fullData = data;

            createTabs(data);
            renderChart(data);
        })
        .catch(err => {
            errorBox.style.display = "block";
            errorBox.innerText = err.message;
        });

});


/* =========================
   CREAR TABS DINÁMICOS
========================= */
function createTabs(data) {

    const navbar = document.getElementById("navbar");

    const departments = [...new Set(data.map(d => d.department))];

    const tabs = ["Ver Todo", ...departments];

    tabs.forEach(tabName => {

        const tab = document.createElement("div");
        tab.className = "tab";
        tab.innerText = tabName;

        tab.onclick = () => {

            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            if (tabName === "Ver Todo") {
                renderChart(fullData);
            } else {
                const filtered = fullData.filter(d => d.department === tabName);
                renderChart(filtered);
            }
        };

        navbar.appendChild(tab);
    });

    navbar.firstChild.classList.add("active");
}


/* =========================
   TEMPLATE CORPORATIVO
========================= */
function createTemplates() {

    const base = OrgChart.templates.olivia;

    // GERENCIA (DORADO)
    OrgChart.templates.gold = Object.assign({}, base);
    OrgChart.templates.gold.node =
        `<rect rx="10" ry="10" width="250" height="100" fill="#fff8e1" stroke="#d4af37"></rect>`;

    // ADMIN (AZUL)
    OrgChart.templates.blue = Object.assign({}, base);
    OrgChart.templates.blue.node =
        `<rect rx="10" ry="10" width="250" height="100" fill="#e3f2fd" stroke="#0a66c2"></rect>`;

    // COORDINACIÓN (VERDE)
    OrgChart.templates.green = Object.assign({}, base);
    OrgChart.templates.green.node =
        `<rect rx="10" ry="10" width="250" height="100" fill="#e8f5e9" stroke="#2e7d32"></rect>`;

    // OPERATIVO (GRIS)
    OrgChart.templates.gray = Object.assign({}, base);
    OrgChart.templates.gray.node =
        `<rect rx="10" ry="10" width="250" height="100" fill="#f5f5f5" stroke="#9e9e9e"></rect>`;

    // Campos
    ["gold","blue","green","gray"].forEach(t => {

        OrgChart.templates[t].field_0 =
            `<text x="125" y="40" text-anchor="middle"
            style="font-size:16px;font-weight:bold;">{val}</text>`;

        OrgChart.templates[t].field_1 =
            `<text x="125" y="65" text-anchor="middle"
            style="font-size:13px;">{val}</text>`;
    });
}


/* =========================
   RENDER CHART
========================= */
function renderChart(data) {

    createTemplates();

    if (chart) chart.destroy();

    chart = new OrgChart(document.getElementById("tree"), {
        nodes: data,

        template: "gray",

        nodeBinding: {
            field_0: "name",
            field_1: "role"
        },

        tags: {
            "gerencia": { template: "gold" },
            "administracion": { template: "blue" },
            "coordinacion": { template: "green" },
            "operativo": { template: "gray" }
        },

        mouseScrool: OrgChart.action.zoom,
        nodeMouseClick: OrgChart.action.expandCollapse,

        
        layout: OrgChart.tree,
        levelSeparation: 50,
        siblingSeparation: 40,
    });


}