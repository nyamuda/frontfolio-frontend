export interface SuppressEmit {
  /**
   * Indicates whether a watcher-triggered emit should be skipped.
   * Useful when a change (like delete or manual update) has already been handled,
   * and you want to prevent triggering duplicate updates or autosave logic.
   */
  suppress: boolean;
}
