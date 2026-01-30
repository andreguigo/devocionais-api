const allowedOriginsDev = [
  'http://localhost:3000',
  'http://localhost:5173',
]

const allowedOriginsProd = [
  'https://luminadevocionais.com',
  'https://www.luminadevocionais.com',
]

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? allowedOriginsProd
    : allowedOriginsDev

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(
      new Error(`CORS locked to origin: ${origin}`),
      false
    )
  },

  credentials: true,
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

module.exports = corsOptions