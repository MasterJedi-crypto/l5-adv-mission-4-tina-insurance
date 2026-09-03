# Tina Insurance Assistant — Mission 4

**Mission Ready Level 5 Advanced Full Stack Developer**  
**Student:** Siobhan McKinney  
**Project:** Turners Car Insurance  
**Mission:** Mission 4 — Generative AI Insurance Recommendation Application

---

## Overview

Tina Insurance Assistant is a conversational insurance recommendation application created for Turners Car Insurance.

The application uses Generative AI to guide a user through a short insurance consultation. Tina first asks the user for permission to continue, then generates questions dynamically based on the user's previous answers.

Once enough information has been gathered, Tina recommends one or more suitable insurance products and explains the reasons for the recommendation.

This project was developed individually for Mission Ready Mission 4 and reuses selected architecture and components from the Mission 3 AI Interview Coach application.

---

## Project Objectives

The application was built to demonstrate:

- A conversational AI insurance consultation
- Consent and opt-out handling
- Adaptive Generative AI questions
- Conversation history and contextual responses
- Insurance eligibility business rules
- Dynamic insurance recommendations
- Frontend and backend integration
- Automated testing
- Docker containerisation
- Professional Git and Jira workflow

---

## Insurance Products

Tina can recommend only the following three Turners insurance products:

### Mechanical Breakdown Insurance (MBI)

Provides insurance guidance relating to mechanical and electrical breakdown protection.

### Comprehensive Car Insurance

Provides broader vehicle protection where the vehicle meets the required eligibility conditions.

### Third Party Car Insurance

Provides guidance for users primarily requiring protection for damage they may cause to another person's vehicle or property.

Tina does not invent prices, discounts, excess amounts, policy benefits, exclusions or guarantees.

---

## Mandatory Business Rules

The application enforces two important Mission 4 eligibility rules.

### Mechanical Breakdown Insurance

Mechanical Breakdown Insurance must **not** be recommended for:

- Trucks
- Racing cars

### Comprehensive Car Insurance

Comprehensive Car Insurance must **not** be recommended for a vehicle that is:

- 10 years old or older

These restrictions override other recommendation criteria.

---

## Consent-First Conversation

Tina begins every new consultation with an opt-in question:

> I'm Tina. I help you choose the right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?

If the user agrees, Tina continues with the consultation.

If the user refuses or withdraws consent:

- Tina stops asking questions
- No additional personal information is collected
- No insurance recommendation is displayed
- The consultation is marked as ended

Example:

```text
User:
No thanks

Tina:
No problem. I will not collect any further information.