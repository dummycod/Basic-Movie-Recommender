const fs = require("fs");

const prefs = getMoviesStatsList();

//console.log(prefs["Interstellar (2014)"]);

findTopMatches(prefs, "Good Will Hunting (1997)", 5);

//console.log(getSimilarity(prefs, "Inception (2010)", "Inception (2010)"));

function findTopMatches(prefs, movie, n) {
  let scoresDict = [];
  for (iterMovie in prefs) {
    if (iterMovie != movie) {
      score = getSimilarity(prefs, iterMovie, movie);
      if (score <= 0) continue;
      let obj = {};
      obj["movieName"] = iterMovie;
      obj["score"] = score;
      scoresDict.push(obj);
    }
  }
  scoresDict.sort(compare);
  console.log(scoresDict);
}

function compare(a, b) {
  if (a.score < b.score) return 1;
  else if (a.score == b.score) return 0;
  else return -1;
}

function getSimilarity(prefs, movie1, movie2) {
  let sim = {};

  for (userName in prefs[movie1]) {
    if (userName in prefs[movie2]) {
      sim[userName] = 1;
    }
  }

  // console.log(sim);
  let n = Object.keys(sim).length;
  if (n < 30) return 0;

  let [sumX, sumY, sumXSq, sumYSq, sumP] = [0, 0, 0, 0, 0];

  for (userName in sim) {
    sumX += prefs[movie1][userName];
  }

  for (userName in sim) {
    sumY += prefs[movie2][userName];
  }

  for (userName in sim) {
    sumXSq += prefs[movie1][userName] * prefs[movie1][userName];
  }

  for (userName in sim) {
    sumYSq += prefs[movie2][userName] * prefs[movie2][userName];
  }

  for (userName in sim) {
    sumP += prefs[movie1][userName] * prefs[movie2][userName];
  }

  let num = sumP - (sumX * sumY) / n;
  let den = Math.sqrt(
    (sumXSq - Math.pow(sumX, 2) / n) * (sumYSq - Math.pow(sumY, 2) / n)
  );

  if (den == 0) return 0;

  let r = num / den;
  return r;
}

function getMoviesStatsList() {
  const userContent = fs.readFileSync("ratings.json");
  const users = JSON.parse(userContent);
  const moviesList = getMoviesList();

  const prefs = {};

  for (var i = 0; i < users.length; i++) {
    let { userId, movieId, rating } = users[i];
    let movieName = moviesList[movieId];
    if (prefs[movieName] == undefined) {
      prefs[movieName] = {};
    }
    prefs[movieName][userId] = parseFloat(rating);
  }

  return prefs;
}

function getMoviesList() {
  const contents = fs.readFileSync("movies.json");
  const movies = JSON.parse(contents);
  const moviesList = {};

  for (var i = 0; i < movies.length; i++) {
    moviesList[movies[i].movieId] = movies[i].title;
  }

  return moviesList;
}
