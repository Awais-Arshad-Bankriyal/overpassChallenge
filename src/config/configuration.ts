export default () => ({
  overpassUrl: process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter', 
  cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10), 
  database: {
    type: 'sqlite',
    database: process.env.DATABASE_DATABASE || 'landmarks.db', 
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, 
    logging: true, 
  },
});