// =========================
// VARIABLES GLOBALES
// =========================
let fullData = [];
let chart;

// =========================
// ICONOS SVG
// =========================
const ICONS = {

    manager: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <circle cx="12" cy="7" r="4"/>
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
    </svg>`,

    admin: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
    </svg>`,

    warehouse: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M3 10l9-6 9 6v10H3z"/>
    </svg>`,

    shield: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/>
    </svg>`,

    coord: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="12" r="3"/>
        <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor"/>
    </svg>`,

    team: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <circle cx="8" cy="10" r="3"/>
        <circle cx="16" cy="10" r="3"/>
    </svg>`,

    truck: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <rect x="1" y="6" width="15" height="10"/>
        <rect x="16" y="10" width="7" height="6"/>
    </svg>`,

    bike: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <circle cx="6" cy="17" r="3"/>
        <circle cx="18" cy="17" r="3"/>
    </svg>`
};

// =========================
// INICIO
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const errorBox = document.getElementById("error");

    fetch("json/data.json")
        .then(res => {
            if (!res.ok) throw new Error("No se pudo cargar el JSON");
            return res.json();
        })
        .then(data => {

            // Convertir icon string → SVG
            data.forEach(node => {
                node.icon = ICONS[node.icon] || "";
            });

            fullData = data;

            createTabs(data);
            renderChart(data);
        })
        .catch(err => {
            console.error(err);
            errorBox.style.display = "block";
            errorBox.innerText = err.message;
        });

});


// =========================
// TABS DINÁMICOS
// =========================
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


// =========================
// TEMPLATE CORPORATIVO
// =========================
function createTemplates() {

    const base = OrgChart.templates.olivia;

    function makeTemplate(name, color, bg) {

        OrgChart.templates[name] = Object.assign({}, base);

        OrgChart.templates[name].size = [250, 110];

        OrgChart.templates[name].node =
            `<rect x="0" y="0" rx="10" ry="10"
            width="250" height="110"
            fill="${bg}" stroke="${color}" stroke-width="2"></rect>`;

        // ICONO
        OrgChart.templates[name].field_0 =
            `<foreignObject x="10" y="35" width="40" height="40">
                <div style="color:${color}">
                    {val}
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
            {val}
            </text>`;
    }

    makeTemplate("gerencia", "#d4af37", "#fff8e1");
    makeTemplate("administracion", "#0a66c2", "#e3f2fd");
    makeTemplate("coordinacion", "#2e7d32", "#e8f5e9");
    makeTemplate("operativo", "#616161", "#f5f5f5");
}


// =========================
// RENDER CHART
// =========================
function renderChart(data) {

    createTemplates();

    if (chart) chart.destroy();

    chart = new OrgChart(document.getElementById("tree"), {

        nodes: data,

        template: "operativo",

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
        scaleInitial: 0.8,
        levelSeparation: 50,
        siblingSeparation: 40
    });
}