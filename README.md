Some goals for Arty AI:

🛠️ Arty AI – Setup Guide
Welcome to Arty AI, your AI-powered co-pilot for threat modeling and secure-by-design development. This guide walks you through how to integrate Arty with your existing Jira workflow and start seeing results in minutes.

✅ What You Need Before You Start
A Jira Cloud account (Jira Software or Jira Service Management)

Admin access to your Jira workspace

An Arty AI account (sign up at [your-url.com])

🔗 Step 1: Install the Arty AI Jira App
Go to your Jira workspace.

In the left sidebar, click on Apps > Explore More Apps.

Search for Arty AI.

Click Install and grant the requested permissions.

Once installed, go to Manage Apps > Arty AI.

🔐 Step 2: Authenticate Arty
Open the Arty AI app in Jira.

Click Connect to Arty AI.

You’ll be redirected to the Arty login screen — log in or create your account.

Approve the integration and return to Jira.

📁 Step 3: Configure Your Projects
In Jira, go to Project Settings > Arty AI Integration.

Choose which projects or issue types Arty should monitor (e.g. “User Story”, “Feature”).

Optionally: Add custom labels Arty will use to classify tickets (e.g. requires-security, compliance).

🧠 Step 4: Set Up Compliance Profiles
Arty comes preloaded with:

OWASP ASVS

PCI DSS

GDPR (beta)

To enable or disable profiles:

In the Arty dashboard, go to Settings > Compliance Profiles.

Toggle ON/OFF the frameworks you want Arty to use.

You can also whitelist or ignore specific controls per project.

⚡ Step 5: Let Arty Analyze Your Tickets
Once Arty is active:

When a new ticket is created (or updated), Arty scans the description and use case.

Within seconds, it adds a comment to the ticket containing:

Security concerns

Suggested mitigation steps

Referenced compliance controls (e.g. OWASP 5.3.1)

🛠 Optionally, Arty can auto-create security sub-tasks with your approval.

📊 Step 6: Review the Security Dashboard
Go to your Arty AI dashboard (via your Jira app or external portal):

See flagged tickets by status, severity, and team

Download reports for audit/compliance

Track improvement over time

👥 Roles & Permissions
Role	Permissions
Jira Admin	Install, configure projects and compliance profiles
Security Lead	Manage compliance settings, approve sub-tasks
Product Manager	View suggestions, add security tickets to roadmap
Developer	Resolve flagged risks, reference compliance comments
❓ Troubleshooting
Not seeing comments? Make sure Arty has access to the ticket type and your compliance profile is active.

Too many false positives? Adjust your risk threshold in Settings > Risk Sensitivity.
