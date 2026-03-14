export type AvatarSlot = "hair" | "top" | "bottom" | "shoes" | "accessory";

export type AvatarCatalogItem = {
  code: string;
  name: string;
  slot: AvatarSlot;
  rarity: "common" | "rare" | "epic";
  pricePoints: number;
  unlockType: "starter" | "shop" | "achievement";
  collectionName: string;
  helper: string;
};

export const avatarCatalog: AvatarCatalogItem[] = [
  {
    code: "hair-study-bob",
    name: "Study Bob",
    slot: "hair",
    rarity: "common",
    pricePoints: 0,
    unlockType: "starter",
    collectionName: "Study Core",
    helper: "A clean default look that every student starts with."
  },
  {
    code: "hair-comet-wave",
    name: "Comet Wave",
    slot: "hair",
    rarity: "rare",
    pricePoints: 650,
    unlockType: "shop",
    collectionName: "Galaxy Explorer",
    helper: "A brighter look for students building star momentum."
  },
  {
    code: "top-campus-tee",
    name: "Campus Tee",
    slot: "top",
    rarity: "common",
    pricePoints: 0,
    unlockType: "starter",
    collectionName: "Study Core",
    helper: "Simple and easy to mix with any later item."
  },
  {
    code: "top-neon-hoodie",
    name: "Neon Hoodie",
    slot: "top",
    rarity: "rare",
    pricePoints: 700,
    unlockType: "shop",
    collectionName: "Neo Math",
    helper: "Feels like a high-energy reward for Math and Add Math learners."
  },
  {
    code: "bottom-classic-pants",
    name: "Classic Pants",
    slot: "bottom",
    rarity: "common",
    pricePoints: 0,
    unlockType: "starter",
    collectionName: "Study Core",
    helper: "Starter bottoms that keep the first avatar setup complete."
  },
  {
    code: "bottom-explorer-cargo",
    name: "Explorer Cargo",
    slot: "bottom",
    rarity: "rare",
    pricePoints: 720,
    unlockType: "shop",
    collectionName: "Galaxy Explorer",
    helper: "Fits Geografi and Humanities themed drops later."
  },
  {
    code: "shoes-daily-runner",
    name: "Daily Runner",
    slot: "shoes",
    rarity: "common",
    pricePoints: 280,
    unlockType: "shop",
    collectionName: "Sporty Pop",
    helper: "A fast first purchase so the economy feels rewarding early."
  },
  {
    code: "shoes-cosmic-high",
    name: "Cosmic High Tops",
    slot: "shoes",
    rarity: "epic",
    pricePoints: 1450,
    unlockType: "shop",
    collectionName: "Galaxy Explorer",
    helper: "A headline item for long-term Star Point saving."
  },
  {
    code: "accessory-first-star-pin",
    name: "First Star Pin",
    slot: "accessory",
    rarity: "common",
    pricePoints: 0,
    unlockType: "achievement",
    collectionName: "Exam Ace",
    helper: "Unlock this by earning the first win badge."
  },
  {
    code: "accessory-streak-headset",
    name: "Streak Headset",
    slot: "accessory",
    rarity: "epic",
    pricePoints: 980,
    unlockType: "shop",
    collectionName: "Sporty Pop",
    helper: "Feels premium without forcing the whole system into pay-to-look-good."
  }
];

export const avatarClosetSlots: { code: AvatarSlot; name: string }[] = [
  { code: "hair", name: "Hair" },
  { code: "top", name: "Top" },
  { code: "bottom", name: "Bottom" },
  { code: "shoes", name: "Shoes" },
  { code: "accessory", name: "Accessory" }
];
