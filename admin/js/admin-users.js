/**
 * CodeOrbit Admin Portal — User Management Module
 */
window.AdminUsers = {
    async loadUsers(searchQuery, statusFilter) {
        if (window.AdminController) {
            return window.AdminController.loadUsers(searchQuery, statusFilter);
        }
    },
    async inspectUser(userId) {
        if (window.AdminController) {
            return window.AdminController.openInspectUserModal(userId);
        }
    },
    async toggleStatus(userId, currentStatus) {
        if (window.AdminController) {
            return window.AdminController.openStatusModal(userId, currentStatus);
        }
    },
    async deleteUser(userId, username = '', email = '') {
        if (window.AdminController) {
            return window.AdminController.openDeleteUserModal(userId, username, email);
        }
    }
};
