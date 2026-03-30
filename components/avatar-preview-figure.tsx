import { getAvatarOverlaySrc } from "../lib/avatar-catalog";

export function AvatarPreviewFigure({
  equippedBySlot,
  compact = false
}: {
  equippedBySlot: Map<string, { itemCode: string; itemName: string }>;
  compact?: boolean;
}) {
  const defaultBaseAvatarSrc = "/avatar-items/default-avatar-base.png";

  const layers = [
    { slot: "bottom", src: getAvatarOverlaySrc(equippedBySlot.get("bottom")?.itemCode) },
    { slot: "shoes", src: getAvatarOverlaySrc(equippedBySlot.get("shoes")?.itemCode) },
    { slot: "top", src: getAvatarOverlaySrc(equippedBySlot.get("top")?.itemCode) },
    { slot: "hair", src: getAvatarOverlaySrc(equippedBySlot.get("hair")?.itemCode) },
    { slot: "accessory", src: getAvatarOverlaySrc(equippedBySlot.get("accessory")?.itemCode) }
  ].filter((layer): layer is { slot: string; src: string } => Boolean(layer.src));

  return (
    <div className={`avatar-figure${compact ? " avatar-figure-compact" : ""}`}>
      <div className="avatar-stage avatar-stage-default avatar-stage-image">
        <div className={`avatar-layered-preview${compact ? " avatar-layered-preview-compact" : ""}`}>
          <img alt="Default avatar base" className="avatar-default-image" src={defaultBaseAvatarSrc} />
          {layers.map((layer) => (
            <img
              alt=""
              aria-hidden="true"
              className={`avatar-overlay-image avatar-overlay-${layer.slot}${compact ? " avatar-overlay-compact" : ""}`}
              key={`${layer.slot}-${layer.src}`}
              src={layer.src}
            />
          ))}
        </div>
        <div className="avatar-shadow avatar-shadow-image" />
      </div>
    </div>
  );
}
