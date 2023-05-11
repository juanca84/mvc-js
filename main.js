const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "items_o9sd_user",
  host: "dpg-chedko5269v75d4phhh0-a.oregon-postgres.render.com",
  database: "items_o9sd",
  password: "G0pFF2ImVf7pHzOgz2egZOWL3LJCWZe7",
  port: "5432",
});

// Modelo
class Model {
  async getItems() {
    const { rows } = await pool.query("select * from items;");
    return rows;
  }

  async addItem(name) {
    await pool.query("insert into items (name) values ($1)", [name]);
  }
}

//Vista
class View {
  render(data) {
    let html = "";
    for (let i = 0; i < data.length; i++) {
      html += `
      <li>
      ${data[i].name}
      </li>`;
    }
    return html;
  }
}

//Controlador
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async getItems(req, res) {
    const data = await this.model.getItems();
    const html = this.view.render(data);
    res.send(html);
  }

  async addItem(req, res) {
    const name = req.body.name;
    await this.model.addItem(name);
    const data = await this.model.getItems();
    const html = this.view.render(data);
    res.send(html);
  }
}

//Instanciación
const model = new Model();
const view = new View();
const controller = new Controller(model, view);

app.use(express.urlencoded({ extended: true }));

app.get("/", controller.getItems.bind(controller));
app.post("/add", controller.addItem.bind(controller));

app.listen(port, () => {
  console.log(`Este servidor se ejecuta en http://localhost:${port}`);
});
