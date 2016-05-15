'use strict';

const router = require('express').Router();
const sentiment = require('sentiment');
const natural = require('natural');
natural.PorterStemmer.attach();
const mongoose = require('mongoose');
const screenplayRepo = mongoose.model('screenplayRepo');
const characterRepo = mongoose.model('characterRepo');
module.exports = router;



router.param('screenplayId', (req, res, next, screenplayId) => {
	screenplayRepo.findById(screenplayId)
	.then(screenplay => {
		req.screenplay = screenplay;
		next(); })
	.catch(next);
});

router.get('/', (req, res, next) => {
	screenplayRepo.find({WordCount: {$gt: 1000}}, {name: 1, WordCount: 1})
	.then(allSPs => res.send(allSPs))
	.catch(next);
});

router.get('/:screenplayId/emotion', (req, res, next) => {
  	const tokenizer = new natural.WordTokenizer();
	var scenes = req.screenplay.scenes();
	var sceneMaster = [];
	scenes.forEach(function(scene) {
		var charByScene = {};
		charByScene.sceneText = '';
		scene.forEach(function(comp) {
			if (comp[1]) {
				charByScene.sceneText += (' ' + comp[1]);
				if (charByScene[comp[0]]) {
					charByScene[comp[0]] += (' '+comp[1]);
				} else {
					charByScene[comp[0]] = comp[1];
				}
			}
		});
		sceneMaster.push(charByScene);

	});
	var emotion = {};
	sceneMaster.forEach((scene, idx) => {
		for (var char in scene){
			var sentimentRes = sentiment(scene[char].tokenizeAndStem().join(' '));
			if (emotion[char]) {
				emotion[char].push({x: idx, y: sentimentRes.comparative, sentiment: sentimentRes});
			} else if (scene[char]) {
				emotion[char] = [];
				emotion[char].push({x: idx, y: sentimentRes.comparative, sentiment: sentimentRes});
			}
		}
	});

	res.json(emotion);
});


router.get('/:id/characters', (req, res , next)=>{
	characterRepo.find({ screenplay: req.params.id })
	.then(characters => {
		characters = characters.filter(char => {
			return (char.wordcount > 100 && !/(:|\d)/.test(char.name) && char.name.split(" ").length <= 3);
		})
		characters = characters.map(name => {
			return {key: name.name, y: name.wordcount}
		})
		res.json(characters);
	})
	.catch(err => console.error(err));
})

router.get('/:screenplayId/wordcount', (req, res , next)=>{
	const TfIdf = new natural.TfIdf();
	characterRepo.filter(req.screenplay)
	.then(filteredChars => {
		filteredChars.forEach(name => {
			TfIdf.addDocument(name.text);
		});
		var formattedforWordCount = filteredChars.map((name, idx) => {
			return {key: name.name, y: name.wordcount, tfidf: TfIdf.listTerms(idx)};
		});
		res.json(formattedforWordCount); })
	.catch(next);
});

