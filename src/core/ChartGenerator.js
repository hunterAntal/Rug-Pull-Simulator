/**
 * ChartGenerator - Generates price curves for meme coin rounds
 * Ensures house edge through probability distribution
 */
export class ChartGenerator {
  constructor() {
    this.ROUND_TYPES = {
      INSTANT_LOSS: { probability: 0.40, name: 'instant_loss' },
      SMALL_PEAK: { probability: 0.35, name: 'small_peak' },
      MEDIUM_PEAK: { probability: 0.20, name: 'medium_peak' },
      MOON_SHOT: { probability: 0.05, name: 'moon_shot' }
    };

    this.OPENING_PATTERNS = {
      STABLE_START: { probability: 0.30, name: 'stable_start' },
      PUMP_START: { probability: 0.20, name: 'pump_start' },
      DUMP_START: { probability: 0.35, name: 'dump_start' },
      EXTREME_DUMP: { probability: 0.15, name: 'extreme_dump' }
    };
  }

  /**
   * Generate complete price curve for a round
   * @param {number} durationSeconds - Round duration in seconds
   * @returns {Object} Chart data with type, peak multiplier, and price points
   */
  generateChart(durationSeconds) {
    const roundType = this.selectRoundType();
    const openingPattern = this.selectOpeningPattern();
    const samplesPerSecond = 10; // 10 price points per second for smooth animation
    const totalSamples = durationSeconds * samplesPerSecond;

    let pricePoints;
    let peakMultiplier;

    switch (roundType) {
      case 'instant_loss':
        peakMultiplier = 0;
        pricePoints = this.generateInstantLoss(totalSamples, durationSeconds, openingPattern);
        break;

      case 'small_peak':
        peakMultiplier = this.random(1.1, 1.3);
        pricePoints = this.generatePeakCurve(totalSamples, durationSeconds, peakMultiplier, openingPattern);
        break;

      case 'medium_peak':
        peakMultiplier = this.random(1.5, 2.0);
        pricePoints = this.generatePeakCurve(totalSamples, durationSeconds, peakMultiplier, openingPattern);
        break;

      case 'moon_shot':
        peakMultiplier = this.random(3.0, 5.0);
        pricePoints = this.generatePeakCurve(totalSamples, durationSeconds, peakMultiplier, openingPattern);
        break;
    }

    return {
      type: roundType,
      openingPattern,
      peakMultiplier,
      pricePoints,
      duration: durationSeconds
    };
  }

  /**
   * Select round type based on probability distribution
   * @returns {string} Round type name
   */
  selectRoundType() {
    const rand = Math.random();
    let cumulative = 0;

    for (const [key, value] of Object.entries(this.ROUND_TYPES)) {
      cumulative += value.probability;
      if (rand <= cumulative) {
        return value.name;
      }
    }

    return this.ROUND_TYPES.INSTANT_LOSS.name; // Fallback
  }

  /**
   * Select opening pattern based on probability distribution
   * @returns {string} Opening pattern name
   */
  selectOpeningPattern() {
    const rand = Math.random();
    let cumulative = 0;

    for (const [key, value] of Object.entries(this.OPENING_PATTERNS)) {
      cumulative += value.probability;
      if (rand <= cumulative) {
        return value.name;
      }
    }

    return this.OPENING_PATTERNS.STABLE_START.name; // Fallback
  }

  /**
   * Get opening price based on pattern
   * @param {string} pattern - Opening pattern name
   * @returns {number} Opening price
   */
  getOpeningPrice(pattern) {
    switch (pattern) {
      case 'stable_start':
        return this.random(0.95, 1.05);
      case 'pump_start':
        return this.random(1.15, 1.30);
      case 'dump_start':
        return this.random(0.70, 0.90);
      case 'extreme_dump':
        return this.random(0.50, 0.70);
      default:
        return 1.0;
    }
  }

  /**
   * Generate instant loss curve (exponential decay)
   * @param {number} samples - Number of data points
   * @param {number} duration - Duration in seconds
   * @param {string} openingPattern - Opening volatility pattern
   * @returns {Array} Price points
   */
  generateInstantLoss(samples, duration, openingPattern) {
    const pricePoints = [];
    const startPrice = 1.0;
    const openingPrice = this.getOpeningPrice(openingPattern);
    const openingDuration = this.random(1.0, 2.0); // 1-2 seconds for opening
    const openingSamples = Math.floor((openingDuration / duration) * samples);

    // Generate opening sequence (transition from $1.00 to opening price)
    for (let i = 0; i < openingSamples; i++) {
      const progress = i / openingSamples;
      const time = (i / samples) * duration;

      // Smooth transition with volatility
      const basePrice = startPrice + (openingPrice - startPrice) * this.easeInOutCubic(progress);
      const volatility = this.noise() * 0.05;
      const price = Math.max(0.1, basePrice + volatility);

      pricePoints.push({
        time: time,
        price: price,
        day: Math.floor(time) + 1
      });
    }

    // Continue from opening price with exponential decay
    const decayRate = 0.5;
    const remainingSamples = samples - openingSamples;

    for (let i = 0; i < remainingSamples; i++) {
      const timeRatio = i / remainingSamples;
      const time = openingDuration + (timeRatio * (duration - openingDuration));

      // Exponential decay from opening price
      let price = openingPrice * Math.exp(-decayRate * timeRatio);

      // Add occasional false hope pump for pump starts
      if (openingPattern === 'pump_start' && timeRatio < 0.3) {
        price *= 1.1; // Brief continuation of pump before crash
      }

      price += this.noise() * 0.02;
      price = Math.max(0, price);

      pricePoints.push({
        time: time,
        price: price,
        day: Math.floor(time) + 1
      });
    }

    // Ensure final price is 0
    pricePoints[pricePoints.length - 1].price = 0;

    return pricePoints;
  }

