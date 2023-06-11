const nodemailer = require('nodemailer');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stock'
});

// Connect to the MySQL server
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Retrieve the item details from the database
const itemName = 'ROSY TISSUE PAPER'; // Change this to the actual item name you want to send
const query = `SELECT item_photo FROM tbl_items WHERE item_name = '${itemName}'`;

connection.query(query, (err, results) => {
  if (err) {
    console.error('Error retrieving item details from MySQL:', err);
    connection.end();
    return;
  }

  // Get the item photo from the query results
  const itemPhoto = results[0].item_photo;

  // Create a transporter object for sending emails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'user@gmail.com',
      pass: 'dfffdfdfsff' // Replace this with the actual password for the seller's email
    }
  });

  // Compose the email message as HTML
  const mailOptions = {
    from: 'user@gmail.comm',
    to: 'customer@hotmail.com',
    subject: 'Regarding Your Purchase',
    html: `
      <html>
        <body>
          <h1>Dear customer,</h1>
          <p>Thank you for your purchase. Here is the item photo:</p>
          <img src="cid:item_photo" alt="Item Photo">
        </body>
      </html>`,
    attachments: [{
      filename: 'item_photo.jpg',
      content: itemPhoto,
      cid: 'item_photo'
    }]
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent successfully:', info.response);
    }

    // Close the MySQL connection
    connection.end();
  });
});
