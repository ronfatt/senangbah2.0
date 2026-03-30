import { getAvatarOverlaySrc } from "../lib/avatar-catalog";

export function AvatarPreviewFigure({
  equippedBySlot,
  compact = false
}: {
  equippedBySlot: Map<string, { itemCode: string; itemName: string }>;
  compact?: boolean;
}) {
  const defaultBaseAvatarSrc = "/avatar-items/default-avatar-base.png";

  const hairOverlay = getAvatarOverlaySrc(equippedBySlot.get("hair")?.itemCode);
  const topOverlay = getAvatarOverlaySrc(equippedBySlot.get("top")?.itemCode);
  const bottomOverlay = getAvatarOverlaySrc(equippedBySlot.get("bottom")?.itemCode);
  const shoesOverlay = getAvatarOverlaySrc(equippedBySlot.get("shoes")?.itemCode);
  const accessoryOverlay = getAvatarOverlaySrc(equippedBySlot.get("accessory")?.itemCode);

  const layers = [bottomOverlay, shoesOverlay, topOverlay, hairOverlay, accessoryOverlay].filter(Boolean) as string[];

  return (
    <div className={`avatar-figure${compact ? " avatar-figure-compact" : ""}`}>
      <div className="avatar-stage avatar-stage-default avatar-stage-image">
        <div className={`avatar-layered-preview${compact ? " avatar-layered-preview-compact" : ""}`}>
          <img alt="Default avatar base" className="avatar-default-image" src={defaultBaseAvatarSrc} />
          {layers.map((src) => (
            <img alt="" aria-hidden="true" className="avatar-overlay-image" key={src} src={src} />
          ))}
        </div>
        <div className="avatar-shadow avatar-shadow-image" />
      </div>
    </div>
  );
}
