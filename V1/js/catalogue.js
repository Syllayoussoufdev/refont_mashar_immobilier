/* ============================================================
   MASHAR IMMOBILIER — Catalogue dynamique (js/catalogue.js)
   ------------------------------------------------------------
   Spécifique à nos-biens.html. Dépend de js/data-biens.js
   (variable globale BIENS + fonctions utilitaires) qui doit
   être chargé AVANT ce fichier dans le HTML.

   Responsabilités :
   1. Générer les cartes de biens dans #catalogue-grid
   2. Gérer les filtres (type, zone, budget) en JS pur, sans rechargement
   3. Ouvrir une modale de détail au clic sur une carte
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Sécurité : si BIENS n'existe pas (data-biens.js non chargé
  // ou pas sur cette page), on arrête tout de suite sans planter.
  if (typeof BIENS === "undefined") return;

  const grille = document.getElementById("catalogue-grid");
  if (!grille) return; // cette page n'a pas de catalogue, rien à faire

  const etatFiltres = {
    type: "Tous",
    zone: "Toutes",
    budgetMax: budgetMaximumDesBiens()
  };

  initFiltresType();
  initFiltresZone();
  initFiltresBudget();
  rendreCatalogue();

  /* ──────────────────────────────────────────
     RENDU DE LA GRILLE
     ────────────────────────────────────────── */
  function rendreCatalogue() {
    const biensFiltres = BIENS.filter((bien) => {
      const okType   = etatFiltres.type === "Tous" || bien.type === etatFiltres.type;
      const okZone   = etatFiltres.zone === "Toutes" || bien.zone === etatFiltres.zone;
      const okBudget = bien.loyer <= etatFiltres.budgetMax;
      return okType && okZone && okBudget;
    });

    const compteur = document.getElementById("catalogue-count");
    if (compteur) {
      compteur.textContent = `${biensFiltres.length} bien${biensFiltres.length > 1 ? "s" : ""} trouvé${biensFiltres.length > 1 ? "s" : ""}`;
    }

    if (biensFiltres.length === 0) {
      grille.innerHTML = `
        <div class="catalogue-empty" style="grid-column: 1/-1;">
          <p class="heading-sm" style="color: var(--color-gray-600); margin-bottom:8px;">Aucun bien ne correspond à ces critères</p>
          <p class="body-sm">Essayez d'élargir votre budget ou de changer de filtre.</p>
        </div>`;
      return;
    }

    grille.innerHTML = biensFiltres.map(carteBienHTML).join("");

    // Rattacher le clic "Détails" sur chaque carte fraîchement générée
    grille.querySelectorAll("[data-bien-id]").forEach((el) => {
      el.addEventListener("click", () => ouvrirDetailBien(el.getAttribute("data-bien-id")));
    });
  }

  /* ──────────────────────────────────────────
     TEMPLATE HTML D'UNE CARTE
     ────────────────────────────────────────── */
  function carteBienHTML(bien) {
    return `
      <article class="card animate-fade-up" data-bien-id="${bien.id}" style="cursor:pointer;">
        <div class="card__image-wrap">
          <img class="card__image" src="${bien.images[0]}" alt="${bien.titre}" loading="lazy" />
          <span class="card__badge ${classeBadgeStatut(bien.statut)}">${bien.statut}</span>
        </div>
        <div class="card__body">
          <span class="card__type">${bien.type}</span>
          <h3 class="card__title">${bien.titre}</h3>
          <div class="card__meta">
            <span class="card__meta-item">📍 ${bien.zone}</span>
            <span class="card__meta-item">🛏️ ${bien.pieces} pièce${bien.pieces > 1 ? "s" : ""}</span>
            <span class="card__meta-item">📐 ${bien.surface} m²</span>
          </div>
          <p class="card__price">${formaterPrix(bien.loyer)} <span>/ mois</span></p>
        </div>
        <div class="card__footer">
          <button class="btn btn--outline-navy btn--sm" style="flex:1;" type="button" data-bien-id="${bien.id}">
            Détails &amp; Visite
          </button>
        </div>
      </article>`;
  }

  /* ──────────────────────────────────────────
     FILTRES — TYPE (chips)
     ────────────────────────────────────────── */
  function initFiltresType() {
    const conteneur = document.getElementById("filtre-type");
    if (!conteneur) return;

    conteneur.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filtre-type]");
      if (!chip) return;

      conteneur.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      etatFiltres.type = chip.getAttribute("data-filtre-type");
      rendreCatalogue();
    });
  }

  /* ──────────────────────────────────────────
     FILTRES — ZONE (select)
     ────────────────────────────────────────── */
  function initFiltresZone() {
    const select = document.getElementById("filtre-zone");
    if (!select) return;

    // Remplir dynamiquement les options depuis les zones réellement présentes
    zonesDisponibles().forEach((zone) => {
      const option = document.createElement("option");
      option.value = zone;
      option.textContent = zone;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      etatFiltres.zone = select.value;
      rendreCatalogue();
    });
  }

  /* ──────────────────────────────────────────
     FILTRES — BUDGET (slider)
     ────────────────────────────────────────── */
  function initFiltresBudget() {
    const slider  = document.getElementById("filtre-budget");
    const affiche = document.getElementById("filtre-budget-valeur");
    if (!slider) return;

    const max = budgetMaximumDesBiens();
    slider.max = max;
    slider.value = max;
    if (affiche) affiche.textContent = formaterPrix(max);

    slider.addEventListener("input", () => {
      etatFiltres.budgetMax = Number(slider.value);
      if (affiche) affiche.textContent = formaterPrix(etatFiltres.budgetMax);
      rendreCatalogue();
    });
  }

  function budgetMaximumDesBiens() {
    return Math.max(...BIENS.map((b) => b.loyer));
  }

  /* ──────────────────────────────────────────
     MODALE DÉTAIL D'UN BIEN
     ────────────────────────────────────────── */
  function ouvrirDetailBien(id) {
    const bien = BIENS.find((b) => b.id === id);
    if (!bien) return;

    const corps = document.getElementById("modal-bien-body");
    const titre = document.getElementById("modal-bien-titre");
    if (!corps || !titre) return;

    titre.textContent = bien.titre;

    corps.innerHTML = `
      <div class="card__image-wrap" style="border-radius: var(--radius-lg); margin-bottom: var(--space-5);">
        <img class="card__image" src="${bien.images[0]}" alt="${bien.titre}" />
        <span class="card__badge ${classeBadgeStatut(bien.statut)}">${bien.statut}</span>
      </div>

      ${bien.images.length > 1 ? `
        <div class="flex gap-2" style="margin-bottom: var(--space-5); overflow-x:auto;">
          ${bien.images.map((src) => `<img src="${src}" alt="${bien.titre}" style="width:88px; height:66px; object-fit:cover; border-radius: var(--radius-md); flex-shrink:0;" />`).join("")}
        </div>` : ""}

      <div class="card__meta" style="margin-bottom: var(--space-4);">
        <span class="badge badge--gold">${bien.type}</span>
        <span class="card__meta-item">📍 ${bien.zone}</span>
        <span class="card__meta-item">🛏️ ${bien.pieces} pièce${bien.pieces > 1 ? "s" : ""}</span>
        <span class="card__meta-item">📐 ${bien.surface} m²</span>
      </div>

      <p class="body-base text-muted" style="line-height:1.75; margin-bottom: var(--space-5);">
        ${bien.description}
      </p>

      <div class="flex-between" style="align-items:center; flex-wrap:wrap; gap:16px;">
        <p class="card__price" style="margin:0;">${formaterPrix(bien.loyer)} <span>/ mois</span></p>
        <a href="${whatsappUrlPourBien(bien)}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp">
          Contacter sur WhatsApp
        </a>
      </div>
    `;

    ouvrirModale("modal-bien");
  }
});