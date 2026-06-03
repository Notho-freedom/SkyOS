"""Vocalis TTS backend — entry point."""
import asyncio
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from routes import voices, tts, tts_stream, translate, detect, dialogue, captions, ssml
from services import cache as cache_mod
from services import metrics as metrics_mod
from services.edge_tts_engine import list_voices

# uvloop for faster asyncio (skipped on win32)
try:
    import uvloop  # type: ignore
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
except Exception:
    pass

VERSION = "2.1.0"
START_TIME = time.time()

logging.basicConfig(
    level=logging.INFO,
    format='{"ts":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
)

limiter = Limiter(key_func=get_remote_address, default_limits=["180/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm voices list
    try:
        await list_voices()
        logging.info("voices warm-cached")
    except Exception as e:
        logging.warning(f"voice warmup failed: {e}")
    yield


app = FastAPI(
    title="Vocalis TTS",
    version=VERSION,
    description="Free, fast, neural TTS API powered by edge-tts.",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(GZipMiddleware, minimum_size=1024)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "X-Used-Voice",
        "X-Detected-Language",
        "X-Latency-Ms",
        "X-Cache",
        "X-Segments",
    ],
)


@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    t0 = time.perf_counter()
    response = await call_next(request)
    ms = (time.perf_counter() - t0) * 1000
    response.headers["X-Latency-Ms"] = f"{ms:.1f}"
    # only record TTS-ish endpoints to keep metrics relevant
    path = request.url.path
    if path.startswith("/api/tts") or path.startswith("/api/translate"):
        metrics_mod.record(ms)
    return response


app.include_router(voices.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(tts_stream.router, prefix="/api")
app.include_router(dialogue.router, prefix="/api")
app.include_router(ssml.router, prefix="/api")
app.include_router(captions.router, prefix="/api")
app.include_router(translate.router, prefix="/api")
app.include_router(detect.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "version": VERSION,
        "uptime_seconds": int(time.time() - START_TIME),
        "cache": cache_mod.stats(),
        "latency": metrics_mod.snapshot(),
    }


@app.get("/")
async def root():
    return {"name": "Vocalis TTS", "version": VERSION, "docs": "/docs"}
