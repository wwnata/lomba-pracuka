const navButtons = document.querySelectorAll(".nav-button");
const pages = document.querySelectorAll(".page");

const defaultParticipants = [
    { id: 1, school: "SMPN 1 Nusantara", team: "Harimau", category: "SMP" },
    { id: 2, school: "SMPN 1 Nusantara", team: "Melati", category: "SMP" },
    { id: 3, school: "SDN 05 Merdeka", team: "Rajawali", category: "SD" },
    { id: 4, school: "SDN 02 Makmur", team: "Mawar", category: "SD" }
];

const defaultScores = [
    { id: 1, participantId: 3, pioneering: 85, cipher: 90, obstacle: 88 },
    { id: 2, participantId: 4, pioneering: 80, cipher: 85, obstacle: 90 },
    { id: 3, participantId: 1, pioneering: 95, cipher: 88, obstacle: 92 },
    { id: 4, participantId: 2, pioneering: 90, cipher: 90, obstacle: 90 }
];

let participants = loadData("participants", defaultParticipants);
let scores = loadData("scores", defaultScores);

function loadData(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
        return fallback;
    }
}

function saveData() {
    localStorage.setItem("participants", JSON.stringify(participants));
    localStorage.setItem("scores", JSON.stringify(scores));
}

function isAdmin() {
    return sessionStorage.getItem("isAdmin") === "true";
}

function toggleMenu() {
    document.getElementById("navigation").classList.toggle("open");
}

function showPage(id, button = null) {
    if (id === "admin" && !isAdmin()) {
        openLogin();
        return;
    }

    pages.forEach(page => page.classList.remove("active"));
    navButtons.forEach(nav => nav.classList.remove("active"));

    document.getElementById(id).classList.add("active");

    if (button) {
        button.classList.add("active");
    }

    document.getElementById("navigation").classList.remove("open");
    window.scrollTo(0, 0);
}

function openLogin() {
    document.getElementById("loginOverlay").classList.add("show");
    document.getElementById("username").focus();
}

function closeLogin() {
    document.getElementById("loginOverlay").classList.remove("show");
    document.getElementById("loginMessage").textContent = "";
}

function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("isAdmin", "true");
        document.getElementById("logoutButton").style.display = "block";
        closeLogin();
        showPage("admin");
        event.target.reset();
    } else {
        showMessage("loginMessage", "Username atau password salah.", true);
    }
}

function logoutAdmin() {
    sessionStorage.removeItem("isAdmin");
    document.getElementById("logoutButton").style.display = "none";
    showPage("beranda", navButtons[0]);
}

function getParticipant(id) {
    return participants.find(item => item.id === Number(id));
}

function newId(list) {
    return list.length ? Math.max(...list.map(item => item.id)) + 1 : 1;
}

function totalScore(score) {
    return Number(score.pioneering) +
        Number(score.cipher) +
        Number(score.obstacle);
}

function renderParticipants() {
    document.getElementById("publicParticipants").innerHTML =
        participants.length
            ? participants.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.school}</td>
                    <td><strong>${item.team}</strong></td>
                    <td><span class="tag">${item.category}</span></td>
                </tr>
            `).join("")
            : `<tr><td colspan="4">Belum ada peserta.</td></tr>`;

    document.getElementById("adminParticipants").innerHTML =
        participants.length
            ? participants.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.school}</td>
                    <td>${item.team}</td>
                    <td>${item.category}</td>
                    <td>
                        <button class="button button-gold" onclick="editParticipant(${item.id})">Edit</button>
                        <button class="button button-danger" onclick="deleteParticipant(${item.id})">Hapus</button>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="5">Belum ada peserta.</td></tr>`;

    document.getElementById("totalParticipants").textContent = participants.length;
    document.getElementById("heroTotal").textContent = participants.length;
    document.getElementById("totalSD").textContent =
        participants.filter(item => item.category === "SD").length;
    document.getElementById("totalSMP").textContent =
        participants.filter(item => item.category === "SMP").length;

    document.getElementById("scoreParticipant").innerHTML =
        participants.length
            ? participants.map(item => `
                <option value="${item.id}">
                    ${item.team} - ${item.category} (${item.school})
                </option>
            `).join("")
            : `<option value="">Tambahkan peserta terlebih dahulu</option>`;
}

function scoreRow(score, admin = false) {
    const participant = getParticipant(score.participantId);

    if (!participant) {
        return "";
    }

    if (admin) {
        return `
            <tr>
                <td>${participant.team}</td>
                <td>${participant.category}</td>
                <td>${score.pioneering}</td>
                <td>${score.cipher}</td>
                <td>${score.obstacle}</td>
                <td><strong>${totalScore(score)}</strong></td>
                <td>
                    <button class="button button-gold" onclick="editScore(${score.id})">Edit</button>
                    <button class="button button-danger" onclick="deleteScore(${score.id})">Hapus</button>
                </td>
            </tr>
        `;
    }

    return `
        <tr>
            <td><strong>${participant.team}</strong></td>
            <td>${score.pioneering}</td>
            <td>${score.cipher}</td>
            <td>${score.obstacle}</td>
            <td><strong>${totalScore(score)}</strong></td>
        </tr>
    `;
}

