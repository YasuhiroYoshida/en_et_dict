<template>
  <div class="result">
    <div class="container">
      <div class="results-header center" v-if="results.length">
        <span>Results</span><br /><small
          ><a :href="linkToQueriableWords" target="_blank">(Usage examples)</a></small
        >
      </div>
      <ul class="collection collapsible" v-for="(result, i) in results" :key="i" ref="i">
        <li class="collection-item estonianWord">
          <span>{{ result.estonianWord }}</span>
        </li>
        <li class="collection-item">
          <span>{{ result.inflectionsAsStr || 'n/a' }}</span>
        </li>
        <li class="collection-item">
          <div class="collapsible-header">
            <i class="material-icons">expand_more</i> Inflection pattern: {{ result.ruleName }}
          </div>
          <div class="collapsible-body" v-html="result.rules.notes"></div>
          <ul>
            <li
              class="collection-item sub-rule"
              v-for="(subRule, j) in result.rules.subRules"
              :key="j"
            >
              <span class="bold" v-if="result.subRuleName === subRule.subRuleName">
                <a :href="urlFor(result.ruleName)" target="_blank">{{ subRule.subRuleName }}</a>
              </span>
              <span v-else>{{ subRule.subRuleName }}</span>
              <span v-for="(inflectionsArray, k) in subRule.inflectionsArray" :key="k">
                Example {{ k + 1 }}: {{ inflectionsArray.join(', ') }}
              </span>
              <span>Comparatives: {{ subRule.comparatives.join(', ') || 'n/a' }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css';

export default {
  name: 'Result',
  props: ['results', 'linkToQueriableWords'],
  data() {
    return {};
  },
  methods: {
    urlFor(ruleName) {
      return `http://www.eki.ee/dict/qs/muuttyybid.html#${ruleName}`;
    },
  },
  updated() {
    const elms = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elms, { accordion: false });
  },
  // computed: {
  //   linkToQueriableWords() {
  //     https://www.eki.ee/dict/ies/index.cgi?F=M&C06=en&C01=1&C02=1&C12=1&C13=1&Q=
  //   }
  // }
};
</script>

<style scoped>
.container {
  width: 40%;
}
.result {
  text-align: left;
}
.results-header {
  font-size: 1.2em;
  /* border-bottom: 1px solid #ddd; */
  margin-bottom: 1em;
  /* padding-bottom: 0.2em; */
}
.collection .collection-item.active {
  background-color: #fff;
  color: #2c3e50;
}
.estonianWord {
  font-weight: bold;
  font-size: 1.2em;
}
.bold {
  font-weight: bold;
}
.sub-rule span {
  display: block;
}
.collapsible {
  margin: 0 0 1em 0;
  padding: 0;
  border: 0;
  border-bottom: 0px solid #ddd;
  box-shadow: none;
}
.collapsible-body {
  padding: 0;
  border-bottom: 0px solid #ddd;
  margin-bottom: 5rem;
}
</style>
