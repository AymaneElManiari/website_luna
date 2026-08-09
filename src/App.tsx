import { useState, useEffect, useRef, useCallback } from "react";

// ── Webhook Google Sheet (Paiement à la livraison COD) ─────────────────────────
// Remplacez cette URL par votre URL Web App Google Apps Script
export const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwjru8415JBAD9UjtGcduDtYK4F4yD1GhH_bQ9tsyStgjqA3xx82RykBc4YXSqRO3Y6/exec";

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mobile;
}

// ── Images ──────────────────────────────────────────────────────────────────
const HERO_IMG = "/assets/Hero-image.png";
const HAT_IMG = "/assets/mesh5.webp";
const MESH_1 = "/assets/mesh1.png";
const MESH_2 = "/assets/mesh2.webp";
const MESH_3 = "/assets/mesh3.png";
const MESH_4 = "/assets/mesh4.webp";
const MESH_5 = "/assets/mesh5.webp";

const MESH_VARIANTS = [
  { name: "Beige", img: MESH_5, hex: "#D4B896" },
  { name: "Blanc", img: MESH_3, hex: "#F5F5F5" },
  { name: "Noir", img: MESH_2, hex: "#1A1A1A" },
  { name: "Marron", img: MESH_4, hex: "#5C3A21" },
  { name: "Rouge", img: MESH_1, hex: "#B81D24" },
];

const BANGLES_IMG = "/assets/bangles-bracelets.jpg";
const BANGLES_1 = "/assets/bangles1.jpeg";
const BANGLES_2 = "/assets/bangles2.jpeg";
const BANGLES_3 = "/assets/bangles3.jpeg";
const BANGLES_4 = "/assets/bangles4.jpeg";

const BANGLE_VARIANTS = [
  { name: "Beige", img: BANGLES_1, hex: "#E7D8C9" },
  { name: "Ambre", img: BANGLES_2, hex: "#B86B35" },
  { name: "Marron", img: BANGLES_3, hex: "#3A261D" },
  { name: "Rouge", img: BANGLES_4, hex: "#8F1D2C" },
];

const BRACELET_IMG = "/assets/pandora-bracelets.jpg";
const PANDORA_1 = "/assets/pandora1.jpeg";
const PANDORA_2 = "/assets/pandora2.jpeg";
const PANDORA_3 = "/assets/pandora3.jpeg";
const PANDORA_4 = "/assets/pandora4.jpeg";

const PANDORA_VARIANTS = [
  { name: "Rose", img: PANDORA_1, hex: "#E8B4C8" },
  { name: "Bleu", img: PANDORA_2, hex: "#4A90E2" },
  { name: "Or Rose", img: PANDORA_3, hex: "#D49B8E" },
  { name: "Argent", img: PANDORA_4, hex: "#F3D5C8" },
];

const PACK_IMG = "/assets/Pack-image.jpeg";

const GALLERY_1 = "/assets/mesh5.webp";
const GALLERY_2 = "/assets/Pack-image.jpeg";
const GALLERY_3 = "/assets/bangles1.jpeg";
const GALLERY_4 = "/assets/pandora1.jpeg";

const REVIEW_1 =
  "https://images.unsplash.com/photo-1679466061812-211a6b737175?w=120&h=120&fit=crop&auto=format";
const REVIEW_2 =
  "https://images.unsplash.com/photo-1496203695688-3b8985780d6a?w=120&h=120&fit=crop&auto=format";
const REVIEW_3 =
  "https://images.unsplash.com/photo-1764179690227-af049306cd20?w=120&h=120&fit=crop&auto=format";

// ── Types ────────────────────────────────────────────────────────────────────
interface OrderState {
  product: string;
  color: string;
  quantity: number;
  braceletSet: boolean;
  braceletCharm: boolean;
  name: string;
  phone: string;
  city: string;
  address: string;
}

// ── Données FAQ ───────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Quels sont les modes de paiement acceptés ?",
    a: "Nous proposons le paiement à la livraison (PAL) dans tout le Maroc. Aucun paiement par carte préalable n'est requis — vous payez directement à la réception de votre colis.",
  },
  {
    q: "Quel est le délai de livraison ?",
    a: "Les commandes sont livrées sous 2 à 4 jours ouvrables selon votre ville. Les grandes villes (Casablanca, Rabat, Marrakech, Agadir) sont livrées sous 24 à 48 heures.",
  },
  {
    q: "Puis-je retourner ou échanger un produit ?",
    a: "Absolument. Nous acceptons les retours et échanges sous 7 jours après livraison, à condition que l'article soit dans son état et son emballage d'origine.",
  },
  {
    q: "Proposez-vous un emballage cadeau ?",
    a: "Chaque commande est expédiée dans notre emballage de luxe signature — un magnifique coffret souvenir prêt à être offert.",
  },
];

// ── Avantages ────────────────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="1.7" className="w-6 h-6">
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 3l1 18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 9h20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fait Main au Maroc",
    desc: "Artisanat d'exception confectionné à la main",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="1.7" className="w-6 h-6">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 20h18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Matériaux Premium",
    desc: "Plaqué or 18K & matières nobles",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="1.7" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Paiement à la Livraison",
    desc: "Payez uniquement à la réception",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="1.7" className="w-6 h-6">
        <rect x="1" y="3" width="15" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Livraison Express",
    desc: "Expédition sous 24h à 48h au Maroc",
  },
];

// ── Lock Body Scroll Custom Hook ──────────────────────────────────────────────
function useLockBodyScroll(isOpen: boolean = true) {
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;
      document.body.style.overflow = originalStyle.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}

