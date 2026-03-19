import { getAvatarPreviewTone } from "../lib/avatar-catalog";

export function AvatarPreviewFigure({
  equippedBySlot,
  compact = false
}: {
  equippedBySlot: Map<string, { itemCode: string; itemName: string }>;
  compact?: boolean;
}) {
  const hairTone = getAvatarPreviewTone(equippedBySlot.get("hair")?.itemCode);
  const topTone = getAvatarPreviewTone(equippedBySlot.get("top")?.itemCode);
  const bottomTone = getAvatarPreviewTone(equippedBySlot.get("bottom")?.itemCode);
  const shoesTone = getAvatarPreviewTone(equippedBySlot.get("shoes")?.itemCode);
  const accessoryTone = getAvatarPreviewTone(equippedBySlot.get("accessory")?.itemCode);

  return (
    <div className={`avatar-figure${compact ? " avatar-figure-compact" : ""}`}>
      <div className="avatar-stage">
        <div className="avatar-spark avatar-spark-left" />
        <div className="avatar-spark avatar-spark-right" />
        <div className="avatar-body">
          <div className={`avatar-head ${hairTone ? `avatar-hair-${hairTone}` : ""}`}>
            <div className="avatar-face">
              <span className="avatar-eye" />
              <span className="avatar-eye" />
            </div>
          </div>
          <div className="avatar-arm avatar-arm-left" />
          <div className={`avatar-top ${topTone ? `avatar-top-${topTone}` : ""}`} />
          <div className="avatar-arm avatar-arm-right" />
          <div className={`avatar-bottom ${bottomTone ? `avatar-bottom-${bottomTone}` : ""}`} />
          <div className={`avatar-shoes ${shoesTone ? `avatar-shoes-${shoesTone}` : ""}`} />
          <div className={`avatar-accessory ${accessoryTone ? `avatar-accessory-${accessoryTone}` : ""}`} />
        </div>
        <div className="avatar-shadow" />
      </div>
    </div>
  );
}
