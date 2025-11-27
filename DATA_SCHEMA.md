# DATA SCHEMA & INGESTION LOGIC

## 1. `Expertise.csv` (The "Smart" Matrix)
* **Structure:** A complex matrix. Columns = Skills, Rows = Projects.
* **Metadata (In-Band):** The file contains "Phase" and "Weight" rows (usually at the top or bottom).
* **Logic:** The Python script "hunts" for the `Project Start` header row to find the data, then scans the file to find the `Phase ->` and `%` rows to build the Skill Definitions.
* **Rule:** Do not "clean" this file by deleting rows. The script needs them.

## 2. `Main.csv` (The Identity)
* **Key:** `Name` (Used to generate the Slug).
* **Logic:** Defines Title, Date, Employer, Client.

## 3. `Stats.csv` (Hardware Metrics)
* **Key:** `Name`.
* **Columns:** `Plastic`, `Sheetmetal`, `PCB` (Integer counts).

## 4. `Colors.csv` (The Palette)
* **Logic:** Maps Entity Name (Employer or Skill) -> Hex/RGB string.
* **Usage:** Used to color-code the Career Timeline and Charts.

## 5. `Tenure.csv` (Career History)
* **Logic:** Defines the timeline on the `/about` page.
* **Calculations:** Duration is calculated in Python during ingestion.