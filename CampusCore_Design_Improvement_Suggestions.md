# CampusCore — Design Improvement Suggestions

_Goal: Simple, clear, low-noise UI. Reference: Usability patterns observed in eSkooly worth adopting._

---

## 1. Ban Stat Cards on Sub-pages — Reserve for Dashboards Only

Right now, pages like Departments, Attendance & Leaves, Staff Timetable, and Schools Management all open with a row of 4 color-coded stat cards before displaying the actual content. This creates high cognitive noise, breaks visual flow, and introduces unnecessary multi-colored clutter on pages meant for data management.

**Recommendation & Action:**

- **Strictly prohibit stat cards** on all sub-pages/CRUD pages (Departments, Staff Directory, Timetables, Schools, Admins, Settings, etc.).
- Stat cards must live **only** on the three true dashboards: Staff Dashboard, School Admin Dashboard, and Super Admin Dashboard.
- On management pages, drop directly from the page header into the search/toolbar and database table. Any essential count (e.g. total departments) must be folded directly into the page header text instead of taking up card space.

---

## 2. Standardize Navigation Header Style & Layout

Adopt a simple, clean page navigation header style based on eSkooly's clean content entry. This keeps all CRUD page headers predictable and lightweight.

**Recommendation & Action:**
Each management/CRUD page must follow this top-header layout hierarchy before the content section:

1. **Breadcrumbs (Top)**: A quiet, small breadcrumb list in `text-muted-foreground` (e.g. `Home / Management / Staff`).
2. **Title & Badge Meta (Middle Left)**: The page heading (e.g. `Staff Directory` in `text-2xl` or `text-3xl`) with a small, inline, muted text badge indicating quantity (e.g., `· 12 staff` or `· 4 departments`).
3. **Primary Action Group (Middle Right)**: Action buttons (e.g., `+ Register Staff`, `Export CSV`, `Manage Roles`) aligned horizontally in a unified row next to/opposite the page title.
4. **Divider**: A single thin border line (`border-border`) separating the navigation header from the working area.
5. **Filters & Table (Bottom)**: Dropping straight into the search/filter toolbar followed by the main data table.

---

## 3. Adopt eSkooly's Numbered-Section Layout for Long Forms

The "New Student" (Admission) and "New Staff" forms in eSkooly group input fields under distinct numbered circular badges (e.g. `❶ Student Information`, `❷ Parent Details`) with a `Required • Optional` legend pinned top-right of the card. This chunks data-heavy forms into digestible sections, reducing input fatigue.

**Recommendation & Action:**

- Apply the numbered circular badge styling (`❶`, `❷`, `❸`) to any single-page form longer than ~6 fields (such as Edit Staff, School Config, or future student admission flows).
- Standardize a `Required • Optional` legend at the top-right of these card headers.
- Keep CampusCore's clean uppercase tracked-letter labels (from the design system) instead of eSkooly's low-contrast labels.
- Standardize a uniform input/select height of 40–44px and consistent rounded corners.

---

## 4. Move Onboarding & Registration Forms from Dialogs to Dedicated Sub-pages

In eSkooly, registration forms (School, Admins, Employees, Students) are placed on dedicated sub-pages rather than within modal Dialogs. Placing long forms inside popup modals makes them feel cramped, restricts layouts, lacks clear deep-linking, and is prone to accidental closings.

**Recommendation & Action:**

- **Stop using Dialogs/Modals for complex registrations**: Register School (`CreateSchoolDialog`), Register School Admin (`CreateSchoolAdminDialog`), and Register Staff (`RegisterStaffDialog` or wizard) must be migrated to dedicated routing pages (e.g. `/super/schools/register` or `/admin/staff/register`).
- **Reserved Modal Usage**: Keep Dialogs strictly for quick, simple tasks that require minimal inputs (e.g. adding a single department name, editing a single description, confirming a toggle action, or resetting a password).
- **Navigation Flow Advantage**: Using dedicated sub-pages lets us cleanly route to the _Post-Registration Success/Credentials_ screen upon successful submission.

---

## 5. Implement a Post-Creation "Credentials & Job Letter" Screen

When a new staff member or school admin is created, the system must not immediately bounce the user back to the directory list. Instead, show a dedicated credentials confirmation card.

**Recommendation & Action:**

- After the staff creation wizard or admin onboarding form is successfully submitted, redirect to a dedicated confirmation view (e.g. `/admin/staff/success?staffId=XYZ`).
- Render a visually prominent **Portal Login Details** card that provides:
  - Portal Login URL
  - Auto-generated Username / Email
  - Temporary Password
- Include copy-to-clipboard icon buttons for both the username and password fields.
- Include action triggers: **Print Welcome Letter** (or Job Letter) and **Send Credentials via Email** (triggering CampusCore's automated SMTP mailer).

---

## 6. What to Deliberately _NOT_ Borrow from eSkooly

To keep CampusCore feeling premium and Swiss-minimalist, avoid the following eSkooly design patterns:

- **No Card-Grid Directories**: Do not use cards for index pages (Employees, Students, Classes). Keep CampusCore's dense, structured tabular lists.
- **No Saturated Decorative Colors**: Avoid using solid blue, teal, green, and purple card backgrounds or thick colored card borders.
- **No Header Badges or Promotions**: Do not place App Store links, mobile badges, or SMS advertisements in the top bar. Keep it strictly operational.
- **No Ungrouped Sidebars**: Retain CampusCore's clean, sectioned sidebar categories (Overview, Management, Account) rather than eSkooly's flat list of 15+ accordion options.
- **No Native Inputs**: Do not use browser-default date pickers or file buttons. Maintain custom shadcn/ui components.

---

## Suggested Priority Order

1. **Remove stat cards** from all sub-pages and CRUD pages.
2. **Apply the clean Navigation Header standard** (Breadcrumb + Title with metadata badge + Action row) to all sub-pages.
3. **Migrate registrations** from Dialog overlays to dedicated sub-page routes.
4. **Build the Post-Registration success screen** for staff and admin onboarding.
5. **Reformat long single-page forms** to use the numbered-section layouts with the requirement legend.
6. **Fix the Attendance card truncation bug** and standardize spacing/input sizing.
