/* ============================================================
   MASHAR IMMOBILIER — Scripts globaux · Version Tailwind
   ------------------------------------------------------------
   Aucune dépendance à mashar.css. Toutes les classes visuelles
   manipulées ici sont des classes Tailwind. Fichier chargé sur
   TOUTES les pages via <script src="js/tw-main.js" defer>.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initFadeUpOnScroll();
  initModaleGenerique();
  initScrollTopButton();
  initTabs();
});

/* ──────────────────────────────────────────
   1. NAVBAR — ombre au scroll + lien actif
   ────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("shadow-sm", "border-black/10");
      navbar.classList.remove("border-black/5");
    } else {
      navbar.classList.remove("shadow-sm", "border-black/10");
      navbar.classList.add("border-black/5");
    }
  }, { passive: true });

  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-page]").forEach((link) => {
    const page = link.getAttribute("data-page");
    const estActif =
      (page === "index"   && (currentPage === "" || currentPage === "index.html")) ||
      (page === "biens"   && currentPage === "nos-biens.html") ||
      (page === "gestion" && currentPage === "gestion-locative.html") ||
      (page === "apropos" && currentPage === "a-propos.html") ||
      (page === "contact" && currentPage === "contact.html");
    if (estActif) {
      link.classList.add("text-gold");
      link.classList.remove("hover:opacity-60");
    }
  });
}

/* ──────────────────────────────────────────
   2. MENU MOBILE (hamburger)
   ────────────────────────────────────────── */
function initMobileMenu() {
  const btn   = document.getElementById("mobile-menu-btn");
  const panel = document.getElementById("mobile-menu-panel");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("hidden") === false;
    btn.setAttribute("aria-expanded", isOpen);
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => panel.classList.add("hidden"));
  });
}

/* ──────────────────────────────────────────
   3. ANIMATIONS FADE-UP AU SCROLL
   ──────────────────────────────────────────
   Marquage attendu : class="opacity-0 translate-y-6
   transition-all duration-700" + attribut data-animate.
   Au passage à l'écran, on retire opacity-0/translate-y-6.
   ────────────────────────────────────────── */
function initFadeUpOnScroll() {
  const elements = document.querySelectorAll("[data-animate]");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0", "translate-y-6");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  elements.forEach((el) => observer.observe(el));
}

/* ──────────────────────────────────────────
   4. MODALE GÉNÉRIQUE
   ──────────────────────────────────────────
   Marquage attendu :
   <div id="ID" class="fixed inset-0 z-[60] hidden ...">
     <div class="..."> ... <button data-modal-close>...</button> ... </div>
   </div>
   ────────────────────────────────────────── */
function ouvrirModale(id) {
  const modale = document.getElementById(id);
  if (!modale) return;
  modale.classList.remove("hidden");
  modale.classList.add("flex");
  document.body.style.overflow = "hidden";
}
function fermerModale(id) {
  const modale = document.getElementById(id);
  if (!modale) return;
  modale.classList.add("hidden");
  modale.classList.remove("flex");
  document.body.style.overflow = "";
}
function initModaleGenerique() {
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) fermerModale(overlay.id);
    });
  });
  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = btn.closest(".modal-overlay");
      if (overlay) fermerModale(overlay.id);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay:not(.hidden)").forEach((m) => fermerModale(m.id));
    }
  });
}

/* ──────────────────────────────────────────
   5. BOUTON RETOUR EN HAUT
   ────────────────────────────────────────── */
function initScrollTopButton() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      btn.classList.remove("opacity-0", "invisible", "translate-y-2");
    } else {
      btn.classList.add("opacity-0", "invisible", "translate-y-2");
    }
  }, { passive: true });

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ──────────────────────────────────────────
   6. ONGLETS GÉNÉRIQUES (tabs)
   ────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((groupe) => {
    const boutons  = groupe.querySelectorAll(".tabs__btn");
    const panneaux = groupe.querySelectorAll(".tabs__panel");

    boutons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cible = btn.getAttribute("data-tab");

        boutons.forEach((b) => {
          b.classList.remove("bg-ink", "text-white");
          b.classList.add("text-black/50");
        });
        btn.classList.add("bg-ink", "text-white");
        btn.classList.remove("text-black/50");

        panneaux.forEach((p) => p.classList.toggle("hidden", p.id !== cible));
      });
    });
  });
}

/* ──────────────────────────────────────────
   7. FORMULAIRES → REDIRECTION WHATSAPP
   ──────────────────────────────────────────
   Logique 100% indépendante du CSS (FormData + URL WhatsApp),
   reprise à l'identique de la version mashar.css.
   ────────────────────────────────────────── */
const WHATSAPP_NUMERO = "2250707889831";

function envoyerFormulaireEstimation(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const lignes = [
    "Bonjour MASHAR, je souhaite une estimation pour la gestion de mon bien.",
    `Type de bien : ${data.get("type_bien") || "-"}`,
    `Zone : ${data.get("zone") || "-"}`,
    data.get("loyer_estime") ? `Loyer mensuel estimé : ${Number(data.get("loyer_estime")).toLocaleString("fr-FR")} FCFA` : null,
    `Nom : ${data.get("nom") || "-"}`,
    `Contact : ${data.get("contact") || "-"}`
  ].filter(Boolean);

  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(lignes.join("\n"))}`, "_blank", "noopener,noreferrer");
  form.reset();
  return false;
}

function envoyerFormulaireConfier(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const lignes = [
    "Bonjour MASHAR, je suis propriétaire et je souhaite confier la gestion de mon bien.",
    `Nom : ${data.get("nom") || "-"}`,
    `Téléphone : ${data.get("telephone") || "-"}`,
    `Email : ${data.get("email") || "-"}`,
    `Type de bien : ${data.get("type_bien") || "-"}`,
    `Localisation : ${data.get("localisation") || "-"}`,
    data.get("nb_logements") ? `Nombre de logements/locaux : ${data.get("nb_logements")}` : null,
    data.get("message") ? `Message : ${data.get("message")}` : null
  ].filter(Boolean);

  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(lignes.join("\n"))}`, "_blank", "noopener,noreferrer");
  form.reset();
  return false;
}

function envoyerFormulaireRecherche(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const lignes = [
    "Bonjour MASHAR, je recherche un bien à louer.",
    `Nom : ${data.get("nom") || "-"}`,
    `Téléphone : ${data.get("telephone") || "-"}`,
    `Type de bien recherché : ${data.get("type_bien") || "-"}`,
    data.get("budget") ? `Budget mensuel max : ${Number(data.get("budget")).toLocaleString("fr-FR")} FCFA` : null,
    `Zone souhaitée : ${data.get("zone") || "-"}`,
    data.get("message") ? `Précisions : ${data.get("message")}` : null
  ].filter(Boolean);

  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(lignes.join("\n"))}`, "_blank", "noopener,noreferrer");
  form.reset();
  return false;
}
