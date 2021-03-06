"use strict";

const sql = require('../../services/sql');
const protectedSessionService = require('../../services/protected_session');

async function getRecentChanges() {
    const recentChanges = await sql.getRows(
        `SELECT 
            notes.isDeleted AS current_isDeleted,
            notes.title AS current_title,
            notes.isProtected AS current_isProtected,
            note_revisions.*
        FROM 
            note_revisions
            JOIN notes USING(noteId)
        ORDER BY 
            dateModifiedTo DESC 
        LIMIT 1000`);

    if (!protectedSessionService.isProtectedSessionAvailable()) {
        for (const change of recentChanges) {
            if (change.current_isProtected) {
                change.title = change.current_title = "[Protected]";
            }
        }
    }

    return recentChanges;
}

module.exports = {
    getRecentChanges
};