const { execute, query, queryOne } = require("../database/client");

function mapNote(row) {
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    title: row.title,
    content: row.content,
    pinned: Boolean(Number(row.pinned)),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildSortClause(sortValue) {
  switch (sortValue) {
    case "updated-asc":
      return "pinned DESC, updated_at ASC";
    case "created-desc":
      return "pinned DESC, created_at DESC";
    case "title-asc":
      return "pinned DESC, title COLLATE NOCASE ASC";
    default:
      return "pinned DESC, updated_at DESC";
  }
}

function getNotes(req, res, next) {
  try {
    const search = String(req.query.search || "").trim().toLowerCase();
    const sort = String(req.query.sort || "updated-desc");
    const pinnedOnly = String(req.query.pinned || "").trim().toLowerCase() === "true";

    const clauses = ["user_id = ?"];
    const params = [req.user.id];

    if (search) {
      clauses.push("(LOWER(title) LIKE ? OR LOWER(content) LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (pinnedOnly) {
      clauses.push("pinned = 1");
    }

    const rows = query(
      `
        SELECT id, user_id, title, content, pinned, created_at, updated_at
        FROM notes
        WHERE ${clauses.join(" AND ")}
        ORDER BY ${buildSortClause(sort)};
      `,
      params
    );

    return res.json(rows.map(mapNote));
  } catch (error) {
    return next(error);
  }
}

function getSearchResults(req, res, next) {
  return getNotes(req, res, next);
}

function createNote(req, res, next) {
  try {
    const title = String(req.body.title || "").trim() || "Без названия";
    const content = String(req.body.content || "").trim();
    const pinned = req.body.pinned ? 1 : 0;
    const now = new Date().toISOString();

    execute(
      `
        INSERT INTO notes (user_id, title, content, pinned, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?);
      `,
      [req.user.id, title, content, pinned, now, now]
    );

    const createdNote = queryOne(
      `
        SELECT id, user_id, title, content, pinned, created_at, updated_at
        FROM notes
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 1;
      `,
      [req.user.id]
    );

    return res.status(201).json(mapNote(createdNote));
  } catch (error) {
    return next(error);
  }
}

function updateNote(req, res, next) {
  try {
    const existingNote = queryOne(
      `
        SELECT id, user_id, title, content, pinned, created_at, updated_at
        FROM notes
        WHERE id = ? AND user_id = ?;
      `,
      [req.params.id, req.user.id]
    );

    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    const title =
      req.body.title === undefined
        ? existingNote.title
        : String(req.body.title || "").trim() || "Без названия";
    const content =
      req.body.content === undefined
        ? existingNote.content
        : String(req.body.content || "").trim();
    const pinned = req.body.pinned === undefined ? existingNote.pinned : req.body.pinned ? 1 : 0;
    const now = new Date().toISOString();

    execute(
      `
        UPDATE notes
        SET title = ?, content = ?, pinned = ?, updated_at = ?
        WHERE id = ? AND user_id = ?;
      `,
      [title, content, pinned, now, req.params.id, req.user.id]
    );

    const updatedNote = queryOne(
      `
        SELECT id, user_id, title, content, pinned, created_at, updated_at
        FROM notes
        WHERE id = ? AND user_id = ?;
      `,
      [req.params.id, req.user.id]
    );

    return res.json(mapNote(updatedNote));
  } catch (error) {
    return next(error);
  }
}

function deleteNote(req, res, next) {
  try {
    const existingNote = queryOne(
      `
        SELECT id
        FROM notes
        WHERE id = ? AND user_id = ?;
      `,
      [req.params.id, req.user.id]
    );

    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    execute("DELETE FROM notes WHERE id = ? AND user_id = ?;", [req.params.id, req.user.id]);

    return res.json({
      message: "Note deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createNote,
  deleteNote,
  getNotes,
  getSearchResults,
  updateNote,
};
