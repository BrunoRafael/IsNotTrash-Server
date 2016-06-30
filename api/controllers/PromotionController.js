var timeout = require('../resources/timeout/timeout.js'),
	Promotion = require('../models/PromotionModel.js'),
	Comment = require('../models/CommentModel.js'),
	User = require('../models/UserModel.js'),
	Establishment = require('../models/EstablishmentModel.js'),
	mongoose = require('mongoose'),
	utils = require('../../Utils'),
	cloudinary = require('cloudinary');

exports.all = function (id, removeFinalizedPromotions, callback, reject) {
	var query = {};
	if (removeFinalizedPromotions) {
		query.endDate = { $gte: new Date(Date.now()) }
	}
	Promotion.find(query).sort({
		_id: -1
	}).populate('_company').exec(function (err, promotions) {
		if (err) {
			reject({
				error: 'Não foi possível encontrar promoções'
			});
		} else {
			callback(generateResponse(id, promotions));
		}
	});
};

exports.delete = (id, resolve, reject) => {
    Promotion.findByIdAndRemove(id, (error, establishment) => {
        if (error) {
            reject({
                error: 'Não foi possível excluir a Promoção'
            });
        } else {
          resolve({
              response: 'Promoção excluída com sucesso'
          });
        }
    });
};

exports.searchByName = (name, id, resolve) => {
	var where = {
		productName: {
			$regex: utils.createRegex(name),
			$options: 'i'
		}
	};

	console.log("Controller where", where);

	Promotion.find(where, (err, promotions) => {
		if (err) {
			resolve({
				content: {
					"success": false,
					"data": err
				}
			});
		} else {
			resolve({
				content: {
					"success": false,
					"data": generateResponse(id, promotions)
				}
			});
		}
	}).populate('_company').sort({ productName: 1 });
};

exports.listByPage = function(skip, limit, user_id, removeFinalizedPromotions, establishmentId, resolve, reject) {
	var query = establishmentId ? {_company : mongoose.Types.ObjectId(establishmentId)} : {};

	if (removeFinalizedPromotions) {
		query.endDate = { $gte: new Date(Date.now()) }
	}

	Promotion.find(query)
		.populate('_company')
		.sort({ _id: -1 })
		.skip(skip)
		.limit(limit)
		.exec(function (error, promotions) {
			if (error) {
				reject({
					error: 'Não foi possível novas promoçoes'
				});
			} else {
				resolve(generateResponse(user_id, promotions));
			}
		});
};

exports.listNewPromotions = function(firstPromotionId, limit, removeFinalizedPromotions, establishmentId, resolve, reject) {
	var objectId = mongoose.Types.ObjectId(firstPromotionId);
	var query = {
		_id: { $gt: objectId, $ne: objectId}
	};

	if(establishmentId){
		query._company = mongoose.Types.ObjectId(establishmentId);
	}

	if(removeFinalizedPromotions){
		query.endDate = { $gte: new Date(Date.now())}
	}
	Promotion.find(query)
		.populate('_company')
		.sort({ _id: -1 })
		.limit(limit)
		.exec(function (error, promotions) {
			if (error) {
				reject({
					error: 'Não foi possível novas promoçoes'
				});
				console.log(error);
			} else {
				resolve(generateResponse(null, promotions));
			}
		});
};

exports.addLike = function (params, resolve, reject) {
	var user_id = params.user_informations._id;

	Promotion.findOneAndUpdate({
		_id: params.promotion_id
	}, {
		$push: {
			'evaluates.user_likes': user_id
		}
	}, {
		new: true
	}).exec(function(error, document) {
		if (error) {
			reject({
				content: {
					success: false,
					data: error
				}
			});
			console.log(error);
		} else {
			console.log(document);
			establishmentLikesUpdate(document._company,1, document, resolve, reject);

		}
	});
};

exports.removeLike = function (params, resolve, reject) {
	var user_id = params.user_informations._id;

	Promotion.findOneAndUpdate({
		_id: params.promotion_id
	}, {
		$pull: {
			'evaluates.user_likes': user_id
		}
	}, {
		new: true
	}).exec(function(error, document) {
		if (error) {
			reject({
				content: {
					success: false,
					data: error
				}
			});
			console.log(error);
		} else {
			establishmentLikesUpdate(document._company,-1, document, resolve, reject);
		}
	});
};