function renderScores(category = "SD") {
    const filtered = scores
        .filter(score => getParticipant(score.participantId)?.category === category)
        .sort((a, b) => totalScore(b) - totalScore(a));

    document.getElementById("publicScores").innerHTML =
        filtered.length
            ? filtered.map(score => scoreRow(score)).join("")
            : `<tr><td colspan="5">Belum ada nilai.</td></tr>`;

    document.getElementById("adminScores").innerHTML =
        scores.length
            ? [...scores]
                .sort((a, b) => totalScore(b) - totalScore(a))
                .map(score => scoreRow(score, true))
                .join("")
            : `<tr><td colspan="7">Belum ada nilai.</td></tr>`;
}

function saveParticipant(event) {
    event.preventDefault();

    const id = Number(document.getElementById("participantId").value);
    const item = {
        id: id || newId(participants),
        school: document.getElementById("school").value.trim(),
        team: document.getElementById("team").value.trim(),
        category: document.getElementById("category").value
    };

    participants = id
        ? participants.map(old => old.id === id ? item : old)
        : [...participants, item];

    saveData();
    renderAll();
    showMessage("participantMessage", id ? "Peserta diperbarui." : "Peserta ditambahkan.");
    resetParticipantForm(false);
}

function editParticipant(id) {
    const item = getParticipant(id);

    document.getElementById("participantId").value = item.id;
    document.getElementById("school").value = item.school;
    document.getElementById("team").value = item.team;
    document.getElementById("category").value = item.category;
    document.getElementById("participantSubmit").textContent = "Simpan Perubahan";

    document.getElementById("participantForm").scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    document.getElementById("school").focus();
}

function deleteParticipant(id) {
    const item = getParticipant(id);

    if (!confirm(`Hapus peserta ${item.team}?`)) {
        return;
    }

    participants = participants.filter(participant => participant.id !== id);
    scores = scores.filter(score => score.participantId !== id);

    saveData();
    renderAll();
}

function deleteAllParticipants() {
    if (!confirm("Hapus semua peserta dan nilai terkait?")) {
        return;
    }

    participants = [];
    scores = [];
    saveData();
    renderAll();
}

function resetParticipantForm(clearMessage = true) {
    document.getElementById("participantForm").reset();
    document.getElementById("participantId").value = "";
    document.getElementById("participantSubmit").textContent = "Tambah Peserta";

    if (clearMessage) {
        document.getElementById("participantMessage").textContent = "";
    }
}

function saveScore(event) {
    event.preventDefault();

    const id = Number(document.getElementById("scoreId").value);
    const item = {
        id: id || newId(scores),
        participantId: Number(document.getElementById("scoreParticipant").value),
        pioneering: Number(document.getElementById("pioneering").value),
        cipher: Number(document.getElementById("cipher").value),
        obstacle: Number(document.getElementById("obstacle").value)
    };

    scores = id
        ? scores.map(old => old.id === id ? item : old)
        : [...scores, item];

    saveData();
    renderAll();
    showMessage("scoreMessage", id ? "Nilai diperbarui." : "Nilai ditambahkan.");
    resetScoreForm(false);
}

function editScore(id) {
    const item = scores.find(score => score.id === id);

    document.getElementById("scoreId").value = item.id;
    document.getElementById("scoreParticipant").value = item.participantId;
    document.getElementById("pioneering").value = item.pioneering;
    document.getElementById("cipher").value = item.cipher;
    document.getElementById("obstacle").value = item.obstacle;
    document.getElementById("scoreSubmit").textContent = "Simpan Perubahan";

    document.getElementById("scoreForm").scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    document.getElementById("scoreParticipant").focus();
}

function deleteScore(id) {
    if (!confirm("Hapus nilai ini?")) {
        return;
    }

    scores = scores.filter(score => score.id !== id);
    saveData();
    renderAll();
}

function deleteAllScores() {
    if (!confirm("Hapus semua nilai?")) {
        return;
    }

    scores = [];
    saveData();
    renderAll();
}

function resetScoreForm(clearMessage = true) {
    document.getElementById("scoreForm").reset();
    document.getElementById("scoreId").value = "";
    document.getElementById("scoreSubmit").textContent = "Tambah Nilai";

    if (clearMessage) {
        document.getElementById("scoreMessage").textContent = "";
    }
}

function showScores(category, button) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    renderScores(category);
}

function showMessage(id, text, error = false) {
    const element = document.getElementById(id);

    element.textContent = text;
    element.className = `message ${error ? "error" : "success"}`;

    setTimeout(() => {
        element.textContent = "";
        element.className = "message";
    }, 3000);
}

function renderAll() {
    renderParticipants();
    renderScores();
}

if (isAdmin()) {
    document.getElementById("logoutButton").style.display = "block";
}

document.addEventListener("keydown", event => {
    const shortcut = (event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === "a";
    if (shortcut) {
        event.preventDefault();
        showPage("admin");
    }
});

let jumlahKetukan = 0;
let waktuKetukan = 0;

document.getElementById("logoRahasia").addEventListener("click", () => {
    const sekarang = Date.now();
    if (sekarang - waktuKetukan > 1500) {
        jumlahKetukan = 0;
    }
    jumlahKetukan++;
    waktuKetukan = sekarang;
    if (jumlahKetukan === 5) {
        jumlahKetukan = 0;
        showPage("admin");
    }
});

renderAll();