
export const validate = (schema, property = "body") => (req, res, next) => {
  const result = schema.safeParse(req[property]);

  if (!result.success) {

    const msg = result.error.issues.map(issue => issue.message).join(', ');

    return res.status(400).json({ msg: msg });
  }

  req[property] = result.data; // validated & transformed
  next();
};
