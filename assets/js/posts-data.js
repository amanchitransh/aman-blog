window.BLOG_POSTS_DATA = [
  {
    "filename": "2025-01-why-silence-hits-hard.md",
    "category": "personal",
    "title": "Why Silence Hits Harder Than Words",
    "excerpt": "Some days, it’s not what people say —\nit’s what they don’t.",
    "content": "# Why Silence Hits Harder Than Words\n\nSome days, it’s not what people say —\nit’s what they don’t.\n\nSilence has weight.\nAnd sometimes, it teaches you more\nthan conversations ever could.\n",
    "createdAt": 1767181972974
  },
  {
    "filename": "2025-01-stop-building-side-projects.md",
    "category": "technical",
    "title": "Stop Building Side Projects Like Tutorials",
    "excerpt": "Every developer hears the same advice: \"Build side projects.\"",
    "content": "# Stop Building Side Projects Like Tutorials\n\nEvery developer hears the same advice: \"Build side projects.\"\n\nSo we follow tutorials. Clone popular apps. Deploy to Vercel. Add another line to the resume.\n\nIt looks productive. It rarely makes you a better engineer.\n\n## The Real Problem\n\nMost side projects:\n- Solve already-solved problems\n- Avoid hard decisions\n- Ignore failures and scale\n- End at \"v1 is done\"\n\nReal engineering doesn't work like that.\n\n## Real Projects Have Constraints\n\nInstead of asking \"What app should I build?\"\n\nAsk: \"What problem should this system survive?\"\n\nAdd constraints:\n- What if traffic spikes?\n- What if a service goes down?\n- What if data becomes inconsistent?\n\nThe moment constraints appear, architecture matters.\n\n## Think in Systems, Not Screens\n\nStart with data flow, not UI.\n\nAsk:\n- Where can this break?\n- What must be async?\n- What needs retries?\n- What must be idempotent?\n\nEven a simple backend becomes interesting when failure is allowed.\n\n### Example: URL Shortener\n\nTutorial version:\n- Store URL in database\n- Generate short code\n- Redirect on GET\n\nSystems version:\n- What if two users get the same short code?\n- How do you handle 10k redirects/second?\n- How do you track analytics without blocking redirects?\n- What if your database is in a different region?\n\nSee the difference?\n\n## Trade-offs > Features\n\nGood engineers make trade-offs and explain them.\n\nWrite things like:\n```markdown\n## Why Redis for caching\n\nImproves latency by ~200ms.\nRisk: stale data if URL is updated.\nMitigation: 5 minute TTL.\n\n## Why async analytics\n\nSlower than sync writes.\nBut won't block redirects if analytics DB is down.\n```\n\nPut this in your README. It matters more than screenshots.\n\n## If You Can't Observe It, You Don't Own It\n\nAdd basics:\n```javascript\nlogger.info('URL created', { shortCode, userId });\nmetrics.increment('url.created');\nmetrics.timing('url.lookup', duration);\n```\n\nIf you can't answer \"what broke and why,\" the project isn't finished.\n\n## Let It Break. Then Fix It.\n\nReal systems are never done.\n\nBreak your own project:\n- Simulate database downtime\n- Send 1000 concurrent requests\n- Fill database with 1M records\n- Deploy on 512MB RAM\n- Make your API dependency timeout\n\nThen fix it. Refactor it. Scale it. Repeat.\n\nThat loop is where engineers are made.\n\n## The Resume Is a Side Effect\n\nStop building projects for your resume.\n\nBuild systems that survive failure.\n\nThe resume will take care of itself.\n",
    "createdAt": 1767182540666
  }
];
