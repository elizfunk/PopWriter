app.factory('AnalyticsFactory', ($http) => {
	const parseData = res => res.data;
	return {
		getScreenPlays: () => $http.get('/api/analytics').then(parseData),
		getSentiment: (id) => $http.get('/api/analytics/' + id).then(parseData),
		getCharacters: (id) => $http.get('/api/analytics/' + id + "/characters").then(parseData)
	}
});