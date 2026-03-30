import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const dbPath = process.env.DB_PATH || path.join('/tmp', 'data.sqlite');

const PORT = process.env.PORT || 8080;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '28122010As';
const SESSION_SECRET = process.env.SESSION_SECRET || 'sdfh23i04kjsdf824hksdf8234';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    }
  })
);

const db = new Database(dbPath);
console.log('DB path:', dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    slug TEXT,
    title TEXT NOT NULL,
    shortDesc TEXT,
    description TEXT,
    badge TEXT,
    category TEXT,
    basePrice INTEGER DEFAULT 0,
    heroAccent TEXT,
    optionsJson TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    serviceId TEXT NOT NULL,
    serviceTitle TEXT NOT NULL,
    optionLabel TEXT NOT NULL,
    customerName TEXT NOT NULL,
    amount INTEGER NOT NULL,
    note TEXT DEFAULT '',
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    customerName TEXT NOT NULL,
    rating INTEGER NOT NULL,
    text TEXT NOT NULL,
    adminReply TEXT DEFAULT '',
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

const SERVICES_SEED = [
  {
    id: 's1',
    slug: 'rating-boost',
    title: 'Поднятие рейтинга',
    shortDesc: 'Режимы любые, диапазоны рейтинга на выбор.',
    description: 'Услуга повышения рейтинга в разных диапазонах. Стоимость вариантов можно редактировать в панели администратора.',
    badge: 'Популярно',
    category: 'Рейтинг',
    basePrice: 120,
    heroAccent: 'rgba(185,146,82,0.16)',
    options: [
      { id: 'o1', label: '1950 — 2150', price: 900, enabled: true },
      { id: 'o2', label: '1650 — 1950', price: 700, enabled: true },
      { id: 'o3', label: '1350 — 1650', price: 550, enabled: true },
      { id: 'o4', label: '1050 — 1350', price: 400, enabled: true },
      { id: 'o5', label: '700 — 1050', price: 280, enabled: true },
      { id: 'o6', label: '401 — 700', price: 180, enabled: true },
      { id: 'o7', label: '100 — 400', price: 120, enabled: true }
    ]
  },
  {
    id: 's2',
    slug: 'game-analysis',
    title: 'Разбор вашей партии',
    shortDesc: 'Профессиональный анализ ошибок и идей.',
    description: 'Детальный разбор сыгранной партии: ошибки, ключевые позиции, дебют, миттельшпиль и эндшпиль.',
    badge: 'Быстро',
    category: 'Разбор',
    basePrice: 40,
    heroAccent: 'rgba(49,70,59,0.14)',
    options: [{ id: 'o8', label: 'Один разбор партии', price: 40, enabled: true }]
  },
  {
    id: 's3',
    slug: 'play-session',
    title: 'Игра со мной',
    shortDesc: 'Онлайн-сессия 1–3 часа.',
    description: 'Практическая игра онлайн с последующим обсуждением идей, типовых ошибок и плана роста.',
    badge: 'Онлайн',
    category: 'Практика',
    basePrice: 130,
    heroAccent: 'rgba(107,59,66,0.12)',
    options: [
      { id: 'o9', label: '1 час', price: 130, enabled: true },
      { id: 'o10', label: '2 часа', price: 260, enabled: true },
      { id: 'o11', label: '3 часа', price: 390, enabled: true }
    ]
  },
  {
    id: 's4',
    slug: 'tactics-training',
    title: 'Обучение тактическим приёмам',
    shortDesc: 'Полное обучение или отдельный элемент.',
    description: 'Онлайн-обучение тактике с выбором полной программы или отдельного элемента. Доступны занятия на 1–3 часа.',
    badge: 'Обучение',
    category: 'Обучение',
    basePrice: 1150,
    heroAccent: 'rgba(185,146,82,0.18)',
    options: [
      { id: 'o12', label: 'Полное обучение', price: 1150, enabled: true },
      { id: 'o13', label: 'Вилка', price: 100, enabled: true },
      { id: 'o14', label: 'Связка', price: 110, enabled: true },
      { id: 'o15', label: 'Завлечение', price: 110, enabled: true },
      { id: 'o16', label: 'Сквозное нападение', price: 120, enabled: true },
      { id: 'o17', label: 'Вскрытое нападение', price: 120, enabled: true },
      { id: 'o18', label: 'Двойной шах', price: 120, enabled: true },
      { id: 'o19', label: 'Уничтожение защиты', price: 130, enabled: true },
      { id: 'o20', label: 'Отвлечение', price: 110, enabled: true },
      { id: 'o21', label: 'Перекрытие', price: 110, enabled: true },
      { id: 'o22', label: 'Упрощение', price: 100, enabled: true },
      { id: 'o23', label: 'Ловушка для фигуры', price: 120, enabled: true },
      { id: 'o24', label: 'Мат по последней горизонтали', price: 130, enabled: true }
    ]
  },
  {
    id: 's5',
    slug: 'tournaments',
    title: 'Победа на турнирах',
    shortDesc: 'Russian Chess Tour и турниры по рейтингу.',
    description: 'Победа на турнирах и участие в рейтинговых турнирах. Для нестандартных турниров стоимость согласуется отдельно.',
    badge: 'Турниры',
    category: 'Турниры',
    basePrice: 400,
    heroAccent: 'rgba(49,70,59,0.16)',
    options: [
      { id: 'o25', label: 'Russian Chess Tour 1500+', price: 400, enabled: true },
      { id: 'o26', label: 'Russian Chess Tour 1800+', price: 800, enabled: true },
      { id: 'o27', label: 'Russian Chess Tour 2000+', price: 1100, enabled: true },
      { id: 'o28', label: 'Турниры 1000–2000 (цена по договорённости)', price: 1000, enabled: true }
    ]
  },
  {
    id: 's6',
    slug: 'leagues',
    title: 'Подниму вас в любую лигу',
    shortDesc: 'Цена за 1 лигу. Более одной — до 2–3 недель.',
    description: 'Услуга подъёма в лигу. Лига Легенда недоступна. Остальные лиги доступны для заказа.',
    badge: 'Лиги',
    category: 'Лиги',
    basePrice: 60,
    heroAccent: 'rgba(107,59,66,0.14)',
    options: [
      { id: 'o29', label: 'Бронза', price: 60, enabled: true },
      { id: 'o30', label: 'Серебро', price: 140, enabled: true },
      { id: 'o31', label: 'Кристалл', price: 300, enabled: true },
      { id: 'o32', label: 'Элита', price: 500, enabled: true },
      { id: 'o33', label: 'Чемпион', price: 800, enabled: true },
      { id: 'o34', label: 'Лига Легенда — недоступно', price: 0, enabled: false }
    ]
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    serviceId: 's2',
    serviceTitle: 'Разбор вашей партии',
    optionLabel: 'Один разбор партии',
    customerName: 'Игрок_128',
    amount: 40,
    note: '',
    status: 'REVIEW_LEFT',
    createdAt: '2026-03-30T10:00:00.000Z'
  },
  {
    id: 'ord-1002',
    serviceId: 's3',
    serviceTitle: 'Игра со мной',
    optionLabel: '2 часа',
    customerName: 'KnightRush',
    amount: 260,
    note: 'Хочу тренировочную сессию по блицу и разбор по ходу.',
    status: 'DONE_BY_ADMIN',
    createdAt: '2026-03-30T12:15:00.000Z'
  },
  {
    id: 'ord-1003',
    serviceId: 's1',
    serviceTitle: 'Поднятие рейтинга',
    optionLabel: '1350 — 1650',
    customerName: 'RookFlow',
    amount: 550,
    note: '',
    status: 'IN_PROGRESS',
    createdAt: '2026-03-30T13:25:00.000Z'
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    orderId: 'ord-1001',
    customerName: 'Игрок_128',
    rating: 5,
    text: 'Очень понятный и полезный разбор. Всё по делу и без воды.',
    adminReply: 'Спасибо за отзыв. Рад, что разбор помог.',
    createdAt: '2026-03-30T11:00:00.000Z',
    serviceTitle: 'Разбор вашей партии',
    optionLabel: 'Один разбор партии',
    amount: 40,
    purchasedAt: '2026-03-30T10:00:00.000Z'
  }
];

const INITIAL_PAYOUTS = [
  {
    id: 'pay-1',
    amount: 300,
    cardNumber: '**** **** **** 1234',
    createdAt: '2026-03-30T15:00:00.000Z'
  }
];

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function statusLabel(status) {
  const labels = {
    DEMO_PAID: 'Оплачено',
    PENDING_FULFILLMENT: 'Ожидает выполнения',
    IN_PROGRESS: 'Выполняется',
    DONE_BY_ADMIN: 'Выполнено администратором',
    CONFIRMED_BY_CLIENT: 'Подтверждено клиентом',
    REVIEW_LEFT: 'Отзыв оставлен'
  };
  return labels[status] || status;
}

function seedIfEmpty() {
  const servicesCount = db.prepare('SELECT COUNT(*) AS count FROM services').get().count;
  const ordersCount = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
  const reviewsCount = db.prepare('SELECT COUNT(*) AS count FROM reviews').get().count;
  const payoutsCount = db.prepare('SELECT COUNT(*) AS count FROM payouts').get().count;

  if (servicesCount === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (
        id, slug, title, shortDesc, description, badge, category, basePrice, heroAccent, optionsJson
      ) VALUES (
        @id, @slug, @title, @shortDesc, @description, @badge, @category, @basePrice, @heroAccent, @optionsJson
      )
    `);

    for (const service of SERVICES_SEED) {
      insertService.run({
        ...service,
        optionsJson: JSON.stringify(service.options)
      });
    }
  }

  if (ordersCount === 0) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, serviceId, serviceTitle, optionLabel, customerName, amount, note, status, createdAt
      ) VALUES (
        @id, @serviceId, @serviceTitle, @optionLabel, @customerName, @amount, @note, @status, @createdAt
      )
    `);

    for (const order of INITIAL_ORDERS) {
      insertOrder.run(order);
    }
  }

  if (reviewsCount === 0) {
    const insertReview = db.prepare(`
      INSERT INTO reviews (
        id, orderId, customerName, rating, text, adminReply, createdAt,
        serviceTitle, optionLabel, amount, purchasedAt
      ) VALUES (
        @id, @orderId, @customerName, @rating, @text, @adminReply, @createdAt,
        @serviceTitle, @optionLabel, @amount, @purchasedAt
      )
    `);

    for (const review of INITIAL_REVIEWS) {
      insertReview.run(review);
    }
  }

  if (payoutsCount === 0) {
    const insertPayout = db.prepare(`
      INSERT INTO payouts (
        id, amount, cardNumber, createdAt
      ) VALUES (
        @id, @amount, @cardNumber, @createdAt
      )
    `);

    for (const payout of INITIAL_PAYOUTS) {
      insertPayout.run(payout);
    }
  }
}