// ── Modal de Prévisualisation Agrandie de Variante ────────────────────────────
function BigVariantPreviewModal({
  variant,
  onClose,
  onSelect,
  isSelected,
}: {
  variant: { category?: string; name: string; img: string } | null;
  onClose: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}) {
  useLockBodyScroll(!!variant);

  if (!variant) return null;

  return (
    <div
      className="modal-overlay flex items-center justify-center p-4"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
      }}
      onClick={onClose}
    >
      <div
        className="modal-enter relative bg-white overflow-hidden max-w-md w-full rounded-2xl shadow-2xl flex flex-col items-center p-6 text-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: "1.5px solid rgba(200, 169, 106, 0.5)",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* Bouton Fermer (X Icon) */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fermer"
          className="absolute top-3.5 right-3.5 flex items-center justify-center rounded-full transition-all cursor-pointer shadow hover:scale-110 active:scale-95"
          style={{
            width: 36,
            height: 36,
            background: "#F7F3EE",
            border: "1.5px solid rgba(17,17,17,0.18)",
            color: "#111",
            zIndex: 20,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Entête Catégorie & Nom */}
        {variant.category && (
          <p
            className="font-sans text-[0.68rem] uppercase tracking-widest font-bold mb-1"
            style={{ color: "#C8A96A" }}
          >
            {variant.category}
          </p>
        )}
        <h4 className="font-serif font-bold text-xl text-gray-900 mb-3 pr-6">
          Variante : <span style={{ color: "#C8A96A" }}>{variant.name}</span>
        </h4>

        {/* Image Agrandie */}
        <div
          className="w-full rounded-xl overflow-hidden mb-5 border border-black/10 shadow-lg bg-stone-100 relative group"
          style={{ height: 320 }}
        >
          <img
            src={variant.img}
            alt={variant.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Boutons d'Action */}
        <div className="w-full flex gap-3">
          {onSelect && (
            <button
              type="button"
              onClick={() => {
                onSelect();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl font-sans font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:brightness-110 active:scale-95"
              style={{
                background: isSelected ? "#C8A96A" : "#111111",
                color: isSelected ? "#111111" : "#FFFFFF",
              }}
            >
              {isSelected ? "✓ Variante Choisie" : "Choisir Cette Variante"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl font-sans font-medium text-xs uppercase tracking-wider border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all active:scale-95"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Composant Modal de Commande ───────────────────────────────────────────────
function OrderModal({
  initialProduct,
  initialColor,
  onClose,
}: {
  initialProduct?: string;
  initialColor?: string;
  onClose: () => void;
}) {
  useLockBodyScroll(true);
  const [previewVariant, setPreviewVariant] = useState<{
    category?: string;
    name: string;
    img: string;
    onSelect?: () => void;
    isSelected?: boolean;
  } | null>(null);
  const products = [
    {
      name: "Pack Exclusif (Les 3 pièces)",
      shortName: "Pack Exclusif (3 pièces)",
      price: 199,
      oldPrice: 249,
      badge: "OFFRE EXCLUSIVE",
      img: GALLERY_2,
      desc: "Bonnet + Joncs + Pandora dans un coffret cadeau de luxe",
    },
    {
      name: "Bonnet Crochet",
      shortName: "Bonnet Crochet",
      price: 165,
      badge: "TOP VENTE",
      img: MESH_5,
      desc: "Fibres naturelles tissées à la main",
    },
    {
      name: "Bracelets Joncs (Bangles)",
      shortName: "Bracelets Joncs",
      price: 59,
      badge: "RÉSINE & NACRE ARTISANALE",
      img: BANGLES_1,
      desc: "Set de bangles artisanaux aux teintes nacrées et marbrées",
    },
    {
      name: "Bracelets Pandora",
      shortName: "Bracelets Pandora",
      price: 69,
      badge: "ÉDITION LIMITÉE",
      img: PANDORA_1,
      desc: "Orné de breloques gravées à la main",
    },
  ];
  const colors: Record<string, string[]> = {
    "Bonnet Crochet": ["Beige", "Blanc", "Noir", "Marron", "Rouge"],
    "Bracelets Joncs (Bangles)": ["Beige", "Ambre", "Marron", "Rouge"],
    "Bracelets Pandora": ["Rose", "Bleu", "Or Rose", "Argent"],
    "Pack Exclusif (Les 3 pièces)": ["Beige + Or", "Blanc + Or Rose"],
  };
  const swatchColors: Record<string, string> = {
    Beige: "#D4B896",
    Blanc: "#F5F5F5",
    Noir: "#1A1A1A",
    Marron: "#5C3A21",
    Rouge: "#B81D24",
    Ambre: "#B86B35",
    Rose: "#E8B4C8",
    Bleu: "#4A90E2",
    "Or Rose": "#D49B8E",
    Argent: "#F3D5C8",
    Or: "#C8A96A",
    "Beige + Or": "linear-gradient(135deg,#D4B896 50%,#C8A96A 50%)",
    "Blanc + Or Rose": "linear-gradient(135deg,#F5F5F5 50%,#D49B8E 50%)",
  };

  const [bonnet1Color, setBonnet1Color] = useState(() => {
    if (initialColor && initialColor.includes("+")) {
      return initialColor.split("+")[0].trim();
    }
    return "Beige";
  });
  const [bonnet2Color, setBonnet2Color] = useState(() => {
    if (initialColor && initialColor.includes("+")) {
      return initialColor.split("+")[1]?.trim() || "Blanc";
    }
    return "Blanc";
  });

  const [packBonnetColor, setPackBonnetColor] = useState("Beige");
  const [packBanglesColor, setPackBanglesColor] = useState("Beige");
  const [packPandoraColor, setPackPandoraColor] = useState("Rose");

  const [braceletColors, setBraceletColors] = useState<string[]>(() => {
    if (initialColor && initialColor.includes("+")) {
      return initialColor.split("+").map((s) => s.trim());
    }
    return [initialColor || "Beige", "Ambre", "Marron", "Rouge"];
  });

  const defaultProduct = initialProduct || "Pack Exclusif (Les 3 pièces)";
  const [order, setOrder] = useState<OrderState>({
    product: defaultProduct,
    color:
      defaultProduct === "Pack Exclusif (Les 3 pièces)"
        ? `Bonnet: ${packBonnetColor} · Joncs: ${packBanglesColor} · Pandora: ${packPandoraColor}`
        : defaultProduct === "Bonnet Crochet"
        ? `${bonnet1Color} + ${bonnet2Color}`
        : initialColor || (colors[defaultProduct] ? colors[defaultProduct][0] : "Beige"),
    quantity: 1,
    braceletSet: false,
    braceletCharm: false,
    name: "",
    phone: "",
    city: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialProduct) {
      if (initialProduct === "Pack Exclusif (Les 3 pièces)") {
        setOrder((o) => ({
          ...o,
          product: initialProduct,
          color: `Bonnet: ${packBonnetColor} · Joncs: ${packBanglesColor} · Pandora: ${packPandoraColor}`,
        }));
      } else if (initialProduct === "Bonnet Crochet") {
        if (initialColor && initialColor.includes("+")) {
          const parts = initialColor.split("+");
          const c1 = parts[0].trim();
          const c2 = parts[1]?.trim() || "Blanc";
          setBonnet1Color(c1);
          setBonnet2Color(c2);
          setOrder((o) => ({ ...o, product: initialProduct, color: `${c1} + ${c2}` }));
        } else {
          setBonnet1Color("Beige");
          setBonnet2Color("Blanc");
          setOrder((o) => ({ ...o, product: initialProduct, color: "Beige + Blanc" }));
        }
      } else {
        const initC = initialColor || (colors[initialProduct] ? colors[initialProduct][0] : "Beige");
        const availC = colors[initialProduct] || [initC];
        const initList = [
          initC,
          availC[1] || initC,
          availC[2] || initC,
          availC[3] || initC,
        ];
        setBraceletColors(initList);
        setOrder((o) => ({
          ...o,
          product: initialProduct,
          color: initC,
          quantity: 1,
        }));
      }
    }
  }, [initialProduct, initialColor]);



  const updateQuantity = (newQty: number) => {
    const qty = Math.max(1, newQty);
    setOrder((o) => {
      const availColors = colors[o.product] || ["Beige Nacré"];
      const currentList = [...braceletColors];
      while (currentList.length < qty) {
        const nextC = availColors[currentList.length % availColors.length];
        currentList.push(nextC);
      }
      setBraceletColors(currentList);
      const activeColors = currentList.slice(0, qty);
      return {
        ...o,
        quantity: qty,
        color: activeColors.join(" + "),
      };
    });
  };

  const handleBraceletVariantSelect = (unitIndex: number, selectedC: string) => {
    const updated = [...braceletColors];
    updated[unitIndex] = selectedC;
    setBraceletColors(updated);
    const activeColors = updated.slice(0, order.quantity);
    setOrder((o) => ({ ...o, color: activeColors.join(" + ") }));
  };

  const currentProduct = products.find((p) => p.name === order.product) || products[0];

  const getProductImage = () => {
    if (order.product === "Bonnet Crochet") {
      const variantMap: Record<string, string> = {
        Beige: MESH_5,
        Blanc: MESH_3,
        Noir: MESH_2,
        Marron: MESH_4,
        Rouge: MESH_1,
      };
      return variantMap[bonnet1Color] || currentProduct.img;
    }
    if (order.product === "Bracelets Joncs (Bangles)") {
      const variantMap: Record<string, string> = {
        Beige: BANGLES_1,
        Ambre: BANGLES_2,
        Marron: BANGLES_3,
        Rouge: BANGLES_4,
      };
      return variantMap[order.color] || currentProduct.img;
    }
    if (order.product === "Bracelets Pandora") {
      const variantMap: Record<string, string> = {
        Rose: PANDORA_1,
        Bleu: PANDORA_2,
        "Or Rose": PANDORA_3,
        Argent: PANDORA_4,
      };
      return variantMap[order.color] || currentProduct.img;
    }
    return currentProduct.img;
  };

  const extras =
    (order.braceletSet ? 149 : 0) + (order.braceletCharm ? 99 : 0);
  const effectiveQuantity =
    order.product === "Pack Exclusif (Les 3 pièces)" || order.product === "Bonnet Crochet"
      ? 1
      : order.quantity;
  const subtotal = currentProduct.price * effectiveQuantity;
  const shippingFee = 35;
  const total = subtotal + extras + shippingFee;

  const handleSubmit = async () => {
    if (!order.name.trim() || !order.phone.trim() || !order.city.trim() || !order.address.trim()) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString("fr-FR") +
      " " +
      now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const orderId = "#LUNA-" + Math.floor(1000 + Math.random() * 9000);

    const payload = {
      orderId,
      date: formattedDate,
      name: order.name.trim(),
      phone: order.phone.trim(),
      city: order.city.trim(),
      address: order.address.trim(),
      product: order.product,
      color: order.color,
      quantity: effectiveQuantity,
      subtotal: `${subtotal} MAD`,
      total: `${total} MAD`,
      paymentMethod: "Paiement à la livraison (COD)",
      status: "⏳ En attente",
    };

    try {
      if (GOOGLE_SHEET_WEBHOOK_URL) {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const existing = JSON.parse(localStorage.getItem("luna_orders") || "[]");
      existing.push(payload);
      localStorage.setItem("luna_orders", JSON.stringify(existing));
    } catch (err) {
      console.warn("Sheet webhook notice:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-enter bg-white relative overflow-hidden"
        style={{
          borderRadius: 20,
          maxWidth: 580,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(17,17,17,0.25)",
        }}
      >
        {/* En-tête */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-5"
          style={{ borderBottom: "1px solid rgba(17,17,17,0.08)", background: "#fff" }}
        >
          <div>
            <p
              className="font-sans uppercase tracking-widest text-xs"
              style={{ color: "#C8A96A", marginBottom: 2 }}
            >
              Commande Sécurisée — PAL
            </p>
            <h3
              className="font-serif"
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111" }}
            >
              Finaliser Votre Commande
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full transition-all cursor-pointer"
            style={{
              width: 36,
              height: 36,
              border: "1.5px solid rgba(17,17,17,0.15)",
              background: "transparent",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div
              className="flex items-center justify-center rounded-full mb-6"
              style={{ width: 72, height: 72, background: "#F7F3EE" }}
            >
              <svg viewBox="0 0 32 32" fill="none" stroke="#C8A96A" strokeWidth="2" className="w-9 h-9">
                <path d="M6 16l7 7 13-13" />
              </svg>
            </div>
            <h3 className="font-serif mb-3" style={{ fontSize: "1.5rem", color: "#111" }}>
              Commande Confirmée !
            </h3>
            <p className="font-sans text-sm" style={{ color: "#8A7F74", maxWidth: 320, lineHeight: 1.7 }}>
              Merci {order.name}. Nous vous contacterons très rapidement au{" "}
              <strong>{order.phone}</strong> pour confirmer votre livraison à {order.city}.
            </p>
            <button className="btn-primary mt-8 cursor-pointer" onClick={onClose}>
              Continuer les Achats
            </button>
          </div>
        ) : (
          <div className="px-6 md:px-8 py-6 space-y-5">
            {/* Résumé du produit choisi */}
            <div
              className="p-4 rounded-xl space-y-3"
              style={{ background: "#F7F3EE", border: "1px solid rgba(200,169,106,0.25)" }}
            >
              {/* Entête Produit & Prix */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <img src={getProductImage()} alt={currentProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-semibold text-base truncate" style={{ color: "#111" }}>
                      {currentProduct.name}
                    </h4>
                    {currentProduct.oldPrice && (
                      <span className="font-num text-[0.68rem] px-2 py-0.5 font-semibold text-[#C8A96A] bg-[#C8A96A]/10 border border-[#C8A96A]/30 inline-block mt-0.5">
                        Économisez {currentProduct.oldPrice - currentProduct.price} MAD
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-price font-bold text-xl block" style={{ color: "#C8A96A" }}>
                    {currentProduct.price} MAD
                  </span>
                  {currentProduct.oldPrice && (
                    <div className="font-price text-xs line-through" style={{ color: "#8A7F74" }}>
                      {currentProduct.oldPrice} MAD
                    </div>
                  )}
                </div>
              </div>

              {/* Ligne des Couleurs choisies */}
              <div className="pt-2.5 border-t border-black/5 font-sans text-xs">
                <span className="text-[#8A7F74] uppercase tracking-wider text-[0.68rem] block mb-1 font-medium">
                  Votre Sélection :
                </span>
                {order.product === "Pack Exclusif (Les 3 pièces)" ? (
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white/90 p-1.5 rounded border border-black/5">
                      <span className="block text-[0.65rem] text-[#8A7F74] uppercase font-semibold">1. Bonnet</span>
                      <strong className="block text-[0.72rem] text-[#111] truncate">{packBonnetColor}</strong>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded border border-black/5">
                      <span className="block text-[0.65rem] text-[#8A7F74] uppercase font-semibold">2. Joncs</span>
                      <strong className="block text-[0.72rem] text-[#111] truncate">{packBanglesColor}</strong>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded border border-black/5">
                      <span className="block text-[0.65rem] text-[#8A7F74] uppercase font-semibold">3. Pandora</span>
                      <strong className="block text-[0.72rem] text-[#111] truncate">{packPandoraColor}</strong>
                    </div>
                  </div>
                ) : order.product === "Bonnet Crochet" ? (
                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="bg-white/90 p-1.5 rounded border border-black/5">
                      <span className="block text-[0.65rem] text-[#8A7F74] uppercase font-semibold">1er Bonnet</span>
                      <strong className="block text-[0.75rem] text-[#111] truncate">{bonnet1Color}</strong>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded border border-black/5">
                      <span className="block text-[0.65rem] text-[#8A7F74] uppercase font-semibold">2ème Bonnet</span>
                      <strong className="block text-[0.75rem] text-[#111] truncate">{bonnet2Color}</strong>
                    </div>
                  </div>
                 ) : order.product === "Bracelets Joncs (Bangles)" || order.product === "Bracelets Pandora" ? (
                  <div className="flex gap-2 flex-wrap text-center pt-1">
                    {order.color.split("+").map((col, idx) => (
                      <div key={idx} className="bg-white/90 p-1.5 rounded border border-black/5 flex-1 min-w-[90px]">
                        <span className="block text-[0.65rem] text-[#8A7F74] uppercase font-semibold">
                          {order.quantity > 1 ? `${idx + 1}${idx === 0 ? "er" : "ème"} Bracelet` : "Couleur"}
                        </span>
                        <strong className="block text-[0.72rem] text-[#111] truncate">{col.trim()}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="font-semibold text-[#111] bg-white/90 px-2.5 py-1 rounded inline-block border border-black/5">
                    {order.color}
                  </span>
                )}
              </div>
            </div>

            {/* Sélection de couleur / variante */}
            {colors[order.product] && (
              <div className="text-center">
                {order.product === "Pack Exclusif (Les 3 pièces)" ? (
                  <div className="space-y-4 text-center">
                    <p className="font-sans text-[0.7rem] uppercase tracking-wider text-[#C8A96A] font-semibold">
                      Cliquez sur une variante pour la choisir & l'agrandir 🔍
                    </p>
                    {/* 1. Bonnet Crochet */}
                    <div>
                      <label
                        className="font-sans uppercase tracking-widest text-xs block mb-2 font-medium text-center"
                        style={{ color: "#8A7F74" }}
                      >
                        1. Bonnet Crochet — <span style={{ color: "#111", textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>{packBonnetColor}</span>
                      </label>
                      <div className="flex gap-2.5 justify-center flex-wrap pb-1">
                        {colors["Bonnet Crochet"].map((c) => {
                          const bonnetImgMap: Record<string, string> = {
                            Beige: MESH_5,
                            Blanc: MESH_3,
                            Noir: MESH_2,
                            Marron: MESH_4,
                            Rouge: MESH_1,
                          };
                          const isSelected = packBonnetColor === c;
                          const img = bonnetImgMap[c] || MESH_5;
                          return (
                            <button
                              key={`p-b-${c}`}
                              title={`Bonnet : ${c}`}
                              type="button"
                              onClick={() => {
                                setPackBonnetColor(c);
                                setOrder((o) => ({ ...o, color: `Bonnet: ${c} · Joncs: ${packBanglesColor} · Pandora: ${packPandoraColor}` }));
                                setPreviewVariant({
                                  category: "1. Bonnet Crochet",
                                  name: c,
                                  img: img,
                                  onSelect: () => {
                                    setPackBonnetColor(c);
                                    setOrder((o) => ({ ...o, color: `Bonnet: ${c} · Joncs: ${packBanglesColor} · Pandora: ${packPandoraColor}` }));
                                  },
                                  isSelected: true,
                                });
                              }}
                              className="relative flex-shrink-0 cursor-pointer transition-all duration-200 group"
                              style={{
                                width: 52,
                                height: 52,
                                border: isSelected ? "2px solid #C8A96A" : "1px solid rgba(17,17,17,0.15)",
                                boxShadow: isSelected ? "0 0 12px rgba(200,169,106,0.35)" : "none",
                                padding: 2,
                                background: "#FFF",
                                borderRadius: 8,
                              }}
                            >
                              <img src={img} alt={c} className="w-full h-full object-cover rounded-md" />
                              <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                              </span>
                              {isSelected && (
                                <div
                                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full"
                                  style={{ width: 16, height: 16, background: "#C8A96A", color: "#111" }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Bracelets Joncs */}
                    <div>
                      <label
                        className="font-sans uppercase tracking-widest text-xs block mb-2 font-medium text-center"
                        style={{ color: "#8A7F74" }}
                      >
                        2. Bracelets Joncs (3 Bangles) — <span style={{ color: "#111", textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>{packBanglesColor}</span>
                      </label>
                      <div className="flex gap-2.5 justify-center flex-wrap pb-1">
                        {colors["Bracelets Joncs (Bangles)"].map((c) => {
                          const bangleImgMap: Record<string, string> = {
                            Beige: BANGLES_1,
                            Ambre: BANGLES_2,
                            Marron: BANGLES_3,
                            Rouge: BANGLES_4,
                          };
                          const isSelected = packBanglesColor === c;
                          const img = bangleImgMap[c] || BANGLES_1;
                          return (
                            <button
                              key={`p-j-${c}`}
                              title={`Joncs : ${c}`}
                              type="button"
                              onClick={() => {
                                setPackBanglesColor(c);
                                setOrder((o) => ({ ...o, color: `Bonnet: ${packBonnetColor} · Joncs: ${c} · Pandora: ${packPandoraColor}` }));
                                setPreviewVariant({
                                  category: "2. Bracelets Joncs (3 Bangles)",
                                  name: c,
                                  img: img,
                                  onSelect: () => {
                                    setPackBanglesColor(c);
                                    setOrder((o) => ({ ...o, color: `Bonnet: ${packBonnetColor} · Joncs: ${c} · Pandora: ${packPandoraColor}` }));
                                  },
                                  isSelected: true,
                                });
                              }}
                              className="relative flex-shrink-0 cursor-pointer transition-all duration-200 group"
                              style={{
                                width: 52,
                                height: 52,
                                border: isSelected ? "2px solid #C8A96A" : "1px solid rgba(17,17,17,0.15)",
                                boxShadow: isSelected ? "0 0 12px rgba(200,169,106,0.35)" : "none",
                                padding: 2,
                                background: "#FFF",
                                borderRadius: 8,
                              }}
                            >
                              <img src={img} alt={c} className="w-full h-full object-cover rounded-md" />
                              <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                              </span>
                              {isSelected && (
                                <div
                                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full"
                                  style={{ width: 16, height: 16, background: "#C8A96A", color: "#111" }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Bracelet Style Pandora */}
                    <div>
                      <label
                        className="font-sans uppercase tracking-widest text-xs block mb-2 font-medium text-center"
                        style={{ color: "#8A7F74" }}
                      >
                        3. Bracelet Style Pandora — <span style={{ color: "#111", textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>{packPandoraColor}</span>
                      </label>
                      <div className="flex gap-2.5 justify-center flex-wrap pb-1">
                        {colors["Bracelets Pandora"].map((c) => {
                          const pandoraImgMap: Record<string, string> = {
                            Rose: PANDORA_1,
                            Bleu: PANDORA_2,
                            "Or Rose": PANDORA_3,
                            Argent: PANDORA_4,
                          };
                          const isSelected = packPandoraColor === c;
                          const img = pandoraImgMap[c] || PANDORA_1;
                          return (
                            <button
                              key={`p-p-${c}`}
                              title={`Pandora : ${c}`}
                              type="button"
                              onClick={() => {
                                setPackPandoraColor(c);
                                setOrder((o) => ({ ...o, color: `Bonnet: ${packBonnetColor} · Joncs: ${packBanglesColor} · Pandora: ${c}` }));
                                setPreviewVariant({
                                  category: "3. Bracelet Style Pandora",
                                  name: c,
                                  img: img,
                                  onSelect: () => {
                                    setPackPandoraColor(c);
                                    setOrder((o) => ({ ...o, color: `Bonnet: ${packBonnetColor} · Joncs: ${packBanglesColor} · Pandora: ${c}` }));
                                  },
                                  isSelected: true,
                                });
                              }}
                              className="relative flex-shrink-0 cursor-pointer transition-all duration-200 group"
                              style={{
                                width: 52,
                                height: 52,
                                border: isSelected ? "2px solid #C8A96A" : "1px solid rgba(17,17,17,0.15)",
                                boxShadow: isSelected ? "0 0 12px rgba(200,169,106,0.35)" : "none",
                                padding: 2,
                                background: "#FFF",
                                borderRadius: 8,
                              }}
                            >
                              <img src={img} alt={c} className="w-full h-full object-cover rounded-md" />
                              <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                              </span>
                              {isSelected && (
                                <div
                                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full"
                                  style={{ width: 16, height: 16, background: "#C8A96A", color: "#111" }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : order.product === "Bonnet Crochet" ? (
                  <div className="space-y-4 text-center">
                    <p className="font-sans text-[0.7rem] uppercase tracking-wider text-[#C8A96A] font-semibold">
                      Cliquez sur une variante pour la choisir & l'agrandir 🔍
                    </p>
                    {/* 1er Bonnet */}
                    <div>
                      <label
                        className="font-sans uppercase tracking-widest text-xs block mb-2 font-medium text-center"
                        style={{ color: "#8A7F74" }}
                      >
                        1er Bonnet — <span style={{ color: "#111", textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>{bonnet1Color}</span>
                      </label>
                      <div className="flex gap-2.5 justify-center overflow-x-auto pb-1">
                        {colors["Bonnet Crochet"].map((c) => {
                          const bonnetImgMap: Record<string, string> = {
                            Beige: MESH_5,
                            Blanc: MESH_3,
                            Noir: MESH_2,
                            Marron: MESH_4,
                            Rouge: MESH_1,
                          };
                          const isSelected = bonnet1Color === c;
                          const img = bonnetImgMap[c] || MESH_5;
                          return (
                            <button
                              key={`m-b1-${c}`}
                              title={`1er Bonnet : ${c}`}
                              type="button"
                              onClick={() => {
                                setBonnet1Color(c);
                                setOrder((o) => ({ ...o, color: `${c} + ${bonnet2Color}` }));
                                setPreviewVariant({
                                  category: "1er Bonnet Crochet",
                                  name: c,
                                  img: img,
                                  onSelect: () => {
                                    setBonnet1Color(c);
                                    setOrder((o) => ({ ...o, color: `${c} + ${bonnet2Color}` }));
                                  },
                                  isSelected: true,
                                });
                              }}
                              className="relative flex-shrink-0 cursor-pointer transition-all duration-200 group"
                              style={{
                                width: 52,
                                height: 52,
                                border: isSelected ? "2px solid #C8A96A" : "1px solid rgba(17,17,17,0.15)",
                                boxShadow: isSelected ? "0 0 12px rgba(200,169,106,0.35)" : "none",
                                padding: 2,
                                background: "#FFF",
                                borderRadius: 8,
                              }}
                            >
                              <img src={img} alt={c} className="w-full h-full object-cover rounded-md" />
                              <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                              </span>
                              {isSelected && (
                                <div
                                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full"
                                  style={{ width: 16, height: 16, background: "#C8A96A", color: "#111" }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2ème Bonnet */}
                    <div>
                      <label
                        className="font-sans uppercase tracking-widest text-xs block mb-2 font-medium text-center"
                        style={{ color: "#8A7F74" }}
                      >
                        2ème Bonnet — <span style={{ color: "#111", textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>{bonnet2Color}</span>
                      </label>
                      <div className="flex gap-2.5 justify-center overflow-x-auto pb-1">
                        {colors["Bonnet Crochet"].map((c) => {
                          const bonnetImgMap: Record<string, string> = {
                            Beige: MESH_5,
                            Blanc: MESH_3,
                            Noir: MESH_2,
                            Marron: MESH_4,
                            Rouge: MESH_1,
                          };
                          const isSelected = bonnet2Color === c;
                          const img = bonnetImgMap[c] || MESH_3;
                          return (
                            <button
                              key={`m-b2-${c}`}
                              title={`2ème Bonnet : ${c}`}
                              type="button"
                              onClick={() => {
                                setBonnet2Color(c);
                                setOrder((o) => ({ ...o, color: `${bonnet1Color} + ${c}` }));
                                setPreviewVariant({
                                  category: "2ème Bonnet Crochet",
                                  name: c,
                                  img: img,
                                  onSelect: () => {
                                    setBonnet2Color(c);
                                    setOrder((o) => ({ ...o, color: `${bonnet1Color} + ${c}` }));
                                  },
                                  isSelected: true,
                                });
                              }}
                              className="relative flex-shrink-0 cursor-pointer transition-all duration-200 group"
                              style={{
                                width: 52,
                                height: 52,
                                border: isSelected ? "2px solid #C8A96A" : "1px solid rgba(17,17,17,0.15)",
                                boxShadow: isSelected ? "0 0 12px rgba(200,169,106,0.35)" : "none",
                                padding: 2,
                                background: "#FFF",
                                borderRadius: 8,
                              }}
                            >
                              <img src={img} alt={c} className="w-full h-full object-cover rounded-md" />
                              <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                              </span>
                              {isSelected && (
                                <div
                                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full"
                                  style={{ width: 16, height: 16, background: "#C8A96A", color: "#111" }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <p className="font-sans text-[0.7rem] uppercase tracking-wider text-[#C8A96A] font-semibold">
                      Cliquez sur une variante pour la choisir & l'agrandir 🔍
                    </p>
                    {Array.from({ length: order.quantity }).map((_, index) => {
                      const currentSelected = braceletColors[index] || colors[order.product]?.[0] || "Beige";
                      const labelText =
                        order.quantity > 1
                          ? `${index + 1}${index === 0 ? "er" : "ème"} Bracelet`
                          : "Couleur / Variante";

                      return (
                        <div key={`b-unit-${index}`}>
                          <label
                            className="font-sans uppercase tracking-widest text-xs block mb-2 font-medium text-center"
                            style={{ color: "#8A7F74" }}
                          >
                            {labelText} —{" "}
                            <span style={{ color: "#111", textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>
                              {currentSelected}
                            </span>
                          </label>
                          <div className="flex gap-2.5 justify-center flex-wrap pb-1">
                            {colors[order.product]?.map((c) => {
                              const isBangles = order.product === "Bracelets Joncs (Bangles)";
                              const isPandora = order.product === "Bracelets Pandora";
                              const bangleImgMap: Record<string, string> = {
                                Beige: BANGLES_1,
                                Ambre: BANGLES_2,
                                Marron: BANGLES_3,
                                Rouge: BANGLES_4,
                              };
                              const pandoraImgMap: Record<string, string> = {
                                Rose: PANDORA_1,
                                Bleu: PANDORA_2,
                                "Or Rose": PANDORA_3,
                                Argent: PANDORA_4,
                              };
                              const imgUrl = isBangles ? bangleImgMap[c] : isPandora ? pandoraImgMap[c] : null;
                              const isSelected = currentSelected === c;

                              if (imgUrl) {
                                return (
                                  <button
                                    key={`b-${index}-${c}`}
                                    title={`${labelText} : ${c}`}
                                    type="button"
                                    onClick={() => {
                                      handleBraceletVariantSelect(index, c);
                                      setPreviewVariant({
                                        category: order.product,
                                        name: c,
                                        img: imgUrl,
                                        onSelect: () => handleBraceletVariantSelect(index, c),
                                        isSelected: true,
                                      });
                                    }}
                                    className="relative flex-shrink-0 cursor-pointer transition-all duration-200 group"
                                    style={{
                                      width: 52,
                                      height: 52,
                                      border: isSelected ? "2px solid #C8A96A" : "1px solid rgba(17,17,17,0.15)",
                                      boxShadow: isSelected ? "0 0 12px rgba(200,169,106,0.35)" : "none",
                                      padding: 2,
                                      background: "#FFF",
                                      borderRadius: 8,
                                    }}
                                  >
                                    <img src={imgUrl} alt={c} className="w-full h-full object-cover rounded-md" />
                                    <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                      </svg>
                                    </span>
                                    {isSelected && (
                                      <div
                                        className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full"
                                        style={{ width: 16, height: 16, background: "#C8A96A", color: "#111" }}
                                      >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
                                          <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                      </div>
                                    )}
                                  </button>
                                );
                              }
                              return (
                                <button
                                  key={`b-${index}-${c}`}
                                  title={c}
                                  type="button"
                                  onClick={() => handleBraceletVariantSelect(index, c)}
                                  className={`color-swatch ${isSelected ? "active" : ""}`}
                                  style={{ background: swatchColors[c] || "#ccc" }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Quantité (Seulement pour produits individuels : Bangles & Pandora) */}
            {order.product !== "Pack Exclusif (Les 3 pièces)" && order.product !== "Bonnet Crochet" && (
              <div>
                <label
                  className="font-sans uppercase tracking-widest text-xs block mb-2.5 font-medium text-center"
                  style={{ color: "#8A7F74" }}
                >
                  Quantité
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    className="qty-btn cursor-pointer"
                    onClick={() => updateQuantity(order.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="font-price text-xl font-bold" style={{ minWidth: 24, textAlign: "center" }}>
                    {order.quantity}
                  </span>
                  <button
                    type="button"
                    className="qty-btn cursor-pointer"
                    onClick={() => updateQuantity(order.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Séparateur */}
            <div style={{ borderTop: "1px solid rgba(17,17,17,0.07)" }} />

            {/* Informations de livraison COD */}
            <div>
              <label
                className="font-sans uppercase tracking-widest text-xs block mb-3 text-center font-medium"
                style={{ color: "#8A7F74" }}
              >
                Informations de Livraison (Paiement à la livraison)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <input
                    className="form-input"
                    placeholder="Nom Complet *"
                    value={order.name}
                    onChange={(e) => setOrder((o) => ({ ...o, name: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <input
                    className="form-input"
                    placeholder="Numéro de Téléphone *"
                    type="tel"
                    value={order.phone}
                    onChange={(e) => setOrder((o) => ({ ...o, phone: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <input
                    className="form-input"
                    placeholder="Ville *"
                    value={order.city}
                    onChange={(e) => setOrder((o) => ({ ...o, city: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <input
                    className="form-input"
                    placeholder="Adresse de Livraison *"
                    value={order.address}
                    onChange={(e) => setOrder((o) => ({ ...o, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Récapitulatif de Commande */}
            <div
              className="rounded-xl p-4 space-y-2.5"
              style={{
                background: "#F7F3EE",
                border: "1px solid rgba(200,169,106,0.25)",
              }}
            >
              <div className="flex items-center justify-between text-xs font-sans" style={{ color: "#5A524A" }}>
                <span>Sous-total produit</span>
                <span className="font-price font-semibold" style={{ color: "#111" }}>{subtotal} MAD</span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans" style={{ color: "#5A524A" }}>
                <span>Frais de Livraison</span>
                <span className="font-price font-semibold" style={{ color: "#C8A96A" }}>+35 DH</span>
              </div>
              <div
                className="flex items-center justify-between font-sans pt-2 mt-2 gap-2"
                style={{ borderTop: "1px dashed rgba(17,17,17,0.15)", fontWeight: 700 }}
              >
                <span className="text-sm" style={{ color: "#111" }}>Total à Payer (à la livraison)</span>
                <span className="font-price text-xl font-bold whitespace-nowrap" style={{ color: "#C8A96A" }}>
                  {total} MAD
                </span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-sans text-center font-medium bg-red-50 py-2 px-3 rounded-lg border border-red-200">
                {errorMsg}
              </p>
            )}

            {/* Bouton de confirmation */}
            <button
              type="button"
              disabled={isSubmitting}
              className="w-full cursor-pointer text-center font-sans font-semibold uppercase tracking-wider transition-all duration-300 hover:brightness-125 active:scale-[0.98] disabled:opacity-60"
              style={{
                borderRadius: 10,
                padding: "16px 20px",
                fontSize: "0.9rem",
                background: "#111111",
                color: "#F7F3EE",
                boxShadow: "0 8px 24px rgba(17,17,17,0.2)",
                border: "none",
              }}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-[#C8A96A]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  ENREGISTREMENT EN COURS...
                </span>
              ) : (
                `CONFIRMER LA COMMANDE — ${total} MAD`
              )}
            </button>
          </div>
        )}
      </div>

      <BigVariantPreviewModal
        variant={previewVariant}
        onClose={() => setPreviewVariant(null)}
        onSelect={previewVariant?.onSelect}
        isSelected={previewVariant?.isSelected}
      />
    </div>
  );
}

// ── Élément FAQ ───────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item py-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left gap-6"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <span
          className="font-serif"
          style={{ fontSize: "1.05rem", color: "#111", fontWeight: 500 }}
        >
          {q}
        </span>
        <span
          className="transition-transform duration-300 flex-shrink-0"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: "#C8A96A",
            fontSize: "1.5rem",
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          className="font-sans mt-4 animate-fade-up"
          style={{ color: "#8A7F74", lineHeight: 1.8, fontSize: "0.95rem" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}
// ── Composant Section Produit Individuelle (Landing Page Mini-Page) ─────────────
interface ProductSectionProps {
  id: string;
  badge: string;
  subtitle: string;
  title: string;
  price: string;
  oldPrice?: string;
  savingBadge?: string;
  description: string;
  bullets?: string[];
  mainImg: string;
  colorsList: string[];
  swatchColors: Record<string, string>;
  fullName: string;
  reverseLayout?: boolean;
  isSpecial?: boolean;
  isMobile: boolean;
  imageVariants?: { name: string; img: string; hex?: string }[];
  onOrder: (productName: string, color: string) => void;
}

function ProductSection({
  id,
  badge,
  subtitle,
  title,
  price,
  oldPrice,
  savingBadge,
  description,
  bullets,
  mainImg,
  colorsList,
  swatchColors,
  fullName,
  reverseLayout = false,
  isSpecial = false,
  isMobile,
  imageVariants,
  onOrder,
}: ProductSectionProps) {
  const [selectedColor, setSelectedColor] = useState(colorsList[0]);
  const [currentMainImg, setCurrentMainImg] = useState(mainImg);
  const [bonnetColor, setBonnetColor] = useState("Beige");
  const [banglesColor, setBanglesColor] = useState("Beige");
  const [pandoraColor, setPandoraColor] = useState("Rose");
  const [bonnetColor1, setBonnetColor1] = useState("Beige");
  const [bonnetColor2, setBonnetColor2] = useState("Blanc");
  const [previewVariant, setPreviewVariant] = useState<{
    category?: string;
    name: string;
    img: string;
    onSelect?: () => void;
    isSelected?: boolean;
  } | null>(null);

  useEffect(() => {
    setCurrentMainImg(mainImg);
  }, [mainImg]);

  const packItemsVariants = [
    {
      category: "1. Bonnet Crochet",
      selected: bonnetColor,
      setSelected: setBonnetColor,
      variants: [
        { name: "Beige", img: MESH_5 },
        { name: "Blanc", img: MESH_3 },
        { name: "Noir", img: MESH_2 },
        { name: "Marron", img: MESH_4 },
        { name: "Rouge", img: MESH_1 },
      ],
    },
    {
      category: "2. Bracelets Joncs (3 Bangles)",
      selected: banglesColor,
      setSelected: setBanglesColor,
      variants: [
        { name: "Beige", img: BANGLES_1 },
        { name: "Ambre", img: BANGLES_2 },
        { name: "Marron", img: BANGLES_3 },
        { name: "Rouge", img: BANGLES_4 },
      ],
    },
    {
      category: "3. Bracelet Style Pandora",
      selected: pandoraColor,
      setSelected: setPandoraColor,
      variants: [
        { name: "Rose", img: PANDORA_1 },
        { name: "Bleu", img: PANDORA_2 },
        { name: "Or Rose", img: PANDORA_3 },
        { name: "Argent", img: PANDORA_4 },
      ],
    },
  ];

  const finalOrderColor = isSpecial
    ? `Bonnet: ${bonnetColor} · Joncs: ${banglesColor} · Pandora: ${pandoraColor}`
    : fullName === "Bonnet Crochet"
    ? `${bonnetColor1} + ${bonnetColor2}`
    : selectedColor;

  return (
    <section
      id={id}
      style={{
        padding: isMobile ? "36px 16px" : "60px 40px",
        scrollMarginTop: 118,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            background: isSpecial ? "#111111" : "#FFFFFF",
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: isSpecial
              ? "0 24px 70px rgba(17,17,17,0.35), 0 0 0 1.5px #C8A96A"
              : "0 12px 48px rgba(17,17,17,0.06)",
            border: isSpecial ? "1.5px solid #C8A96A" : "1px solid rgba(17,17,17,0.07)",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          }}
        >
          {/* Illustration visuelle */}
          <div
            style={{
              position: "relative",
              minHeight: isMobile ? 340 : 540,
              background: isSpecial ? "#1A1918" : "#E8E2D9",
              order: reverseLayout && !isMobile ? 2 : 1,
            }}
          >
            <img
              src={currentMainImg}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 0.3s ease-in-out",
              }}
            />
            <span
              className="font-sans absolute top-6 left-6"
              style={{
                background: "#C8A96A",
                color: "#111111",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 0,
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              }}
            >
              {badge}
            </span>
          </div>

          {/* Présentation du produit */}
          <div
            style={{
              padding: isMobile ? "36px 24px" : "52px 56px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              order: reverseLayout && !isMobile ? 1 : 2,
            }}
          >
            {/* En-tête Produit */}
            <p
              className="font-sans uppercase tracking-[0.2em] text-[0.7rem] font-semibold mb-2"
              style={{ color: "#C8A96A" }}
            >
              {isSpecial ? "COFFRET SIGNATURE · 3 PIÈCES" : subtitle}
            </p>
            <h2
              className="font-serif mb-3"
              style={{
                fontSize: isMobile
                  ? "clamp(1.05rem, 5.2vw, 1.55rem)"
                  : "clamp(1.9rem, 3.5vw, 2.7rem)",
                color: isSpecial ? "#FFFFFF" : "#111111",
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                whiteSpace: isMobile ? "nowrap" : "normal",
              }}
            >
              {title}
            </h2>

            {/* Prix & Économies */}
            <div className="flex items-center gap-3.5 mb-5 flex-wrap">
              <span
                className="font-price font-bold text-3xl md:text-4xl"
                style={{ color: isSpecial ? "#C8A96A" : "#111111" }}
              >
                {price}
              </span>
              {oldPrice && (
                <span
                  className="font-price text-base line-through"
                  style={{ color: isSpecial ? "rgba(255,255,255,0.4)" : "#8A7F74" }}
                >
                  {oldPrice}
                </span>
              )}
              {isSpecial ? (
                <span
                  className="font-num text-xs px-2 py-0.5 font-semibold tracking-wider"
                  style={{
                    background: "rgba(200,169,106,0.15)",
                    color: "#C8A96A",
                    border: "1px solid rgba(200,169,106,0.3)",
                    borderRadius: 0,
                  }}
                >
                  -19%
                </span>
              ) : (
                savingBadge && (
                  <span
                    className="font-num text-xs px-3 py-1 font-semibold tracking-wider"
                    style={{
                      background: "rgba(200,169,106,0.15)",
                      color: "#C8A96A",
                      border: "1px solid #C8A96A",
                      borderRadius: 0,
                    }}
                  >
                    {savingBadge}
                  </span>
                )
              )}
            </div>

            {/* Variantes de Couleurs / Selection Pack */}
            {isSpecial ? (
              <div className="mb-6 space-y-4 w-full">
                <div
                  className="p-4 transition-all text-left rounded-lg"
                  style={{
                    background: "rgba(200,169,106,0.08)",
                    border: "1px solid rgba(200,169,106,0.25)",
                  }}
                >
                  <span
                    className="font-sans uppercase tracking-widest text-[0.68rem] font-semibold block mb-2"
                    style={{ color: "#C8A96A" }}
                  >
                    ARTICLES INCLUS DANS LE PACK (CHOIX DES COULEURS À L'ÉTAPE SUIVANTE)
                  </span>
                  <ul className="space-y-1.5 font-sans text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                    <li className="flex items-center gap-2">
                      <span style={{ color: "#C8A96A" }}>✓</span> 1x Bonnet Crochet Fait Main
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: "#C8A96A" }}>✓</span> 1x Set de 3 Bracelets Joncs (Bangles)
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: "#C8A96A" }}>✓</span> 1x Bracelet Élégant Style Pandora
                    </li>
                  </ul>
                </div>
              </div>
            ) : imageVariants && imageVariants.length > 0 ? (
              <div className="mb-6 w-full text-center">
                <p
                  className="font-sans text-xs uppercase tracking-widest mb-3 text-center"
                  style={{ color: "#8A7F74", fontSize: "0.68rem" }}
                >
                  Variante Choisie :{" "}
                  <span
                    style={{
                      color: "#111",
                      textTransform: "none",
                      letterSpacing: 0,
                      fontWeight: 600,
                    }}
                  >
                    {selectedColor}
                  </span>
                </p>
                <div className="flex gap-2.5 justify-center flex-wrap max-w-full mx-auto pb-1">
                  {imageVariants.map((v) => {
                    const isSelected = selectedColor === v.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => {
                          setSelectedColor(v.name);
                          setCurrentMainImg(v.img);
                        }}
                        title={v.name}
                        className="relative flex-shrink-0 cursor-pointer transition-all duration-200"
                        style={{
                          width: isMobile ? 54 : 64,
                          height: isMobile ? 54 : 64,
                          border: isSelected ? "2px solid #C8A96A" : "1px solid rgba(17,17,17,0.15)",
                          boxShadow: isSelected ? "0 0 14px rgba(200,169,106,0.35)" : "none",
                          transform: isSelected ? "scale(1.05)" : "scale(1)",
                          padding: 2,
                          background: "#FFF",
                          borderRadius: 0,
                        }}
                      >
                        <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div
                            className="absolute -top-1.5 -right-1.5 flex items-center justify-center"
                            style={{
                              width: 16,
                              height: 16,
                              background: "#C8A96A",
                              color: "#111",
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mb-6 w-full text-center">
                <p
                  className="font-sans text-xs uppercase tracking-widest mb-2.5 text-center"
                  style={{ color: "#8A7F74", fontSize: "0.68rem" }}
                >
                  Couleur Choisie :{" "}
                  <span
                    style={{
                      color: "#111",
                      textTransform: "none",
                      letterSpacing: 0,
                      fontWeight: 600,
                    }}
                  >
                    {selectedColor}
                  </span>
                </p>
                <div className="flex gap-3 justify-center">
                  {colorsList.map((c) => (
                    <button
                      key={c}
                      title={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`color-swatch ${selectedColor === c ? "active" : ""}`}
                      style={{ background: swatchColors[c] || "#ccc", width: 32, height: 32 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description Détaillée */}
            {!isSpecial && (
              <p
                className="font-sans mb-6 text-sm"
                style={{ color: "#5A524A", lineHeight: 1.75 }}
              >
                {description.includes("inoxydable") ? (
                  <>
                    {description.split(/(inoxydable)/i).map((part, idx) =>
                      part.toLowerCase() === "inoxydable" ? (
                        <span key={idx} style={{ color: "#C8A96A", fontWeight: 600 }}>
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </>
                ) : (
                  description
                )}
              </p>
            )}

            {/* Bouton CTA */}
            {isSpecial ? (
              <div className="space-y-3 w-full flex flex-col items-center">
                <button
                  className="w-full max-w-md cursor-pointer text-center font-sans font-semibold uppercase tracking-[0.14em] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                  style={{
                    padding: "18px 24px",
                    fontSize: "0.9rem",
                    borderRadius: 4,
                    background: "#C8A96A",
                    color: "#111111",
                    border: "none",
                    boxShadow: "0 8px 25px rgba(200,169,106,0.25)",
                  }}
                  onClick={() => onOrder(fullName, finalOrderColor)}
                >
                  COMMANDER MON COFFRET — {price}
                </button>
                <p className="font-sans text-xs text-center" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Paiement à la livraison
                </p>
              </div>
            ) : (
              <div className="w-full flex justify-center text-center">
                <button
                  className="cursor-pointer text-center font-sans font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 mx-auto"
                  style={{
                    padding: isMobile ? "16px 20px" : "16px 36px",
                    fontSize: "0.875rem",
                    borderRadius: 0,
                    width: "100%",
                    maxWidth: 380,
                    background: "#111111",
                    color: "#F7F3EE",
                    border: "1.5px solid #111111",
                  }}
                  onClick={() => onOrder(fullName, finalOrderColor)}
                >
                  Commander Maintenant — {price}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



// ── Composant Slider Avant/Après ("Get The Sets") ─────────────────────────────
function ImageCompareSlider({ isMobile = false }: { isMobile?: boolean }) {
  const leftImg = "/assets/befor-image.jpeg";
  const rightImg = "/assets/after-image.jpeg";

  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateWidth);
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 3) percentage = 3;
    if (percentage > 97) percentage = 97;
    setSliderPos(percentage);
  }, []);

  // Touch handlers directly on container with passive: false to block default browser page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      setIsDragging(false);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [handleMove]);

  // Window mouse drag handlers
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <section id="story" style={{ padding: isMobile ? "40px 16px" : "80px 40px", scrollMarginTop: 118 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* En-tête : Get The Sets */}
        <div className="text-center mb-8">
          <h2
            className="font-serif text-center"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              color: "#111",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Get The Sets
          </h2>
          <div className="divider mt-4 mx-auto" />
        </div>

        {/* Cadre du Slider Avant/Après */}
        <div
          ref={containerRef}
          className="relative overflow-hidden select-none cursor-ew-resize"
          style={{
            height: isMobile ? 380 : 580,
            borderRadius: 0,
            boxShadow: "0 20px 60px rgba(17,17,17,0.12)",
            border: "1px solid rgba(17,17,17,0.08)",
            background: "#E8E2D9",
            touchAction: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
            containerType: "inline-size",
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
        >
          {/* Image Arrière-plan (Droites) */}
          <img
            src={rightImg}
            alt="Get The Sets — Pack Exclusif"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />

          {/* Image Coupée (Gauche) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${sliderPos}%`,
              overflow: "hidden",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <img
              src={leftImg}
              alt="Get The Sets — Ensemble Luxe"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: containerWidth ? `${containerWidth}px` : "100cqw",
                maxWidth: "none",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Ligne de séparation verticale & Poignée interactive */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sliderPos}%`,
              transform: "translateX(-50%)",
              width: 2,
              background: "#FFFFFF",
              boxShadow: "0 0 12px rgba(0,0,0,0.6)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Poignée circulaire avec flèches < > */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform"
              style={{
                width: 44,
                height: 44,
                background: "#FFFFFF",
                border: "2.5px solid #C8A96A",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                color: "#111",
                cursor: "ew-resize",
                transform: isDragging ? "translate(-50%, -50%) scale(1.1)" : "translate(-50%, -50%)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="2.4" className="w-5 h-5">
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Modal de Sélection de Produit (Bouton Navbar Commander) ─────────────────
function ProductNavSelectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const productsList = [
    {
      id: "bundle",
      name: "Pack Exclusif (Les 3 pièces)",
      badge: "OFFRE EXCLUSIVE",
      price: "199 MAD",
      oldPrice: "249 MAD",
      img: "/assets/Pack-image.jpeg",
      targetId: "bundle",
    },
    {
      id: "bonnet",
      name: "Bonnet Crochet Premium",
      badge: "TOP VENTE",
      price: "165 MAD",
      img: MESH_5,
      targetId: "product-bonnet",
    },
    {
      id: "bangles",
      name: "Bracelets Joncs (Bangles)",
      badge: "RÉSINE & NACRE ARTISANALE",
      price: "59 MAD",
      img: BANGLES_1,
      targetId: "product-bangles",
    },
    {
      id: "pandora",
      name: "Bracelets Style Pandora",
      badge: "ÉDITION LIMITÉE",
      price: "69 MAD",
      img: PANDORA_1,
      targetId: "product-pandora",
    },
  ];

  const handleSelect = (targetId: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in"
      style={{ zIndex: 1000, background: "rgba(17,17,17,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-lg overflow-hidden animate-scale-up"
        style={{
          background: "#FFF",
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* En-tête */}
        <div
          className="flex items-center justify-between p-5 md:p-6"
          style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}
        >
          <div>
            <span
              className="font-sans text-xs uppercase tracking-widest"
              style={{ color: "#C8A96A", fontWeight: 600 }}
            >
              Sélection rapide
            </span>
            <h3
              className="font-serif text-xl"
              style={{ color: "#111", fontWeight: 500 }}
            >
              Choisissez Votre Produit
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex items-center justify-center rounded-full transition-colors cursor-pointer"
            style={{
              width: 36,
              height: 36,
              background: "#F7F3EE",
              color: "#111",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>

        {/* Liste des produits */}
        <div className="p-5 md:p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {productsList.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelect(p.targetId)}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:shadow-md cursor-pointer group"
              style={{
                border: "1px solid rgba(17,17,17,0.1)",
                background: "#FAF7F2",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4
                  className="font-serif text-base font-medium truncate group-hover:text-[#C8A96A] transition-colors"
                  style={{ color: "#111" }}
                >
                  {p.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-price text-sm font-semibold" style={{ color: "#C8A96A" }}>
                    {p.price}
                  </span>
                  {p.oldPrice && (
                    <span className="font-price text-xs line-through" style={{ color: "#8A7F74" }}>
                      {p.oldPrice}
                    </span>
                  )}
                </div>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                style={{ color: "#C8A96A" }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Composant Bouton Retour en Haut ─────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Retour en haut"
      title="Retour en haut"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:scale-110 active:scale-95 animate-fade-in"
      style={{
        width: 46,
        height: 46,
        background: "#111111",
        color: "#C8A96A",
        border: "1.5px solid #C8A96A",
        boxShadow: "0 8px 24px rgba(17,17,17,0.25)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

// ── Composant Modal Politique de Confidentialité (COD E-commerce) ───────────
function PrivacyPolicyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in"
      style={{ zIndex: 1000, background: "rgba(17,17,17,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden animate-scale-up flex flex-col"
        style={{
          background: "#FFF",
          borderRadius: 20,
          maxHeight: "85vh",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div
          className="flex items-center justify-between p-5 md:p-6 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(17,17,17,0.08)", background: "#FFF" }}
        >
          <div>
            <span
              className="font-sans text-xs uppercase tracking-widest block mb-1"
              style={{ color: "#C8A96A", fontWeight: 600 }}
            >
              Engagement & Transparence
            </span>
            <h3
              className="font-serif text-2xl font-semibold"
              style={{ color: "#111" }}
            >
              Politique de Confidentialité
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex items-center justify-center rounded-full transition-colors cursor-pointer"
            style={{
              width: 36,
              height: 36,
              background: "#F7F3EE",
              color: "#111",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenu de la Politique */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left font-sans text-sm leading-relaxed" style={{ color: "#3A3530" }}>
          <div>
            <h4 className="font-serif text-lg font-semibold mb-2" style={{ color: "#111" }}>
              1. Protection de Vos Données Personnelles
            </h4>
            <p style={{ color: "#555" }}>
              Chez <strong>LUNA Luxe</strong>, la confidentialité et la sécurité de vos informations personnelles sont une priorité absolue. Cette politique décrit la manière dont nous collectons, utilisons et protégeons vos données lors de vos achats sur notre boutique en ligne avec <strong>Paiement à la Livraison (PAL / COD)</strong> au Maroc.
            </p>
          </div>

          <div className="p-4 rounded-xl" style={{ background: "#F7F3EE", borderLeft: "4px solid #C8A96A" }}>
            <h4 className="font-serif text-base font-semibold mb-1" style={{ color: "#111" }}>
              2. Absence de Collecte de Données Bancaires
            </h4>
            <p style={{ color: "#555" }}>
              Nous fonctionnons exclusivement en <strong>Paiement à la Livraison</strong>. Aucune donnée de carte bancaire, compte bancaire ou information financière n'est requise, traitée ni conservée sur notre site. Vous réglez votre commande en espèces directement auprès du livreur à la réception de votre colis.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-2" style={{ color: "#111" }}>
              3. Données Collectées & Usage
            </h4>
            <p style={{ color: "#555", marginBottom: 8 }}>
              Lorsque vous passez commande, nous collectons uniquement les informations nécessaires au traitement et à la livraison de votre colis :
            </p>
            <ul className="list-disc pl-5 space-y-1" style={{ color: "#555" }}>
              <li><strong>Nom et Prénom :</strong> pour l'identification du destinataire.</li>
              <li><strong>Numéro de Téléphone :</strong> pour la confirmation de commande et le contact logistique par le livreur.</li>
              <li><strong>Adresse & Ville de Livraison :</strong> pour l'acheminement physique de votre commande au Maroc.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-2" style={{ color: "#111" }}>
              4. Partage & Confidentialité
            </h4>
            <p style={{ color: "#555" }}>
              Vos informations sont strictement confidentielles. Elles ne sont <strong>jamais vendues, louées ni cédées</strong> à des tiers à des fins commerciales. Elles sont transmises uniquement à nos partenaires de transport et de livraison agréés au Maroc dans le cadre exclusif de l'acheminement de votre commande.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-2" style={{ color: "#111" }}>
              5. Conservation & Vos Droits
            </h4>
            <p style={{ color: "#555" }}>
              Vos données de commande sont conservées de façon sécurisée uniquement le temps nécessaire à la finalisation de la livraison et au service après-vente (garantie retours 7 jours). Conformément aux lois sur la protection des données personnelles, vous pouvez à tout moment demander la modification ou la suppression totale de vos coordonnées en nous contactant.
            </p>
          </div>
        </div>

        {/* Pied de la modal */}
        <div
          className="p-5 md:p-6 flex justify-end flex-shrink-0"
          style={{ borderTop: "1px solid rgba(17,17,17,0.08)", background: "#FAF7F2" }}
        >
          <button
            onClick={onClose}
            className="btn-primary cursor-pointer px-6 py-2.5 text-xs rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [navSelectModalOpen, setNavSelectModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<string | undefined>(undefined);
  const [modalColor, setModalColor] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();

  const swatchColorsMap: Record<string, string> = {
    "Beige Naturel": "#D4B896",
    Ivoire: "#F5F0E8",
    Camel: "#C19A6B",
    "Terre Cuite": "#C06E52",
    Or: "#C8A96A",
    "Or Rose": "#B76E79",
    Argent: "#C0C0C0",
    "Beige Naturel + Or": "linear-gradient(135deg,#D4B896 50%,#C8A96A 50%)",
    "Ivoire + Or Rose": "linear-gradient(135deg,#F5F0E8 50%,#B76E79 50%)",
  };

  const openOrderModal = (productName?: string | null, colorName?: string | null) => {
    setModalProduct(productName || "Pack Exclusif (Les 3 pièces)");
    if (colorName) setModalColor(colorName);
    else setModalColor(undefined);
    setModalOpen(true);
  };

  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh" }}>
      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <nav>
        <div
          className="flex items-center justify-between px-5 md:px-10"
          style={{ maxWidth: 1280, margin: "0 auto", height: isMobile ? 56 : 64 }}
        >
          <div className="flex items-baseline gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span
              className="font-serif"
              style={{ fontSize: "1.55rem", fontWeight: 600, color: "#111", letterSpacing: "0.04em" }}
            >
              LUNA
            </span>
            <span
              className="font-sans"
              style={{ fontSize: "0.72rem", letterSpacing: "0.26em", color: "#C8A96A", textTransform: "uppercase", fontWeight: 600 }}
            >
              LUXE
            </span>
          </div>

          {/* Desktop Nav Links (Direct Product Anchors) */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Pack Exclusif", href: "#bundle" },
              { label: "Bonnet Crochet", href: "#product-bonnet" },
              { label: "Bracelets Joncs", href: "#product-bangles" },
              { label: "Bracelets Pandora", href: "#product-pandora" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-sm"
                style={{ color: "#3A3530", letterSpacing: "0.04em", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A96A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3A3530")}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/luunacrocheet/"
              target="_blank"
              rel="noopener noreferrer"
              title="Suivez-nous sur Instagram @luunacrocheet"
              aria-label="Instagram @luunacrocheet"
              className="flex items-center justify-center rounded-full transition-all cursor-pointer"
              style={{
                width: 36,
                height: 36,
                border: "1.5px solid rgba(200,169,106,0.5)",
                color: "#C8A96A",
                background: "rgba(200,169,106,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C8A96A";
                e.currentTarget.style.color = "#111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(200,169,106,0.06)";
                e.currentTarget.style.color = "#C8A96A";
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <button
              className="btn-primary cursor-pointer"
              style={{ padding: isMobile ? "8px 18px" : "10px 28px", fontSize: isMobile ? "0.75rem" : "0.8125rem" }}
              onClick={() => setNavSelectModalOpen(true)}
            >
              Commander
            </button>
          </div>
        </div>

        {/* ── Sub-navbar (Mobile Uniquement — Liens de défilement vers cartes spécifiques) ── */}
        <div className="subnav-bar md:hidden">
          <a href="#bundle" className="subnav-pill-item subnav-pill-gold">
            Pack Exclusif (-28%)
          </a>
          <a href="#product-bonnet" className="subnav-pill-item">
            Bonnet Crochet
          </a>
          <a href="#product-bangles" className="subnav-pill-item">
            Bracelets Joncs
          </a>
          <a href="#product-pandora" className="subnav-pill-item">
            Bracelets Pandora
          </a>
        </div>
      </nav>

      {/* ── Section Héro ──────────────────────────────────────────────────────── */}
      <section
        style={{ paddingTop: isMobile ? 104 : 68, minHeight: "100vh", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "relative",
            height: `calc(100vh - ${isMobile ? 104 : 68}px)`,
            minHeight: 600,
            background: "#111",
          }}
        >
          <img
            src={HERO_IMG}
            alt="Femme élégante — LUNA Luxe"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.82 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(17,17,17,0.6) 0%, rgba(17,17,17,0.1) 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 8vw",
              maxWidth: 780,
            }}
          >
            <h1
              className="font-serif animate-fade-up"
              style={{
                fontSize: isMobile ? "clamp(1.8rem, 6.5vw, 2.4rem)" : "clamp(2.8rem, 5.5vw, 4.5rem)",
                lineHeight: 1.2,
                color: "#fff",
                fontWeight: 500,
                marginBottom: 28,
              }}
            >
              Votre été,<br />
              votre style,<br />
              votre histoire.
            </h1>
            <div className="flex gap-4 flex-wrap animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <button className="btn-primary cursor-pointer" onClick={() => setNavSelectModalOpen(true)}>
                Commander
              </button>
            </div>
          </div>
          {/* Défiler */}
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className="font-sans" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Défiler</span>
            <div
              style={{
                width: 1,
                height: 40,
                background: "linear-gradient(to bottom, rgba(200,169,106,0.8), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Collection & Mini Pages Produit ────────────────────────────────────── */}
      <div id="collection" style={{ paddingTop: 40 }}>
        <div className="text-center pt-8 pb-2">
          <p className="font-sans uppercase tracking-widest text-xs mb-2" style={{ color: "#C8A96A", fontWeight: 600 }}>
            Catalogue LUNA
          </p>
          <h2 className="font-serif mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111", fontWeight: 500 }}>
            Nos Créations
          </h2>
          <div className="divider mt-5" />
        </div>

        {/* 1. Pack Exclusif (Offre Spéciale) */}
        <ProductSection
          id="bundle"
          isSpecial={true}
          badge="OFFRE EXCLUSIVE"
          subtitle="Coffret Signature (3 pièces)"
          title="Le Pack Élégance"
          price="199 MAD"
          oldPrice="249 MAD"
          savingBadge="Économisez 50 MAD"
          description="Coffret cadeau de luxe réunissant nos 3 pièces emblématiques : le Bonnet Crochet, les 3 Joncs 18K et le Bracelet Pandora."
          bullets={[
            "Contient Bonnet + Set de 3 Joncs + Bracelet Pandora",
            "Coffret cadeau signature offert",
          ]}
          mainImg={PACK_IMG}
          colorsList={["Beige Naturel + Or", "Ivoire + Or Rose"]}
          swatchColors={swatchColorsMap}
          fullName="Pack Exclusif (Les 3 pièces)"
          isMobile={isMobile}
          onOrder={(p, c) => openOrderModal(p, c)}
        />

        {/* 2. Duo Bonnets Crochet (Lot de 2) */}
        <ProductSection
          id="product-bonnet"
          badge="OFFRE DUO (2 BONNETS)"
          subtitle="Pack Duo · 2 Bonnets Crochet"
          title="Duo Bonnets Crochet"
          price="165 MAD"
          description="Un chapeau en crochet léger et tendance, au design ajouré et élégant. Offre exclusive en lot de 2 bonnets — choisissez vos 2 couleurs !"
          mainImg={MESH_5}
          colorsList={["Beige", "Blanc", "Noir", "Marron", "Rouge"]}
          imageVariants={MESH_VARIANTS}
          swatchColors={swatchColorsMap}
          fullName="Bonnet Crochet"
          reverseLayout={true}
          isMobile={isMobile}
          onOrder={(p, c) => openOrderModal(p, c)}
        />

        {/* 3. Bracelets Joncs (Bangles) */}
        <ProductSection
          id="product-bangles"
          badge="RÉSINE & NACRE ARTISANALE"
          subtitle="Set de Bangles"
          title="Bracelets Joncs (Bangles)"
          price="59 MAD"
          description="Un bracelet chunky aux tons ambrés avec de magnifiques nuances marbrées et translucides. Une pièce tendance qui apporte une touche chaleureuse à votre look."
          mainImg={BANGLES_1}
          colorsList={["Beige", "Ambre", "Marron", "Rouge"]}
          imageVariants={BANGLE_VARIANTS}
          swatchColors={swatchColorsMap}
          fullName="Bracelets Joncs (Bangles)"
          isMobile={isMobile}
          onOrder={(p, c) => openOrderModal(p, c)}
        />

        {/* 4. Bracelets Style Pandora */}
        <ProductSection
          id="product-pandora"
          badge="ÉDITION LIMITÉE"
          subtitle="Pendentifs & Breloques Gravées"
          title="Bracelets Style Pandora"
          price="69 MAD"
          description="Un bracelet élégant en acier inoxydable, orné de charms en forme de cœur et de jolies fleurs roses. Féminin, raffiné et parfait pour sublimer vos looks au quotidien."
          mainImg={PANDORA_1}
          colorsList={["Rose", "Bleu", "Or Rose", "Argent"]}
          imageVariants={PANDORA_VARIANTS}
          swatchColors={swatchColorsMap}
          fullName="Bracelets Pandora"
          reverseLayout={true}
          isMobile={isMobile}
          onOrder={(p, c) => openOrderModal(p, c)}
        />
      </div>

      {/* ── Section Comparateur Get The Sets (Anciennement Histoire) ───────────── */}
      <ImageCompareSlider isMobile={isMobile} />

      {/* ── Engagements ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 40px 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 0,
              padding: "60px 40px",
              boxShadow: "0 4px 24px rgba(17,17,17,0.06)",
              border: "1px solid rgba(17,17,17,0.07)",
            }}
          >
            <div className="text-center mb-12">
              <h2 className="font-serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111", fontWeight: 500 }}>
                La Promesse LUNA
              </h2>
            </div>
            <div
              className="grid"
              style={{ gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 24 }}
            >
              {features.map((f) => (
                <div key={f.title} className="flex flex-col items-center text-center">
                  <div
                    className="flex items-center justify-center mb-4"
                    style={{
                      width: 60,
                      height: 60,
                      background: "#F7F3EE",
                      borderRadius: "50%",
                      color: "#C8A96A",
                    }}
                  >
                    {f.icon}
                  </div>
                  <h4 className="font-serif mb-2" style={{ fontSize: "1rem", color: "#111", fontWeight: 500 }}>
                    {f.title}
                  </h4>
                  <p className="font-sans text-xs" style={{ color: "#8A7F74", lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "0 40px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <p className="font-sans uppercase tracking-widest text-xs mb-4" style={{ color: "#C8A96A" }}>
              FAQ
            </p>
            <h2 className="font-serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111", fontWeight: 500 }}>
              Toutes Vos Questions
            </h2>
          </div>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} {...faq} />
          ))}
        </div>
      </section>

      {/* ── Pied de page ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(17,17,17,0.08)", padding: "52px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="flex items-baseline gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <span className="font-serif" style={{ fontSize: "1.65rem", fontWeight: 600, color: "#111", letterSpacing: "0.04em" }}>
                LUNA
              </span>
              <span className="font-sans" style={{ fontSize: "0.72rem", letterSpacing: "0.26em", color: "#C8A96A", textTransform: "uppercase", fontWeight: 600 }}>
                LUXE
              </span>
            </div>

            {/* Liens de navigation */}
            <div className="flex gap-8 flex-wrap justify-center">
              {[
                { label: "Pack Exclusif", href: "#bundle" },
                { label: "Bonnet Crochet", href: "#product-bonnet" },
                { label: "Bracelets Joncs", href: "#product-bangles" },
                { label: "Bracelets Pandora", href: "#product-pandora" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-sans text-sm transition-colors"
                  style={{ color: "#8A7F74", textDecoration: "none", letterSpacing: "0.04em" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A96A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A7F74")}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Icône réseau social (Instagram uniquement) */}
            <div className="flex justify-center">
              <a
                href="https://www.instagram.com/luunacrocheet/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @luunacrocheet"
                title="Suivez-nous sur Instagram @luunacrocheet"
                className="flex items-center justify-center transition-all cursor-pointer"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(200,169,106,0.4)",
                  color: "#C8A96A",
                  background: "rgba(200,169,106,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C8A96A";
                  e.currentTarget.style.background = "#C8A96A";
                  e.currentTarget.style.color = "#111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200,169,106,0.4)";
                  e.currentTarget.style.background = "rgba(200,169,106,0.06)";
                  e.currentTarget.style.color = "#C8A96A";
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* Ligne inférieure */}
            <div
              className="flex items-center justify-between w-full flex-wrap gap-4"
              style={{ borderTop: "1px solid rgba(17,17,17,0.07)", paddingTop: 24 }}
            >
              <p className="font-sans text-xs" style={{ color: "#8A7F74" }}>
                © 2024 LUNA Luxe. Tous droits réservés. Fabriqué avec amour au Maroc.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="font-sans text-xs cursor-pointer hover:underline transition-colors"
                  style={{ color: "#8A7F74", background: "none", border: "none" }}
                >
                  Politique de Confidentialité
                </button>
                <span style={{ color: "#8A7F74" }}>·</span>
                <p className="font-sans text-xs" style={{ color: "#8A7F74" }}>
                  Paiement à la livraison
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modal de Commande ─────────────────────────────────────────────────── */}
      {modalOpen && (
        <OrderModal
          initialProduct={modalProduct}
          initialColor={modalColor}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* ── Modal de Sélection pour Navbar ──────────────────────────────────── */}
      <ProductNavSelectModal
        isOpen={navSelectModalOpen}
        onClose={() => setNavSelectModalOpen(false)}
      />

      {/* ── Modal Politique de Confidentialité ──────────────────────────────── */}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* ── Bouton Retour en Haut ───────────────────────────────────────────── */}
      <BackToTop />
    </div>
  );
}

