import path from 'path';

const currentPath = path.resolve(__dirname);

const entitiesPath = `${currentPath}/src/**/entities/*`;

const baseConfigs = {
  entities: [entitiesPath],
  ...require('./src/config/database.config').default().database,
};

if (process.env.NODE_ENV === 'development') {
  module.exports = {
    tsNode: true,
    entitiesTs: [`${currentPath}/src/**/entities/*.entity.ts`],
    ...baseConfigs,
  };
} else {
  module.exports = {
    ...baseConfigs,
  };
}
