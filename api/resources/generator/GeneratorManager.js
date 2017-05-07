/**
 * Created by Bruno Rafal on 25/07/2016.
 */

var mongoose = require('mongoose');

var promotions = [
    {
        _company: null,
        productName: 'Batatas granfinas',
        productType: 'Batatas',
        price: { unit: 'kg', actual: 2.50, old: 4.80},
        startDate: 1476478951910,
        endDate: 1477342951910,
        reason: 'Danificação',
        shelf_life: 1508878951910,
        conservation: 'Natural',
        images: ['http://marianakalil.com.br/wp-content/uploads/2016/05/batata_doce.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Feijão Biju',
        productType: 'Feijão Macassar',
        price: { unit: 'kg', actual: 3.50, old: 7.80},
        startDate: 1470363613221,
        endDate: 1471400413221,
        reason: 'Danificação',
        shelf_life: 1472610013221,
        conservation: 'Natural',
        images: ['http://www.meubiju.com/assets/img/produtos/produto-feijao.png'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Feijão Biju',
        productType: 'Feijão macassar',
        price: { unit: 'kg', actual: 5.50, old: 8.80},
        startDate: 1470363613221,
        endDate: 1471400413221,
        reason: 'Danificação',
        shelf_life: 1472610013221,
        conservation: 'Natural',
        images: ['https://3.bp.blogspot.com/-AvdlyDPkIto/V1jdrdjpMbI/AAAAAAAAkFs/aB7a9D08sWQnC88C1dQ7YofSb6w78N2KgCKgB/s1600/bbb%2B200%2Bl.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Morangos do nordeste',
        productType: 'Morangos',
        price: { unit: 'kg', actual: 14.50, old: 22.80},
        startDate: 1470363613221,
        endDate: 1471400413221,
        reason: 'Descarte',
        shelf_life: 1472610013221,
        conservation: 'Temperatura baixa',
        images: ['http://www.papeldeparede.etc.br/fotos/wp-content/uploads/morangos.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Paçoquitas',
        productType: 'Paçoca',
        price: { unit: 'Cx', actual: 5.50, old: 9.90},
        startDate: 1470363613221,
        endDate: 1471400413221,
        reason: 'Vencimento',
        shelf_life: 1472610013221,
        conservation: 'Natural',
        images: ['http://www.pacoquita.com.br/upload/products/large/AF_3D_PACOQUITA_POTE_ROLHA_125KG_AJ1.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Feijão macassar turquesa',
        productType: 'Feijão macassar',
        price: { unit: 'kg', actual: 4.80, old: 10},
        startDate: 1470363613221,
        endDate: 1471400413221,
        reason: 'Danificação',
        shelf_life: 1472610013221,
        conservation: 'Natural',
        images: ['http://mercadoexpress.loja2.com.br/img/16c2b9ceb3a5bf9dee85d0ee70dcc2ee.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Coca cola 2 litros',
        productType: 'Coca cola',
        price: { unit: '6 unid', actual: 19.70, old: 30},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Data de validade',
        shelf_life: 1477534813221,
        conservation: 'Natural',
        images: ['http://www.sushicampogrande.com.br/pedido/wp-content/uploads/2015/07/coke.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Biscoito recheado bono',
        productType: 'Biscoito recheado',
        price: { unit: 'unid', actual: 1.00, old: 2.10},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Data de validade',
        shelf_life: 1477534813221,
        conservation: 'Natural',
        images: ['http://www.arrumeolaco.com/wp-content/uploads/2015/02/Biscoito-Bono.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Torta de chocolate com morango',
        productType: 'Torta',
        price: { unit: 'kg', actual: 19.90, old: 28.70},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Danificação',
        shelf_life: 1479349213221,
        conservation: 'Natural',
        images: ['http://carpediemchocolataria.com.br/loja/wp-content/uploads/2016/01/torta-de-chocolate-com-morango.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Alfaces',
        productType: 'Alface',
        price: { unit: 'kg', actual: 1.20, old: 2.95},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Danificação',
        shelf_life: 1479349213221,
        conservation: 'Natural',
        images: ['http://www.casacamponesa.com.br/sites/default/files/produtos/alface-crespa.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Bananas pacovã',
        productType: 'Bananas',
        price: { unit: 'kg', actual: 2.50, old: 4.80},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Danificação',
        shelf_life: 1479349213221,
        conservation: 'Natural',
        images: ['http://www.agronovas.com.br/wp-content/uploads/2016/01/o-BANANA-facebook.jpg'],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Berinjelas do agreste',
        productType: 'Berinjela',
        price: { unit: 'unid', actual: 1.20, old: 2.70},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Danificação',
        shelf_life: 1479349213221,
        conservation: 'Natural',
        images: ["http://emagrecimentourgente.com/wp-content/uploads/2014/04/Agua-de-berinjela-emagrece.jpg"],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Pipocas de microondas yoki natural',
        productType: 'Pipocas de microondas',
        price: { unit: 'unid', actual: 0.85, old: 1.30},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Data de validade',
        shelf_life: 1479349213221,
        favorite: false,
        conservation: 'Natural',
        images: ["http://yoki.com.br/wp-content/uploads/2015/05/popcorn-sabor-natural-hero.jpg"],
        evaluates: {
            user_likes: []
        }
    },

    {
        _company: null,
        productName: 'Suco natural de menta com abacaxi',
        productType: 'Suco',
        price: {unit: 'unid', actual: 2.50, old: 4.80},
        startDate: 1473992413221,
        endDate: 1475634013221,
        reason: 'Danificação das frutas',
        shelf_life: 1479349213221,
        favorite: false,
        conservation: 'Natural',
        images: ["http://media.aguadoce.com.br/uploads/receitas/foto_receita/ao-suco-refrescant_jpg_521x270_crop_upscale_q85.jpg"],
        evaluates: {
            user_likes: []
        }
    }
];

var hints = [
    {
        title: "Evite o apodrecimento de frutas e verduras",
        imgUrl: "http://mundoeducacao.bol.uol.com.br/upload/conteudo_legenda/74e4df18866c63e708ba2485154f0403.jpg",
        text: "Ao verificar se a fruta está madura, não aperte com força para evitar um machucado e posteriormente o apodrecimento da fruta. O correto é simplesmente pegar na fruta ou verdura e observar sua consistencia.",
        establishment: mongoose.Types.ObjectId("57975fadd9091b343530b067")
    },

    {
        title: "Não misture as frutas podres com as saudáveis",
        text: "Frutas podres com frutas saudáveis não podem se misturar. Se isso ocorrer todas as frutas boas irão ficar podres com o passar do tempo. Evite o desperdicio de comida",
        imgUrl: "https://imgnzn-a.akamaized.net/2014/08/11/11171520449752.jpg",
        establishment: mongoose.Types.ObjectId("57975fadd9091b343530b066")
    }
];

var Generator = {
    generatePromotion: function(){
        var i = Math.floor((Math.random() * promotions.length));
        return promotions[i];
    },

    generateHint: function(){
        var i = Math.floor((Math.random() * hints.length));
        return hints[i];
    }
};

module.exports = Generator;