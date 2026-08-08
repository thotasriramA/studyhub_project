# StudyHub Backend (Django + DRF + MySQL)

A social platform for students to join subject-wise communities and post
notes, doubts, and resources.

## 1. Prerequisites

- Python 3.10+
- MySQL Server installed and running
- `pip`

## 2. MySQL setup

Open MySQL shell (or MySQL Workbench) and create the database:

```sql
CREATE DATABASE studyhub_db CHARACTER SET utf8mb4;
```

That's it — Django will create all the tables for you.

## 3. Backend setup

```bash
cd backend

# create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt
```

> **mysqlclient install issues (common on Windows/Mac):**
> - Windows: download the matching wheel from
>   https://github.com/PyMySQL/mysqlclient/releases or use
>   `pip install mysqlclient` after installing "Microsoft C++ Build Tools".
> - Mac: `brew install mysql pkg-config` before `pip install mysqlclient`.
> - Linux: `sudo apt install python3-dev default-libmysqlclient-dev build-essential`

## 4. Configure database credentials

Open `studyhub/settings.py` and update the `DATABASES` section with your
MySQL username/password (default user is usually `root`), **or** set
environment variables (recommended):

```bash
export DB_NAME=studyhub_db
export DB_USER=root
export DB_PASSWORD=your_mysql_password
export DB_HOST=localhost
export DB_PORT=3306
```

(See `.env.example` for reference. If you'd like actual `.env` file loading,
install `python-decouple` or `django-environ` — the settings file already
reads from `os.environ`.)

## 5. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## 6. Create an admin user (optional, for Django Admin panel)

```bash
python manage.py createsuperuser
```

## 7. Run the server

```bash
python manage.py runserver
```

API will be live at `http://localhost:8000/`
Admin panel at `http://localhost:8000/admin/`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Login, get JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PUT | `/api/auth/me/` | View/edit my profile |
| GET | `/api/auth/users/<id>/` | View another user's profile |

### Communities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/communities/` | List all communities |
| POST | `/api/communities/` | Create a community |
| GET | `/api/communities/<slug>/` | Community details |
| POST | `/api/communities/<slug>/join/` | Join a community |
| POST | `/api/communities/<slug>/leave/` | Leave a community |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts/` | Feed (supports `?community=<slug>`, `?search=`, `?type=`) |
| POST | `/api/posts/` | Create a post |
| GET/PUT/DELETE | `/api/posts/<id>/` | Post details/edit/delete |
| POST | `/api/posts/<id>/like/` | Like/unlike |
| POST | `/api/posts/<id>/bookmark/` | Bookmark/un-bookmark |
| GET | `/api/posts/bookmarks/` | My saved posts |
| GET/POST | `/api/posts/<post_id>/comments/` | List/add comments |
| DELETE | `/api/posts/comments/<id>/` | Delete a comment |

All endpoints except register/login require the header:
`Authorization: Bearer <access_token>`

## Tested

All endpoints above were tested end-to-end (register → login → create
community → create post → like → comment → bookmark → search) and work
correctly. Only the DB engine needs to point at your MySQL instance.
