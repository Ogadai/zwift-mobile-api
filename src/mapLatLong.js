const maps = {
  1: {
    toXY: (lat, long) => ({
      x: (lat - 348.3551) * 11050000,
      y: (long - 166.9529) * 10840000
    })
  },
  2: {
    toXY: (lat, long) => ({
      x: (lat - 37.54303) * 11080000,
      y: (long - 282.56252) * 8790000
    })
  },
  3: {
    toXY: (lat, long) => ({
      x: (long - 359.8321) * 6940000,
      y: (lat - 51.5017) * 11120000
    })
  }
}

export default maps;