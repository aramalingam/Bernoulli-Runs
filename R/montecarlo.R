#---------------------------------------------------------
# Bernoulli runs using Monte-Carlo simulation
#---------------------------------------------------------
bernoulli.monte.carlo <- function(avg, sr, simulations = 1000) {
# probability of scoring a run `r' in a given ball
    r <- sr/100;
# probability of dismissal
    q <- r/avg; p <- 1-q;

# runs scored = (avg runs per ball)*(number of scoring shots)
    runs <- r*sapply(1:simulations, function(x) simulate.inning(p));

    result <- list(mean=mean(runs), sd=sd(runs));
    return(result);
}
#---------------------------------------------------------
# Simulate an inning as if the same batsman plays
# every delivery till he faces max deliveries (300 in ODI)
# or till he gets out 10 times whichever is earlier.
#---------------------------------------------------------
simulate.inning <- function(p, balls = 300, wickets = 10) {
# toss the coin `n' times
# tail - out; head - scoring shot
    result <- rbinom(balls, 1, p);

# find the deliveries in which a wicket fell
    fall.of.wicket <- which(!result);

# find the number of heads (scoring shots)
# till the fall of the last wicket
    nheads <- 0;
    if (length(fall.of.wicket) < wickets) {
# team has not been bowled out
        nheads <- sum(result);
    } else {
# team has been bowled out
        last.wicket.index = fall.of.wicket[wickets];
        nheads <- sum(result[1:last.wicket.index]);
    }

    return(nheads);
}
#---------------------------------------------------------

