import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'e_commerce_db' 
});

// Routes

app.get('/shop', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM product");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/shop/:id', async (req, res) => {
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

app.post('/shop', async (req, res) => {
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

app.patch('/shop/admin/:id', async (req, res) => {
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

app.delete('/shop/admin/:id', async (req, res) => {
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

app.get('/trending', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM product WHERE terjual >= 3000");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/search/:keyword', async (req, res) => {
    try {
        const keyword = `%${req.params.keyword}%`
        const [rows] = await pool.query("SELECT * FROM product WHERE nama LIKE ? OR kategori LIKE ?", [keyword, keyword]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/filter/:kategori', async (req, res) => {
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

app.get('/cart', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cart')
        res.status(200).json(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/cart/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cart WHERE id = ?', [req.params.id]);
        res.status(200).json(rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.post('/cart', async (req, res) => {
    try {
        const { id, productName, harga, lokasi, terjual, rating, stok, jumlah } = req.body;

        const query = `
            INSERT INTO cart (id, nama, harga, lokasi, terjual, rating, stok, jumlah) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [id, productName, harga, lokasi, terjual, rating, stok, jumlah]);
        res.status(201).json({ msg: "Product created", productId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to create product" });
    }
});


app.patch('/cart/:id', async (req, res) => {
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

app.delete('/cart/:id', async (req, res) => {
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

app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]); 
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { username, email, password, konfirmasiPassword, kataKunci } = req.body;

        if (!username || !email || !password || !konfirmasiPassword || !kataKunci) {
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
            INSERT INTO users (username, email, password, kata_kunci) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [username, email, hashedPassword, hashedKataKunci]);
        res.status(201).json({ msg: "Product created", productId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to create product" });
    }
});

app.post('/login', async (req, res) => {
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

app.post('/retriveaccount', async (req, res) => {
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

        const { password: _, ...userWithoutPassword } = user;
        return res.json({ message: 'Login successful', user: userWithoutPassword });
        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});



app.listen(3001, () => console.log("Server is running on port 3001"));
