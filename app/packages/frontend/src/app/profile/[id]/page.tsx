import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedList } from "@/components/feed/FeedList";
import { ProfileFollowGraph } from "@/components/profile/ProfileFollowGraph";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { loadLocalProfile } from "@/components/profile/profile-snapshot";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Offline profile",
  description:
    "Hash-bound local example profile from the Pump reconstruction workspace",
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const result = await loadLocalProfile(id);
  if (!result.ok && result.reason !== "invalid-data") notFound();

  if (!result.ok) {
    return (
      <div className="profile-page">
        <p className="eyebrow">Profile</p>
        <h1>Local profile unavailable</h1>
        <section className="feed-state-card" data-testid="profile-data-error">
          <span className="feed-state-mark" aria-hidden="true">
            !
          </span>
          <h2>Validated profile data could not be loaded</h2>
          <p>
            The checked-in user or post seed failed provenance or shape
            validation. No fallback identity, live request, or fabricated
            profile was generated.
          </p>
        </section>
      </div>
    );
  }

  const { profile } = result;
  return (
    <div className="profile-page" data-profile-kind={profile.kind}>
      <aside className="profile-provenance" aria-label="Profile data source">
        <strong>Local synthetic example — not a real Pump.fun user</strong>
        <span>
          This identity and its posts come from the hash-bound backend test
          seeds. Counts are locally recorded examples, not live social data.
        </span>
      </aside>

      {profile.banned ? (
        <aside
          className="profile-ban-notice"
          role="status"
          data-testid="banned-profile"
        >
          This local example is marked banned. Active-account and social actions
          are not shown.
        </aside>
      ) : null}

      <ProfileHeader profile={profile} />

      <ProfileFollowGraph result={result.followGraph} />

      <section className="profile-posts" aria-labelledby="profile-posts-title">
        <div className="profile-section-heading">
          <div>
            <p className="eyebrow">Read-only activity</p>
            <h2 id="profile-posts-title">Posts</h2>
          </div>
          <span>
            {profile.posts.length} visible root{" "}
            {profile.posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
        <FeedList items={profile.posts} />
      </section>
    </div>
  );
}