seedIfEmpty();

function getServices() {
  const rows = db.prepare(`
    SELECT id, slug, title, shortDesc, description, badge, category, basePrice, heroAccent, optionsJson
    FROM services
    ORDER BY title ASC
  `).all();

  return rows.map((row) => ({
    ...row,
    options: JSON.parse(row.optionsJson || '[]')
  }));
}

function getOrders() {
  return db.prepare(`
    SELECT id, serviceId, serviceTitle, optionLabel, customerName, amount, note, status, createdAt
    FROM orders
    ORDER BY datetime(createdAt) DESC
  `).all();
}

function getReviews() {
  return db.prepare(`
    SELECT id, orderId, customerName, rating, text, adminReply, createdAt,
           serviceTitle, optionLabel, amount, purchasedAt
    FROM reviews
    ORDER BY datetime(createdAt) DESC
  `).all();
}

function getPayouts() {
  return db.prepare(`
    SELECT id, amount, cardNumber, createdAt
    FROM payouts
    ORDER BY datetime(createdAt) DESC
  `).all();
}

function getBootstrap() {
  return {
    services: getServices(),
    reviews: getReviews(),
    adminAuthed: false
  };
}

function requireAdmin(req, res, next) {
  if (!req.session.adminAuthed) {
    return res.status(401).json({ error: 'Требуется вход администратора' });
  }
  next();
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/bootstrap', (req, res) => {
  res.json(getBootstrap());
});

