import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const dbPath = path.join(rootDir, 'data.sqlite');

const app = express();
const db = new Database(dbPath);
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '28122010As';
const SESSION_SECRET = process.env.SESSION_SECRET || 'agafonov-super-secret-change-me';

const SERVICES_SEED = [
  {
    id: 's1', slug: 'rating-boost', title: 'Поднятие рейтинга', shortDesc: 'Режимы любые, диапазоны рейтинга на выбор.', description: 'Услуга повышения рейтинга в разных диапазонах. Стоимость вариантов можно редактировать в панели администратора.', badge: 'Популярно', category: 'Рейтинг', basePrice: 120, heroAccent: 'rgba(185,146,82,0.16)',
    options: [
      { id: 'o1', label: '1950 — 2150', price: 900, enabled: 1 },
      { id: 'o2', label: '1650 — 1950', price: 700, enabled: 1 },
      { id: 'o3', label: '1350 — 1650', price: 550, enabled: 1 },
      { id: 'o4', label: '1050 — 1350', price: 400, enabled: 1 },
      { id: 'o5', label: '700 — 1050', price: 280, enabled: 1 },
      { id: 'o6', label: '401 — 700', price: 180, enabled: 1 },
      { id: 'o7', label: '100 — 400', price: 120, enabled: 1 }
    ]
  },
  {
    id: 's2', slug: 'game-analysis', title: 'Разбор вашей партии', shortDesc: 'Профессиональный анализ ошибок и идей.', description: 'Детальный разбор сыгранной партии: ошибки, ключевые позиции, дебют, миттельшпиль и эндшпиль.', badge: 'Быстро', category: 'Разбор', basePrice: 40, heroAccent: 'rgba(49,70,59,0.14)',
    options: [{ id: 'o8', label: 'Один разбор партии', price: 40, enabled: 1 }]
  },
  {
    id: 's3', slug: 'play-session', title: 'Игра со мной', shortDesc: 'Онлайн-сессия 1–3 часа.', description: 'Практическая игра онлайн с последующим обсуждением идей, типовых ошибок и плана роста.', badge: 'Онлайн', category: 'Практика', basePrice: 130, heroAccent: 'rgba(107,59,66,0.12)',
    options: [
      { id: 'o9', label: '1 час', price: 130, enabled: 1 },
      { id: 'o10', label: '2 часа', price: 260, enabled: 1 },
      { id: 'o11', label: '3 часа', price: 390, enabled: 1 }
    ]
  },
  {
    id: 's4', slug: 'tactics-training', title: 'Обучение тактическим приёмам', shortDesc: 'Полное обучение или отдельный элемент.', description: 'Онлайн-обучение тактике с выбором полной программы или отдельного элемента. Доступны занятия на 1–3 часа.', badge: 'Обучение', category: 'Обучение', basePrice: 1150, heroAccent: 'rgba(185,146,82,0.18)',
    options: [
      { id: 'o12', label: 'Полное обучение', price: 1150, enabled: 1 },
      { id: 'o13', label: 'Вилка', price: 100, enabled: 1 },
      { id: 'o14', label: 'Связка', price: 110, enabled: 1 },
      { id: 'o15', label: 'Завлечение', price: 110, enabled: 1 },
      { id: 'o16', label: 'Сквозное нападение', price: 120, enabled: 1 },
      { id: 'o17', label: 'Вскрытое нападение', price: 120, enabled: 1 },
      { id: 'o18', label: 'Двойной шах', price: 120, enabled: 1 },
      { id: 'o19', label: 'Уничтожение защиты', price: 130, enabled: 1 },
      { id: 'o20', label: 'Отвлечение', price: 110, enabled: 1 },
      { id: 'o21', label: 'Перекрытие', price: 110, enabled: 1 },
      { id: 'o22', label: 'Упрощение', price: 100, enabled: 1 },
      { id: 'o23', label: 'Ловушка для фигуры', price: 120, enabled: 1 },
      { id: 'o24', label: 'Мат по последней горизонтали', price: 130, enabled: 1 }
    ]
  },
  {
    id: 's5', slug: 'tournaments', title: 'Победа на турнирах', shortDesc: 'Russian Chess Tour и турниры по рейтингу.', description: 'Победа на турнирах и участие в рейтинговых турнирах. Для нестандартных турниров стоимость согласуется отдельно.', badge: 'Турниры', category: 'Турниры', basePrice: 400, heroAccent: 'rgba(49,70,59,0.16)',
    options: [
      { id: 'o25', label: 'Russian Chess Tour 1500+', price: 400, enabled: 1 },
      { id: 'o26', label: 'Russian Chess Tour 1800+', price: 800, enabled: 1 },
      { id: 'o27', label: 'Russian Chess Tour 2000+', price: 1100, enabled: 1 },
      { id: 'o28', label: 'Турниры 1000–2000 (цена по договорённости)', price: 1000, enabled: 1 }
    ]
  },
  {
    id: 's6', slug: 'leagues', title: 'Подниму вас в любую лигу', shortDesc: 'Цена за 1 лигу. Более одной — до 2–3 недель.', description: 'Услуга подъёма в лигу. Лига Легенда недоступна. Остальные лиги доступны для заказа.', badge: 'Лиги', category: 'Лиги', basePrice: 60, heroAccent: 'rgba(107,59,66,0.14)',
    options: [
      { id: 'o29', label: 'Бронза', price: 60, enabled: 1 },
      { id: 'o30', label: 'Серебро', price: 140, enabled: 1 },
      { id: 'o31', label: 'Кристалл', price: 300, enabled: 1 },
      { id: 'o32', label: 'Элита', price: 500, enabled: 1 },
      { id: 'o33', label: 'Чемпион', price: 800, enabled: 1 },
      { id: 'o34', label: 'Лига Легенда — недоступно', price: 0, enabled: 0 }
    ]
  }
];

