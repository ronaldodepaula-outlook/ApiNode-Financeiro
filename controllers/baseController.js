// controllers/baseController.js
exports.create = Model => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getAll = (Model, populate = "") => async (req, res) => {
  try {
    const query = Model.find();
    if (req.query.limit) query.limit(parseInt(req.query.limit));
    if (req.query.skip) query.skip(parseInt(req.query.skip));
    if (populate) query.populate(populate);
    const docs = await query.exec();
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getById = (Model, populate = "") => async (req, res) => {
  try {
    const q = Model.findById(req.params.id);
    if (populate) q.populate(populate);
    const doc = await q.exec();
    if (!doc) return res.status(404).json({ error: "Registro não encontrado" });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.update = Model => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: "Registro não encontrado" });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.remove = Model => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Registro não encontrado" });
    return res.json({ message: "Removido com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
