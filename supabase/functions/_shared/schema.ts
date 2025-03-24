export const schema = {
    "type": "array",
    "minItems": 8,
    "maxItems": 8,
    "items": {
      "type": "object",
      "properties": {
        "question": { "type": "string", "description": "The quiz question" },
        "options": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Multiple-choice options"
        },
        "answer": { "type": "string", "description": "The correct answer" }
      },
      "required": ["question", "options", "answer"]
    }
};
