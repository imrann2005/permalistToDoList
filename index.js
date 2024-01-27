import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "shamshad05",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

async function checkListInDB(){
  try {
    const tastList = await db.query("SELECT * FROM ITEMS");
    items = tastList.rows;
    return items
  } catch (error) {
    console.log(error);
  }
}

app.get("/", async (req, res) => {

  const currentList = await checkListInDB();

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: currentList,
  });
});

app.post("/add", async (req, res) => {
  const newItemTitle = req.body.newItem;
 try {
  await db.query("INSERT INTO items(title) VALUES($1)",[newItemTitle]);
  res.redirect("/");
 } catch (error) {
  console.log(error);
 }
  
});

app.post("/edit", async (req, res) => {
 const updatedItemId = req.body.updatedItemId;
 const updatedItemTitle = req.body.updatedItemTitle;
try {
  await db.query("UPDATE items SET title = $1 WHERE id = $2",[updatedItemTitle,updatedItemId]);
  res.redirect("/");

} catch (error) {
  console.log(error);
}
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1",[deleteItemId]);
    res.redirect("/");

  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
