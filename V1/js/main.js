/* ============================================================
   MASHAR IMMOBILIER — Scripts globaux (js/main.js)
   ------------------------------------------------------------
   Source UNIQUE de toute la logique JS partagée entre les pages :
   navbar (scroll, lien actif, hamburger), animations d'apparition,
   modale générique, et bouton "retour en haut".
   Ce fichier est chargé via <script src="js/main.js" defer> dans
   base.html — ne rien dupliquer en inline dans les pages.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initFadeUpOnScroll();
  initModaleGenerique();
  initScrollTopButton();
  initTabs();
});

/* ──────────────────────────────────────────
   0. NAVBAR — scroll effect, lien actif, hamburger
   ────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  // Effet au scroll (ombre quand on descend)
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  // Lien actif selon la page courante
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar__link[data-page]").forEach(link => {
    const page = link.getAttribute("data-page");
    const estActif =
      (page === "index"   && (currentPage === "" || currentPage === "index.html")) ||
      (page === "biens"   && currentPage === "nos-biens.html") ||
      (page === "gestion" && currentPage === "gestion-locative.html") ||
      (page === "apropos" && currentPage === "a-propos.html") ||
      (page === "contact" && currentPage === "contact.html");
    if (estActif) link.classList.add("active");
  });

  // Hamburger mobile
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Fermer le menu mobile si clic en dehors de la navbar
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
    }
  });
}

/* ──────────────────────────────────────────
   1. ANIMATIONS "FADE UP" AU SCROLL
   ──────────────────────────────────────────
   Usage dans le HTML :
   <div class="animate-fade-up" data-animate>...</div>
   La classe .animate-fade-up existe déjà dans mashar.css
   mais est appliquée ici seulement quand l'élément entre
   dans le viewport (au lieu de jouer au chargement de la page).
   ────────────────────────────────────────── */
function initFadeUpOnScroll() {
  const elements = document.querySelectorAll("[data-animate]");
  if (!elements.length) return;

  // Si le navigateur ne supporte pas IntersectionObserver (très rare),
  // on affiche tout directement sans animation.
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("animate-fade-up"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-up");
        obs.unobserve(entry.target); // joue une seule fois
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────
   2. MODALE GÉNÉRIQUE
   ──────────────────────────────────────────
   Réutilisable sur n'importe quelle page (ex: fiche détail
   d'un bien sur nos-biens.html).

   Structure HTML attendue quelque part dans la page :

   <div class="modal-overlay" id="ma-modale">
     <div class="modal">
       <div class="modal__header">
         <h3>Titre</h3>
         <button class="modal__close" data-modal-close>×</button>
       </div>
       <div class="modal__body">...</div>
     </div>
   </div>

   Pour ouvrir depuis n'importe quel bouton :
   <button data-modal-open="ma-modale">Ouvrir</button>

   Pour ouvrir depuis JS (ex: après clic sur une card générée
   dynamiquement) :
   ouvrirModale("ma-modale");
   ────────────────────────────────────────── */
function initModaleGenerique() {
  // Ouverture via attribut data-modal-open="id-de-la-modale"
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-modal-open]");
    if (trigger) {
      const id = trigger.getAttribute("data-modal-open");
      ouvrirModale(id);
    }
  });

  // Fermeture via bouton data-modal-close, ou clic sur l'overlay lui-même
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-modal-close]")) {
      const modale = e.target.closest(".modal-overlay");
      if (modale) fermerModale(modale.id);
    }
    if (e.target.classList.contains("modal-overlay")) {
      fermerModale(e.target.id);
    }
  });

  // Fermeture via touche Echap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modaleOuverte = document.querySelector(".modal-overlay.open");
      if (modaleOuverte) fermerModale(modaleOuverte.id);
    }
  });
}

function ouvrirModale(id) {
  const modale = document.getElementById(id);
  if (!modale) return;
  modale.classList.add("open");
  document.body.style.overflow = "hidden"; // empêche le scroll du fond
}

function fermerModale(id) {
  const modale = document.getElementById(id);
  if (!modale) return;
  modale.classList.remove("open");
  document.body.style.overflow = "";
}

/* ──────────────────────────────────────────
   3. BOUTON "RETOUR EN HAUT"
   ──────────────────────────────────────────
   Cherche un élément #scroll-top-btn s'il existe sur la page
   et le fait apparaître/disparaître selon la position de scroll.
   Optionnel : ne rien casser si l'élément est absent.
   ────────────────────────────────────────── */
