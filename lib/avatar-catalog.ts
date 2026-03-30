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
  previewTone: string;
  imageSrc: string;
  imageReady: boolean;
  imagePrompt: string;
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
    helper: "A clean default look that every student starts with.",
    previewTone: "study-bob",
    imageSrc: "/avatar-items/study-bob.png",
    imageReady: true,
    imagePrompt:
      "A neat student hairstyle, short bob haircut, simple and clean, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "hair-comet-wave",
    name: "Comet Wave",
    slot: "hair",
    rarity: "rare",
    pricePoints: 650,
    unlockType: "shop",
    collectionName: "Galaxy Explorer",
    helper: "A brighter look for students building star momentum.",
    previewTone: "comet-wave",
    imageSrc: "/avatar-items/comet-wave.png",
    imageReady: true,
    imagePrompt:
      "A stylish wavy hairstyle with a slightly cosmic playful feel, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "top-campus-tee",
    name: "Campus Tee",
    slot: "top",
    rarity: "common",
    pricePoints: 0,
    unlockType: "starter",
    collectionName: "Study Core",
    helper: "Simple and easy to mix with any later item.",
    previewTone: "campus-tee",
    imageSrc: "/avatar-items/campus-tee.png",
    imageReady: true,
    imagePrompt:
      "A purple student t-shirt with a small school badge on the chest, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "top-neon-hoodie",
    name: "Neon Hoodie",
    slot: "top",
    rarity: "rare",
    pricePoints: 700,
    unlockType: "shop",
    collectionName: "Neo Math",
    helper: "Feels like a high-energy reward for Math and Add Math learners.",
    previewTone: "neon-hoodie",
    imageSrc: "/avatar-items/neon-hoodie.png",
    imageReady: true,
    imagePrompt:
      "A bright neon purple hoodie with sporty futuristic details, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "bottom-classic-pants",
    name: "Classic Pants",
    slot: "bottom",
    rarity: "common",
    pricePoints: 0,
    unlockType: "starter",
    collectionName: "Study Core",
    helper: "Starter bottoms that keep the first avatar setup complete.",
    previewTone: "classic-pants",
    imageSrc: "/avatar-items/classic-pants.png",
    imageReady: true,
    imagePrompt:
      "A pair of simple light beige student pants, clean and classic, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "bottom-explorer-cargo",
    name: "Explorer Cargo",
    slot: "bottom",
    rarity: "rare",
    pricePoints: 720,
    unlockType: "shop",
    collectionName: "Galaxy Explorer",
    helper: "Fits Geografi and Humanities themed drops later.",
    previewTone: "explorer-cargo",
    imageSrc: "/avatar-items/explorer-cargo.png",
    imageReady: true,
    imagePrompt:
      "A pair of explorer-style cargo pants with pocket details, adventurous but clean, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "shoes-daily-runner",
    name: "Daily Runner",
    slot: "shoes",
    rarity: "common",
    pricePoints: 280,
    unlockType: "shop",
    collectionName: "Sporty Pop",
    helper: "A fast first purchase so the economy feels rewarding early.",
    previewTone: "daily-runner",
    imageSrc: "/avatar-items/daily-runner.png",
    imageReady: true,
    imagePrompt:
      "A pair of sporty everyday sneakers, simple and energetic, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "shoes-cosmic-high",
    name: "Cosmic High Tops",
    slot: "shoes",
    rarity: "epic",
    pricePoints: 1450,
    unlockType: "shop",
    collectionName: "Galaxy Explorer",
    helper: "A headline item for long-term Star Point saving.",
    previewTone: "cosmic-high",
    imageSrc: "/avatar-items/cosmic-high-tops.png",
    imageReady: true,
    imagePrompt:
      "A pair of high-top cosmic sneakers with bright futuristic details, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "accessory-first-star-pin",
    name: "First Star Pin",
    slot: "accessory",
    rarity: "common",
    pricePoints: 0,
    unlockType: "achievement",
    collectionName: "Exam Ace",
    helper: "Unlock this by earning the first win badge.",
    previewTone: "first-star-pin",
    imageSrc: "/avatar-items/first-star-pin.png",
    imageReady: true,
    imagePrompt:
      "A small shiny star badge pin accessory, bright and cute, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  },
  {
    code: "accessory-streak-headset",
    name: "Streak Headset",
    slot: "accessory",
    rarity: "epic",
    pricePoints: 980,
    unlockType: "shop",
    collectionName: "Sporty Pop",
    helper: "Feels premium without forcing the whole system into pay-to-look-good.",
    previewTone: "streak-headset",
    imageSrc: "/avatar-items/streak-headset.png",
    imageReady: true,
    imagePrompt:
      "A sporty premium headset accessory with a lively student energy, cute 2.5D wearable item icon, slightly Roblox-like, front-facing, centered, rounded blocky shapes, toy-like material, soft studio lighting, subtle depth and shadow, polished mobile game asset style, transparent background, no text, no background scene, no extra objects."
  }
];

export const avatarClosetSlots: { code: AvatarSlot; name: string }[] = [
  { code: "hair", name: "Hair" },
  { code: "top", name: "Top" },
  { code: "bottom", name: "Bottom" },
  { code: "shoes", name: "Shoes" },
  { code: "accessory", name: "Accessory" }
];

export const collectionMissionMap: Record<
  string,
  { subject: string; title: string; helper: string; href: string }
