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
  }

  /**
   * Generate complete price curve for a round
   * @param {number} durationSeconds - Round duration in seconds
   * @returns {Object} Chart data with type, peak multiplier, and price points
   */
  generateChart(durationSeconds) {
    const roundType = this.selectRoundType();
    const samplesPerSecond = 10; // 10 price points per second for smooth animation
    const totalSamples = durationSeconds * samplesPerSecond;

    let pricePoints;
    let peakMultiplier;

    switch (roundType) {
      case 'instant_loss':
        peakMultiplier = 0;
        pricePoints = this.generateInstantLoss(totalSamples, durationSeconds);
        break;

      case 'small_peak':
        peakMultiplier = this.random(1.1, 1.3);
        pricePoints = this.generatePeakCurve(totalSamples, durationSeconds, peakMultiplier);
        break;

      case 'medium_peak':
        peakMultiplier = this.random(1.5, 2.0);
        pricePoints = this.generatePeakCurve(totalSamples, durationSeconds, peakMultiplier);
        break;

      case 'moon_shot':
        peakMultiplier = this.random(3.0, 5.0);
        pricePoints = this.generatePeakCurve(totalSamples, durationSeconds, peakMultiplier);
        break;
    }

    return {
      type: roundType,
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
   * Generate instant loss curve (exponential decay)
   * @param {number} samples - Number of data points
   * @param {number} duration - Duration in seconds
   * @returns {Array} Price points
   */
  generateInstantLoss(samples, duration) {
    const pricePoints = [];
    const startPrice = 1.0;
    const openingDuration = this.random(1.5, 3.0); // 1.5-3 seconds of chaos
    const openingSamples = Math.floor((openingDuration / duration) * samples);

    // Generate extreme opening chaos (8-15 violent swings)
    const chaosPoints = this.generateOpeningChaos(openingDuration);
    const ticksPerSwing = Math.floor(openingSamples / chaosPoints.length);

    // Interpolate chaos points with smooth curves between swings
    for (let i = 0; i < chaosPoints.length - 1; i++) {
      const currentPoint = chaosPoints[i];
      const nextPoint = chaosPoints[i + 1];

      for (let j = 0; j < ticksPerSwing; j++) {
        const progress = j / ticksPerSwing;
        const time = currentPoint.time + progress * (nextPoint.time - currentPoint.time);
        const price = currentPoint.price + progress * (nextPoint.price - currentPoint.price);

        pricePoints.push({
          time: time,
          price: price,
          day: Math.floor(time) + 1
        });
      }
    }

    // Add final chaos point
    const finalChaos = chaosPoints[chaosPoints.length - 1];
    pricePoints.push({
      time: finalChaos.time,
      price: finalChaos.price,
      day: Math.floor(finalChaos.time) + 1
    });

    // Continue from final chaos price with exponential decay
    const decayRate = 0.5;
    const remainingSamples = samples - pricePoints.length;
    const finalChaosPrice = finalChaos.price;

    for (let i = 0; i < remainingSamples; i++) {
      const timeRatio = i / remainingSamples;
      const time = openingDuration + (timeRatio * (duration - openingDuration));

      // Exponential decay from final chaos price
      let price = finalChaosPrice * Math.exp(-decayRate * timeRatio);

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
   * @returns {Array} Price points
   */
  generatePeakCurve(samples, duration, peakMultiplier) {
    const pricePoints = [];
    const startPrice = 1.0;
    const openingDuration = this.random(1.5, 3.0); // 1.5-3 seconds of chaos
    const openingSamples = Math.floor((openingDuration / duration) * samples);

    // Generate extreme opening chaos (8-15 violent swings)
    const chaosPoints = this.generateOpeningChaos(openingDuration);
    const ticksPerSwing = Math.floor(openingSamples / chaosPoints.length);

    // Interpolate chaos points with smooth curves between swings
    for (let i = 0; i < chaosPoints.length - 1; i++) {
      const currentPoint = chaosPoints[i];
      const nextPoint = chaosPoints[i + 1];

      for (let j = 0; j < ticksPerSwing; j++) {
        const progress = j / ticksPerSwing;
        const time = currentPoint.time + progress * (nextPoint.time - currentPoint.time);
        const price = currentPoint.price + progress * (nextPoint.price - currentPoint.price);

        pricePoints.push({
          time: time,
          price: price,
          day: Math.floor(time) + 1
        });
      }
    }

    // Add final chaos point
    const finalChaos = chaosPoints[chaosPoints.length - 1];
    pricePoints.push({
      time: finalChaos.time,
      price: finalChaos.price,
      day: Math.floor(finalChaos.time) + 1
    });

    // Continue with rise to peak from final chaos price
    const remainingSamples = samples - pricePoints.length;
    const remainingDuration = duration - openingDuration;
    const finalChaosPrice = finalChaos.price;

    // Peak occurs 30-60% through the REMAINING time
    const peakTimeRatio = this.random(0.3, 0.6);
    const peakSample = Math.floor(remainingSamples * peakTimeRatio);

    for (let i = 0; i < remainingSamples; i++) {
      const timeRatio = i / remainingSamples;
      const time = openingDuration + (timeRatio * remainingDuration);
      let price;

      if (i <= peakSample) {
        // Rise phase - from final chaos price to peak
        const riseProgress = i / peakSample;
        const easedProgress = this.easeInOutCubic(riseProgress);

        // If we ended chaos low, need to recover first then climb
        if (finalChaosPrice < 1.0) {
          // Recovery + growth
          if (riseProgress < 0.4) {
            // First 40% is recovery to $1.00
            const recoveryProgress = riseProgress / 0.4;
            price = finalChaosPrice + (1.0 - finalChaosPrice) * recoveryProgress;
          } else {
            // Next 60% is growth to peak
            const growthProgress = (riseProgress - 0.4) / 0.6;
            price = 1.0 + (peakMultiplier - 1.0) * growthProgress;
          }
        } else {
          // Ended chaos high, just grow to peak
          price = finalChaosPrice + (peakMultiplier - finalChaosPrice) * easedProgress;
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
   * Generate extreme opening chaos (8-15 violent swings in 1.5-3 seconds)
   * @param {number} duration - Opening duration in seconds
   * @returns {Array} Chaos price points
   */
  generateOpeningChaos(duration) {
    const points = [];
    const tickInterval = 0.15; // Direction change every 150ms
    const numSwings = Math.floor(duration / tickInterval);

    let price = 1.00;
    let direction = Math.random() > 0.5 ? 1 : -1;

    points.push({ time: 0, price: 1.00 });

    for (let i = 1; i <= numSwings; i++) {
      // Random swing magnitude 10-35%
      const swingPercent = this.random(0.10, 0.35);
      const swingAmount = price * swingPercent * direction;

      price = price + swingAmount;
      price = Math.max(0.25, Math.min(1.60, price)); // Clamp $0.25-$1.60

      points.push({
        time: i * tickInterval,
        price: price
      });

      // 70% chance to reverse direction (creates unpredictable chop)
      if (Math.random() < 0.70) {
        direction *= -1;
      }
    }

    return points;
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
