import { LocalMediaStore } from "./local-media-store.js";
import type { LocalMediaOptions } from "./local-media-routes.js";

export type LocalMediaEnvironment = {
  [key: string]: string | undefined;
  LOCAL_MEDIA_DIRECTORY?: string;
  LOCAL_MEDIA_TOKEN?: string;
  HOST?: string;
};

/** Server bootstrap only. No defaults, token generation, provider or browser configuration. */
export async function startWithLocalMedia<T>(
  environment: LocalMediaEnvironment,
  start: (localMedia: LocalMediaOptions | undefined) => Promise<T>,
): Promise<T> {
  const directory = environment.LOCAL_MEDIA_DIRECTORY;
  const token = environment.LOCAL_MEDIA_TOKEN;
  if (directory === undefined && token === undefined) return start(undefined);

  // Fail before touching disk when configuration is incomplete or exposure is unsafe.
  if (!directory?.trim() || directory.includes("\0") || !token) {
    throw new Error(
      "Local media requires both LOCAL_MEDIA_DIRECTORY and LOCAL_MEDIA_TOKEN.",
    );
  }
  if (!/^[A-Za-z0-9_-]{32,256}$/.test(token)) {
    throw new Error(
      "LOCAL_MEDIA_TOKEN must be a separate 32–256 character local capability.",
    );
  }
  if (!["127.0.0.1", "::1"].includes(environment.HOST ?? "127.0.0.1")) {
    throw new Error("Local media requires HOST=127.0.0.1 or HOST=::1.");
  }

  // Only a successfully acquired store is ours to close. A competing owner is never touched.
  const store = await LocalMediaStore.open(directory);
  try {
    return await start({ store, token });
  } catch (startupError) {
    try {
      // close() is idempotent if the app's onClose hook already released it.
      await store.close();
    } catch (cleanupError) {
      throw new AggregateError(
        [startupError, cleanupError],
        "Local media startup and cleanup both failed.",
      );
    }
    throw startupError;
  }
}
