from typing import Any, Dict, List

STREAMS: List[Dict[str, Any]] = [
    {
        "id": "neet",
        "name": "NEET",
        "description": "National Eligibility cum Entrance Test (UG) for medical admissions. NCERT-aligned Physics, Chemistry and Biology (Botany + Zoology).",
        "subjects": ["Physics", "Chemistry", "Botany", "Zoology"],
        "difficultyMix": {"easy": 50, "medium": 50, "hard": 0},
        "maxMarks": 720,
    },
    {
        "id": "jee-mains",
        "name": "JEE Mains",
        "description": "JEE Main (BE/B.Tech) entrance. NCERT-plus level Physics, Chemistry and Mathematics with application-heavy numericals.",
        "subjects": ["Physics", "Chemistry", "Mathematics"],
        "difficultyMix": {"easy": 20, "medium": 60, "hard": 20},
        "maxMarks": 300,
    },
    {
        "id": "jee-advanced",
        "name": "JEE Advanced",
        "description": "JEE Advanced for IIT admission. Multi-concept, interlinked Physics, Chemistry and Mathematics problems.",
        "subjects": ["Physics", "Chemistry", "Mathematics"],
        "difficultyMix": {"easy": 0, "medium": 40, "hard": 60},
        "maxMarks": 300,
    },
    {
        "id": "cbse-10",
        "name": "CBSE Class 10",
        "description": "NCERT Class 10 Mathematics and Science. Board-pattern questions across the full syllabus.",
        "subjects": ["Mathematics", "Science"],
        "difficultyMix": {"easy": 60, "medium": 40, "hard": 0},
        "maxMarks": 80,
    },
    {
        "id": "cbse-11",
        "name": "CBSE Class 11",
        "description": "NCERT Class 11 Physics, Chemistry, Mathematics and Biology. Chapter-wise questions from the full syllabus.",
        "subjects": ["Physics", "Chemistry", "Mathematics", "Biology"],
        "difficultyMix": {"easy": 40, "medium": 50, "hard": 10},
        "maxMarks": 70,
    },
    {
        "id": "cbse-12",
        "name": "CBSE Class 12",
        "description": "NCERT Class 12 Physics, Chemistry, Mathematics and Biology. Chapter-wise questions from the full syllabus.",
        "subjects": ["Physics", "Chemistry", "Mathematics", "Biology"],
        "difficultyMix": {"easy": 40, "medium": 50, "hard": 10},
        "maxMarks": 70,
    },
]

STREAMS_BY_ID: Dict[str, Dict[str, Any]] = {s["id"]: s for s in STREAMS}
