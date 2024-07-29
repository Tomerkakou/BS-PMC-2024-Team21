import enum

class QuestionType(enum.Enum):
    SINGLE_CHOICE = "Single Choice"
    OPEN = "Open"
    CODING = "Coding"

class DificultyLevel(enum.Enum):
    Easy = "Easy"
    Medium = "Medium"
    Hard = "Hard"