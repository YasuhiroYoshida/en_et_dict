# en_et_dict

A single page app project built with Vue.js and Materialize.
It is an English-Estonian dictionary that returns results it collects from external resources.

## Where to find

<https://en-et-dict.herokuapp.com/>

## History

This is a refurbished, improved version of [English-Estonian Dictionary](https://github.com/YasuhiroYoshida/en_ee_dictionary) and [English-Estonian Dictionary API](https://github.com/YasuhiroYoshida/en_ee_dictionary_api) which were built with React and Express.js.

## How to use

1. Enter an English word for which you would like to find corresponding
   Estonian words
1. Wait for English word candidates to be presented - not every word or its
   form you type can be used
1. Pick the one closest to what you typed from the candidates - use
   ↑/↓/Esc/Enter key or mouse
1. Wait a moment for Estonian words to be presented

   The results are shown in this order:

   1. Estonian word
   1. Inflections
   1. Inflection pattern name - alphanumerical word, clickable to toggle the side notes that immediately follow
   1. Inflection pattern side notes (=Märkused.)
   1. Other examples and comparatives - an entry whose pattern name is highlighted is the one you are looking for

1. Repeat 1 through 4 for a different English word

## Events under the hood

1. On every visit, a request is sent out to The Institute of the Estonian
   Language's [2018 MUUTTÜÜBID](https://www.eki.ee/dict/qs/muuttyybid.html) to get the inflection rules
2. On every character key stroke after the first one in the input field, a
   request is sent out to [an internal API](https://www.eki.ee/dict/shs_soovita.cgi)
   of the institution to get English word candidates
3. On picking an English word from the candidates pool, a request is sent to
   another service of the institute[[IES] English-Estonian MT dictionary](https://www.eki.ee/dict/ies/index.cgi) to get matching Estonian words
4. For each of the matching Estonian words, a request is sent out to a
   spelling dictionary, [[ÕS] Eesti õigekeelsussõnaraamat ÕS 2018](https://www.eki.ee/dict/qs/index.cgi) to get its inflections and rules applied
5. Combined with the inflection rules obtained earlier, the findings are shown
   as your search results

## What it solves

The Estonian words take a few dozen cases depending on situations. While it may sound overwhelming, it is believed that the first three cases play an important role and that memorizing them make one's learning experiences easier. This application is focused on providing inflections and their rules. In addition, there is no "one-stop shop" for the language. Learners often must keep several tabs of different resources open on the browser and juggle them to arrive at what they are looking for. This application saves some of such pain points.

## What it bears

This application relies 100% on external resources over which it has no control. If the specifications of the resources change, this applicaiton breaks. Also, it sends several requests and wait for the responses before compiling them to a displayable form; you may be required to wait a moment longer at times than you normally are using existing applications independently.
