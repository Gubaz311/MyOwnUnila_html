//animasi berputar dan pengaturan tema
const mode1 = document.getElementById("mode1");
const svg1 = document.getElementById("svg1");
const mode2 = document.getElementById("mode2");
const svg2 = document.getElementById("svg2");
const html = document.querySelector('html');

// Fungsi untuk mengatur tema
function setTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        svg1.clicked = false;
        svg1.classList.add('modeRotate');
        svg2.clicked = false;
        svg2.classList.add('modeRotate');
    } else {
        html.classList.remove('dark');
        svg1.clicked = true;
        svg1.classList.remove('modeRotate');
        svg2.clicked = true;
        svg2.classList.remove('modeRotate');
    }
}

// Panggil fungsi setTheme saat dokumen dimuat
document.addEventListener("DOMContentLoaded", setTheme);

// Event listener untuk mode 1
mode1.addEventListener('click', function() {
    if (svg1.clicked) {
        svg1.clicked = false;
        svg1.classList.add("modeRotate");
        localStorage.theme = 'dark';
    } else {
        svg1.clicked = true;
        svg1.classList.remove("modeRotate");
        localStorage.theme = 'light';
    }
    setTheme();
});

// Event listener untuk mode 2
mode2.addEventListener('click', function() {
    if (svg2.clicked) {
        svg2.clicked = false;
        svg2.classList.add("modeRotate");
        localStorage.theme = 'dark';
    } else {
        svg2.clicked = true;
        svg2.classList.remove("modeRotate");
        localStorage.theme = 'light';
    } 
    setTheme();
});