// =========================
// LIGHTBOX POUR LES IMAGES D'AVIS DISCORD
// =========================

document.addEventListener('DOMContentLoaded', function () {

    const sideImages = document.querySelectorAll('.testimonials-side-images img');

    if (sideImages.length > 0) {

        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';

        const overlayImg = document.createElement('img');
        overlay.appendChild(overlayImg);

        document.body.appendChild(overlay);

        sideImages.forEach(function (img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function () {
                overlayImg.src = img.src;
                overlay.classList.add('active');
            });
        });

        overlay.addEventListener('click', function () {
            overlay.classList.remove('active');
        });
    }

});

// =========================
// ZOOM AU SCROLL SUR LES CARTES RÉSULTATS (MOBILE)
// =========================

document.addEventListener('DOMContentLoaded', function () {

    const resultCards = document.querySelectorAll('.result-card');

    if (resultCards.length > 0) {

        function updateZoomOnScroll() {

            const screenCenter = window.innerHeight / 2;

            resultCards.forEach(function (card) {

                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + (rect.height / 2);
                const distanceFromCenter = Math.abs(screenCenter - cardCenter);

                if (distanceFromCenter < rect.height * 0.6) {
                    card.classList.add('in-view');
                } else {
                    card.classList.remove('in-view');
                }

            });
        }

        window.addEventListener('scroll', updateZoomOnScroll);
        updateZoomOnScroll();
    }

});

// =========================
// VÉRIFICATION DU STATUT TWITCH VIA API
// =========================

const TWITCH_CLIENT_ID = "ijkbip2a9i70iu22tjl0hoi04u50y9";
const TWITCH_TOKEN = "1q9bq1f4401hwmgj25bwqyh7rk5nyx";

const streamersEnLive = {};

