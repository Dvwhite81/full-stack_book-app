import config from './utils/config';
import logger from './utils/logger';
import app from './app';

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
