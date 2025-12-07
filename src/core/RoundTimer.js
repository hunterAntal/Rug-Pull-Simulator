/**
 * RoundTimer - Manages round timing and day counter
 */
export class RoundTimer {
  constructor() {
    this.reset();
  }

  /**
   * Start timer for a new round
   * @param {number} duration - Round duration in seconds
   */
  start(duration) {
    this.duration = duration;
    this.startTime = Date.now();
    this.endTime = this.startTime + (duration * 1000);
    this.isActive = true;
    this.isPaused = false;
  }

  /**
   * Reset timer
   */
  reset() {
    this.duration = 0;
    this.startTime = 0;
    this.endTime = 0;
    this.isActive = false;
    this.isPaused = false;
  }

  /**
   * Get current elapsed time in seconds
   * @returns {number}
   */
  getElapsedTime() {
    if (!this.isActive) return 0;
    if (this.isPaused) return this.pausedAt - this.startTime;

    const now = Date.now();
    const elapsed = (now - this.startTime) / 1000;
    return Math.min(elapsed, this.duration);
  }

  /**
   * Get remaining time in seconds
   * @returns {number}
   */
  getRemainingTime() {
    return Math.max(0, this.duration - this.getElapsedTime());
  }

  /**
   * Get current day (floor of elapsed time + 1)
   * @returns {number}
   */
  getCurrentDay() {
    return Math.floor(this.getElapsedTime()) + 1;
  }

  /**
   * Check if round is over
   * @returns {boolean}
   */
  isOver() {
    if (!this.isActive) return false;
    return this.getElapsedTime() >= this.duration;
  }

  /**
   * Get progress as percentage (0-100)
   * @returns {number}
   */
  getProgress() {
    if (!this.isActive || this.duration === 0) return 0;
    return Math.min(100, (this.getElapsedTime() / this.duration) * 100);
  }

  /**
   * Pause timer
   */
  pause() {
    if (!this.isActive || this.isPaused) return;
    this.isPaused = true;
    this.pausedAt = Date.now();
  }

  /**
   * Resume timer
   */
  resume() {
    if (!this.isPaused) return;
    const pauseDuration = Date.now() - this.pausedAt;
    this.startTime += pauseDuration;
    this.endTime += pauseDuration;
    this.isPaused = false;
  }

  /**
   * Stop timer
   */
  stop() {
    this.isActive = false;
  }
}
