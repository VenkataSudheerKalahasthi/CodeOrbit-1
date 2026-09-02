/**
 * CodeOrbit Admin Portal — Platform Analytics Module
 */
window.AdminAnalytics = {
    async loadAnalytics() {
        if (window.AdminController) {
            return window.AdminController.loadDeepAnalytics();
        }
    },
    async loadCompetitiveStandings(timeframe) {
        if (window.AdminController) {
            return window.AdminController.loadCompetitiveStandings(timeframe);
        }
    }
};
