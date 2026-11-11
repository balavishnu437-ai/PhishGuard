\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{srmuthesis}[2026/05/01 SRM University Thesis Class]

\DeclareOption{BTech}{\def\srmudegree{BACHELOR OF TECHNOLOGY}}
\DeclareOption{MTech}{\def\srmudegree{MASTER OF TECHNOLOGY}}
\DeclareOption{MS}{\def\srmudegree{MASTER OF SCIENCE}}
\DeclareOption{PhD}{\def\srmudegree{DOCTOR OF PHILOSOPHY}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{report}}

\ExecuteOptions{BTech}
\ProcessOptions\relax

\LoadClass[12pt,a4paper]{report}

\RequirePackage{geometry}
\geometry{a4paper,left=1.25in,right=1.0in,top=1.0in,bottom=1.0in}
\RequirePackage{setspace}
\RequirePackage{graphicx}
\RequirePackage{titlesec}

% Author and guide metadata
\def\firstauthor#1{\def\@firstauthor{#1}}
\def\firstauthorregno#1{\def\@firstauthorregno{#1}}
\def\secondauthor#1{\def\@secondauthor{#1}}
\def\secondauthorregno#1{\def\@secondauthorregno{#1}}
\def\thirdauthor#1{\def\@thirdauthor{#1}}
\def\thirdauthorregno#1{\def\@thirdauthorregno{#1}}
\def\fourthauthor#1{\def\@fourthauthor{#1}}
\def\fourthauthorregno#1{\def\@fourthauthorregno{#1}}
\def\fifthauthor#1{\def\@fifthauthor{#1}}
\def\fifthauthorregno#1{\def\@fifthauthorregno{#1}}

\def\guide#1{\def\@guide{#1}}
\def\designation#1{\def\@designation{#1}}
\def\guidedepartment#1{\def\@guidedepartment{#1}}
\def\hod#1{\def\@hod{#1}}
\def\department#1{\def\@department{#1}}

\firstauthor{}
\firstauthorregno{}
\secondauthor{}
\secondauthorregno{}
\thirdauthor{}
\thirdauthorregno{}
\fourthauthor{}
\fourthauthorregno{}
\fifthauthor{}
\fifthauthorregno{}

% Title Page
\renewcommand{\maketitle}{
  \begin{titlepage}
    \begin{center}
      \vspace*{0.2in}
      {\large\bfseries \MakeUppercase{\@title}\par}
      \vspace{0.4in}
      {\large\bfseries A PROJECT REPORT\par}
      \vspace{0.3in}
      {\normalsize\itshape Submitted by\par}
      \vspace{0.2in}
      {\normalsize\bfseries
        \ifx\@firstauthor\@empty\else \@firstauthor\ \@firstauthorregno\par \fi
        \ifx\@secondauthor\@empty\else \vspace{0.08in}\@secondauthor\ \@secondauthorregno\par \fi
        \ifx\@thirdauthor\@empty\else \vspace{0.08in}\@thirdauthor\ \@thirdauthorregno\par \fi
        \ifx\@fourthauthor\@empty\else \vspace{0.08in}\@fourthauthor\ \@fourthauthorregno\par \fi
        \ifx\@fifthauthor\@empty\else \vspace{0.08in}\@fifthauthor\ \@fifthauthorregno\par \fi
      }
      \vspace{0.3in}
      {\normalsize\itshape Under the guidance of\par}
      \vspace{0.08in}
      {\normalsize\bfseries \@guide\par}
      {\small (\@designation, Department of \@guidedepartment)\par}
      \vspace{0.25in}
      {\normalsize\itshape in partial fulfillment for the award of the degree\par of\par}
      \vspace{0.15in}
      {\large\bfseries \srmudegree\par}
      {\normalsize in\par}
      {\normalsize\bfseries \MakeUppercase{\@department}\par}
      \vspace{0.15in}
      {\normalsize\bfseries FACULTY OF ENGINEERING AND TECHNOLOGY\par}
      \vspace{0.25in}
      \ifpdf
        \IfFileExists{SRM.eps}{\includegraphics[width=2.4in]{SRM.eps}\par}{}
      \else
        \IfFileExists{SRM.eps}{\includegraphics[width=2.4in]{SRM.eps}\par}{}
      \fi
      \vspace{0.15in}
      {\normalsize\bfseries SRM INSTITUTE OF SCIENCE \& TECHNOLOGY\par}
      {\footnotesize (Deemed to be University u/s 3 of UGC Act, 1956)\par}
      {\small TIRUCHIRAPPALLI CAMPUS\par}
      \vspace{0.15in}
      {\normalsize\bfseries \@date\par}
    \end{center}
  \end{titlepage}
}

% Certificate
\newcommand{\certificate}{
  \newpage
  \thispagestyle{empty}
  \begin{center}
    {\large\bfseries SRM INSTITUTE OF SCIENCE \& TECHNOLOGY\par}
    {\footnotesize (Deemed to be University u/s 3 of UGC Act, 1956)\par}
    {\small TIRUCHIRAPPALLI CAMPUS\par}
    \vspace{0.4in}
    {\large\bfseries BONAFIDE CERTIFICATE\par}
  \end{center}
  \vspace{0.3in}
  \begin{doublespace}
  \noindent Certified that this project report titled \textbf{``\@title''} is the bonafide work of \textbf{\@firstauthor\ \@firstauthorregno}\ifx\@secondauthor\@empty\else, \textbf{\@secondauthor\ \@secondauthorregno}\fi\ifx\@thirdauthor\@empty\else, \textbf{\@thirdauthor\ \@thirdauthorregno}\fi, who carried out the project work under my supervision. Certified further, that to the best of my knowledge the work reported herein does not form any other project report or dissertation on the basis of which a degree or award was conferred on an earlier occasion on this or any other candidate.
  \end{doublespace}
  \vspace{1.0in}
  \noindent
  \begin{minipage}[t]{0.45\textwidth}
    \textbf{SIGNATURE}\\[0.6in]
    \textbf{\@guide}\\
    \textbf{GUIDE}\\
    \@designation\\
    Dept. of \@guidedepartment
  \end{minipage}
  \hfill
  \begin{minipage}[t]{0.45\textwidth}
    \textbf{SIGNATURE}\\[0.6in]
    \textbf{\@hod}\\
    \textbf{HEAD OF THE DEPARTMENT}\\
    Dept. of \@department
  \end{minipage}
  \vspace{1.2in}
  \noindent
  \begin{minipage}[t]{0.45\textwidth}
    Signature of the Internal Examiner
  \end{minipage}
  \hfill
  \begin{minipage}[t]{0.45\textwidth}
    Signature of the External Examiner
  \end{minipage}
  \newpage
}

% Abstract
\newcommand{\abstract}{
  \newpage
  \chapter*{\centerline{ABSTRACT}}
  \addcontentsline{toc}{chapter}{ABSTRACT}
}

% Acknowledgements
\newcommand{\acknowledgements}{
  \newpage
  \chapter*{\centerline{ACKNOWLEDGEMENTS}}
  \addcontentsline{toc}{chapter}{ACKNOWLEDGEMENTS}
}

% Abbreviations
\newcommand{\abbreviations}{
  \newpage
  \chapter*{\centerline{LIST OF ABBREVIATIONS}}
  \addcontentsline{toc}{chapter}{LIST OF ABBREVIATIONS}
}

\endinput

