(function(){
	var ListStarredRepos = function(element, user){
		this.$element = element;
		this.$user = user;
		this.$orderBy = $(this.$element).find('.order ul li');

		this.findUserRepos(user);
		this.$orderBy.on('click', $.proxy(this, 'orderList'));
	}

	ListStarredRepos.prototype.findUserRepos = function(username){
		var url = 'https://api.github.com/users/' + username + '/starred';
		var userRepo = localStorage.getItem(username);

		if(userRepo){
			this.filterReposByLanguage(JSON.parse(userRepo));
		} else {
			$.getJSON(url, (function(data){
				this.filterReposByLanguage(data);

				data = JSON.stringify(data);
				localStorage.setItem(username, data);
			}).bind(this));
		}
	};


	ListStarredRepos.prototype.filterReposByLanguage = function(starredRepos){
		var jsRepos = [];
		starredRepos.map(function(repo){
			if(repo.language == 'JavaScript'){
				jsRepos.push(repo);
			}
		});
		this.repos = jsRepos;
		this.showResults(jsRepos);

	};

	ListStarredRepos.prototype.showResults = function(results){
		this.results = results;
		var section = [];

		results.map((function(result, index){
			section.push('<div class="repo">');
			section.push('<div class="title">' + result.name + '</div>');
			section.push('<div class="content">');
			section.push('<img src="' + result.owner.avatar_url + '" class="repo-img">');
			section.push('<span class="stars">Stars: ' + result.stargazers_count + '</span>');
			section.push('<span class="issues">Open Issues: ' + result.open_issues_count + '</span>');
			section.push('<p>'+ result.description + '</p>');
			section.push('</div></div>');
		}).bind(this));

		$('section').empty().append($(section.join("")));
		
	}

	ListStarredRepos.prototype.orderList = function(e){
		switch(e.target.attributes['order-by'].value) {
			case 'name':
			this.results = this.results.sort(this.orderByName);
			this.showResults(this.results);
			break;
			case 'stars':
			this.orderByStars();
			break;
			case 'issues':
			this.orderByIssues();
			break;
			default:
			console.log(e.target.attributes['order-by'].value)
		}
		
	}

	ListStarredRepos.prototype.orderByName = function(a,b){
		console.log("b" + b);
		console.log("a" + a);
		var resultA = a.name.toUpperCase();
		var resultB = b.name.toUpperCase();
		var compare = 0;
		if(resultA > resultB){
			compare = 1;
		} else if(resultA < resultB){
			compare = -1;
		}
		return compare;
	};

	$('input').on('keydown', function(e){
		if(e.which == '13'){
			var inputValue = e.target.value;
			var parentElement = e.target.parentNode;
			var searchRepo = new ListStarredRepos(parentElement, inputValue);
		}
	})
})();