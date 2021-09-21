const express = require("express");
const MercadoPago = require("mercadopago");
const { v4: uuidv4 } = require('uuid');

const app = express();

MercadoPago.configure({
    sandbox: true,
    // access_token: "AQUI VAI A API TOKEN"
});

app.get("/", (req, res) => {
    res.send("Testando.");
});

app.get("/pagar", async (req, res) => {

    var id = uuidv4();
    var pagador = "betosantin123@gmail.com";

    var dados = {
        items: [
            item = {
                id: id,
                title: "Xbox One S 2TB",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(1399.99)
            }
        ],
        payer: {
            email: pagador
        },
        external_refence: id
    }

    try {
        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
    } catch (err) {
        return res.send(err.message)
    }

    return res.redirect(pagamento.body.init_point);

});

app.post("/not", (req, res) => {
    var id = req.query.id;

    setTimeout(() => {
        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data =>{
            var pagamento = data.body.results[0];

            if(pagamento != undefined){
                console.log(pagamento);
                console.log(pagamento.external_refence);
                console.log(pagamento.status); //approved
            } else {
                console.log("pagamento não existe");
            }
        }).catch(err => {
            console.log(err);
        }); 

    }, 20000);

    res.send("OK");
});

app.listen(3000, (req, res) => {

    console.log("Servidor rodando");
});