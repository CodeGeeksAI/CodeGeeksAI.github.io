---
title: "Grill me: questions to ask before writing code with AI"
description: "How to use a guided discussion to clarify requirements, constraints, and decisions before handing implementation over to a coding agent."
pubDate: 2026-10-16
lang: en
translationKey: grill-me-before-coding
urlSlug: grill-me-before-coding
tags: [ai, coding, agentic-engineering]
author: Fedele Mantuano
draft: true
---

When we give a coding task to an AI assistant, we often describe the outcome we want while leaving implicit the choices we take for granted. The assistant then has to fill those gaps with assumptions, which can lead to an implementation that differs from what we had in mind.

A request such as “add a function to import a CSV” may seem clear, but it leaves many questions unanswered: which columns to accept, how to handle invalid rows or duplicates, and where to save the data. There is a gap between the request and the decisions needed to implement it. When an agent lacks the necessary instructions, we effectively force it to make assumptions.

Working with an AI agent calls for a change in perspective. We are no longer writing all the code ourselves: we have a “team” to guide, and we need to explain the decisions we want it to make. This takes time and attention, because we have to consider the choices involved and how they affect the result. In this article, we will explore how to structure a guided discussion with an AI assistant, known as **grill me**, to clarify requirements, constraints, and decisions before handing implementation over to a coding agent.

## What “grill me” means

In this context, the expression means “challenge me with probing questions.” The assistant’s first task becomes examining the idea, finding ambiguities, and helping me choose between concrete alternatives.

In [Matt Pocock’s skills repository](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), `grill-me` invokes the `grilling` skill. The [grilling procedure](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) organizes the discussion into rounds and accounts for dependencies between decisions: some questions only become meaningful once earlier ones have been resolved. It also recommends an answer to each question, which the user can accept or discuss. For coding work, [`grill-with-docs`](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md) combines the discussion with defining the project’s vocabulary and documenting decisions.

The key idea is that the agent can inspect the code and documentation, while the user understands the product and the intended design choices. The discussion brings unresolved decisions to the surface so we can examine and clarify them before writing code.

## Why a short request leaves decisions open

Consider this request:

> Add a CSV import for contacts.

An implementation might work perfectly with a sample file and behave unexpectedly with real data. Before writing it, there are at least four decisions to make:

| Decision | Question to clarify | Effect on the code |
| --- | --- | --- |
| Format | Which columns are required? | Header and field validation |
| Duplicates | How do we recognize an existing contact? | Matching and update rules |
| Errors | Does one invalid row block the entire file? | Partial saves or a full rollback |
| Result | How do we report what was imported? | User-facing summary and diagnostics |

The initial prompt can be brief. The crucial step is making its implications explicit before turning it into code.

## An example discussion before implementation

Suppose we choose the email address as the contact’s identifier. A follow-up question then becomes useful:

> If the CSV contains an email address that already exists, should we update the contact, skip the row, or report an error?

If we choose to update the contact, another decision opens up:

> Should an empty field in the CSV clear the existing value or leave it unchanged?

The second question depends on the first. If we had decided to skip duplicates, it would not be needed for that path.

This is an illustrative example, not a transcript of an actual session or a measured result. It shows how a seemingly simple request can hide decisions about product behavior.

## A prompt to start with

Here is an example set of instructions to start the discussion, which you can adapt to your project:

```text
I want to add a CSV import for contacts.

Before writing code, help me clarify the design through a “grill me” discussion.

Inspect the available code and documentation to establish the facts
you can verify yourself. Ask me to decide on the desired behavior
and any constraints you cannot infer from the repository.

Organize the questions into short rounds. For each question, explain
the decision needed, its consequences, and your recommended answer,
with a reason. Wait for my answers before asking dependent questions.

Challenge my assumptions when you find contradictions or uncovered cases.
Distinguish verified facts from assumptions that are still open.

At the end, summarize requirements, exclusions, decisions, and acceptance
criteria. Wait for me to confirm the summary before implementing anything.
```

The repository instructions are especially useful with an agent that can read files. If CSV validation already exists, it should inspect it. Questions to the user can then focus on unresolved decisions.

## Installing the skills

Let’s get practical. To follow this workflow, we first need to install the plugin that bundles Matt Pocock’s skills. A **skill** contains instructions for performing a task; the **plugin** distributes the collection of skills to the coding agent.

