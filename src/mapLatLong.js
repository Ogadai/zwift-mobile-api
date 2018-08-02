const maps = {
  1: {
    toXY: (lat, long) => ({
      x: Math.round((lat - 348.35518) * 11050000),
      y: Math.round((long - 166.95292) * 10920000)
    }),
    offset: {
      lat: 360,
      long: 0
    }
  },
  2: {
    toXY: (lat, long) => ({
      x: Math.round((lat - 37.54303) * 11080000),
      y: Math.round((long - 282.56252) * 8790000)
    }),
    offset: {
      lat: 0,
      long: 360
    }
  },
  3: {
    toXY: (lat, long) => ({
      x: Math.round((long - 359.8321) * 6940000),
      y: -Math.round((lat - 51.50175) * 11130000)
    }),
    offset: {
      lat: 0,
      long: 360
    }
  },
  5: {
    toXY: (lat, long) => ({
      x: Math.round((long - 11.3958) * 7500000),
      y: -Math.round((lat - 47.2728) * 11130000)
    }),
    offset: {
      lat: 0,
      long: 0
    }
  }
}

module.exports = maps
