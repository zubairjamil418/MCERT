# Form Field Reference — `form3 http://localhost:3000/admin/forms3 

---

## Input Type Legend

| Type | Description |
|---|---|
| **Fixed** | Hardcoded, read-only — always the same value |
| **Dropdown Menu** | User selects from list; new values can be added and persist |
| **Manual / From DB** | User types on first entry; stored in DB and auto-filled on future views |
| **From Excel (Cell Ref)** | Pulled from a specific cell in the uploaded Excel sheet |
| **Manually Entered** | Purely free-text user input |
| **Calculated** | Derived from another field (e.g. date + 1 year) |
| **From Uncertainty Sheet** | Imported from a separate linked sheet (F104, F2) |

---

## Section 1 — Header / Cover Table

| Field | Example Value | Source / Type |
|---|---|---|
| **Report No (Title)** | 1459 25 Rev1 | **Manually Entered** |
| **Report prepared by** | Siris Flow Inspections Ltd | **Fixed** |
| **Inspector** | Aaron McGilligan MI 16 025 | **Dropdown Menu** |
| **Consent/Permit Holder** | Glen Water Ltd | **Dropdown Menu** |
| **Site Name** | Ballyrickard WwTW | **From Excel — Cell C4** |
| **Site Contact** | Mr Paul Gardiner | **Dropdown Menu** |
| **Site Address** | Ballyrickard WwTW, Newtownards Road / Comber Road, Strangford Lough, County Down | **Manual or From DB** |
| **Site Ref or Postcode** | BT23 5LS (Nearest Postcode) | **Manual or From DB** |
| **Irish Grid ref for Site Entrance** | J 48572 70621 | **Manual or From DB** |
| **Consent/Permit No** | 2025/2006 | **From Excel — Cell D5** |
| **Type of Flowmeter(s)** | Pulsar Ultra 5 | **From Excel — Cells H5 & H6** |
| **NIW Asset ID** | 0324638 | **Manual or From DB** |
| **Statement of Compliance** | "The flow monitoring arrangements meet the requirements of the Environment Agency's 'Minimum requirements for the self-monitoring of flow.'" | **Fixed** |
| **Uncertainty** | ±6.02 % | **From Uncertainty Sheet F104** |
| **Inspection Report No** | 1459 25 rev1 | **Manually Entered** |
| **Date of Inspection** | 22nd May 2025 | **Manually Entered** |

---

## Section 2 — Emission Point(s)

| Field | Example Value | Source / Type |
|---|---|---|
| **Site Name (emission point)** | Ballyrickard WwTW | **From Excel — Cell C4** |
| **WOC Number** | 2025/2006 | **From Excel — Cell C5** |
| **Dry weather flow** | 211 m³/day | **From Excel — Cell C10** |
| **Maximum daily volume** | 211 m³/day | **From Excel — Cell C9** |
| **Maximum FFT flow rate** | 2.44 l/s | **From Excel — Cell C6** |
| **Qmax of flowmeter** | 10.00 l/s | **From Excel — Cell D8** |

---

## Section 3 — Fixed / Permanent Text Blocks

These sections contain no user input. Text is always the same.

| Section | Fixed Text |
|---|---|
| **MCERTS product certification** | "Yes - The flow meter is MCert product approved." |
| **Secondary verification** | "Secondary verification successfully undertaken." |
| **Site maintenance arrangements** | Boilerplate maintenance text — no user input |

---

## Section 4.2 — Routine Verification

| Field | Example Value | Source / Type |
|---|---|---|
| **Next validation due date** | 12th September 2026 | **Calculated** — Date of Inspection + 1 year |

