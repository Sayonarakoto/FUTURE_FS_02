import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  'test', // Database Name
  '4VD6zfMCmkVTYBm.root', // User
  '2OYzKRre2k64Rv5Y', // Password
  {
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    dialect: 'mysql',
    logging: console.log, // Set to console.log to see raw SQL
    dialectOptions: {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true, // TiDB Cloud requires SSL
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Verify Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✨ SEQUELIZE BRIDGE: Connected to TiDB Cloud!');
  } catch (error) {
    console.error('❌ SEQUELIZE ERROR:', error.message);
  }
})();

export default sequelize;