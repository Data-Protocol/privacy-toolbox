# Checklist Data

## Introduction

As previously stated a good checklist is not complicated, it should fit on one page, with between 5-9 items, which aligns with the natural limit of working memory in humans. And the language should be familiar to the profession.

Each checklist is submitted as a structured json doc by adding a new json file to this directory and submitting a pull request. We do this so the document presentation of the checklist can be generated by the embedded SDK and kept as clean as possible.

Also the checklists can be embedded in other presentations and websites, and by anybody. All content in this repository is licensed under [Creative Commons](/LICENSE).

A good checklist is precise, efficient, and easy to use even in the most difficult situations. It should provide reminders of only the most important steps, rather than trying to spell out everything—after all, a checklist can't do your job for you. And above all, a checklist should be practical.

## JSON Structure of Checklist

```json
{
  "title": "the title of the checklist",
  "author": "the github user of the submitter",
  "description": "a brief overview of the checklist",
  "categories": ["a", "comma", "seperated", "list", "of", "associated", "categories"],
  "references": [{ "title": "supporting link title", "url": "https://google.com" }],
  "checklist-items": [
    {
      "slogan": "slogan of first checklist-item",
      "description": "summary of the checklist item",
      "references": [{ "title": "supporting link title", "url": "https://google.com" }]
    },
    {
      "slogan": "slogan of second checklist-item",
      "description": "summary of the checklist item",
      "references": [{ "title": "supporting link title", "url": "https://google.com" }]
    }
  ]
}
```