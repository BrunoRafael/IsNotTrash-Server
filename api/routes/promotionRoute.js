'use strict';

var express = require('express');
var router = express.Router();

var promotionController = require('../controllers/PromotionController.js');
var establishmentController = require('../controllers/EstablishmentController.js');
var validator = require('validator');

var io = require('../resources/web_socket/WebSocket.js');

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 10;

/*Implementa método GET para recuperar todas as promoções*/
router.post('/', function(req, res){
    var user_id = req.userInformations._id;

    promotionController.all(user_id,
        function(resp) {
            res.json(resp);
        }, function(exception){}
    );
});

/*Implementa método GET para recuperar todas as promoções*/
router.get('/search/name', function(req, res){
    var id = req.userInformations._id;
    var name = req.query.name;

    console.log("Routers", name);

    promotionController.searchByName(name, id,
        function(resp) {
            res.json(resp.content);
        }
    );
});

/*Implementa serviço de requisição de produtos por página e por tamanho de página.*/
router.post('/oldPromotions', function(req, res){

    var skip = parseInt(validator.trim(validator.escape(req.body.skip)));
    var limit = parseInt(validator.trim(validator.escape(req.body.limit)));
    var user_id = validator.trim(validator.escape(req.userInformations._id));
    var removeFinalizedPromotions = req.body.removeFinalizedPromotions;
    var establishmentId = validator.trim(validator.escape(req.body.establishmentId));

    promotionController.listByPage(skip, limit, user_id, removeFinalizedPromotions, establishmentId,
        function(promotions) {
            for (var index in promotions) {
                establishmentController.rank(promotions[index].company._id, function (response) {
                    promotions[index].company.rank = response;
                });
            }
            res.json(promotions);
        }, function(exception){
            console.log(exception);
        }
    );
});

/*Implementa serviço de requisição de produtos por página e por tamanho de página. Fazer acontecer com webScoket*/
router.post('/newPromotions', function(req, res){
    var lastPromotionAddedId = req.body.lastPromotionAddedId;
    var id = validator.trim(validator.escape(req.userInformations._id));
    var limit = parseInt(validator.trim(validator.escape(req.body.limit)));
    var removeFinalizedPromotions = req.body.removeFinalizedPromotions;
    var establishmentId = validator.trim(validator.escape(req.body.establishmentId));

    if(!lastPromotionAddedId){
        promotionController.all(id, removeFinalizedPromotions,
            function(resp) {
                for (let promotion in resp) {
                    establishmentController.rank(resp[promotion].company._id, function (response) {
                        resp[promotion].company.rank = response;
                    });
                }
                res.json(resp);
            }, function(exception){
                console.log(exception);
            }
        );
    } else {
        promotionController.listNewPromotions(lastPromotionAddedId, limit, removeFinalizedPromotions, establishmentId,
            function(resp) {
                for (let promotion in resp) {
                    establishmentController.rank(resp[promotion].company._id, function (response) {
                        resp[promotion].company.rank = response;
                    });
                }
                res.json(resp);
            }, function(exception){
                console.log(exception);
            }
        );
    }
});

router.post('/addPromotion', function(req, res){
    var promotion = req.body.promotion;
    promotionController.addPromotion(promotion,
        function(resp){
            io.sockets.emit('newPromotionsAdded');
            res.json(resp);
        }, function(exception){
            res.status(400).json(exception);
        }
    );
});

router.post('/oldComments', function(req, res){
    var skip = parseInt(validator.trim(validator.escape(req.body.skip)));
    var limit = parseInt(validator.trim(validator.escape(req.body.limit)));
    var promotion_id = validator.trim(validator.escape(req.body.promotion_id));
    promotionController.getOldComments(skip, limit, promotion_id,
        function(resp){
            res.json(resp);
        }, function(exception){
            console.log(exception);
        }
    );
});

router.post('/newComments', function(req, res){
    var promotion_id = validator.trim(validator.escape(req.body.promotion_id));
    var comment_date = validator.trim(validator.escape(req.body.comment_date));
    if(!comment_date){
        promotionController.getOldComments(DEFAULT_SKIP, DEFAULT_LIMIT, promotion_id,
            function(resp){
                res.json(resp);
            }, function(exception){}
        );
    } else {
        promotionController.getNewComments(promotion_id, comment_date,
            function(resp){
                res.json(resp);
            }, function(exception){}
        );
    }
});

router.delete('/:id', function(req, res) {

    var id = req.params.id;

    promotionController.delete(id, function(resp) {
        res.status(200).send(resp);
    }, function(exception) {
        res.status(404).send(404);
    });
});

module.exports = router;
