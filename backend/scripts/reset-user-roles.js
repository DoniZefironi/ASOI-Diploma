// scripts/reset-user-roles.js
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../dist/**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    const queryRunner = AppDataSource.createQueryRunner();
    
    // Drop table
    await queryRunner.query('DROP TABLE IF EXISTS user_roles CASCADE');
    console.log('Dropped user_roles table');

    // Drop enum type
    await queryRunner.query('DROP TYPE IF EXISTS user_roles_role_enum CASCADE');
    console.log('Dropped user_roles_role_enum type');

    await queryRunner.release();
    await AppDataSource.destroy();
    
    console.log('✅ Database reset completed!');
    console.log('Now restart the backend to recreate the table with new enum values');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

run();
