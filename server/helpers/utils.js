const validate = (data, fields) => {
  const d = {};
  fields.forEach((f) => {
    if (data[f] === undefined) {
      throw new Error(`Missing ${f}`);
    }

    d[f] = data[f];
  });

  return d;
};

export default { validate };
