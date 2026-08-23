/* ============================================================
   MASHAR IMMOBILIER — Base de données des biens
   ------------------------------------------------------------
   Ce fichier fait office de "mini base de données" en attendant
   un vrai backend. Pour ajouter/modifier un bien : dupliquer un
   objet ci-dessous et changer les valeurs. Aucune autre page
   n'a besoin d'être modifiée : index.html et nos-biens.html
   lisent ce tableau automatiquement.

   Champs :
   - id            : identifiant unique (string), ne jamais dupliquer
   - titre         : nom affiché du bien
   - type          : "Maison" | "Appartement" | "Studio" | "Magasin"
   - zone          : commune / quartier d'Abidjan
   - loyer         : loyer mensuel en FCFA (nombre, sans espace ni symbole)
   - pieces        : nombre de pièces (nombre)
   - surface       : surface en m² (nombre)
   - statut        : "Disponible" | "Réservé" | "Loué"
   - description   : texte long pour la fiche détail / modale
   - images        : tableau d'URLs (mettre plusieurs images si dispo,
                     sinon dupliquer la même image placeholder)
   - dateAjout     : "AAAA-MM-JJ" — utile pour trier "Biens récents"
   - vedette       : true/false — true = apparaît dans "Biens récents" (accueil)
   ============================================================ */

/**
 * Génère un placeholder image local en SVG (data URI) — zéro
 * requête réseau, chargement instantané. À utiliser en attendant
 * les vraies photos des biens (voir champ "images" ci-dessous).
 * Remplacer simplement phImg("xxx") par "chemin/vers/photo.jpg"
 * ou une URL réelle quand les photos sont prêtes.
 */