function initScrollTopButton() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ──────────────────────────────────────────
   4. FORMULAIRES → REDIRECTION WHATSAPP
   ──────────────────────────────────────────
   Le site n'a pas de backend serveur : plutôt que d'envoyer
   un email (nécessite un serveur PHP/SMTP), les formulaires
   construisent un message WhatsApp pré-rempli et ouvrent
   la conversation directement — cohérent avec la stratégie
   "contact direct" utilisée partout ailleurs sur le site.
   ────────────────────────────────────────── */
const WHATSAPP_NUMERO = "2250707889831";

/**
 * Gère le formulaire "Estimer la gestion de mon bien"
 * (utilisé dans gestion-locative.html).
 * Appelé via onsubmit="return envoyerFormulaireEstimation(event)"
 */
function envoyerFormulaireEstimation(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const typeBien   = data.get("type_bien") || "-";
  const zone       = data.get("zone") || "-";
  const loyer      = data.get("loyer_estime");
  const nom        = data.get("nom") || "-";
  const contact    = data.get("contact") || "-";

  const lignes = [
    "Bonjour MASHAR, je souhaite une estimation pour la gestion de mon bien.",
    `Type de bien : ${typeBien}`,
    `Zone : ${zone}`,
    loyer ? `Loyer mensuel estimé : ${Number(loyer).toLocaleString("fr-FR")} FCFA` : null,
    `Nom : ${nom}`,
    `Contact : ${contact}`
  ].filter(Boolean);

  const message = encodeURIComponent(lignes.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${message}`, "_blank", "noopener,noreferrer");

  form.reset();
  return false;
}

/* ──────────────────────────────────────────
   5. ONGLETS GÉNÉRIQUES (tabs)
   ──────────────────────────────────────────
   Marquage attendu dans le HTML :
   <div class="tabs" data-tabs>
     <div class="tabs__nav">
       <button class="tabs__btn active" data-tab="panel-1">Onglet 1</button>
       <button class="tabs__btn" data-tab="panel-2">Onglet 2</button>
     </div>
     <div class="tabs__panel active" id="panel-1">...</div>
     <div class="tabs__panel" id="panel-2">...</div>
   </div>
   Réutilisable pour n'importe quel groupe d'onglets sur le site.
   ────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((groupe) => {
    const boutons = groupe.querySelectorAll(".tabs__btn");
    const panneaux = groupe.querySelectorAll(".tabs__panel");

    boutons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cible = btn.getAttribute("data-tab");

        boutons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        panneaux.forEach((p) => p.classList.toggle("active", p.id === cible));
      });
    });
  });
}

/**
 * Gère le formulaire "Confier mon bien" (contact.html, onglet propriétaire).
 * Appelé via onsubmit="return envoyerFormulaireConfier(event)"
 */
function envoyerFormulaireConfier(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const nom      = data.get("nom") || "-";
  const tel      = data.get("telephone") || "-";
  const email    = data.get("email") || "-";
  const type     = data.get("type_bien") || "-";
  const loc      = data.get("localisation") || "-";
  const nbLogements = data.get("nb_logements");
  const message  = data.get("message");

  const lignes = [
    "Bonjour MASHAR, je suis propriétaire et je souhaite confier la gestion de mon bien.",
    `Nom : ${nom}`,
    `Téléphone : ${tel}`,
    `Email : ${email}`,
    `Type de bien : ${type}`,
    `Localisation : ${loc}`,
    nbLogements ? `Nombre de logements/locaux : ${nbLogements}` : null,
    message ? `Message : ${message}` : null
  ].filter(Boolean);

  const texte = encodeURIComponent(lignes.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texte}`, "_blank", "noopener,noreferrer");

  form.reset();
  return false;
}

/**
 * Gère le formulaire "Je cherche un bien" (contact.html, onglet locataire).
 * Appelé via onsubmit="return envoyerFormulaireRecherche(event)"
 */
function envoyerFormulaireRecherche(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const nom     = data.get("nom") || "-";
  const tel     = data.get("telephone") || "-";
  const type    = data.get("type_bien") || "-";
  const budget  = data.get("budget");
  const zone    = data.get("zone") || "-";
  const message = data.get("message");

  const lignes = [
    "Bonjour MASHAR, je recherche un bien à louer.",
    `Nom : ${nom}`,
    `Téléphone : ${tel}`,
    `Type de bien recherché : ${type}`,
    budget ? `Budget mensuel max : ${Number(budget).toLocaleString("fr-FR")} FCFA` : null,
    `Zone souhaitée : ${zone}`,
    message ? `Précisions : ${message}` : null
  ].filter(Boolean);

  const texte = encodeURIComponent(lignes.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texte}`, "_blank", "noopener,noreferrer");

  form.reset();
  return false;
}