  /**
   * Generate peak curve (rise then crash)
   * @param {number} samples - Number of data points
   * @param {number} duration - Duration in seconds
   * @param {number} peakMultiplier - Maximum multiplier to reach
   * @param {string} openingPattern - Opening volatility pattern
   * @returns {Array} Price points
   */
  generatePeakCurve(samples, duration, peakMultiplier, openingPattern) {
    const pricePoints = [];
    const startPrice = 1.0;
    const openingPrice = this.getOpeningPrice(openingPattern);
    const openingDuration = this.random(1.0, 2.0); // 1-2 seconds for opening
    const openingSamples = Math.floor((openingDuration / duration) * samples);

    // Generate opening sequence (transition from $1.00 to opening price)
    for (let i = 0; i < openingSamples; i++) {
      const progress = i / openingSamples;
      const time = (i / samples) * duration;

      // Smooth transition with volatility
      const basePrice = startPrice + (openingPrice - startPrice) * this.easeInOutCubic(progress);
      const volatility = this.noise() * 0.05;
      const price = Math.max(0.1, basePrice + volatility);

      pricePoints.push({
        time: time,
        price: price,
        day: Math.floor(time) + 1
      });
    }

    // Continue with rise to peak from opening price
    const remainingSamples = samples - openingSamples;
    const remainingDuration = duration - openingDuration;

    // Peak occurs 30-60% through the REMAINING time
    const peakTimeRatio = this.random(0.3, 0.6);
    const peakSample = Math.floor(remainingSamples * peakTimeRatio);

    for (let i = 0; i < remainingSamples; i++) {
      const timeRatio = i / remainingSamples;
      const time = openingDuration + (timeRatio * remainingDuration);
      let price;

      if (i <= peakSample) {
        // Rise phase - from opening price to peak
        const riseProgress = i / peakSample;
        const easedProgress = this.easeInOutCubic(riseProgress);

        // If we dumped at start, need to recover first then climb
        if (openingPrice < 1.0) {
          // Recovery + growth
          if (riseProgress < 0.4) {
            // First 40% is recovery to $1.00
            const recoveryProgress = riseProgress / 0.4;
            price = openingPrice + (1.0 - openingPrice) * recoveryProgress;
          } else {
            // Next 60% is growth to peak
            const growthProgress = (riseProgress - 0.4) / 0.6;
            price = 1.0 + (peakMultiplier - 1.0) * growthProgress;
          }
        } else {
          // Started high, just grow to peak
          price = openingPrice + (peakMultiplier - openingPrice) * easedProgress;
        }

        // Add realistic volatility
        price += this.noise() * 0.03;
      } else {
        // Crash phase - quadratic decay (faster crash)
        const crashProgress = (i - peakSample) / (remainingSamples - peakSample);
        const easedCrash = Math.pow(crashProgress, 2);
        price = peakMultiplier * (1 - easedCrash);

        // Add panic-selling volatility
        price += this.noise() * 0.05;
      }

      price = Math.max(0, price); // Ensure non-negative

      pricePoints.push({
        time: time,
        price: price,
        day: Math.floor(time) + 1
      });
    }

    // Ensure final price is 0
    pricePoints[pricePoints.length - 1].price = 0;

    return pricePoints;
  }

  /**
   * Generate random number between min and max
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  random(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * Generate noise for price fluctuation
   * @returns {number} Random noise between -1 and 1
   */
  noise() {
    return (Math.random() - 0.5) * 2;
  }

  /**
   * Easing function for smooth animations
   * @param {number} t - Progress from 0 to 1
   * @returns {number} Eased value
   */
  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Get price at specific time
   * @param {Array} pricePoints - Chart price points
   * @param {number} currentTime - Current time in seconds
   * @returns {number} Interpolated price
   */
  getPriceAtTime(pricePoints, currentTime) {
    if (!pricePoints || pricePoints.length === 0) return 1.0;
    if (currentTime <= 0) return pricePoints[0].price;
    if (currentTime >= pricePoints[pricePoints.length - 1].time) {
      return pricePoints[pricePoints.length - 1].price;
    }

    // Find surrounding points and interpolate
    for (let i = 0; i < pricePoints.length - 1; i++) {
      if (pricePoints[i].time <= currentTime && pricePoints[i + 1].time > currentTime) {
        const t = (currentTime - pricePoints[i].time) /
                  (pricePoints[i + 1].time - pricePoints[i].time);
        return pricePoints[i].price + t * (pricePoints[i + 1].price - pricePoints[i].price);
      }
    }

    return pricePoints[pricePoints.length - 1].price;
  }
}