app.get('/api/admin/bootstrap', requireAdmin, (req, res) => {
  res.json({
    services: getServices(),
    orders: getOrders(),
    reviews: getReviews(),
    payouts: getPayouts(),
    adminAuthed: true
  });
});

app.post('/api/admin/login', (req, res) => {
  const password = String(req.body.password || '');

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  req.session.adminAuthed = true;
  res.json({ ok: true, adminAuthed: true });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.post('/api/orders', (req, res) => {
  const { serviceId, optionId, customerName, note } = req.body || {};
  const services = getServices();
  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    return res.status(400).json({ error: 'Услуга не найдена' });
  }

  const option = service.options.find((item) => item.id === optionId && item.enabled !== false);

  if (!option) {
    return res.status(400).json({ error: 'Вариант услуги не найден' });
  }

  const order = {
    id: randomId('ord'),
    serviceId: service.id,
    serviceTitle: service.title,
    optionLabel: option.label,
    customerName: String(customerName || 'Гость').trim() || 'Гость',
    amount: Number(option.price) || 0,
    note: String(note || '').trim(),
    status: 'PENDING_FULFILLMENT',
    createdAt: new Date().toISOString()
  };

  db.prepare(`
    INSERT INTO orders (
      id, serviceId, serviceTitle, optionLabel, customerName, amount, note, status, createdAt
    ) VALUES (
      @id, @serviceId, @serviceTitle, @optionLabel, @customerName, @amount, @note, @status, @createdAt
    )
  `).run(order);

  res.json({ ok: true, order });
});

app.post('/api/reviews', (req, res) => {
  const { orderId, rating, text } = req.body || {};
  const order = db.prepare(`
    SELECT id, serviceId, serviceTitle, optionLabel, customerName, amount, note, status, createdAt
    FROM orders
    WHERE id = ?
  `).get(orderId);

  if (!order) {
    return res.status(400).json({ error: 'Заказ не найден' });
  }

  const cleanText = String(text || '').trim();

  if (!cleanText) {
    return res.status(400).json({ error: 'Текст отзыва пустой' });
  }

  const existing = db.prepare(`SELECT id FROM reviews WHERE orderId = ?`).get(orderId);
  if (existing) {
    return res.status(400).json({ error: 'Отзыв уже существует' });
  }

  const review = {
    id: randomId('rev'),
    orderId: order.id,
    customerName: order.customerName,
    rating: Number(rating) || 5,
    text: cleanText,
    adminReply: '',
    createdAt: new Date().toISOString(),
    serviceTitle: order.serviceTitle,
    optionLabel: order.optionLabel,
    amount: order.amount,
    purchasedAt: order.createdAt
  };

  db.prepare(`
    INSERT INTO reviews (
      id, orderId, customerName, rating, text, adminReply, createdAt,
      serviceTitle, optionLabel, amount, purchasedAt
    ) VALUES (
      @id, @orderId, @customerName, @rating, @text, @adminReply, @createdAt,
      @serviceTitle, @optionLabel, @amount, @purchasedAt
    )
  `).run(review);

  db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run('REVIEW_LEFT', orderId);

  res.json({ ok: true, review });
});

app.post('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(String(status || ''), id);

  res.json({ ok: true });
});

