'use strict'

module.exports = async function (fastify, opts) {
  const {
    User,
    Part,
    Supplier,
    StoreArea,
    StoreGrid,
    StoreBox,
    StorePart,
    History,
  } = fastify.sequelize.models;

  Supplier.hasMany(Part, {foreignKey: 'supplier_id'});
  Part.belongsTo(Supplier, {foreignKey: 'supplier_id'});

  StoreArea.hasMany(StoreGrid, {foreignKey: 'store_area_id'});
  StoreGrid.hasMany(StoreBox, {foreignKey: 'store_grid_id'});
  StoreBox.hasMany(StorePart, {foreignKey: 'store_box_id'});
  StorePart.belongsTo(StoreBox, {foreignKey: 'store_box_id'});
  StoreBox.belongsTo(StoreGrid, {foreignKey: 'store_grid_id'});
  StoreGrid.belongsTo(StoreArea, {foreignKey: 'store_area_id'});

  Part.hasOne(StorePart, {foreignKey: 'part_id'});
  StorePart.belongsTo(Part, {foreignKey: 'part_id'});

  User.hasMany(History, {foreignKey: 'operator_id'});
  Part.hasMany(History, {foreignKey: 'part_id'});
  StoreBox.hasMany(History, {foreignKey: 'store_box_id'});
  History.belongsTo(User, {foreignKey: 'operator_id'});
  History.belongsTo(Part, {foreignKey: 'part_id'});
  History.belongsTo(StoreBox, {foreignKey: 'store_box_id'});

}
module.exports.autoload = false;