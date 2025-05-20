import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1111',
  database: 'MCCourseWork',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
