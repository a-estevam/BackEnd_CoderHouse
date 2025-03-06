
import express from "express";

const app = express();

const fakeUsers = [
  {
    id: 1,
    nome: "Antonio",
  },
  {
    id: 2,
    nome: "Tonico",
  },
];




app.get("/saudar", (req, res) => {
  res.send("Olá, seja bem-vindo");
});

app.get("/usuarios", (req, res) => {
  res.json(fakeUsers);
});

app.get("/usuarios/:userId", (req, res) => {
  console.log(req.params);
  const { userId } = req.params;

  const user = fakeUsers.find((user) => user.id === Number(userId));
  if (!user) {
    return res.json({ message: "usuario n existe" });
  }

  res.json(user);
});

app.listen(8080, () => {
  console.log("Servidor na porta 8080");
});
