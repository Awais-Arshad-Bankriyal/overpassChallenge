export default () => ({
    overpassUrl: process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter',
    cacheTtl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
    database: {
      type: 'sqlite',
      database: 'landmarks.db',
      synchronize: true,
      logging: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    },
  });