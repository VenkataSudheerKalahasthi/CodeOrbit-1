/**
 * Full-Year Month-Wise Streak Calendar Component for Ctrl+Alt+Career
 * Renders complete 12-month activity separated into individual month cards.
 * Positioned below the Upcoming Rounds section.
 */

const StreakCalendar = {
    init() {
        this.render();
    },

    render() {
        const container = document.getElementById("streak-calendar-grid");
        if (!container) return;

        const currentYear = new Date().getFullYear();
        const user = StorageManager.getCurrentUser();

        // Update Header Stats
        const yearBadge = document.getElementById("streak-year-badge");
        const currentStreakVal = document.getElementById("yearly-current-streak-val");
        const longestStreakVal = document.getElementById("yearly-longest-streak-val");
        const activeDaysVal = document.getElementById("yearly-active-days-val");

        if (yearBadge) yearBadge.textContent = currentYear;
        if (currentStreakVal) currentStreakVal.textContent = `${user ? user.currentStreak || 0 : 0} Days`;
        if (longestStreakVal) longestStreakVal.textContent = `${user ? user.longestStreak || 0 : 0} Days`;

        const todayIso = (typeof AnalyticsEngine !== "undefined" && AnalyticsEngine.getLocalDateKey)
            ? AnalyticsEngine.getLocalDateKey(new Date())
            : new Date().toISOString().split("T")[0];
        const monthShortNames = [
            "JAN", "FEB", "MAR", "APR",
            "MAY", "JUN", "JUL", "AUG",
            "SEP", "OCT", "NOV", "DEC"
        ];

        let totalActiveDays = 0;
        let html = '<div class="streak-months-row">';

        // Loop through all 12 months in ONE horizontal row
        for (let m = 0; m < 12; m++) {
            const firstDayObj = new Date(currentYear, m, 1);
            const daysInMonth = new Date(currentYear, m + 1, 0).getDate();
            
            // Standardize Mon = 0, Tue = 1, Wed = 2, Thu = 3, Fri = 4, Sat = 5, Sun = 6
            const startDay = (firstDayObj.getDay() + 6) % 7;

            const isLastMonth = (m === 11);
            const dividerClass = isLastMonth ? '' : ' month-block-divider';

            html += `<div class="month-block${dividerClass}">`;
            html += `<div class="month-block-title">${monthShortNames[m]}</div>`;
            
            // Weekday Headers (M T W T F S S)
            html += `<div class="month-weekdays-row">`;
            html += `<span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>`;
            html += `</div>`;

            html += `<div class="month-cells-grid">`;

            // 1. Leading empty cells before the 1st of the month
            for (let i = 0; i < startDay; i++) {
                html += `<div class="month-cell empty-placeholder"></div>`;
            }

            // 2. Day cells for this month
            for (let d = 1; d <= daysInMonth; d++) {
                const monthStr = String(m + 1).padStart(2, "0");
                const dayStr = String(d).padStart(2, "0");
                const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

                const count = this.getDailyProblemCount(user, dateKey);
                if (count > 0) totalActiveDays++;

                const level = this.getStreakLevel(count);
                const isToday = (dateKey === todayIso);
                const todayClass = isToday ? ' is-today' : '';

                const dateObj = new Date(currentYear, m, d);
                const dateFormatted = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });

                const activityText = count === 0
                    ? "No activity"
                    : (count === 1 ? "1 problem solved" : `${count} problems solved`);

                const ariaText = `${dateFormatted} — ${activityText}`;

                html += `<div class="month-cell streak-cell level-${level}${todayClass}"
                             data-date="${dateKey}"
                             data-count="${count}"
                             tabindex="0"
                             role="button"
                             aria-label="${ariaText}"></div>`;
            }

            // 3. Trailing empty cells to fill last row of grid
            const totalCellsSoFar = startDay + daysInMonth;
            const remainder = totalCellsSoFar % 7;
            if (remainder !== 0) {
                const trailingEmpty = 7 - remainder;
                for (let i = 0; i < trailingEmpty; i++) {
                    html += `<div class="month-cell empty-placeholder"></div>`;
                }
            }

            html += `</div>`; // end month-cells-grid
            html += `</div>`; // end month-block
        }

        html += '</div>'; // end streak-months-row

        if (activeDaysVal) activeDaysVal.textContent = totalActiveDays;

        container.innerHTML = html;

        // Clean up any existing floating tooltip DOM element
        const oldTooltip = document.getElementById("streak-global-tooltip");
        if (oldTooltip) {
            oldTooltip.remove();
        }
    },

    getDailyProblemCount(user, dateStr) {
        if (!user || !dateStr) return 0;
        let count = 0;

        if (user.completionDates && typeof user.completionDates[dateStr] !== "undefined") {
            const val = user.completionDates[dateStr];
            if (typeof val === "number") {
                count = Math.max(0, val);
            } else if (val) {
                count = 1;
            }
        }

        // If completionDates is 0 or missing, check deduplicated activity records
        if (count === 0 && user.activity && Array.isArray(user.activity)) {
            const solvedIds = new Set();
            user.activity.forEach(a => {
                if ((a.type === "PROBLEM_COMPLETED" || a.type === "PROBLEM_SOLVED") && a.timestamp) {
                    const localKey = (typeof AnalyticsEngine !== "undefined" && AnalyticsEngine.getLocalDateKey)
                        ? AnalyticsEngine.getLocalDateKey(a.timestamp)
                        : a.timestamp.split("T")[0];
                    if (localKey === dateStr) {
                        const pid = a.problemId || a.id || a.description;
                        if (pid) solvedIds.add(pid);
                    }
                }
            });
            if (solvedIds.size > 0) {
                count = solvedIds.size;
            }
        }

        return count;
    },

    /**
     * 3-Tier Activity Classification:
     * 0: Inactive / Empty
     * 1: Low Activity (#DCFCE7)
     * 2: Medium Activity (#4ADE80)
     * 3: High Activity (#16A34A)
     */
    getStreakLevel(count) {
        if (count <= 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        return 3;
    }
};

window.StreakCalendar = StreakCalendar;
