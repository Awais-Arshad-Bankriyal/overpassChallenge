export default () => ({
  overpassUrl: process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter', // Default Overpass URL
  cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10), // Default cache TTL: 1 hour
  database: {
    type: 'sqlite',
    database: process.env.DATABASE_DATABASE || 'landmarks.db', // Default SQLite database file
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Automatically create database schema (for development only)
    logging: true, // Log SQL queries
  },
});