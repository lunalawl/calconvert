// All games and their zero values
const zeros = {
	"Xbox 360": {
		"Real Lag Values (traditional-style)": { a: 0, v: 0 },
		"Real Lag Values (av/input-style)": { a: 0, v: 0, typeAVComp: true },

		"Guitar Hero II (Vanilla)": { a: 8, v: 10, typeComp: true },
		"Guitar Hero II (Calibration Fix)": { a: 8, v: 10 },

		"Guitar Hero III & Aerosmith": { a: -9, v: 27 },
		"Guitar Hero World Tour": { a: -18, v: 22 },
		"Guitar Hero: Metallica & Smash Hits": { a: -19, v: 21 },
		"Guitar Hero: Van Halen": { a: -24, v: 21 },
		"Guitar Hero 5 & Band Hero": { a: -6, v: 4 },
		"Guitar Hero: Warriors of Rock": { a: 3, v: 22 },

		"Rock Band (Halfway)": { a: -21, v: 10, typeAVComp: true },  // To input: Audio = AV + Comp, Video = Comp
		"Rock Band (Guitar)": { a: -22, v: 9, typeAVComp: true },
		"Rock Band (Drums)": { a: -19, v: 12, typeAVComp: true }, // gtr plus 3

		"Rock Band 2 (Halfway) (test more?)": { a: 0, v: 8 }, 
		"Rock Band 2 (Guitar) (test more?)": { a: 6, v: 14 },
		"Rock Band 2 (Drums) (test more?)": { a: -6, v: 2 }, // gtr minus 12 (former 18)

		"LEGO Rock Band (Halfway)": { a: -11, v: -3 },
		"LEGO Rock Band (Guitar)": { a: -7, v: 1 },
		"LEGO Rock Band (Drums)": { a: -16, v: -8 }, // gtr minus 9 (former 15)

		"The Beatles: Rock Band": { a: -17, v: 14 },

		"Green Day: Rock Band (Halfway, good luck)": { a: -12, v: 13 },
		"Green Day: Rock Band (Guitar)": { a: -37, v: -12 },
		"Green Day: Rock Band (Drums)": { a: 13, v: 38 }, // gtr plus 50 (former 44)

		"Rock Band 3": { a: 0, v: 27 },
		
		"Rock Band Blitz": { a: -61, v: 5 },

		"Rock Revolution (experimental)": { a: 17, v: 17, typeAVComp: true },                               // kinda educated guess this game sucks
		"Power Gig: Rise of the SixString (Swap +/- for A/V) (experimental)": { a: -3, v: -3, typeAVComp: true }  // educated guess this game sucks
	},
	"PS3": {
		"Real Lag Values (traditional-style)": { a: 0, v: 0 },
		"Real Lag Values (av/input-style)": { a: 0, v: 0, typeAVComp: true },
	},
	"Wii": {
		"Real Lag Values (traditional-style)": { a: 0, v: 0 },
		"Real Lag Values (av/input-style)": { a: 0, v: 0, typeAVComp: true },
		"Guitar Hero III: Legends of Rock": { a: 7, v: 38, typeComp: true },
		"Guitar Hero: Aerosmith": { a: 43, v: 48 },
		"Guitar Hero World Tour - Band Hero": { a: 0, v: 74 },
		"Guitar Hero: Warriors of Rock": { a: 17, v: 74 },
		"Rock Band": { a: -35, v: -15, typeAVComp: true },
		"Rock Band Track Packs (Vol. 2 and later)": { a: -35, v: -15 },
		"Rock Band 2": { a: -15, v: 55 },
		"LEGO Rock Band": { a: -5, v: 40 },
		"The Beatles: Rock Band": { a: -35, v: 60 },
		"Green Day: Rock Band": { a: -60, v: 30 },
		"Rock Band 3": { a: -105, v: -7 },
		"DJ Hero": { a: 19, v: 28 },
		"DJ Hero 2": { a: 64, v: 28 }
	},
	"PS2": {
		"Real Lag Values (traditional-style)": { a: 0, v: 0 },
		"Real Lag Values (av/input-style)": { a: 0, v: 0, typeAVComp: true },
		"Guitar Hero II (Vanilla)": { a: -16, v: 11, typeComp: true },
		"Guitar Hero II (Calibration Fix)": { a: -16, v: 11 },
	},
	"PS4": {
		"Real Lag Values (traditional-style)": { a: 0, v: 0 },
		"Real Lag Values (av/input-style)": { a: 0, v: 0, typeAVComp: true },
		"Rock Band 4": { a: 93, v: 77 },
		"Amplitude (2016) (Swap +/-) (experimental)": { a: 0, v: -2, typeComp: true },
		"Hatsune Miku: Project DIVA Future Tone (Swap +/-) (experimental)": { a: -17, v: 0, typeComp: true },
		"Taiko no Tatsujin: Drum Session! (experimental)": { a: 0, v: 0, typeAVComp: true }
	}
};

