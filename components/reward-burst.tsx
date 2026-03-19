import {
  getBadgeNudge,
  getMasteryGain,
  getNextStep,
  getRewardHeadline,
  getRewardTone
} from "../lib/celebration";
import { getClosetSpendHint } from "../lib/avatar-catalog";

export function RewardBurst({
  subjectSlug,
  moduleSlug,
  moduleName,
  accuracyPercent,
  stars,
  starPoints,
  bonusPoints,
  weeklyDropHeadline,
  totalPoints,
  unlockedAvatarItems
}: {
  subjectSlug: string;
  moduleSlug: string;
  moduleName: string;
  accuracyPercent: number;
  stars: number;
  starPoints: number;
  bonusPoints?: number;
  weeklyDropHeadline?: string | null;
  totalPoints?: number | null;
  unlockedAvatarItems?: { code: string; name: string; badgeCode: string | null }[];
}) {
  const masteryGain = getMasteryGain({ stars, accuracyPercent });
  const tone = getRewardTone(stars);
  const nextStep = getNextStep({ subjectSlug, moduleSlug });
  const closetSpendHint = typeof totalPoints === "number" ? getClosetSpendHint(totalPoints) : null;

  return (
    <article className={`reward-burst reward-burst-${tone}`}>
      <div className="reward-burst-head">
        <div>
          <p className="dashboard-label">Mission reward</p>
          <h3>{getRewardHeadline(stars)}</h3>
        </div>
        <span className="reward-stars">{Array.from({ length: stars }, () => "★").join(" ")}</span>
      </div>

      <p className="dashboard-helper">
        {moduleName} just fed your dashboard, rewards loop, and avatar economy in one move.
      </p>

      <div className="reward-burst-grid">
        <div className="reward-chip">
          <span className="dashboard-label">Star Points</span>
          <strong>+{starPoints}</strong>
        </div>
        <div className="reward-chip">
          <span className="dashboard-label">Mastery</span>
          <strong>+{masteryGain}%</strong>
        </div>
        <div className="reward-chip">
          <span className="dashboard-label">Accuracy</span>
          <strong>{accuracyPercent}%</strong>
        </div>
        <div className="reward-chip">
          <span className="dashboard-label">Badge nudge</span>
          <strong>{getBadgeNudge({ stars, accuracyPercent })}</strong>
        </div>
      </div>

      {bonusPoints ? (
        <div className="reward-unlock-list">
          <p className="dashboard-label">Weekly drop bonus</p>
          <strong>
            +{bonusPoints} pts from {weeklyDropHeadline || "this week&apos;s drop"}.
          </strong>
        </div>
      ) : null}

      {typeof totalPoints === "number" ? (
        <p className="dashboard-helper">Wallet total: {totalPoints} pts. That gets students closer to the next closet unlock.</p>
      ) : null}
      {closetSpendHint ? (
        <div className="reward-unlock-list">
          <p className="dashboard-label">{closetSpendHint.canBuyNow ? "Ready to spend" : "Closet target"}</p>
          <strong>{closetSpendHint.helper}</strong>
        </div>
      ) : null}
      {unlockedAvatarItems?.length ? (
        <div className="reward-unlock-list">
          <p className="dashboard-label">New closet unlock</p>
          {unlockedAvatarItems.map((item) => (
            <strong key={item.code}>{item.name} just entered the avatar closet.</strong>
          ))}
        </div>
      ) : null}

      <div className="reward-next-step">
        <div className="reward-next-step-copy">
          <p className="dashboard-label">Next move</p>
          <strong>{nextStep.label}</strong>
          <p className="dashboard-helper">{nextStep.helper}</p>
        </div>
        <div className="hero-actions">
          <a className="btn btn-primary" href={nextStep.href}>
            {nextStep.label}
          </a>
          <a className="btn btn-secondary" href="/avatar">
            Spend points in closet
          </a>
        </div>
      </div>
    </article>
  );
}
