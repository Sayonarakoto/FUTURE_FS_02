import Lead from '../models/Lead.js';

export const seedLeads = async (req, res) => {
  try {
    const testLeads = [
      { name: 'Alya Mikhailova', email: 'alya@roshidere.jp', status: 'NEW', message: 'Interested in enterprise CRM' },
      { name: 'Yuki Kaito', email: 'yuki@tech.jp', status: 'IN_PROGRESS', message: 'Integration questions' },
      { name: 'Sakura Hana', email: 'sakura@design.jp', status: 'CONTACTED', message: 'Looking for premium UI' },
      { name: 'Haruto Tanaka', email: 'haruto@dev.jp', status: 'NEW', message: 'API access' },
      { name: 'Akira Watanabe', email: 'akira@business.jp', status: 'NEW', message: 'Subscription details' },
    ];

    await Lead.bulkCreate(testLeads);
    res.status(201).json({ success: true, message: 'Leads seeded successfully' });
  } catch (error) {
    console.error('SeedLeads error:', error);
    res.status(500).json({ success: false, message: 'Server error seeding leads' });
  }
};
