const sequelize = require('./mysql');
const server = require('./server');
const jwt = require('jsonwebtoken');
const signature = require('./config');

/*----------------Middlewares----------------*/
const authMiddleware = require('./middlewares/auth');
const adminMiddleware = require('./middlewares/admin');
const checkUsername = require('./middlewares/check-username');


/*----------------PRODUCTS----------------*/
//CREATE a Product
server.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {  name, description, img_url, price, price_discount, is_active } = req.body;
        await sequelize.query(
        `INSERT into products ( name, description, img_url, price, price_discount, is_active)
        VALUES ( ?, ?, ?, ?, ?, ?)`
        , { replacements: [ name, description, img_url, price, price_discount, is_active ] }
        );   
        res.status(200).send('Producto agregado.');    
    } catch(err) {
        const errorCode = err.original.errno;
        switch (errorCode) {
            case 1062:
            res.status(409).send('El nombre del producto ya está en uso.'); 
            break;
          case 1048:
            res.status(400).send('Falta completar campos.'); 
            break;
          default:
            res.status(500).send('Error creando el producto'); 
        }
    }
});

//READ all active Products
server.get('/products', authMiddleware, async (req, res) => {
    try {
        const query = 'SELECT * FROM products WHERE is_active = 1';
        const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT },
        )
        res.send(data);
        console.log(data);
    } catch(err) {
        console.log(err); 
        }   
});

//READ a Product by ID
server.get('/products/:id', authMiddleware, async (req, res) => {
    try {
        const query = `SELECT * FROM products WHERE id = ${req.params.id}`;
        const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT },
        )
        if (data[0]) {
            console.log(data[0]);
            return res.send(data[0]);
        }
        res.status(404).send('Producto no encontrado.'); 
} catch(err) {
    console.log(err); 
    }
});

//UPDATE a Product by ID
server.put('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {  name, description, img_url, price, price_discount, is_active } = req.body;
        const query = `UPDATE products SET
        name = ?,
        description = ?,
        img_url = ?,
        price = ?,
        price_discount = ?,
        is_active = ?
        WHERE id = ${req.params.id}`
        await sequelize.query(query, { replacements: [ name, description, img_url, price, price_discount, is_active ] });
        res.status(200).send('Producto modificado.');
    } catch(err) {
    console.log(err); 
    }
});

//DELETE a Product by ID
server.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const query = `DELETE from products WHERE id = ${req.params.id}`
        await sequelize.query(query, { replacements: { id: parseInt(req.params.id)} });
        res.status(200).send('Producto borrado.');
    } catch(err) {
    console.log(err); 
    }
});

/*----------------USERS----------------*/
//LOGIN
server.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const data = await sequelize.query(
        `SELECT users.*, user_roles.role FROM users
        JOIN user_roles ON users.role_id = user_roles.id
        WHERE username = ? AND password = ?`
        , { replacements: [username, password], type: sequelize.QueryTypes.SELECT }
        );   

        if(data.length) {
            const token = jwt.sign({
                username: data[0].username,
                role: data[0].role,
                userId: data[0].id
            }, signature)

            res.send({
                username: data[0].username,
                token,
            })

        } else {
            res.status(400).send('Usuario o contraseña incorrecto.')
        }
        
        
    } catch(err) {
        console.log(err); 
        } 
});

//SIGNUP
server.post('/signup', async (req, res) => {
    try {
        const { username, name, email, phone, address, password } = req.body;
        await sequelize.query(
        `INSERT into users ( username, name, email, phone, address, password )
        VALUES ( ?, ?, ?, ?, ?, ?)`
        , { replacements: [ username, name, email, phone, address, password ] }
        );
        res.status(201).send('Registro de usuario exitoso.');    
        
    } catch(err) {
        const errorCode = err.original.errno;
        switch (errorCode) {
          case 1062:
            res.status(409).send('El username o mail ya están en uso.'); 
            break;
          case 1048:
            res.status(400).send('Falta completar campos.'); 
            break;
          default:
            res.status(500).send('Error creando el usuario'); 
        }
 
    } 
});

//READ Users by username
server.get('/users/:username', authMiddleware, checkUsername, async (req, res) => {
    try {
        const query = `SELECT * FROM users WHERE username = '${req.params.username}'`;
        const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        if (data[0]) {
            console.log(data[0]);
            return res.send(data[0]);
        }
        res.status(404).send('Usuario no encontrado.'); 
} catch(err) {
    console.log(err); 
    }
});

//READ all Users
server.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT },
        )
        res.send(data);
        console.log(data);
    } catch(err) {
        console.log(err); 
        }   
});

/*----------------ORDERS----------------*/

//CREATE a Order
server.post('/orders', authMiddleware, async (req, res) => {
    try {
        const user = Object.values(req.body[0])[0];
        const paymentMethod = Object.values(req.body[1])[0];  
        await sequelize.query(`
            INSERT INTO orders
            (user_id, payment_method_id)
            VALUES 
            (?, ?)`
            , {replacements: [paymentMethod, user]});           

        const data = await sequelize.query(
            'SELECT MAX(id) FROM orders',
            { type: sequelize.QueryTypes.SELECT });

        const orderId = Object.values(data[0])[0];

        async function insertProducts(product, i, array) {
            await sequelize.query(`
                INSERT INTO order_products
                (order_id, product_id)
                VALUES 
                (?, ?)`,
                {replacements: [orderId, product.product_id]}
            );
        };
        req.body.forEach(insertProducts);
        res.status(200).send('Registro de orden exitoso.');

    } catch(err) {
        console.log(err); 
        } 
});

//READ all active Orders
server.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const query = `SELECT order_status.status, orders.created_at, orders.id order_id, products.name product_name, payment_methods.name payment_method, users.name user_name, users.address
        FROM orders
        JOIN users ON user_id = users.id
        JOIN payment_methods ON payment_method_id = payment_methods.id
        JOIN order_status ON status_id = order_status.id
        JOIN order_products ON orders.id = order_products.order_id
        JOIN products ON order_products.product_id = products.id`;
        const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        res.send(data);
        console.log(data);
    } catch(err) {
        console.log(err); 
        }   
});

//READ Order by ID
server.get('/orders/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const query = `SELECT order_status.status, orders.created_at, orders.id order_id, products.name product_name, payment_methods.name payment_method, users.name user_name, users.address
        FROM orders
        JOIN users ON user_id = users.id
        JOIN payment_methods ON payment_method_id = payment_methods.id
        JOIN order_status ON status_id = order_status.id
        JOIN order_products ON orders.id = order_products.order_id
        JOIN products ON order_products.product_id = products.id
        WHERE orders.id = ${req.params.id}`;
        const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        if (data) {
            console.log(data);
            return res.send(data);
        }
        res.status(404).send('Orden no encontrada.'); 
    } catch(err) {
        console.log(err); 
        }   
});

//UPDATE Order's status by ID
server.put('/orders/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status_id } = req.body;
        await sequelize.query(
        `UPDATE orders SET
            status_id = ?
        WHERE id = ${req.params.id}
        `, { replacements: [ status_id ] }
        );
        res.status(200).send('Status de la orden modificado.');
    } catch(err) {
    console.log(err); 
    }
});

//DELETE an Order by ID
server.delete('/orders/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const query = `DELETE from orders WHERE id = ${req.params.id}`
        await sequelize.query(query, { replacements: { id: parseInt(req.params.id)} });
        res.status(200).send('Orden borrada.');
    } catch(err) {
    console.log(err); 
    }
});
