import type { QuestionPaper } from "@vedaai/types";

export const mockQuestionPaper: QuestionPaper = {
  id: "demo-1",
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  subject: "English",
  className: "5th",
  timeAllowed: "45 minutes",
  maximumMarks: 20,
  generalInstruction: "All questions are compulsory unless stated otherwise.",
  introMessage:
    "Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:",
  sections: [
    {
      id: "a",
      title: "Section A",
      instruction:
        "Short Answer Questions — Attempt all questions. Each question carries 2 marks",
      questions: [
        {
          id: "q1",
          number: 1,
          text: "Define electroplating. Explain its purpose.",
          difficulty: "easy",
          marks: 2,
        },
        {
          id: "q2",
          number: 2,
          text: "What is the role of a conductor in the process of electrolysis?",
          difficulty: "moderate",
          marks: 2,
        },
        {
          id: "q3",
          number: 3,
          text: "Why does a solution of copper sulfate conduct electricity?",
          difficulty: "easy",
          marks: 2,
        },
        {
          id: "q4",
          number: 4,
          text: "Describe one example of the chemical effect of electric current in daily life.",
          difficulty: "moderate",
          marks: 2,
        },
        {
          id: "q5",
          number: 5,
          text: "Explain why electric current is said to have chemical effects.",
          difficulty: "moderate",
          marks: 2,
        },
      ],
    },
  ],
  answerKey: [
    {
      number: 1,
      answer:
        "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.",
    },
    {
      number: 2,
      answer:
        "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.",
    },
  ],
};
