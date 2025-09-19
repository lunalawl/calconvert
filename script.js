const zeros = {
	"Xbox 360": {
		"Rock Band 2": { a: 6, v: 14 },
		"Rock Band 3 (needs more testing)": { a: 0, v: 27 }
	},
	"PS3": {
		"UNSUPPORTED (for now)": { a: 0, v: 0 }
	},
	"Wii": {
		"Guitar Hero: Aerosmith": { a: 43, v: 48 },
		"Guitar Hero World Tour - Band Hero": { a: 0, v: 74 },
		"Guitar Hero: Warriors of Rock": { a: 17, v: 74 },
		"Rock Band Track Packs (after 1-2)": { a: -35, v: -15 },
		"Rock Band 2": { a: -15, v: 55 },
		"LEGO Rock Band": { a: -5, v: 40 },
		"The Beatles: Rock Band": { a: -35, v: 60 },
		"Green Day: Rock Band": { a: -60, v: 30 },
		"Rock Band 3 (needs more testing)": { a: -91, v: 9 },
		"DJ Hero": { a: 19, v: 28 },
		"DJ Hero 2": { a: 64, v: 28 }
	},
	"PS2": {
		"UNSUPPORTED (for now)": { a: 0, v: 0 }
	}
};

const consoles = Object.keys(zeros);
const srcConsole = document.getElementById("srcConsole");
const srcGame = document.getElementById("srcGame");
const consoleTabs = document.getElementById("consoleTabs");
const panels = document.getElementById("panels");
const audioInput = document.getElementById("audio");
const videoInput = document.getElementById("video");
const crtCheckbox = document.getElementById("crtMode");
const inputSection = document.getElementById("inputSection");

function populateConsoleSelectors() {
	srcConsole.innerHTML = "<option value='' disabled selected>-- Select Console --</option>";
	consoles.forEach(c => {
		const opt = document.createElement("option");
		opt.value = c;
		opt.textContent = c;
		srcConsole.appendChild(opt);
	});
	// Reset game select
	srcGame.innerHTML = "<option value='' disabled selected>-- Select Game --</option>";
	srcGame.disabled = true;
}

function populateConsoleSelectors() {
	srcConsole.innerHTML = "<option value='' disabled selected>-- Select Console --</option>";
	consoles.forEach(c => {
		const opt = document.createElement("option");
		opt.value = c;
		opt.textContent = c;
		srcConsole.appendChild(opt);
	});

	// Restore console if saved
	const savedConsole = localStorage.getItem("srcConsole");
	if (savedConsole && consoles.includes(savedConsole)) {
		srcConsole.value = savedConsole;
		populateSrcGames(); // will also restore game if possible
	} else {
		// Reset game select
		srcGame.innerHTML = "<option value='' disabled selected>-- Select Game --</option>";
		srcGame.disabled = true;
	}
}

function populateSrcGames() {
	const c = srcConsole.value;
	srcGame.innerHTML = "<option value='' disabled selected>-- Select Game --</option>";

	if (!c) {
		srcGame.disabled = true;
		return;
	}

	const games = Object.keys(zeros[c] || {});
	games.forEach(g => {
		const opt = document.createElement("option");
		opt.value = g;
		opt.textContent = g;
		srcGame.appendChild(opt);
	});

	// Restore saved game if valid
	const savedGame = localStorage.getItem("srcGame");
	if (savedGame && games.includes(savedGame)) {
		srcGame.value = savedGame;
	}
	srcGame.disabled = false;
}

// Save on change
srcConsole.addEventListener("change", () => {
	localStorage.setItem("srcConsole", srcConsole.value);
	populateSrcGames();
	const activeTab = document.querySelector(".tab.active");
	if (activeTab) renderPanels(activeTab.dataset.console);
});

srcGame.addEventListener("change", () => {
	localStorage.setItem("srcGame", srcGame.value);
	const activeTab = document.querySelector(".tab.active");
	if (activeTab) renderPanels(activeTab.dataset.console);
});

// Restore CRT state on load
inputSection.style.display = crtCheckbox.checked ? "none" : "block";

function buildTabs() {
	consoleTabs.innerHTML = "";
	panels.innerHTML = "";
	consoles.forEach(c => {
		const t = document.createElement("div");
		t.className = "tab";
		t.textContent = c;
		t.dataset.console = c;
		t.onclick = () => {
			document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
			t.classList.add("active");
			localStorage.setItem("activeConsoleTab", c); // save tab selection
			renderPanels(c);
		};
		consoleTabs.appendChild(t);

		const panel = document.createElement("div");
		panel.className = "panel";
		panel.id = "panel-" + c.replace(/\s+/g, "_");
		panel.style.display = "none";
		panels.appendChild(panel);
	});

	// Restore previously active tab if saved
	const savedTab = localStorage.getItem("activeConsoleTab");
	if (savedTab && consoles.includes(savedTab)) {
		const tabEl = [...document.querySelectorAll(".tab")].find(t => t.dataset.console === savedTab);
		if (tabEl) {
			tabEl.classList.add("active");
			renderPanels(savedTab);
		}
	}
}


function renderPanels(activeConsole) {
	consoles.forEach(c => {
		const panel = document.getElementById("panel-" + c.replace(/\s+/g, "_"));
		panel.style.display = c === activeConsole ? "block" : "none";
	});

	let audioVal = Number(audioInput.value) || 0;
	let videoVal = Number(videoInput.value) || 0;
	const srcC = srcConsole.value;
	const srcG = srcGame.value;

	const panel = document.getElementById("panel-" + activeConsole.replace(/\s+/g, "_"));
	panel.innerHTML = "";

	if (crtCheckbox.checked) {
		audioVal = 0;
		videoVal = 0;
	}

	const srcZero = zeros[srcC]?.[srcG];
	if (!srcZero && !crtCheckbox.checked) return;

	const relAudio = crtCheckbox.checked ? 0 : audioVal - srcZero.a;
	const relVideo = crtCheckbox.checked ? 0 : videoVal - srcZero.v;

	const games = Object.keys(zeros[activeConsole] || {});
	games.forEach(g => {
		const z = zeros[activeConsole][g];
		const newA = Math.round(relAudio + z.a);
		const newV = Math.round(relVideo + z.v);
		const el = document.createElement("div");
		el.className = "game";
		el.innerHTML = `<strong>${g}</strong>
		                Audio: ${newA}  |  Video: ${newV}`;
		panel.appendChild(el);
	});
}

// Auto update
[audioInput, videoInput, srcConsole, srcGame].forEach(el => {
	el.addEventListener("input", () => {
		const activeTab = document.querySelector(".tab.active");
		if (activeTab) renderPanels(activeTab.dataset.console);
	});
});

crtCheckbox.addEventListener("change", () => {
	inputSection.style.display = crtCheckbox.checked ? "none" : "block";
	const activeTab = document.querySelector(".tab.active");
	if (activeTab) renderPanels(activeTab.dataset.console);
});

// Initial setup (apply CRT state on load)
inputSection.style.display = crtCheckbox.checked ? "none" : "block";

populateConsoleSelectors();
buildTabs();
