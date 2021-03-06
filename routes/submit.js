const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Log = require('../controls/judgelog');

const submitPath = path.join(process.cwd(), 'data', 'submit');

router.post('/', (req, res, next) => {
	if (!req.user) {
		let err = new Error('You have to login first');
		err.code = 403;
		return next(err);
	}
	let q = req.body;
	if (!q.problem || !q.ext || !q.content) {
		return next(new Error('Invalid request'));
	}
	// Clean logs before writing
	Log.setLog(req.user.username, q.problem, q.ext, {
		created: new Date(),
		content: {
			verdict: '',
			details: []
		}
	});
	fs.writeFile(path.join(submitPath, `0[${req.user.username}][${q.problem}]${q.ext}`), q.content, err => {
		if (err) return next(err);
		res.json(true);
	});
});

module.exports = router;
