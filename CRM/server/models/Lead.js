import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  inquiryType: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'New',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'Lead',
  timestamps: true,
  underscored: false,
});

export default Lead;
