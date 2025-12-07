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
   * Generate instant loss curve (random segments until instant crash)
   * @param {number} samples - Number of data points
   * @param {number} duration - Duration in seconds
   * @returns {Array} Price points
   */
  generateInstantLoss(samples, duration) {
    const pricePoints = [];
    const tickInterval = 0.1; // 10 points per second
    const crashTime = duration - this.random(0.2, 0.4); // Crash 0.2-0.4s before end

    // Generate opening chaos (1.5-2.5s)
    const openingDuration = this.random(1.5, 2.5);
    const openingPoints = this.generateOpeningChaos(openingDuration);

    openingPoints.forEach(point => {
      pricePoints.push({
        time: point.time,
        price: point.price,
        day: Math.floor(point.time) + 1
      });
    });

    let currentPrice = openingPoints[openingPoints.length - 1].price;
    let currentTime = openingPoints[openingPoints.length - 1].time;

    // Generate random segments until crash time
    let loopSafety = 0;
    while (currentTime < crashTime && loopSafety < 1000) {
      loopSafety++;

      const segmentDuration = this.random(0.5, 2.0);
      const actualDuration = Math.min(segmentDuration, crashTime - currentTime);

      // Skip segments that are too short to generate points
      if (actualDuration < tickInterval) {
        currentTime = crashTime;
        break;
      }

      const segmentType = this.selectSegmentType();
      const segmentPoints = this.generateSegment(
        segmentType,
        currentPrice,
        currentTime,
        actualDuration,
        tickInterval
      );

      segmentPoints.forEach(point => {
        pricePoints.push({
          time: point.time,
          price: point.price,
          day: Math.floor(point.time) + 1
        });
      });

      if (segmentPoints.length > 0) {
        currentPrice = segmentPoints[segmentPoints.length - 1].price;
        currentTime = segmentPoints[segmentPoints.length - 1].time;
      } else {
        // Safeguard: if no points generated, advance time anyway
        currentTime += actualDuration;
      }
    }

    // Instant vertical crash to 0
    pricePoints.push({
      time: crashTime,
      price: 0,
      day: Math.floor(crashTime) + 1
    });

    return pricePoints;
  }

  /**
   * Generate peak curve (rise to peak with random segments, then instant crash)
   * @param {number} samples - Number of data points
   * @param {number} duration - Duration in seconds
   * @param {number} peakMultiplier - Maximum multiplier to reach
   * @returns {Array} Price points
   */
  generatePeakCurve(samples, duration, peakMultiplier) {
    const pricePoints = [];
    const tickInterval = 0.1; // 10 points per second
    const crashTime = duration - this.random(0.2, 0.4); // Crash 0.2-0.4s before end

    // Generate opening chaos (1.5-2.5s)
    const openingDuration = this.random(1.5, 2.5);
    const openingPoints = this.generateOpeningChaos(openingDuration);

    openingPoints.forEach(point => {
      pricePoints.push({
        time: point.time,
        price: point.price,
        day: Math.floor(point.time) + 1
      });
    });

    let currentPrice = openingPoints[openingPoints.length - 1].price;
    let currentTime = openingPoints[openingPoints.length - 1].time;

    // Determine when to hit peak (30-60% through remaining time)
    const remainingTime = crashTime - currentTime;
    const peakTime = currentTime + (remainingTime * this.random(0.3, 0.6));
    let hasReachedPeak = false;
    let peakReached = false;

    // Generate random segments, biasing toward peak target
    let loopSafety = 0;
    while (currentTime < crashTime && loopSafety < 1000) {
      loopSafety++;

      const segmentDuration = this.random(0.5, 2.0);
      const actualDuration = Math.min(segmentDuration, crashTime - currentTime);

      // Skip segments that are too short to generate points
      if (actualDuration < tickInterval) {
        currentTime = crashTime;
        break;
      }

      // Before peak: bias toward upward segments
      // After peak: random segments (no crash telegraph)
      let segmentType;
      if (currentTime < peakTime && currentPrice < peakMultiplier) {
        // Approaching peak - favor upward movement
        segmentType = this.selectSegmentType(true); // upward bias
      } else {
        // At or past peak - random segments (no bias)
        segmentType = this.selectSegmentType(false);
        peakReached = true;
      }

      const segmentPoints = this.generateSegment(
        segmentType,
        currentPrice,
        currentTime,
        actualDuration,
        tickInterval,
        peakReached ? null : peakMultiplier // target peak if not reached
      );

      segmentPoints.forEach(point => {
        pricePoints.push({
          time: point.time,
          price: point.price,
          day: Math.floor(point.time) + 1
        });
      });

      if (segmentPoints.length > 0) {
        currentPrice = segmentPoints[segmentPoints.length - 1].price;
        currentTime = segmentPoints[segmentPoints.length - 1].time;
      } else {
        // Safeguard: if no points generated, advance time anyway
        currentTime += actualDuration;
      }
    }

    // Instant vertical crash to 0
    pricePoints.push({
      time: crashTime,
      price: 0,
      day: Math.floor(crashTime) + 1
    });

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
   * Select segment type for chart
   * @param {boolean} upwardBias - If true, favor upward segments
   * @returns {string} Segment type
   */
  selectSegmentType(upwardBias = false) {
    const rand = Math.random();

    if (upwardBias) {
      // Favor upward movement when approaching peak
      if (rand < 0.35) return 'spike_up';       // 35%
      if (rand < 0.60) return 'gradual_climb';  // 25%
      if (rand < 0.75) return 'choppy';         // 15%
      if (rand < 0.85) return 'flat';           // 10%
      if (rand < 0.95) return 'spike_down';     // 10%
      return 'gradual_fall';                    // 5%
    }

    // Normal distribution (no bias)
    if (rand < 0.20) return 'flat';           // 20%
    if (rand < 0.40) return 'spike_up';       // 20%
    if (rand < 0.60) return 'spike_down';     // 20%
    if (rand < 0.75) return 'choppy';         // 15%
    if (rand < 0.90) return 'gradual_climb';  // 15%
    return 'gradual_fall';                    // 10%
  }

  /**
   * Generate a segment of price movement
   * @param {string} type - Segment type
   * @param {number} startPrice - Starting price
   * @param {number} startTime - Starting time
   * @param {number} duration - Segment duration
   * @param {number} tickInterval - Time between points
   * @param {number} peakTarget - Optional peak to aim toward
   * @returns {Array} Price points
   */
  generateSegment(type, startPrice, startTime, duration, tickInterval, peakTarget = null) {
    const points = [];
    const numTicks = Math.floor(duration / tickInterval);
    let price = startPrice;

    switch (type) {
      case 'flat':
        // Sideways with tiny noise
        for (let i = 1; i <= numTicks; i++) {
          price = startPrice + this.random(-0.03, 0.03) * startPrice;
          points.push({
            time: startTime + (i * tickInterval),
            price: Math.max(0.20, price)
          });
        }
        break;

      case 'spike_up':
        // Sharp pump then stabilize
        let pumpTarget = startPrice * this.random(1.15, 1.40);
        if (peakTarget && pumpTarget > peakTarget) {
          pumpTarget = peakTarget; // Don't overshoot peak
        }
        for (let i = 1; i <= numTicks; i++) {
          const progress = i / numTicks;
          if (progress < 0.3) {
            // Fast pump (first 30% of segment)
            price = startPrice + (pumpTarget - startPrice) * (progress / 0.3);
          } else {
            // Stabilize with noise
            price = pumpTarget + this.random(-0.05, 0.05) * pumpTarget;
          }
          points.push({
            time: startTime + (i * tickInterval),
            price: Math.max(0.20, price)
          });
        }
        break;

      case 'spike_down':
        // Sharp dump then stabilize
        const dumpTarget = startPrice * this.random(0.65, 0.85);
        for (let i = 1; i <= numTicks; i++) {
          const progress = i / numTicks;
          if (progress < 0.3) {
            // Fast dump
            price = startPrice - (startPrice - dumpTarget) * (progress / 0.3);
          } else {
            // Stabilize with noise
            price = dumpTarget + this.random(-0.05, 0.05) * dumpTarget;
          }
          points.push({
            time: startTime + (i * tickInterval),
            price: Math.max(0.20, price)
          });
        }
        break;

      case 'choppy':
        // Violent back and forth
        let direction = Math.random() > 0.5 ? 1 : -1;
        for (let i = 1; i <= numTicks; i++) {
          const swing = this.random(0.08, 0.20) * price * direction;
          price = price + swing;
          price = Math.max(0.20, price);

          // 65% chance to flip direction
          if (Math.random() < 0.65) direction *= -1;

          points.push({
            time: startTime + (i * tickInterval),
            price: price
          });
        }
        break;

      case 'gradual_climb':
        // Slow upward trend with noise
        let climbTarget = startPrice * this.random(1.10, 1.25);
        if (peakTarget && climbTarget > peakTarget) {
          climbTarget = peakTarget; // Don't overshoot peak
        }
        for (let i = 1; i <= numTicks; i++) {
          const progress = i / numTicks;
          const basePrice = startPrice + (climbTarget - startPrice) * progress;
          price = basePrice + this.random(-0.04, 0.04) * basePrice;
          points.push({
            time: startTime + (i * tickInterval),
            price: Math.max(0.20, price)
          });
        }
        break;

      case 'gradual_fall':
        // Slow downward trend with noise
        const fallTarget = startPrice * this.random(0.80, 0.92);
        for (let i = 1; i <= numTicks; i++) {
          const progress = i / numTicks;
          const basePrice = startPrice - (startPrice - fallTarget) * progress;
          price = basePrice + this.random(-0.04, 0.04) * basePrice;
          points.push({
            time: startTime + (i * tickInterval),
            price: Math.max(0.20, price)
          });
        }
        break;
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
