
export const validate = (schema, property = "body") => (req, res, next) => {
  const result = schema.safeParse(req[property]);

  if (!result.success) {
    return res.status(400).json({ msg: result.error.issues[0].message });
  }

  req[property] = result.data; // validated & transformed
  next();
};