const INITIAL_ORDERS = [
  { id: 'ord-1001', serviceId: 's2', serviceTitle: 'Разбор вашей партии', optionLabel: 'Один разбор партии', customerName: 'Игрок_128', amount: 40, note: '', status: 'REVIEW_LEFT', createdAt: '2026-03-30T10:00:00.000Z' },
  { id: 'ord-1002', serviceId: 's3', serviceTitle: 'Игра со мной', optionLabel: '2 часа', customerName: 'KnightRush', amount: 260, note: 'Хочу тренировочную сессию по блицу и разбор по ходу.', status: 'DONE_BY_ADMIN', createdAt: '2026-03-30T12:15:00.000Z' },
  { id: 'ord-1003', serviceId: 's1', serviceTitle: 'Поднятие рейтинга', optionLabel: '1350 — 1650', customerName: 'RookFlow', amount: 550, note: '', status: 'IN_PROGRESS', createdAt: '2026-03-30T13:25:00.000Z' }
];

const INITIAL_REVIEWS = [
  { id: 'rev-1', orderId: 'ord-1001', customerName: 'Игрок_128', rating: 5, text: 'Очень понятный и полезный разбор. Всё по делу и без воды.', adminReply: 'Спасибо за отзыв. Рад, что разбор помог.', createdAt: '2026-03-30T11:00:00.000Z', serviceTitle: 'Разбор вашей партии', optionLabel: 'Один разбор партии', amount: 40, purchasedAt: '2026-03-30T10:00:00.000Z' }
];

