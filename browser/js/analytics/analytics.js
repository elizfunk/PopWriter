

app.config(function ($stateProvider) {
    $stateProvider.state('analytics', {
        url: '/analytics',
        templateUrl: 'js/analytics/analytics.html',
        controller: 'analytics',
        resolve: {
			scrapedSPs: (AnalyticsFactory) => {
				return AnalyticsFactory.getScreenPlays()
				.then(screenplays => {
					return screenplays})
				.catch(error => console.error(error));
    		}
    	}
    })
    .state('analytics.pieChart', {
    	url: '/pieChart/:id',
    	templateUrl: 'js/analytics/pieChart.html',
    	controller: function($scope, AnalyticsFactory, pieChartData) {
            $scope.hidden = true;
    		console.log(pieChartData);
    		$scope.options = AnalyticsFactory.pieChartOptions;
    		console.log("PC options", $scope.options);
    		$scope.data = pieChartData;
    	},
    	resolve: {
    		pieChartData: (AnalyticsFactory, $stateParams) => {
    			return AnalyticsFactory.getCharacters($stateParams.id)
    			.then(characters => characters)
    			.catch(error => console.error(error));
    		}
    	}
    })
    .state('analytics.donutChart', {
		url: 'donutChart/:id',
		templateUrl: 'js/analytics/donutChart.html',
		controller: function($scope, AnalyticsFactory, pieChartData) {
            $scope.hidden = true;
			console.log("piechartdata in donut:", pieChartData);
			$scope.selectDChar = function(char){
				$scope.data = $scope.dselected;
			};
			// $scope.data;
			$scope.options = AnalyticsFactory.donutChartOptions;
			$scope.chars = pieChartData;
		},
    	resolve: {
			pieChartData: (AnalyticsFactory, $stateParams) => {
				return AnalyticsFactory.getCharacters($stateParams.id)
				.then(characters => characters)
				.catch(error => console.error(error));
			}
	   	}
	})
	.state('analytics.lineChart', {
		url: '/lineChart/:id',
		templateUrl: 'js/analyticsSingle/lineChart.html',
		controller: function($scope, lineChartData, AnalyticsFactory) {
            $scope.hidden = true;
			$scope.selectChar = function(){
				$scope.data.push({
					color: "hsl(" + Math.random() * 360 + ",100%,50%)",
					key: $scope.selected,
					values: $scope.chars[$scope.selected]
				});
			};
			$scope.chars = lineChartData;
			$scope.options = AnalyticsFactory.lineChartOptions;
			$scope.data = [{
					color: "#337ab7",
					key: $scope.selectedScreenplay.name,
					area: true,
					values: lineChartData.sceneText
				}];
		},
		resolve: {
        	lineChartData: (AnalyticsFactory, $stateParams) => {
       			return AnalyticsFactory.getSentiment($stateParams.id)
        		.then(sentiment => sentiment)
        		.catch(error => console.error(error));
        	}
        }
	});
});

app.controller('analytics', function($scope, ScreenplaysFactory, scrapedSPs, AnalyticsFactory){
    $scope.changeSP = (spId) => {$scope.currentSP = spId};
	$scope.scripts = scrapedSPs;
    $scope.hidden = false;
});
