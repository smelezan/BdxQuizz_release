const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const User = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		stats: {
			nbQuizzWon: {
				type: Number,
				default: 0,
			},
			nbQuizzLost: {
				type: Number,
				default: 0,
			},
			nbQuizzPlayed: {
				type: Number,
				default: 0,
			},
			scores: {
				type: [Number],
				default: [],
			},
			bestScore: {
				type: Number,
				default: -1,
			},
			averageScore: {
				type: Number,
				default: -1,
			},
			times: {
				type: [Number],
				default: [],
			},
			bestTime: {
				type: Number,
				default: 600000000000,
			},
			averageTime: {
				type: Number,
				default: -1,
			},
			category: {
				type: Object,
				default: {},
			},
		},
	},
	{ strict: false }
);

User.plugin(uniqueValidator);
module.exports = mongoose.model('User', User);
