import { syncYahooData } from '../src/lib/yahoo.js';
import dotenv from 'dotenv';

dotenv.config();

const sync = async () => {
  try {
    const result = await syncYahooData();
    if (result.success) {
      console.log('Successfully synced Yahoo Fantasy data');
    } else {
      console.error('Failed to sync data:', result.error);
    }
  } catch (error) {
    console.error('Error running sync:', error);
  }
  process.exit(0);
};

sync();