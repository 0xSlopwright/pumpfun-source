import Link from "next/link";
import type { LocalFollowGraphResult } from "./profile-follow-graph";
import styles from "./profile-follow-graph.module.css";

export function ProfileFollowGraph({
  result,
}: {
  result: LocalFollowGraphResult;
}) {
  return (
    <section
      className={styles.graph}
      aria-labelledby="local-follow-graph-title"
    >
      <div>
        <p className="eyebrow">Read-only synthetic relationships</p>
        <h2 id="local-follow-graph-title">Local follow graph</h2>
        <p className={styles.note}>
          These seeded relationships are separate from the recorded profile
          counts above.
        </p>
      </div>
      {!result.ok ? (
        <p role="status">
          Local relationships are unavailable because the graph could not be
          validated. Profile details and posts remain available.
        </p>
      ) : (
        <>
          <p className={styles.note}>
            All recorded relationships, ordered by each profile’s recorded
            follower count.
          </p>
          <div className={styles.columns}>
            {(["followers", "following"] as const).map((direction) => {
              const members = result.graph[direction];
              return (
                <section
                  key={direction}
                  aria-labelledby={`local-${direction}-title`}
                >
                  <h3 id={`local-${direction}-title`}>
                    Local {direction} ({members.length})
                  </h3>
                  {members.length ? (
                    <ul className={styles.list}>
                      {members.map((member) => (
                        <li key={member.identifier}>
                          <Link
                            prefetch={false}
                            href={`/profile/${encodeURIComponent(member.identifier)}`}
                          >
                            {member.displayName}
                          </Link>
                          <span>
                            {member.kind === "group"
                              ? "Local group"
                              : "Local person"}
                            {member.banned ? " · Marked banned" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.note}>
                      No {direction} are recorded in this local graph.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