app.post('/api/admin/services/:id/base-price', requireAdmin, (req, res) => {
  const { id } = req.params;
  const value = Number(req.body.value) || 0;

  db.prepare(`UPDATE services SET basePrice = ? WHERE id = ?`).run(value, id);

  res.json({ ok: true });
});

app.post('/api/admin/services/:serviceId/options/:optionId', requireAdmin, (req, res) => {
  const { serviceId, optionId } = req.params;
  const { price, enabled } = req.body || {};

  const service = db.prepare(`SELECT * FROM services WHERE id = ?`).get(serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Услуга не найдена' });
  }

  const options = JSON.parse(service.optionsJson || '[]');
  const nextOptions = options.map((option) => {
    if (option.id !== optionId) return option;
    return {
      ...option,
      price: typeof price === 'number' ? price : option.price,
      enabled: typeof enabled === 'boolean' ? enabled : option.enabled
    };
  });

  db.prepare(`UPDATE services SET optionsJson = ? WHERE id = ?`).run(JSON.stringify(nextOptions), serviceId);

  res.json({ ok: true });
});

app.post('/api/admin/reviews/:id/reply', requireAdmin, (req, res) => {
  const { id } = req.params;
  const reply = String(req.body.reply || '');

  db.prepare(`UPDATE reviews SET adminReply = ? WHERE id = ?`).run(reply, id);

  res.json({ ok: true });
});

app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const review = db.prepare(`SELECT * FROM reviews WHERE id = ?`).get(id);

  if (review) {
    db.prepare(`DELETE FROM reviews WHERE id = ?`).run(id);
    db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run('CONFIRMED_BY_CLIENT', review.orderId);
  }

  res.json({ ok: true });
});

app.post('/api/admin/payouts', requireAdmin, (req, res) => {
  const amount = Number(req.body.amount) || 0;
  const cardNumber = String(req.body.cardNumber || '').trim();

  if (amount <= 0 || !cardNumber) {
    return res.status(400).json({ error: 'Некорректные данные выплаты' });
  }

  const payout = {
    id: randomId('pay'),
    amount,
    cardNumber,
    createdAt: new Date().toISOString()
  };

  db.prepare(`
    INSERT INTO payouts (id, amount, cardNumber, createdAt)
    VALUES (@id, @amount, @cardNumber, @createdAt)
  `).run(payout);

  res.json({ ok: true, payout });
});

app.post('/api/admin/reset', requireAdmin, (req, res) => {
  db.exec(`
    DELETE FROM services;
    DELETE FROM orders;
    DELETE FROM reviews;
    DELETE FROM payouts;
  `);

  seedIfEmpty();

  res.json({ ok: true });
});

app.use(express.static(rootDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ error: err.message || 'Внутренняя ошибка сервера' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on http://0.0.0.0:${PORT}`);
});
