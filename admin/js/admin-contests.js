/**
 * CodeOrbit Admin Portal — Contests Management Module
 */
window.AdminContests = {
    async loadContests() {
        if (window.AdminController) {
            return window.AdminController.loadContestsAdmin();
        }
    },
    async saveContest(data) {
        if (window.ContestService) {
            return window.ContestService.upsertContest(data);
        }
    },
    async deleteContest(contestId) {
        if (window.ContestService) {
            return window.ContestService.deleteContest(contestId);
        }
    }
};
