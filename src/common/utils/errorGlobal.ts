export const errorGlobal = (err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(500).json({ err_message: err.message });
};
