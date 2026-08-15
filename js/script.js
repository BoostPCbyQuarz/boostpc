// Lightbox pour les images d'avis Discord
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

// Zoom au scroll sur les cartes résultats (mobile)
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

// Vérification du statut Twitch via API officielle
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
            carteEl.classList.add("carte-live");
            carteEl.classList.remove("carte-offline");

            // Affiche le nombre de viewers
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
            carteEl.classList.remove("carte-live");
            carteEl.classList.add("carte-offline");
            streamersEnLive[channel] = false;

            // Supprime le nombre de viewers si hors ligne
            const viewersEl = carteEl.querySelector(".viewers");
            if (viewersEl) viewersEl.remove();
        }

        // Mise à jour du compteur
        const nbLive = document.querySelectorAll(".carte-live").length;
        const nbLiveEl = document.getElementById("nb-live");
        if (nbLiveEl) nbLiveEl.textContent = nbLive;

        trierCartes();

    } catch (error) {
        console.log("Erreur Twitch :", error);
    }
}

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
// Demander la permission pour les notifications navigateur
function demanderPermissionNotification() {
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }
}

// Envoyer une notification navigateur
function envoyerNotification(nom, lien) {
    if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(`🔴 ${nom} est en direct !`, {
            body: `Clique pour regarder le stream de ${nom} sur Twitch !`,
            icon: "https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c1.png",
        });

        // Ouvre le lien Twitch en cliquant sur la notification
        notification.onclick = function () {
            window.open(lien, "_blank");
            notification.close();
        };

        // Ferme la notification après 8 secondes
        setTimeout(() => notification.close(), 8000);
    }
}

function trierCartes() {
    const container = document.querySelector(".partners-container-twitch");
    if (!container) return;

    const cartes = Array.from(container.querySelectorAll(".carte-twitch"));

    // Séparer live et offline
    const cartesLive = cartes.filter(c => c.classList.contains("carte-live"));
    const cartesOffline = cartes.filter(c => !c.classList.contains("carte-live"));

    // Remettre dans le bon ordre : live d'abord puis offline
    [...cartesLive, ...cartesOffline].forEach(carte => container.appendChild(carte));
}

document.addEventListener('DOMContentLoaded', function () {

    const cartes = document.querySelectorAll(".carte-twitch");

    if (cartes.length > 0) {

        const voyant1 = cartes[0].querySelector(".voyant");
        const statut1 = cartes[0].querySelector(".statut");

        const voyant2 = cartes[1] ? cartes[1].querySelector(".voyant") : null;
        const statut2 = cartes[1] ? cartes[1].querySelector(".statut") : null;

        const voyant3 = cartes[2] ? cartes[2].querySelector(".voyant") : null;
        const statut3 = cartes[2] ? cartes[2].querySelector(".statut") : null;

        const voyant4 = cartes[3] ? cartes[3].querySelector(".voyant") : null;
        const statut4 = cartes[3] ? cartes[3].querySelector(".statut") : null;

        checkTwitchStatus("sylvain2500", voyant1, statut1, cartes[0], "Sylvain Gaming", "https://www.twitch.tv/sylvain2500");
if (voyant2 && statut2) checkTwitchStatus("voldarks81540", voyant2, statut2, cartes[1], "Voldarks", "https://www.twitch.tv/voldarks81540");
if (voyant3 && statut3) checkTwitchStatus("miss_dixon", voyant3, statut3, cartes[2], "Miss_dixon", "https://www.twitch.tv/miss_dixon");
if (voyant4 && statut4) checkTwitchStatus("titou0232", voyant4, statut4, cartes[3], "Titou0232", "https://www.twitch.tv/titou0232");

        setInterval(() => {
            const cartesActuelles = document.querySelectorAll(".carte-twitch");
            cartesActuelles.forEach(carte => {
                const nom = carte.querySelector("h3").textContent.toLowerCase().replace(" ", "");
                const voyant = carte.querySelector(".voyant");
                const statut = carte.querySelector(".statut");

                if (nom.includes("sylvain")) checkTwitchStatus("sylvain2500", voyant, statut, carte);
                if (nom.includes("voldark")) checkTwitchStatus("voldarks81540", voyant, statut, carte);
                if (nom.includes("miss_dixon") || nom.includes("dixon")) checkTwitchStatus("miss_dixon", voyant, statut, carte);
                if (voyant4 && statut4) checkTwitchStatus("titou0232", voyant, statut, cartes);
            });
        }, 30000);
    }

});
// Vérification des live pour la page d'accueil
const streamers = [
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

    for (const streamer of streamers) {
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

    // Affiche le bloc seulement si quelqu'un est en live
    bloc.style.display = nbLive > 0 ? "block" : "none";
}

document.addEventListener('DOMContentLoaded', function () {
    checkLiveAccueil();
    setInterval(checkLiveAccueil, 30000);
});