const consoles = Object.keys(zeros);
const srcConsole = document.getElementById("srcConsole");
const srcGame = document.getElementById("srcGame");
const consoleTabs = document.getElementById("consoleTabs");
const panels = document.getElementById("panels");
const audioInput = document.getElementById("audio");
const videoInput = document.getElementById("video");
const avInput = document.getElementById("avoffset");
const compInput = document.getElementById("compensation");
const crtCheckbox = document.getElementById("crtMode");
const inputSection = document.getElementById("inputSection");
const stdInputs = document.getElementById("standardInputs");
const typeAVCompInputs = document.getElementById("typeAVCompInputs");
const typeCompInputs = document.getElementById("typeCompInputs");

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
	if (!c) { srcGame.disabled = true; return; }
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
		updateInputVisibility(); // <-- ensure correct inputs show on reload
	}
	srcGame.disabled = false;
}

srcConsole.addEventListener("change", () => {
	populateSrcGames();
	const activeTab = document.querySelector(".tab.active");
	if (activeTab) renderPanels(activeTab.dataset.console);
});

function updateInputVisibility() {
	const z = zeros[srcConsole.value]?.[srcGame.value];
	if (z?.typeAVComp) {
		stdInputs.style.display = "none";
		typeAVCompInputs.style.display = "flex";
		typeCompInputs.style.display = "none";
	} else if (z?.typeComp) {
		stdInputs.style.display = "none";
		typeAVCompInputs.style.display = "none";
		typeCompInputs.style.display = "flex";
	} else {
		stdInputs.style.display = "flex";
		typeAVCompInputs.style.display = "none";
		typeCompInputs.style.display = "none";
	}
}

srcGame.addEventListener("change", () => {
	updateInputVisibility();
	const activeTab = document.querySelector(".tab.active");
	if (activeTab) renderPanels(activeTab.dataset.console);
});

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

	let audioVal = 0, videoVal = 0;
	const srcC = srcConsole.value;
	const srcG = srcGame.value;
	const srcZero = zeros[srcC]?.[srcG];
	
	if (!crtCheckbox.checked && (!srcC || !srcG || srcZero?.typeComp)) {
		const panel = document.getElementById("panel-" + activeConsole.replace(/\s+/g, "_"));
		panel.innerHTML = "";   // clear old results
		return;
	}

	if (!srcZero && !crtCheckbox.checked) return;

	if (srcZero?.typeAVComp) {
		const av = Number(avInput.value) || 0;
		const comp = Number(compInput.value) || 0;
		audioVal = av + comp;
		videoVal = comp;
	} else if (srcZero?.typeComp) {
		const comp = Number(compInput.value) || 0;
		audioVal = comp;
		videoVal = comp;
	} else {
		audioVal = Number(audioInput.value) || 0;
		videoVal = Number(videoInput.value) || 0;
	}

	if (crtCheckbox.checked) {
		audioVal = 0; videoVal = 0;
	}

	const relAudio = crtCheckbox.checked ? 0 : audioVal - (srcZero?.a || 0);
	const relVideo = crtCheckbox.checked ? 0 : videoVal - (srcZero?.v || 0);

	const panel = document.getElementById("panel-" + activeConsole.replace(/\s+/g, "_"));
	panel.innerHTML = "";
	const games = Object.keys(zeros[activeConsole] || {});
	games.forEach(g => {
		const z = zeros[activeConsole][g];
		const newA = Math.round(relAudio + (z.a || 0));
		const newV = Math.round(relVideo + (z.v || 0));
		const el = document.createElement("div");
		el.className = "game";
		if (z.typeAVComp) {
			const av = newA - newV;
			const comp = newV;
			el.innerHTML = `<strong>${g}</strong>A/V Offset: ${av}  |  Input Offset: ${comp}`;
		} else if (z.typeComp) {
			const comp = Math.round((newA + newV) / 2);
			el.innerHTML = `<strong>${g}</strong>Sync inputs halfway: ${comp}  |  Sync inputs to audio: ${newA}  |  Sync inputs to video: ${newV}`;
		} else {
			el.innerHTML = `<strong>${g}</strong>Audio: ${newA}  |  Video: ${newV}`;
		}
		panel.appendChild(el);
	});
}

// Auto update
[audioInput, videoInput, avInput, compInput].forEach(el => {
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