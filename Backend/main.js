import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD, 
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT, 
// });

const pool = mysql.createPool({
    host: "localhost",
    user: "root", 
    database: "e_commerce_db",
    port: 3306, 
});

// Routes

app.get('/api/product', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM product");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/api/product/:id', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM product WHERE id = ?", [req.params.id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

app.post('/api/product', async (req, res) => {
    try {
        const { nama, harga, lokasi, terjual, rating } = req.body;
        const query = `
            INSERT INTO product (nama, harga, lokasi, terjual, rating) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [nama, harga, lokasi, terjual, rating]);
        res.status(201).json({ msg: "Product created", productId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to create product" });
    }
});

app.patch('/api/product/admin/:id', async (req, res) => {
    try {
        const { nama, harga, lokasi, terjual, rating } = req.body;
        const query = `
            UPDATE product 
            SET nama = ?, harga = ?, lokasi = ?, terjual = ?, rating = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [nama, harga, lokasi, terjual, rating, req.params.id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ msg: "Product updated" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to update product" });
    }
});

app.delete('/api/product/admin/:id', async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM product WHERE id = ?", [req.params.id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ msg: "Product deleted" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM product WHERE terjual >= 3000");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/api/search/:keyword', async (req, res) => {
    try {
        const keyword = `%${req.params.keyword}%`
        const [rows] = await pool.query("SELECT * FROM product WHERE nama LIKE ? OR kategori LIKE ?", [keyword, keyword]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/api/filter/:kategori', async (req, res) => {
    try {
        const categories = req.params.kategori.split(',');

        const placeholders = categories.map(() => '?').join(',');
        
        const [rows] = await pool.query(`SELECT * FROM product WHERE kategori IN (${placeholders})`,categories);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// cart

app.get('/api/cart', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cart')
        res.status(200).json(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/api/cart/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cart WHERE id = ?', [req.params.id]);
        res.status(200).json(rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/api/cartByUser/:username', async (req, res) => {
    try {
        const username = `${req.params.username}`
        const [rows] = await pool.query('SELECT * FROM cart WHERE username = ?', [username]);
        res.status(200).json(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.post('/api/cart', async (req, res) => {
    try {
        const { id, username, productName, harga, lokasi, terjual, rating, stok, jumlah } = req.body;

        const query = `
            INSERT INTO cart (product_id, username, nama, harga, lokasi, terjual, rating, stok, jumlah) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                jumlah = jumlah + VALUES(jumlah)
        `;

        const [result] = await pool.query(query, [id, username, productName, harga, lokasi, terjual, rating, stok, jumlah]);
        res.status(201).json({ msg: "Product inserted/updated successfully", productId: result.insertId || id });
    } catch (err) {
        res.status(500).json({ error: "Failed to process the request" });
    }
});


app.patch('/api/cart/:id', async (req, res) => {
    try {
        const { jumlah } = req.body;
        const id = req.params.id;

        console.log('Received checked:', jumlah); // Log the received checked

        const query = `
            UPDATE cart
            SET jumlah = ?
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [jumlah, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ msg: "Product updated" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to update product" });
    }
});

app.delete('/api/cart/:id', async (req, res) => {
    try {
        const query = 'DELETE FROM cart WHERE id = ?';

        const [result] = await pool.query(query, [req.params.id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ msg: "Product updated" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to update product" });
    }
});

//Users

app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]); 
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { username, password, konfirmasiPassword, kataKunci } = req.body;

        if (!username || !password || !konfirmasiPassword || !kataKunci) {
            return res.status(403).json({ error: "Input can't be empty" });
        }
        if (password !== konfirmasiPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        if (password.length < 8) {
            return res.status(401).json({ error: "username under 8 characters" });
        }
        if(username.length > 20){
            return res.status(402).json({ error: "username length under 20" }); 
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const hashedKataKunci = await bcrypt.hash(kataKunci, saltRounds);

        const query = `
            INSERT INTO users (username, password, kata_kunci) 
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(query, [username, hashedPassword, hashedKataKunci]);
        res.status(201).json({ msg: "Product created", productId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to create product" });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if(username == '' && password == ''){
            return res.status(403).json({message: 'cant be empty'});
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('password valid', isPasswordValid)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.json({ message: 'Login successful', user: userWithoutPassword });
        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

app.post('/api/retriveaccount', async (req, res) => {
    const { username, kataKunci } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if(!username || !kataKunci){
            return res.status(403).json({message: 'cant be empty'})
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = rows[0];

        const isKataKunciValid = await bcrypt.compare(kataKunci, user.kata_kunci);
        console.log('kata kunci valid', isKataKunciValid)

        if (!isKataKunciValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const userId = user.id;
        return res.json({ message: 'kata kunci benar', userId });
        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

app.patch('/api/users/:id', async (req, res) => {
    try{
        const { passwordBaru, konfirmasiPasswordBaru } = req.body;
        const id = req.params.id;

        if(!passwordBaru || !konfirmasiPasswordBaru){
            return res.status(403).json({message: 'cant be empty'})
        }
    
        if (passwordBaru !== konfirmasiPasswordBaru) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        const hashedPasswordBaru = await bcrypt.hash(passwordBaru, 10);
    
        const query = `UPDATE users SET password = ? WHERE id = ?`;
        const [rows] = await pool.query(query, [hashedPasswordBaru, id]);
        return res.status(201).json(rows)
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
})

app.get('/api/checkout', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM checkout");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch checkout" });
    }
});

app.get('/api/checkout/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query("SELECT * FROM checkout WHERE id = ?", [id])
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'failed to fetch from checkout'})
    }
})

app.get('/api/checkoutByUser/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const [rows] = await pool.query(`
            SELECT product_id, nama, harga, jumlah, 
                   DATE_FORMAT(CONVERT_TZ(tanggal, '+00:00', '+07:00'), '%Y-%m-%d') AS tanggal
            FROM checkout 
            WHERE username = ?`, [username]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Failed to fetch from checkout' });
    }
});

app.post('/api/checkoutOneItem', async (req, res) => {
    try {
        const { product_id, username, nama, harga, jumlah, tanggal } = req.body;

        const insertCheckoutQuery = `
            INSERT INTO checkout (product_id, username, nama, harga, jumlah, tanggal)
            VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                jumlah = jumlah + VALUES(jumlah)
        `;
        await pool.query(insertCheckoutQuery, [product_id, username, nama, harga, jumlah, tanggal]);

        const updateStokQuery = `UPDATE product SET stok = stok - ? WHERE id = ?`

        await pool.query(updateStokQuery, [jumlah ,product_id]);

        res.status(200).json({ message: 'Checkout successful and item removed from cart' });
    } catch (error) {
        console.error('Error during checkoutOneItem:', error.message);
        res.status(500).json({ error: 'Failed to checkout item' });
    }
});


app.post('/api/checkout', async (req, res) => {
    const { username, cartItems } = req.body;

    if (!username || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: "Invalid request: Missing username or cart items" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const item of cartItems) {
            const { product_id, nama, harga, jumlah, tanggal } = item;

            const [productRows] = await connection.query(
                `SELECT stok FROM product WHERE id = ?`,
                [product_id]
            );
            const product = productRows[0];

            if (!product || product.stok < jumlah) {
                throw new Error(`Insufficient stock for product ID ${product_id}`);
            }

            await connection.query(
                `UPDATE product SET stok = stok - ? WHERE id = ?`,
                [jumlah, product_id]
            );

            await connection.query(
                `INSERT INTO checkout (product_id, username, nama, harga, jumlah, tanggal) 
                 VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    jumlah = jumlah + VALUES(jumlah)
                 `,    
                [product_id, username, nama, harga, jumlah, tanggal]
            );
        }

        const itemIds = cartItems.map(item => item.product_id);
        await connection.query(
            `DELETE FROM cart WHERE username = ? AND product_id IN (?)`,
            [username, itemIds]
        );

        await connection.commit();
        res.status(200).json({ message: "Checkout completed successfully" });
    } catch (err) {
        await connection.rollback();
        console.error(`Checkout error: ${err.message}`);
        res.status(500).json({ error: `Checkout failed: ${err.message}` });
    } finally {
        connection.release();
    }
});


app.delete('/api/cart/:id' , async (req, res) => {
    try{

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to delete cart items" });
    }
})


app.listen(port, () => console.log("Server is running on port 3001"));
