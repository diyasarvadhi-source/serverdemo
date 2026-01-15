const express = require('express');
const fs= require('fs');
const app = express();
const port = 5000;
const users = require('./MOCK_DATA.json');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.get('/api/users',(req,res)=>{
    return res.json(users);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .put((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ message: "user not found" });

        }
        users[userIndex] = {...users[userIndex], ...req.body };

        fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users, null, 2));

        return res.json(users[userIndex])
    }).delete((req, res) => {

        const id = Number(req.params.id);
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ message: "User not found" });
        }

        const deletedUser = users[userIndex];
        const updatedUsers = users.filter(u => u.id !== id);

        fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users, null, 2));
        return res.json({
            message: "user deleted!!",
            user: deletedUser
        })
    });

app.post('/api/users', (req, res) => {
    const body = req.body;
    // console.log("Body", body);
    users.push({id: users.length + 1 ,...body});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "succes", id: users.length })
    })


});


app.get('/users', (req, res) => {
            const html = `
    <ul>
       ${users.map((user) => `<li>${user.first_name}</li>`).join(" ")}
    </ul>
    `;
    res.send(html);
});
app.listen(port, () => console.log(`Server Started on Port : ${port}`));