# Cloud Resume Challenge

Starting out as an ERP Developer, one of the first questions I encountered in every solution design discussion was "what is the cost?" Even as a developer, I found myself putting together solution proposals complete with cost estimations — work that would typically fall under an architect's scope. That experience taught me something fundamental: enterprises are deeply cost-conscious. It became clear that good solution design and cost awareness are inseparable, so I made minimising cost the cornerstone of how I approach every design decision.

---

## Locked Stack

| Layer | Tool | Est. Cost |
|---|---|---|
| Frontend hosting + CDN + HTTPS | Azure Static Web Apps (Free) | ~$0/mo |
| Visitor counter API | Azure Functions (Consumption) | Free |
| **Database** | **Azure Table Storage** | **~$0.00/mo** |
| Source control | GitHub | Free |
| CI/CD | GitHub Actions | Free (2000 min/mo) |
| IaC | Terraform | Free |
| **Total** | | **< $0.50/mo** |

---

## File structure
```
cloud-resume/
│
├── frontend/                         # Resume HTML/CSS/JS
│   ├── index.html
│   ├── style.css
│   └── counter.js                    # visitor counter (Phase 3)
│
├── backend/                          # Azure Function code (Phase 4)
│   ├── visitorCounter/
│   │   ├── index.js
│   │   └── function.json
│   ├── host.json
│   └── package.json
│
├── infra/                            # Terraform only
│   ├── main.tf                       # all resources
│   ├── variables.tf
│   ├── outputs.tf
│   ├── terraform.tfvars              # ← gitignored
│   └── backend.tf                    # remote state config (Phase 6)
│
├── .github/
│   └── workflows/
│       ├── frontend.yml              # deploy frontend (Phase 6)
│       ├── backend.yml               # deploy function (Phase 6)
│       └── infra.yml                 # terraform plan/apply (Phase 6)
│
├── .gitignore
└── README.md
```
---

Cost Analysis — Full CRC Stack

| Resource | Option | Est. Monthly Cost |
|---|---|---|
| Blob Storage (static site) | Standard LRS, ~10MB resume | ~$0.01 |
| Azure CDN | Microsoft CDN, low traffic | ~$0.01–0.05 |
| Azure Functions | Consumption plan, <1M calls/mo | Free (always free tier) |
| Cosmos DB | ⚠️ Serverless min ~$0.25/mo, but RU charges add up | $1–5/mo |
| Terraform state storage | Separate blob container | ~$0.01 |

Cost-Optimised Recommendation
Swap Cosmos DB for Azure Table Storage instead:

| Resource | Option | Est. Monthly Cost |
|---|---|---|
| Blob Storage (static site) | Standard LRS, ~10MB resume | ~$0.01 |
| Azure CDN | Microsoft CDN, low traffic | ~$0.01–0.05 |
| Azure Functions | Consumption plan, <1M calls/mo | Free (always free tier) |
| **Azure Table Storage** | Same Storage Account, no extra charge | ~$0.00–0.01 |
| Terraform state storage | Separate blob container | ~$0.01 |

And here's the Cosmos DB vs Table Storage comparison for your documentation:

| | Cosmos DB | Table Storage |
|---|---|---|
| **Type** | NoSQL (document) | NoSQL (key-value) |
| **Cost** | ~$1–5/mo minimum | ~$0.00–0.01/mo |
| **Free tier** | Serverless, but RU costs | No separate charge — uses same Storage Account |
| **SDK support** | `@azure/cosmos` | `@azure/data-tables` |
| **Good enough for counter?** | ⚠️ Overkill | ✅ Perfect |

Good call flagging that early. Here's the honest cost picture for each resource so you can make informed choices:

---

## Cost Analysis — Full CRC Stack

| Resource | Option | Est. Monthly Cost |
|---|---|---|
| Blob Storage (static site) | Standard LRS, ~10MB resume | **~$0.01** |
| Azure CDN | Microsoft CDN, low traffic | **~$0.01–0.05** |
| Azure Functions | Consumption plan, <1M calls/mo | **Free** (always free tier) |
| Cosmos DB | ⚠️ Serverless min ~$0.25/mo, but **RU charges add up** | **$1–5/mo** |
| Terraform state storage | Separate blob container | **~$0.01** |

**Cosmos DB is the only real cost concern.** For a visitor counter that gets hit maybe 100x/day, it's fine — but it's overkill architecturally for what is literally one number.


