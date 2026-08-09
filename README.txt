TaxClear — AI-Powered Tax Platform
Case Study Submission by Sahith Reddy Vellenki
Built for GreenGrowth Advisory


What I built

TaxClear is a prototype of an AI-powered tax platform for CPAs. I built it as a single-page web application using plain HTML, CSS, and JavaScript — no frameworks, no backend, no build steps. You open the index.html file in a browser and it runs.

The prototype demonstrates three of the ten challenges from the case study: the CPA workload dashboard (Challenge 7), source document traceability (Challenge 1), and trustworthy AI recommendations (Challenge 10). I also added a client portal view to show how the same return looks from the taxpayer's perspective, which touches on role-aware experiences (Challenge 5) and return status (Challenge 6).


How to open it

Unzip the folder. Open taxclear/index.html in Chrome or any modern browser. No server needed. Everything works from the file system directly.

Navigate using the sidebar on the left. To see the full traceability and AI features, click any return in the dashboard — the best demo is the Delgado, Maria return (R-002), which has all four AI findings active. To see the client view, click the "Client view" button in the top right corner of any screen.


Why I chose these three challenges

I picked the challenges where I felt my background was relevant. I have built RAG systems where every AI output needs to trace back to a source document — that is exactly what Challenge 1 asks for. I have also built risk monitoring dashboards where the question is always "what needs my attention right now" — that is Challenge 7. And Challenge 10 felt like the most important one to get right, because a CPA who does not trust the AI will override everything by habit, and one who trusts it blindly will miss errors. The design challenge is making that middle ground feel safe.


What is genuinely wired up

All the navigation and view switching is real. Clicking a return opens it. Clicking a field in the traceability view actually changes the document panel on the right. The source context — showing two or three rows above and below the highlighted field — is dynamically computed based on where the field appears in the document, not hardcoded. All the filter tabs on the dashboard actually filter the data. Search works in real time as you type. The manager toggle genuinely changes which returns are visible. The sort options re-order the list. Accepting a field or finding updates the state and shows the correct confirmation — accepted by Sahith R. Vellenki with the date. Overriding a finding saves the reason and shows it in the audit trail. The batch accept button only accepts unreviewed info-level findings, not ones already reviewed. The "sign and file" button checks whether all AI findings are resolved before allowing it. If not, it tells you how many are still pending.


What is simulated

All the data is fake and hardcoded. There are 15 returns, one fully detailed return (Delgado, Maria), and four AI findings. In a real product this would come from a database and a real AI extraction pipeline. The document viewer shows a styled representation of the W-2 and 1099 forms, not an actual scanned PDF. The confidence percentages and AI findings are written by me to illustrate realistic scenarios — the AI did not actually read any documents. Sending a message shows a toast notification but does not actually send anything. The sign and file flow shows a confirmation but does not submit to the IRS.


A few design decisions I want to explain

The most deliberate choice was using a monospaced font for every financial number. All dollar amounts, confidence percentages, line numbers, and dates use JetBrains Mono. This was intentional — it signals that the platform treats numbers with precision, and it makes values visually distinct from labels. CPAs work with numbers all day and a monospaced column of figures is much easier to scan than a proportional one.

The second choice was keeping the AI findings as a separate tab from the field-level traceability. I considered merging them into a single view but decided they serve different purposes. Traceability is about understanding where a value came from. AI insights are about whether anything in the return looks suspicious or incomplete. A CPA doing field-by-field review and a CPA doing a final check before filing are in different modes, and the UI should reflect that.

The third choice was the client portal design. I deliberately removed all financial detail from the client view — the client does not see confidence scores, line numbers, or AI flags. They see a refund estimate, a status timeline, a checklist of what they need to do, and a message thread. The goal was to make the client view feel like a simple app, while the CPA view feels like a professional tool.

One thing I would add with more time is real keyboard navigation — tab through fields, accept with Enter, escape to go back. I added the Escape key to go back to the dashboard, but full keyboard support would make the CPA workflow much faster.


File structure

taxclear/index.html is the entry point and just loads the other files.
taxclear/css/styles.css has all the visual styling.
taxclear/js/data.js has all the fake return data, documents, findings, and messages.
taxclear/js/render.js has all the functions that build the HTML for each view.
taxclear/js/app.js has the state, the event handling, and the startup logic.
