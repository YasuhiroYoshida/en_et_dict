<template>
  <div class="home">
    <header>
      <h2 class="title">English-Estonian Dictionary</h2>
      <h6 class="center sub-title">with Essential Inflections</h6>
    </header>
    <div class="search-box container">
      <div class="row mb-0 message">
        <div>
          <span v-if="!isInitialized">Initializing...Please wait a moment</span>
        </div>
        <div>
          <span v-if="isRequested">Looking for Estonian words...</span>
        </div>
        <div class="center">
          <span v-if="errorFeedback" class="text-red lighten-3">{{ errorFeedback }}</span>
        </div>
      </div>
      <div class="row mb-0">
        <form class="col s12" @submit.prevent autocomplete="off">
          <div class="row">
            <div class="col s3"></div>
            <div class="autocomplete input-field col s6">
              <input
                id="query"
                class="query"
                type="text"
                placeholder="English word"
                name="query"
                v-model="query"
                @input="onChange"
                @keydown.down="onArrowDown"
                @keydown.up="onArrowUp"
                @keydown.esc="onEsc"
                @keydown.enter="onEnter"
              />
              <div v-if="isExpanded">
                <ul class="autocomplete-results" v-if="!isLoading">
                  <li
                    class="autocomplete-result"
                    v-for="(queriableWord, i) in queriableWords"
                    :key="i"
                    :class="{ 'is-active': arrowCounter == i }"
                    @click="onClick(i)"
                  >
                    {{ queriableWord }}
                  </li>
                </ul>
                <ul class="autocomplete-results" v-if="isLoading">
                  <li class="isLoading">Loading queriable English words...</li>
                </ul>
              </div>
            </div>
            <div class="col s3"></div>
          </div>
        </form>
      </div>
    </div>
    <Result :results="results" :linkToQueriableWords="linkToQueriableWords" />
    <footer class="section">
      <div class="container">
        <div class="row mb-0">
          <div class="col s3"></div>
          <div class="col s6">
            <ul class="collapsible">
              <li class="">
                <div class="collapsible-header">
                  <i class="material-icons">info</i>
                </div>
                <div class="collapsible-body">
                  <div class="footer-notes">
                    <p class="title-small">
                      English-Estonian Dictionary
                      <small>with Essential Inflections</small>
                    </p>
                    <p class="section">
                      This is a dictionary that translates an English word into Estonian ones and
                      provide their inflections.
                      <br />
                      <br />The Estonian language is known to have many cases, 14 to be exact. When
                      you consider plurals and exceptions, the number is believed to reach 30. This
                      often pose challenges to many learners of the language. However, it is also a
                      common belief that, by mastering the essential inflections and their rules,
                      especially those of the first three, <span class="strong">normative</span>,
                      <span class="strong">genitive</span>, and
                      <span class="strong">partitive</span>, the rest will come easy to learn. This
                      is where this website comes in; It is designed to provide such information to
                      help ease the pain of the learners. I hope this will help you all learn
                      Estonian language 🇪🇪.
                    </p>
                    <p class="section">
                      <span class="strong">Note:</span>
                      <br />
                      * The main focus is on providing inflections and their rules, not providing
                      meanings nor contexts to be used.
                      <br />
                      * This website does not have its own database to provide information -
                      everything is scraped from existing resources of others'. What you see is what
                      you get from the resources when you yourself visit them. If their
                      specifications change, results will change or may not even be delivered.
                    </p>
                    <p class="section">
                      <span class="strong">How to use:</span>
                      <br />
                      1. Enter an English word for which you would like to find corresponding
                      Estonian words<br />
                      2. Wait for English word candidates to be presented - not every word or its
                      form you type can be used<br />
                      3. Pick the one closest to what you typed from the candidates - use
                      ↑/↓/Esc/Enter key or mouse<br />
                      4. Wait a moment for Estonian words to be presented<br />
                      <span class="indent-1em">
                        <strong>the results are shown in this order:</strong><br />
                        ✅ Estonian word<br />
                        ✅ Inflections<br />
                        ✅ Inflection pattern name - alphanumerical word, clickable to toggle the
                        side notes that immediately follow<br />
                        ✅ Inflection pattern side notes (=Märkused.)<br />
                        ✅ Other examples and comparatives - an entry whose pattern name is
                        highlighted is the one you are looking for
                      </span>
                      5. Repeat 1 through 4 for a different English word
                    </p>
                    <p class="section">
                      <span class="strong">What's happening under the hood:</span>
                      <br />
                      1. On every visit, a request is sent out to The Institute of the Estonian
                      Language's
                      <a :href="EST_SPELLING_RULES_URL" target="_blank">2018 MUUTTÜÜBID</a>
                      to get the inflection rules<br />
                      2. On every character key stroke after the first one in the input field, a
                      request is sent out to
                      <a :href="ENG_WORD_CANDIDATES_URL" target="_blank">an internal API</a>
                      of the institution to get English word candidates<br />
                      3. On picking an English word from the candidates pool, a request is sent to
                      another service of the institute
                      <a :href="ENG_EST_DICT_URL" target="_blank"
                        >[IES] English-Estonian MT dictionary</a
                      >
                      to get matching Estonian words<br />
                      4. For each of the matching Estonian words, a request is sent out to a
                      spelling dictionary,
                      <a :href="EST_SPELLING_DICT_URL" target="_blank"
                        >[ÕS] Eesti õigekeelsussõnaraamat ÕS 2018</a
                      >
                      to get its inflections and rules applied<br />
                      5. Combined with the inflection rules obtained earlier, the findings are shown
                      as your search results
                    </p>
                    <p class="section">
                      <span class="strong">Comments and inquiries:</span>
                      <br />
                      Send me a message at
                      <a href="mailto:yasuhiro.yoppu@yahoo.com">yasuhiro.yoppu@yahoo.com</a>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col s3"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import async from 'async';
