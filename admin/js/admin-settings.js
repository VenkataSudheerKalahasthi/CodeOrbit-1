/**
 * CodeOrbit Admin Portal — Platform Settings Module
 */
window.AdminSettings = {
    async loadSettings() {
        if (window.AdminController) {
            return window.AdminController.loadSettingsView();
        }
    },
    async saveSetting(key, value) {
        if (window.SettingsService) {
            return window.SettingsService.set(key, value);
        }
    }
};
