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
========================= 
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
}*/

function createTemplates() {

    const base = OrgChart.templates.olivia;

    function createTemplate(name, color, bg) {

        OrgChart.templates[name] = Object.assign({}, base);

        OrgChart.templates[name].node =
            `<rect rx="10" ry="10" width="250" height="110"
            fill="${bg}" stroke="${color}" stroke-width="2"></rect>`;

        // ICONO
        OrgChart.templates[name].field_0 =
            `<foreignObject x="10" y="30" width="40" height="40">
                <div style="color:${color}">
                    {icon}
                </div>
            </foreignObject>`;

        // NOMBRE
        OrgChart.templates[name].field_1 =
            `<text x="140" y="45" text-anchor="middle"
            style="font-size:15px;font-weight:bold;fill:#1d2226;">
            {val}
            </text>`;

        // ROL
        OrgChart.templates[name].field_2 =
            `<text x="140" y="70" text-anchor="middle"
            style="font-size:12px;fill:#6a6f73;">
            {role}
            </text>`;
    }

    createTemplate("gerencia", "#d4af37", "#fff8e1");
    createTemplate("administracion", "#0a66c2", "#e3f2fd");
    createTemplate("coordinacion", "#2e7d32", "#e8f5e9");
    createTemplate("operativo", "#616161", "#f5f5f5");
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
    field_0: "icon",
    field_1: "name",
    field_2: "role"
},

tags: {
    "gerencia": { template: "gerencia" },
    "administracion": { template: "administracion" },
    "coordinacion": { template: "coordinacion" },
    "operativo": { template: "operativo" }
},

        mouseScrool: OrgChart.action.zoom,
        nodeMouseClick: OrgChart.action.expandCollapse,

        
        layout: OrgChart.tree,
        levelSeparation: 50,
        siblingSeparation: 40,
    });

const ICONS = {

    manager: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="7" r="4"/>
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
    </svg>`,

    admin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="white"/>
    </svg>`,

    warehouse: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 10l9-6 9 6v10H3z"/>
    </svg>`,

    shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/>
    </svg>`,

    coord: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="12" r="3"/>
        <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor"/>
    </svg>`,

    team: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="8" cy="10" r="3"/>
        <circle cx="16" cy="10" r="3"/>
        <path d="M2 20c0-3 3-5 6-5"/>
        <path d="M22 20c0-3-3-5-6-5"/>
    </svg>`,

    truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <rect x="1" y="6" width="15" height="10"/>
        <rect x="16" y="10" width="7" height="6"/>
    </svg>`,

    bike: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="17" r="3"/>
        <circle cx="18" cy="17" r="3"/>
        <path d="M6 17l5-8 4 8"/>
    </svg>`
};

data.forEach(node => {
    node.icon = ICONS[node.icon] || "";
});

}