> = {
  "Study Core": {
    subject: "English",
    title: "Writing Coach",
    helper: "Finish a core language mission to keep this foundational set moving.",
    href: "/subjects/english/writing-coach"
  },
  "Galaxy Explorer": {
    subject: "Geografi",
    title: "Map and Data Drill",
    helper: "Best fit for the explorer-style collection and humanities revision energy.",
    href: "/subjects/geografi/map-and-data-drill"
  },
  "Sporty Pop": {
    subject: "Bahasa Melayu",
    title: "Tatabahasa",
    helper: "A quick BM mission is the fastest way to keep this lively set progressing.",
    href: "/subjects/bahasa-melayu/tatabahasa"
  },
  "Exam Ace": {
    subject: "English",
    title: "Grammar Lab",
    helper: "Badge-linked items in this collection match accuracy-focused practice best.",
    href: "/subjects/english/grammar-lab"
  },
  "Neo Math": {
    subject: "Math",
    title: "Topic Practice",
    helper: "Math missions fit the energy of this sharper, high-focus collection.",
    href: "/subjects/math/topic-practice"
  }
};

const weeklyDropRotation = [
  {
    itemCode: "hair-comet-wave",
    headline: "Galaxy Explorer Drop",
    helper: "A brighter weekly spotlight item for students stacking star momentum."
  },
  {
    itemCode: "shoes-daily-runner",
    headline: "Sporty Pop Drop",
    helper: "A fast, reachable item designed to make weekly progress feel winnable."
  },
  {
    itemCode: "top-neon-hoodie",
    headline: "Neo Math Drop",
    helper: "A sharper weekly drop that pairs well with Math missions."
  },
  {
    itemCode: "accessory-streak-headset",
    headline: "Streak Drop",
    helper: "A weekly spotlight for students protecting streaks and rhythm."
  }
] as const;

function getWeekKey(referenceDate: Date) {
  const date = new Date(referenceDate);
  date.setUTCHours(0, 0, 0, 0);
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000);
  return Math.floor(dayOfYear / 7);
}

export function getAvatarPreviewTone(itemCode: string | null | undefined) {
  return avatarCatalog.find((item) => item.code === itemCode)?.previewTone || null;
}

export function getCollectionMission(collectionName: string) {
  return collectionMissionMap[collectionName] || null;
}

export function getWeeklyDrop(referenceDate = new Date()) {
  const dropMeta = weeklyDropRotation[getWeekKey(referenceDate) % weeklyDropRotation.length];
  const item = avatarCatalog.find((entry) => entry.code === dropMeta.itemCode);

  if (!item) return null;

  const start = new Date(referenceDate);
  const day = start.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setUTCDate(start.getUTCDate() + diff);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  return {
    ...item,
    headline: dropMeta.headline,
    helper: dropMeta.helper,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    mission: getCollectionMission(item.collectionName)
  };
}

export function getWeeklyDropBonusForMission({
  subjectSlug,
  moduleSlug,
  referenceDate = new Date()
}: {
  subjectSlug: string;
  moduleSlug: string;
  referenceDate?: Date;
}) {
  const weeklyDrop = getWeeklyDrop(referenceDate);
  if (!weeklyDrop?.mission) return null;

  const [, missionSubjectSlug, missionModuleSlug] =
    weeklyDrop.mission.href.match(/^\/subjects\/([^/]+)\/([^/]+)$/) || [];

  if (missionSubjectSlug === subjectSlug && missionModuleSlug === moduleSlug) {
    return {
      bonusPoints: 60,
      headline: weeklyDrop.headline,
      itemName: weeklyDrop.name
    };
  }

  return null;
}

export function getWeeklyDropUrgency(endIso: string, referenceDate = new Date()) {
  const endTime = new Date(endIso).getTime();
  const nowTime = referenceDate.getTime();
  const msRemaining = Math.max(0, endTime - nowTime);
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  if (daysRemaining <= 1) {
    return {
      label: "Ends today",
      helper: "This drop is about to rotate. One focused mission today can still move it."
    };
  }

  if (daysRemaining <= 3) {
    return {
      label: `${daysRemaining} day(s) left`,
      helper: "The clock is short now. This is the best moment to turn points into a weekly unlock."
    };
  }

  return {
    label: `${daysRemaining} day(s) left`,
    helper: "A fresh weekly target is live. Keep chipping at it before the rotation changes."
  };
}

export function getClosetSpendHint(totalPoints: number) {
  const shopItems = avatarCatalog
    .filter((item) => item.unlockType === "shop")
    .sort((a, b) => a.pricePoints - b.pricePoints);

  const affordable = shopItems.filter((item) => item.pricePoints <= totalPoints);
  const nextTarget = shopItems.find((item) => item.pricePoints > totalPoints) || null;

  if (affordable.length) {
    const bestNow = affordable[0];
    return {
      canBuyNow: true,
      itemName: bestNow.name,
      pricePoints: bestNow.pricePoints,
      helper: `You can already buy ${bestNow.name} for ${bestNow.pricePoints} pts right now.`
    };
  }

  if (nextTarget) {
    const pointsNeeded = nextTarget.pricePoints - totalPoints;
    return {
      canBuyNow: false,
      itemName: nextTarget.name,
      pricePoints: nextTarget.pricePoints,
      pointsNeeded,
      helper: `${pointsNeeded} pts more unlocks ${nextTarget.name}.`
    };
  }

  return null;
}
