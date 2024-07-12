from json import JSONEncoder
from datetime import datetime
import enum

class CJSONEncoder(JSONEncoder):
    def default(self, obj):
        print("testtttttttttttttttttt")
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        if isinstance(obj, enum.Enum):
            return obj.value
        return super().default(obj)