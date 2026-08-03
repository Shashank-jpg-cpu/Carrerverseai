import os

class Config:

    # Flask Configuration
    SECRET_KEY = "careerverse_ai_super_secret_key_2026"

    # MySQL Configuration
    MYSQL_HOST = "localhost"
    MYSQL_USER = "root"
    MYSQL_PASSWORD = ""
    MYSQL_DB = "careerverse_ai"
    MYSQL_PORT = 3306

    # Upload Configuration
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

    # Allowed Resume Extensions
    ALLOWED_EXTENSIONS = {
        "pdf",
        "doc",
        "docx"
    }

    # Maximum Upload Size (10 MB)
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024

    # JWT Configuration
    JWT_SECRET_KEY = "careerverse_jwt_secret_key"

    # Token Expiry (Minutes)
    ACCESS_TOKEN_EXPIRES = 60

    # Application Name
    APP_NAME = "CareerVerse AI"

    # Default Pagination
    PAGE_SIZE = 10

    # Resume AI Settings
    MIN_RESUME_SCORE = 0
    MAX_RESUME_SCORE = 100

    # Dashboard
    DEFAULT_PROFILE_IMAGE = "default.png"

    # Mail Configuration (Future)
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = ""
    MAIL_PASSWORD = ""

    # Notification Settings
    ENABLE_EMAIL_NOTIFICATION = True
    ENABLE_SYSTEM_NOTIFICATION = True

    # Chat
    CHAT_MESSAGE_LIMIT = 100

    # Coding Platform
    MAX_SUBMISSION_PER_DAY = 50

    # Interview
    MAX_INTERVIEW_PER_DAY = 5

    # Company Review
    MIN_REVIEW_RATING = 1
    MAX_REVIEW_RATING = 5

    # Logging
    LOG_FILE = "careerverse.log"

    # Version
    VERSION = "1.0.0"