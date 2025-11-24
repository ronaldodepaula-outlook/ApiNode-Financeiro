const MasterAdmin = require("../models/MasterAdmin");
const base = require("./baseController");

module.exports = {
  create: base.create(MasterAdmin),
  getAll: base.getAll(MasterAdmin),
  getById: base.getById(MasterAdmin),
  update: base.update(MasterAdmin),
  remove: base.remove(MasterAdmin),
};
