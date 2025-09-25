export const errorGlobal = (err: any, req: any, res: any, next: any) => {
  const status = err.status || 500;
  console.log(err);
  res.status(status).json({ err_message: err.message });
};
