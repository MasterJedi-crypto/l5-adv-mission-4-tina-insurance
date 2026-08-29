# Prompt Evaluation 
test whether the AI interviewer actually does what the brief requires.


**Files under test:** `lib/prompts.js`
**Harness:** `scripts/run-interview.ps1` — runs a full six-question interview against the API with fixed answers, so the only variable between runs is the one we're testing.

---

## What is testing

The brief requires three things to take on trust:

1. Questions 2–6 are **generated**, not hardcoded
2. Questions are **relevant to the job title** the user typed
3. Questions **adjust based on the candidate's answers**

Plus the closing turn must be feedback, not another question.

---

## Method

Two experiments, each isolating one variable.

**Experiment A — role relevance.** Same answers, five different job titles. If the questions still differ meaningfully, the job title is genuinely driving the interview.

```
.\script\run-interview.ps1 -JobTitle "Insurance Claims Assessor"
.\script\run-interview.ps1 -JobTitle "Barista"
.\script\run-interview.ps1 -JobTitle "Registered Nurse"
.\script\run-interview.ps1 -JobTitle "Data Analyst"
.\script\run-interview.ps1 -JobTitle "Truck Driver"
```

**Experiment B — adaptivity.** Same job title, thin answers vs detailed answers. If the interviewer probes the gaps in the thin run, it's reading the answers rather than working from a script.

```
.\script\run-interview.ps1 -JobTitle "Barista" -AnswerSet vague
.\script\run-interview.ps1 -JobTitle "Barista" -AnswerSet rich
```

---

## Experiment A — role relevance

Same answers every time. Only the job title changed.

| Job title | Q2 | Q4 | Q6 |
|---|---|---|---|
| Insurance Claims Assessor | | | |
| Barista | | | |
| Registered Nurse | | | |
| Data Analyst | | | |
| Truck Driver | | | |



---

## Experiment B — adaptivity

Same job title (Barista), different answer quality.

| | Q2 |
|---|---|
| Vague answers | |
| Rich answers | |



---

## Failure modes checked

Tallied across every run above.

| Failure mode | Seen? | Where |
|---|---|---|
| Two questions in one turn | | |
| Same topic asked twice | | |
| Question ignores the job title | | |
| Evaluation/coaching before question 6 | | |
| Markdown or "Interviewer:" label leaking through | | |
| Interview didn't stop at six | | |
| Closing turn was a question, not feedback | | |

---

## Changes made

| # | Problem observed | Change to `lib/prompts.js` | Result after re-run |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

