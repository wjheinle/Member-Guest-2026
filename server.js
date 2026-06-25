const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize data file
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaults = {
      shoppingList: [
        { id: 1, category: 'seafood', text: 'Oysters (3 dozen)', checked: false },
        { id: 2, category: 'seafood', text: 'Shrimp (5 lbs, shell-on)', checked: false },
        { id: 3, category: 'seafood', text: 'Andouille sausage', checked: false },
        { id: 4, category: 'produce', text: 'Corn on the cob (12 ears)', checked: false },
        { id: 5, category: 'produce', text: 'Red potatoes (3 lbs)', checked: false },
        { id: 6, category: 'produce', text: 'Lemons (6)', checked: false },
        { id: 7, category: 'spices', text: 'Old Bay seasoning', checked: false },
        { id: 8, category: 'spices', text: 'Cajun seasoning', checked: false },
        { id: 9, category: 'drinks', text: 'Cocktail sauce', checked: false },
        { id: 10, category: 'supplies', text: 'Newspaper / butcher paper', checked: false },
        { id: 11, category: 'supplies', text: 'Propane (full tank)', checked: false },
        { id: 12, category: 'supplies', text: 'Large boil pot (30+ qt)', checked: false },
      ],
      nextId: 13
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET shopping list
app.get('/api/shopping', (req, res) => {
  const data = loadData();
  res.json(data.shoppingList);
});

// ADD item
app.post('/api/shopping', (req, res) => {
  const { text, category } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text required' });
  const data = loadData();
  const item = { id: data.nextId++, category: category || 'other', text: text.trim(), checked: false };
  data.shoppingList.push(item);
  saveData(data);
  res.json(item);
});

// TOGGLE checked
app.patch('/api/shopping/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = loadData();
  const item = data.shoppingList.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'not found' });
  item.checked = !item.checked;
  saveData(data);
  res.json(item);
});

// DELETE item
app.delete('/api/shopping/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = loadData();
  data.shoppingList = data.shoppingList.filter(i => i.id !== id);
  saveData(data);
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Member Guest 2026 on port ${PORT}`);
});