function phImg(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#EEF0FA"/>
      <rect x="4" y="4" width="792" height="592" fill="none" stroke="#3D4A9E" stroke-width="4" stroke-dasharray="14 10"/>
      <g fill="#3D4A9E" opacity="0.55">
        <rect x="352" y="248" width="96" height="72" rx="6" fill="none" stroke="#3D4A9E" stroke-width="5"/>
        <circle cx="378" cy="272" r="6"/>
        <path d="M358 312 L392 280 L420 308" fill="none" stroke="#3D4A9E" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="400" y="360" font-family="Arial, sans-serif" font-size="18" font-weight="700"
            fill="#3D4A9E" text-anchor="middle" letter-spacing="1">PHOTO À AJOUTER</text>
      <text x="400" y="384" font-family="Arial, sans-serif" font-size="13"
            fill="#3D4A9E" text-anchor="middle" opacity="0.75">${label}</text>
    </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

const BIENS = [
  {
    id: "b001",
    titre: "Villa moderne 4 pièces — Cocody Angré",
    type: "Maison",
    zone: "Cocody Angré",
    loyer: 450000,
    pieces: 4,
    surface: 180,
    statut: "Disponible",
    description: "Belle villa moderne dans un quartier calme et sécurisé d'Angré. Salon spacieux, cuisine équipée, 3 chambres climatisées, cour extérieure et parking privé. Idéale pour une famille recherchant confort et tranquillité.",
    images: [
      "image/biens/imeuble8.jpg",
      "image/biens/interieure1.jpg"
    ],
    dateAjout: "2026-07-28",
    vedette: true
  },
  {
    id: "b002",
    titre: "Appartement standing 3 pièces — Riviera Palmeraie",
    type: "Appartement",
    zone: "Riviera Palmeraie",
    loyer: 320000,
    pieces: 3,
    surface: 95,
    statut: "Disponible",
    description: "Appartement au 2ème étage d'une résidence sécurisée avec gardiennage 24h/24. Cuisine américaine, 2 chambres, balcon avec vue dégagée. Proche des commerces et axes principaux.",
    images: [
      "image/biens/imeuble10.jpg",
      "image/biens/vila-luxe.jpg"
    ],
    dateAjout: "2026-07-25",
    vedette: true
  },
  {
    id: "b003",
    titre: "Studio meublé — Abobo Plateau Dokui",
    type: "Studio",
    zone: "Abobo Plateau Dokui",
    loyer: 85000,
    pieces: 1,
    surface: 28,
    statut: "Disponible",
    description: "Studio entièrement meublé et fonctionnel, idéal pour étudiant ou jeune actif. Kitchenette équipée, salle d'eau privative, accès facile aux transports.",
    images: [
      "image/biens/cite-abidjan.jpg",
      "image/biens/cite-luxe.jpg"
    ],
    dateAjout: "2026-07-30",
    vedette: true
  },
  {
    id: "b004",
    titre: "Magasin commercial — Plateau centre-ville",
    type: "Magasin",
    zone: "Plateau",
    loyer: 550000,
    pieces: 1,
    surface: 60,
    statut: "Réservé",
    description: "Local commercial en rez-de-chaussée sur artère passante du Plateau. Vitrine large, forte visibilité, idéal boutique ou bureau de représentation.",
    images: [
      "image/biens/cite9.jpg",
      "image/biens/cite-luxe.jpg"
    ],
    dateAjout: "2026-07-15",
    vedette: false
  },
  {
    id: "b005",
    titre: "Maison familiale 5 pièces — Yopougon Niangon",
    type: "Maison",
    zone: "Yopougon Niangon",
    loyer: 280000,
    pieces: 5,
    surface: 160,
    statut: "Loué",
    description: "Grande maison familiale avec cour, 4 chambres, salon double, cuisine séparée. Quartier animé et bien desservi, proche écoles et marché.",
    images: [
      "image/biens/cite-luxe.jpg"
    ],
    dateAjout: "2026-06-20",
    vedette: false
  },
  {
    id: "b006",
    titre: "Appartement 2 pièces — Marcory Résidentiel",
    type: "Appartement",
    zone: "Marcory Résidentiel",
    loyer: 195000,
    pieces: 2,
    surface: 65,
    statut: "Disponible",
    description: "Appartement lumineux dans résidence calme de Marcory. Chambre climatisée, salon, cuisine équipée, place de parking incluse.",
    images: [
      "image/biens/imauble6.jpg",
      "image/biens/imeuble4.jpg"
    ],
    dateAjout: "2026-07-22",
    vedette: true
  },
  {
    id: "b007",
    titre: "Villa avec jardin — Bingerville",
    type: "Maison",
    zone: "Bingerville",
    loyer: 380000,
    pieces: 4,
    surface: 200,
    statut: "Disponible",
    description: "Villa au calme avec grand jardin arboré, loin de l'agitation tout en restant proche d'Abidjan. 3 chambres, double salon, garage.",
    images: [
      "image/biens/imeuble5.png",
      "image/biens/imeuble8.jpg"
    ],
    dateAjout: "2026-07-10",
    vedette: false
  },
  {
    id: "b008",
    titre: "Studio moderne — Koumassi Grand-Marché",
    type: "Studio",
    zone: "Koumassi",
    loyer: 70000,
    pieces: 1,
    surface: 25,
    statut: "Réservé",
    description: "Studio neuf et fonctionnel proche du marché de Koumassi. Idéal petit budget, accès direct aux transports en commun.",
    images: [
      "image/biens/interieur10.jpg",
      "image/biens/interieure1.jpg"
    ],
    dateAjout: "2026-07-05",
    vedette: false
  }
];

/* ──────────────────────────────────────────
   Fonctions utilitaires exportées (usage global)
   ────────────────────────────────────────── */

/** Formate un nombre en FCFA lisible : 450000 → "450 000 FCFA" */
function formaterPrix(nombre) {
  return nombre.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
}

/** Construit l'URL WhatsApp pré-remplie pour un bien donné */
function whatsappUrlPourBien(bien) {
  const numero = "2250707889831";
  const message = `Bonjour MASHAR, je suis intéressé(e) par ce bien : "${bien.titre}" (réf. ${bien.id}). Est-il toujours disponible ?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

/** Retourne la liste des zones uniques présentes dans BIENS, triée alphabétiquement */
function zonesDisponibles() {
  return [...new Set(BIENS.map(b => b.zone))].sort((a, b) => a.localeCompare(b, "fr"));
}

/** Retourne les biens marqués "vedette", triés du plus récent au plus ancien */
function biensVedette(limite = 3) {
  return BIENS
    .filter(b => b.vedette)
    .sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout))
    .slice(0, limite);
}

/** Retourne la classe CSS de badge correspondant au statut d'un bien */
function classeBadgeStatut(statut) {
  if (statut === "Disponible") return "card__badge--available";
  if (statut === "Réservé") return "card__badge--reserved";
  if (statut === "Loué") return "card__badge--rented";
  return "card__badge--available";
}