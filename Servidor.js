const express = require('express');
const bodyParser = require('body-parser');
const soap = require('strong-soap').soap;
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));

const service = {
    CalculatorService: {
        ServiceSoap: {
            Sumar(args) {
                const { Num1, Num2 } = args;
                if (!Number.isInteger(Num1) || !Number.isInteger(Num2)) {
                    throw new Error('Solo se permiten números enteros');
                }
                return { SumaResultado: Num1 + Num2 };
            },
            Restar(args) {
                const { Num1, Num2 } = args;
                if (!Number.isInteger(Num1) || !Number.isInteger(Num2)) {
                    throw new Error('Solo se permiten números enteros');
                }
                return { RestaResultado: Num1 - Num2 };
            },
            Multiplicar(args) {
                const { Num1, Num2 } = args;
                if (!Number.isInteger(Num1) || !Number.isInteger(Num2)) {
                    throw new Error('Solo se permiten números enteros');
                }
                return { MultiplicarResultado: Num1 * Num2 };
            },
            Dividir(args) {
                const { Num1, Num2 } = args;
                if (!Number.isInteger(Num1) || !Number.isInteger(Num2)) {
                    throw new Error('Solo se permiten números enteros');
                }
                if (Num2 === 0) {
                    throw new Error('No se puede dividir por cero');
                }
                return { DividirResultado: Num1 / Num2 };
            }
        }
    }
};

const wsdlFile = path.join(__dirname, 'CalculatorApi.wsdl');
const xml = fs.readFileSync(wsdlFile, 'utf8');


soap.listen(app, '/service', service, xml);


const validateInteger = (value) => {
    const num = Number(value);
    return Number.isInteger(num);
};


app.post('/service/Sumar', (req, res) => {
    const Num1 = req.query.Num1;
    const Num2 = req.query.Num2;

    if (!validateInteger(Num1) || !validateInteger(Num2)) {
        res.status(400).json({ ERROR: 'Solo se permiten números enteros' });
        return;
    }

    const resultado = parseInt(Num1) + parseInt(Num2);
    res.json({ SumaResultado: resultado });
});

app.post('/service/Restar', (req, res) => {
    const Num1 = req.query.Num1;
    const Num2 = req.query.Num2;

    if (!validateInteger(Num1) || !validateInteger(Num2)) {
        res.status(400).json({ ERROR: 'Solo se permiten números enteros' });
        return;
    }

    const resultado = parseInt(Num1) - parseInt(Num2);
    res.json({ RestaResultado: resultado });
});

app.post('/service/Multiplicar', (req, res) => {
    const Num1 = req.query.Num1;
    const Num2 = req.query.Num2;

    if (!validateInteger(Num1) || !validateInteger(Num2)) {
        res.status(400).json({ ERROR: 'Solo se permiten números enteros' });
        return;
    }

    const resultado = parseInt(Num1) * parseInt(Num2);
    res.json({ MultiplicarResultado: resultado });
});

app.post('/service/Dividir', (req, res) => {
    const Num1 = req.query.Num1;
    const Num2 = req.query.Num2;

    if (!validateInteger(Num1) || !validateInteger(Num2)) {
        res.status(400).json({ ERROR: 'Solo se permiten números enteros' });
        return;
    }

    if (parseInt(Num2) === 0 || parseInt(Num1) === 0) {
        res.status(400).json({ ERROR: 'No se puede dividir por cero' });
        return;
    }

    const resultado = parseInt(Num1) / parseInt(Num2);
    res.json({ DividirResultado: resultado });
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});