async function checkTwitchStatus(channel, voyantEl, statutEl, carteEl, nom, lienTwitch) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
            headers: {
                "Client-ID": TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${TWITCH_TOKEN}`
            }
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const viewers = data.data[0].viewer_count;

            voyantEl.className = "voyant voyant-online";
            statutEl.textContent = "EN DIRECT";
            statutEl.className = "statut statut-live";
            
            // ⭐ AJOUTE CES DEUX LIGNES ⭐
            carteEl.classList.add("carte-live");
            carteEl.classList.remove("carte-offline");

            let viewersEl = carteEl.querySelector(".viewers");
            if (!viewersEl) {
                viewersEl = document.createElement("p");
                viewersEl.className = "viewers";
                statutEl.insertAdjacentElement("afterend", viewersEl);
            }
            viewersEl.textContent = `👁 ${viewers.toLocaleString()} viewers`;

            if (!streamersEnLive[channel]) {
                streamersEnLive[channel] = true;
                afficherBanniere(nom, lienTwitch);
            }

        } else {
            voyantEl.className = "voyant voyant-offline";
            statutEl.textContent = "En ligne : Non";
            statutEl.className = "statut";
            
            // ⭐ AJOUTE CES DEUX LIGNES ⭐
            carteEl.classList.remove("carte-live");
            carteEl.classList.add("carte-offline");
            
            streamersEnLive[channel] = false;

            const viewersEl = carteEl.querySelector(".viewers");
            if (viewersEl) viewersEl.remove();
        }

        const nbLive = document.querySelectorAll(".carte-live").length;
        const nbLiveEl = document.getElementById("nb-live");
        if (nbLiveEl) nbLiveEl.textContent = nbLive;

        trierCartes();

    } catch (error) {
        console.log("Erreur Twitch :", error);
    }
}

// =========================
// BANNIERE LIVE
// =========================

function afficherBanniere(nom, lien) {
    const banniere = document.getElementById("banniere-live");
    const texte = document.getElementById("banniere-texte");
    const bouton = document.getElementById("banniere-lien");

    if (banniere) {
        texte.textContent = `🔴 ${nom} est en direct sur Twitch !`;
        bouton.href = lien;
        banniere.style.display = "flex";

        setTimeout(() => {
            banniere.style.display = "none";
        }, 10000);
    }

    // Demande la permission et envoie la notification seulement si l'utilisateur a déjà accepté
    if ("Notification" in window && Notification.permission === "granted") {
        envoyerNotification(nom, lien);
    }
}

// =========================
// NOTIFICATIONS NAVIGATEUR
// =========================

function demanderPermissionNotification() {
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }
}

function envoyerNotification(nom, lien) {
    if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(`🔴 ${nom} est en direct !`, {
            body: `Clique pour regarder le stream de ${nom} sur Twitch !`,
            icon: "https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c1.png",
        });

        notification.onclick = function () {
            window.open(lien, "_blank");
            notification.close();
        };

        setTimeout(() => notification.close(), 8000);
    }
}

// =========================
// TRI DES CARTES (LIVE D'ABORD)
// =========================

function trierCartes() {
    const container = document.querySelector(".partners-container-twitch");
    if (!container) return;

    const cartes = Array.from(container.querySelectorAll(".carte-twitch"));

    const cartesLive = cartes.filter(c => c.classList.contains("carte-live"));
    const cartesOffline = cartes.filter(c => !c.classList.contains("carte-live"));

    [...cartesLive, ...cartesOffline].forEach(carte => container.appendChild(carte));
}

// =========================
// INITIALISATION TWITCH SUR PARTENARIAT
// =========================

document.addEventListener('DOMContentLoaded', function () {

    const cartes = document.querySelectorAll(".carte-twitch");

    if (cartes.length > 0) {

        // Définir les streamers avec leurs identifiants
        const streamersConfig = [
            { channel: "sylvain2500", nom: "Sylvain Gaming", lien: "https://www.twitch.tv/sylvain2500" },
            { channel: "voldarks81540", nom: "Voldarks", lien: "https://www.twitch.tv/voldarks81540" },
            { channel: "miss_dixon", nom: "Miss_dixon", lien: "https://www.twitch.tv/miss_dixon" },
            { channel: "titou0232", nom: "Titou0232", lien: "https://www.twitch.tv/titou0232" }
        ];

        // Parcourir les cartes et vérifier chaque streamer
        cartes.forEach((carte, index) => {
            if (index < streamersConfig.length) {
                const config = streamersConfig[index];
                const voyant = carte.querySelector(".voyant");
                const statut = carte.querySelector(".statut");

                if (voyant && statut) {
                    checkTwitchStatus(config.channel, voyant, statut, carte, config.nom, config.lien);
                }
            }
        });

        // Mise à jour périodique toutes les 30 secondes
        setInterval(() => {
            const cartesActuelles = document.querySelectorAll(".carte-twitch");
            cartesActuelles.forEach((carte, index) => {
                if (index < streamersConfig.length) {
                    const config = streamersConfig[index];
                    const voyant = carte.querySelector(".voyant");
                    const statut = carte.querySelector(".statut");
                    if (voyant && statut) {
                        checkTwitchStatus(config.channel, voyant, statut, carte, config.nom, config.lien);
                    }
                }
            });
        }, 30000);

        // Demander la permission pour les notifications
        demanderPermissionNotification();
    }

});

// =========================
// VÉRIFICATION DES LIVE POUR LA PAGE D'ACCUEIL
// =========================

const streamersAccueil = [
    { channel: "sylvain2500", nom: "Sylvain Gaming", lien: "https://www.twitch.tv/sylvain2500" },
    { channel: "voldarks81540", nom: "Voldarks", lien: "https://www.twitch.tv/voldarks81540" },
    { channel: "miss_dixon", nom: "Miss_dixon", lien: "https://www.twitch.tv/miss_dixon" },
    { channel: "titou0232", nom: "Titou0232", lien: "https://www.twitch.tv/titou0232" }
];

async function checkLiveAccueil() {
    const bloc = document.getElementById("live-accueil");
    const liste = document.getElementById("live-accueil-liste");

    if (!bloc || !liste) return;

    liste.innerHTML = "";
    let nbLive = 0;

    for (const streamer of streamersAccueil) {
        try {
            const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamer.channel}`, {
                headers: {
                    "Client-ID": TWITCH_CLIENT_ID,
                    "Authorization": `Bearer ${TWITCH_TOKEN}`
                }
            });

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                nbLive++;
                liste.innerHTML += `<a href="${streamer.lien}" target="_blank">🎮 ${streamer.nom}</a>`;
            }
        } catch (error) {
            console.log("Erreur live accueil :", error);
        }
    }

    bloc.style.display = nbLive > 0 ? "block" : "none";
}

document.addEventListener('DOMContentLoaded', function () {
    checkLiveAccueil();
    setInterval(checkLiveAccueil, 30000);
});