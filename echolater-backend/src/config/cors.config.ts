const origins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const corsConfig = {
  origin: origins,
  credentials: true,
};
