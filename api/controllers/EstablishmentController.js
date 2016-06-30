'use strict';

var config = require('../../config/config'),
    Establishment = require('../models/EstablishmentModel.js'),
    Promotions = require('../models/PromotionModel.js'),
    utils = require('../../Utils.js'),
    cloudinary = require('cloudinary');

exports.query = (query, result) => {

    console.log(query);

    Establishment.find(query, (err, data) => {
      if (err) {
      result({ content: { success: false, data: err }});
    } else {
      result({ content: { success: true, data: data }});
    }
  });
};

exports.delete = (id, resolve, reject) => {
    Establishment.findByIdAndRemove(id, (error, establishment) => {
        if (error) {
            reject({
                error: 'Não foi possível excluir o Estabelecimento'
            });
        } else {
          resolve({
              response: 'Estabelecimento excluído com sucesso'
          });
        }
    });
};

exports.getEstablishment = (id, result) => {
  var where = {
    _id: id
  };
  exports.query(where, result);
};

exports.searchByName = (name, result) => {
  var where = {
    name: {
      $regex: utils.createRegex(name),
      $options: 'si'
    }
  };
  exports.query(where, result);
};

exports.all = (result) => {
  exports.query({},result);
};

exports.byCity = (city, result) => {
  console.log(city);
  var where = {
    "address.city": city
  };
  exports.query(where, result);
};

function unescapeHtml(unsafe) {
  return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#x2F;/g, "\/")
      .replace(/&#039;/g, "'");
}

exports.create = (json, result) => {
  var image = unescapeHtml(json.imageUrl);

  cloudinary.uploader.upload(image, function(image) {
    json.imageUrl = image.url;
    
    var estab = new Establishment(json);
    estab.save((err, establishment) => {
      if (err) {
        result({
          "content": {
            "success": false,
            "msg": 'Não foi possível criar estabelecimento',
            "data": err
          }
        });
      } else {
        result({
          "content": {
            "success": true,
            "msg": 'Estabelecimento criado com o sucesso',
            "data": establishment
          }
        });
      }
    });
  });
};

exports.establishmentPromotions = function(establishment, resolve, reject) {
  var queryFind = Promotions.find({
    _company: establishment
  });
  queryFind.exec(function(error, result) {
    if (error) {
      reject({
        error: 'Não foi possível encontrar promoções deste estabelecimaneto'
      });
      console.log(error);
    } else {
      resolve(result);
    }
  });
};

exports.establishmentBeginPromotions = function(establishment, resolve, reject) {
  Establishment.findOne({
    "name": establishment
  }).exec(function(error, result) {
    if (error) {
      reject({
        error: 'Não foi possível encontrar este estabelecimaneto'
      });
      console.log(error);
    } else {
      var findEstablishment = {
        "name": result.name,
        "subtitle": result.subtitle
      };
      var queryFind = Promotions.find({
        company: findEstablishment
      }).sort({
        startDate: -1
      });
      queryFind.exec(function(error, result) {
        if (error) {
          reject({
            error: 'Não foi possível encontrar promoções deste estabelecimaneto'
          });
          console.log(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};

exports.rank = function(establishmentId, resolve) {
  Establishment.aggregate([
    { $project: { establishment: "$$ROOT", total: { $cond: [ { $eq: [ "$promotionsNumber", 0 ] }, 0, { "$divide": [ "$likes", "$promotionsNumber" ] } ] } } },
    { $sort: { total: -1 } }
  ], function (error, establishments) {
    if (error) {
      console.log(error);
    } else {
      var result = {
        position: 0,
        rank: []
      };
      for (var establishment in establishments) {
        if (establishments[establishment]._id == establishmentId) {
          result.position = parseInt(establishment) + 1;
        }
        result.rank.push(establishments[establishment].establishment);
      }
      resolve(result);
    }
  });
};