const INITIAL_PAYOUTS = [
  { id: 'pay-1', amount: 300, cardNumber: '**** **** **** 1234', createdAt: '2026-03-30T15:00:00.000Z' }
];

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      shortDesc TEXT NOT NULL,
      description TEXT NOT NULL,
      badge TEXT,
      category TEXT NOT NULL,
      basePrice INTEGER NOT NULL,
      heroAccent TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS service_options (
      id TEXT PRIMARY KEY,
      serviceId TEXT NOT NULL,
      label TEXT NOT NULL,
      price INTEGER NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY(serviceId) REFERENCES services(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      serviceId TEXT NOT NULL,
      serviceTitle TEXT NOT NULL,
      optionLabel TEXT NOT NULL,
      customerName TEXT NOT NULL,
      amount INTEGER NOT NULL,
      note TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      adminReply TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      serviceTitle TEXT NOT NULL,
      optionLabel TEXT NOT NULL,
      amount INTEGER NOT NULL,
      purchasedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payouts (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      cardNumber TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  const serviceCount = db.prepare('SELECT COUNT(*) AS count FROM services').get().count;
  if (serviceCount === 0) {
    const insertService = db.prepare(`INSERT INTO services (id, slug, title, shortDesc, description, badge, category, basePrice, heroAccent)
      VALUES (@id, @slug, @title, @shortDesc, @description, @badge, @category, @basePrice, @heroAccent)`);
    const insertOption = db.prepare(`INSERT INTO service_options (id, serviceId, label, price, enabled)
      VALUES (@id, @serviceId, @label, @price, @enabled)`);
    const tx = db.transaction(() => {
      for (const service of SERVICES_SEED) {
        insertService.run(service);
        for (const option of service.options) {
          insertOption.run({ ...option, serviceId: service.id });
        }
      }
    });
    tx();
  }

  const orderCount = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
  if (orderCount === 0) {
    const insertOrder = db.prepare(`INSERT INTO orders (id, serviceId, serviceTitle, optionLabel, customerName, amount, note, status, createdAt)
      VALUES (@id, @serviceId, @serviceTitle, @optionLabel, @customerName, @amount, @note, @status, @createdAt)`);
    const tx = db.transaction(() => INITIAL_ORDERS.forEach((row) => insertOrder.run(row)));
    tx();
  }

  const reviewCount = db.prepare('SELECT COUNT(*) AS count FROM reviews').get().count;
  if (reviewCount === 0) {
    const insertReview = db.prepare(`INSERT INTO reviews (id, orderId, customerName, rating, text, adminReply, createdAt, serviceTitle, optionLabel, amount, purchasedAt)
      VALUES (@id, @orderId, @customerName, @rating, @text, @adminReply, @createdAt, @serviceTitle, @optionLabel, @amount, @purchasedAt)`);
    const tx = db.transaction(() => INITIAL_REVIEWS.forEach((row) => insertReview.run(row)));
    tx();
  }

  const payoutCount = db.prepare('SELECT COUNT(*) AS count FROM payouts').get().count;
  if (payoutCount === 0) {
    const insertPayout = db.prepare(`INSERT INTO payouts (id, amount, cardNumber, createdAt)
      VALUES (@id, @amount, @cardNumber, @createdAt)`);
    const tx = db.transaction(() => INITIAL_PAYOUTS.forEach((row) => insertPayout.run(row)));
    tx();
  }
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function getServices() {
  const services = db.prepare('SELECT * FROM services ORDER BY id').all();
  const options = db.prepare('SELECT * FROM service_options ORDER BY id').all();
  return services.map((service) => ({
    ...service,
    options: options
      .filter((option) => option.serviceId === service.id)
      .map((option) => ({ ...option, enabled: Boolean(option.enabled) }))
  }));
}

function getOrders() {
  return db.prepare('SELECT * FROM orders ORDER BY datetime(createdAt) DESC').all();
}

function getReviews() {
  return db.prepare('SELECT * FROM reviews ORDER BY datetime(createdAt) DESC').all();
}

function getPayouts() {
  return db.prepare('SELECT * FROM payouts ORDER BY datetime(createdAt) DESC').all();
}

function getStats() {
  const orders = getOrders();
  const reviews = getReviews();
  const payouts = getPayouts();
  const completedOrdersCount = orders.filter((order) => ['DONE_BY_ADMIN', 'CONFIRMED_BY_CLIENT', 'REVIEW_LEFT'].includes(order.status)).length;
  const averageRating = reviews.length ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)) : 0;
  const turnover = orders
    .filter((order) => ['DEMO_PAID', 'PENDING_FULFILLMENT', 'IN_PROGRESS', 'DONE_BY_ADMIN', 'CONFIRMED_BY_CLIENT', 'REVIEW_LEFT'].includes(order.status))
    .reduce((sum, order) => sum + order.amount, 0);
  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amount, 0);
  return { completedOrdersCount, averageRating, turnover, totalPayouts, balance: Math.max(turnover - totalPayouts, 0) };
}

function requireAdmin(req, res, next) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({ error: 'Требуется вход администратора' });
  }
  next();
}

app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(express.static(publicDir));

initDb();

app.get('/api/bootstrap', (req, res) => {
  res.json({
    services: getServices(),
    reviews: getReviews(),
    stats: getStats(),
    adminAuthed: Boolean(req.session?.isAdmin)
  });
});

