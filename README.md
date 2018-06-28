# ml-playground

Playing around with some well-known machine learning techniques in order to get a better grasp of how they work and how they can be implemented.

I am using vanilla ES6 JavaScript running on [Node.js](https://nodejs.org/en/) v8.11.1, with [Yarn](https://yarnpkg.com/lang/en/) as my package manager.

## Content

### Linear Regression

**File:** `/scripts/linear-regressions.js`

**Run:** `yarn run lr`

Generates a sample of training data consisting of values that scatter around a randomly generated linear function. Then trains a simple linear regression model with it and plots everything in the terminal.

### Naive Bayes

**File:** `/scripts/naive-bayes.js`

**Run:** `yarn run nb`

Simulates a simple keyword extraction task. Generates discrete valued training data representing words with features such as "containing paragraph type" (p, h2, h2, etc.) or "Part-of-speech" (noun, noun-phrase, adjective, adverb, ...) and then tries to classify them as "keyword" or "no-keyword". Also, some simple evaluations are run in the end.