With Claude Code, run this in your terminal:

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

With Codex, first register the marketplace—the catalog from which to install the plugin—then add the plugin:

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

These are the commands listed in the [project README](https://github.com/mattpocock/skills#installation-30-second-setup). Choose the procedure for the agent you use. After installation, check that the skills are available in the session you will work in.

In the following examples, I use the project’s `/skill-name` notation. In Codex, you can explicitly invoke a skill by typing `$skill-name` or selecting it from the skills menu, as described in the [official documentation](https://developers.openai.com/codex/skills). For example, the equivalent of `/grill-with-docs` is `$grill-with-docs`.

## Setting up the repository once

Open the agent in your project directory. To configure the skills, use `/setup-matt-pocock-skills` and pass the configuration proposal shown below directly with it.

The [setup skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md) inspects the repository, agrees on where to manage issues, and configures conventions for documents and, where applicable, ticket classification. It proposes changes before writing them. The instructions are linked from the project’s existing `CLAUDE.md` or `AGENTS.md`, with details under `docs/agents/`.

A **ticket**, or issue, is a single unit of work: it describes the desired outcome, how to verify it, and which other tasks it depends on. I suggest choosing **Local Markdown** to keep these documents in the repository too. This is a practical preference for this workflow: we can read and edit everything with the same tools we use for code, and the agent can find the requirements without going through an external service.

The [local convention proposed by the skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md) uses `.scratch/`. The name suggests a place for temporary notes, although the directory is not automatically deleted. I prefer keeping specifications and tickets under **`docs/features/`**, because they describe the project and its evolution, and I want to maintain them alongside the code.

I therefore suggest starting setup by sending **the command and these instructions in the same message**. You can copy this proposal directly:

```text
/setup-matt-pocock-skills Use the Local Markdown tracker with a custom convention:
save specifications and tickets under docs/features/<feature-slug>/
instead of .scratch/<feature-slug>/.

For each feature, use spec.md for the specification and issues/ for tickets,
with one numbered file per ticket. Keep status, dependencies,
and acceptance criteria in the individual tickets.

Record these paths in docs/agents/issue-tracker.md and reference
the convention from the repository instructions file already in use.
When a skill proposes .scratch/, apply this convention instead.
```

This gives the agent our preference from the start of setup. Before approving the proposed changes, check that `docs/agents/issue-tracker.md` lists the paths under `docs/features/`.

For the CSV import, the suggested structure becomes:

```text
docs/
├── agents/
│   └── issue-tracker.md
├── adr/
│   └── 0001-contact-import-boundary.md
└── features/
    └── import-contacts-csv/
        ├── spec.md
        └── issues/
            ├── 01-basic-import.md
            └── 02-duplicate-handling.md
```

Setup defines the conventions; the specification, tickets, and any ADRs come in the following steps. `docs/agents/issue-tracker.md` tells the agent where to find and update the work; `docs/features/` collects specifications and tickets by feature; `docs/adr/` stores architectural decisions. The glossary stays in the project’s `GLOSSARY.md`.

This customizes the default paths: some skill instructions explicitly mention `.scratch/`, so it is worth repeating the convention in later requests and checking the paths of generated files. There is no need to modify the installed plugin. Track these documents in Git and keep completed tickets too, updating their status: they remain useful for tracing what was requested, decided, and built.

The benefit grows as we record and update decisions. The agent can reconstruct the project more easily in later sessions: the documents provide a reference that must stay aligned with the code.

## Starting the discussion and recording decisions

After setup, we can start with:

```text
/grill-with-docs I want to add a CSV import for contacts.
```

This skill combines `grilling` and `domain-modeling`: while we discuss the desired behavior, the agent also clarifies the meaning of the terms we use. Before moving on, ask it to summarize the decisions and confirm that you have reached a shared understanding.

### The glossary: the role of the old CONTEXT.md

Earlier examples in the project refer to `CONTEXT.md`; today, the reference document is called **`GLOSSARY.md`**. The [README notes the name change](https://github.com/mattpocock/skills#2-the-agent-is-way-too-verbose).

The glossary defines the domain language. In our example, it might explain what we mean by *contact*, *duplicate*, and *import*. It helps us use the same concepts in conversations, documents, and code names. It does not contain the chat transcript or technical plan. The [domain modeling skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) creates or updates it when a term is clarified.

### ADRs: what we decided and why

An **ADR**, or *Architecture Decision Record*, records an architectural decision and the reasons behind it. It is normally stored in a numbered file under `docs/adr/`, such as `0001-contact-import-boundary.md`.

Its value is explaining a choice to someone reading the code months later. A hypothetical example: “We store specifications and tickets as Markdown files in the repository rather than using GitHub Issues. This keeps code, requirements, and decisions together for anyone who downloads the project, and lets the agent consult them without accessing external services. We accept giving up the assignment and notification features offered by GitHub Issues.” Where alternatives existed, we can record why we rejected them and which consequences we accept.

The [format used by the skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md) can be brief: context, decision, and rationale. ADRs are proposed selectively, for choices that are costly to reverse, hard to understand without context, and the result of a genuine trade-off.

A session may therefore update an existing glossary and produce one or more ADRs when needed. It does not guarantee the creation of exactly two files at the end of every discussion.

## Turning the discussion into a specification

Once the decisions are confirmed, I suggest one more step before implementation:

```text
/to-spec

Follow docs/agents/issue-tracker.md: save the specification to
docs/features/import-contacts-csv/spec.md.
```

The [`to-spec` skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md) synthesizes the conversation and its understanding of the code into a specification: the problem, solution, user needs, implementation decisions, planned checks, and exclusions. It also clarifies where to test the behavior and asks for confirmation of those testing boundaries.

With the local convention agreed during setup, the specification is written to `docs/features/import-contacts-csv/spec.md`. We now have a reference to read and correct before assigning the work.

For the CSV import, a verifiable rule might be: “If a row contains an invalid email address, no new contacts are saved, and the result identifies the invalid row.” A statement like this gives us a way to assess the implementation.

## Breaking the work into tickets

A specification may involve more work than it makes sense to assign to a single session. In that case, use:

```text
/to-tickets docs/features/import-contacts-csv/spec.md

Follow docs/agents/issue-tracker.md: save one file per ticket under
docs/features/import-contacts-csv/issues/.
```

The [`to-tickets` skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md) proposes small tasks, each delivering complete, verifiable behavior, with acceptance criteria and explicit dependencies. It asks us to approve the breakdown before saving it. With the local tracker, it creates one Markdown file per ticket.

For example, one illustrative breakdown is:

| Ticket | Verifiable outcome | Depends on |
| --- | --- | --- |
| 01 — Basic import | A valid CSV creates contacts and returns a count | None |
| 02 — Duplicates | Existing contacts are skipped and duplicates within the file are reported | 01 |
| 03 — Errors and rollback | An invalid file leaves no partially saved contacts | 01 |

Each ticket includes checks for its own behavior. The agent must inspect the code to assess whether 02 and 03 are truly independent: they may touch the same areas and require a different order. For a very small change, one ticket may be enough.

## Choosing the model and preparing the handoff

For the design phase, I suggest a frontier model with strong reasoning capabilities: it needs to spot ambiguities, discuss alternatives, and check that decisions are consistent. To implement narrowly scoped tickets, we can consider a smaller, less expensive model and verify its results. Documentation reduces the number of implicit choices; the difficulty of the ticket remains the basis for choosing the model.

I suggest keeping the **grill-me chat as the parent chat** during implementation too. The main agent retains the overall picture of the decisions, coordinates the work, and collects the results. Implementation of individual tickets is delegated to dedicated subagents, each with its own separate context. Give each subagent its ticket and references to the relevant specification, glossary, and ADRs, so it can focus on its task while the parent chat maintains the overall view.

## Implementing with dedicated subagents

A **subagent** is an agent to which the main agent delegates a bounded task and which returns its result. Its context is separate from the parent chat’s context; this does not necessarily mean it starts without information from the conversation, because what it inherits depends on the environment and how it is started. For this workflow, we ask for it to receive the instructions and documents needed for the ticket, avoiding the full grill-me discussion. The [official Codex documentation](https://developers.openai.com/codex/subagents) explains how delegation can keep exploration and intermediate output out of the main conversation. Check which models and capabilities are available in your environment.

To delegate a single ticket, explicitly ask the parent chat to start a subagent. You can use this message, replacing the placeholder with an available model:

```text
Start a dedicated subagent to implement the ticket
docs/features/import-contacts-csv/issues/01-basic-import.md
using the model <model-name>.

Give it the ticket and references to the specification
docs/features/import-contacts-csv/spec.md, the glossary, and relevant ADRs.
Ask it to follow the implement skill for that ticket, including
the required tests and code review. Do not transfer the full grill-me conversation.

Keep this chat as the coordinator: wait for the subagent’s result,
check that it meets the acceptance criteria, and report the changes,
checks performed, and any open issues.
If the environment does not support delegation, the requested model,
or starting without inheriting the full history, report that before proceeding.
```

The request to “start a subagent” makes delegation explicit. Writing only `/implement docs/features/import-contacts-csv/issues/01-basic-import.md` asks the current agent to use the skill: that command alone does not assign implementation to another agent.

The [`implement` skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md) calls for test-driven development where possible, checks during the work, the full test suite, and a final code review. It also calls for a commit on the current branch: if you want to handle commits yourself, say so in your request.

To coordinate the entire specification, there is [`implement-spec`](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md). It reads the dependencies between tickets, uses subagents with separate branches and worktrees, and brings their work together on an integration branch. A **worktree** is a separate Git working directory: it lets agents edit files without sharing the same working copy.

In the same grill-me chat, you can give an instruction like this, replacing the placeholder with an available model:

```text
/implement-spec docs/features/import-contacts-csv/spec.md

Read the specification, the tickets in docs/features/import-contacts-csv/issues/,
the glossary, and relevant ADRs.

Keep this chat as the coordinator and delegate each ticket to a dedicated
subagent using the model <model-name>. Give each subagent its ticket
and the necessary documents, avoiding the full grill-me conversation
when the environment allows it.

If delegation or the requested model is unavailable, report that
before proceeding.

Run tickets in parallel only when their dependencies have been resolved.
Integrate the results, run checks across the combined changes,
and complete the code review required by the skill, fixing any issues found.

At the end, report completed tickets, tests run, and any remaining issues.
```

The skill coordinates tickets that are ready to start, launching others as dependencies are resolved. Parallelism helps when work can be separated; integration still needs to resolve conflicts and verify the overall behavior.

It is better to invoke these skills explicitly: `implement` and `implement-spec` are declared as user-invoked skills. Simply writing “implement the tickets” does not guarantee that the documented procedure will be activated.

## Code review and testing the actual result

The [`code-review` skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md) separates two checks: compliance with repository standards and correspondence between the code and the specification. Both need a clear reference for the changes to review, such as the commit before implementation, along with the approved specification.

**Review is already part of the implementation workflow:** `implement` invokes `code-review` when the work is done, before committing; `implement-spec` invokes it on the integration branch once all tickets are complete and calls for fixing the issues found. There is no need to run it again if it has already reviewed the entire result.

You can still invoke it explicitly, for example for a later review. In the parent chat, write:

```text
/code-review

Review the changes between <commit-before-implementation> and HEAD.
Use docs/features/import-contacts-csv/spec.md and its associated tickets
as the reference for the required behavior.

Report repository standards violations separately from differences
against the specification, identifying the affected code
and the relevant requirement or rule.
```

Replace `<commit-before-implementation>` with the Git identifier recorded before starting the work. The comparison must include every commit for the feature: using only the commit immediately before `HEAD` could leave part of the implementation out. This example covers changes already committed; if there are uncommitted changes too, explicitly ask for them to be included in the review.

Before considering the work complete, we need to read the results, have any issues fixed, and try the feature. Automated tests should already be part of implementation; our own checks on the product complement that work.

For the CSV import, try a valid file, an existing contact, repeated email addresses, and an invalid row. Check both the returned message and the data actually saved, including whether a failed attempt leaves any partial changes. Closing the tickets should correspond to a result we can observe and accept.

## When to use it and its limitations

This approach is useful when a change involves product rules, data handling, integrations, or decisions that are difficult to reverse.

For a typo or a change already defined in detail, a direct request may be enough.

The assistant can still recommend a poor choice, miss a requirement, or present an assumption with too much confidence. The discussion helps make decisions visible; code quality still needs to be verified through tests, review, and checks appropriate to the project.

Before asking AI to implement a feature, it is worth understanding which decisions we are handing over. A grill-me session can turn a vague idea into a set of choices we can explain and verify.
