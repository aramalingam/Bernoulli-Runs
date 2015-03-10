var BRUNS=function() {
  // useful for default values in function parameters
  // http://stackoverflow.com/questions/894860/how-do-i-make-a-default-value-for-a-parameter-to-a-javascript-function
  function setdefval(arg, defval) {
    return (typeof arg !== 'undefined' ? arg : defval);
  }

  // calculate the binomial coefficient 
  // http://rosettacode.org/wiki/Evaluate_binomial_coefficients#JavaScript
  function choose(n, k) {
    var coeff = 1;

    for (var i = n-k+1; i <= n; i++) {
      coeff *= i;
    }

    for (var i = 1; i <= k; i++) { 
      coeff /= i;
    }

    return coeff;
  }

  // p - probability of dismissal
  // r - runs per ball
  // b - number of balls
  // k - moment
  // w - number of wickets
  function momentsAllout(p, r, b, k, w) {
    w = setdefval(w, 10); 
    var y = Math.pow(r, k) * Math.pow(b-w, k) * choose(b-1, w-1) * Math.pow(p, b-w) * Math.pow(1-p, w);
    return(y);
  }

  // p - probability of dismissal
  // r - runs per ball
  // w - number of wickets
  // k - moment
  // n - number of balls
  function momentsNotout(p, r, w, k, n) {
    n = setdefval(n, 10); 
    var y = Math.pow(r, k) * Math.pow(n-w, k) * choose(n, w) * Math.pow(p, n-w) * Math.pow(1-p, w);
    return(y);
  }

  this.bernoulli = function (avg, sr, balls, wickets) {
    // probability of scoring `r' runs in a given ball
    var r = sr/100; 
    // probability of dismissal in a given ball
    var p = 1 - (r/avg);

    // default for balls is our beloved 50 over ODI
    balls   = setdefval(balls, 300); 
    // all three formats have 10 wickets per innings
    // but if you want to use it for Hong Kong sixers 
    // then use this variable
    wickets = setdefval(wickets, 10); 

    // case 1: 
    // runs scored while losing all the wickets
    // you can lose 10 wickets in 10 balls or .... or in 300 balls
    // all these events are independent hence you can add them
    var eallout  = 0.0;
    var eallout2 = 0.0;

    for (var b = wickets; b <= balls; b++) {
      var k;
      k = 1; eallout  += momentsAllout(p, r, b, k, wickets);
      k = 2; eallout2 += momentsAllout(p, r, b, k, wickets);
    }

    // case 2: 
    // calculate the runs scored if less than 10 wickets fall in
    // the alloted number of balls
    var enotout  = 0.0;
    var enotout2 = 0.0;
    for (var w = 0; w !== wickets; w++) {
      var k;
      k = 1; enotout  += momentsNotout(p, r, w, k, balls);
      k = 2; enotout2 += momentsNotout(p, r, w, k, balls);
    }

    // mean (bernoulli runs)
    var ebr  = eallout + enotout;
    // standard deviation
    var ebr2 = eallout2 + enotout2;
    var sdbr = Math.sqrt(ebr2 - Math.pow(ebr, 2));

    var result = {};
    result["mean"] = ebr;
    result["sd"]   = sdbr;

    return result;
  }
};

function writeOutput(avg, sr) {
  var bruns = new BRUNS().bernoulli(avg, sr);
  var mean  = bruns["mean"];
  var sd    = bruns["sd"];

  document.writeln('mean = ', mean.toFixed(2));
  document.writeln('sd = ', sd.toFixed(2));
}

//--------------------------------------------------
// test it out
//--------------------------------------------------
// Sir Vivian Richards
document.writeln('Sir Vivian Richards');
writeOutput(47.0, 90.2);

// Curtly Ambrose
document.writeln('Curtly Ambrose');
writeOutput(24.12, 3.48*100/6);