app.post('/api/orders', (req, res) => {
  const { serviceId, optionId, customerName, note } = req.body || {};
  if (!serviceId || !optionId) {
    return res.status(400).json({ error: 'Не выбрана услуга или вариант' });
  }

  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
  const option = db.prepare('SELECT * FROM service_options WHERE id = ? AND serviceId = ?').get(optionId, serviceId);

  if (!service || !option || !option.enabled) {
    return res.status(400).json({ error: 'Выбранный вариант недоступен' });
  }

  const newOrder = {
    id: randomId('ord'),
    serviceId,
    serviceTitle: service.title,
    optionLabel: option.label,
    customerName: String(customerName || 'Гость').trim() || 'Гость',
    amount: option.price,
    note: String(note || '').trim(),
    status: 'PENDING_FULFILLMENT',
    createdAt: new Date().toISOString()
  };

  db.prepare(`INSERT INTO orders (id, serviceId, serviceTitle, optionLabel, customerName, amount, note, status, createdAt)
    VALUES (@id, @serviceId, @serviceTitle, @optionLabel, @customerName, @amount, @note, @status, @createdAt)`).run(newOrder);

  res.json({ order: newOrder });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }
  req.session.isAdmin = true;
  res.json({ ok: true });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/admin/bootstrap', requireAdmin, (req, res) => {
  res.json({
    services: getServices(),
    orders: getOrders(),
    reviews: getReviews(),
    payouts: getPayouts(),
    stats: getStats()
  });
});

app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ ok: true });
});

app.patch('/api/admin/services/:serviceId/base-price', requireAdmin, (req, res) => {
  db.prepare('UPDATE services SET basePrice = ? WHERE id = ?').run(Number(req.body.basePrice) || 0, req.params.serviceId);
  res.json({ ok: true });
});

app.patch('/api/admin/services/:serviceId/options/:optionId', requireAdmin, (req, res) => {
  const current = db.prepare('SELECT * FROM service_options WHERE id = ? AND serviceId = ?').get(req.params.optionId, req.params.serviceId);
  if (!current) return res.status(404).json({ error: 'Опция не найдена' });
  const nextPrice = Number.isFinite(req.body.price) ? Number(req.body.price) : current.price;
  const nextEnabled = typeof req.body.enabled === 'boolean' ? (req.body.enabled ? 1 : 0) : current.enabled;
  db.prepare('UPDATE service_options SET price = ?, enabled = ? WHERE id = ? AND serviceId = ?').run(nextPrice, nextEnabled, req.params.optionId, req.params.serviceId);
  res.json({ ok: true });
});

app.patch('/api/admin/reviews/:id/reply', requireAdmin, (req, res) => {
  db.prepare('UPDATE reviews SET adminReply = ? WHERE id = ?').run(String(req.body.reply || ''), req.params.id);
  res.json({ ok: true });
});

app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  if (review) {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('CONFIRMED_BY_CLIENT', review.orderId);
  }
  res.json({ ok: true });
});

app.post('/api/admin/payouts', requireAdmin, (req, res) => {
  const amount = Number(req.body.amount);
  const cardNumber = String(req.body.cardNumber || '').trim();
  if (!Number.isFinite(amount) || amount <= 0 || !cardNumber) {
    return res.status(400).json({ error: 'Некорректная сумма или карта' });
  }
  const payout = { id: randomId('pay'), amount, cardNumber, createdAt: new Date().toISOString() };
  db.prepare('INSERT INTO payouts (id, amount, cardNumber, createdAt) VALUES (@id, @amount, @cardNumber, @createdAt)').run(payout);
  res.json({ ok: true });
});

app.post('/api/admin/reset', requireAdmin, (req, res) => {
  db.exec('DELETE FROM service_options; DELETE FROM services; DELETE FROM orders; DELETE FROM reviews; DELETE FROM payouts;');
  initDb();
  res.json({ ok: true });
});

app.post('/api/reviews', (req, res) => {
  const { orderId, rating, text } = req.body || {};
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });
  if (!text || !String(text).trim()) return res.status(400).json({ error: 'Введите текст отзыва' });
  const existing = db.prepare('SELECT id FROM reviews WHERE orderId = ?').get(orderId);
  if (existing) return res.status(400).json({ error: 'Отзыв уже оставлен' });
  const review = {
    id: randomId('rev'),
    orderId,
    customerName: order.customerName,
    rating: Number(rating) || 5,
    text: String(text).trim(),
    adminReply: '',
    createdAt: new Date().toISOString(),
    serviceTitle: order.serviceTitle,
    optionLabel: order.optionLabel,
    amount: order.amount,
    purchasedAt: order.createdAt
  };
  db.prepare(`INSERT INTO reviews (id, orderId, customerName, rating, text, adminReply, createdAt, serviceTitle, optionLabel, amount, purchasedAt)
    VALUES (@id, @orderId, @customerName, @rating, @text, @adminReply, @createdAt, @serviceTitle, @optionLabel, @amount, @purchasedAt)`).run(review);
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('REVIEW_LEFT', orderId);
  res.json({ ok: true });
});

app.patch('/api/orders/:id/confirm', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('CONFIRMED_BY_CLIENT', req.params.id);
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
