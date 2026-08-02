from typing import Any, Dict, List

from app.data.banks.cbse_10 import CBSE_10_BANK
from app.data.banks.cbse_11 import CBSE_11_BANK
from app.data.banks.cbse_12 import CBSE_12_BANK
from app.data.banks.jee_advanced import JEE_ADVANCED_BANK
from app.data.banks.jee_mains import JEE_MAINS_BANK
from app.data.banks.neet import NEET_BANK

BANKS: Dict[str, List[Dict[str, Any]]] = {
    "neet": NEET_BANK,
    "jee-mains": JEE_MAINS_BANK,
    "jee-advanced": JEE_ADVANCED_BANK,
    "cbse-10": CBSE_10_BANK,
    "cbse-11": CBSE_11_BANK,
    "cbse-12": CBSE_12_BANK,
}
