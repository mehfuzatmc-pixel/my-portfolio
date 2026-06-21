# Portfolio Backend

Express backend for the portfolio project with Microsoft SQL Server storage, contact submissions, and private admin signin.

## Setup

1. Copy `.env.example` to `.env`.
2. Update the SQL Server values in `.env`.
3. Create the database and tables:

```bash
npm run init-db
```

4. Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

## SQL Server Notes

This backend uses SQL Server authentication through the `mssql` package. Use a SQL login such as `sa` or another user with permission to create/use the `PortfolioDb` database.

If your local SQL Server is a named instance, set `DB_SERVER` and `DB_INSTANCE`, for example:

```bash
DB_SERVER=localhost
DB_INSTANCE=SQLEXPRESS
```

Leave `DB_PORT` empty when using `DB_INSTANCE`. Use `DB_PORT` only when connecting to a fixed TCP port.

## API

### Health

`GET /api/health`

### Signup

`POST /api/auth/signup`

Public signup is disabled by default for this portfolio. Set `ALLOW_PUBLIC_SIGNUP=true` only if you later add client accounts.

```json
{
  "name": "Mehfuz Ali",
  "email": "mehfuz@example.com",
  "password": "password123"
}
```

### Signin

`POST /api/auth/signin`

```json
{
  "email": "mehfuz@example.com",
  "password": "password123"
}
```

### Current User

`GET /api/auth/me`

Send the JWT from signin:

```text
Authorization: Bearer your_token_here
```

### Contact

`POST /api/contact`

```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "message": "I need a portfolio website."
}
```

### Consultation Checkout

`POST /api/payments/consultation-checkout`

Creates a Stripe Checkout session for the consultation fee.

Required `.env` values:

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CONSULTATION_CURRENCY=usd
CONSULTATION_AMOUNT=5000
SITE_URL=http://localhost:3000
```

`CONSULTATION_AMOUNT` is in the smallest currency unit. For USD, `5000` means `$50.00`.

### Contact List

`GET /api/contacts`

Requires an admin JWT:

```text
Authorization: Bearer your_admin_token_here
```

The response includes contact message fields only: id, name, email, message, IP address, and created date.

## Create An Admin

Create or reset an admin account:

```bash
npm run create-admin -- you@example.com Password123! "Your Name"
```

Then sign in from the frontend `/admin` page.
