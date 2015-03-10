#---------------------------------------------------------
# Generate Bernoulli runs using Combinatorial formula
# (*) Example - Batsman - Sir Viv Richards
# > bernoulli(avg=47, sr=90.2);
# (*) Example - Bowler - Curtly Ambrose
# > bernoulli(avg=24.12, sr=3.48*100/6);
#---------------------------------------------------------
bernoulli <- function(avg, sr, wickets = 10, balls = 300) {
# probability of scoring `r' runs in a given ball
    r <- sr/100;
# probability of dismissal
    q <- r/avg; p <- 1-q;

# runs scored while losing all the wickets
# you can lose 10 wickets in 10 balls or .... or in 300 balls
# all these events are independent hence you can add them
    b <- wickets:balls;
    k <- 1; Eallout <- moments.allout(p, r, b, k, wickets);
    k <- 2; Eallout2 <- moments.allout(p, r, b, k, wickets);

# calculate the runs scored if less than 10 wickets fall in
# the alloted number of balls
    w <- 0:wickets-1;
    k <- 1; Enot.allout <- moments.not.allout(p, r, w, k, balls);
    k <- 2; Enot.allout2 <- moments.not.allout(p, r, w, k, balls);

# mean (bernoulli runs)
    ebr <- Eallout + Enot.allout;
# standard deviation
    ebr2 <- Eallout2 + Enot.allout2; sdbr <- sqrt(ebr2 - (ebr)^2);

    result <- list(mean=ebr, sd=sdbr);
    return(result);
}

moments.allout <- function(p, r, b, k, w = 10) {
    y <- ((b-w)^k)*choose(b-1,w-1)*p^(b-w)*(1-p)^w;
    eyk <- (r^k)*(sum(y));
    return(eyk);
}

moments.not.allout <- function(p, r, w, k, n = 300) {
    y <- ((n-w)^k)*choose(n,w)*p^(n-w)*(1-p)^w;
    eyk <- (r^k)*(sum(y));
    return(eyk);
}
#---------------------------------------------------------

