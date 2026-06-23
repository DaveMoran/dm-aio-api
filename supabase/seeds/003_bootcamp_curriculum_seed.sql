insert into bootcamp_curriculum (week_number, title, focus, total_hours, dates, start_date, end_date, deliverable, curriculum)
values (
  12,
  'MCP Foundations Restart — Capstone Spec v1',
  'Restart MCP from production-first principles. Pick capstone domain. Draft v1 spec.',
  40,
  'Jun 1–7, 2026',
  '2026-06-01',
  '2026-06-07',
  'Capstone spec v1 (in repo), working "hello world" MCP server, repo scaffold',
  '{
    "acceptanceCriteria": [
      {"id": "w12_ac_0", "text": "Capstone domain chosen and 1-page domain brief written", "type": "write"},
      {"id": "w12_ac_1", "text": "Capstone repo initialized with full production scaffolding (CI, typing, tests, lint)", "type": "code"},
      {"id": "w12_ac_2", "text": "Capstone spec v1 written and committed (capstone_spec.md)", "type": "code"},
      {"id": "w12_ac_3", "text": "4 tools shipped with tests", "type": "code"},
      {"id": "w12_ac_4", "text": "1 resource shipped with tests", "type": "code"},
      {"id": "w12_ac_5", "text": "1 prompt shipped with tests", "type": "code"},
      {"id": "w12_ac_6", "text": "Server supports both stdio and Streamable HTTP transports", "type": "code"},
      {"id": "w12_ac_7", "text": "All work green in CI", "type": "code"},
      {"id": "w12_ac_8", "text": "Blog post #24 published", "type": "write"},
      {"id": "w12_ac_9", "text": "Weekly homework completed", "type": "read"}
    ],
    "days": [
      {
        "dow": 0,
        "name": "Monday",
        "shortName": "Mon",
        "fullDate": "2026-06-01",
        "hours": 6,
        "learningFocus": "Set the tone. This is not a sandbox project, it'\''s a production codebase from commit #1.",
        "blocks": [
          {
            "name": "Morning Block",
            "timeRange": "6:00am–9:00am",
            "tasks": [
              {"id": "w12_d0_b0_t0", "text": "Read the MCP spec (Nov 2025 release) end-to-end. Take Obsidian notes by section.", "timeRange": "6:00–7:00am", "type": "read"},
              {"id": "w12_d0_b0_t1", "text": "Read the May 2026 research findings (Q2_v2_research_basis.md). Write a 1-page '\''what changed'\'' memo in Obsidian.", "timeRange": "7:30–9:00am", "type": "write"}
            ]
          },
          {
            "name": "Evening Block",
            "timeRange": "7:00pm–10:00pm",
            "tasks": [
              {"id": "w12_d0_b1_t0", "text": "Capstone domain decision — write a 1-page domain brief (audience, problem, why MCP fits)", "timeRange": "7:00–8:00pm", "type": "write"},
              {"id": "w12_d0_b1_t1", "text": "Initialize the capstone repo: pyproject.toml with strict typing + ruff + pytest, GitHub Actions for lint/type check/test, README, LICENSE, CONTRIBUTING.md", "timeRange": "8:30–10:00pm", "type": "code"}
            ]
          }
        ],
        "homework": {
          "questions": [
            {"id": "w12_d0_hw_0", "text": "What is the difference between MCP being '\''table stakes'\'' and MCP being '\''a differentiator'\''? Explain what changed between when you started Q2 v1 (March–April 2026) and today (May 2026) that drove this shift.", "type": "write"},
            {"id": "w12_d0_hw_1", "text": "What does '\''production posture from commit #1'\'' actually mean for an MCP server? List 5 concrete decisions a production-posture build makes differently from a learning-posture build.", "type": "write"},
            {"id": "w12_d0_hw_2", "text": "Why was the original Q2 plan'\''s '\''early MCP expertise'\'' framing wrong even though MCP itself is more important than ever? Distinguish between the importance of the technology and the differentiation of the skill.", "type": "write"}
          ]
        },
        "exercises": [
          {
            "number": 1,
            "title": "Capstone Domain Brief",
            "timeEstimate": "60 min",
            "difficulty": "⭐⭐ Medium",
            "acceptanceCriteria": [
              {"id": "w12_ex1_ac_0", "text": "All candidate domains scored across all 5 criteria", "type": "write"},
              {"id": "w12_ex1_ac_1", "text": "One domain chosen (gut pick allowed if explained)", "type": "write"},
              {"id": "w12_ex1_ac_2", "text": "Three paragraphs: user/problem, why MCP fits, what good looks like", "type": "write"},
              {"id": "w12_ex1_ac_3", "text": "File committed to exercises/week12/ex1_domain_brief.md", "type": "code"}
            ]
          }
        ]
      },
      {
        "dow": 1,
        "name": "Tuesday",
        "shortName": "Tue",
        "fullDate": "2026-06-02",
        "hours": 6,
        "blocks": [
          {
            "name": "Morning Block",
            "timeRange": "6:00am–9:00am",
            "tasks": [
              {"id": "w12_d1_b0_t0", "text": "FastMCP 2.x docs — tools section, deep read with notes", "timeRange": "6:00–7:30am", "type": "read"},
              {"id": "w12_d1_b0_t1", "text": "Read 3 high-quality public MCP servers from modelcontextprotocol/servers repo — read for patterns, not features", "timeRange": "8:00–9:00am", "type": "read"}
            ]
          },
          {
            "name": "Evening Block",
            "timeRange": "7:00pm–10:00pm",
            "tasks": [
              {"id": "w12_d1_b1_t0", "text": "Implement 2 capstone tools end-to-end: typed inputs/outputs, Pydantic models, model-friendly errors, unit tests for each", "timeRange": "7:00–9:00pm", "type": "code"},
              {"id": "w12_d1_b1_t1", "text": "MCP Inspector — verify both tools work", "timeRange": "9:00–9:30pm", "type": "code"},
              {"id": "w12_d1_b1_t2", "text": "Daily homework questions", "timeRange": "9:30–10:00pm", "type": "write"}
            ]
          }
        ],
        "homework": {
          "questions": [
            {"id": "w12_d1_hw_0", "text": "What is the difference between an error message written for a developer and an error message written for a model? Give one example of each from your own code or imagined code.", "type": "write"},
            {"id": "w12_d1_hw_1", "text": "Pydantic catches some bad inputs. JSON schema catches others. Your code must catch what'\''s left. What'\''s the boundary? Pick one of your tools and identify which validation layer each type of bad input is caught by.", "type": "write"},
            {"id": "w12_d1_hw_2", "text": "Why is '\''type-safe'\'' not sufficient for a production tool? A function can be type-safe and still wrong. What does type safety NOT guarantee?", "type": "write"}
          ]
        },
        "exercises": [
          {
            "number": 2,
            "title": "Production Posture Checklist",
            "timeEstimate": "45 min",
            "difficulty": "⭐ Easy",
            "acceptanceCriteria": [
              {"id": "w12_ex2_ac_0", "text": "12–15 checklist items, at least 5 specific to your project", "type": "write"},
              {"id": "w12_ex2_ac_1", "text": "Audit complete with status (✅ / ⚠️ / ❌) for each item", "type": "write"},
              {"id": "w12_ex2_ac_2", "text": "Easy fixes applied to the repo", "type": "code"},
              {"id": "w12_ex2_ac_3", "text": "Remaining gaps noted with target weeks", "type": "write"},
              {"id": "w12_ex2_ac_4", "text": "File committed to exercises/week12/ex2_production_posture.md", "type": "code"}
            ]
          }
        ]
      },
      {
        "dow": 2,
        "name": "Wednesday",
        "shortName": "Wed",
        "fullDate": "2026-06-03",
        "hours": 6,
        "learningFocus": "Most MCP servers only ship tools. Resources and prompts are where the protocol gets interesting.",
        "blocks": [
          {
            "name": "Morning Block",
            "timeRange": "6:00am–9:00am",
            "tasks": [
              {"id": "w12_d2_b0_t0", "text": "FastMCP docs — resources section, deep read with notes", "timeRange": "6:00–7:30am", "type": "read"},
              {"id": "w12_d2_b0_t1", "text": "FastMCP docs — prompts section + sampling intro", "timeRange": "8:00–9:00am", "type": "read"}
            ]
          },
          {
            "name": "Evening Block",
            "timeRange": "7:00pm–10:00pm",
            "tasks": [
              {"id": "w12_d2_b1_t0", "text": "Implement 1 resource (something the model needs to read, not do) and 1 prompt (composes with at least one tool)", "timeRange": "7:00–9:00pm", "type": "code"},
              {"id": "w12_d2_b1_t1", "text": "MCP Inspector — verify resource and prompt", "timeRange": "9:00–9:30pm", "type": "code"},
              {"id": "w12_d2_b1_t2", "text": "Daily homework questions", "timeRange": "9:30–10:00pm", "type": "write"}
            ]
          }
        ],
        "homework": {
          "questions": [
            {"id": "w12_d2_hw_0", "text": "When is something a Resource vs a Tool? The distinction is not always clear. Write your own working definition with one concrete example each.", "type": "write"},
            {"id": "w12_d2_hw_1", "text": "What does a Prompt compose? Your first prompt likely references at least one tool or resource. Explain how prompts, tools, and resources relate — and what is lost if you build only with tools.", "type": "write"},
            {"id": "w12_d2_hw_2", "text": "The MCP spec defines four primitives: tools, resources, prompts, sampling. Most MCP servers ship only tools. What is the cost of that simplification?", "type": "write"}
          ]
        },
        "exercises": [
          {
            "number": 3,
            "title": "First Tool — Production-Grade",
            "timeEstimate": "90 min",
            "difficulty": "⭐⭐ Medium",
            "acceptanceCriteria": [
              {"id": "w12_ex3_ac_0", "text": "Tool implemented in src/ with Pydantic input and output (or typed return)", "type": "code"},
              {"id": "w12_ex3_ac_1", "text": "Async function with docstring written for the model, not the developer", "type": "code"},
              {"id": "w12_ex3_ac_2", "text": "At least 4 unit tests: happy path, 2 error cases, 1 edge case", "type": "code"},
              {"id": "w12_ex3_ac_3", "text": "All tests pass", "type": "code"},
              {"id": "w12_ex3_ac_4", "text": "Lint and type check clean", "type": "code"},
              {"id": "w12_ex3_ac_5", "text": "Decision log written: naming, input model, errors, edge case, anti-feature", "type": "write"},
              {"id": "w12_ex3_ac_6", "text": "All files committed to exercises/week12/ex3_first_tool_decisions.md", "type": "code"}
            ]
          }
        ]
      },
      {
        "dow": 3,
        "name": "Thursday",
        "shortName": "Thu",
        "fullDate": "2026-06-04",
        "hours": 3,
        "eveningNote": "Run Club evening",
        "blocks": [
          {
            "name": "Morning Block",
            "timeRange": "6:00am–9:00am",
            "tasks": [
              {"id": "w12_d3_b0_t0", "text": "Read the MCP 2026 roadmap (official blog post, March 9 2026). Note the four working group priorities — these are your '\''what'\''s still rare'\'' list.", "timeRange": "6:00–7:00am", "type": "read"},
              {"id": "w12_d3_b0_t1", "text": "Capstone spec v1 — write the actual spec document using the capstone_spec.md template. Treat this as a real spec.", "timeRange": "7:30–8:30am", "type": "write"},
              {"id": "w12_d3_b0_t2", "text": "Commit and push. Spec is now versioned.", "timeRange": "8:30–9:00am", "type": "code"}
            ]
          }
        ],
        "homework": {
          "optional": true,
          "note": "Light reflection only — not required",
          "questions": [
            {"id": "w12_d3_hw_0", "text": "One thing you learned this week that surprised you", "type": "write"},
            {"id": "w12_d3_hw_1", "text": "One thing you are still confused about (carry to Friday)", "type": "write"}
          ]
        },
        "exercises": [
          {
            "number": 4,
            "title": "Spec v1 Draft",
            "timeEstimate": "45 min",
            "difficulty": "⭐⭐⭐ Hard",
            "acceptanceCriteria": [
              {"id": "w12_ex4_ac_0", "text": "All 8 sections present (Purpose, User & Problem, Scope, Tools, Resources, Prompts, Non-functional, Open questions)", "type": "write"},
              {"id": "w12_ex4_ac_1", "text": "Section 3 (Scope) has at least 3 explicit out-of-scope items", "type": "write"},
              {"id": "w12_ex4_ac_2", "text": "Section 4 covers all planned tools, even ones not yet built", "type": "write"},
              {"id": "w12_ex4_ac_3", "text": "Section 8 lists at least 3 honest open questions", "type": "write"},
              {"id": "w12_ex4_ac_4", "text": "Committed as capstone_spec.md in the repo root", "type": "code"}
            ]
          }
        ]
      },
      {
        "dow": 4,
        "name": "Friday",
        "shortName": "Fri",
        "fullDate": "2026-06-05",
        "hours": 6,
        "blocks": [
          {
            "name": "Morning Block",
            "timeRange": "6:00am–9:00am",
            "tasks": [
              {"id": "w12_d4_b0_t0", "text": "FastMCP docs — Streamable HTTP transport, deep read", "timeRange": "6:00–7:30am", "type": "read"},
              {"id": "w12_d4_b0_t1", "text": "Read the official transport spec section. In production, stdio is a developer fallback. HTTP is the real transport.", "timeRange": "8:00–9:00am", "type": "read"}
            ]
          },
          {
            "name": "Evening Block",
            "timeRange": "7:00pm–10:00pm",
            "tasks": [
              {"id": "w12_d4_b1_t0", "text": "Wire the capstone server to support both stdio and Streamable HTTP. Tests for both transports.", "timeRange": "7:00–9:00pm", "type": "code"},
              {"id": "w12_d4_b1_t1", "text": "Write Friday blog post draft: '\''Restarting MCP: A Production-First Approach'\''", "timeRange": "9:00–10:00pm", "type": "write"}
            ]
          }
        ],
        "homework": {
          "questions": [
            {"id": "w12_d4_hw_0", "text": "Why is stdio fine for development but inadequate for production? Identify at least 3 concrete reasons.", "type": "write"},
            {"id": "w12_d4_hw_1", "text": "What happens to MCP sessions when a load balancer sits between client and server? Per the May 2026 MCP roadmap, this is a top production friction point. Explain why.", "type": "write"},
            {"id": "w12_d4_hw_2", "text": "Your capstone supports both stdio and HTTP. When would a real user use each? Sketch the two deployment scenarios.", "type": "write"}
          ]
        }
      },
      {
        "dow": 5,
        "name": "Saturday",
        "shortName": "Sat",
        "fullDate": "2026-06-06",
        "hours": 8,
        "blocks": [
          {
            "name": "Morning Block",
            "timeRange": "9:00am–12:00pm",
            "tasks": [
              {"id": "w12_d5_b0_t0", "text": "Finish all 4 tools planned for v0.1 (original 2 + 2 more)", "timeRange": "9:00–11:00am", "type": "code"},
              {"id": "w12_d5_b0_t1", "text": "Integration test — run the full server against MCP Inspector, exercise all primitives", "timeRange": "11:00am–12:00pm", "type": "code"}
            ]
          },
          {
            "name": "Afternoon Block",
            "timeRange": "1:00pm–5:00pm",
            "tasks": [
              {"id": "w12_d5_b1_t0", "text": "Polish the README — this is the artifact someone judging the repo sees first", "timeRange": "1:00–3:00pm", "type": "write"},
              {"id": "w12_d5_b1_t1", "text": "Publish blog post #24", "timeRange": "3:00–4:00pm", "type": "write"},
              {"id": "w12_d5_b1_t2", "text": "Weekly reflection + Sunday planning", "timeRange": "4:00–5:00pm", "type": "write"}
            ]
          }
        ],
        "homework": {
          "note": "Saturday reflection prompt",
          "questions": [
            {"id": "w12_d5_hw_0", "text": "What'\''s the biggest gap between v0.1 and '\''production-ready'\''? Be specific. This becomes the Week 13 work plan.", "type": "write"}
          ]
        }
      },
      {
        "dow": 6,
        "name": "Sunday",
        "shortName": "Sun",
        "fullDate": "2026-06-07",
        "hours": 3,
        "blocks": [
          {
            "name": "Morning Block",
            "timeRange": "10:00am–1:00pm",
            "tasks": [
              {"id": "w12_d6_b0_t0", "text": "Review the week. Did the spec hold up? Update it.", "timeRange": "10:00–11:00am", "type": "write"},
              {"id": "w12_d6_b0_t1", "text": "Plan Week 13 sprint in JIRA", "timeRange": "11:00am–12:00pm", "type": "write"},
              {"id": "w12_d6_b0_t2", "text": "Light reading — FastMCP advanced patterns docs (preview Week 13)", "timeRange": "12:00–1:00pm", "type": "read"}
            ]
          }
        ]
      }
    ]
  }'::jsonb
) on conflict (week_number) do update set
  title = excluded.title,
  focus = excluded.focus,
  total_hours = excluded.total_hours,
  dates = excluded.dates,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  deliverable = excluded.deliverable,
  curriculum = excluded.curriculum,
  updated_at = now();
