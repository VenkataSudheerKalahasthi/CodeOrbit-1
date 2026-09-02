/**
 * Problem Service for CodeOrbit
 * 
 * Provides database-backed CRUD, search, filtering, pagination, and status lifecycle
 * (Published, Draft, Archived) for DSA Mastery problems stored in Supabase.
 * Connects directly to public.problems with strict Admin RLS enforcement and audit logging.
 */

(function () {
    'use strict';

    const ProblemService = {
        get client() {
            return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
        },

        /**
         * Fetch paginated, filtered problems for Admin Problem Management
         */
        async getProblems({
            search = '',
            difficulty = 'All',
            platform = 'All',
            status = 'All',
            phase = 'All',
            section = 'All',
            topic = 'All',
            sortBy = 'problem_order',
            sortOrder = 'asc',
            page = 1,
            limit = 20
        } = {}) {
            if (!this.client) {
                return this._getFallbackProblems({ search, difficulty, platform, status, sortBy, sortOrder, page, limit });
            }

            try {
                let query = this.client
                    .from('problems')
                    .select('*', { count: 'exact' });

                // Status Filter
                if (status && status !== 'All') {
                    query = query.eq('status', status.toLowerCase());
                }

                // Difficulty Filter
                if (difficulty && difficulty !== 'All') {
                    query = query.eq('difficulty', difficulty);
                }

                // Platform Filter
                if (platform && platform !== 'All') {
                    query = query.eq('platform', platform);
                }

                // Phase Filter
                if (phase && phase !== 'All') {
                    query = query.eq('phase', phase);
                }

                // Section Filter
                if (section && section !== 'All') {
                    query = query.eq('section', section);
                }

                // Topic / Section Filter
                if (topic && topic !== 'All') {
                    query = query.or(`topic.eq."${topic}",section.eq."${topic}"`);
                }

                // Search Query (Title, URL, ID, Topic, Section, Platform)
                if (search && search.trim()) {
                    const clean = search.trim().toLowerCase();
                    query = query.or(`title.ilike.%${clean}%,url.ilike.%${clean}%,id.ilike.%${clean}%,topic.ilike.%${clean}%,section.ilike.%${clean}%,platform.ilike.%${clean}%`);
                }

                // Sorting
                const ascending = sortOrder === 'asc';
                if (sortBy === 'title') {
                    query = query.order('title', { ascending });
                } else if (sortBy === 'difficulty') {
                    query = query.order('difficulty', { ascending });
                } else if (sortBy === 'created_at') {
                    query = query.order('created_at', { ascending });
                } else {
                    query = query.order('problem_order', { ascending }).order('id', { ascending: true });
                }

                // Pagination Range
                const from = (page - 1) * limit;
                const to = from + limit - 1;
                query = query.range(from, to);

                const { data, count, error } = await query;

                if (error) {
                    console.warn('ProblemService.getProblems query notice:', error.message);
                    return this._getFallbackProblems({ search, difficulty, platform, status, topic, sortBy, sortOrder, page, limit });
                }

                const totalCount = count !== null ? count : (data ? data.length : 0);
                const totalPages = Math.ceil(totalCount / limit) || 1;

                return {
                    success: true,
                    problems: data || [],
                    totalCount,
                    page,
                    totalPages,
                    limit
                };
            } catch (err) {
                console.warn('ProblemService.getProblems catch fallback:', err);
                return this._getFallbackProblems({ search, difficulty, platform, status, topic, sortBy, sortOrder, page, limit });
            }
        },

        /**
         * Fetch all published problems for the main CodeOrbit application (DSA Mastery)
         */
        async getPublishedProblems() {
            if (!this.client) {
                return (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) ? PROBLEMS : [];
            }

            try {
                const { data, error } = await this.client
                    .from('problems')
                    .select('*')
                    .eq('status', 'published')
                    .order('problem_order', { ascending: true })
                    .order('id', { ascending: true });

                if (error || !data || data.length === 0) {
                    return (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) ? PROBLEMS : [];
                }

                // Map database columns to application problem shape
                return data.map(p => ({
                    id: isNaN(Number(p.id)) ? p.id : Number(p.id),
                    title: p.title,
                    url: p.url || '#',
                    platform: p.platform || 'LeetCode',
                    difficulty: p.difficulty || 'Medium',
                    topic: p.topic || p.section || 'General',
                    subtopic: p.subtopic || p.category || 'General',
                    a2zSection: p.section || p.topic || 'General',
                    a2zSectionOrder: p.problem_order || 0,
                    level: p.level || 'INTERMEDIATE',
                    phase: p.phase || 'Foundation',
                    tags: p.tags || []
                }));
            } catch (e) {
                return (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) ? PROBLEMS : [];
            }
        },

        /**
         * Fetch aggregate statistics for Admin Problem Management
         */
        async getProblemStats() {
            if (!this.client) {
                const dataset = (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) ? PROBLEMS : [];
                return {
                    total: dataset.length,
                    published: dataset.length,
                    draft: 0,
                    archived: 0,
                    easy: dataset.filter(p => (p.difficulty || '').toLowerCase() === 'easy').length,
                    medium: dataset.filter(p => (p.difficulty || '').toLowerCase() === 'medium').length,
                    hard: dataset.filter(p => (p.difficulty || '').toLowerCase() === 'hard').length
                };
            }

            try {
                const { data, error } = await this.client
                    .from('problems')
                    .select('id, difficulty, status');

                if (error || !data || data.length === 0) {
                    const dataset = (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) ? PROBLEMS : [];
                    return {
                        total: dataset.length,
                        published: dataset.length,
                        draft: 0,
                        archived: 0,
                        easy: dataset.filter(p => (p.difficulty || '').toLowerCase() === 'easy').length,
                        medium: dataset.filter(p => (p.difficulty || '').toLowerCase() === 'medium').length,
                        hard: dataset.filter(p => (p.difficulty || '').toLowerCase() === 'hard').length
                    };
                }

                const total = data.length;
                const published = data.filter(p => p.status === 'published').length;
                const draft = data.filter(p => p.status === 'draft').length;
                const archived = data.filter(p => p.status === 'archived').length;
                const easy = data.filter(p => (p.difficulty || '').toLowerCase() === 'easy').length;
                const medium = data.filter(p => (p.difficulty || '').toLowerCase() === 'medium').length;
                const hard = data.filter(p => (p.difficulty || '').toLowerCase() === 'hard').length;

                return { total, published, draft, archived, easy, medium, hard };
            } catch (e) {
                return { total: 0, published: 0, draft: 0, archived: 0, easy: 0, medium: 0, hard: 0 };
            }
        },

        /**
         * Check for duplicate problem by URL or Title + Platform
         */
        async checkDuplicate(url, title, platform, excludeId = null) {
            if (!this.client) return { isDuplicate: false };

            try {
                if (url && url.trim() && url !== '#') {
                    let query = this.client
                        .from('problems')
                        .select('id, title, url, platform')
                        .eq('url', url.trim());

                    if (excludeId) {
                        query = query.neq('id', String(excludeId));
                    }

                    const { data } = await query.maybeSingle();
                    if (data) {
                        return { isDuplicate: true, duplicateField: 'URL', match: data };
                    }
                }

                if (title && title.trim()) {
                    let query = this.client
                        .from('problems')
                        .select('id, title, url, platform')
                        .ilike('title', title.trim())
                        .eq('platform', platform || 'LeetCode');

                    if (excludeId) {
                        query = query.neq('id', String(excludeId));
                    }

                    const { data } = await query.maybeSingle();
                    if (data) {
                        return { isDuplicate: true, duplicateField: 'Title + Platform', match: data };
                    }
                }

                return { isDuplicate: false };
            } catch (e) {
                return { isDuplicate: false };
            }
        },

        /**
         * Check dependencies before archiving or managing a problem
         */
        async checkProblemDependencies(problemId) {
            if (!this.client || !problemId) return { solves: 0, notes: 0, favorites: 0 };

            try {
                const [progRes, notesRes, favsRes] = await Promise.all([
                    this.client.from('problem_progress').select('id', { count: 'exact', head: true }).eq('problem_id', String(problemId)).eq('completed', true),
                    this.client.from('problem_notes').select('user_id', { count: 'exact', head: true }).eq('problem_id', String(problemId)),
                    this.client.from('problem_favorites').select('user_id', { count: 'exact', head: true }).eq('problem_id', String(problemId))
                ]);

                return {
                    solves: progRes.count || 0,
                    notes: notesRes.count || 0,
                    favorites: favsRes.count || 0
                };
            } catch (e) {
                return { solves: 0, notes: 0, favorites: 0 };
            }
        },

        /**
         * Add a new problem to Supabase
         */
        async addProblem(problemData, adminUser = null) {
            if (!this.client) throw new Error('Supabase client not initialized.');

            // Validation
            if (!problemData.title || !problemData.title.trim()) {
                throw new Error('Problem title is required.');
            }

            const platform = problemData.platform || 'LeetCode';
            const difficulty = problemData.difficulty || 'Medium';
            const url = (problemData.url || '').trim();

            // Check duplicate
            const dupCheck = await this.checkDuplicate(url, problemData.title, platform);
            if (dupCheck.isDuplicate) {
                throw new Error(`Problem already exists (Matched ${dupCheck.duplicateField}: "${dupCheck.match.title}")`);
            }

            // Assign unique ID if not specified
            let newId = problemData.id ? String(problemData.id).trim() : null;
            if (!newId) {
                // Find highest existing integer ID or generate slug
                const { data: maxRows } = await this.client
                    .from('problems')
                    .select('id')
                    .order('created_at', { ascending: false })
                    .limit(50);

                let maxInt = 0;
                if (maxRows) {
                    maxRows.forEach(r => {
                        const num = parseInt(r.id, 10);
                        if (!isNaN(num) && num > maxInt) maxInt = num;
                    });
                }
                newId = String(maxInt > 0 ? maxInt + 1 : (typeof PROBLEMS !== 'undefined' ? PROBLEMS.length + 1 : Date.now()));
            }

            const payload = {
                id: newId,
                title: problemData.title.trim(),
                url: url || '#',
                platform,
                difficulty,
                phase: problemData.phase || 'Foundation',
                section: problemData.section || problemData.topic || '01 - Learn the Basics',
                topic: problemData.topic || problemData.section || '01 - Learn the Basics',
                subtopic: problemData.subtopic || problemData.category || 'General',
                category: problemData.category || problemData.subtopic || 'General',
                problem_order: parseInt(problemData.problem_order, 10) || 0,
                status: problemData.status || 'published',
                level: problemData.level || 'INTERMEDIATE',
                tags: Array.isArray(problemData.tags) ? problemData.tags : (problemData.tags ? String(problemData.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from('problems')
                .insert(payload)
                .select()
                .single();

            if (error) throw error;

            // Log Admin Audit Trail
            await this._logAudit(adminUser?.id, 'ADD_PROBLEM', 'problem', newId, {
                title: payload.title,
                status: payload.status,
                platform: payload.platform
            });

            return data;
        },

        /**
         * Update an existing problem in Supabase (preserving existing ID and user progress)
         */
        async updateProblem(problemId, updateData, adminUser = null) {
            if (!this.client || !problemId) throw new Error('Problem ID is required.');

            const idStr = String(problemId);

            // Check duplicate if title or URL changed
            if (updateData.title || updateData.url) {
                const dupCheck = await this.checkDuplicate(updateData.url, updateData.title, updateData.platform, idStr);
                if (dupCheck.isDuplicate) {
                    throw new Error(`Another problem already exists with this ${dupCheck.duplicateField}: "${dupCheck.match.title}"`);
                }
            }

            const payload = {
                updated_at: new Date().toISOString()
            };

            if (updateData.title !== undefined) payload.title = String(updateData.title).trim();
            if (updateData.url !== undefined) payload.url = String(updateData.url).trim();
            if (updateData.platform !== undefined) payload.platform = updateData.platform;
            if (updateData.difficulty !== undefined) payload.difficulty = updateData.difficulty;
            if (updateData.phase !== undefined) payload.phase = updateData.phase;
            if (updateData.section !== undefined) payload.section = updateData.section;
            if (updateData.topic !== undefined) payload.topic = updateData.topic;
            if (updateData.subtopic !== undefined) payload.subtopic = updateData.subtopic;
            if (updateData.category !== undefined) payload.category = updateData.category;
            if (updateData.problem_order !== undefined) payload.problem_order = parseInt(updateData.problem_order, 10) || 0;
            if (updateData.status !== undefined) payload.status = updateData.status;
            if (updateData.level !== undefined) payload.level = updateData.level;
            if (updateData.tags !== undefined) {
                payload.tags = Array.isArray(updateData.tags) ? updateData.tags : String(updateData.tags).split(',').map(t => t.trim()).filter(Boolean);
            }

            const { data, error } = await this.client
                .from('problems')
                .update(payload)
                .eq('id', idStr)
                .select()
                .single();

            if (error) throw error;

            // Log Admin Audit Trail
            await this._logAudit(adminUser?.id, 'EDIT_PROBLEM', 'problem', idStr, payload);

            return data;
        },

        /**
         * Archive problem (soft status update, keeps all historical user progress intact)
         */
        async archiveProblem(problemId, adminUser = null) {
            return this.updateProblem(problemId, { status: 'archived' }, adminUser);
        },

        /**
         * Publish problem (makes visible to active users)
         */
        async publishProblem(problemId, adminUser = null) {
            return this.updateProblem(problemId, { status: 'published' }, adminUser);
        },

        /**
         * Set problem to draft status
         */
        async setDraftProblem(problemId, adminUser = null) {
            return this.updateProblem(problemId, { status: 'draft' }, adminUser);
        },

        /**
         * Bulk seed existing 375 problems into Supabase table public.problems
         */
        async seedMasterProblems(dataset = null, adminUser = null) {
            if (!this.client) throw new Error('Supabase client not initialized.');

            const source = dataset || (typeof PROBLEMS !== 'undefined' ? PROBLEMS : []);
            if (!Array.isArray(source) || source.length === 0) {
                throw new Error('No problem dataset found to seed.');
            }

            const rows = source.map((p, idx) => ({
                id: String(p.id),
                title: p.title,
                url: p.url || '#',
                platform: p.platform || 'LeetCode',
                difficulty: p.difficulty || 'Medium',
                phase: p.phase || (p.topic && p.topic.includes('01') ? 'Foundation' : 'Core Data Structures'),
                section: p.a2zSection || p.topic || 'General',
                topic: p.topic || p.a2zSection || 'General',
                subtopic: p.subtopic || 'General',
                category: p.subtopic || 'General',
                problem_order: Number(p.id) || (idx + 1),
                status: 'published',
                level: p.level || 'INTERMEDIATE',
                tags: []
            }));

            // Upsert in batches of 50 to prevent payload limits
            const BATCH_SIZE = 50;
            let insertedTotal = 0;

            for (let i = 0; i < rows.length; i += BATCH_SIZE) {
                const batch = rows.slice(i, i + BATCH_SIZE);
                const { error } = await this.client
                    .from('problems')
                    .upsert(batch, { onConflict: 'id', ignoreDuplicates: true });

                if (error) throw error;
                insertedTotal += batch.length;
            }

            await this._logAudit(adminUser?.id, 'SEED_MASTER_PROBLEMS', 'dataset', 'bulk', { count: insertedTotal });

            return { success: true, count: insertedTotal };
        },

        /**
         * Log administrative actions to public.admin_audit_logs
         */
        async _logAudit(adminId, action, targetType, targetId, details = {}) {
            if (!this.client) return;
            try {
                await this.client.from('admin_audit_logs').insert({
                    admin_id: adminId || null,
                    action,
                    target_type: targetType,
                    target_id: targetId,
                    details
                });
            } catch (_) {
                // Non-blocking audit log catch
            }
        },

        /**
         * Fallback in-memory querying for offline/initial state
         */
        _getFallbackProblems({ search, difficulty, platform, status, topic, sortBy, sortOrder, page, limit }) {
            let list = (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) ? PROBLEMS.map((p, idx) => ({
                id: String(p.id),
                title: p.title,
                url: p.url,
                platform: p.platform,
                difficulty: p.difficulty,
                phase: p.phase || 'Foundation',
                section: p.a2zSection || p.topic,
                topic: p.topic,
                subtopic: p.subtopic || 'General',
                category: p.subtopic || 'General',
                problem_order: Number(p.id) || (idx + 1),
                status: 'published',
                level: p.level || 'INTERMEDIATE'
            })) : [];

            if (difficulty && difficulty !== 'All') {
                list = list.filter(p => (p.difficulty || '').toLowerCase() === difficulty.toLowerCase());
            }

            if (platform && platform !== 'All') {
                list = list.filter(p => (p.platform || '').toLowerCase() === platform.toLowerCase());
            }

            if (status && status !== 'All') {
                list = list.filter(p => p.status === status.toLowerCase());
            }

            if (topic && topic !== 'All') {
                const topicLower = topic.toLowerCase();
                list = list.filter(p => 
                    (p.section || '').toLowerCase() === topicLower ||
                    (p.topic || '').toLowerCase() === topicLower
                );
            }

            if (search && search.trim()) {
                const q = search.trim().toLowerCase();
                list = list.filter(p => 
                    (p.title || '').toLowerCase().includes(q) ||
                    (p.topic || '').toLowerCase().includes(q) ||
                    (p.section || '').toLowerCase().includes(q) ||
                    (p.platform || '').toLowerCase().includes(q) ||
                    String(p.id).includes(q)
                );
            }

            const ascending = sortOrder === 'asc';
            list.sort((a, b) => {
                if (sortBy === 'title') {
                    return ascending 
                        ? a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }) 
                        : b.title.localeCompare(a.title, undefined, { numeric: true, sensitivity: 'base' });
                }
                if (sortBy === 'difficulty') {
                    const diffMap = { 'easy': 1, 'medium': 2, 'hard': 3 };
                    const diffA = diffMap[(a.difficulty || '').toLowerCase()] || 2;
                    const diffB = diffMap[(b.difficulty || '').toLowerCase()] || 2;
                    return ascending ? diffA - diffB : diffB - diffA;
                }
                if (sortBy === 'created_at') {
                    const timeA = new Date(a.created_at || 0).getTime();
                    const timeB = new Date(b.created_at || 0).getTime();
                    return ascending ? timeA - timeB : timeB - timeA;
                }

                // Default / Numerical Order
                const numA = Number(a.problem_order) > 0 ? Number(a.problem_order) : (Number(a.id) || 0);
                const numB = Number(b.problem_order) > 0 ? Number(b.problem_order) : (Number(b.id) || 0);
                if (numA !== numB) {
                    return ascending ? (numA - numB) : (numB - numA);
                }
                const idA = Number(a.id) || 0;
                const idB = Number(b.id) || 0;
                return ascending ? (idA - idB) : (idB - idA);
            });

            const totalCount = list.length;
            const totalPages = Math.ceil(totalCount / limit) || 1;
            const from = (page - 1) * limit;
            const paginated = list.slice(from, from + limit);

            return {
                success: true,
                problems: paginated,
                totalCount,
                page,
                totalPages,
                limit
            };
        }
    };

    window.ProblemService = ProblemService;
})();
