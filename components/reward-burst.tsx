import {
  getBadgeNudge,
  getLearningFeedback,
  getMasteryGain,
  getNextStep,
  getRewardHeadline,
  getRewardTone
} from "../lib/celebration";
import { getClosetSpendHint } from "../lib/avatar-catalog";
import { type AppLocale } from "../lib/locale";

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
  unlockedAvatarItems,
  locale
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
  locale: AppLocale;
}) {
  const isMalay = locale === "ms";
  const masteryGain = getMasteryGain({ stars, accuracyPercent });
  const tone = getRewardTone(stars);
  const nextStep = getNextStep({ subjectSlug, moduleSlug });
  const learningFeedback = getLearningFeedback({ subjectSlug, moduleSlug, stars, accuracyPercent });
  const closetSpendHint = typeof totalPoints === "number" ? getClosetSpendHint(totalPoints) : null;

  return (
    <article className={`reward-burst reward-burst-${tone}`}>
      <div className="reward-burst-head">
        <div>
          <p className="dashboard-label">{isMalay ? "Ganjaran misi" : "Mission reward"}</p>
          <h3>{getRewardHeadline(stars)}</h3>
        </div>
        <span className="reward-stars">{Array.from({ length: stars }, () => "★").join(" ")}</span>
      </div>

      <p className="dashboard-helper">
        {isMalay
          ? `${moduleName} baru sahaja mengemas kini dashboard, gelung ganjaran, dan ekonomi avatar anda dalam satu langkah.`
          : `${moduleName} just fed your dashboard, rewards loop, and avatar economy in one move.`}
      </p>

      <div className="reward-unlock-list">
        <p className="dashboard-label">{isMalay ? "Maklum balas pembelajaran" : "Learning feedback"}</p>
        <strong>{learningFeedback.headline}</strong>
        <p className="dashboard-helper">{learningFeedback.focus}</p>
      </div>

      <div className="reward-burst-grid">
        <div className="reward-chip">
          <span className="dashboard-label">{isMalay ? "Mata Bintang" : "Star Points"}</span>
          <strong>+{starPoints}</strong>
        </div>
        <div className="reward-chip">
          <span className="dashboard-label">{isMalay ? "Penguasaan" : "Mastery"}</span>
          <strong>+{masteryGain}%</strong>
        </div>
        <div className="reward-chip">
          <span className="dashboard-label">{isMalay ? "Ketepatan" : "Accuracy"}</span>
          <strong>{accuracyPercent}%</strong>
        </div>
        <div className="reward-chip">
          <span className="dashboard-label">{isMalay ? "Dorongan lencana" : "Badge nudge"}</span>
          <strong>{getBadgeNudge({ stars, accuracyPercent })}</strong>
        </div>
      </div>

      {bonusPoints ? (
        <div className="reward-unlock-list">
          <p className="dashboard-label">{isMalay ? "Bonus drop mingguan" : "Weekly drop bonus"}</p>
          <strong>
            +{bonusPoints} {isMalay ? "mata daripada" : "pts from"} {weeklyDropHeadline || (isMalay ? "drop minggu ini" : "this week&apos;s drop")}.
          </strong>
        </div>
      ) : null}

      {typeof totalPoints === "number" ? (
        <p className="dashboard-helper">
          {isMalay
            ? `Jumlah dompet: ${totalPoints} mata. Ini membawa pelajar lebih dekat kepada unlock almari seterusnya.`
            : `Wallet total: ${totalPoints} pts. That gets students closer to the next closet unlock.`}
        </p>
      ) : null}
      {closetSpendHint ? (
        <div className="reward-unlock-list">
          <p className="dashboard-label">
            {closetSpendHint.canBuyNow
              ? isMalay
                ? "Sedia dibelanja"
                : "Ready to spend"
              : isMalay
                ? "Sasaran almari"
                : "Closet target"}
          </p>
          <strong>{closetSpendHint.helper}</strong>
        </div>
      ) : null}
      {unlockedAvatarItems?.length ? (
        <div className="reward-unlock-list">
          <p className="dashboard-label">{isMalay ? "Unlock almari baharu" : "New closet unlock"}</p>
          {unlockedAvatarItems.map((item) => (
            <strong key={item.code}>
              {isMalay ? `${item.name} baru sahaja masuk ke almari avatar.` : `${item.name} just entered the avatar closet.`}
            </strong>
          ))}
        </div>
      ) : null}

      <div className="reward-next-step">
        <div className="reward-next-step-copy">
          <p className="dashboard-label">{isMalay ? "Langkah seterusnya" : "Next move"}</p>
          <strong>{nextStep.label}</strong>
          <p className="dashboard-helper">{nextStep.helper}</p>
        </div>
        <div className="hero-actions">
          <a className="btn btn-primary" href={nextStep.href}>
            {nextStep.label}
          </a>
          <a className="btn btn-secondary" href="/avatar">
            {isMalay ? "Belanja mata di almari" : "Spend points in closet"}
          </a>
        </div>
      </div>
    </article>
  );
}
