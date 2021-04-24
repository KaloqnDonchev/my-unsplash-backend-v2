function applyDBRelations (sequelize) {
  const { 
    billing,
    products,
    data,
    shares,
    signatures
  } = sequelize.models;
  
  billing.hasOne(products, {foreignKey: 'productsId', constraints: false});
  billing.hasOne(data, {foreignKey: 'dataId', constraints: false});
  billing.hasOne(shares, {foreignKey: 'sharesId', constraints: false});
  billing.hasOne(signatures, {foreignKey: 'signaturesId', constraints: false});
  billing.hasOne(billing, {foreignKey: 'billingId', constraints: false});
}

module.exports = { applyDBRelations }