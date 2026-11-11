# PhishGuard — SRM University Project Thesis Report

This folder contains the complete, ready-to-compile **B.Tech Project Report** for **PhishGuard**, tailored to the exact formatting and structural guidelines of **SRM Institute of Science and Technology, Tiruchirappalli**.

---

## 📁 Package Contents

| File | Description |
|---|---|
| **`format_thesis.tex`** | Complete, comprehensive LaTeX thesis document with all 7 chapters, mathematical formulas, TikZ flowcharts, tables, and algorithms. |
| **`srmuthesis.cls`** | Official SRM University LaTeX Class file matching title page, certificate, margins, and typography specifications. |
| **`thesis_refer.bib`** | BibTeX bibliography containing authoritative citations on phishing detection, CART Decision Trees, PhiUSIIL dataset, and MITRE ATT&CK. |
| **`SRM.eps`** | Official SRM Institute of Science and Technology university insignia for the title page. |
| **`ascelike.bst`** | Bibliography styling template. |
| **`atbeginend.sty`** | Environment hook package. |

---

## 📖 Chapter Structure Included

1. **Title Page**: Formatted with Project Title, Authors (Bala Vishnu & Diyanezwaran), Guide, HOD, and SRM University typography.
2. **Bonafide Certificate**: Officially structured certificate ready for supervisor and examiner signatures.
3. **Abstract**: Professional single-page synopsis covering the 51-feature Decision Tree model, 97.4% accuracy, sub-100ms latency, and AI Threat Intelligence Center.
4. **Acknowledgements**: Formal acknowledgements to guide, department faculty, and university leadership.
5. **List of Abbreviations & Symbols**: Comprehensive list of acronyms (AI, ML, URL, TLD, AiTM, MITRE ATT&CK) and mathematical notations.
6. **Chapter 1 — Introduction**: Background, motivation, problem statement, objectives, and report organization.
7. **Chapter 2 — Literature Survey**: Critical review of blacklisting, heuristic filters, machine learning approaches, and PhiUSIIL benchmark analysis.
8. **Chapter 3 — System Analysis**: Existing system vulnerabilities, proposed PhishGuard workflow, software/hardware specifications, and feasibility study.
9. **Chapter 4 — System Design**: System architecture diagrams (TikZ), 51-feature engineering taxonomy, Decision Tree Gini impurity mathematical formulation, and database design.
10. **Chapter 5 — Coding, Implementation and Testing**: FastAPI backend handlers, React 18 UI components, model serialization, and system verification test suites.
11. **Chapter 6 — Results and Discussion**: Evaluation metrics (Accuracy 97.4%, Precision 97.1%, Recall 97.8%, F1-Score 97.4%), model comparison bar charts, and latency trade-offs.
12. **Chapter 7 — Conclusion and Future Enhancement**: Project summary, browser extension roadmap, and computer vision layout inspection extensions.
13. **References**: BibTeX-rendered bibliography formatted as per university guidelines.

---

## 🚀 How to Compile

### Option 1: Overleaf (Recommended - No installation required)
1. Go to [Overleaf.com](https://www.overleaf.com) and create a **New Project** > **Upload Project**.
2. Zip this `thesis_report` folder and upload it, or upload the files individually.
3. Select `format_thesis.tex` as the main document.
4. Click **Recompile** to produce the final, publication-quality PDF.

### Option 2: Local Compilation with TeXstudio & MiKTeX
1. Ensure **MiKTeX** and **TeXstudio** are installed on your computer.
2. Open `format_thesis.tex` in TeXstudio.
3. Select compiler: **pdfLaTeX** or **XeLaTeX**.
4. Press **F5** (Build & View) to compile the PDF.

