# Part 1/10: Introduction

Code: [github](https://github.com/jeromeabel/nuxt-clean-architecture/tree/feat/version-banner)

## Introduction

When developing frontend features, it’s easy to create components that mix UI, business logic, data retrieval, and state management. While this might work initially, it quickly becomes untestable and difficult to maintain.

If you're new to testing, join me on this journey—I believe it will help you navigate similar situations. If you're experienced with testing, I welcome your feedback to improve this series.

## What’s the Best Way to Learn Testing?

A common belief is that the best way to learn is through practice and sharing.

Sharing, however, can take many forms. One approach I’d like to explore with you is sharing the step-by-step development flow. I believe one of the best ways to discuss development is by breaking it down into incremental steps, highlighting key questions, challenges, and decisions along the way. The goal is to follow a natural thought process, allowing ideas to emerge organically while balancing structured planning before each step in an iterative and minimalistic manner—planning and emergence.

I will progress from the outside in, starting with the UI, as that was the natural order in which I tackled this feature. It makes sense to begin with the user interface—the part users see first.

## Guidelines

As I reflect on my decision-making process, I realize I follow certain principles. Here are some that will guide me:

- **YAGNI (You Aren’t Gonna Need It)** – Build just enough without over-planning.
- **Domain Primitive** pattern, sometimes also called **Primitive Obsession** (when referring to the anti-pattern it solves).
- **Separation of Concern (SoC)**.
- **Single Responsibility Principle (SRP)** – Separate concerns to maintain clarity.
- **Test input and output, not implementation details**.
- **Avoid mocks when possible**.
- **Minimize tight coupling** – using Dependency Injection (DIP).
- **Avoid magic values**.
- **Iterate in small steps**.

Some decisions might seem like over-engineering. Balancing pragmatism and perfectionism is tricky. A useful criterion is asking, *What value does this decision bring?* The value I seek is confidence—I want to build confidence in my code.

## Feature Overview: Specifications v1

We will implement a version banner in a Nuxt application:

- The application’s version is defined in `package.json`.
- The component displays the current version.
- The banner remains hidden if the version is already stored in local storage.
- The user can dismiss the banner.

Specifications will evolve throughout development, just as they do in real projects. This is a solid starting point. Though simple, I believe this feature provides valuable learning opportunities.

## The Flow of Steps

Let's map out the decision-making journey:
