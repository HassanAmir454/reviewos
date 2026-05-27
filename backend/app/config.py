from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://reviewos:reviewos_dev@localhost/reviewos"
    redis_url: str = "redis://localhost:6379"
    gemini_api_key: str = ""
    github_token: str = ""
    github_app_id: str = ""
    github_app_private_key: str = ""
    github_webhook_secret: str = ""
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
