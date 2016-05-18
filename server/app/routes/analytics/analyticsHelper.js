const sentiment = require('sentiment');
const natural = require('natural');
natural.PorterStemmer.attach();
const tokenizer = new natural.WordTokenizer();

module.exports.scenesToStrings = arrayOfScenes => {
	sceneMaster = [];
	arrayOfScenes.forEach(function(scene) {
		var charByScene = {};
		scene.forEach(function(comp) {
			if (comp[1]) {
				if (charByScene[comp[0]]) {
					charByScene[comp[0]] += (' '+comp[1]);
				} else {
					charByScene[comp[0]] = comp[1];
				}
			}
		});
		sceneMaster.push(charByScene);
	});
	return sceneMaster;

};

module.exports.sceneStringsToEmotion = arrayOfSceneStrings => {
	var emotion = {};
	arrayOfSceneStrings.forEach((scene, idx) => {
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
	return emotion;
};

module.exports.arrayOfStringsToEmotion = arrayOfStrings => {
	return arrayOfStrings.map((ele, idx) => {
		var sentimentRes = sentiment(ele.tokenizeAndStem().join(' '));
		return {x: idx, y: sentimentRes.comparative, sentiment: sentimentRes};
	});
};



// module.exports = {
// 	scenesToStrings: scenesToStrings
// 	scenesToStrings: scenesToStrings
// };