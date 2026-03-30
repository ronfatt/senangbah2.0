import { getAvatarPreviewTone } from "../lib/avatar-catalog";

export function AvatarPreviewFigure({
  equippedBySlot,
  compact = false
}: {
  equippedBySlot: Map<string, { itemCode: string; itemName: string }>;
  compact?: boolean;
}) {
  const defaultBaseAvatarSrc = "/avatar-items/default-avatar-base.png";
  const hairItemCode = equippedBySlot.get("hair")?.itemCode;
  const topItemCode = equippedBySlot.get("top")?.itemCode;
  const bottomItemCode = equippedBySlot.get("bottom")?.itemCode;
  const shoesItemCode = equippedBySlot.get("shoes")?.itemCode;
  const accessoryItemCode = equippedBySlot.get("accessory")?.itemCode;

  const hairTone = getAvatarPreviewTone(equippedBySlot.get("hair")?.itemCode);
  const topTone = getAvatarPreviewTone(equippedBySlot.get("top")?.itemCode);
  const bottomTone = getAvatarPreviewTone(equippedBySlot.get("bottom")?.itemCode);
  const shoesTone = getAvatarPreviewTone(equippedBySlot.get("shoes")?.itemCode);
  const accessoryTone = getAvatarPreviewTone(equippedBySlot.get("accessory")?.itemCode);

  const isDefaultBase =
    (!hairItemCode || hairItemCode === "hair-study-bob") &&
    (!topItemCode || topItemCode === "top-campus-tee") &&
    (!bottomItemCode || bottomItemCode === "bottom-classic-pants") &&
    !accessoryItemCode;

  const showAccessory = Boolean(accessoryTone);
  const showTopBadge = Boolean(topTone) && topItemCode !== "top-campus-tee";

  if (isDefaultBase) {
    return (
      <div className={`avatar-figure${compact ? " avatar-figure-compact" : ""}`}>
        <div className="avatar-stage avatar-stage-default avatar-stage-image">
          <img
            alt="Default avatar base"
            className={`avatar-default-image${compact ? " avatar-default-image-compact" : ""}`}
            src={defaultBaseAvatarSrc}
          />
          <div className="avatar-shadow avatar-shadow-image" />
        </div>
      </div>
    );
  }

  return (
    <div className={`avatar-figure${compact ? " avatar-figure-compact" : ""}`}>
      <div className={`avatar-stage${isDefaultBase ? " avatar-stage-default" : ""}`}>
        <div className="avatar-body">
          <div className={`avatar-head${isDefaultBase ? " avatar-head-default" : ""}`}>
            <div className={`avatar-hair ${hairTone ? `avatar-hair-${hairTone}` : ""}`} />
            <div className="avatar-face">
              <span className="avatar-eye" />
              <span className="avatar-eye" />
              <span className="avatar-mouth" />
            </div>
          </div>
          <div className="avatar-neck" />
          <div className="avatar-arm avatar-arm-left" />
          <div className="avatar-arm avatar-arm-right" />
          <div className={`avatar-top${isDefaultBase ? " avatar-top-default" : ""} ${topTone ? `avatar-top-${topTone}` : ""}`}>
            {showTopBadge ? <div className="avatar-top-badge" /> : null}
          </div>
          <div className={`avatar-bottom${isDefaultBase ? " avatar-bottom-default" : ""} ${bottomTone ? `avatar-bottom-${bottomTone}` : ""}`} />
          <div className="avatar-legs">
            <div className="avatar-leg avatar-leg-left" />
            <div className="avatar-leg avatar-leg-right" />
          </div>
          <div className="avatar-shoes-row">
            <div className={`avatar-shoe avatar-shoe-left${isDefaultBase ? " avatar-shoe-default" : ""} ${shoesTone ? `avatar-shoes-${shoesTone}` : ""}`} />
            <div className={`avatar-shoe avatar-shoe-right${isDefaultBase ? " avatar-shoe-default" : ""} ${shoesTone ? `avatar-shoes-${shoesTone}` : ""}`} />
          </div>
          {showAccessory ? <div className={`avatar-accessory ${accessoryTone ? `avatar-accessory-${accessoryTone}` : ""}`} /> : null}
        </div>
        <div className="avatar-shadow" />
      </div>
    </div>
  );
}
