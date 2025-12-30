# FastAPI 관련
from fastapi import APIRouter, Request, Depends, HTTPException, Cookie, FastAPI, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

# Pydantic
from pydantic import BaseModel

# SQLAlchemy
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

# 날짜/시간 관련
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

# 표준 라이브러리
import os
import json
import time
import uuid
import logging

# HTTP 요청
import requests
import httpx

# 환경 변수
from dotenv import load_dotenv

# 암호화 관련
import cipher
from cryptography.fernet import Fernet

# JWT
import jwt
from jwt import ExpiredSignatureError

from contextlib import asynccontextmanager