import cheerio from 'cheerio';
import M from 'materialize-css';
import Result from '@/components/Result.vue';

export default {
  name: 'Home',
  components: {
    Result,
  },
  data() {
    return {
      isInitialized: false,
      isExpanded: false,
      isLoading: false,
      isRequested: false,
      errorFeedback: null,
      queriableWords: [],
      arrowCounter: -1,
      query: '',
      linkToQueriableWords: '',
      ruleSet: {},
      results: [],
    };
  },
  created() {
    axios
      .get(`${process.env.VUE_APP_CORS_ANYWHERE_URL}/${process.env.VUE_APP_EST_SPELLING_RULES_URL}`)
      .then((response) => {
        // Inflection rule 1
        //   |- Rule 1's name
        //   |- alltyyp 1 (subrule 1)
        //   |- tyypsona 1 (subrule 1 pattern)
        //   |- vordlus 1 (subrule 1 comparatives)
        //   |- alltyyp 2 (subrule 2)
        const $ = cheerio.load(response.data);
        $('[id^=mt][class!=alltyyp]').each((i, parent) => {
          const ruleName = $(parent).find('a > h1').text();
          const subRules = [];
          $(parent)
            .find('.alltyyp')
            .each((j, child) => {
              const subRuleName = $(child)
                .text()
                .replace(/<span class="nrhele">|<\/span>/, '')
                .replace('ja', 'and');
              const wordsArrays = $(child) // an array of arrays because there can be multiple subrules for every rule
                .nextAll('.tyypsona')
                .first()
                .html()
                .split('<br>')
                .map((elm) => {
                  return $(elm)
                    .text()
                    .replace(/ja/, ',')
                    .replace(/`|\s|\r?\n|\r/g, '')
                    .split(',');
                });
              const bases = wordsArrays.map((wordsArray) => {
                return wordsArray[0];
              });
              const inflectionsArray = wordsArrays.map((wordsArray) => {
                return wordsArray.slice(1);
              });
              const comparatives = $(child)
                .nextAll('.vordlus')
                .first()
                .text()
                .replace(/võrdlus:/, '')
                .replace(/ja/, ',')
                .replace(/`|\s|\r?\n|\r/g, '')
                .split(',');
              subRules.push({
                subRuleName,
                bases,
                inflectionsArray,
                comparatives,
              });
            });
          const notes = $(parent).find('.markused').html();
          this.ruleSet[ruleName] = { subRules, notes };
        });
        this.isInitialized = true;
      })
      .catch((error) => {
        this.errorFeedback = 'Preparing the rule sets failed:';
        console.log('Preparing the rule sets failed: ', error);
      })
      .finally(() => {
        console.log('Ready to use');
      });
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    const elms = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elms, { accordion: false });
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    // a dropdown list of English word candidates should be closed when anywhere outside it is clicked
    handleClickOutside(event) {
      if (event.target.className !== 'autocomplete-result') {
        this.isExpanded = false;
      }
    },
    // ArrowDown, ArrowUp moves your position on a list of queriable English words
    // and therefore changes the query you will be sending.
    // When you escape from the list by pressing Esc key, your selection is preserved.
    // When you get onto the list and get off to the input field, it is considered you could not find a word you like,
    // and both your selection and the list are emptied.
    // When you never get onto such list, it is NOT considered you could not find a word you like,
    // and  both your selection and the list are NOT emptied.
    onArrowDown() {
      if (this.queriableWords.length && !this.isExpanded) {
        this.isExpanded = true;
      }
      if (this.arrowCounter > -1) {
        document
          .getElementsByClassName('autocomplete-result')
          [this.arrowCounter].classList.remove('is-active');
      }
      if (this.arrowCounter < this.queriableWords.length - 1) {
        this.arrowCounter += 1;
        document
          .getElementsByClassName('autocomplete-result')
          [this.arrowCounter].classList.add('is-active');
      }
      this.query = this.queriableWords[this.arrowCounter];
    },
    onArrowUp() {
      if (this.arrowCounter > -1) {
        document
          .getElementsByClassName('autocomplete-result')
          [this.arrowCounter].classList.remove('is-active');
        this.arrowCounter -= 1;
      }
      if (this.arrowCounter > -1) {
        document
          .getElementsByClassName('autocomplete-result')
          [this.arrowCounter].classList.add('is-active');
      }
      if (this.arrowCounter === -1) {
        this.query = '';
        this.queriableWords = [];
      } else {
        this.query = this.queriableWords[this.arrowCounter];
      }
    },
    onClick(index) {
      this.arrowCounter = index;
      this.query = this.queriableWords[this.arrowCounter];
      this.onEnter();
    },
    onEsc() {
      this.isExpanded = false;
    },
    // Search for Estonian words is run
    // 1. while the dropdown is displayed and an English word on it is selected/highlighted,
    //   1. Enter is hit
    //   2. or the English word on the list is clicked
    // 2. while the dropdown is hidden and the English word in the input field exists on the hidden dropdown,
    //   1. Enter is hit
    onEnter() {
      if (this.arrowCounter > -1) {
        this.isExpanded = false; // reset
        this.findEstonianWords();
      } else {
        const found = this.queriableWords.find((queriableWord) => {
          return queriableWord === this.query;
        });
        if (found) {
          this.findEstonianWords();
        } else {
          this.errorFeedback = 'The word does not have a matching Estonian word.';
        }
      }
    },
    // this will not be run when the input value is programmatically changed
    // it will only listens to an input event (= changes made manually by user)
    onChange() {
      this.errorFeedback = null;
      this.queriableWords = [];
      // no search for English words is run if there exists only 0 or 1 character in the input field
      if (this.query.length > 1) {
        this.loadQueriableWords(this.query);
      }
    },
    loadQueriableWords(query) {
      this.isExpanded = true;
      this.isLoading = true;
      const url = `${process.env.VUE_APP_CORS_ANYWHERE_URL}/${
        process.env.VUE_APP_ENG_WORD_CANDIDATES_URL
      }?D=ies&F=M&term=${encodeURI(query)}`;
      axios
        .get(url)
        .then((response) => {
          // response is only accepted if it is for the latest value in the input field
          if (query === this.query) {
            const regex = />(.+)</;
            this.queriableWords = response.data.map((res) => {
              return regex.exec(res)[1];
            });
          }
        })
        .catch((error) => {
          this.errorFeedback = 'Loading English words failed';
          console.log('Loading English words failed: ', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async findEstonianWords() {
      this.results = [];
      this.$loading(true);
      // Query parameters:
      // F   Headword
      // C01 Limit search with only the selected article part
      // C02 Only search exact matches, disallow fuzzy search
      // C06 Results in English
      // C12 Only close headwords list unless exact match
      // C13 Sort output by relevance
      const estWordsUrl = `${
        process.env.VUE_APP_ENG_EST_DICT_URL
      }?F=M&C06=en&C01=1&C02=1&C12=1&C13=1&Q=${encodeURI(this.query)}`;
      this.linkToQueriableWords = estWordsUrl;

      const url = `${process.env.VUE_APP_CORS_ANYWHERE_URL}/${estWordsUrl}`;
      await axios
        .get(url)
        .then((response) => {
          this.buildEstonianWordList(response.data, this.query);
        })
        .catch((error) => {
          this.errorFeedback = 'Finding Estonian words failed';
          console.log('Finding Estonian words failed: ', error);
        });

      setTimeout(() => {
        this.$loading(false);
      }, 1000);
    },
    buildEstonianWordList(html, query) {
      let estonianWords = [];
      const $ = cheerio.load(html);
      // html
      //   |- parent 1
      //     |- queried English word 1
      //     |- matching Estonian word 1
      //       |- matching Estonian word 1 description
      //     |- matching Estonian word 2
      //   |- parent 2...
      $('span[lang=en]').each((i, elm) => {
        if ($(elm).text() === query) {
          $(elm)
            .nextAll('.x')
            .each((j, estonianWordElm) => estonianWords.push(estonianWordElm.children[0].data));
        }
      });

      estonianWords = [...new Set(estonianWords)]; // remove redundancy

      async.each(estonianWords, this.addRuleAndInflections, (error) => {
        if (error) throw error;
      });
    },
    addRuleAndInflections(estonianWord) {
      // Query parameters:
      // F   Headword
      // C01 Do not allow searches in other parts of the article
      // C02 Do not allow searches for similar words
      const url = `${process.env.VUE_APP_CORS_ANYWHERE_URL}/${
        process.env.VUE_APP_EST_SPELLING_DICT_URL
      }?&F=M&C01=1&C02=1&Q=${encodeURI(estonianWord)}`;
      axios
        .get(url)
        .then((response) => {
          const extracts = this.extractRuleNameAndInflections(response.data);
          if (extracts.length) {
            Array.from(extracts).forEach((extract) => {
              this.results.push({
                estonianWord,
                inflectionsAsStr: extract.inflectionsAsStr,
                ruleName: extract.ruleName,
                subRuleName: extract.subRuleName,
                rules: this.ruleSet[extract.ruleName],
              });
            });
          }
        })
        .catch((error) => {
          throw error;
        });
    },
    extractRuleNameAndInflections(html) {
      const $ = cheerio.load(html);
      // Every result comes in wrapped by div.tervikart.
      // However, only one that contains span.grg is the translation and what concerns us.
      const tervikarts = $('.tervikart').filter((i, elm) => $(elm).find('.grg').length) || [];
      if (tervikarts.length) {
        return tervikarts.map((i, tervikart) => {
          // grg example: 26i: h`ea, h`ead, h`easse; h`eade, h`äid, h`eadesse ja h`äisse; keskv parem, üliv kõige parem ja parim
          // We need to extract the ruleName(s) at the beginning and inflections that follow, separated by a comma and space
          const grg = $(tervikart).find('.grg');
          const ruleName = grg.text().match(/\d+/)[0];
          const subRuleName = grg.find('.mt').text();
          const inflectionsAsStr = grg.find('.mvq').first().text().replace(' ja', ',');
          return { ruleName, subRuleName, inflectionsAsStr };
        });
      }
      return [];
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 4em;
  color: #0072ce;
}
.sub-title {
  font-size: 1.4em;
}
.title-small {
  font-size: 1.4em;
  font-weight: bold;
}
.mb-0 {
  margin-bottom: 0;
}
.message {
  height: 1em;
}
form {
  margin-top: 1em;
}
.autocomplete {
  position: relative;
}
.autocomplete-results {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1;
  border: none;
}
.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  overflow: scroll;
  cursor: pointer;
  z-index: 2;
  border-bottom: 1px solid #eeeeee;
  background-color: white;
}
.autocomplete-result.is-active,
.autocomplete-result:hover,
.autocomplete-result:focus {
  background-color: #0072ce;
  color: white;
}
input[type='text']::placeholder {
  color: #bdbdbd;
}
input[type='text']:not(.browser-default) {
  border-bottom: 1px solid #bdbdbd;
  box-shadow: 0 1px 0 0 #bdbdbd;
  color: #bdbdbd;
}
input[type='text']:not(.browser-default):focus:not([readonly]) {
  border-bottom: 1px solid #000000;
  box-shadow: 0 1px 0 0 #000000;
  color: #000000;
}
.footer-notes {
  text-align: left;
}
.strong {
  font-weight: bold;
}
.indent-1em {
  display: inline-block;
  padding-left: 1em;
}
</style>
