var connection = require('./bzsql.js');
var inquirer = require('inquirer');

connection.connect(function(err){
    if (err) throw err;
});

manager()

function manager(z){
    inquirer.prompt([
        {
            name: 'options',
            type: 'rawlist',
            message:'What would you like to do?',
            choices: ['View Products', 'View Low Stock', 'Update Stock Levels', 'Add a New Product']
        }
    ]).then(function(res){
        switch (res.options){
            case 'View Products':
                viewProducts()
                break;

            case 'View Low Stock':
                viewStock()
                break;

            case 'Update Stock Levels':
                updateStock()
                break;

            case 'Add a New Product':
                addProduct()
                break;
        }
    })
}

function viewProducts (z) {
    connection.query('SELECT * FROM products', function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('Item #: ' + res[i].item_id);
            console.log('Item: ' + res[i].product_name);
            console.log('Department: ' + res[i].department_name);
            console.log('Price: $' + res[i].price);
            console.log('Stock Remaining: ' + res[i].stock_quantitiy)
            console.log('-----------------------------')
        }
        manager()
    });
}

function viewStock (z) {
    connection.query('SELECT * FROM products WHERE stock_quantitiy BETWEEN 0 and 10', function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('Item #: ' + res[i].item_id);
            console.log('Item: ' + res[i].product_name);
            console.log('Department: ' + res[i].department_name);
            console.log('Price: $' + res[i].price);
            console.log('Stock Remaining: ' + res[i].stock_quantitiy)
            console.log('-----------------------------')
        }
        manager()
    })
}

function updateStock (z) {
    inquirer.prompt([
        {
            name: 'product',
            message: 'What item did you receive more of?'
        },
        {
            name: 'stock',
            message: 'How many did you get?'
        }
    ]).then(function(res){
        var product = res.product;
        var newStock = parseInt(res.stock);
        connection.query('SELECT stock_quantitiy FROM products WHERE product_name=?', [product], function(err,res){
            if (err) throw err;
            var current_stock = parseInt(res[0].stock_quantitiy)
            current_stock += newStock
            connection.query('UPDATE products SET ? WHERE ?', [{stock_quantitiy: current_stock}, {
            product_name: product}], function(err, res){
                if (err) throw err;
                connection.query('Select * FROM products WHERE product_name=?', [product], function(err, res){
                    if (err) throw err;
                    console.log(res[0].product_name + ' stock has been updated. Current Stock: ' + res[0].stock_quantitiy)
                    manager()
                })
             })
        })
    })
}

function addProduct (z) {
   inquirer.prompt([
       {
           name: 'product',
           message: 'What is the name of the product?'
       },
       {
           name: 'department',
           message: 'What Department does this belong in?'
       },
       {
           name: 'price',
           message: 'What is the price of the product?'
       },
       {
           name: 'quantity',
           message: 'How many are you adding?'
       }
   ]).then(function(res){
       var product = res.product;
       var department = res.department;
       var itemprice = res.price;
       var stock = res.quantity;
       connection.query('INSERT INTO products SET ?', {
           product_name: product,
           department_name: department,
           price: itemprice,
           stock_quantitiy: stock
       }, (function(err, res){
           if (err) throw err
           console.log ('Product Added!')
           manager()
       }))
   })
}
