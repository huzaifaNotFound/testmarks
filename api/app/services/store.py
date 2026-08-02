import threading
from typing import Any, Dict, List

_lock = threading.Lock()

ATTEMPTS: Dict[str, List[Dict[str, Any]]] = {}
TESTS: Dict[str, Dict[str, Any]] = {}


def register_test(test: Dict[str, Any]) -> None:
    with _lock:
        TESTS[test["test_id"]] = test


def get_test(test_id: str) -> Dict[str, Any]:
    with _lock:
        return TESTS.get(test_id)


def save_attempt(user_id: str, attempt: Dict[str, Any]) -> None:
    with _lock:
        ATTEMPTS.setdefault(user_id, []).append(attempt)


def get_attempts(user_id: str) -> List[Dict[str, Any]]:
    with _lock:
        return list(ATTEMPTS.get(user_id, []))
