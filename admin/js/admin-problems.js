/**
 * CodeOrbit Admin Portal — Problem Catalog Module
 */
window.AdminProblems = {
    async loadProblems(page) {
        if (window.AdminController) {
            return window.AdminController.loadProblems(page);
        }
    },
    async saveProblem(data) {
        if (window.ProblemService) {
            return window.ProblemService.upsertProblem(data);
        }
    },
    async archiveProblem(problemId) {
        if (window.AdminController) {
            return window.AdminController.openArchiveModal(problemId);
        }
    }
};
