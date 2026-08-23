/* ============================================================
   MASHAR IMMOBILIER — Catalogue dynamique · Version Tailwind
   ------------------------------------------------------------
   Dépend de data-biens.js (variable BIENS) chargé AVANT ce
   fichier. Spécifique à nos-biens.html.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof BIENS === "undefined") return;

  const grille = document.getElementById("catalogue-grid");
  if (!grille) return;

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
     STATUT → couleur du badge (noir/blanc/doré uniquement)
     ────────────────────────────────────────── */
  function classesBadgeStatut(statut) {
    if (statut === "Disponible") return "bg-gold text-white";
    if (statut === "Réservé")    return "bg-black/70 text-white";
    return "bg-black/40 text-black"; // Loué
  }

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
        <div class="col-span-full text-center py-20">
          <p class="font-display font-bold text-lg mb-2">Aucun bien ne correspond à ces critères</p>
          <p class="text-black/50 text-sm">Essayez d'élargir votre budget ou de changer de filtre.</p>
        </div>`;
      return;
    }

    grille.innerHTML = biensFiltres.map(carteBienHTML).join("");

    grille.querySelectorAll("[data-bien-id]").forEach((el) => {
      el.addEventListener("click", () => ouvrirDetailBien(el.getAttribute("data-bien-id")));
    });
  }

  /* ──────────────────────────────────────────
     TEMPLATE HTML D'UNE CARTE — Tailwind
     ────────────────────────────────────────── */
  function carteBienHTML(bien) {
    return `
      <article
        class="group border border-black/10 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white"
        data-bien-id="${bien.id}"
      >
        <div class="relative aspect-[4/3] overflow-hidden bg-black/5">
          <img src="${bien.images[0]}" alt="${bien.titre}" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span class="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${classesBadgeStatut(bien.statut)}">
            ${bien.statut}
          </span>
        </div>
        <div class="p-6">
          <span class="text-xs font-semibold uppercase tracking-wider text-black/40">${bien.type}</span>
          <h3 class="font-display font-bold text-lg mt-1 mb-3">${bien.titre}</h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/55 mb-4">
            <span>📍 ${bien.zone}</span>
            <span> ${bien.pieces} pièce${bien.pieces > 1 ? "s" : ""}</span>
            <span> ${bien.surface} m²</span>
          </div>
          <p class="font-display font-bold text-xl">
            ${formaterPrix(bien.loyer)} <span class="text-sm font-normal text-black/40">/ mois</span>
          </p>
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

      conteneur.querySelectorAll("[data-filtre-type]").forEach((c) => {
        c.classList.remove("bg-ink", "text-white");
        c.classList.add("border", "border-black/15", "text-black/60");
      });
      chip.classList.add("bg-ink", "text-white");
      chip.classList.remove("border", "border-black/15", "text-black/60");

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
      <div class="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/5 mb-5">
        <img src="${bien.images[0]}" alt="${bien.titre}" class="w-full h-full object-cover" />
        <span class="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${classesBadgeStatut(bien.statut)}">
          ${bien.statut}
        </span>
      </div>

      ${bien.images.length > 1 ? `
        <div class="flex gap-2 mb-5 overflow-x-auto">
          ${bien.images.map((src) => `<img src="${src}" alt="${bien.titre}" class="w-24 h-16 object-cover rounded-lg flex-shrink-0" />`).join("")}
        </div>` : ""}

      <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-black/60 mb-4">
        <span class="text-xs font-semibold uppercase tracking-wider bg-black/5 px-3 py-1 rounded-full">${bien.type}</span>
        <span>📍 ${bien.zone}</span>
        <span>🛏️ ${bien.pieces} pièce${bien.pieces > 1 ? "s" : ""}</span>
        <span>📐 ${bien.surface} m²</span>
      </div>

      <p class="text-black/65 leading-relaxed mb-6">${bien.description}</p>

      <div class="flex items-center justify-between flex-wrap gap-4 border-t border-black/10 pt-5">
        <p class="font-display font-bold text-2xl">
          ${formaterPrix(bien.loyer)} <span class="text-sm font-normal text-black/40">/ mois</span>
        </p>
        <a href="${whatsappUrlPourBien(bien)}" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white text-sm font-semibold rounded-full hover:bg-black/80 transition">
          Contacter sur WhatsApp
        </a>
      </div>
    `;

    ouvrirModale("modal-bien");
  }
});
