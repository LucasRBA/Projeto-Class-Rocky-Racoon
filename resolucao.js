// 1) Lendo o json
// Fontes:
// -  https://www.geeksforgeeks.org/how-to-add-data-in-json-file-using-node-js/
// - https://www.udemy.com/course/the-complete-web-development-bootcamp/learn  Seção 19 - Express.js with Node.js
// - https://www.youtube.com/watch?v=w30zWauuoGw - Manipulando ar1quivos Json com NodeJS - Emerson Broga
const fs = require("fs");
const filePath = (__dirname + "/broken-database.json");
const resultPath = (__dirname + "/saida.json");
const orderedResultPath = (__dirname + "/saida-ordenada.json");
const encoding = 'utf-8';
let brokenDatabase = fs.readFileSync(filePath, encoding);
const brokenDatabaseObj = JSON.parse(brokenDatabase);

function lerJson() {
  if (brokenDatabaseObj != 0) {
    console.log("O arquivo  foi recebido e lido com sucesso!");
  } else {
    console.log("Houve um erro durante a leitura do arquivo, por favor tente novamente");
  }
};
lerJson();

// 2) Corrigindo os nomes
// Fontes:
// - http://www.javascripter.net/faq/mathsymbols.htm
// - https://stackoverflow.com/questions/57883040/replace-characters-in-a-json
// - https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
// - https://stackoverflow.com/questions/5786851/define-a-global-variable-in-a-javascript-function
const databaseString = JSON.stringify(brokenDatabaseObj);

function fixDatabaseNames() {
  try {
    var mappedDatabase = {
      "æ": "a",
      "¢": "c", // ou o código HexCode do símbolo "\xA2":"c"
      "ø": "o",
      "ß": "b"
    };
    globalThis.databaseNomesCorrigidos = databaseString.replace(/æ|¢|ø|ß/g, function(correction) {
      return mappedDatabase[correction]
    });
    globalThis.parsedDatabaseNomesCorrigidos = JSON.parse(databaseNomesCorrigidos);
    console.log("Nomes dos arquivos recuperados com sucesso!")
  } catch (e) {
    console.log("Não foi possível corrigir os nomes dos arquivouivos, devido ao erro:" + e);
  }
};
fixDatabaseNames();

// 3) Corrigindo os preços
// Fontes:
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for
// - https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
// - https://stackoverflow.com/questions/34014342/convert-json-string-value-to-number
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
function fixPrices() {
  try {
    Object.keys(parsedDatabaseNomesCorrigidos).forEach(product => {
      parsedDatabaseNomesCorrigidos[product].price = parseFloat(parsedDatabaseNomesCorrigidos[product].price);
    });
    console.log("Os preços dos produtos voltaram a ser do tipo numérico!");
  } catch (e) {
    console.log("Não foi possível converter os preços em dados numéricos devido ao erro: " + e);
  }
};
fixPrices();

// 4) Corrigindo as quantidades
// Fontes:
//
function fixQuantity() {
  try {
    for (i = 0; i < parsedDatabaseNomesCorrigidos.length; i++) {
      if (!parsedDatabaseNomesCorrigidos[i].hasOwnProperty('quantity')) {
        parsedDatabaseNomesCorrigidos[i].quantity = 0;
      };
      globalThis.parsedFixedDatabase = parsedDatabaseNomesCorrigidos;
    };
    console.log('Agora todos os \"produtops"\ tem quantidades mesmo que o estoque tenha acabado...');
  } catch (e) {
    console.log("Não foi possível inclujir quantidades em alguns produtos, devido ao erro " + e);
  }
};
fixQuantity();

// 5) Exportando o JSON referente ao banco de dados corrigido
// Fontes:
//
function exportFixedDatabase() {
  try {
    fs.writeFileSync(resultPath, JSON.stringify(parsedFixedDatabase, null, 2));
    console.log("O arquivo saida.json recebeu com sucesso os dados, e já pode ser consultado e verificado!")
  } catch (e) {
    console.log("Devido ao erro " + e + " o arquivo saida.json não pode ser escrito...")
  }
};
exportFixedDatabase();

// 6) Ordenando produtos por categoria em ordem alfabética e por id em ordem crescente
// Fontes:
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
//
function orderingByCategoryAndId() {
  try {
    globalThis.correctedDatabase = JSON.parse(fs.readFileSync(resultPath, encoding)); // Recebe o banco de dados corrigido, e imprime a lista ordenada
    globalThis.orderedParsedFixedDatabase = parsedFixedDatabase.sort((a, b) => {
      if (a.category < b.category) {
        return -1;
      } else if (a.category > b.category) {
        return 1;
      } else(a.category === b.category)
      return (a.id - b.id)

      return 0;
    });
    fs.writeFileSync(orderedResultPath, JSON.stringify(orderedParsedFixedDatabase, null, 2)); // Escreve uma saída ordenada, item adicional
    console.table(orderedParsedFixedDatabase);
    console.log("A lista ordenada foi criada com sucesso, e o arquivo saida-ordenada.json foi escrito com o conteúdo da mesma em formato json!")
  } catch (e) {
    console.log("Ocorreu um erro: " + e + "E este impediu a criação da lista ordenada e a criação do arquivo saida-ordenada.json");
  }
};
orderingByCategoryAndId();

// 7) Calculando o valor total do estoque para cada categoria
//Fontes:
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
// - https://www.w3schools.com/jsref/jsref_tofixed.asp
// - https://blog.bitsrc.io/double-quotes-vs-single-quotes-vs-backticks-in-javascript-3cab5aaea55

function calculateStockvalues() {
  try {
    let accessoriesSum = 0;
    let homeAppliancesSum = 0;
    let electronicsSum = 0;
    let pansSum = 0;

    Object.keys(correctedDatabase).forEach(i => {
      const sumValue = correctedDatabase[i].price * correctedDatabase[i].quantity;
      switch (correctedDatabase[i].category) {
        case 'Acessórios':
          accessoriesSum += sumValue
          break;
        case 'Eletrodomésticos':
          homeAppliancesSum += sumValue
          break;
        case 'Eletrônicos':
          electronicsSum += sumValue
          break;
        case 'Panelas':
          pansSum += sumValue
          break;
        default:
          break;
      };
    });

    console.log(`\n
Soma do estoque de acessórios tem valor total de: R$ ${(accessoriesSum.toFixed(2)).replace(".", ",")}
Soma do estoque de eletrodomésticos tem valor total de: R$ ${homeAppliancesSum.toFixed(2).replace(".", ",")}
Soma do estoque de eletrônicos tem valor total de: R$ ${electronicsSum.toFixed(2).replace(".", ",")}
Soma do estoque de panelas tem valor total de: R$ ${pansSum.toFixed(2).replace(".", ",")}`);
    console.log(`
A lista com os valores referentes a cada categoria de estoque pode ser encontrada acima!"`);
  } catch (e) {
    console.log("Houve o seguinte erro ao gerar a lista com os valores referentes a cada estoque..." + e);
  }
};
calculateStockvalues();
