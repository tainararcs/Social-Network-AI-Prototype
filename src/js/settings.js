import { updateUserTheme } from './User.js';

const configLink = document.querySelector("#link-configs");
configLink.addEventListener("click", (e) => {

    e.preventDefault();

    loadPage("configs", "settings.html", ()=>{
        setupSettingsNavigation();
    });

    setActiveLink("link-configs");
    showPage("page-configs");
});


function setupSettingsNavigation() {
    const settingsSections = {
        settingsMain: document.getElementById("settingsDesktop"),
        theme: document.getElementById("theme-div"),
        help: document.getElementById("help-div"),
        language: document.getElementById("language-div")
    };
   

    function showSettingsSection(sectionId) {
        Object.values(settingsSections).forEach(section => {
            section.style.display = (section.id === sectionId) ? "block" : "none";
        });
    }

    // Botões de navegação
    document.getElementById("changeTheme-link").addEventListener("click", e => {
        e.preventDefault();
        showSettingsSection("theme-div");
    });

    document.getElementById("help-link").addEventListener("click", e => {
        e.preventDefault();
        showSettingsSection("help-div");
    });

    document.getElementById("language-link").addEventListener("click", e => {
        e.preventDefault();
        showSettingsSection("language-div");
    });

    // Botões de voltar
    document.getElementById("backToFeed").addEventListener("click", () => {
        showPage("page-feed");
        setActiveLink("link-feed");
    });
    document.getElementById("TbackToSettings").addEventListener("click", () => {
        showSettingsSection("settingsDesktop");
    });

    document.getElementById("HbackToSettings").addEventListener("click", () => {
        showSettingsSection("settingsDesktop");
    });

    document.getElementById("LbackToSettings").addEventListener("click", () => {
        showSettingsSection("settingsDesktop");
    });

    //Tema
     document.getElementById("light-theme").addEventListener("click", (e) => {
        document.body.classList.remove('dark-mode');
        updateUserTheme(false);
    });

    document.getElementById("dark-theme").addEventListener("click", (e) => {
        document.body.classList.add('dark-mode');
        updateUserTheme(true);
    });
    
    // Logout
    document.getElementById("btnLogout").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });
  
}