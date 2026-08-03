from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Database
db = SQLAlchemy()

# Password Hashing
bcrypt = Bcrypt()

# JWT Authentication
jwt = JWTManager()

# Database Migration
migrate = Migrate()


def init_extensions(app):
    """
    Initialize all Flask extensions.
    """

    db.init_app(app)

    bcrypt.init_app(app)

    jwt.init_app(app)

    migrate.init_app(app, db)