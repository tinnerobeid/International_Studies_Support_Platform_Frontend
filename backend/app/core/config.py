from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Kstudy API"
    DATABASE_URL: str = "sqlite:///./kstudy.db"
    FRONTEND_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    class Config:
        env_file = ".env"


settings = Settings()