exports.addComment = function (comment, resolve) {
	var newComment = new Comment(comment);
	newComment.save(function (error) {
		if (!error) {
			Comment.populate(newComment, [{ path: '_user'}, {path: '_promotion' }], function (error, savedComment) {
				if (error) {
					resolve({content: {	success: false, data: error	}});
					console.log(error);
				} else {
					resolve({content: {success: true,data: savedComment	}});
				}
			});

		} else {
			resolve({content: {success: false, data: error}});
			console.log(error);
		}
	});
};

exports.removeComment = function (comment_id, resolve, reject) {
	Comment.findOne({
		_id: comment_id
	}).exec(function (error, comment) {
		if (!error) {
			comment.remove(function (error) {
				if (!error) {
					resolve({content: {	success: true, data: comment }});
				} else {
					reject({content: { success: false, data: error }});
					console.log(error);
				}
			});
		} else {
			reject({ content: {	success: false,	data: error	}})
		}
	});
};

exports.updateComment = function (comment_id, newText, resolve, reject) {
	Comment.findOneAndUpdate(
		{_id: comment_id},
		{ $set: { text: newText }},
		{ new: true })
		.populate('_user _promotion')
		.exec(function (error, result) {
			if (error) {
				reject({content: { success: false, data: error}});
				console.log(error);
			} else {
				resolve({content: {success: true,data: result}});
			}
		});
};

exports.getOldComments = function (skip, limit, promotion_id, resolve, reject) {
	Comment.find({
		_promotion: promotion_id
	})
		.populate('_user _promotion')
		.sort({ _id: -1 })
		.skip(skip)
		.limit(limit)
		.exec(function (exception, comments) {
			if (exception) {
				reject({
					error: exception
				});
			} else {
				resolve(comments);
			}
		});
};

exports.getNewComments = function (promotion_id, commentDate, resolve, reject) {
	var objectId = mongoose.Types.ObjectId(promotion_id);
	var queryFind = Promotion.findOne({
		_id: objectId
	});
	queryFind.populate('evaluates.comments._user', '-password').exec(function (error, result) {
		if (error) {
			reject({
				error: 'Não foi possível recomendar esse item'
			});
			console.log(error);
		} else {
			var comments = result.evaluates.comments;
			var filteredComments = comments.filter(function (comment) {
				return new Date(comment.date) > new Date(commentDate);
			});
			resolve(filteredComments);
		}
	});
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

exports.addPromotion = function(json, resolve, reject) {
	var image = unescapeHtml(json.images[0]);
	cloudinary.uploader.upload(image, function(image) {
		json.images[0] = image.url;

		var promo = new Promotion(json);
		promo.save(function (error, response) {
			if (error) {
				console.log(error);
				reject({
					"content": {
						"success": false,
						"msg": 'Não foi possível adicionar promoção',
						"data": error
					}
				});
			} else {
				// timeout.insertNewTimeout(json);
				establishmentPromotionNumberUpdate(json._company);
				resolve({
					"content": {
						"success": true,
						"msg": 'Promoção criada com sucesso',
						"data": response
					}
				});
			}
		});
	});
};

function establishmentLikesUpdate (establishmentId, inc, promotionResult, resolve, reject) {
	var selection = {
		"_id": establishmentId
	};

	var update = {
		$inc: { likes: inc }
	};
	Establishment.update(selection, update, (error) => {
		if (error) {
			reject({
				content: {
					success: false,
					data: error
				}
			});
		} else {
			resolve({
				content: {
					success: true,
					data: promotionResult
				}
			});
		}
	});
}

function establishmentPromotionNumberUpdate (establishmentId) {
	var selection = {
		"_id": establishmentId
	};
	var update = {
		$inc : {totalOfPublications : 1}
	};
	Establishment.findOneAndUpdate(selection, update, (error,establishment) => {
		if (error) {
			console.log("Não foi possível atualizar o número de promoções do estabelecimento");
		} else {
			console.log("Número de promoções do estabelecimento atualizado com sucesso");
		}
	});
}

function generateResponse(user_id, promotions) {
	var promotion = [];
	for (var key in promotions) {
		var doc = promotions[key];
		var item = {
			_id: doc._id,
			company: doc._company,
			productName: doc.productName,
			price: doc.price,
			startDate: doc.startDate,
			endDate: doc.endDate,
			reason: doc.reason,
			shelf_life: doc.shelf_life,
			conservation: doc.conservation,
			description: doc.description,
			images: doc.images,
		};

		var user_likes = promotions[key].evaluates.user_likes;
		if (user_likes.indexOf(user_id) > -1) {
			item.like = true;
		}
		item.likes = user_likes.length;
		item.finalized = isEnded(item.endDate);
		
		promotion.push(item);
	}
	return promotion;
}

function isEnded(date) {
	return Date.now() > new Date(date);
}
