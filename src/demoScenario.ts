// Static submitted-book fixture shared by Home, Team Lead and Admin.
// The reader's three excerpts are only a preview of this ten-chapter scenario.
export const submittedProject = {
  chapterCount: 10,
  completedChapterCount: 10,
  reviewerCount: 3,
  obtainedValidations: 30,
  finalValidationState: 'En attente Chef',
} as const

export const expectedValidations = submittedProject.chapterCount * submittedProject.reviewerCount
